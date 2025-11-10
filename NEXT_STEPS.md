# IDGM Universal - Next Steps Guide

**Project Status:** Core Backend & Admin Foundation Complete ✅  
**Date:** 2025-11-08

---

## ✅ What's Been Completed

### Backend API (NestJS)
- ✅ Auth Module - Registration, login, password management
- ✅ Users Module - Full CRUD with role management
- ✅ Products Module - Complete product management with inventory
- ✅ Categories Module - Hierarchical categories
- ✅ All modules properly registered in AppModule

### Frontend (Admin Dashboard)
- ✅ Enhanced API client with error handling (packages/lib/src/api.ts)
- ✅ Products page - List, search, delete (with API integration)
- ✅ Users page - List, search, delete (with API integration)
- ✅ Dashboard - Basic metrics
- ✅ Layout with sidebar navigation
- ✅ NextAuth authentication with RBAC

### Database & Infrastructure
- ✅ MongoDB schema fully defined
- ✅ Prisma Client setup
- ✅ Seed data available
- ✅ Environment configuration

---

## 🚀 How to Run the Project

### 1. Start MongoDB
Make sure MongoDB is running locally or you have an Atlas connection.

### 2. Setup Database (First Time)
```bash
# Generate Prisma client
npm run db:gen

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### 3. Start Backend API
```bash
cd backend/api
npm install
npm run dev
# API runs on http://localhost:4000
```

### 4. Start Admin Dashboard
```bash
cd apps/admin
npm install
npm run dev
# Admin runs on http://localhost:3001
```

### 5. Login to Admin
- URL: http://localhost:3001/login
- Email: admin@idgm.com
- Password: admin123

---

## 📝 Immediate Next Steps (Priority Order)

### Phase 1: Complete Remaining Backend Modules

#### 1. Orders Module
**Location:** `backend/api/src/modules/orders/`

**Files to create:**
- `dto/order.dto.ts` - Create/Update DTOs
- `orders.service.ts` - Business logic
- `orders.controller.ts` - REST endpoints
- `orders.module.ts` - Module registration

**Key features:**
- List orders with filters (status, user, date range)
- Create order from cart
- Update order status (PENDING → PAID → FULFILLED)
- Cancel/refund orders
- Calculate totals (subtotal, tax, shipping)

**Example endpoint:**
```typescript
@Controller('orders')
export class OrdersController {
  @Get()
  async findAll(@Query() params) {
    // List with pagination
  }

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    // Create order
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() status) {
    // Update status
  }
}
```

#### 2. Roles Module
**Location:** `backend/api/src/modules/roles/`

**Features:**
- CRUD operations for roles
- Manage permissions per role
- Assign/revoke permissions

#### 3. Cart Module (Optional - can be client-side only)
**Location:** `backend/api/src/modules/cart/`

**Features:**
- Add/remove items
- Update quantities
- Calculate totals
- Clear cart after checkout

---

### Phase 2: Complete Admin Pages

#### 1. Categories Page
**Location:** `apps/admin/app/(protected)/categories/page.tsx`

Pattern to follow (similar to products/users):
```typescript
"use client"

