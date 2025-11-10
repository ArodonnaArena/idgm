# IDGM UNIVERSAL LIMITED — Complete Next.js Implementation Guide (MySQL / XAMPP)

Purpose: A complete, executable guide for building a Next.js (TypeScript) website that includes a corporate site, an e‑commerce store (agricultural products & kitchenware) and a full Estate Management portal. This document assumes local development with MySQL (via XAMPP) and Prisma ORM.

---

## Table of Contents
1. Company snapshot
2. Project goals & success metrics
3. Target audiences & key user journeys
4. Sitemap & content structure
5. Architecture & tech stack (MySQL/XAMPP focused)
6. Project layout & repo structure
7. Environment & local setup (XAMPP + Next.js + Prisma)
8. Prisma schema (MySQL-ready) + seed script
9. Database & migration commands (Prisma + XAMPP)
10. API design & endpoints (REST summary + OpenAPI snippet)
11. Data models & ERD (mermaid)
12. E‑commerce functional spec (detailed)
13. Estate Management spec (detailed)
14. Admin dashboard & RBAC
15. Background jobs & event flows
16. UX, SEO and performance rules
17. Payments & compliance (Paystack & Flutterwave + NDPR)
18. CI/CD, hosting & deployment checklist
19. Testing strategy & acceptance criteria
20. Security checklist
21. Monitoring, backups & operational runbook
22. Deliverables & next steps
23. Appendix: Short AI prompts, useful scripts, references

---

## 1) Company snapshot
- **Company name**: IDGM UNIVERSAL LIMITED
- **RC Number**: 8559613
- **Date of registration**: 17 June 2025
- **Company type**: Private company limited by shares
- **Registered Address**: GOWON ESTATE, 11TH ROAD SHOPPING CENTRE, LAGOS, LAGOS STATE, NIGERIA
- **Post code**: 100276
- **Primary email**: SANCTUARYMULTIPURPOSE@GMAIL.COM
- **Status**: ACTIVE
- **Principal activities**: Sale/distribution of agricultural products & kitchenware; real estate development, brokerage, leasing, facility management.
- **PSC / Directors**: Makanjuola Bolanle (Director; 50%), Makanjuola Ebenezer (50%).

Content placement
- **About page**: Include the company snapshot.
- **Footer**: Show short legal text with RC Number and link to About.
- **RC Extract (scan)**: Store securely on S3 with private ACL. Expose via signed URL if needed.

---

## 2) Project goals & success metrics
Primary goals
- Launch a mobile-first Next.js corporate site that communicates trust and services.
- Provide a secure, scalable e‑commerce store for agricultural products & kitchenware.
- Build an Estate Management portal for properties, tenants, leases, maintenance, and payments.
- Provide an admin dashboard covering shop + estate modules with RBAC.
- Make product and property pages SEO-friendly for the Nigerian market.

KPIs
- **E‑commerce**: conversion rate, AOV, cart abandonment, repeat customer rate.
- **Estate**: occupancy rate, rent collection rate, avg days to resolve tickets.
- **Site**: LCP < 2.5s, organic traffic growth, bounce rate.

---

## 3) Target audiences & key user journeys
Audiences
- Retail customers (Nigeria) — search & buy products.
- Wholesale buyers — bulk orders and trade accounts.
- Property investors & prospective tenants.
- On‑site property managers & maintenance staff.
- Company stakeholders (investors/regulators) — corporate info.

MVP journeys
- Visitor → Home → Category → Product → Add to Cart → Checkout → Payment → Confirmation.
- Landlord/Agent → Login → Create Property → Upload Photos → Publish Listing.
- Tenant → Search Property → Request Viewing → Apply → Sign Lease → Pay Deposit/Rent → Create Ticket.
- Admin → Login → Manage Products/Orders/Properties/Tickets/Reports.

---

## 4) Sitemap & content structure
- Home
- About Us (company profile, RC excerpt, leadership)
- Services (Agriculture, Kitchenware, Real Estate Services)
- Shop
  - Categories
  - Product pages
  - Cart & Checkout
- Estate Management
  - Properties (For Rent / For Sale)
  - Tenant Portal
  - Landlord/Manager Dashboard
