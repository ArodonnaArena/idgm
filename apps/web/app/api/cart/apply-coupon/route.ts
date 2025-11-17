import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@idgm/lib'

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://idgm-backend.onrender.com/api'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    const token = (session as any)?.accessToken
    const body = await req.json().catch(() => null)

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetch(`${BACKEND_BASE}/cart/apply-coupon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body ?? {}),
    })

    const text = await res.text()
    const contentType = res.headers.get('content-type') || ''

    return new NextResponse(text, {
      status: res.status,
      headers: contentType.includes('application/json')
        ? { 'Content-Type': 'application/json' }
        : undefined,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
