import assert from 'node:assert/strict'
import test from 'node:test'

import { paymentRequestSchema } from '../apps/web/lib/security/payments.mjs'

test('strict payment request schema rejects unknown fields', () => {
  const result = paymentRequestSchema.safeParse({
    provider: 'paystack',
    items: [{ productId: 'product-a', quantity: 1 }],
    amount: 1000,
  })

  assert.equal(result.success, false)
  if (!result.success) assert.deepEqual(result.error.issues[0].path, [])
})
