import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@idgm/lib/src/prisma'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        },
        cart: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate statistics
    const totalOrders = await prisma.order.count({
      where: { userId: user.id }
    })

    const pendingOrders = await prisma.order.count({
      where: { 
        userId: user.id,
        status: 'PENDING'
      }
    })

    const cartItemsCount = user.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
    
    const cartTotal = user.cart?.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0) || 0

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      stats: {
        totalOrders,
        pendingOrders,
        cartItemsCount,
        cartTotal
      },
      recentOrders: user.orders.map(order => ({
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        itemCount: order.items.length
      })),
      cart: user.cart ? {
        id: user.cart.id,
        itemCount: cartItemsCount,
        total: cartTotal,
        items: user.cart.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            images: item.product.images
          }
        }))
      } : null
    })

  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
