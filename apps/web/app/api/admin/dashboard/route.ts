export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    // Calculate date range based on period
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case '24h':
        startDate.setHours(now.getHours() - 24)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
      default:
        startDate.setDate(now.getDate() - 30)
        break
    }

    // Get previous period for comparison
    const prevStartDate = new Date(startDate)
    const diffMs = now.getTime() - startDate.getTime()
    prevStartDate.setTime(startDate.getTime() - diffMs)

    // Fetch current period stats
    const [
      currentRevenue,
      prevRevenue,
      currentOrders,
      prevOrders,
      totalProducts,
      totalProperties,
      activeUsers,
      pendingTickets,
      recentOrders,
      recentProperties
    ] = await Promise.all([
      // Current revenue
      prisma.payment.aggregate({
        where: {
          status: 'SUCCESS',
          createdAt: { gte: startDate }
        },
        _sum: { amount: true }
      }),
      
      // Previous period revenue
      prisma.payment.aggregate({
        where: {
          status: 'SUCCESS',
          createdAt: { gte: prevStartDate, lt: startDate }
        },
        _sum: { amount: true }
      }),
      
      // Current orders
      prisma.order.count({
        where: { createdAt: { gte: startDate } }
      }),
      
      // Previous period orders
      prisma.order.count({
        where: { createdAt: { gte: prevStartDate, lt: startDate } }
      }),
      
      // Total products
      prisma.product.count({
        where: { isActive: true }
      }),
      
      // Total properties
      prisma.property.count({
        where: { isActive: true }
      }),
      
      // Active users
      prisma.user.count({
        where: { 
          status: 'ACTIVE',
          createdAt: { gte: startDate }
        }
      }),
      
      // Pending tickets
      prisma.maintenanceTicket.count({
        where: { 
          status: { in: ['OPEN', 'IN_PROGRESS'] }
        }
      }),
      
      // Recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          payment: { select: { status: true } }
        }
      }),
      
      // Recent properties
      prisma.property.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          units: {
            select: {
              rent: true,
              status: true
            }
          }
        }
      })
    ])

    // Calculate changes
    const totalRevenue = Number(currentRevenue._sum.amount || 0)
    const prevTotalRevenue = Number(prevRevenue._sum.amount || 0)
    const revenueChange = prevTotalRevenue > 0 
      ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 
      : 100

    const ordersChange = prevOrders > 0 
      ? ((currentOrders - prevOrders) / prevOrders) * 100 
      : 100

    const stats = {
      totalRevenue,
      revenueChange: Math.round(revenueChange * 10) / 10,
      totalOrders: currentOrders,
      ordersChange: Math.round(ordersChange * 10) / 10,
      totalProducts,
      productsChange: 0, // Would need product history tracking
      totalProperties,
      propertiesChange: 0, // Would need property history tracking
      activeUsers,
      usersChange: 0, // Would need user history tracking
      pendingTickets,
      ticketsChange: 0, // Would need ticket history tracking
    }

    // Format recent data
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      customer: order.user?.name || order.user?.email || 'Guest',
      amount: Number(order.total),
      status: order.payment?.status?.toLowerCase() || order.status.toLowerCase(),
      date: order.createdAt.toISOString().split('T')[0]
    }))

    const formattedRecentProperties = recentProperties.map(property => ({
      id: property.id,
      title: property.title,
      type: property.type,
      rent: property.units[0]?.rent ? Number(property.units[0].rent) : Number(property.price || 0),
      price: Number(property.price || 0),
      status: property.units[0]?.status?.toLowerCase() || 'available'
    }))

    return NextResponse.json({
      stats,
      recentOrders: formattedRecentOrders,
      recentProperties: formattedRecentProperties
    })

  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}