import Link from 'next/link'
import { ShoppingCartIcon, StarIcon, TagIcon, FireIcon } from '@heroicons/react/24/outline'
import ProductCard from '../../../components/ProductCard'
import { apiClient } from '../../../lib/api-client'

export const metadata = {
  title: 'Shop Products - IDGM Universal Limited',
  description: 'Browse our collection of premium agricultural products and kitchenware.',
}

// Force this page to always render dynamically so it fetches fresh products
export const dynamic = 'force-dynamic'

function categoryImage(slug?: string, name?: string) {
  const key = (slug || name || '').toLowerCase()
  const map: Record<string, string> = {
    agriculture: '/images/agriculture-rice.jpeg',
    grains: '/images/agriculture-rice.jpeg',
    'grains-cereals': '/images/agriculture-rice.jpeg',
    'fresh-produce': 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1200&auto=format&fit=crop',
    produce: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    kitchenware: '/images/kitchenware-cutlery.jpeg',
    utensils: '/images/kitchenware-cutlery.jpeg',
    'real-estate': '/images/real-estate-keys.jpeg',
    property: '/images/real-estate-keys.jpeg',
    realestate: '/images/real-estate-keys.jpeg',
  }
  for (const k of Object.keys(map)) {
    if (key.includes(k)) return map[k]
  }
  return 'https://images.unsplash.com/photo-1498575207490-3e4e0c5a2be1?q=80&w=1200&auto=format&fit=crop'
}

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  const params: { skip: number; take: number; search?: string; categoryId?: string } = {
    skip: 0,
    take: 24,
  }
  if (searchParams?.category) {
    params.categoryId = searchParams.category
  }

  console.log('ProductsPage: Fetching products from backend with params', params)

  let data: any = { products: [], total: 0, filters: { categories: [] } }
  try {
    const res: any = await apiClient.getProducts(params)
    data = {
      products: res?.products || [],
      total: res?.total || 0,
      // Backend may not yet return filters/categories; default to empty array
      filters: (res as any).filters || { categories: [] },
    }
  } catch (error) {
    console.error('ProductsPage: Error fetching products from backend', error)
  }

  console.log('ProductsPage: Data summary', {
    hasProducts: !!data?.products,
    count: data?.products?.length || 0,
    total: data?.total,
  })

  const products = data.products || []
  const categories = data.filters?.categories || []

  return (
    <div className="bg-white">
      {/* TEMP DEBUG: remove after verification - fixed banner at top */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, background: 'red', color: 'white', padding: '20px', fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
        <div>🔍 DEBUG products.length: {products.length}</div>
        <div>🔍 DEBUG total: {data.total}</div>
        <div>🔍 DEBUG hasProducts: {data.products ? 'YES' : 'NO'}</div>
      </div>

      {/* Jumia-inspired Hero section */}
      <section className="bg-orange-500 text-white">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-black/20 px-6 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold">Shop With Confidence</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Premium Products at Great Prices
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed mb-8">
              Agricultural Products, Quality Kitchenware & More - All in One Place
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 inline-block">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-black">500+</div>
                  <div className="text-sm">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black">24/7</div>
                  <div className="text-sm">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black">Fast</div>
                  <div className="text-sm">Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotion banner */}
      <div className="bg-black text-white py-3 text-center font-bold">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <span className="animate-pulse">🔥</span>
            <span>FLASH SALE: Up to 40% off selected items!</span>
            <span className="animate-pulse">🔥</span>
          </div>
        </div>
      </div>

      {/* Categories - Jumia style */}
      {categories.length > 0 && (
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-800">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link
                href="/shop"
                className="relative group rounded-xl overflow-hidden h-32"
              >
                <img src={categoryImage('all')} alt="All products" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="text-xs opacity-90">All</div>
                  <div className="text-sm font-bold">Products ({products.length})</div>
                </div>
              </Link>
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/shop/products?category=${category.slug}`}
                  className="relative group rounded-xl overflow-hidden h-32"
                >
                  <img src={categoryImage(category.slug, category.name)} alt={category.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="text-xs opacity-90">Category</div>
                    <div className="text-sm font-bold text-center px-2 line-clamp-2">{category.name}</div>
                    <div className="text-[10px] opacity-90 mt-1">{category.productCount ?? 0} items</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products grid - Jumia style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-gray-800">Featured Products</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <span>Showing {products.length} products</span>
              </div>
            </div>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No products available</h3>
              <p className="mt-2 text-gray-500">Check back soon for new products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product: any, index: number) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
          
          {/* Load more */}
          <div className="text-center mt-12">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-md font-bold hover:bg-orange-600 transition">
              Load More Products
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