- Blog / Insights
- Contact Us (map, address, email, phone)
- Legal (Terms, Privacy, Refunds)
- Admin / Staff (protected)

---

## 5) Architecture & tech stack (MySQL/XAMPP)
Frontend
- Next.js (TypeScript). app router recommended. TailwindCSS + Headless UI.
- Data fetching: React Query or SWR.
- Auth: next-auth (JWT/session) + role checks.

Backend / API
- Node.js with NestJS (preferred) or Express/Fastify.
- REST (OpenAPI-first). Prisma ORM (MySQL provider).
- Background workers: BullMQ (Redis).

Database
- MySQL 8+ (XAMPP in dev). Engine: InnoDB. Collation: utf8mb4_unicode_ci.

Storage & Search
- S3-compatible storage (AWS S3 or DigitalOcean Spaces) for images/docs.
- Algolia/Elasticsearch for faceted search (optional but recommended).

Payments & Messaging
- Paystack + Flutterwave; bank transfer/manual verification fallback.
- Email: SendGrid/SES; SMS: Twilio or local provider.

Hosting
- Frontend: Vercel. Backend: Fly/Render/AWS. DB: Managed MySQL.
- CI: GitHub Actions.

---

## 6) Project layout & repo structure (monorepo)
```
/idgm-monorepo
  /apps
    /web      # public site + shop (Next.js)
    /admin    # admin dashboard (Next.js)
    /estate   # tenant/landlord portal (Next.js) or integrate in web
  /packages
    /ui       # shared components
    /lib      # shared utilities, api clients, types
    /db       # prisma schema + migrations
  /backend
    /api      # REST API (NestJS/Express)
    /workers  # background jobs
  package.json
  docker-compose.yml
  README.md
```
Why monorepo? Shared types (Prisma), UI components, unified scripts and CI.

---

## 7) Environment & local setup (XAMPP + Next.js + Prisma)
Prerequisites
- XAMPP installed & running (Apache + MySQL)
- Node.js 18+
- npm or yarn (pnpm optional)
- Git

.env example
```bash
# Database (XAMPP MySQL)
DATABASE_URL="mysql://root:YOUR_PASSWORD@127.0.0.1:3306/idgm_db"
# Next.js
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Prisma
SHADOW_DATABASE_URL="mysql://root:YOUR_PASSWORD@127.0.0.1:3306/idgm_shadow_db"
# Payment (sandbox keys)
PAYSTACK_SECRET_KEY=pk_test_xxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx
# Email/SMS
SENDGRID_API_KEY=SG.xxxxx
TWILIO_SID=ACxxx
TWILIO_TOKEN=xxxx
```

Create DB in XAMPP
1. Start XAMPP (Apache + MySQL).
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Create database `idgm_db` with collation `utf8mb4_unicode_ci`.

---

