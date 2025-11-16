#!/usr/bin/env node

/**
 * Test script to verify the backend upload endpoint returns HTTPS absolute URLs
 * Usage: node test-upload.js <image-path-or-url> [backend-url]
 * Examples:
 *   node test-upload.js ./sample.jpg
 *   node test-upload.js ./sample.jpg https://idgm-backend.onrender.com
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

const imagePath = process.argv[2] || './sample.jpg';
const backendUrl = (process.argv[3] || 'https://idgm-backend.onrender.com').replace(/\/$/, '');

async function testUpload() {
  try {
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ File not found: ${imagePath}`);
      process.exit(1);
    }

    console.log(`📤 Testing upload to ${backendUrl}/api/upload/image`);
    console.log(`📁 File: ${imagePath}\n`);

    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    // Send request
    const response = await fetch(`${backendUrl}/api/upload/image`, {
      method: 'POST',
      body: form,
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Upload successful!\n');
      console.log('Response:');
      console.log(JSON.stringify(data, null, 2));

      // Validate URL
      if (data.url) {
        if (data.url.startsWith('https://')) {
          console.log('\n✅ URL is HTTPS (good for Vercel frontend!)');
        } else if (data.url.startsWith('http://')) {
          console.log('\n⚠️  WARNING: URL is HTTP (may cause mixed-content issues on HTTPS frontend)');
        } else {
          console.log('\n⚠️  WARNING: URL is relative or unexpected format');
        }
      }
    } else {
      console.error(`❌ Upload failed with status ${response.status}`);
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testUpload();
