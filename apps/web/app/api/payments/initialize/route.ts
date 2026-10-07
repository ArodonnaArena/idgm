import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '../../../../lib/prisma'
import { authOptions } from '@idgm/lib'
import {
  calculatePaymentTotal,
  paymentRequestSchema,
} from '../../../../lib/security/payments.mjs'

async function initializePaystackPayment(data: any, amount: number) {
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
  if (!paystackSecretKey) throw new Error('Paystack secret key not configured')

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${paystackSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      amount: amount * 100,
      currency: data.currency,
      reference: `IDGM-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      metadata: data.metadata,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payments/callback`,
    }),
  })

  const result = await response.json()
  if (!response.ok) throw new Error(result.message || 'Paystack initialization failed')

  return {
    data: {
      authorization_url: result.data.authorization_url,
      access_code: result.data.access_code,
      reference: result.data.reference,
    },
  }
}

async function initializeFlutterwavePayment(data: any, amount: number) {
  const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY
  if (!flutterwaveSecretKey) throw new Error('Flutterwave secret key not configured')

  const txRef = `IDGM-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${flutterwaveSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount,
      currency: data.currency,
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payments/callback`,
      customer: {
        email: data.email,
        name: data.metadata.customer.name,
        phonenumber: data.metadata.customer.phone,
      },
      customizations: {
        title: 'IDGM Universal Payment',
        description: 'Payment for your order',
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
      },
      meta: data.metadata,
    }),
  })

  const result = await response.json()
  if (!response.ok) throw new Error(result.message || 'Flutterwave initialization failed')

  return { data: { link: result.data.link, tx_ref: txRef } }
}

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const validatedData = paymentRequestSchema.parse(body)
    const productIds = validatedData.items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })
    const amount = calculatePaymentTotal(products, validatedData.items)

    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        provider: validatedData.provider.toUpperCase(),
        reference: `IDGM-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        amount,
        currency: 'NGN',
        status: 'INITIATED',
        raw: { items: validatedData.items },
      },
    })

    const paymentResponse = validatedData.provider === 'paystack'
      ? await initializePaystackPayment({ email: session.user.email, currency: 'NGN', metadata: {} }, amount)
      : await initializeFlutterwavePayment({ email: session.user.email, currency: 'NGN', metadata: {} }, amount)

    const providerReference =
      'reference' in paymentResponse.data
        ? paymentResponse.data.reference
        : paymentResponse.data.tx_ref

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        reference: providerReference || payment.reference,
        raw: { items: validatedData.items, providerResponse: paymentResponse.data },
      },
    })

    return NextResponse.json({
      success: true,
      amount,
      payment: {
        id: payment.id,
        reference: payment.reference,
        ...paymentResponse,
      },
    })
  } catch (error) {
    console.error('Payment initialization error:', error)
    if (error instanceof Error && error.message.includes('Unknown product')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment initialization failed', success: false },
      { status: 500 },
    )
  }
}
