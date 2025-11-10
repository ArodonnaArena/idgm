import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@idgm/lib/src/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const availableOnly = searchParams.get('availableOnly') === 'true'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (type) {
      where.type = type.toUpperCase()
    }
    
    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    // Price filtering (for sale properties or rent range)
    if (minPrice || maxPrice) {
      where.OR = [
        // Sale price
        {
          price: {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) })
          }
        },
        // Rent price (through units)
        {
          units: {
            some: {
              rent: {
                ...(minPrice && { gte: parseFloat(minPrice) }),
                ...(maxPrice && { lte: parseFloat(maxPrice) })
              }
            }
          }
        }
      ]
    }

    // Bedroom filtering
    if (bedrooms) {
      where.units = {
        some: {
          bedrooms: parseInt(bedrooms)
        }
      }
    }

    // Available only filter
    if (availableOnly) {
      where.units = {
        some: {
          status: 'AVAILABLE',
          leases: {
            none: {
              status: 'ACTIVE'
            }
          }
        }
      }
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
                  phone: true
                }
              }
            }
          }
        }
      }),
      
      prisma.property.count({ where })
    ])

    // Get filter options
    const [cities, typeCounts, priceStats] = await Promise.all([
      // Get unique cities
      prisma.property.groupBy({
        by: ['city'],
        where: { isActive: true },
        _count: { city: true }
      }),
      
      // Get property type counts
      prisma.property.groupBy({
        by: ['type'],
        where: { isActive: true },
        _count: { type: true }
      }),
      
      // Get price range statistics
      Promise.all([
        prisma.property.aggregate({
          where: { isActive: true, price: { not: null } },
          _min: { price: true },
          _max: { price: true }
        }),
        prisma.unit.aggregate({
          where: { 
            property: { isActive: true },
            rent: { not: null }
          },
          _min: { rent: true },
          _max: { rent: true }
        })
      ])
    ])

    return NextResponse.json({
      properties: properties.map(property => {
        const availableUnits = property.units.filter(unit => 
          unit.status === 'AVAILABLE' && unit.leases.length === 0
        )
        const occupiedUnits = property.units.filter(unit => 
          unit.leases.length > 0
        )

        return {
          id: property.id,
          title: property.title,
          slug: property.slug,
          description: property.description,
          type: property.type,
          address: property.address,
          city: property.city,
          state: property.state,
          country: property.country,
          price: property.price ? Number(property.price) : null,
          images: property.images,
          totalUnits: property.units.length,
          availableUnits: availableUnits.length,
          occupiedUnits: occupiedUnits.length,
          units: property.units.map(unit => ({
            id: unit.id,
            label: unit.label,
            bedrooms: unit.bedrooms,
            bathrooms: unit.bathrooms,
            sizeSqm: unit.sizeSqm,
            status: unit.status,
            rent: unit.rent ? Number(unit.rent) : null,
            available: unit.status === 'AVAILABLE' && unit.leases.length === 0
          })),
          landlord: property.landlord,
          // Calculated fields
          minRent: property.units.length > 0 
            ? Math.min(...property.units.filter(u => u.rent).map(u => Number(u.rent!))) 
            : null,
          maxRent: property.units.length > 0 
            ? Math.max(...property.units.filter(u => u.rent).map(u => Number(u.rent!))) 
            : null,
          totalRevenue: property.units.reduce((sum, unit) => {
            return sum + (unit.leases.length > 0 && unit.rent ? Number(unit.rent) : 0)
          }, 0),
          occupancyRate: property.units.length > 0 
            ? Math.round((occupiedUnits.length / property.units.length) * 100) 
            : 0,
          createdAt: property.createdAt,
          updatedAt: property.updatedAt
        }
      }),
      
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      
      filters: {
        cities: cities.map(c => ({
          name: c.city,
          count: c._count.city
        })).filter(c => c.name),
        
        types: typeCounts.map(t => ({
          type: t.type,
          count: t._count.type
        })),
        
        priceRange: {
          salePrice: {
            min: Number(priceStats[0]._min.price || 0),
            max: Number(priceStats[0]._max.price || 0)
          },
          rentPrice: {
            min: Number(priceStats[1]._min.rent || 0),
            max: Number(priceStats[1]._max.rent || 0)
          }
        }
      },
      
      // Additional metadata
      meta: {
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
        totalProperties: totalCount
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