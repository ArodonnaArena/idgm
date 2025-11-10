# IDGM Universal Limited - Project Index

## 🏢 Company Information
- **Name**: IDGM UNIVERSAL LIMITED
- **RC Number**: 8559613
- **Registration Date**: 17 June 2025
- **Type**: Private company limited by shares
- **Status**: ACTIVE
- **Address**: GOWON ESTATE, 11TH ROAD SHOPPING CENTRE, LAGOS, LAGOS STATE, NIGERIA
- **Post Code**: 100276
- **Email**: SANCTUARYMULTIPURPOSE@GMAIL.COM
- **Activities**: 
  - Sale/distribution of agricultural products & kitchenware
  - Real estate development, brokerage, leasing, facility management

## 📋 Project Overview
This is a Next.js monorepo application that includes:
- **E-commerce platform** for agricultural products and kitchenware
- **Estate management system** for properties, tenants, leases, and maintenance
- **Admin dashboard** with role-based access control (RBAC)
- **Multiple frontend applications** (web, admin, estate)
- **NestJS backend API**
- **Prisma ORM** with MySQL database

## 🏗️ Project Structure

```
newidgmsite/
├── apps/
│   ├── web/              # Public website & e-commerce (Port 3000)
│   │   ├── app/          # Next.js App Router
│   │   │   ├── (auth)/   # Authentication routes
│   │   │   ├── about/
│   │   │   ├── admin/
│   │   │   ├── api/      # API routes
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── contact/
│   │   │   ├── estate/
│   │   │   ├── properties/
│   │   │   ├── services/
│   │   │   └── shop/
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities & helpers
│   │   ├── middleware/   # Next.js middleware
│   │   └── styles/       # CSS/Tailwind styles
│   │
│   ├── admin/            # Admin dashboard (Port 3001)
│   │   └── [Next.js admin app structure]
│   │
│   └── estate/           # Estate portal (Port 3002)
│       └── [Next.js estate app structure]
│
├── backend/
│   ├── api/              # NestJS REST API
│   │   ├── src/
│   │   │   └── modules/  # Feature modules
│   │   ├── nest-cli.json
│   │   └── package.json
│   │
│   └── workers/          # Background jobs (BullMQ)
│
├── packages/
│   ├── db/               # Prisma schema & migrations
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── package.json
│   │
│   ├── lib/              # Shared utilities, API clients, types
│   └── ui/               # Shared UI components
│
├── docs/                 # Documentation
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment template
├── Context.md.md         # Detailed project specification
├── package.json          # Root workspace configuration
└── tsconfig.json         # TypeScript configuration
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2.4 (App Router)
- **Language**: TypeScript 5.4.0
- **UI Library**: React 18.2.0
- **Styling**: TailwindCSS 3.4.3
- **Components**: Headless UI, Heroicons
- **State Management**: TanStack React Query 5.51.1
- **Authentication**: NextAuth.js 4.24.7
- **Validation**: Zod 3.22.4

### Backend
- **Framework**: NestJS 10.3.0
- **Runtime**: Node.js 18+
- **ORM**: Prisma 5.17.0
- **Database**: MongoDB 5.0+ (Local or Atlas)
- **Password Hashing**: bcryptjs 2.4.3
- **API Documentation**: Swagger (OpenAPI)
- **Background Jobs**: BullMQ (Redis)

### Database
- **Type**: MongoDB 5.0+
- **Local**: MongoDB Community Server
- **Production**: MongoDB Atlas (Cloud)
- **Database**: `idgm_db`
- **GUI Tool**: MongoDB Compass

### External Services
- **Payments**: Paystack & Flutterwave
- **Email**: SendGrid
- **SMS**: Twilio
- **Storage**: S3-compatible (AWS S3 / DigitalOcean Spaces)
- **Search** (optional): Algolia / Elasticsearch

## 📦 Key Dependencies

### Web App (apps/web)
```json
{
  "@headlessui/react": "^1.7.17",
  "@heroicons/react": "^2.0.18",
  "@next-auth/prisma-adapter": "^1.0.7",
  "@prisma/client": "^5.17.0",
  "@tanstack/react-query": "^5.51.1",
  "next": "14.2.4",
  "next-auth": "^4.24.7",
  "react": "18.2.0",
  "tailwindcss": "^3.4.3",
  "zod": "^3.22.4"
}
```

### Backend API (backend/api)
```json
{
  "@nestjs/common": "^10.3.0",
  "@nestjs/core": "^10.3.0",
  "@nestjs/platform-express": "^10.3.0",
  "@nestjs/config": "^3.2.2",
  "@nestjs/swagger": "^7.3.1",
  "@prisma/client": "^5.17.0",
  "class-transformer": "^0.5.1",
  "class-validator": "^0.14.1",
  "bcryptjs": "^2.4.3",
  "axios": "^1.7.2"
}
```

## 🗄️ Database Schema

### Core Models
- **User**: Authentication, profiles, roles
- **Role**: ADMIN, STAFF, CUSTOMER, LANDLORD, TENANT
- **Permission**: Action-based permissions

### E-Commerce Models
- **Category**: Product categories (hierarchical)
- **Product**: Product catalog with images
- **Inventory**: Stock management
- **Cart**: Shopping cart (anonymous & logged-in)
- **Order**: Order management
- **Payment**: Payment transactions (Paystack/Flutterwave)
- **Address**: Shipping & billing addresses

### Estate Management Models
- **Property**: Real estate listings
- **Unit**: Individual units within properties
- **TenantProfile**: Tenant information
- **LandlordProfile**: Landlord/owner information
- **StaffProfile**: Staff information
- **Lease**: Rental agreements
- **Invoice**: Rent invoices
- **MaintenanceTicket**: Maintenance requests

### Supporting Models
- **FileAsset**: S3 file storage references
- **Account/Session/VerificationToken**: NextAuth models

## 🚀 Getting Started

### Prerequisites
1. **MongoDB** installed locally OR **MongoDB Atlas** account
2. **Node.js** 18+ with npm/yarn/pnpm
3. **Git** for version control
4. **MongoDB Compass** (optional, for GUI database management)

### Environment Setup

1. **Setup MongoDB**
   
   **Option A: Local MongoDB**
   - Download from: https://www.mongodb.com/try/download/community
   - Install MongoDB as a Windows service
   - Start service: `net start MongoDB`
   
   **Option B: MongoDB Atlas (Cloud)**
   - Create account at: https://www.mongodb.com/cloud/atlas
   - Create FREE cluster (M0)
   - Create database user and whitelist IP
   - Get connection string

2. **Clone and Configure**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your MongoDB connection string
   # Local: DATABASE_URL="mongodb://localhost:27017/idgm_db"
   # Atlas: DATABASE_URL="mongodb+srv://user:pass@cluster.net/idgm_db"
   ```

