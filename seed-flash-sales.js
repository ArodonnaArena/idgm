const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedFlashSales() {
  console.log('🔥 Seeding flash sales...')

  try {
    // Get some active products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: 4,
      include: {
        inventory: true
      }
    })

    if (products.length === 0) {
      console.log('❌ No products found. Please seed products first.')
      return
    }

    // Delete existing flash sales
    await prisma.flashSale.deleteMany({})
    console.log('🗑️  Cleared existing flash sales')

    // Create flash sales for each product
    const flashSales = []
    const now = new Date()
    
    for (const product of products) {
      const discountPercent = Math.floor(Math.random() * 30) + 20 // 20-50% discount
      const flashPrice = product.price * (1 - discountPercent / 100)
      
      // Flash sale starts now and ends in 24 hours
      const startTime = now
      const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      
      const flashSale = await prisma.flashSale.create({
        data: {
          name: `Flash Sale: ${product.name}`,
          description: `Limited time offer! Get ${discountPercent}% off on ${product.name}`,
          productId: product.id,
          discountPercent,
          flashPrice,
          startTime,
          endTime,
          maxQuantity: Math.min(product.inventory?.quantity || 10, 50), // Limit to 50 or available stock
          soldCount: Math.floor(Math.random() * 10), // Random sold count for demo
          isActive: true
        },
        include: {
          product: {
            include: {
              category: true,
              images: true
            }
          }
        }
      })

      flashSales.push(flashSale)
      console.log(`✅ Created flash sale for ${product.name} - ${discountPercent}% off (₦${product.price} → ₦${flashPrice.toFixed(2)})`)
    }

    console.log(`\n🎉 Successfully created ${flashSales.length} flash sales!`)
    console.log(`⏰ All flash sales end in 24 hours from now`)
    
    // Display flash sale summary
    console.log('\n📊 Flash Sale Summary:')
    for (const sale of flashSales) {
      console.log(`   - ${sale.product.name}: ${sale.discountPercent}% OFF | Ends: ${sale.endTime.toLocaleString()}`)
    }

  } catch (error) {
    console.error('❌ Error seeding flash sales:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedFlashSales()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
