const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testFlashSales() {
  console.log('🔍 Testing flash sale data...\n')

  try {
    // Check if FlashSale model exists
    const flashSales = await prisma.flashSale.findMany({
      include: {
        product: {
          include: {
            images: true,
            category: true
          }
        }
      }
    })

    console.log(`📊 Found ${flashSales.length} flash sales in database\n`)

    if (flashSales.length === 0) {
      console.log('❌ No flash sales found!')
      console.log('💡 Run: node seed-flash-sales.js')
      return
    }

    // Display flash sale details
    flashSales.forEach((sale, index) => {
      console.log(`\n${index + 1}. ${sale.name}`)
      console.log(`   Product: ${sale.product.name}`)
      console.log(`   Discount: ${sale.discountPercent}%`)
      console.log(`   Flash Price: ₦${sale.flashPrice.toFixed(2)}`)
      console.log(`   Original Price: ₦${sale.product.price}`)
      console.log(`   Start Time: ${sale.startTime.toISOString()}`)
      console.log(`   End Time: ${sale.endTime.toISOString()}`)
      console.log(`   Is Active: ${sale.isActive}`)
      console.log(`   Status: ${new Date() < sale.startTime ? 'Scheduled' : new Date() > sale.endTime ? 'Expired' : 'Active'}`)
      
      // Check if dates are valid
      const now = new Date()
      const start = new Date(sale.startTime)
      const end = new Date(sale.endTime)
      const timeLeft = end.getTime() - now.getTime()
      
      if (timeLeft > 0) {
        const hours = Math.floor(timeLeft / (1000 * 60 * 60))
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        console.log(`   ⏰ Time Left: ${hours}h ${minutes}m`)
      }
    })

    console.log('\n✅ Flash sale data looks good!')
    console.log('🌐 Check your homepage to see the countdown timer')

  } catch (error) {
    console.error('❌ Error:', error.message)
    
    if (error.message.includes('Unknown arg `include`')) {
      console.log('\n⚠️  FlashSale model not found in database!')
      console.log('📝 You need to run database migration:')
      console.log('   cd packages/db')
      console.log('   npx prisma generate')
      console.log('   npx prisma db push')
    }
  } finally {
    await prisma.$disconnect()
  }
}

testFlashSales()
