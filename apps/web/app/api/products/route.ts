export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '../../../lib/api-client'

export async function GET(request: NextRequest) {
  try {
    console.log('Products API: Starting request')
    console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL)
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined
    const categoryId = searchParams.get('category') || undefined
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('limit') || '50')

    console.log('Products API: Fetching with params:', { skip, take, search, categoryId })

    // Forward request to backend API
    const products: any = await apiClient.getProducts({
      skip,
      take,
      search,
      categoryId
    })

    console.log('Products API: Success, got', products?.products?.length || 0, 'products')
    return NextResponse.json(products)

  } catch (error: any) {
    console.error('Products API Error:', error)
    console.error('Error message:', error?.message)
    console.error('Error response:', error?.response)
    
    // Return empty array instead of error to prevent breaking the UI
    return NextResponse.json({
      products: [],
      total: 0,
      filters: { categories: [] }
    })
  }
}
