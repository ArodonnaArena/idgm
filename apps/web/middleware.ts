import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect specific routes
  const protectedPaths = ['/admin', '/tenant', '/landlord']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (!isProtectedPath) {
    // Allow all other routes (including /shop, /api/products, etc.)
    return NextResponse.next()
  }

  // Check authentication for protected paths
  const token = await getToken({ 
    req: request as any,
    secret: process.env.NEXTAUTH_SECRET 
  })

  if (!token) {
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