## 8) Prisma schema (MySQL-ready) + seed script
Prisma schema (packages/db/prisma/schema.prisma)
```prisma
// datasource & generator
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// RBAC
model Role {
  id          Int       @id @default(autoincrement())
  name        String    @unique // ADMIN, STAFF, CUSTOMER, LANDLORD, TENANT
  description String?
  users       UserRole[]
  permissions Permission[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Permission {
  id        Int       @id @default(autoincrement())
  action    String    // e.g., product.read, product.write, property.manage
  role      Role      @relation(fields: [roleId], references: [id])
  roleId    Int
}

model User {
  id            String      @id @default(cuid())
  email         String      @unique
  phone         String?     @unique
  passwordHash  String?
  name          String?
  image         String?
  status        UserStatus  @default(ACTIVE)
  tenantProfile TenantProfile?
  landlordProfile LandlordProfile?
  staffProfile  StaffProfile?
  roles         UserRole[]
  addresses     Address[]
  orders        Order[]
  payments      Payment[]
  tickets       MaintenanceTicket[] @relation("TicketAuthor")
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  // next-auth models
  accounts      Account[]
  sessions      Session[]
}

enum UserStatus { ACTIVE INACTIVE SUSPENDED }

model UserRole {
  id     Int   @id @default(autoincrement())
  user   User  @relation(fields: [userId], references: [id])
  userId String
  role   Role  @relation(fields: [roleId], references: [id])
  roleId Int
  @@unique([userId, roleId])
}

// E-commerce
model Category {
  id        Int        @id @default(autoincrement())
  slug      String     @unique
  name      String
  parentId  Int?
  parent    Category?  @relation("CategoryToParent", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryToParent")
  products  Product[]
}

model Product {
  id           Int            @id @default(autoincrement())
  sku          String         @unique
  slug         String         @unique
  name         String
  description  String?
  price        Decimal        @db.Decimal(10,2)
  compareAt    Decimal?       @db.Decimal(10,2)
  currency     String         @default("NGN")
  categoryId   Int
  category     Category       @relation(fields: [categoryId], references: [id])
  images       ProductImage[]
  inventory    Inventory?
  attributes   Json?
  isActive     Boolean        @default(true)
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

model ProductImage {
  id        Int     @id @default(autoincrement())
  url       String
  alt       String?
  productId Int
  product   Product @relation(fields: [productId], references: [id])
}

model Inventory {
  id         Int     @id @default(autoincrement())
  productId  Int     @unique
  product    Product @relation(fields: [productId], references: [id])
  quantity   Int     @default(0)
  threshold  Int     @default(0)
}

model Cart {
  id        String     @id @default(cuid())
  userId    String?
  user      User?      @relation(fields: [userId], references: [id])
  items     CartItem[]
  currency  String     @default("NGN")
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        Int     @id @default(autoincrement())
  cartId    String
  cart      Cart    @relation(fields: [cartId], references: [id])
  productId Int
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int     @default(1)
  price     Decimal @db.Decimal(10,2)
}

model Order {
  id          String       @id @default(cuid())
  userId      String?
  user        User?        @relation(fields: [userId], references: [id])
  status      OrderStatus  @default(PENDING)
  items       OrderItem[]
  total       Decimal      @db.Decimal(10,2)
  currency    String       @default("NGN")
  shipping    Address?
  shippingId  Int?
  billing     Address?
  billingId   Int?
  payment     Payment?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

enum OrderStatus { PENDING PAID FULFILLED CANCELLED REFUNDED }

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId Int
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Decimal @db.Decimal(10,2)
}

model Address {
  id        Int      @id @default(autoincrement())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  line1     String
  line2     String?
  city      String
  state     String
  country   String    @default("NG")
  postcode  String?
}

model Payment {
  id           String      @id @default(cuid())
  orderId      String?
  order        Order?      @relation(fields: [orderId], references: [id])
  userId       String?
  user         User?       @relation(fields: [userId], references: [id])
  provider     String      // PAYSTACK or FLUTTERWAVE
  reference    String      @unique
  amount       Decimal     @db.Decimal(10,2)
  currency     String      @default("NGN")
  status       PaymentStatus @default(INITIATED)
  raw          Json?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

enum PaymentStatus { INITIATED SUCCESS FAILED REFUNDED }

// Estate
model Property {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  description String?
  type        PropertyType
  address     String
  city        String
  state       String
  country     String       @default("NG")
  price       Decimal?     @db.Decimal(12,2)
  images      PropertyImage[]
  units       Unit[]
  landlord    LandlordProfile? @relation(fields: [landlordId], references: [id])
  landlordId  String?
  isActive    Boolean      @default(true)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

enum PropertyType { RESIDENTIAL COMMERCIAL LAND }

model PropertyImage {
  id         Int      @id @default(autoincrement())
  url        String
  alt        String?
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id])
}

model Unit {
  id          String     @id @default(cuid())
  propertyId  String
  property    Property   @relation(fields: [propertyId], references: [id])
  label       String     // e.g., Flat A, Shop 2B
  bedrooms    Int?
  bathrooms   Int?
  sizeSqm     Int?
  status      UnitStatus @default(AVAILABLE)
  leases      Lease[]
  rent        Decimal?   @db.Decimal(12,2)
}

enum UnitStatus { AVAILABLE OCCUPIED MAINTENANCE }

model TenantProfile {
  id        String  @id @default(cuid())
  user      User    @relation(fields: [userId], references: [id])
  userId    String  @unique
  nin       String? @unique
  phoneAlt  String?
  leases    Lease[]
  tickets   MaintenanceTicket[] @relation("TicketTenant")
}

model LandlordProfile {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String   @unique
  company   String?
  properties Property[]
}

model StaffProfile {
  id       String  @id @default(cuid())
  user     User    @relation(fields: [userId], references: [id])
  userId   String  @unique
  roleNote String?
}

model Lease {
  id         String        @id @default(cuid())
  unitId     String
  unit       Unit          @relation(fields: [unitId], references: [id])
  tenantId   String
  tenant     TenantProfile @relation(fields: [tenantId], references: [id])
  startDate  DateTime
  endDate    DateTime
  deposit    Decimal?      @db.Decimal(12,2)
  rent       Decimal       @db.Decimal(12,2)
  status     LeaseStatus   @default(ACTIVE)
  invoices   Invoice[]
}

enum LeaseStatus { ACTIVE TERMINATED EXPIRED PENDING }

model Invoice {
  id        String    @id @default(cuid())
  leaseId   String
  lease     Lease     @relation(fields: [leaseId], references: [id])
  amount    Decimal   @db.Decimal(12,2)
  dueDate   DateTime
  status    InvoiceStatus @default(PENDING)
  payments  Payment[]
}

enum InvoiceStatus { PENDING PAID OVERDUE CANCELLED }

model MaintenanceTicket {
  id         String     @id @default(cuid())
  title      String
  description String
  status     TicketStatus @default(OPEN)
  priority   TicketPriority @default(MEDIUM)
  authorId   String
  author     User       @relation("TicketAuthor", fields: [authorId], references: [id])
  tenantId   String?
  tenant     TenantProfile? @relation("TicketTenant", fields: [tenantId], references: [id])
  unitId     String?
  unit       Unit?       @relation(fields: [unitId], references: [id])
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

enum TicketStatus { OPEN IN_PROGRESS RESOLVED CLOSED }

enum TicketPriority { LOW MEDIUM HIGH URGENT }

// Assets
model FileAsset {
  id        String   @id @default(cuid())
  key       String   @unique // S3 key
  url       String   // public or signed URL
  type      String
  size      Int
  ownerId   String?
  createdAt DateTime @default(now())
}

// next-auth models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

Seed script (example, TypeScript)
```ts
// packages/db/prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Roles
  const roles = ["ADMIN","STAFF","CUSTOMER","LANDLORD","TENANT"]
  await Promise.all(roles.map(name => prisma.role.upsert({
    where: { name },
    update: {},
    create: { name }
  })))

  // Categories
  const agri = await prisma.category.upsert({
    where: { slug: 'agriculture' },
    update: {},
    create: { slug: 'agriculture', name: 'Agriculture' }
  })
  await prisma.category.upsert({
    where: { slug: 'kitchenware' },
    update: {},
    create: { slug: 'kitchenware', name: 'Kitchenware' }
  })

  // Sample product
  await prisma.product.upsert({
    where: { slug: 'yam-tubers-25kg' },
    update: {},
    create: {
      slug: 'yam-tubers-25kg', sku: 'YAM-25KG', name: 'Yam Tubers (25kg)',
      price: 35000, currency: 'NGN', categoryId: agri.id,
      images: { create: [{ url: 'https://picsum.photos/seed/yam/800/600', alt: 'Yam tubers' }] },
      inventory: { create: { quantity: 100, threshold: 5 } }
    }
  })
}

