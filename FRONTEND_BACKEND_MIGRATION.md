# Frontend to Backend API Migration Guide

## Overview
This document tracks the migration of frontend API routes from using Prisma directly to calling the backend API on Render.

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│   Frontend      │────────▶│  Backend API     │────────▶│   Database   │
│   (Vercel)      │  HTTPS  │   (Render)       │  Prisma │  (PostgreSQL)│
└─────────────────┘         └──────────────────┘         └──────────────┘
```

### Why This Architecture?
- ✅ **Fixes Vercel Deployment Issues**: No more Prisma engine errors
- ✅ **Better Security**: Database credentials only on backend
- ✅ **Proper Separation**: Frontend handles UI, backend handles data
- ✅ **Scalability**: Each layer can scale independently

## Environment Variables

### Frontend (.env.local)
```env
# Backend API URL - UPDATE THIS WITH YOUR RENDER URL
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com

# For local development
# NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

# NextAuth (still needed for session management)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Paystack (if used in frontend)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
```

### Vercel Environment Variables
Set in Vercel Dashboard → Project Settings → Environment Variables:
- `NEXT_PUBLIC_BACKEND_URL` = `https://your-backend-url.onrender.com`
- `NEXTAUTH_SECRET` = (your secret)
- `NEXTAUTH_URL` = `https://idgm-web.vercel.app`

## Migration Status

### ✅ Completed Routes

| Route | Status | Description |
|-------|--------|-------------|
| `/api/register` | ✅ Migrated | User registration now calls backend |
| `/api/products` | ✅ Migrated | Product listing calls backend |
| `/api/products/[slug]` | ✅ Migrated | Individual product calls backend |
| `/api/properties` | ✅ Migrated | Property listing calls backend |

### 🔄 Routes That Should Stay on Frontend

These routes handle local concerns and should NOT be migrated:

| Route | Reason | Action |
|-------|--------|--------|
| `/api/auth/[...nextauth]` | NextAuth session management | ✅ Keep as is |
| `/api/cart` | Local cart with session | ✅ Keep as is |
| `/api/wishlist` | Local wishlist with session | ✅ Keep as is |
| `/api/payments/initialize` | Calls external payment APIs (Paystack/Flutterwave) | ✅ Keep as is |

### ⏳ Routes That Need Migration

These routes still use Prisma directly and should be migrated:

| Route | Priority | Action Needed |
|-------|----------|---------------|
| `/api/homepage` | Low | Complex aggregations - migrate when backend has endpoint |
| `/api/admin/dashboard` | Medium | Needs backend admin dashboard endpoint |
| `/api/admin/analytics` | Medium | Needs backend analytics endpoint |
| `/api/admin/orders` | High | Should call backend orders API |
| `/api/admin/products` | High | Should call backend products admin API |
| `/api/admin/properties` | High | Should call backend properties admin API |
| `/api/admin/users` | High | Should call backend users API |
| `/api/admin/flash-sales` | Medium | Needs backend flash sales endpoint |
| `/api/webhooks/paystack` | Keep | Payment webhooks should stay on frontend |

## API Client

The API client (`apps/web/lib/api-client.ts`) provides a centralized way to call the backend API.

### Usage Example

```typescript
import { apiClient } from '@/lib/api-client'

// Get products
const products = await apiClient.getProducts({ 
  skip: 0, 
  take: 20,
  search: 'rice' 
})

// Get single product
const product = await apiClient.getProductBySlug('premium-rice')

// Register user
const user = await apiClient.register({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe'
})

// Authenticated requests (pass token from session)
const orders = await apiClient.getOrders({ userId: 'user-id' }, token)
```

### Adding New Endpoints

To add a new backend endpoint to the API client:

```typescript
// In apps/web/lib/api-client.ts
async getMyNewEndpoint(params: any, token?: string) {
  return this.request('/api/my-endpoint', { 
    method: 'GET',
    token 
  });
}
```

## Migration Pattern

### Before (Using Prisma Directly)
```typescript
import { prisma } from '../../../lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: true }
  })
  return NextResponse.json(products)
}
```

### After (Using Backend API)
```typescript
import { apiClient } from '../../../lib/api-client'

export async function GET() {
  try {
    const products = await apiClient.getProducts()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
```

## Backend API Endpoints

Your NestJS backend on Render exposes these endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - List products (with pagination, search, filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)

### Properties
- `GET /api/properties` - List properties
- `GET /api/properties/:slug` - Get property by slug

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order
- `POST /api/orders` - Create order (auth required)
- `PUT /api/orders/:id/status` - Update order status (auth required)

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Get category

### Users (Admin)
- `GET /api/users` - List users (auth required)
- `GET /api/users/:id` - Get user (auth required)
- `PUT /api/users/:id` - Update user (auth required)

## Testing

### Local Development
1. Start your backend: `cd backend/api && npm run dev` (port 4000)
2. Update frontend `.env.local`: `NEXT_PUBLIC_BACKEND_URL=http://localhost:4000`
3. Start frontend: `cd apps/web && npm run dev`
4. Test the flow:
   - Visit `/register` - should call backend
   - Visit `/shop` - should load products from backend
   - Visit `/properties` - should load properties from backend

### Production Testing
1. Ensure backend is deployed on Render
2. Update Vercel environment variable with Render URL
3. Redeploy frontend on Vercel
4. Test all migrated routes

## Common Issues

### Issue: "Failed to fetch" errors
**Solution**: Check that `NEXT_PUBLIC_BACKEND_URL` is set correctly and backend is running

### Issue: CORS errors
**Solution**: Ensure backend `main.ts` has Vercel domain in CORS whitelist:
```typescript
cors: {
  origin: [/localhost:\d+$/, 'https://idgm-web.vercel.app', /\.vercel\.app$/],
  credentials: true
}
```

### Issue: Authentication errors
**Solution**: Make sure to pass the token from NextAuth session:
```typescript
const session = await getServerSession()
const token = session?.accessToken
const data = await apiClient.someMethod(params, token)
```

## Next Steps

1. ✅ Update `NEXT_PUBLIC_BACKEND_URL` in `.env.local` with your Render URL
2. ✅ Test locally that products and registration work
3. ⏳ Add backend endpoints for admin routes
4. ⏳ Migrate admin routes to use backend API
5. ⏳ Remove Prisma dependency from frontend (once all routes migrated)
6. ⏳ Deploy and test on production

## Rollback Plan

If you need to rollback:
1. Revert the git commits
2. Redeploy frontend on Vercel
3. The old Prisma-based routes will work again

## Support

If you encounter issues:
1. Check backend logs on Render dashboard
2. Check browser console for CORS/network errors  
3. Verify environment variables are set correctly
4. Check that backend API is accessible: `curl https://your-backend-url.onrender.com/api/products`
