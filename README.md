# IDGM Universal Limited - Full Stack Application

> E-commerce platform and estate management system built with Next.js, NestJS, and MongoDB

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local) OR MongoDB Atlas account
- npm/yarn/pnpm

### Setup in 4 Steps

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and add your MongoDB connection string

# 3. Setup database
npm run db:gen && npm run db:push && npm run db:seed

# 4. Start development server
npm run dev:web
```

Visit http://localhost:3000 🎉

## 📋 What's Inside

This monorepo contains:

- **E-commerce Platform** - Products, cart, checkout, payments (Paystack/Flutterwave)
- **Estate Management** - Properties, tenants, leases, maintenance tickets
- **Admin Dashboard** - RBAC, content management, analytics
- **REST API** - NestJS backend with Prisma ORM
- **MongoDB Database** - Flexible, scalable NoSQL database

## 🗂️ Project Structure

```
newidgmsite/
├── apps/
│   ├── web/          # Public website (Next.js) - Port 3000
│   ├── admin/        # Admin dashboard (Next.js) - Port 3001
│   └── estate/       # Estate portal (Next.js) - Port 3002
├── backend/
│   ├── api/          # NestJS API
│   └── workers/      # Background jobs
├── packages/
│   ├── db/           # Prisma schema & migrations
│   ├── lib/          # Shared utilities
│   └── ui/           # Shared components
└── docs/             # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS
- **React Query** - Data fetching and caching
- **NextAuth** - Authentication

### Backend
- **NestJS 10** - Node.js framework
- **Prisma 5** - Database ORM
- **MongoDB 5+** - NoSQL database
- **BullMQ** - Job queue (Redis)

### Payments & Services
- **Paystack** - Nigerian payment gateway
- **Flutterwave** - African payment gateway
- **SendGrid** - Email service
- **Twilio** - SMS service

## 📦 Available Scripts

### Development

```bash
npm run dev:web       # Start web app (port 3000)
npm run dev:admin     # Start admin (port 3001)
npm run dev:api       # Start NestJS API
```

### Database

```bash
npm run db:gen        # Generate Prisma client
npm run db:push       # Push schema to MongoDB
npm run db:seed       # Seed initial data
npm run db:studio     # Open Prisma Studio GUI
npm run db:reset      # Reset and reseed database
```

### Build & Deploy

```bash
npm run build:web     # Build web app
npm run build:admin   # Build admin
npm run build:api     # Build API
```

## 🗄️ Database Setup

### Option A: Local MongoDB

1. Download MongoDB: https://www.mongodb.com/try/download/community
2. Install and start service
3. Update `.env`:
   ```
   DATABASE_URL="mongodb://localhost:27017/idgm_db"
   ```

### Option B: MongoDB Atlas (Cloud)

1. Create account: https://www.mongodb.com/cloud/atlas
2. Create FREE cluster (M0)
3. Get connection string
4. Update `.env`:
   ```
   DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/idgm_db"
   ```

**For detailed setup**: See `MONGODB_QUICKSTART.md`

## 🔑 Default Credentials

After running `npm run db:seed`:

- **Email**: admin@idgm.com
- **Password**: admin123

## 🌟 Key Features

### E-Commerce
✅ Product catalog with categories  
✅ Shopping cart (guest & logged-in)  
✅ Checkout with address management  
✅ Payment integration (Paystack, Flutterwave)  
✅ Order tracking  
✅ Inventory management  

### Estate Management
✅ Property listings (residential, commercial, land)  
✅ Unit management with availability tracking  
✅ Tenant applications and profiles  
✅ Lease agreements with invoicing  
✅ Rent payment tracking  
✅ Maintenance ticket system  

### Admin Features
✅ Role-based access control (RBAC)  
✅ User management  
✅ Product/category CRUD  
✅ Order management  
✅ Property management  
✅ Reporting and analytics  

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [warp.md](warp.md) | Complete project index |
| [Context.md.md](Context.md.md) | Detailed specifications |
| [MONGODB_QUICKSTART.md](MONGODB_QUICKSTART.md) | Quick MongoDB setup |
| [MONGODB_MIGRATION.md](MONGODB_MIGRATION.md) | Full migration guide |
| [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) | Changes overview |

## 🔐 Environment Variables

Required variables (see `.env.example`):

```bash
# Database
DATABASE_URL="mongodb://localhost:27017/idgm_db"

# Next.js
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Payments
PAYSTACK_SECRET_KEY=sk_test_xxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx

# Email/SMS
SENDGRID_API_KEY=SG.xxxxx
TWILIO_SID=ACxxx
TWILIO_TOKEN=xxxx
```

## 🧪 Testing

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:e2e          # E2E tests
```

## 🚀 Deployment

### Frontend (Vercel)
- Deploy `apps/web` to Vercel
- Deploy `apps/admin` to Vercel

### Backend (Fly.io / Render)
- Deploy `backend/api`
- Set environment variables

### Database (MongoDB Atlas)
- Use production cluster
- Enable backups
- Whitelist IP addresses

## 📊 Project Status

- ✅ Database migrated to MongoDB
- ✅ Core schema implemented
- ✅ Seed data available
- 🚧 Frontend development in progress
- 🚧 API endpoints in progress
- 📋 Testing phase upcoming

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

- **Email**: SANCTUARYMULTIPURPOSE@GMAIL.COM
- **Company**: IDGM UNIVERSAL LIMITED
- **RC Number**: 8559613

## 📄 License

Private - All rights reserved by IDGM Universal Limited

---

## 🎯 Next Steps

1. ✅ Setup MongoDB (local or Atlas)
2. ✅ Configure `.env` file
3. ✅ Run `npm run db:push` and `npm run db:seed`
4. ✅ Start development: `npm run dev:web`
5. 🚧 Build frontend pages
6. 🚧 Implement API endpoints
7. 🚧 Test features
8. 🚧 Deploy to production

---

**Built with ❤️ in Nigeria**

*Last Updated: 2025-10-30*