main().catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect() })
```

---

## 9) Database & migration commands (Prisma + XAMPP)
Setup
```bash
# Install dependencies at monorepo root
npm install

# Generate Prisma client
npx prisma generate --schema packages/db/prisma/schema.prisma

# Create DB (already created via phpMyAdmin)
# Run initial migration
npx prisma migrate dev --name init --schema packages/db/prisma/schema.prisma

# Seed
ts-node packages/db/prisma/seed.ts  # or node --loader ts-node/esm ...
```
Troubleshooting (XAMPP)
- If MySQL auth plugin issues occur, set native password for root or create a dev user.
- Ensure collation is `utf8mb4_unicode_ci` and engine InnoDB.

---

## 10) API design & endpoints (REST + OpenAPI snippet)
Base URL (dev): http://localhost:4000/api

Auth
- POST /auth/login
- POST /auth/register
- POST /auth/refresh

Products
- GET /products
- GET /products/:slug
- POST /products (ADMIN/STAFF)
- PATCH /products/:id (ADMIN/STAFF)

Cart/Orders
- POST /cart/items
- PATCH /cart/items/:id
- POST /orders
- GET /orders/:id

Estate
- GET /properties
- GET /properties/:slug
- POST /properties (ADMIN/LANDLORD)
- POST /tickets (TENANT)
- PATCH /tickets/:id (STAFF/ADMIN)

Payments
- POST /paystack/initialize
- POST /paystack/webhook
- POST /flutterwave/initialize
- POST /flutterwave/webhook

OpenAPI (YAML excerpt)
```yaml
openapi: 3.0.3
info:
  title: IDGM API
  version: 1.0.0
