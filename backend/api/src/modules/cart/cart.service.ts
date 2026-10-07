import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma as supabase } from '../../../../../packages/lib/src/prisma'
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto'
import { DEFAULT_DELIVERY_RULES, quoteDelivery } from './delivery-engine'

@Injectable()
export class CartService {
  private readonly prisma = supabase

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true, category: true, inventory: true },
            },
          },
        },
      },
    })

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: true, category: true, inventory: true },
              },
            },
          },
        },
      })
    }

    return cart
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId)
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const hasFreeShippingProduct = cart.items.some((ci) => ci.product?.isBulky !== undefined && ci.product.hasFreeShipping)

    const deliveryQuote = quoteDelivery(DEFAULT_DELIVERY_RULES, {
      cart: {
        subtotalNgn: subtotal,
        items: cart.items.map((ci) => ({
          quantity: ci.quantity,
          grossWeightKg: ci.product.grossWeightKg ?? undefined,
          lengthCm: ci.product.lengthCm ?? undefined,
          widthCm: ci.product.widthCm ?? undefined,
          heightCm: ci.product.heightCm ?? undefined,
          maxDimensionCm: ci.product.maxDimensionCm ?? undefined,
          isBulky: ci.product.isBulky ?? undefined,
        })),
      },
      // No per-cart address selection yet; use a simple country-level rule set.
      address: undefined,
      paymentMethod: null,
      hasFreeShippingProduct,
      requestedAt: new Date(),
    })

    return {
      ...cart,
      total: deliveryQuote.subtotalNgn,
      deliveryFee: deliveryQuote.deliveryFeeNgn,
      grandTotal: deliveryQuote.grandTotalNgn,
      deliveryMeta: {
        appliedRules: deliveryQuote.appliedRules,
        priceBreakdown: deliveryQuote.priceBreakdown,
        etaMinutes: deliveryQuote.etaMinutes,
        tags: deliveryQuote.tags,
        effectiveWeightKg: deliveryQuote.effectiveWeightKg,
      },
    }
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const quantity = dto.quantity && dto.quantity > 0 ? dto.quantity : 1

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { inventory: true },
    })
    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or inactive')
    }

    const cart = await this.getOrCreateCart(userId)

    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.productId },
    })

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          price: product.price,
        },
      })
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity,
          price: product.price,
        },
      })
    }

    return this.getCart(userId)
  }

  async updateItem(userId: string, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(userId)

    const item = await this.prisma.cartItem.findFirst({
      where: { id: dto.itemId, cartId: cart.id },
      include: { product: true },
    })
    if (!item) {
      throw new NotFoundException('Cart item not found')
    }

    if (dto.quantity <= 0) {
      await this.prisma.cartItem.delete({ where: { id: item.id } })
    } else {
      await this.prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: dto.quantity },
      })
    }

    return this.getCart(userId)
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId)
    const item = await this.prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } })
    if (!item) {
      throw new NotFoundException('Cart item not found')
    }

    await this.prisma.cartItem.delete({ where: { id: item.id } })
    return this.getCart(userId)
  }
}
