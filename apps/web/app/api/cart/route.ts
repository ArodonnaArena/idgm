import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '../../../lib/prisma'

// GET - Get user's cart
export async function GET() {
  try {
    // Return empty cart on Vercel (Prisma not available)
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ items: [] })
    }
    
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

    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: true }
            }
          }
        }
      }
    })

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: {
          items: {
            include: {
              product: {
                include: { images: true }
              }
            }
          }
        }
      })
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error('Cart GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

// POST - Add item to cart
export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity = 1 } = await req.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id }
      })
    }

    // Get product to get price
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price
        }
      })
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: true }
            }
          }
        }
      }
    })

    return NextResponse.json({ success: true, cart: updatedCart })
  } catch (error) {
    console.error('Cart POST Error:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

// DELETE - Remove item from cart
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart DELETE Error:', error)
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 })
  }
}

// PUT - Update item quantity
export async function PUT(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId, quantity } = await req.json()
    if (!itemId || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'itemId and quantity are required' }, { status: 400 })
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } })
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart PUT Error:', error)
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 })
  }
}
