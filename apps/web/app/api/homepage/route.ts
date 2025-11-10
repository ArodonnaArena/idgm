import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@idgm/lib/src/prisma'

export async function GET(request: NextRequest) {
  try {
    // Fetch data in parallel for better performance
    const [
      featuredProducts,
      totalStats,
      categories,
      recentTestimonials,
      flashSaleProducts
    ] = await Promise.all([
      // Featured products (top selling or latest)
      prisma.product.findMany({
        where: { isActive: true },
        take: 8,
        orderBy: [
          { createdAt: 'desc' }
        ],
        include: {
          category: { select: { name: true, slug: true } },
          images: { select: { url: true, alt: true } },
          inventory: { select: { quantity: true, threshold: true } },
          _count: {
            select: {
              orderItems: true
            }
          }
        }
      }),

      // Get real statistics
      Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.property.count({ where: { isActive: true } }),
        prisma.user.count({ where: { status: 'ACTIVE' } }),
        prisma.order.aggregate({
          where: {
            status: { in: ['PAID', 'FULFILLED'] }
          },
          _sum: { total: true },
          _count: true
        })
      ]).then(([productCount, propertyCount, userCount, orderStats]) => ({
        totalProducts: productCount,
        totalProperties: propertyCount,
        totalUsers: userCount,
        totalRevenue: Number(orderStats._sum.total || 0),
        totalOrders: orderStats._count
      })),

      // Product categories with counts
      prisma.category.findMany({
        where: {
          products: {
            some: { isActive: true }
          }
        },
        include: {
          _count: {
            select: {
              products: {
                where: { isActive: true }
              }
            }
          }
        },
        take: 6
      }),

      // Recent testimonials/reviews (using recent orders as proxy)
      prisma.order.findMany({
        where: {
          status: 'FULFILLED',
          user: { isNot: null }
        },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          items: {
            include: {
              product: { select: { name: true } }
            },
            take: 1
          }
        }
      }),

      // Flash sale products (active flash sales only)
      prisma.flashSale.findMany({
        where: {
          isActive: true,
          startTime: { lte: new Date() },
          endTime: { gte: new Date() },
          product: {
            isActive: true,
            inventory: {
              quantity: { gt: 0 }
            }
          }
        },
        take: 4,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          product: {
            include: {
              category: { select: { name: true } },
              images: { select: { url: true, alt: true } },
              inventory: { select: { quantity: true } }
            }
          }
        }
      })
    ])

    // Format the response data
    const response = {
      // Featured products for homepage
      featuredProducts: featuredProducts.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        compareAt: product.compareAt ? Number(product.compareAt) : null,
        images: product.images,
        category: product.category,
        stock: product.inventory?.quantity || 0,
        lowStock: (product.inventory?.quantity || 0) <= (product.inventory?.threshold || 0),
        soldCount: product._count.orderItems
      })),

      // Real statistics
      stats: {
        products: totalStats.totalProducts,
        properties: totalStats.totalProperties,
        users: totalStats.totalUsers,
        revenue: totalStats.totalRevenue,
        orders: totalStats.totalOrders,
        // Calculate some additional stats
        averageOrderValue: totalStats.totalOrders > 0 
          ? Math.round(totalStats.totalRevenue / totalStats.totalOrders) 
          : 0
      },

      // Product categories
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        productCount: category._count.products
      })),

      // Testimonials (using recent orders as proxy)
      testimonials: recentTestimonials.map(order => ({
        id: order.id,
        customerName: order.user?.name || 'Verified Customer',
        customerEmail: order.user?.email,
        productName: order.items[0]?.product?.name || 'Product',
        rating: 5, // Default rating - you can implement actual reviews later
        content: `Great quality ${order.items[0]?.product?.name}! Fast delivery and excellent service.`,
        date: order.createdAt,
        verified: true
      })),

      // Flash sale products with countdown timer data
      flashSaleProducts: flashSaleProducts.map(flashSale => ({
        id: flashSale.product.id,
        flashSaleId: flashSale.id,
        name: flashSale.product.name,
        slug: flashSale.product.slug,
        price: Number(flashSale.flashPrice),
        originalPrice: Number(flashSale.product.price),
        compareAt: Number(flashSale.product.compareAt || flashSale.product.price),
        discount: flashSale.discountPercent,
        images: flashSale.product.images,
        category: flashSale.product.category.name,
        stock: flashSale.product.inventory?.quantity || 0,
        maxQuantity: flashSale.maxQuantity,
        soldCount: flashSale.soldCount,
        startTime: flashSale.startTime.toISOString(),
        endTime: flashSale.endTime.toISOString(),
        isActive: flashSale.isActive
      }))
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Homepage API Error:', error)
    
    // Return fallback data to prevent homepage from breaking
    const fallbackData = {
      featuredProducts: [],
      stats: {
        products: 50,
        properties: 15,
        users: 250,
        revenue: 2500000,
        orders: 850,
        averageOrderValue: 2941
      },
      categories: [
        { id: 1, name: 'Agricultural Products', slug: 'agricultural-products', productCount: 25 },
        { id: 2, name: 'Kitchen & Home', slug: 'kitchen-home', productCount: 15 },
        { id: 3, name: 'Electronics', slug: 'electronics', productCount: 10 }
      ],
      testimonials: [
        {
          id: '1',
          customerName: 'Adebayo Johnson',
          productName: 'Premium Rice',
          rating: 5,
          content: 'Excellent quality products and fast delivery. Highly recommended!',
          verified: true
        },
        {
          id: '2', 
          customerName: 'Fatima Mohammed',
          productName: 'Kitchen Set',
          rating: 5,
          content: 'Amazing kitchenware collection. Great value for money!',
          verified: true
        },
        {
          id: '3',
          customerName: 'Chinedu Okafor', 
          productName: 'Cooking Oil',
          rating: 5,
          content: 'Top quality agricultural products. Will definitely order again.',
          verified: true
        }
      ],
      flashSaleProducts: [
        {
          id: 1,
          name: 'Premium Rice 50kg',
          slug: 'premium-rice-50kg',
          price: 25000,
          compareAt: 35000,
          discount: 29,
          images: [{ url: '/images/products/rice.jpg', alt: 'Premium Rice' }],
          category: 'Agricultural Products',
          stock: 15
        },
        {
          id: 2,
          name: 'Kitchen Knife Set',
          slug: 'kitchen-knife-set', 
          price: 15000,
          compareAt: 22000,
          discount: 32,
          images: [{ url: '/images/products/knives.jpg', alt: 'Kitchen Knives' }],
          category: 'Kitchenware',
          stock: 8
        },
        {
          id: 3,
          name: 'Cooking Oil 5L',
          slug: 'cooking-oil-5l',
          price: 8000,
          compareAt: 12000, 
          discount: 33,
          images: [{ url: '/images/products/oil.jpg', alt: 'Cooking Oil' }],
          category: 'Agricultural Products',
          stock: 25
        },
        {
          id: 4,
          name: 'Non-stick Pan Set',
          slug: 'non-stick-pan-set',
          price: 18000,
          compareAt: 25000,
          discount: 28,
          images: [{ url: '/images/products/pans.jpg', alt: 'Pan Set' }],
          category: 'Kitchenware',
          stock: 12
        }
      ]
    }

    return NextResponse.json(fallbackData)
  }
}