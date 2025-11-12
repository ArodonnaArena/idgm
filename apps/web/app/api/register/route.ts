import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// Ensure Node.js runtime (Prisma is not supported in the Edge runtime)
export const runtime = 'nodejs'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    // Quick sanity check for DB config to provide clearer error in prod
    if (!process.env.DATABASE_URL) {
      console.error('Missing DATABASE_URL environment variable')
      return NextResponse.json(
        { error: 'Server not configured. Please try again later.' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const validatedData = registerSchema.parse(body)
    
    const { email, password, name, phone } = validatedData

    // Step 1: existing user check
    let step: 'check' | 'hash' | 'role' | 'user' | 'link' | undefined = 'check'
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : [])
        ]
      }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone already exists' }, 
        { status: 409 }
      )
    }
    
    // Step 2: hash password
    step = 'hash'
    const passwordHash = await bcrypt.hash(password, 12)

    // Step 3: ensure CUSTOMER role exists
    step = 'role'
    const customerRole = await prisma.role.upsert({
      where: { name: 'CUSTOMER' },
      update: {},
      create: { name: 'CUSTOMER', description: 'Customer' },
    })

    // Step 4: create user
    step = 'user'
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        ...(phone ? { phone } : {}),
        status: 'ACTIVE',
      },
    })

    // Step 5: link role
    step = 'link'
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: customerRole.id,
      },
    })
    
    return NextResponse.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name 
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message }, 
        { status: 400 }
      )
    }

    // Prisma initialization / connection issues (e.g., invalid/missing DATABASE_URL)
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error('Prisma initialization error:', error.message)
      const code = (error as any)?.errorCode || 'PRISMA_INIT'
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.', code },
        { status: 500 }
      )
    }

    // If we set a step variable above, include it for easier debugging
    const stepInfo = (typeof (globalThis as any).step !== 'undefined') ? (globalThis as any).step : undefined

    // Prisma client validation (bad data shape to Prisma)
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error('Prisma validation error:', error.message)
      return NextResponse.json(
        { error: 'Invalid data. Please check your inputs.' },
        { status: 400 }
      )
    }
    
    // Handle Prisma unique constraint errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || []
        if (target.includes('email') || target.toString().includes('email')) {
          return NextResponse.json(
            { error: 'An account with this email already exists' }, 
            { status: 409 }
          )
        }
        if (target.includes('phone') || target.toString().includes('phone')) {
          return NextResponse.json(
            { error: 'An account with this phone number already exists' }, 
            { status: 409 }
          )
        }
        return NextResponse.json(
          { error: 'An account with these details already exists' }, 
          { status: 409 }
        )
      }
    }
    
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error', step: (step as any) }, 
      { status: 500 }
    )
  }
}
