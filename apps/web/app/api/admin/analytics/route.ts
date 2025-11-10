import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@idgm/lib/src/prisma'

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

    if (type === 'revenue') {
      // Revenue Analytics
      const [dailyRevenue, revenueByCategory, paymentMethods, revenueComparison] = await Promise.all([
        // Daily revenue for chart
        prisma.$queryRaw`
          SELECT 
            DATE(createdAt) as date,
            SUM(amount) as revenue,
            COUNT(*) as transactions
          FROM Payment 
          WHERE status = 'SUCCESS' 
            AND createdAt >= ${startDate}
            AND createdAt <= ${now}
          GROUP BY DATE(createdAt)
          ORDER BY date
        `,
        
        // Revenue by product category
        prisma.$queryRaw`
          SELECT 
            c.name as category,
            SUM(oi.price * oi.quantity) as revenue,
            COUNT(DISTINCT o.id) as orders
          FROM OrderItem oi
          JOIN Product p ON oi.productId = p.id
          JOIN Category c ON p.categoryId = c.id
          JOIN \`Order\` o ON oi.orderId = o.id
          WHERE o.createdAt >= ${startDate}
            AND o.createdAt <= ${now}
          GROUP BY c.id, c.name
          ORDER BY revenue DESC
          LIMIT 10
        `,
        
        // Payment methods
        prisma.$queryRaw`
          SELECT 
            provider,
            COUNT(*) as count,
            SUM(amount) as total_amount
          FROM Payment 
          WHERE status = 'SUCCESS'
            AND createdAt >= ${startDate}
            AND createdAt <= ${now}
          GROUP BY provider
          ORDER BY total_amount DESC
        `,
        
        // Revenue comparison with previous period
        prisma.$queryRaw`
          SELECT 
            SUM(CASE WHEN createdAt >= ${startDate} THEN amount ELSE 0 END) as current_revenue,
            SUM(CASE WHEN createdAt < ${startDate} AND createdAt >= DATE_SUB(${startDate}, INTERVAL ${period.replace('d', '')} DAY) THEN amount ELSE 0 END) as previous_revenue
          FROM Payment 
          WHERE status = 'SUCCESS'
            AND createdAt >= DATE_SUB(${startDate}, INTERVAL ${period.replace('d', '')} DAY)
        `
      ])

      return NextResponse.json({
        type: 'revenue',
        period,
        dailyRevenue: (dailyRevenue as any[]).map(row => ({
          date: row.date,
          revenue: Number(row.revenue || 0),
          transactions: Number(row.transactions || 0)
        })),
        revenueByCategory: (revenueByCategory as any[]).map(row => ({
          category: row.category,
          revenue: Number(row.revenue || 0),
          orders: Number(row.orders || 0)
        })),
        paymentMethods: (paymentMethods as any[]).map(row => ({
          provider: row.provider,
          count: Number(row.count || 0),
          amount: Number(row.total_amount || 0)
        })),
        comparison: revenueComparison[0] as any
      })
    }

    if (type === 'products') {
      // Product Analytics
      const [topProducts, categoryPerformance, inventoryAlerts, productTrends] = await Promise.all([
        // Top selling products
        prisma.$queryRaw`
          SELECT 
            p.name,
            p.sku,
            SUM(oi.quantity) as total_sold,
            SUM(oi.price * oi.quantity) as total_revenue,
            COUNT(DISTINCT oi.orderId) as unique_orders
          FROM OrderItem oi
          JOIN Product p ON oi.productId = p.id
          JOIN \`Order\` o ON oi.orderId = o.id
          WHERE o.createdAt >= ${startDate}
            AND o.createdAt <= ${now}
          GROUP BY p.id, p.name, p.sku
          ORDER BY total_sold DESC
          LIMIT 10
        `,
        
        // Category performance
        prisma.$queryRaw`
          SELECT 
            c.name as category,
            COUNT(DISTINCT p.id) as total_products,
            SUM(CASE WHEN p.isActive = 1 THEN 1 ELSE 0 END) as active_products,
            AVG(p.price) as avg_price
          FROM Category c
          LEFT JOIN Product p ON c.id = p.categoryId
          GROUP BY c.id, c.name
          ORDER BY total_products DESC
        `,
        
        // Low stock alerts
        prisma.$queryRaw`
          SELECT 
            p.name,
            p.sku,
            i.quantity,
            i.threshold,
            CASE 
              WHEN i.quantity = 0 THEN 'out_of_stock'
              WHEN i.quantity <= i.threshold THEN 'low_stock'
              ELSE 'in_stock'
            END as status
          FROM Product p
          JOIN Inventory i ON p.id = i.productId
          WHERE i.quantity <= i.threshold
            OR i.quantity = 0
          ORDER BY i.quantity ASC
          LIMIT 20
        `,
        
        // Product creation trends
        prisma.$queryRaw`
          SELECT 
            DATE(createdAt) as date,
            COUNT(*) as products_created
          FROM Product
          WHERE createdAt >= ${startDate}
            AND createdAt <= ${now}
          GROUP BY DATE(createdAt)
          ORDER BY date
        `
      ])

      return NextResponse.json({
        type: 'products',
        period,
        topProducts: (topProducts as any[]).map(row => ({
          name: row.name,
          sku: row.sku,
          totalSold: Number(row.total_sold || 0),
          revenue: Number(row.total_revenue || 0),
          orders: Number(row.unique_orders || 0)
        })),
        categoryPerformance: (categoryPerformance as any[]).map(row => ({
          category: row.category,
          totalProducts: Number(row.total_products || 0),
          activeProducts: Number(row.active_products || 0),
          avgPrice: Number(row.avg_price || 0)
        })),
        inventoryAlerts: (inventoryAlerts as any[]).map(row => ({
          name: row.name,
          sku: row.sku,
          quantity: Number(row.quantity || 0),
          threshold: Number(row.threshold || 0),
          status: row.status
        })),
        trends: (productTrends as any[]).map(row => ({
          date: row.date,
          count: Number(row.products_created || 0)
        }))
      })
    }

    if (type === 'properties') {
      // Property Analytics
      const [occupancyStats, revenueByProperty, maintenanceStats, leaseExpirations] = await Promise.all([
        // Occupancy statistics
        prisma.$queryRaw`
          SELECT 
            p.type,
            COUNT(u.id) as total_units,
            SUM(CASE WHEN u.status = 'OCCUPIED' THEN 1 ELSE 0 END) as occupied_units,
            SUM(CASE WHEN u.status = 'AVAILABLE' THEN 1 ELSE 0 END) as available_units,
            SUM(CASE WHEN u.status = 'MAINTENANCE' THEN 1 ELSE 0 END) as maintenance_units
          FROM Property p
          LEFT JOIN Unit u ON p.id = u.propertyId
          WHERE p.isActive = 1
          GROUP BY p.type
        `,
        
        // Revenue by property
        prisma.$queryRaw`
          SELECT 
            p.title,
            p.type,
            p.city,
            SUM(u.rent) as monthly_revenue,
            COUNT(u.id) as total_units,
            SUM(CASE WHEN EXISTS(SELECT 1 FROM Lease l WHERE l.unitId = u.id AND l.status = 'ACTIVE') THEN 1 ELSE 0 END) as occupied_units
          FROM Property p
          LEFT JOIN Unit u ON p.id = u.propertyId
          WHERE p.isActive = 1
          GROUP BY p.id, p.title, p.type, p.city
          ORDER BY monthly_revenue DESC
          LIMIT 10
        `,
        
        // Maintenance tickets stats
        prisma.$queryRaw`
          SELECT 
            status,
            priority,
            COUNT(*) as count
          FROM MaintenanceTicket
          WHERE createdAt >= ${startDate}
            AND createdAt <= ${now}
          GROUP BY status, priority
          ORDER BY count DESC
        `,
        
        // Upcoming lease expirations
        prisma.$queryRaw`
          SELECT 
            l.endDate,
            p.title as property_title,
            u.label as unit_label,
            l.rent,
            tp.user.email as tenant_email
          FROM Lease l
          JOIN Unit u ON l.unitId = u.id
          JOIN Property p ON u.propertyId = p.id
          JOIN TenantProfile tp ON l.tenantId = tp.id
          WHERE l.status = 'ACTIVE'
            AND l.endDate BETWEEN ${now} AND DATE_ADD(${now}, INTERVAL 30 DAY)
          ORDER BY l.endDate ASC
          LIMIT 20
        `
      ])

      return NextResponse.json({
        type: 'properties',
        period,
        occupancyStats: (occupancyStats as any[]).map(row => ({
          type: row.type,
          totalUnits: Number(row.total_units || 0),
          occupiedUnits: Number(row.occupied_units || 0),
          availableUnits: Number(row.available_units || 0),
          maintenanceUnits: Number(row.maintenance_units || 0)
        })),
        revenueByProperty: (revenueByProperty as any[]).map(row => ({
          title: row.title,
          type: row.type,
          city: row.city,
          monthlyRevenue: Number(row.monthly_revenue || 0),
          totalUnits: Number(row.total_units || 0),
          occupiedUnits: Number(row.occupied_units || 0)
        })),
        maintenanceStats: (maintenanceStats as any[]).map(row => ({
          status: row.status,
          priority: row.priority,
          count: Number(row.count || 0)
        })),
        leaseExpirations: (leaseExpirations as any[]).map(row => ({
          endDate: row.endDate,
          propertyTitle: row.property_title,
          unitLabel: row.unit_label,
          rent: Number(row.rent || 0),
          tenantEmail: row.tenant_email
        }))
      })
    }

    // Default: Overview Analytics
    const [
      revenueOverview,
      orderStats,
      userGrowth,
      topCategories,
      recentActivity
    ] = await Promise.all([
      // Revenue overview
      prisma.payment.aggregate({
        where: {
          status: 'SUCCESS',
          createdAt: { gte: startDate, lte: now }
        },
        _sum: { amount: true },
        _count: true
      }),
      
      // Order statistics
      prisma.order.groupBy({
        by: ['status'],
        where: {
          createdAt: { gte: startDate, lte: now }
        },
        _count: { status: true },
        _sum: { total: true }
      }),
      
      // User growth
      prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as new_users
        FROM User
        WHERE createdAt >= ${startDate}
          AND createdAt <= ${now}
        GROUP BY DATE(createdAt)
        ORDER BY date
      `,
      
      // Top categories by orders
      prisma.$queryRaw`
        SELECT 
          c.name as category,
          COUNT(DISTINCT oi.orderId) as orders,
          SUM(oi.quantity) as items_sold
        FROM OrderItem oi
        JOIN Product p ON oi.productId = p.id
        JOIN Category c ON p.categoryId = c.id
        JOIN \`Order\` o ON oi.orderId = o.id
        WHERE o.createdAt >= ${startDate}
          AND o.createdAt <= ${now}
        GROUP BY c.id, c.name
        ORDER BY orders DESC
        LIMIT 5
      `,
      
      // Recent activity
      prisma.$queryRaw`
        SELECT 
          'order' as type,
          id,
          createdAt,
          total as amount
        FROM \`Order\`
        WHERE createdAt >= ${startDate}
        ORDER BY createdAt DESC
        LIMIT 10
      `
    ])

    return NextResponse.json({
      type: 'overview',
      period,
      revenue: {
        total: Number(revenueOverview._sum.amount || 0),
        transactions: revenueOverview._count
      },
      orders: orderStats.reduce((acc, stat) => {
        acc[stat.status.toLowerCase()] = {
          count: stat._count.status,
          value: Number(stat._sum.total || 0)
        }
        return acc
      }, {} as any),
      userGrowth: (userGrowth as any[]).map(row => ({
        date: row.date,
        newUsers: Number(row.new_users || 0)
      })),
      topCategories: (topCategories as any[]).map(row => ({
        category: row.category,
        orders: Number(row.orders || 0),
        itemsSold: Number(row.items_sold || 0)
      })),
      recentActivity: (recentActivity as any[]).map(row => ({
        type: row.type,
        id: row.id,
        createdAt: row.createdAt,
        amount: Number(row.amount || 0)
      }))
    })

  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}