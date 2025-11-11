import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature found' }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulCharge(event.data)
        break
      
      case 'charge.failed':
        await handleFailedCharge(event.data)
        break
      
      default:
        console.log(`Unhandled Paystack event: ${event.event}`)
    }

    return NextResponse.json({ status: 'success' })

  } catch (error) {
    console.error('Paystack webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleSuccessfulCharge(data: any) {
  try {
    // Find payment by reference
    const payment = await prisma.payment.findUnique({
      where: { reference: data.reference },
      include: { order: true }
    })

    if (!payment) {
      console.error(`Payment not found for reference: ${data.reference}`)
      return
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCESS',
        raw: {
          ...(payment.raw as object || {}),
          webhookData: data,
          verifiedAt: new Date().toISOString()
        }
      }
    })

    // Update order status if payment is linked to an order
    if (payment.orderId) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'PAID' }
      })

      // Update inventory - reduce product quantities
      const order = await prisma.order.findUnique({
        where: { id: payment.orderId },
        include: { items: true }
      })

      if (order) {
        for (const item of order.items) {
          await prisma.inventory.update({
            where: { productId: item.productId },
            data: {
              quantity: {
                decrement: item.quantity
              }
            }
          })
        }
      }

      // TODO: Send confirmation email
      // TODO: Create delivery/fulfillment record
    }

    console.log(`Payment verified successfully: ${data.reference}`)

  } catch (error) {
    console.error('Error handling successful charge:', error)
  }
}

async function handleFailedCharge(data: any) {
  try {
    // Find payment by reference
    const payment = await prisma.payment.findUnique({
      where: { reference: data.reference }
    })

    if (!payment) {
      console.error(`Payment not found for reference: ${data.reference}`)
      return
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'FAILED',
        raw: {
          ...(payment.raw as object || {}),
          webhookData: data,
          failedAt: new Date().toISOString()
        }
      }
    })

    // Update order status if payment is linked to an order
    if (payment.orderId) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'CANCELLED' }
      })
    }

    console.log(`Payment failed: ${data.reference}`)

  } catch (error) {
    console.error('Error handling failed charge:', error)
  }
}
