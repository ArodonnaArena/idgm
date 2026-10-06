/**
 * Delivery rule model based on the spec the user provided.
 * For now we support only the fields we actually have in the schema (country/state/city/subtotal/items).
 * Weight / bulky / geo-fence hooks are present but fall back safely when data is missing.
 */

export type DeliveryAction =
  | { type: 'set_fee_ngn'; amount: number }
  | { type: 'add_fee_ngn'; amount: number; label?: string }
  | { type: 'percent_of_subtotal'; percent: number; label?: string }
  | { type: 'free_shipping' }
  | { type: 'set_eta_minutes'; minutes: number }
  | { type: 'add_tag'; tag: string }
  | { type: 'block_delivery'; reason?: string }

export interface DeliveryConditions {
  country?: string
  state?: string
  lga?: string
  minWeightKg?: number
  maxWeightKg?: number
  minItems?: number
  maxItems?: number
  minSubtotalNgn?: number
  maxSubtotalNgn?: number
  paymentMethod?: string
}

export interface DeliveryRule {
  id: string
  priority: number
  conditions: DeliveryConditions
  actions: DeliveryAction[]
}

export interface DeliveryContextItem {
  quantity: number
  // Weight / dimensions are currently not stored in Product; keep them optional.
  grossWeightKg?: number | null
  lengthCm?: number | null
  widthCm?: number | null
  heightCm?: number | null
  maxDimensionCm?: number | null
  isBulky?: boolean | null
}

export interface DeliveryContext {
  cart: {
    subtotalNgn: number
    items: DeliveryContextItem[]
  }
  address?: {
    country?: string | null
    state?: string | null
    city?: string | null
  } | null
  paymentMethod?: string | null
  /** true when any product in the cart has free shipping assigned by admin */
  hasFreeShippingProduct?: boolean
  requestedAt: Date
}

export interface DeliveryResult {
  isAvailable: boolean
  deliveryFeeNgn: number
  grandTotalNgn: number
  subtotalNgn: number
  currency: 'NGN'
  appliedRules: string[]
  priceBreakdown: { label: string; amount: number }[]
  etaMinutes?: number | null
  tags: string[]
  effectiveWeightKg: number
}

/**
 * Compute volumetric, gross and effective weight for the cart.
 * Currently falls back to zero when no weight/dimension data exists.
 */
export function computeWeights(ctx: DeliveryContext): {
  volumetricKg: number
  grossKg: number
  effectiveKg: number
  containsBulky: boolean
} {
  const VOLUMETRIC_DIVISOR = 5000

  let volumetric = 0
  let gross = 0
  let containsBulky = false

  for (const item of ctx.cart.items) {
    const qty = item.quantity ?? 0

    const L = item.lengthCm ?? 0
    const W = item.widthCm ?? 0
    const H = item.heightCm ?? 0
    const volumetricItem = L && W && H ? (L * W * H) / VOLUMETRIC_DIVISOR : 0
    volumetric += volumetricItem * qty

    const grossItem = item.grossWeightKg ?? 0
    gross += grossItem * qty

    const maxDim = item.maxDimensionCm ?? Math.max(L, W, H)
    if ((maxDim && maxDim > 50) || item.isBulky) {
      containsBulky = true
    }
  }

  const effective = Math.max(gross, volumetric)

  return {
    volumetricKg: Number(volumetric.toFixed(3)),
    grossKg: Number(gross.toFixed(3)),
    effectiveKg: Number(effective.toFixed(3)),
    containsBulky,
  }
}

function ruleMatches(rule: DeliveryRule, ctx: DeliveryContext, effectiveWeightKg: number, containsBulky: boolean): boolean {
  const c = rule.conditions
  const addr = ctx.address

  if (c.country && addr?.country && addr.country !== c.country) return false
  if (c.state && addr?.state && addr.state !== c.state) return false
  if (c.lga) {
    // No explicit LGA field in schema; treat city as LGA equivalent for now.
    if (!addr?.city || addr.city !== c.lga) return false
  }

  const itemsCount = ctx.cart.items.reduce((sum, i) => sum + (i.quantity ?? 0), 0)
  if (c.minItems != null && itemsCount < c.minItems) return false
  if (c.maxItems != null && itemsCount > c.maxItems) return false

  if (c.minWeightKg != null && effectiveWeightKg < c.minWeightKg) return false
  if (c.maxWeightKg != null && effectiveWeightKg > c.maxWeightKg) return false

  const subtotal = ctx.cart.subtotalNgn
  if (c.minSubtotalNgn != null && subtotal < c.minSubtotalNgn) return false
  if (c.maxSubtotalNgn != null && subtotal > c.maxSubtotalNgn) return false

  if (c.paymentMethod && ctx.paymentMethod && c.paymentMethod !== ctx.paymentMethod) return false

  // contains_bulky placeholder: we don't expose it in conditions yet, but engine could be extended.
  void containsBulky

  return true
}

