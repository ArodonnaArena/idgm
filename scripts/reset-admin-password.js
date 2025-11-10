#!/usr/bin/env node
/*
  Reset a user's password (hashes with bcrypt) using Prisma.
  Usage:
    node scripts/reset-admin-password.js <email> <newPassword>
  If not provided, defaults to admin@idgm.com / admin123
*/
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const email = process.argv[2] || 'admin@idgm.com'
const password = process.argv[3] || 'admin123'

async function run() {
  const prisma = new PrismaClient()
  try {
    console.log(`Looking up user by email: ${email}`)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.error(`User not found: ${email}`)
      process.exitCode = 2
      return
    }
    const hash = await bcrypt.hash(password, 10)
    await prisma.user.update({ where: { email }, data: { passwordHash: hash } })
    console.log(`Password for ${email} updated to '${password}' (hashed).`)
  } catch (err) {
    console.error('Error resetting password:', err)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

run()
