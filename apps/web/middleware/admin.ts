import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function adminAuthMiddleware(request: NextRequest) {
  try {
    // Get the JWT token
    const token = await getToken({ 
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET 
    })

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin?callbackUrl=/admin', request.url))
    }

    // Check if user has admin role
    const userRoles = (token as any).roles || []
    const hasAdminRole = userRoles.some((role: string) => 
      ['admin', 'super_admin', 'staff'].includes(role.toLowerCase())
    )

    if (!hasAdminRole) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // Allow the request to proceed
    return NextResponse.next()

  } catch (error) {
    console.error('Admin auth middleware error:', error)
    return NextResponse.redirect(new URL('/auth/signin?callbackUrl=/admin', request.url))
  }
}

// Helper function to check if user has specific permissions
export function hasPermission(userRoles: string[], requiredPermission: string): boolean {
  const rolePermissions = {
    super_admin: ['*'], // All permissions
    admin: [
      'dashboard:read',
      'users:read', 'users:write', 'users:delete',
      'products:read', 'products:write', 'products:delete',
      'orders:read', 'orders:write',
      'properties:read', 'properties:write', 'properties:delete',
      'analytics:read'
    ],
    staff: [
      'dashboard:read',
      'products:read', 'products:write',
      'orders:read', 'orders:write',
      'properties:read'
    ],
    landlord: [
      'properties:read', 'properties:write'
    ]
  }

  // Super admin has all permissions
  if (userRoles.includes('super_admin')) {
    return true
  }

  // Check if any user role has the required permission
  return userRoles.some(role => {
    const permissions = rolePermissions[role as keyof typeof rolePermissions] || []
    return permissions.includes('*') || permissions.includes(requiredPermission)
  })
}