import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

let client: SupabaseClient | undefined

function getClient(): any {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey)
  }
  return client
}

const tableNames: Record<string, string> = {
  user: 'users',
  role: 'roles',
  permission: 'permissions',
  userRole: 'user_roles',
  category: 'categories',
  product: 'products',
  productImage: 'product_images',
  inventory: 'inventory',
  flashSale: 'flash_sales',
  cart: 'carts',
  cartItem: 'cart_items',
  order: 'orders',
  orderItem: 'order_items',
  address: 'addresses',
  payment: 'payments',
  wishlistItem: 'wishlist_items',
  coupon: 'coupons',
  property: 'properties',
  propertyImage: 'property_images',
  propertyUnit: 'property_units',
  maintenanceTicket: 'maintenance_tickets',
  invoice: 'invoices',
  account: 'accounts',
  session: 'sessions',
}

function tableName(name: string) {
  return tableNames[name] || `${name}s`
}

function applyWhere(query: any, where: any) {
  if (!where) return query

  for (const [key, value] of Object.entries(where)) {
    if (key === 'OR') {
      const conditions = Array.isArray(value) ? value : []
      for (const condition of conditions) {
        const conditionQuery = getClient().from(tableName('product')).select('*').or(
          Object.entries(condition).map(([field, fieldValue]) => `${field}.eq.${String(fieldValue)}`),
        )
        query = query.or(conditionQuery)
      }
      continue
    }

    if (key === 'AND') {
      for (const condition of Array.isArray(value) ? value : []) {
        query = applyWhere(query, condition)
      }
      continue
    }

    if (value && typeof value === 'object' && 'contains' in value) {
      query = query.ilike(key, `%${value.contains}%`)
    } else if (value && typeof value === 'object' && 'in' in value) {
      query = query.in(key, value.in)
    } else if (value && typeof value === 'object' && 'equals' in value) {
      query = query.eq(key, value.equals)
    } else if (value === undefined) {
      continue
    } else {
      query = query.eq(key, value)
    }
  }

  return query
}

function createModel(model: string) {
  const collection = tableName(model)
  const modelClient = {
    async findMany(args: any = {}) {
      let query = getClient().from(collection).select('*')
      query = applyWhere(query, args.where)
      if (args.orderBy) {
        const [field, direction] = Object.entries(args.orderBy)[0] || []
        if (field) query = query.order(field, { ascending: direction !== 'desc' })
      }
      if (args.skip) query = query.range(args.skip, args.skip + (args.take || 50))
      else if (args.take) query = query.limit(args.take)
      const { data, error } = await query
      if (error) throw error
      return data || []
    },
    async findUnique(args: any = {}) {
      const { data, error } = await getClient().from(collection).select('*').eq(
        Object.keys(args.where || {})[0] || 'id',
        Object.values(args.where || {})[0],
      ).maybeSingle()
      if (error) throw error
      return data
    },
    async findFirst(args: any = {}) {
      const result = await this.findMany({ ...args, take: 1 })
      return result[0] || null
    },
    async findOne(args: any = {}) {
      return this.findUnique(args)
    },
    async count(args: any = {}) {
      const { count, error } = await getClient().from(collection).select('*', { count: 'exact', head: true }).eq(
        Object.keys(args.where || {})[0] || 'id',
        Object.values(args.where || {})[0],
      )
      if (error) throw error
      return count || 0
    },
    async create(args: any = {}) {
      const { data, error } = await getClient().from(collection).insert(args.data || {}).select('*').single()
      if (error) throw error
      return data
    },
    async createMany(args: any = {}) {
      const { data, error } = await getClient().from(collection).insert(args.data || []).select('*')
      if (error) throw error
      return data || []
    },
    async update(args: any = {}) {
      const where = args.where || {}
      const key = Object.keys(where)[0] || 'id'
      const { data, error } = await getClient().from(collection).update(args.data || {}).eq(key, where[key]).select('*').maybeSingle()
      if (error) throw error
      return data
    },
    async upsert(args: any = {}) {
      const { data, error } = await getClient().from(collection).upsert(args.data || {}, { onConflict: args.where?.id ? 'id' : undefined }).select('*')
      if (error) throw error
      return data
    },
    async delete(args: any = {}) {
      const where = args.where || {}
      const key = Object.keys(where)[0] || 'id'
      const { data, error } = await getClient().from(collection).delete().eq(key, where[key])
      if (error) throw error
      return data
    },
    async deleteMany(args: any = {}) {
      return this.delete(args)
    },
    async aggregate(args: any = {}) {
      const query = getClient().from(collection).select('*')
      const result = await applyWhere(query, args.where)
      const { data, error } = await result
      if (error) throw error
      return data || []
    },
    async groupBy(args: any = {}) {
      const field = args.by || Object.keys(args.where || {})[0]
      const { data, error } = await getClient()
        .from(collection)
        .select(field, { count: 'exact' })
        .group(field, { type: 'count' })
      if (error) throw error
      return data || []
    },
  }

  return new Proxy(modelClient, {
    get(target, property) {
      if (property === '$queryRaw') return async () => ({ rows: [], count: 0 })
      if (property === '$transaction') return async (callback: any) => callback(modelClient)
      return (target as any)[property]
    },
  })
}

export const supabase: any = new Proxy({}, {
  get(_target, property) {
    if (typeof property !== 'string') return undefined
    if (property === '$disconnect') return async () => undefined
    return createModel(property)
  },
})

export { tableNames }