3. **Install Dependencies**
   ```bash
   # Install all workspace dependencies
   npm install
   
   # Or use the provided script
   npm run install:all
   ```

4. **Setup Database**
   ```bash
   # Generate Prisma client
   npm run db:gen
   
   # Push schema to MongoDB (no migrations needed)
   npm run db:push
   
   # Seed database with initial data
   npm run db:seed
   
   # (Optional) Open Prisma Studio
   npm run db:studio
   ```

## 📜 Available Scripts

### Root Level Scripts (package.json)
```bash
# Development
npm run dev:web           # Start web app (port 3000)
npm run dev:admin         # Start admin dashboard (port 3001)

# Build
npm run build:web         # Build web app
npm run build:admin       # Build admin app

# Database
npm run db:gen            # Generate Prisma client
npm run db:push           # Push schema to MongoDB
npm run db:seed           # Seed database
npm run db:studio         # Open Prisma Studio
npm run db:reset          # Reset database and reseed

# Setup
npm run install:all       # Install all dependencies
```

### Individual App Scripts
```bash
# Web app (from apps/web)
cd apps/web
npm run dev               # Development server (port 3000)
npm run build             # Production build
npm run start             # Start production server
npm run lint              # Run ESLint

# Admin app (from apps/admin)
cd apps/admin
npm run dev               # Development server (port 3001)
npm run build             # Production build
npm run start             # Start production server

# Backend API (from backend/api)
cd backend/api
npm run dev               # Development with hot reload
npm run build             # Production build
npm run start             # Start production server
```

