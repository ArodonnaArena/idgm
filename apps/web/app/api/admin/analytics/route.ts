export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    const type = searchParams.get('type') || 'overview'

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Previous period for comparisons
    const prevStartDate = new Date(startDate)
    prevStartDate.setTime(2 * startDate.getTime() - now.getTime())

    if (type === 'revenue') {
      const [currentAgg, prevAgg] = await Promise.all([
        prisma.payment.aggregate({
          where: { status: 'SUCCESS', createdAt: { gte: startDate, lte: now } },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.payment.aggregate({
          where: { status: 'SUCCESS', createdAt: { gte: prevStartDate, lt: startDate } },
          _sum: { amount: true },
          _count: true,
        }),
      ])

      return NextResponse.json({
        type: 'revenue',
        period,
        dailyRevenue: [],
        revenueByCategory: [],
        paymentMethods: [],
        comparison: {
          current_revenue: Number(currentAgg._sum.amount || 0),
          previous_revenue: Number(prevAgg._sum.amount || 0),
        },
      })
    }

    if (type === 'products') {
      return NextResponse.json({
        type: 'products',
        period,
        topProducts: [],
        categoryPerformance: [],
        inventoryAlerts: [],
        trends: [],
      })
    }

    if (type === 'properties') {
      return NextResponse.json({
        type: 'properties',
        period,
        occupancyStats: [],
        revenueByProperty: [],
        maintenanceStats: [],
        leaseExpirations: [],
      })
    }

    // Default: Overview Analytics (no raw SQL)
    const [revenueOverview, orderStats, recentOrders] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: 'SUCCESS', createdAt: { gte: startDate, lte: now } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.order.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startDate, lte: now } },
        _count: { status: true },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: startDate } },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, createdAt: true, total: true },
      }),
    ])

    return NextResponse.json({
      type: 'overview',
      period,
      revenue: {
        total: Number(revenueOverview._sum.amount || 0),
        transactions: revenueOverview._count,
      },
      orders: orderStats.reduce((acc, stat) => {
        acc[stat.status.toLowerCase()] = {
          count: stat._count.status,
          value: Number(stat._sum.total || 0),
        }
        return acc
      }, {} as Record<string, { count: number; value: number }>),
      userGrowth: [],
      topCategories: [],
      recentActivity: recentOrders.map((o) => ({
        type: 'order',
        id: o.id,
        createdAt: o.createdAt,
        amount: Number(o.total || 0),
      })),
    })
  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
  }
}