export function quoteDelivery(rules: DeliveryRule[], ctx: DeliveryContext): DeliveryResult {
  const { effectiveKg, containsBulky } = computeWeights(ctx)

  const matches = rules.filter((r) => ruleMatches(r, ctx, effectiveKg, containsBulky))

  // Sort by priority desc, id asc
  matches.sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority
    return a.id.localeCompare(b.id)
  })

  const subtotal = Math.round(ctx.cart.subtotalNgn)

  let baseFee = 0
  const appliedRules: string[] = []
  const priceBreakdown: { label: string; amount: number }[] = []

  // Phase A: base fee selection
  const baseCandidates = matches.filter((r) => r.actions.some((a) => a.type === 'set_fee_ngn'))
  if (baseCandidates.length > 0) {
    const baseRule = baseCandidates[0]
    const action = baseRule.actions.find((a) => a.type === 'set_fee_ngn') as { type: 'set_fee_ngn'; amount: number }
    baseFee = Math.round(action.amount)
    appliedRules.push(baseRule.id)
    priceBreakdown.push({ label: 'Base fee', amount: baseFee })
  }

  // Phase B: modifiers and overrides
  let additive = 0
  let percentTotal = 0
  // Start with free shipping if any product explicitly has free shipping enabled
  let freeShipping = !!ctx.hasFreeShippingProduct
  let blocked = false
  let etaMinutes: number | null = null
  const tags: string[] = []

  for (const rule of matches) {
    for (const action of rule.actions) {
      switch (action.type) {
        case 'block_delivery': {
          blocked = true
          if (!appliedRules.includes(rule.id)) appliedRules.push(rule.id)
          break
        }
        case 'free_shipping': {
          freeShipping = true
          if (!appliedRules.includes(rule.id)) appliedRules.push(rule.id)
          break
        }
        case 'add_fee_ngn': {
          additive += action.amount
          if (!appliedRules.includes(rule.id)) appliedRules.push(rule.id)
          priceBreakdown.push({ label: action.label || 'Surcharge', amount: Math.round(action.amount) })
          break
        }
        case 'percent_of_subtotal': {
          const contribution = (action.percent / 100) * subtotal
          percentTotal += contribution
          if (!appliedRules.includes(rule.id)) appliedRules.push(rule.id)
          priceBreakdown.push({ label: action.label || `${action.percent}% of subtotal`, amount: Math.round(contribution) })
          break
        }
        case 'set_eta_minutes': {
          if (etaMinutes == null) {
            etaMinutes = action.minutes
          }
          if (!appliedRules.includes(rule.id)) appliedRules.push(rule.id)
          break
        }
        case 'add_tag': {
          tags.push(action.tag)
          if (!appliedRules.includes(rule.id)) appliedRules.push(rule.id)
          break
        }
        case 'set_fee_ngn': {
          // already handled in base selection
          break
        }
      }
    }
  }

  if (blocked) {
    return {
      isAvailable: false,
      deliveryFeeNgn: 0,
      grandTotalNgn: subtotal,
      subtotalNgn: subtotal,
      currency: 'NGN',
      appliedRules,
      priceBreakdown,
      etaMinutes,
      tags,
      effectiveWeightKg: effectiveKg,
    }
  }

  let deliveryFee = 0
  if (freeShipping) {
    deliveryFee = 0
  } else {
    deliveryFee = Math.round(baseFee + additive + percentTotal)
  }

  const grandTotal = subtotal + deliveryFee

  return {
    isAvailable: true,
    deliveryFeeNgn: deliveryFee,
    grandTotalNgn: grandTotal,
    subtotalNgn: subtotal,
    currency: 'NGN',
    appliedRules,
    priceBreakdown,
    etaMinutes,
    tags,
    effectiveWeightKg: effectiveKg,
  }
}

/**
 * Temporary in-memory ruleset for Nigeria.
 * These can be moved to the database later.
 */
export const DEFAULT_DELIVERY_RULES: DeliveryRule[] = [
  // Lagos metro base fee (example: state = Lagos)
  {
    id: 'lagos-metro-base',
    priority: 50,
    conditions: { country: 'NG', state: 'Lagos', minWeightKg: 0, maxWeightKg: 5 },
    actions: [
      { type: 'set_fee_ngn', amount: 800 },
      { type: 'set_eta_minutes', minutes: 8 * 60 },
      { type: 'add_tag', tag: 'Lagos metro 0â€“5kg' },
    ],
  },

  // Abuja metro base (example: state = FCT)
  {
    id: 'abuja-metro-base',
    priority: 45,
    conditions: { country: 'NG', state: 'FCT', minWeightKg: 0, maxWeightKg: 5 },
    actions: [
      { type: 'set_fee_ngn', amount: 1000 },
      { type: 'set_eta_minutes', minutes: 24 * 60 },
      { type: 'add_tag', tag: 'Abuja metro 0â€“5kg' },
    ],
  },

  // Remote base (fallback for NG when not Lagos/Abuja)
  {
    id: 'remote-base',
    priority: 20,
    conditions: { country: 'NG' },
    actions: [
      { type: 'set_fee_ngn', amount: 2500 },
      { type: 'set_eta_minutes', minutes: 3 * 24 * 60 },
      { type: 'add_tag', tag: 'Remote NG base' },
    ],
  },

  // Weight surcharge 5.01â€“20kg
  {
    id: 'weight-5-20kg-surcharge',
    priority: 15,
    conditions: { minWeightKg: 5.01, maxWeightKg: 20 },
    actions: [
      { type: 'add_fee_ngn', amount: 500, label: 'Weight 5â€“20kg' },
      { type: 'add_tag', tag: 'Weight 5â€“20kg' },
    ],
  },

  // Bulky item surcharge
  {
    id: 'bulky-item-surcharge',
    priority: 15,
    conditions: {},
    actions: [
      { type: 'add_fee_ngn', amount: 1500, label: 'Bulky item' },
      { type: 'add_tag', tag: 'Bulky' },
    ],
  },

  // COD surcharge (payment method == COD)
  {
    id: 'cod-surcharge',
    priority: 15,
    conditions: { paymentMethod: 'COD' },
    actions: [
      { type: 'add_fee_ngn', amount: 150, label: 'COD surcharge' },
      { type: 'add_tag', tag: 'Cash on delivery' },
    ],
  },
]
