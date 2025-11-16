#!/usr/bin/env node

/**
 * Quick verification script to check backend configuration
 * Usage: node verify-backend-config.js [backend-url]
 */

const fetch = require('node-fetch');

const backendUrl = (process.argv[2] || 'https://idgm-backend.onrender.com').replace(/\/$/, '');

async function verify() {
  try {
    console.log(`🔍 Verifying backend at ${backendUrl}\n`);

    // Test 1: Check if backend is responding
    console.log('1️⃣  Testing backend connectivity...');
    const healthCheck = await fetch(`${backendUrl}/api/products`, { method: 'GET' });
    if (healthCheck.ok) {
      console.log('   ✅ Backend is responsive\n');
    } else {
      console.log(`   ❌ Backend returned ${healthCheck.status}\n`);
    }

    // Test 2: Try login with default credentials
    console.log('2️⃣  Testing login endpoint...');
    const loginRes = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@idgm.com', password: 'admin123' }),
    });

    if (loginRes.ok) {
      const loginData = await loginRes.json();
      console.log('   ✅ Login successful');
      if (loginData.accessToken) {
        console.log(`   ✅ Token received (length: ${loginData.accessToken.length})\n`);
      }
    } else {
      console.log(`   ⚠️  Login failed with status ${loginRes.status}\n`);
    }

    // Test 3: Check CORS headers
    console.log('3️⃣  Checking CORS configuration...');
    const corsTest = await fetch(`${backendUrl}/api/products`, {
      method: 'OPTIONS',
      headers: { 'Origin': 'https://idgm-web.vercel.app' },
    });
    const corsHeader = corsTest.headers.get('access-control-allow-origin');
    if (corsHeader) {
      console.log(`   ✅ CORS enabled: ${corsHeader}\n`);
    } else {
      console.log('   ⚠️  No CORS header found\n');
    }

    console.log('📋 Summary:');
    console.log(`   Backend URL: ${backendUrl}`);
    console.log(`   Status: ${healthCheck.ok ? '✅ Online' : '❌ Unreachable'}`);
    console.log('\n💡 Next step: Set PUBLIC_API_URL in Render environment if not done yet.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verify();
