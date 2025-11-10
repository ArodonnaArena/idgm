import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@idgm/lib/src/prisma'
import { z } from 'zod'

const initializePaymentSchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  currency: z.string().default('NGN'),
  orderId: z.string().optional(),
  provider: z.enum(['paystack', 'flutterwave']),
  metadata: z.object({
    customer: z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
    }),
    order: z.object({
      id: z.string(),
      items: z.array(z.any()),
    }).optional(),
  }),
})

// Paystack integration
async function initializePaystackPayment(data: any) {
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
  
  if (!paystackSecretKey) {
    throw new Error('Paystack secret key not configured')
  }

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${paystackSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      amount: data.amount * 100, // Paystack expects amount in kobo
      currency: data.currency,
      reference: `IDGM-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      metadata: data.metadata,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payments/callback`,
    }),
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.message || 'Paystack initialization failed')
  }

  return {
    status: 'success',
    data: {
      authorization_url: result.data.authorization_url,
      access_code: result.data.access_code,
      reference: result.data.reference,
    },
    provider: 'paystack'
  }
}

// Flutterwave integration
async function initializeFlutterwavePayment(data: any) {
  const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY
  
  if (!flutterwaveSecretKey) {
    throw new Error('Flutterwave secret key not configured')
  }

  const txRef = `IDGM-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  
  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${flutterwaveSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount: data.amount,
      currency: data.currency,
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payments/callback`,
      customer: {
        email: data.email,
        name: data.metadata.customer.name,
        phonenumber: data.metadata.customer.phone,
      },
      customizations: {
        title: 'IDGM Universal Payment',
        description: 'Payment for your order',
        logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
      meta: data.metadata,
    }),
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.message || 'Flutterwave initialization failed')
  }

  return {
    status: 'success',
    data: {
      link: result.data.link,
      tx_ref: txRef,
    },
    provider: 'flutterwave'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = initializePaymentSchema.parse(body)

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: validatedData.orderId,
        userId: validatedData.metadata.customer.email, // Temporary - should be actual user ID
        provider: validatedData.provider.toUpperCase(),
        reference: `IDGM-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        amount: validatedData.amount,
        currency: validatedData.currency,
        status: 'INITIATED',
        raw: validatedData.metadata,
      },
    })

    // Initialize payment based on provider
    let paymentResponse
    if (validatedData.provider === 'paystack') {
      paymentResponse = await initializePaystackPayment(validatedData)
    } else if (validatedData.provider === 'flutterwave') {
      paymentResponse = await initializeFlutterwavePayment(validatedData)
    } else {
      return NextResponse.json(
        { error: 'Invalid payment provider' },
        { status: 400 }
      )
    }

    // Update payment record with provider reference
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        reference: paymentResponse.data.reference || paymentResponse.data.tx_ref || payment.reference,
        raw: {
          ...validatedData.metadata,
          providerResponse: paymentResponse.data,
        },
      },
    })

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        reference: payment.reference,
        ...paymentResponse,
      },
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Payment initialization failed',
        success: false
      },
      { status: 500 }
    )
  }
}
