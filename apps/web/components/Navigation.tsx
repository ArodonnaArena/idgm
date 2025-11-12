'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Bars3Icon, XMarkIcon, UserCircleIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Shop', href: '/shop' },
  { name: 'Properties', href: '/properties' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <Image
              src="/images/logo.png"
              alt="IDGM Universal Ltd"
              width={280}
              height={95}
              priority
              className="h-16 w-auto sm:h-20"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-orange-500 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center space-x-6">
          {session && (
            <>
              <Link href="/wishlist" className="relative text-gray-700 hover:text-orange-600">
                <HeartIcon className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 text-white rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative text-gray-700 hover:text-orange-600">
                <ShoppingCartIcon className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] bg-orange-500 text-white rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                    {itemCount}
                  </span>
                )}
              </Link>
            </>
          )}
          {status === 'loading' ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-orange-500"
              >
                <UserCircleIcon className="h-6 w-6" />
                <span>{session.user?.name || session.user?.email}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-orange-500"
            >
              Sign in <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-10"></div>
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="IDGM Universal Ltd"
                  width={280}
                  height={95}
                  className="h-16 w-auto"
                />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {session && (
                    <div className="flex items-center gap-6 px-3 pt-2">
                      <Link href="/wishlist" className="relative text-gray-700 hover:text-orange-600">
                        <HeartIcon className="h-6 w-6" />
                        {wishlistCount > 0 && (
                          <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 text-white rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                      <Link href="/cart" className="relative text-gray-700 hover:text-orange-600">
                        <ShoppingCartIcon className="h-6 w-6" />
                        {itemCount > 0 && (
                          <span className="absolute -top-2 -right-2 text-[10px] bg-orange-500 text-white rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                            {itemCount}
                          </span>
                        )}
                      </Link>
                    </div>
                  )}
                </div>
                <div className="py-6">
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="-mx-3 block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
