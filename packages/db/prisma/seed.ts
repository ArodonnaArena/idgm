import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')
  console.log('⚠️  Note: If you see duplicate errors, the data already exists!')

  // Create roles
  console.log('Creating roles...')
  const roles = ['ADMIN', 'STAFF', 'CUSTOMER', 'LANDLORD', 'TENANT']
  for (const name of roles) {
    await prisma.role.create({
      data: {
        name,
        description: `${name} role`,
      },
    })
  }

  // Create categories
  console.log('Creating categories...')
  const agriCategory = await prisma.category.create({
    data: {
      slug: 'agriculture',
      name: 'Agriculture',
    },
  })

  const kitchenwareCategory = await prisma.category.create({
    data: {
      slug: 'kitchenware',
      name: 'Kitchenware',
    },
  })

  // Create subcategories
  await prisma.category.create({
    data: {
      slug: 'crops',
      name: 'Crops',
      parentId: agriCategory.id,
    },
  })

  await prisma.category.create({
    data: {
      slug: 'kitchen-utensils',
      name: 'Kitchen Utensils',
      parentId: kitchenwareCategory.id,
    },
  })

  // Create sample products
  console.log('Creating sample products...')
  await prisma.product.create({
    data: {
      slug: 'yam-tubers-25kg',
      sku: 'YAM-25KG',
      name: 'Yam Tubers (25kg)',
      description: 'Fresh premium yam tubers, perfect for your family meals.',
      price: 35000,
      currency: 'NGN',
      categoryId: agriCategory.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop',
            alt: 'Fresh yam tubers',
          },
        ],
      },
      inventory: {
        create: {
          quantity: 100,
          threshold: 10,
        },
      },
    },
  })

  await prisma.product.create({
    data: {
      slug: 'rice-50kg',
      sku: 'RICE-50KG',
      name: 'Premium Rice (50kg)',
      description: 'High-quality parboiled rice from Nigeria.',
      price: 45000,
      compareAt: 50000,
      currency: 'NGN',
      categoryId: agriCategory.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop',
            alt: 'Premium rice grains',
          },
        ],
      },
      inventory: {
        create: {
          quantity: 75,
          threshold: 15,
        },
      },
    },
  })

  await prisma.product.create({
    data: {
      slug: 'stainless-steel-pot-set',
      sku: 'SSPOTS-SET',
      name: 'Stainless Steel Pot Set',
      description: 'Premium 5-piece stainless steel cooking pot set.',
      price: 28000,
      currency: 'NGN',
      categoryId: kitchenwareCategory.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            alt: 'Stainless steel pot set',
          },
        ],
      },
      inventory: {
        create: {
          quantity: 50,
          threshold: 5,
        },
      },
    },
  })

  // Create admin user
  console.log('Creating admin user...')
  const adminRole = await prisma.role.findUnique({
    where: { name: 'ADMIN' },
  })

  if (adminRole) {
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@idgm.com',
        name: 'Admin User',
        passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/sQ2PQ3G4u', // password: admin123
        roles: {
          create: {
            roleId: adminRole.id,
          },
        },
        staffProfile: {
          create: {
            roleNote: 'System Administrator',
          },
        },
      },
    })
    console.log(`✅ Admin user created: ${adminUser.email}`)
  }

  console.log('✅ Database has been seeded!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
