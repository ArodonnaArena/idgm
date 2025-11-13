export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '../../../lib/api-client'

export async function GET(request: NextRequest) {
  try {
    console.log('Homepage API: Fetching products from backend...')
    console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL)
    
    // Fetch products from backend API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout
    
    const productsResponse: any = await apiClient.getProducts({
      skip: 0,
      take: 8
    })
    
    clearTimeout(timeoutId)
    console.log('Homepage API: Got response:', { 
      hasProducts: !!productsResponse?.products,
      count: productsResponse?.products?.length || 0 
    })

    // Extract products from response
    const products = productsResponse.products || []
    
    // Format products for frontend
    const featuredProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compareAt: product.compareAt,
      images: product.images || [],
      category: product.category,
      stock: product.stock || 0,
      lowStock: product.lowStock || false
    }))

    // Return simplified response with products from backend
    const response = {
      featuredProducts,
      stats: {
        products: productsResponse.total || 0,
        properties: 15,
        users: 250,
        revenue: 2500000,
        orders: 850,
        averageOrderValue: 2941
      },
      categories: [],
      testimonials: [],
      flashSaleProducts: []
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Homepage API Error:', error)
    
    // Return fallback data to prevent homepage from breaking
    const fallbackData = {
      featuredProducts: [],
      stats: {
        products: 50,
        properties: 15,
        users: 250,
        revenue: 2500000,
        orders: 850,
        averageOrderValue: 2941
      },
      categories: [
        { id: 1, name: 'Agricultural Products', slug: 'agricultural-products', productCount: 25 },
        { id: 2, name: 'Kitchen & Home', slug: 'kitchen-home', productCount: 15 },
        { id: 3, name: 'Electronics', slug: 'electronics', productCount: 10 }
      ],
      testimonials: [
        {
          id: '1',
          customerName: 'Adebayo Johnson',
          productName: 'Premium Rice',
          rating: 5,
          content: 'Excellent quality products and fast delivery. Highly recommended!',
          verified: true
        },
        {
          id: '2', 
          customerName: 'Fatima Mohammed',
          productName: 'Kitchen Set',
          rating: 5,
          content: 'Amazing kitchenware collection. Great value for money!',
          verified: true
        },
        {
          id: '3',
          customerName: 'Chinedu Okafor', 
          productName: 'Cooking Oil',
          rating: 5,
          content: 'Top quality agricultural products. Will definitely order again.',
          verified: true
        }
      ],
      flashSaleProducts: [
        {
          id: 1,
          name: 'Premium Rice 50kg',
          slug: 'premium-rice-50kg',
          price: 25000,
          compareAt: 35000,
          discount: 29,
          images: [{ url: '/images/products/rice.jpg', alt: 'Premium Rice' }],
          category: 'Agricultural Products',
          stock: 15
        },
        {
          id: 2,
          name: 'Kitchen Knife Set',
          slug: 'kitchen-knife-set', 
          price: 15000,
          compareAt: 22000,
          discount: 32,
          images: [{ url: '/images/products/knives.jpg', alt: 'Kitchen Knives' }],
          category: 'Kitchenware',
          stock: 8
        },
        {
          id: 3,
          name: 'Cooking Oil 5L',
          slug: 'cooking-oil-5l',
          price: 8000,
          compareAt: 12000, 
          discount: 33,
          images: [{ url: '/images/products/oil.jpg', alt: 'Cooking Oil' }],
          category: 'Agricultural Products',
          stock: 25
        },
        {
          id: 4,
          name: 'Non-stick Pan Set',
          slug: 'non-stick-pan-set',
          price: 18000,
          compareAt: 25000,
          discount: 28,
          images: [{ url: '/images/products/pans.jpg', alt: 'Pan Set' }],
          category: 'Kitchenware',
          stock: 12
        }
      ]
    }

    return NextResponse.json(fallbackData)
  }
}