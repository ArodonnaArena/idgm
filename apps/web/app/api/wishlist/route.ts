import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@idgm/lib/src/prisma'

// GET - Get user's wishlist
export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: { product: true }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Wishlist GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

// POST - Add item to wishlist
export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await req.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        productId
      }
    })

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already in wishlist' })
    }

    // Add to wishlist
    await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId
      }
    })

    return NextResponse.json({ success: true, message: 'Added to wishlist' })
  } catch (error) {
    console.error('Wishlist POST Error:', error)
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 })
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await prisma.wishlistItem.deleteMany({
      where: {
        userId: user.id,
        productId
      }
    })

    return NextResponse.json({ success: true, message: 'Removed from wishlist' })
  } catch (error) {
    console.error('Wishlist DELETE Error:', error)
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 })
  }
}
