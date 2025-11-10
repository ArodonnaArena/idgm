import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@idgm/lib/src/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category) {
      where.categoryId = parseInt(category)
    }
    
    if (status) {
      where.isActive = status === 'active'
    }

    // Fetch products and total count
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: { select: { name: true } },
          images: { select: { url: true, alt: true } },
          inventory: { select: { quantity: true, threshold: true } },
          _count: {
            select: {
              cartItems: true,
              orderItems: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    // Get categories for filter options
    const categories = await prisma.category.findMany({
      select: { id: true, name: true }
    })

    return NextResponse.json({
      products: products.map(product => ({
        ...product,
        price: Number(product.price),
        compareAt: product.compareAt ? Number(product.compareAt) : null,
        totalOrders: product._count.orderItems,
        inCarts: product._count.cartItems,
        stock: product.inventory?.quantity || 0,
        lowStock: (product.inventory?.quantity || 0) <= (product.inventory?.threshold || 0)
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      categories
    })

  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    const requiredFields = ['sku', 'name', 'price', 'categoryId']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Generate slug from name
    const slug = data.name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Check if SKU or slug already exists
    const existing = await prisma.product.findFirst({
      where: {
        OR: [
          { sku: data.sku },
          { slug }
        ]
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Product with this SKU or name already exists' },
        { status: 400 }
      )
    }

    // Create product with images and inventory
    const product = await prisma.product.create({
      data: {
        sku: data.sku,
        slug,
        name: data.name,
        description: data.description,
        price: data.price,
        compareAt: data.compareAt,
        categoryId: data.categoryId,
        attributes: data.attributes,
        isActive: data.isActive ?? true,
        images: data.images ? {
          create: data.images.map((img: any) => ({
            url: img.url,
            alt: img.alt
          }))
        } : undefined,
        inventory: {
          create: {
            quantity: data.inventory?.quantity || 0,
            threshold: data.inventory?.threshold || 0
          }
        }
      },
      include: {
        category: { select: { name: true } },
        images: true,
        inventory: true
      }
    })

    return NextResponse.json({
      ...product,
      price: Number(product.price),
      compareAt: product.compareAt ? Number(product.compareAt) : null
    }, { status: 201 })

  } catch (error) {
    console.error('Create Product API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}