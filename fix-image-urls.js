#!/usr/bin/env node

/**
 * Script to update existing product image URLs from http:// to https://
 * This ensures that product images stored in the database work correctly
 * when the frontend is served over HTTPS (Vercel)
 * 
 * Usage: node fix-image-urls.js [dry-run]
 * Example: node fix-image-urls.js true   (shows what would be changed)
 * Example: node fix-image-urls.js false  (applies the changes)
 */

require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PUBLIC_API_URL = process.env.PUBLIC_API_URL || 'https://idgm-backend.onrender.com';
const isDryRun = process.argv[2] === 'true' || !process.argv[2];

async function fixImageUrls() {
  try {
    console.log(`🔍 Scanning for products with image URLs...\n`);
    console.log(`📝 Configuration:`);
    console.log(`   Public API URL: ${PUBLIC_API_URL}`);
    console.log(`   Dry Run: ${isDryRun ? 'YES' : 'NO'}\n`);

    // Fetch all products with images
    const products = await prisma.product.findMany({
      include: { images: true },
    });

    if (products.length === 0) {
      console.log('ℹ️  No products found.');
      return;
    }

    let updatedCount = 0;
    let updatedUrlsCount = 0;

    for (const product of products) {
      if (!product.images || product.images.length === 0) continue;

      let productHasChanges = false;

      for (const image of product.images) {
        // Check if URL needs updating
        if (image.url && !image.url.startsWith('https://')) {
          productHasChanges = true;
          updatedUrlsCount++;

          let newUrl = image.url;

          // If it's an http:// URL, replace with https
          if (image.url.startsWith('http://')) {
            newUrl = image.url.replace('http://', 'https://');
          } else if (image.url.startsWith('/uploads/')) {
            // If it's a relative path, make it absolute with the public URL
            newUrl = `${PUBLIC_API_URL}${image.url}`;
          }

          if (!isDryRun) {
            await prisma.productImage.update({
              where: { id: image.id },
              data: { url: newUrl },
            });
          }

          console.log(`  📷 Image: ${image.id}`);
          console.log(`     Old: ${image.url}`);
          console.log(`     New: ${newUrl}\n`);
        }
      }

      if (productHasChanges) {
        updatedCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Products with updated images: ${updatedCount}`);
    console.log(`   Total URLs updated: ${updatedUrlsCount}`);

    if (isDryRun && updatedUrlsCount > 0) {
      console.log(`\n💡 This was a DRY RUN. To apply changes, run:`);
      console.log(`   node fix-image-urls.js false\n`);
    } else if (!isDryRun && updatedUrlsCount > 0) {
      console.log(`\n✅ Updated ${updatedUrlsCount} image URLs in the database!\n`);
    } else {
      console.log(`\n✅ All image URLs are already in the correct format.\n`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixImageUrls();
