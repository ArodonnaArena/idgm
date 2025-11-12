import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { apiClient } from '../../../../lib/api-client'

const handler = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        try {
          // Call backend API for authentication
          const response = await apiClient.login({
            email: credentials.email,
            password: credentials.password
          })
          
          // Backend should return user data and token
          if (response && response.user) {
            return {
              id: response.user.id,
              email: response.user.email,
              name: response.user.name,
              accessToken: response.access_token || response.token,
              roles: response.user.roles || []
            } as any
          }
          
          return null
        } catch (error) {
          console.error('Login error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.accessToken = (user as any).accessToken
        // @ts-ignore
        token.roles = (user as any).roles || []
        // @ts-ignore
        token.id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user.roles = (token as any).roles || []
      // @ts-ignore
      session.user.id = (token as any).id
      // @ts-ignore
      session.accessToken = (token as any).accessToken
      return session
    },
  },
})

export { handler as GET, handler as POST }