'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import {
  Bars3Icon,
  ChevronDownIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  SparklesIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useCart } from '../contexts/CartContext'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Deals', href: '/#deals' },
  { name: 'Shop', href: '/shop', submenu: ['Agricultural Products', 'Kitchenware', 'Home Essentials', 'Wholesale'] },
  { name: 'Brands', href: '/about' },
  { name: 'Blog', href: '/services' },
  { name: 'Contact', href: '/contact' },
]

const categoryOptions = ['All categories', 'Agriculture', 'Kitchenware', 'Home', 'Real Estate', 'Business']

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const { itemCount } = useCart()

  return (
    <>
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs md:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="flex items-center gap-1.5"><TruckIcon className="h-3.5 w-3.5 text-orange-500" /> Fast delivery across Lagos</span>
            <span className="flex items-center gap-1.5"><ShieldIcon className="h-3.5 w-3.5 text-orange-500" /> Easy returns</span>
            <span className="flex items-center gap-1.5"><PhoneIcon className="h-3.5 w-3.5 text-orange-500" /> Support: +234 800 IDGM</span>
          </div>
          <Link href="/dashboard" className="font-semibold text-orange-300 hover:text-orange-500">Track Order</Link>
        </div>
      </div>

      <header className="bg-white shadow-sm ring-1 ring-gray-200">
        <div className="mx-auto grid max-w-7xl items-center gap-5 px-4 py-5 md:px-8 lg:grid-cols-[minmax(230px,0.8fr)_minmax(400px,1.6fr)_minmax(180px,0.8fr)]">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="IDGM Universal Limited" width={280} height={95} priority className="h-16 w-auto" />
            <span className="hidden text-left xl:block">
              <span className="block text-sm font-black uppercase tracking-wide text-gray-900">IDGM Universal</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide text-orange-500">Agriculture · Kitchenware · Real Estate</span>
            </span>
          </Link>

          <form className="flex h-11 overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-orange-500" action="/shop" method="get">
            <label htmlFor="category-search" className="sr-only">Category</label>
            <select id="category-search" name="category" className="w-40 border-r border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none">
              {categoryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <label htmlFor="site-search" className="sr-only">Search products</label>
            <input id="site-search" name="q" type="search" placeholder="Search products, brands and services" className="min-w-0 flex-1 px-4 text-sm outline-none placeholder:text-gray-500" />
            <button type="submit" aria-label="Search" className="flex w-12 items-center justify-center bg-orange-500 text-white transition hover:bg-orange-600">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>

          <div className="flex items-center justify-end gap-4">
            <Link href={session ? '/dashboard' : '/login'} className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-orange-600">
              <UserCircleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">{session ? 'My Account' : 'Sign in'}</span>
            </Link>
            <Link href="/cart" className="relative flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-orange-600">
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" className="rounded-md p-2 text-gray-700 hover:bg-gray-100 lg:hidden">
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8">
            <Link href="/shop" className="inline-flex shrink-0 items-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600">
              <Bars3Icon className="h-4 w-4" /> All Categories
            </Link>
            <nav className="hidden flex-1 items-center gap-6 lg:flex" aria-label="Main navigation">
              {navigation.map((item) => (
                <div key={item.name} className="group relative">
                  <Link href={item.href} className="flex items-center gap-1 text-sm font-semibold text-gray-700 transition hover:text-orange-600">
                    {item.name}
                    {item.submenu && <ChevronDownIcon className="h-4 w-4 transition group-hover:rotate-180" />}
                  </Link>
                  {item.submenu && (
                    <div className="invisible absolute left-0 top-full z-50 mt-2 min-w-48 translate-y-1 rounded-lg border border-gray-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      {item.submenu.map((subitem) => (
                        <Link key={subitem} href="/shop" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600">
                          {subitem}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <Link href="/shop" className="ml-auto hidden items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700 transition hover:bg-orange-500 hover:text-white sm:inline-flex">
              <SparklesIcon className="h-4 w-4" /> Hot Offers
            </Link>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-black uppercase text-gray-900">IDGM Universal</span>
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="rounded-md p-2 hover:bg-gray-100"><XMarkIcon className="h-6 w-6" /></button>
            </div>
            <div className="mt-6 space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between rounded-lg px-3 py-3 font-semibold text-gray-800 hover:bg-gray-50 hover:text-orange-600">
                  {item.name}<ArrowRightIcon className="h-4 w-4" />
                </Link>
              ))}
            </div>
            <div className="mt-6 border-t border-gray-200 pt-5">
              {session ? (
                <button onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }) }} className="w-full rounded-md bg-gray-900 px-4 py-3 text-left font-bold text-white">Sign out</button>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block rounded-md bg-orange-500 px-4 py-3 text-center font-bold text-white">Sign in</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function TruckIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>
}

function ShieldIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
}

function PhoneIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.92Z"/></svg>
}

function ArrowRightIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
}
