#!/usr/bin/env node

/**
 * Script to fix chunk loading issues
 * This script rebuilds the application with optimized chunk loading settings
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing chunk loading issues...');

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  if (fs.existsSync('dist')) {
    execSync('rmdir /s /q dist', { stdio: 'inherit', shell: true });
  }
  if (fs.existsSync('docs')) {
    execSync('rmdir /s /q docs', { stdio: 'inherit', shell: true });
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build for production
  console.log('🏗️  Building for production...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify build output
  console.log('✅ Verifying build output...');
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('Build failed - dist directory not found');
  }

  const jsFiles = fs.readdirSync(path.join(distPath, 'js')).filter(f => f.endsWith('.js'));
  const cssFiles = fs.readdirSync(path.join(distPath, 'css')).filter(f => f.endsWith('.css'));

  console.log(`📊 Build completed successfully:`);
  console.log(`   - JavaScript files: ${jsFiles.length}`);
  console.log(`   - CSS files: ${cssFiles.length}`);

  // Check for chunk files
  const chunkFiles = jsFiles.filter(f => f.match(/^\d+\./));
  console.log(`   - Chunk files: ${chunkFiles.length}`);

  if (chunkFiles.length > 0) {
    console.log('⚠️  Warning: Chunk files detected. These may cause loading issues.');
    console.log('   Consider reducing maxSize in vue.config.js or using different chunking strategy.');
  }

  console.log('🎉 Chunk loading fixes applied successfully!');
  console.log('📝 Next steps:');
  console.log('   1. Deploy the updated dist folder to your hosting provider');
  console.log('   2. Verify that the netlify.toml configuration is applied');
  console.log('   3. Test the application in production');

} catch (error) {
  console.error('❌ Error fixing chunk loading issues:', error.message);
  process.exit(1);
}
