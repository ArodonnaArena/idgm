import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@idgm/lib/src/prisma'

// PATCH - Update a flash sale
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const flashSale = await prisma.flashSale.findUnique({
      where: { id },
      include: { product: true }
    })

    if (!flashSale) {
      return NextResponse.json(
        { error: 'Flash sale not found' },
        { status: 404 }
      )
    }

    // Recalculate flash price if discount changed
    let flashPrice = flashSale.flashPrice
    if (body.discountPercent && body.discountPercent !== flashSale.discountPercent) {
      flashPrice = flashSale.product.price * (1 - body.discountPercent / 100)
    }

    const updated = await prisma.flashSale.update({
      where: { id },
      data: {
        ...body,
        flashPrice,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
      },
      include: {
        product: {
          include: {
            category: true,
            images: true,
            inventory: true
          }
        }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Flash sale update error:', error)
    return NextResponse.json(
      { error: 'Failed to update flash sale' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a flash sale
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.flashSale.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Flash sale deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete flash sale' },
      { status: 500 }
    )
  }
}
