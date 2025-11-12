export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '../../../lib/api-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined
    const categoryId = searchParams.get('category') || undefined
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('limit') || '50')

    // Forward request to backend API
    const products = await apiClient.getProducts({
      skip,
      take,
      search,
      categoryId
    })

    return NextResponse.json(products)

  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}