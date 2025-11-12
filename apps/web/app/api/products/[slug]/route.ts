import { NextResponse } from 'next/server'
import { apiClient } from '../../../../lib/api-client'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await apiClient.getProductBySlug(params.slug)
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    if (error instanceof Error && error.message.includes('404')) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
