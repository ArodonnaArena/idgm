import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const city = searchParams.get('city')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (type) {
      where.type = type.toUpperCase()
    }
    
    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }
    
    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    // Fetch properties and total count
    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          images: { select: { url: true, alt: true } },
          units: {
            select: {
              id: true,
              label: true,
              bedrooms: true,
              bathrooms: true,
              sizeSqm: true,
              status: true,
              rent: true,
              leases: {
                where: { status: 'ACTIVE' },
                select: { id: true }
              }
            }
          },
          landlord: {
            select: {
              company: true,
              user: {
                select: {
                  name: true,
                  email: true,
                  phone: true
                }
              }
            }
          },
          _count: {
            select: {
              units: true
            }
          }
        }
      }),
      prisma.property.count({ where })
    ])

    // Get filter options
    const [cities, typeCounts] = await Promise.all([
      prisma.property.groupBy({
        by: ['city'],
        _count: { city: true },
        where: { isActive: true }
      }),
      prisma.property.groupBy({
        by: ['type'],
        _count: { type: true },
        where: { isActive: true }
      })
    ])

    return NextResponse.json({
      properties: properties.map(property => ({
        ...property,
        price: property.price ? Number(property.price) : null,
        units: property.units.map(unit => ({
          ...unit,
          rent: unit.rent ? Number(unit.rent) : null,
          isOccupied: unit.leases.length > 0
        })),
        totalUnits: property._count.units,
        occupiedUnits: property.units.filter(unit => unit.leases.length > 0).length,
        availableUnits: property.units.filter(unit => unit.leases.length === 0 && unit.status === 'AVAILABLE').length,
        totalRevenue: property.units.reduce((sum, unit) => {
          if (unit.leases.length > 0 && unit.rent) {
            return sum + Number(unit.rent)
          }
          return sum
        }, 0)
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      filters: {
        cities: cities.map(c => c.city).filter(Boolean),
        types: typeCounts.map(t => ({ type: t.type, count: t._count.type }))
      }
    })

  } catch (error) {
    console.error('Properties API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'type', 'address', 'city', 'state']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Generate slug from title
    const slug = data.title.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Check if slug already exists
    const existing = await prisma.property.findFirst({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Property with this title already exists' },
        { status: 400 }
      )
    }

    // Create property with images and units
    const property = await prisma.property.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        type: data.type.toUpperCase(),
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country || 'NG',
        price: data.price,
        isActive: data.isActive ?? true,
        images: data.images ? {
          create: data.images.map((img: any) => ({
            url: img.url,
            alt: img.alt
          }))
        } : undefined,
        units: data.units ? {
          create: data.units.map((unit: any) => ({
            label: unit.label,
            bedrooms: unit.bedrooms,
            bathrooms: unit.bathrooms,
            sizeSqm: unit.sizeSqm,
            rent: unit.rent,
            status: unit.status || 'AVAILABLE'
          }))
        } : undefined
      },
      include: {
        images: true,
        units: true,
        landlord: {
          select: {
            company: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      ...property,
      price: property.price ? Number(property.price) : null,
      units: property.units.map(unit => ({
        ...unit,
        rent: unit.rent ? Number(unit.rent) : null
      }))
    }, { status: 201 })

  } catch (error) {
    console.error('Create Property API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}