## 🔑 Environment Variables

Required variables (see `.env.example`):

```bash
# Database (MongoDB)
# Local MongoDB
DATABASE_URL="mongodb://localhost:27017/idgm_db"

# MongoDB Atlas (production)
# DATABASE_URL="mongodb+srv://username:password@cluster.xxxxx.mongodb.net/idgm_db?retryWrites=true&w=majority"

# Next.js
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_with_a_long_random_string

# Payments (sandbox)
PAYSTACK_SECRET_KEY=sk_test_xxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx

# Email/SMS
SENDGRID_API_KEY=SG.xxxxx
TWILIO_SID=ACxxx
TWILIO_TOKEN=xxxx
```

## 🎯 Key Features

### E-Commerce
- Product catalog with categories
- Shopping cart (anonymous & logged-in)
- Checkout with address capture
- Payment integration (Paystack & Flutterwave)
- Order management
- Inventory tracking

### Estate Management
- Property listings (residential, commercial, land)
- Unit management
- Tenant applications
- Lease agreements
- Rent invoicing
- Maintenance ticket system
- Landlord & tenant portals

### Admin Dashboard
- Role-based access control (RBAC)
- Product/category management
- Order management
- Property management
- Tenant/lease management
- Maintenance ticket handling
- Reports & analytics

## 🔐 Security Features

- HTTPS in production
- JWT-based authentication (NextAuth)
- Password hashing (bcryptjs)
- Input validation (Zod, class-validator)
- CORS with allowlist
- Rate limiting
- Parameterized queries (Prisma)
- Signed URLs for private assets

## 📊 Key User Journeys

1. **E-commerce Customer**
   - Browse products → Add to cart → Checkout → Payment → Order confirmation

2. **Tenant**
   - Search properties → Request viewing → Apply → Sign lease → Pay rent → Submit maintenance tickets

3. **Landlord**
   - Create property → Upload photos → Publish listing → Manage tenants → View reports

4. **Admin**
   - Manage products/orders/properties → Handle tickets → View analytics

## 🧪 Testing Strategy

- **Unit tests**: Jest + ts-jest
- **Integration tests**: Supertest for API
- **E2E tests**: Playwright
- **Accessibility**: axe linter

## 🚢 Deployment

### Frontend (Vercel)
- Web app: apps/web
- Admin app: apps/admin
- Estate app: apps/estate

### Backend (Fly.io / Render)
- API: backend/api
- Workers: backend/workers

### Database
- Development: Local MongoDB
- Production: MongoDB Atlas

## 📝 Documentation

- **Context.md.md**: Complete implementation guide with detailed specifications
- **README.md**: Project setup and usage
- **warp.md**: This file - project index and quick reference
- **MONGODB_MIGRATION.md**: Complete MongoDB migration guide
- **MONGODB_QUICKSTART.md**: Quick start guide for MongoDB setup

## 🎨 Design Principles

- Mobile-first responsive design
- Core Web Vitals optimization (LCP < 2.5s)
- SEO-friendly (Nigerian market focus)
- Accessibility compliant
- Nigerian locale (en-NG), currency (NGN)

## 📞 Contact & Support

For issues or questions:
- Email: SANCTUARYMULTIPURPOSE@GMAIL.COM
- Company Address: GOWON ESTATE, 11TH ROAD SHOPPING CENTRE, LAGOS

## 🔄 Version Control

