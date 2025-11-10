# Seed Database Using MongoDB Compass

## Steps:

1. **Open MongoDB Compass**

2. **Connect to**: `mongodb://localhost:27017`

3. **Click on `idgm_db` database** (should already exist)

4. **Click the ">_MONGOSH" button** at the bottom (this opens MongoDB Shell)

5. **Copy and paste the following commands** one by one:

---

## Commands to Run:

```javascript
// 1. Insert Roles
db.Role.insertMany([
  {name: "ADMIN", description: "ADMIN role", createdAt: new Date(), updatedAt: new Date()},
  {name: "STAFF", description: "STAFF role", createdAt: new Date(), updatedAt: new Date()},
  {name: "CUSTOMER", description: "CUSTOMER role", createdAt: new Date(), updatedAt: new Date()},
  {name: "LANDLORD", description: "LANDLORD role", createdAt: new Date(), updatedAt: new Date()},
  {name: "TENANT", description: "TENANT role", createdAt: new Date(), updatedAt: new Date()}
])
```

```javascript
// 2. Insert Categories and save IDs
const agri = db.Category.insertOne({slug: "agriculture", name: "Agriculture"})
const kitchen = db.Category.insertOne({slug: "kitchenware", name: "Kitchenware"})
```

```javascript
// 3. Insert Products
const prod1 = db.Product.insertOne({
  slug: "yam-tubers-25kg",
  sku: "YAM-25KG",
  name: "Yam Tubers (25kg)",
  description: "Fresh premium yam tubers",
  price: 35000,
  currency: "NGN",
  categoryId: agri.insertedId,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})

const prod2 = db.Product.insertOne({
  slug: "rice-50kg",
  sku: "RICE-50KG",
  name: "Premium Rice (50kg)",
  description: "High-quality parboiled rice",
  price: 45000,
  compareAt: 50000,
  currency: "NGN",
  categoryId: agri.insertedId,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})

const prod3 = db.Product.insertOne({
  slug: "stainless-steel-pot-set",
  sku: "SSPOTS-SET",
  name: "Stainless Steel Pot Set",
  description: "Premium 5-piece stainless steel cooking pot set",
  price: 28000,
  currency: "NGN",
  categoryId: kitchen.insertedId,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

```javascript
// 4. Insert Product Images
db.ProductImage.insertMany([
  {url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800", alt: "Yam tubers", productId: prod1.insertedId},
  {url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800", alt: "Rice grains", productId: prod2.insertedId},
  {url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", alt: "Pot set", productId: prod3.insertedId}
])
```

```javascript
// 5. Insert Inventory
db.Inventory.insertMany([
  {productId: prod1.insertedId, quantity: 100, threshold: 10},
  {productId: prod2.insertedId, quantity: 75, threshold: 15},
  {productId: prod3.insertedId, quantity: 50, threshold: 5}
])
```

```javascript
// 6. Create Admin User
const adminRole = db.Role.findOne({name: "ADMIN"})
const admin = db.User.insertOne({
  email: "admin@idgm.com",
  name: "Admin User",
  passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/sQ2PQ3G4u",
  status: "ACTIVE",
  createdAt: new Date(),
  updatedAt: new Date()
})

db.StaffProfile.insertOne({userId: admin.insertedId, roleNote: "System Administrator"})
db.UserRole.insertOne({userId: admin.insertedId, roleId: adminRole._id})
```

```javascript
// 7. Verify data
print("Roles: " + db.Role.countDocuments())
print("Categories: " + db.Category.countDocuments())
print("Products: " + db.Product.countDocuments())
print("Users: " + db.User.countDocuments())
print("\n✅ Seeding complete!")
print("\nLogin credentials:")
print("Email: admin@idgm.com")
print("Password: admin123")
```

---

## That's it!

Your database is now seeded with:
- 5 Roles (ADMIN, STAFF, CUSTOMER, LANDLORD, TENANT)
- 2 Categories (Agriculture, Kitchenware)
- 3 Products (Yam, Rice, Pot Set)
- 1 Admin User (admin@idgm.com / admin123)

Now you can run your app: `npm run dev:web`
