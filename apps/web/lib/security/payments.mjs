import { z } from 'zod'

export const paymentRequestSchema = z
  .object({
    provider: z.enum(['paystack', 'flutterwave']),
    items: z
      .array(
        z.object({
          productId: z.string().min(1),
          quantity: z.number().int().positive(),
        }),
      )
      .min(1),
  })
  .strict()

export function calculatePaymentTotal(products, items) {
  const productById = new Map(products.map((product) => [product.id, product]))
  let total = 0

  for (const item of items) {
    const product = productById.get(item.productId)
    if (!product) throw new Error(`Unknown product ID: ${item.productId}`)
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error('Item quantity must be a positive integer')
    }

    const price = Number(product.price)
    if (!Number.isFinite(price) || price <= 0) {
      throw new Error(`Invalid price for product ${item.productId}`)
    }
    total += price * item.quantity
  }

  return total
}
