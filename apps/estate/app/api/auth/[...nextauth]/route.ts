import NextAuth from 'next-auth'
import { authOptions } from '@idgm/lib/src/auth'
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }