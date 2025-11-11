export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const role = searchParams.get('role')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status.toUpperCase()
    }
    
    if (role) {
      where.roles = {
        some: {
          role: {
            name: { contains: role, mode: 'insensitive' }
          }
        }
      }
    }
    
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }

    // Fetch users and total count
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          roles: {
            include: {
              role: {
                select: {
                  name: true,
                  description: true
                }
              }
            }
          },
          tenantProfile: {
            select: {
              nin: true,
              phoneAlt: true
            }
          },
          landlordProfile: {
            select: {
              company: true
            }
          },
          staffProfile: {
            select: {
              roleNote: true
            }
          },
          orders: {
            select: {
              id: true,
              total: true,
              status: true,
              createdAt: true
            },
            take: 5,
            orderBy: { createdAt: 'desc' }
          },
          tickets: {
            select: {
              id: true,
              status: true
            }
          },
          _count: {
            select: {
              orders: true,
              tickets: true,
              carts: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    // Get filter options
    const [statusCounts, roleCounts] = await Promise.all([
      prisma.user.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.role.findMany({
        select: {
          name: true,
          _count: {
            select: {
              users: true
            }
          }
        }
      })
    ])

    return NextResponse.json({
      users: users.map(user => ({
        ...user,
        roles: user.roles.map(ur => ur.role.name),
        roleDescriptions: user.roles.map(ur => ur.role.description).filter(Boolean),
        totalSpent: user.orders.reduce((sum, order) => sum + Number(order.total), 0),
        activeTickets: user.tickets.filter(t => ['OPEN', 'IN_PROGRESS'].includes(t.status)).length,
        lastOrderDate: user.orders[0]?.createdAt || null,
        profileType: user.tenantProfile ? 'Tenant' : user.landlordProfile ? 'Landlord' : user.staffProfile ? 'Staff' : 'Customer'
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      filters: {
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item.status.toLowerCase()] = item._count.status
          return acc
        }, {} as Record<string, number>),
        roles: roleCounts.map(role => ({
          name: role.name,
          count: role._count.users
        }))
      }
    })

  } catch (error) {
    console.error('Users API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, status, roleIds } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    
    if (status) {
      const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED']
      if (!validStatuses.includes(status.toUpperCase())) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        )
      }
      updateData.status = status.toUpperCase()
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        roles: {
          include: {
            role: {
              select: {
                name: true,
                description: true
              }
            }
          }
        }
      }
    })

    // Update roles if provided
    if (roleIds && Array.isArray(roleIds)) {
      // Remove existing roles
      await prisma.userRole.deleteMany({
        where: { userId }
      })

      // Add new roles
      if (roleIds.length > 0) {
        await prisma.userRole.createMany({
          data: (roleIds as Array<string | number>).map((roleId) => ({
            userId,
            roleId: String(roleId),
          })),
        })
      }
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        ...user,
        roles: user.roles.map(ur => ur.role.name)
      }
    })

  } catch (error) {
    console.error('Update User API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}