import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { id: { contains: search } },
        { user: { 
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        }}
      ]
    }
    
    if (status) {
      where.status = status.toUpperCase()
    }
    
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }

    // Fetch orders and total count
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: { 
            select: { 
              id: true, 
              name: true, 
              email: true, 
              phone: true 
            } 
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  sku: true,
                  images: { select: { url: true }, take: 1 }
                }
              }
            }
          },
          shipping: true,
          billing: true,
          payment: {
            select: {
              id: true,
              provider: true,
              reference: true,
              status: true,
              amount: true,
              createdAt: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ])

    // Get status counts for filter options
    const statusCounts = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true }
    })

    return NextResponse.json({
      orders: orders.map(order => ({
        ...order,
        total: Number(order.total),
        items: order.items.map(item => ({
          ...item,
          price: Number(item.price)
        })),
        payment: order.payment ? {
          ...order.payment,
          amount: Number(order.payment.amount)
        } : null
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item.status.toLowerCase()] = item._count.status
        return acc
      }, {} as Record<string, number>)
    })

  } catch (error) {
    console.error('Orders API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, status, notes } = await request.json()
    
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      )
    }

    const validStatuses = ['PENDING', 'PAID', 'FULFILLED', 'CANCELLED', 'REFUNDED']
    if (!validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: status.toUpperCase(),
        updatedAt: new Date()
      },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            product: { select: { name: true } }
          }
        },
        payment: { select: { status: true, reference: true } }
      }
    })

    // TODO: Send notification email to customer about status change
    // TODO: Update inventory if status changes to FULFILLED or CANCELLED

    return NextResponse.json({
      ...order,
      total: Number(order.total)
    })

  } catch (error) {
    console.error('Update Order API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}