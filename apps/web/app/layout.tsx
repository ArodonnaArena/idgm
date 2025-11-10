import '../styles/globals.css'
import type { ReactNode } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import SessionProvider from '../components/SessionProvider'
import { CartProvider } from '../components/CartProvider'

export const metadata = {
  title: 'IDGM Universal Limited - Agriculture, Kitchenware & Real Estate',
  description: 'Premier Nigerian company specializing in agricultural products, kitchenware, and comprehensive estate management services.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-white text-gray-900">
        <SessionProvider>
          <CartProvider>
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
