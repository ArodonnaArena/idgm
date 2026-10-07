import { z } from 'zod'

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
  })
  .strict()

export const adminUserUpdateSchema = z
  .object({
    userId: z.string().min(1),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
    roleIds: z.array(z.string().min(1)).optional(),
  })
  .strict()
