import { NextResponse } from 'next/server'
import { z } from 'zod'
import { apiClient } from '../../../lib/api-client'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = registerSchema.parse(body)
    
    // Forward request to backend API
    const result = await apiClient.register({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      phone: validatedData.phone
    })
    
    return NextResponse.json(result)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message }, 
        { status: 400 }
      )
    }
    
    // Handle API errors
    if (error instanceof Error) {
      console.error('Registration error:', error.message)
      
      // Parse error message to determine appropriate status code
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: error.message || 'Registration failed. Please try again.' },
        { status: 500 }
      )
    }
    
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
