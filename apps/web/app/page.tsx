'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Bars3Icon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  FireIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  SparklesIcon,
  StarIcon,
  TruckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import FlashSaleCountdown from '../components/FlashSaleCountdown'
import { Price } from '../components/Currency'
import ProductCard from '../components/ProductCard'
import { apiUrl } from '../lib/api'

interface HomepageData {
  featuredProducts: Array<{
    id: string
    name: string
    slug: string
    price: number
    compareAt?: number
    images: Array<{ url: string; alt?: string }>
    category: { name: string; slug: string }
    stock: number
    lowStock: boolean
    soldCount: number
  }>
  stats: {
    products: number
    properties: number
    users: number
    revenue: number
    orders: number
    averageOrderValue: number
  }
  categories: Array<{
    id: number
    name: string
    slug: string
    productCount: number
  }>
  testimonials: Array<{
    id: string
    customerName: string
    productName: string
    rating: number
    content: string
    verified: boolean
  }>
  flashSaleProducts: Array<{
    id: number
    flashSaleId: string
    name: string
    slug: string
    price: number
    originalPrice: number
    compareAt: number
    discount: number
    images: Array<{ url: string; alt?: string }>
    category: string
    stock: number
    maxQuantity?: number | null
    soldCount: number
    startTime: string
    endTime: string
    isActive: boolean
  }>
}

const categoryNavigation = [
  { name: 'Agricultural Products', icon: ShoppingBagIcon, href: '/shop?category=agricultural-products' },
  { name: 'Kitchenware', icon: HomeIcon, href: '/shop?category=kitchenware' },
  { name: 'Real Estate', icon: BuildingOfficeIcon, href: '/properties' },
  { name: 'Property Management', icon: ShieldCheckIcon, href: '/services' },
  { name: 'Wholesale', icon: ClipboardDocumentCheckIcon, href: '/shop' },
]

const featureItems = [
  { title: 'Fast Delivery', subtitle: 'Reliable delivery across Lagos', icon: TruckIcon },
  { title: 'Secure Payment', subtitle: 'Protected checkout transactions', icon: ShieldCheckIcon },
  { title: 'Quality Assured', subtitle: 'Products selected for excellence', icon: CheckCircleIcon },
  { title: 'Customer Support', subtitle: 'Helpful support when you need it', icon: PhoneIcon },
  { title: 'Trusted Quality', subtitle: 'A verified Nigerian business', icon: StarIcon },
]

const categoryThumbnails = [
  { name: 'Agriculture', href: '/shop', label: 'Farm Products' },
  { name: 'Kitchen', href: '/shop', label: 'Kitchenware' },
  { name: 'Home', href: '/shop', label: 'Home Essentials' },
  { name: 'Estate', href: '/properties', label: 'Properties' },
  { name: 'Business', href: '/services', label: 'Business Services' },
  { name: 'Wholesale', href: '/shop', label: 'Bulk Buying' },
]

const topRatedProducts = [
  { id: 'top-1', name: 'Premium Grain Collection', slug: 'premium-grain-collection', price: 24000, compareAt: 30000, images: [{ url: '/images/agriculture-rice.jpeg', alt: 'Premium grain collection' }], category: { name: 'Agriculture' } },
  { id: 'top-2', name: 'Executive Kitchen Set', slug: 'executive-kitchen-set', price: 18500, compareAt: 24000, images: [{ url: '/images/kitchenware-cutlery.jpeg', alt: 'Executive kitchen set' }], category: { name: 'Kitchenware' } },
  { id: 'top-3', name: 'Premium Property Package', slug: 'premium-property-package', price: 48000000, compareAt: 54000000, images: [{ url: '/images/real-estate-keys.jpeg', alt: 'Premium property' }], category: { name: 'Real Estate' } },
  { id: 'top-4', name: 'Quality Rice Selection', slug: 'quality-rice-selection', price: 32000, compareAt: 38000, images: [{ url: '/images/agriculture-rice.jpeg', alt: 'Quality rice' }], category: { name: 'Agriculture' } },
  { id: 'top-5', name: 'Modern Kitchenware Set', slug: 'modern-kitchenware-set', price: 16000, compareAt: 21000, images: [{ url: '/images/kitchenware-cutlery.jpeg', alt: 'Modern kitchenware' }], category: { name: 'Kitchenware' } },
  { id: 'top-6', name: 'Commercial Property', slug: 'commercial-property', price: 65000000, compareAt: 72000000, images: [{ url: '/images/real-estate-keys.jpeg', alt: 'Commercial property' }], category: { name: 'Real Estate' } },
]

