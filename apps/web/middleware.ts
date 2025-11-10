export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/admin/:path*', '/tenant/:path*', '/landlord/:path*'],
}