servers:
  - url: http://localhost:4000/api
paths:
  /products:
    get:
      summary: List products
      responses:
        '200':
          description: OK
  /properties:
    get:
      summary: List properties
      responses:
        '200': { description: OK }
```

---

## 11) Data models & ERD (mermaid)
```mermaid
erDiagram
  User ||--o{ UserRole : has
  Role ||--o{ UserRole : maps
  Role ||--o{ Permission : grants

  Category ||--o{ Product : contains
  Product ||--o{ ProductImage : has
  Product ||--|| Inventory : tracks
  Cart ||--o{ CartItem : contains
  User ||--o{ Cart : has
  Order ||--o{ OrderItem : contains
  User ||--o{ Order : places
  Order ||--o{ Payment : has
  Address ||--o{ Order : usedFor
  User ||--o{ Address : has

  Property ||--o{ PropertyImage : has
  Property ||--o{ Unit : contains
  Unit ||--o{ Lease : has
  TenantProfile ||--o{ Lease : signs
  Lease ||--o{ Invoice : billed
  Invoice ||--o{ Payment : settles
  User ||--o{ MaintenanceTicket : creates
  TenantProfile ||--o{ MaintenanceTicket : raises
```

---

## 12) E‑commerce functional spec (MVP)
Catalog
- Categories (two-level ok). Product attributes via JSON.
- Product images stored in S3 with signed upload.

Cart & Checkout
- Anonymous cart via cookie; merge on login.
- Address capture, shipping method (flat or pickup), order summary.
- Payments via Paystack/Flutterwave.

Orders
- Status flow: PENDING → PAID → FULFILLED/REFUNDED/CANCELLED.
- Webhooks update payment status; inventory decremented on successful payment.

Admin
- CRUD products/categories, inventory management, order list/export.

---

## 13) Estate Management spec (MVP)
Properties & Units
- Create properties and units with media.
- Availability and rent fields.

Leases
- Generate leases with start/end dates, rent amount, deposit.
- Create invoices per lease cycle (monthly/quarterly) via cron/worker.

Tenants
- Tenant profile linked to User. Applications & viewing requests.

Maintenance
- Tenants create tickets; staff change status; add notes/photos.

Dashboards
- Landlord view: properties, occupancy, income.
- Tenant portal: leases, invoices, payments, tickets.

---

## 14) Admin dashboard & RBAC
Roles
- ADMIN (full), STAFF (ops), CUSTOMER (shop), LANDLORD (estate owner), TENANT (occupant).
Permissions (examples)
- product.read/write, order.read, property.manage, ticket.manage, lease.manage.
Implementation
- Issue JWT with role claims; middleware checks on API routes.
- In next-auth, hydrate session.user.roles for client-side gating.

---

## 15) Background jobs & event flows
- Inventory low alert (threshold) → email to staff.
- Lease invoice generation (cron monthly) → create Invoice records.
- Ticket SLA reminders.
- Payment webhooks → verify → update Payment/Order/Invoice → emit events for email/SMS.

---

## 16) UX, SEO and performance rules
- Mobile-first, Tailwind responsive utilities.
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Next.js Image Optimization with S3 loader.
- Metadata: OpenGraph/Twitter cards; Nigerian locale (en-NG), currency NGN.
- Structured data for products and properties (JSON-LD).
- Pagination and faceted filters (Algolia optional).

---

## 17) Payments & compliance (NG)
- Paystack and Flutterwave SDKs; server-side verification.
- Handle bank transfer/manual proof upload for estates.
- NDPR compliance: data minimization, user consent, data subject rights.
- PCI: never store raw card data; rely on provider tokens.

---

## 18) CI/CD, hosting & deployment checklist
- Frontend: Vercel projects for web/admin/estate apps.
- Backend: Fly.io/Render with Dockerfile; environment variables from secrets manager.
- DB: Managed MySQL (PlanetScale/AWS RDS) in prod.
- CI (GitHub Actions):
  - Lint, type-check, test.
  - Prisma migrate deploy on backend release.
  - Build and deploy per app.

---

## 19) Testing strategy & acceptance criteria
- Unit: utils, hooks, services (Jest + ts-jest).
- Integration: API routes with supertest.
- E2E: Playwright (checkout, payment callback mocks, tenant ticket flow).
- Accessibility: axe linter + manual checks.
- Acceptance examples:
  - A visitor can buy a product end-to-end using Paystack test keys.
  - A tenant can submit a ticket and staff can resolve it.

---

## 20) Security checklist
- HTTPS everywhere in prod.
- Helmet, CORS with allowlist.
- Input validation (zod/class-validator) and centralized error handling.
- Parameterized queries via Prisma only.
- Secrets in env; rotate regularly.
- Rate limiting on auth/payment endpoints.
- Signed URLs for private assets; least privilege on S3.

---

## 21) Monitoring, backups & operational runbook
- Logs: JSON logs to provider (Render/Fly) + retention.
- Metrics: Uptime, response time, queue depth.
- Alerts: payment failures, webhook errors, job retries.
- Backups: nightly MySQL snapshots; test restores monthly.
- Runbook: payment incident flow, DB restore steps, rollback strategy.

---

## 22) Deliverables & next steps
MVP deliverables
- Web app with catalog, product detail, cart/checkout.
- Estate portal with properties, leases (basic), maintenance tickets.
- Admin dashboard with CRUD for products/properties and ticket handling.
- Payments integrated (sandbox), invoices for leases.

Next steps
1. Initialize monorepo (npm workspaces) and Next.js apps.
2. Apply Prisma schema and run initial migration.
3. Build API scaffolding (NestJS) with auth and key endpoints.
4. Implement product catalog, cart, checkout pages.
5. Implement property listing and tenant ticket flows.
6. Harden RBAC and admin UI.

---

## 23) Appendix: Short AI prompts, useful scripts, references
Short prompts
- "Write a NestJS controller for /products with list and detail endpoints using Prisma."
- "Create a Next.js app router page for /shop/[slug] that fetches product by slug and renders SEO tags."
- "Implement a BullMQ worker that generates monthly invoices for active leases."

Useful scripts (package.json root)
```json
{
  "private": true,
  "workspaces": ["apps/*", "packages/*", "backend/*"],
  "scripts": {
    "dev:web": "next dev -p 3000 apps/web",
    "dev:admin": "next dev -p 3001 apps/admin",
    "dev:estate": "next dev -p 3002 apps/estate",
    "dev:api": "nest start --watch backend/api",
    "db:gen": "prisma generate --schema packages/db/prisma/schema.prisma",
    "db:migrate": "prisma migrate dev --schema packages/db/prisma/schema.prisma",
    "db:seed": "ts-node packages/db/prisma/seed.ts"
  }
}
```

References
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Paystack: https://paystack.com/docs
- Flutterwave: https://developer.flutterwave.com/
- BullMQ: https://docs.bullmq.io/
- NDPR: https://ndpr.nitda.gov.ng/

---

Notes
- This guide is production-minded but optimized for local dev with XAMPP.
- Replace sandbox keys and secrets before deploying.