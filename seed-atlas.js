// Seed Atlas DB using process.env.DATABASE_URL
// Run: node seed-atlas.js

const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

async function run() {
  const uri = process.env.DATABASE_URL
  if (!uri) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }
  const url = new URL(uri)
  const dbName = (url.pathname && url.pathname.replace('/', '')) || 'idgm_db'

  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)

    // Collections
    const Role = db.collection('Role')
    const Permission = db.collection('Permission')
    const Category = db.collection('Category')
    const Product = db.collection('Product')
    const ProductImage = db.collection('ProductImage')
    const Inventory = db.collection('Inventory')
    const User = db.collection('User')
    const UserRole = db.collection('UserRole')
    const StaffProfile = db.collection('StaffProfile')

    // Roles
    const now = new Date()
    const roles = [
      { name: 'ADMIN', description: 'ADMIN role', createdAt: now, updatedAt: now },
      { name: 'STAFF', description: 'STAFF role', createdAt: now, updatedAt: now },
      { name: 'CUSTOMER', description: 'CUSTOMER role', createdAt: now, updatedAt: now },
      { name: 'LANDLORD', description: 'LANDLORD role', createdAt: now, updatedAt: now },
      { name: 'TENANT', description: 'TENANT role', createdAt: now, updatedAt: now },
    ]

    for (const r of roles) {
      await Role.updateOne({ name: r.name }, { $setOnInsert: r }, { upsert: true })
    }

    // Categories
    const agriRes = await Category.findOneAndUpdate(
      { slug: 'agriculture' },
      { $setOnInsert: { slug: 'agriculture', name: 'Agriculture', parentId: null } },
      { upsert: true, returnDocument: 'after' }
    )
    const kitchenRes = await Category.findOneAndUpdate(
      { slug: 'kitchenware' },
      { $setOnInsert: { slug: 'kitchenware', name: 'Kitchenware', parentId: null } },
      { upsert: true, returnDocument: 'after' }
    )
    const agri = agriRes.value || (await Category.findOne({ slug: 'agriculture' }))
    const kitchen = kitchenRes.value || (await Category.findOne({ slug: 'kitchenware' }))

    await Category.updateOne(
      { slug: 'crops' },
      { $setOnInsert: { slug: 'crops', name: 'Crops', parentId: agri?._id || null } },
      { upsert: true }
    )
    await Category.updateOne(
      { slug: 'kitchen-utensils' },
      { $setOnInsert: { slug: 'kitchen-utensils', name: 'Kitchen Utensils', parentId: kitchen?._id || null } },
      { upsert: true }
    )

    // Products
    const p1Res = await Product.findOneAndUpdate(
      { slug: 'yam-tubers-25kg' },
      {
        $setOnInsert: {
          slug: 'yam-tubers-25kg',
          sku: 'YAM-25KG',
          name: 'Yam Tubers (25kg)',
          description: 'Fresh premium yam tubers, perfect for your family meals.',
          price: 35000,
          currency: 'NGN',
          categoryId: agri?._id || null,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true, returnDocument: 'after' }
    )

    const p2Res = await Product.findOneAndUpdate(
      { slug: 'rice-50kg' },
      {
        $setOnInsert: {
          slug: 'rice-50kg',
          sku: 'RICE-50KG',
          name: 'Premium Rice (50kg)',
          description: 'High-quality parboiled rice from Nigeria.',
          price: 45000,
          compareAt: 50000,
          currency: 'NGN',
          categoryId: agri?._id || null,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true, returnDocument: 'after' }
    )

    const p3Res = await Product.findOneAndUpdate(
      { slug: 'stainless-steel-pot-set' },
      {
        $setOnInsert: {
          slug: 'stainless-steel-pot-set',
          sku: 'SSPOTS-SET',
          name: 'Stainless Steel Pot Set',
          description: 'Premium 5-piece stainless steel cooking pot set.',
          price: 28000,
          currency: 'NGN',
          categoryId: kitchen?._id || null,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true, returnDocument: 'after' }
    )

    const p1 = p1Res.value || (await Product.findOne({ slug: 'yam-tubers-25kg' }))
    const p2 = p2Res.value || (await Product.findOne({ slug: 'rice-50kg' }))
    const p3 = p3Res.value || (await Product.findOne({ slug: 'stainless-steel-pot-set' }))

    // Images
    await ProductImage.updateOne(
      { productId: p1._id },
      {
        $setOnInsert: {
          url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop',
          alt: 'Fresh yam tubers',
          productId: p1._id,
        },
      },
      { upsert: true }
    )
    await ProductImage.updateOne(
      { productId: p2._id },
      {
        $setOnInsert: {
          url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop',
          alt: 'Premium rice grains',
          productId: p2._id,
        },
      },
      { upsert: true }
    )
    await ProductImage.updateOne(
      { productId: p3._id },
      {
        $setOnInsert: {
          url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
          alt: 'Stainless steel pot set',
          productId: p3._id,
        },
      },
      { upsert: true }
    )

    // Inventory
    await Inventory.updateOne(
      { productId: p1._id },
      { $setOnInsert: { productId: p1._id, quantity: 100, threshold: 10 } },
      { upsert: true }
    )
    await Inventory.updateOne(
      { productId: p2._id },
      { $setOnInsert: { productId: p2._id, quantity: 75, threshold: 15 } },
      { upsert: true }
    )
    await Inventory.updateOne(
      { productId: p3._id },
      { $setOnInsert: { productId: p3._id, quantity: 50, threshold: 5 } },
      { upsert: true }
    )

    // Admin user
    const adminRole = await Role.findOne({ name: 'ADMIN' })
    if (adminRole) {
      const adminRes = await User.findOneAndUpdate(
        { email: 'admin@idgm.com' },
        {
          $setOnInsert: {
            email: 'admin@idgm.com',
            name: 'Admin User',
            passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/sQ2PQ3G4u', // admin123
            status: 'ACTIVE',
            createdAt: now,
            updatedAt: now,
          },
        },
        { upsert: true, returnDocument: 'after' }
      )
      const admin = adminRes.value || (await User.findOne({ email: 'admin@idgm.com' }))
      if (admin && adminRole?._id) {
        await StaffProfile.updateOne(
          { userId: admin._id },
          { $setOnInsert: { userId: admin._id, roleNote: 'System Administrator' } },
          { upsert: true }
        )

        await UserRole.updateOne(
          { userId: admin._id, roleId: adminRole._id },
          { $setOnInsert: { userId: admin._id, roleId: adminRole._id } },
          { upsert: true }
        )
      }
    }

    console.log('✅ Atlas database seed complete.')
  } finally {
    await client.close()
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