This project uses Git. Ensure you:
- Commit regularly with clear messages
- Never commit `.env` file
- Follow conventional commit format
- Create feature branches for new work

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Paystack Documentation](https://paystack.com/docs)
- [Flutterwave Documentation](https://developer.flutterwave.com)

---

**Last Updated**: 2025-11-08
**Project Status**: Backend core + Admin foundation implemented; Atlas connected; write endpoints protected with JWT/RBAC
**Version**: 1.1.0

## 🔄 2025-11-08 – Implementation Status & Recent Changes

### Highlights
- Database now points to MongoDB Atlas (existing cluster) using database `idgm_universal_12`
- Added/Upgraded Backend Modules (NestJS):
  - Auth: credentials login issues JWT; Passport/JWT strategy; Roles guard
  - Users: CRUD + role assignment; write routes protected
  - Products: full CRUD + inventory; write routes protected
  - Categories: hierarchical; write routes protected
  - Orders: list/get/create/update-status; write routes protected
  - Upload: local uploads with Multer, served under `/uploads`
- Admin (Next.js) updates:
  - Protected layout hydrates API client with Bearer token from NextAuth session
  - Products page uses API (list, delete); added `/products/new` with image upload
  - Users page uses API (list, delete)
  - Categories page uses API (list, create, delete)
  - Orders page uses API (filter by status, mark Paid/Fulfilled)
  - Login page fixed for App Router (Suspense + dynamic)
- Shared lib (packages/lib):
  - Enhanced API client (GET/POST/PUT/DELETE, error handling, auth header injection)
  - NextAuth config now prefers backend `/auth/login` and falls back to Prisma if needed

### Environment – Effective Values
- Root `.env` and `backend/api/.env`:
  - `DATABASE_URL="mongodb+srv://cosmicrocketadventure_db_user:<PASSWORD>@makben.8jlt673.mongodb.net/idgm_universal_12?retryWrites=true&w=majority&appName=makben"`
  - `JWT_SECRET=...`
- Admin `apps/admin/.env.local`:
  - `NEXTAUTH_URL=http://localhost:3001`
  - `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
  - `DATABASE_URL` same as above (for NextAuth/Prisma in admin)
  - `NEXTAUTH_SECRET=...`

### Seeding & DB Setup on Atlas
- Push schema (creates collections & indexes):
  - `npm run db:push`
- Seed data (roles, categories, sample products, admin user):
  - `node seed-atlas.js`
- Default credentials:
  - Email: `admin@idgm.com`
  - Password: `admin123`

### Backend Endpoints (implemented)
- `POST /api/auth/login` → returns `{ accessToken, user }`
- Users: `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`, `POST /users/:id/roles`
- Products: `GET /products`, `GET /products/:id`, `GET /products/slug/:slug`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id`, `POST /products/:id/inventory`
- Categories: `GET /categories`, `GET /categories/:id`, `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id`
- Orders: `GET /orders`, `GET /orders/:id`, `POST /orders`, `PUT /orders/:id/status`
- Uploads: `POST /upload/image` (local storage), static files at `/uploads/*`

Write routes are protected with `@UseGuards(AuthGuard('jwt'), RolesGuard)` and `@Roles('ADMIN'|'STAFF')` (DELETEs require ADMIN).

### How to Run (local dev)
1) Ensure Atlas Network Access allows your IP.
2) From repo root:
   - `npm install`
   - `npm run db:push`
   - `node seed-atlas.js`
3) Start API: `cd backend/api && npm run dev` (http://localhost:4000)
4) Start Admin: `cd apps/admin && npm run dev` (http://localhost:3001)
5) Sign in: `admin@idgm.com` / `admin123`

### Known Issues / Tips
- If admin login returns 401, verify:
  - API is running and reachable at `http://localhost:4000/api/auth/login`
  - Admin server picked up env changes (restart after editing `.env.local`)
  - Atlas Network Access includes your current IP
- On Windows, if `prisma generate` fails with EPERM on `query_engine-windows.dll.node`, close running dev servers, then retry.
- Local uploads are for dev only; use S3-compatible storage in production.

### Next Up
- Product edit page (`/products/[id]/edit`) incl. image management
- Move uploads to S3-compatible storage with signed URLs
- Verify Paystack webhook signature and update Payment/Order statuses
- Roles/Permissions management UI
