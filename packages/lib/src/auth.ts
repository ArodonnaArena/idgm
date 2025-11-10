import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { API_BASE } from './api'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null
          // Prefer backend to validate and issue token
          try {
            // Helpful debug: show which backend URL and email we're calling (no password logged)
            try {
              console.debug(`authorize() will POST to ${API_BASE}/auth/login for email=${credentials.email}`)
            } catch (e) {
              // ignore logging errors
            }
            const res = await fetch(`${API_BASE}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: credentials.email, password: credentials.password }),
            })
            if (res.ok) {
              const data = await res.json()
              const roles = (data?.user?.roles as string[]) || []
              return {
                id: data?.user?.id || '',
                email: data?.user?.email || credentials.email,
                name: data?.user?.name || undefined,
                roles: roles as any,
                accessToken: data?.accessToken,
              }
            } else {
              // Log response details to help debug 401/403 from backend
              let bodyText = ''
              try {
                bodyText = await res.text()
              } catch (e) {
                bodyText = '<unreadable body>'
              }
              console.error(`Backend /auth/login returned ${res.status}: ${res.statusText} - ${bodyText}`)
            }
          } catch (e) {
            console.error('Backend login failed (fetch error):', e)
          }
          // Fallback to Prisma check if backend not reachable
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { roles: { include: { role: true } } },
          })
          if (!user || !user.passwordHash) return null
          const ok = await bcrypt.compare(credentials.password, user.passwordHash)
          if (!ok) return null
          const roles = (user.roles || []).map((r) => r.role.name)
          return { id: user.id, email: user.email, name: user.name || undefined, roles: roles as any }
        } catch (err) {
          console.error('authorize() error:', err)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        ;(token as any).roles = (user as any).roles || (token as any).roles || []
        ;(token as any).accessToken = (user as any).accessToken || (token as any).accessToken
      }
      // If token has no roles yet and we can fetch user, hydrate
      if (!(token as any).roles && (token as any).sub) {
        const u = await prisma.user.findUnique({ where: { id: (token as any).sub }, include: { roles: { include: { role: true } } } })
        ;(token as any).roles = u?.roles.map(r => r.role.name) || []
      }
      return token
    },
    async session({ session, token }) {
      ;(session as any).user = { ...(session as any).user, id: (token as any).sub, roles: (token as any).roles || [] }
      ;(session as any).accessToken = (token as any).accessToken || null
      return session
    }
  }
}
