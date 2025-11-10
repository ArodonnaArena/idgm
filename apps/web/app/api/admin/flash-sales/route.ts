import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@idgm/lib/src/prisma'

// GET - List all flash sales
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const active = searchParams.get('active')

    const where: any = {}
    
    if (active === 'true') {
      where.isActive = true
      where.startTime = { lte: new Date() }
      where.endTime = { gte: new Date() }
    }

    const flashSales = await prisma.flashSale.findMany({
      where,
      include: {
        product: {
          include: {
            category: true,
            images: true,
            inventory: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(flashSales)
  } catch (error) {
    console.error('Flash sales fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flash sales' },
      { status: 500 }
    )
  }
}

// POST - Create a new flash sale
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      productId,
      discountPercent,
      startTime,
      endTime,
      maxQuantity
    } = body

    // Validate required fields
    if (!name || !productId || !discountPercent || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get product to calculate flash price
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate flash price
    const flashPrice = product.price * (1 - discountPercent / 100)

    // Create flash sale
    const flashSale = await prisma.flashSale.create({
      data: {
        name,
        description,
        productId,
        discountPercent: parseInt(discountPercent),
        flashPrice,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        maxQuantity: maxQuantity ? parseInt(maxQuantity) : null,
        isActive: true
      },
      include: {
        product: {
          include: {
            category: true,
            images: true,
            inventory: true
          }
        }
      }
    })

    return NextResponse.json(flashSale, { status: 201 })
  } catch (error) {
    console.error('Flash sale creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create flash sale' },
      { status: 500 }
    )
  }
}
