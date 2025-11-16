import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@idgm/lib'

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://idgm-backend.onrender.com/api'

async function proxyToBackend(path: string, method: string, body?: any, token?: string) {
  const url = `${BACKEND_BASE}${path}`
  const headers: any = {}
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, {
    method,
    headers,
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  })

  const text = await res.text()
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return new NextResponse(text, { status: res.status, headers: { 'Content-Type': 'application/json' } })
  }
  return new NextResponse(text, { status: res.status })
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    const token = (session as any)?.accessToken
    const body = await req.json().catch(() => null)
    if (!token) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    return await proxyToBackend('/cart', 'POST', body, token)
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message || 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    const token = (session as any)?.accessToken
    const body = await req.json().catch(() => null)
    if (!token) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    return await proxyToBackend('/cart', 'PUT', body, token)
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message || 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    const token = (session as any)?.accessToken
    if (!token) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    return await proxyToBackend('/cart', 'GET', undefined, token)
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message || 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    const token = (session as any)?.accessToken
    const url = new URL(req.url)
    const itemId = url.searchParams.get('itemId')
    if (!token) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    return await proxyToBackend(`/cart?itemId=${encodeURIComponent(itemId || '')}`, 'DELETE', undefined, token)
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message || 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
