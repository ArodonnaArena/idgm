import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma as supabase } from '../../../../../packages/lib/src/prisma'
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto'

@Injectable()
export class OrdersService {
  private readonly prisma = supabase

  async list(skip = 0, take = 50, status?: string, userId?: string) {
    const where: any = {}
    const allowed = ['PENDING', 'PAID', 'FULFILLED', 'CANCELLED', 'REFUNDED']
    if (status && allowed.includes(status)) where.status = status
    if (userId) where.userId = userId

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        include: { items: { include: { product: true } }, user: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ])

    return { orders, total, skip, take }
  }

  async get(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, user: true, payment: true },
    })
    if (!order) throw new NotFoundException('Order not found')
    return order
  }

  async getOwned(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, user: true, payment: true },
    })
    if (!order || order.userId !== userId) throw new NotFoundException('Order not found')
    return order
  }

  async create(dto: CreateOrderDto, userId: string) {
    const productIds = dto.items.map((item) => item.productId)
    const products = (await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    })) as Array<{ id: string; price: number }>
    const productById = new Map(products.map((product) => [product.id, product]))
    const items = dto.items.map((item) => {
      const product = productById.get(item.productId)
      if (!product) throw new Error(`Unknown product ID: ${item.productId}`)
      return { productId: item.productId, quantity: item.quantity, price: Number(product.price) }
    })
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return this.prisma.order.create({
      data: {
        userId,
        currency: dto.currency || 'NGN',
        total,
        shippingId: dto.shippingId,
        billingId: dto.billingId,
        items: { create: items },
      },
      include: { items: true },
    })
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } })
    if (!order) throw new NotFoundException('Order not found')
    return this.prisma.order.update({ where: { id }, data: { status: dto.status } })
  }
}
