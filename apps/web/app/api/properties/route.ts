export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '../../../lib/api-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('search') || searchParams.get('q') || undefined

    // Forward request to backend API
    const properties = await apiClient.getProperties(q)

    return NextResponse.json(properties)

  } catch (error) {
    console.error('Properties API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}