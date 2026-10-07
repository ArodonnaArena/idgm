import assert from 'node:assert/strict'
import test from 'node:test'

import { adminUserUpdateSchema, registerSchema } from '../apps/web/lib/security/users.mjs'

test('registration rejects privileged and unknown fields', () => {
  const result = registerSchema.safeParse({
    email: 'user@example.com',
    password: 'password',
    name: 'Example User',
    roleIds: ['admin-role'],
  })

  assert.equal(result.success, false)
})

test('admin user updates accept only intended mutable fields', () => {
  const result = adminUserUpdateSchema.safeParse({
    userId: 'user-123',
    status: 'ACTIVE',
    roleIds: ['role-123'],
  })

  assert.equal(result.success, true)

  const rejected = adminUserUpdateSchema.safeParse({
    userId: 'user-123',
    status: 'ACTIVE',
    roleIds: ['role-123'],
    isAdmin: true,
  })
  assert.equal(rejected.success, false)
})
