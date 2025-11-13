import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4] || 'Admin User'

  if (!email || !password) {
    console.error('Usage: npm run create-admin <email> <password> [name]')
    console.error('Example: npm run create-admin admin@idgm.com MySecurePass123 "Admin User"')
    process.exit(1)
  }

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      console.error(`User with email ${email} already exists!`)
      process.exit(1)
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create or find admin role
    let adminRole = await prisma.role.findUnique({ where: { name: 'admin' } })
    if (!adminRole) {
      console.log('Creating admin role...')
      adminRole = await prisma.role.create({
        data: {
          name: 'admin',
          description: 'Administrator with full access',
        },
      })
    }

    // Create user with admin role
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        status: 'ACTIVE',
        roles: {
          create: {
            roleId: adminRole.id,
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log(`Email: ${user.email}`)
    console.log(`Name: ${user.name}`)
    console.log(`Role: ${user.roles[0].role.name}`)
    console.log('\nYou can now login at your admin URL with these credentials.')
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
