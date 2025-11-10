import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@idgm/lib/src/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const inStock = searchParams.get('inStock') === 'true'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category) {
      // Support both category ID and slug
      const isNumeric = !isNaN(Number(category))
      where.category = isNumeric 
        ? { id: parseInt(category) }
        : { slug: category }
    }
    
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (inStock) {
      where.inventory = {
        quantity: { gt: 0 }
      }
    }

    // Fetch products and total count
    const [products, totalCount, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
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
      
      prisma.product.count({ where }),
      
      // Get categories for filters
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
        }
      })
    ])

    // Get price range for filters
    const priceRange = await prisma.product.aggregate({
      where: { isActive: true },
      _min: { price: true },
      _max: { price: true }
    })

    return NextResponse.json({
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        compareAt: product.compareAt ? Number(product.compareAt) : null,
        currency: product.currency,
        images: product.images,
        category: product.category,
        stock: product.inventory?.quantity || 0,
        threshold: product.inventory?.threshold || 0,
        lowStock: (product.inventory?.quantity || 0) <= (product.inventory?.threshold || 0),
        outOfStock: (product.inventory?.quantity || 0) === 0,
        soldCount: product._count.orderItems,
        discount: product.compareAt 
          ? Math.round(((Number(product.compareAt) - Number(product.price)) / Number(product.compareAt)) * 100)
          : 0,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })),
      
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      
      filters: {
        categories: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          productCount: cat._count.products
        })),
        priceRange: {
          min: Number(priceRange._min.price || 0),
          max: Number(priceRange._max.price || 0)
        }
      },
      
      // Additional metadata
      meta: {
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
        totalProducts: totalCount
      }
    })

  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}