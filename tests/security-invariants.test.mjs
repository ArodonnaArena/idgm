import assert from 'node:assert/strict'
import test from 'node:test'

import {
  calculatePaymentTotal,
  paymentRequestSchema,
} from '../apps/web/lib/security/payments.mjs'

test('payment requests reject client-supplied prices and amounts', () => {
  const parsed = paymentRequestSchema.safeParse({
    provider: 'paystack',
    items: [{ productId: 'product-a', quantity: 2 }],
  })

  assert.equal(parsed.success, true)
  assert.equal('amount' in parsed.data, false)
  assert.equal('price' in parsed.data, false)
})

test('payment total is calculated from server-returned product prices', () => {
  const total = calculatePaymentTotal(
    [{ id: 'product-a', price: 24000 }, { id: 'product-b', price: 15000 }],
    [{ productId: 'product-a', quantity: 2 }, { productId: 'product-b', quantity: 1 }],
  )

  assert.equal(total, 63000)
})

test('payment total rejects unknown product IDs and non-positive quantities', () => {
  assert.throws(
    () => calculatePaymentTotal(
      [{ id: 'product-a', price: 24000 }],
      [{ productId: 'missing', quantity: 1 }],
    ),
    /Unknown product/i,
  )

  assert.throws(
    () => calculatePaymentTotal(
      [{ id: 'product-a', price: 24000 }],
      [{ productId: 'product-a', quantity: 0 }],
    ),
    /positive/i,
  )
})