import { useState, useEffect } from "react"
import { api } from "@idgm/lib"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const data = await api.categories.list()
    setCategories(data)
  }

  // ... render table similar to products page
}
```

#### 2. Orders Page
**Location:** `apps/admin/app/(protected)/orders/page.tsx`

**Features needed:**
- List orders with status filters
- View order details
- Update status (Mark as Paid, Fulfilled, etc.)
- Search by order ID or customer

#### 3. Product Form (Create/Edit)
**Location:** `apps/admin/app/(protected)/products/new/page.tsx`

**Form fields:**
- Name, SKU, Slug
- Description (textarea)
- Price, Compare At Price
- Category (dropdown)
- Images (file upload)
- Active/Inactive toggle

---

### Phase 3: File Upload for Images

#### Backend: Add Multer for File Uploads
```bash
cd backend/api
npm install --save multer @types/multer
```

**Create upload module:**
```typescript
// backend/api/src/modules/upload/upload.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    // For now, save to local /uploads folder
    // Later: upload to S3
    return { url: `/uploads/${file.filename}` }
  }
}
```

#### Frontend: Image Upload Component
```typescript
async function handleImageUpload(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('http://localhost:4000/api/upload/image', {
    method: 'POST',
    body: formData,
  })
  
  const data = await response.json()
  return data.url
}
```

---

### Phase 4: Properties & Estate Management

These modules follow the same pattern as products/users:

#### Backend Modules Needed:
1. **Properties Module** - Property listings CRUD
2. **Units Module** - Individual units within properties
3. **Leases Module** - Rental agreements
4. **Tickets Module** - Maintenance requests

#### Admin Pages Needed:
1. Properties list/create/edit
2. Units management
3. Leases management
4. Tickets management

---

### Phase 5: Payments Integration

#### Paystack Integration
```bash
cd backend/api
npm install --save paystack
```

**Webhook handler:**
```typescript
@Controller('webhooks')
export class WebhooksController {
  @Post('paystack')
  async paystackWebhook(@Body() payload) {
    // Verify signature
    // Update order/payment status
  }
}
```

---

## 🎨 UI Components Needed

Create reusable components in `apps/admin/components/`:

### 1. Table Component
**File:** `apps/admin/components/Table.tsx`
```typescript
interface TableProps {
  columns: { key: string; label: string }[]
  data: any[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}
```

### 2. Form Components
- Input field with label and error
- Select dropdown
- Textarea
- File upload
- Toggle switch
- Date picker

### 3. Modal Component
For edit/delete confirmations

### 4. Loading Spinner
For consistent loading states

---

## 🧪 Testing Checklist

### Backend API Testing
```bash
# Test products endpoint
curl http://localhost:4000/api/products

# Test auth
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@idgm.com","password":"admin123"}'
```

### Frontend Testing
- [ ] Login/logout works
- [ ] Products list loads from API
- [ ] Users list loads from API
- [ ] Search functionality works
- [ ] Delete operations work
- [ ] Error messages display properly

---

## 📚 Useful References

### Documentation to Read:
- [Next.js App Router](https://nextjs.org/docs/app)
- [NestJS Controllers](https://docs.nestjs.com/controllers)
- [Prisma with MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [NextAuth.js](https://next-auth.js.org/getting-started/example)

### Key Files to Reference:
- `backend/api/src/modules/products/` - Example backend module
- `apps/admin/app/(protected)/products/page.tsx` - Example admin page
- `packages/lib/src/api.ts` - API client
- `warp.md` - Project index

---

## 🔧 Common Commands

```bash
# Database
npm run db:studio     # Open Prisma Studio
npm run db:reset      # Reset & reseed database

# Development
npm run dev:web       # Start web app
npm run dev:admin     # Start admin
cd backend/api && npm run dev  # Start API

# Install new package
cd backend/api && npm install <package>
cd apps/admin && npm install <package>
```

---

## 💡 Development Tips

1. **Always start the backend API first** before testing admin pages
2. **Check the browser console** for API errors
3. **Use Prisma Studio** to inspect database: `npm run db:studio`
4. **Test API endpoints with curl/Postman** before building UI
5. **Follow the existing patterns** in products/users modules

---

## 🎯 Success Criteria

You'll know you're done with the MVP when:

- [ ] All backend CRUD modules work (users, products, categories, orders)
- [ ] Admin can manage users, products, categories, orders
- [ ] Products can be created with images
- [ ] Orders can be created and tracked
- [ ] Basic payment integration works
- [ ] Estate management basics are in place

---

## 📞 Need Help?

**Error: "Cannot find module '@idgm/lib'"**
- Run `npm install` in root directory

**Error: "PrismaClient is not defined"**
- Run `npm run db:gen`

**Backend API not responding**
- Check if backend is running on port 4000
- Check MongoDB connection in .env file

**Admin page shows "Failed to load"**
- Check browser console for API errors
- Verify NEXT_PUBLIC_API_URL in .env

---

**Good luck with development! Follow the patterns established in products/users modules for consistency.**