const promoCards = [
  {
    eyebrow: 'Featured offer',
    title: 'Shop the best of the season',
    subtitle: 'Quality picks for every home and business.',
    link: 'Explore products',
    href: '/shop',
    image: '/images/agriculture-rice.jpeg',
    imageAlt: 'Agricultural products',
    size: 'lg:col-span-1',
  },
  {
    eyebrow: 'For homeowners',
    title: 'Premium kitchen essentials',
    subtitle: 'Designed for modern Nigerian homes.',
    link: 'Browse kitchenware',
    href: '/shop',
    image: '/images/kitchenware-cutlery.jpeg',
    imageAlt: 'Premium kitchenware',
    size: 'lg:col-span-1',
  },
  {
    eyebrow: 'Invest with confidence',
    title: 'Find your next property',
    subtitle: 'Explore listings, leasing, and management.',
    link: 'View properties',
    href: '/properties',
    image: '/images/real-estate-keys.jpeg',
    imageAlt: 'Real estate property',
    size: 'lg:col-span-1',
  },
]

export default function HomePage() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'featured' | 'bestseller' | 'latest'>('featured')
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setLoading(true)
        const response = await fetch(apiUrl('/api/homepage'))
        if (!response.ok) throw new Error('Failed to fetch homepage data')
        setHomepageData(await response.json())
      } catch (err) {
        console.error('Homepage data fetch error:', err)
        setError('Failed to load homepage data')
      } finally {
        setLoading(false)
      }
    }

    fetchHomepageData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !homepageData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const featuredProducts = homepageData.featuredProducts.slice(0, 8)
  const productGroups = {
    featured: featuredProducts,
    bestseller: [...featuredProducts].reverse(),
    latest: featuredProducts,
  }
  const visibleProducts = productGroups[activeTab]

  return (
    <div className="bg-white text-gray-900">
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="grid gap-5 lg:grid-cols-[200px_minmax(0,1fr)]">
            <aside className="hidden rounded-xl border border-gray-200 bg-gray-50 p-3 lg:block">
              <div className="mb-3 flex items-center gap-2 border-b border-gray-200 px-2 pb-3">
                <Bars3Icon className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-gray-800">All Categories</span>
              </div>
              <div className="space-y-1">
                {categoryNavigation.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-white hover:text-orange-600"
                  >
                    <category.icon className="h-5 w-5 shrink-0" />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            </aside>

            <div className="min-w-0 lg:hidden">
              <button
                type="button"
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-bold text-gray-800"
                aria-expanded={categoryMenuOpen}
              >
                All Categories
                <ChevronDownIcon className={`h-5 w-5 text-orange-500 transition ${categoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoryMenuOpen && (
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-md sm:grid-cols-3">
                  {categoryNavigation.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={() => setCategoryMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-3 text-sm font-medium text-gray-700 hover:bg-orange-100 hover:text-orange-700"
                    >
                      <category.icon className="h-4 w-4 text-orange-500" />
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative min-h-[480px] overflow-hidden rounded-xl bg-gray-900">
              <Image
                src="/images/hero-store.jpg"
                alt="IDGM Universal Limited shopping experience"
                fill
                priority
                className="object-cover opacity-60"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
              <div className="relative z-10 flex min-h-[480px] items-center px-6 py-12 sm:px-10 lg:px-14">
                <div className="max-w-2xl text-white">
                  <p className="mb-4 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold">
                    Welcome to IDGM Universal
                  </p>
                  <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                    Your One-Stop Shop for Excellence
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-200 sm:text-lg">
                    Agricultural products, premium kitchenware, and professional real estate solutions—all supplied with trust and quality.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                    >
                      Shop Now <ShoppingCartIcon className="h-5 w-5" />
                    </Link>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-gray-900 transition hover:bg-gray-100"
                    >
                      Our Services <ArrowRightIcon className="h-5 w-5" />
                    </Link>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-200">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                      <CheckCircleIcon className="h-4 w-4 text-orange-500" /> Verified Business
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                      <TruckIcon className="h-4 w-4 text-orange-500" /> Fast Delivery
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2">
                  {[0, 1, 2].map((dot) => (
                    <span key={dot} className={`h-2 rounded-full ${dot === 0 ? 'w-8 bg-orange-500' : 'w-2 bg-white/40'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl overflow-x-auto rounded-xl bg-white p-4 shadow-sm sm:p-5">
          <div className="grid min-w-[700px] grid-cols-5 gap-3">
            {featureItems.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{feature.title}</h3>
                  <p className="mt-1 text-xs leading-tight text-gray-500">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl bg-orange-500 p-6 text-white shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wide text-orange-100">Limited offer</span>
              <h2 className="mt-3 text-2xl font-black">Fresh bargains for every buyer</h2>
              <p className="mt-3 text-sm text-orange-100">Save on quality products and selected real estate opportunities.</p>
              <Link href="/shop" className="mt-5 inline-flex rounded-md bg-black px-4 py-2 text-sm font-bold text-white hover:bg-gray-800">
                Shop offer <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-orange-600">Deal of the Day</p>
                  <h2 className="mt-2 text-xl font-black text-gray-900">Limited-time value</h2>
                </div>
                <ClockIcon className="h-6 w-6 text-orange-500" />
              </div>
              <div className="mt-5 rounded-lg bg-white p-4 shadow-sm">
                <div className="h-40 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={featuredProducts[0]?.images[0]?.url || '/images/agriculture-rice.jpeg'}
                    alt={featuredProducts[0]?.name || 'Featured product'}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-4 font-bold text-gray-800">{featuredProducts[0]?.name || 'Featured Product'}</h3>
                <div className="mt-2 flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, index) => <StarIcon key={index} className="h-4 w-4 fill-current" />)}
                  <span className="ml-1 text-xs text-gray-500">4.8</span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-xl font-black text-orange-500">
                    <Price amount={Number(featuredProducts[0]?.price || 0)} />
                  </span>
                  {featuredProducts[0]?.compareAt && (
                    <span className="text-sm text-gray-400 line-through">
                      <Price amount={Number(featuredProducts[0].compareAt)} />
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-orange-100 p-3 text-xs font-semibold text-orange-700">
                  <FlashSaleCountdown endTime="2026-10-07T23:59:59Z" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-orange-600">Shop the collection</p>
                <h2 className="mt-2 text-3xl font-black text-gray-900">Popular products</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-gray-200 bg-white p-1">
                  {(['featured', 'bestseller', 'latest'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-md px-3 py-2 text-sm font-semibold capitalize transition ${activeTab === tab ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button type="button" aria-label="Previous products" className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500">
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <button type="button" aria-label="Next products" className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500">
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {visibleProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.slice(0, 8).map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
                Products will be available shortly.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-orange-600">Featured offers</p>
              <h2 className="mt-2 text-3xl font-black text-gray-900">More value for your day</h2>
            </div>
            <Link href="/shop" className="hidden items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 sm:flex">
              View all <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {promoCards.map((promo) => (
              <Link
                key={promo.title}
                href={promo.href}
                className="group relative min-h-[280px] overflow-hidden rounded-xl bg-gray-900 text-white shadow-sm"
              >
                <Image
                  src={promo.image}
                  alt={promo.imageAlt}
                  fill
                  className="object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-end p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-orange-300">{promo.eyebrow}</p>
                  <h3 className="mt-2 text-2xl font-black">{promo.title}</h3>
                  <p className="mt-2 text-sm text-gray-200">{promo.subtitle}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-bold text-white">
                    {promo.link} <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-orange-600">Explore our range</p>
              <h2 className="mt-2 text-3xl font-black text-gray-900">Shop by category</h2>
            </div>
            <Link href="/shop" className="hidden items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 sm:flex">
              View all <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex snap-x gap-4 overflow-x-auto pb-2">
            {categoryThumbnails.map((category, index) => (
              <Link
                key={category.name}
                href={category.href}
                className="group flex min-w-[130px] snap-start flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-5 text-center transition hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-md"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                  {index === 0 && <ShoppingBagIcon className="h-10 w-10" />}
                  {index === 1 && <HomeIcon className="h-10 w-10" />}
                  {index === 2 && <SparklesIcon className="h-10 w-10" />}
                  {index === 3 && <BuildingOfficeIcon className="h-10 w-10" />}
                  {index === 4 && <ShieldCheckIcon className="h-10 w-10" />}
                  {index === 5 && <ClipboardDocumentCheckIcon className="h-10 w-10" />}
                </div>
                <span className="mt-4 text-sm font-bold text-gray-800">{category.name}</span>
                <span className="mt-1 text-xs text-gray-500">{category.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-orange-600">Customer favourites</p>
              <h2 className="mt-2 text-3xl font-black text-gray-900">Top rated products</h2>
            </div>
            <Link href="/shop" className="hidden items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 sm:flex">
              View all <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {topRatedProducts.slice(0, 6).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-500 px-4 py-10 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Stay ahead with fresh deals</h2>
            <p className="mt-2 text-sm text-orange-100">Get new products, offers, and updates delivered to your inbox.</p>
          </div>
          <form className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row" action="/api/newsletter" method="POST">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="Enter your email address"
              className="min-w-0 flex-1 rounded-md border border-white/30 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-500 focus:border-black"
            />
            <button type="submit" className="rounded-md bg-black px-6 py-3 font-bold text-white transition hover:bg-gray-800">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
