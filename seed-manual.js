// MongoDB Shell Script to Seed Database Manually
// Run this with: mongosh mongodb://localhost:27017/idgm_db < seed-manual.js

// Use the database
use('idgm_db');

// Insert Roles
print('Creating roles...');
db.Role.insertMany([
  { name: 'ADMIN', description: 'ADMIN role', createdAt: new Date(), updatedAt: new Date() },
  { name: 'STAFF', description: 'STAFF role', createdAt: new Date(), updatedAt: new Date() },
  { name: 'CUSTOMER', description: 'CUSTOMER role', createdAt: new Date(), updatedAt: new Date() },
  { name: 'LANDLORD', description: 'LANDLORD role', createdAt: new Date(), updatedAt: new Date() },
  { name: 'TENANT', description: 'TENANT role', createdAt: new Date(), updatedAt: new Date() }
]);

// Insert Categories
print('Creating categories...');
const agriResult = db.Category.insertOne({
  slug: 'agriculture',
  name: 'Agriculture',
  parentId: null
});

const kitchenResult = db.Category.insertOne({
  slug: 'kitchenware',
  name: 'Kitchenware',
  parentId: null
});

// Insert Subcategories
db.Category.insertMany([
  { slug: 'crops', name: 'Crops', parentId: agriResult.insertedId },
  { slug: 'kitchen-utensils', name: 'Kitchen Utensils', parentId: kitchenResult.insertedId }
]);

// Insert Products
print('Creating products...');
const product1 = db.Product.insertOne({
  slug: 'yam-tubers-25kg',
  sku: 'YAM-25KG',
  name: 'Yam Tubers (25kg)',
  description: 'Fresh premium yam tubers, perfect for your family meals.',
  price: 35000,
  currency: 'NGN',
  categoryId: agriResult.insertedId,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

const product2 = db.Product.insertOne({
  slug: 'rice-50kg',
  sku: 'RICE-50KG',
  name: 'Premium Rice (50kg)',
  description: 'High-quality parboiled rice from Nigeria.',
  price: 45000,
  compareAt: 50000,
  currency: 'NGN',
  categoryId: agriResult.insertedId,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

const product3 = db.Product.insertOne({
  slug: 'stainless-steel-pot-set',
  sku: 'SSPOTS-SET',
  name: 'Stainless Steel Pot Set',
  description: 'Premium 5-piece stainless steel cooking pot set.',
  price: 28000,
  currency: 'NGN',
  categoryId: kitchenResult.insertedId,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Insert Product Images
db.ProductImage.insertMany([
  {
    url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop',
    alt: 'Fresh yam tubers',
    productId: product1.insertedId
  },
  {
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop',
    alt: 'Premium rice grains',
    productId: product2.insertedId
  },
  {
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    alt: 'Stainless steel pot set',
    productId: product3.insertedId
  }
]);

// Insert Inventory
db.Inventory.insertMany([
  { productId: product1.insertedId, quantity: 100, threshold: 10 },
  { productId: product2.insertedId, quantity: 75, threshold: 15 },
  { productId: product3.insertedId, quantity: 50, threshold: 5 }
]);

// Insert Admin User
print('Creating admin user...');
const adminRole = db.Role.findOne({ name: 'ADMIN' });

if (adminRole) {
  const adminUser = db.User.insertOne({
    email: 'admin@idgm.com',
    name: 'Admin User',
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/sQ2PQ3G4u', // password: admin123
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Create Staff Profile
  db.StaffProfile.insertOne({
    userId: adminUser.insertedId,
    roleNote: 'System Administrator'
  });

  // Assign Admin Role
  db.UserRole.insertOne({
    userId: adminUser.insertedId,
    roleId: adminRole._id
  });

  print(`✅ Admin user created: admin@idgm.com`);
}

print('✅ Database seeding complete!');
print('');
print('Default credentials:');
print('  Email: admin@idgm.com');
print('  Password: admin123');
