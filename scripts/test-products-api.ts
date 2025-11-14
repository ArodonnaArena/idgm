import fetch from 'node-fetch'

const BACKEND_URL = process.env.BACKEND_URL || 'https://your-backend.onrender.com'
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://idgm-web.vercel.app'

async function testEndpoint(name: string, url: string) {
  console.log(`\n📍 Testing: ${name}`)
  console.log(`   URL: ${url}`)
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Test-Script'
      }
    })
    
    console.log(`   Status: ${res.status} ${res.statusText}`)
    
    if (res.ok) {
      const data = await res.json()
      
      if (Array.isArray(data)) {
        console.log(`   ✅ Array with ${data.length} items`)
      } else if (data.products) {
        console.log(`   ✅ Response has products: ${data.products.length} items`)
      } else if (data.featuredProducts) {
        console.log(`   ✅ Response has featuredProducts: ${data.featuredProducts.length} items`)
      } else {
        console.log(`   ✅ Response keys: ${Object.keys(data).join(', ')}`)
      }
      
      return data
    } else {
      const text = await res.text()
      console.log(`   ❌ Error response: ${text.substring(0, 200)}`)
    }
  } catch (error) {
    console.log(`   ❌ Fetch error: ${error.message}`)
  }
}

async function main() {
  console.log('🧪 Testing Product API Endpoints')
  console.log('='.repeat(50))
  
  // Test backend API
  await testEndpoint('Backend /api/products', `${BACKEND_URL}/api/products`)
  
  // Test frontend API proxies
  await testEndpoint('Frontend /api/products', `${FRONTEND_URL}/api/products`)
  await testEndpoint('Frontend /api/homepage', `${FRONTEND_URL}/api/homepage`)
  
  console.log('\n' + '='.repeat(50))
  console.log('✨ Test complete')
}

main().catch(console.error)
