const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  console.log('🖼️  Starting image optimization with Sharp...');

  // Create optimized directories if they don't exist
  const dirs = ['public/img/optimized', 'src/assets/optimized'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const imagePaths = [
    { source: 'public/img', dest: 'public/img/optimized' },
    { source: 'src/assets', dest: 'src/assets/optimized' }
  ];

  const results = [];

  try {
    for (const { source, dest } of imagePaths) {
      if (!fs.existsSync(source)) continue;

      console.log(`📁 Optimizing ${source}...`);
      
      const files = fs.readdirSync(source).filter(file => 
        /\.(jpg|jpeg|png)$/i.test(file)
      );

      for (const file of files) {
        const inputPath = path.join(source, file);
        const originalStats = fs.statSync(inputPath);
        
        console.log(`  Processing ${file} (${formatBytes(originalStats.size)})...`);

        // Generate different optimized versions
        const baseName = path.parse(file).name;
        const ext = path.parse(file).ext.toLowerCase();

        try {
          // 1. Optimized JPEG/PNG (75% quality)
          const optimizedPath = path.join(dest, file);
          let optimizedBuffer;
          
          if (ext === '.png') {
            optimizedBuffer = await sharp(inputPath)
              .png({ 
                quality: 75,
                compressionLevel: 9,
                progressive: true
              })
              .toBuffer();
          } else {
            optimizedBuffer = await sharp(inputPath)
              .jpeg({ 
                quality: 75,
                progressive: true,
                mozjpeg: true
              })
              .toBuffer();
          }
          
          fs.writeFileSync(optimizedPath, optimizedBuffer);
          const optimizedSize = optimizedBuffer.length;

          // 2. WebP version (modern browsers)
          const webpPath = path.join(dest, `${baseName}.webp`);
          const webpBuffer = await sharp(inputPath)
            .webp({ 
              quality: 75,
              effort: 6
            })
            .toBuffer();
          
          fs.writeFileSync(webpPath, webpBuffer);
          const webpSize = webpBuffer.length;

          // 3. AVIF version (ultra-modern browsers) - only for very large images
          if (originalStats.size > 1024 * 1024) { // > 1MB
            const avifPath = path.join(dest, `${baseName}.avif`);
            try {
              const avifBuffer = await sharp(inputPath)
                .avif({ 
                  quality: 75,
                  effort: 6
                })
                .toBuffer();
              
              fs.writeFileSync(avifPath, avifBuffer);
            } catch (avifError) {
              console.log(`    ⚠️  AVIF not supported for ${file}`);
            }
          }

          // Calculate savings
          const jpegSavings = ((originalStats.size - optimizedSize) / originalStats.size * 100).toFixed(1);
          const webpSavings = ((originalStats.size - webpSize) / originalStats.size * 100).toFixed(1);

          results.push({
            file,
            original: originalStats.size,
            optimized: optimizedSize,
            webp: webpSize,
            jpegSavings,
            webpSavings
          });

          console.log(`    ✅ JPEG: ${formatBytes(optimizedSize)} (${jpegSavings}% smaller)`);
          console.log(`    ✅ WebP: ${formatBytes(webpSize)} (${webpSavings}% smaller)`);

        } catch (error) {
          console.log(`    ❌ Error processing ${file}:`, error.message);
        }
      }
    }

    // Generate final report
    generateSizeReport(results);

    console.log('\n✅ Image optimization complete!');
    console.log('💡 Next step: Update your code to use optimized images');

  } catch (error) {
    console.error('❌ Error during optimization:', error);
  }
}

function generateSizeReport(results) {
  console.log('\n📊 Optimization Report:');
  console.log('================================');

  let totalOriginal = 0;
  let totalOptimized = 0;
  let totalWebp = 0;

  results.forEach(({ file, original, optimized, webp, jpegSavings, webpSavings }) => {
    totalOriginal += original;
    totalOptimized += optimized;
    totalWebp += webp;

    console.log(`\n📄 ${file}:`);
    console.log(`  Original:  ${formatBytes(original)}`);
    console.log(`  JPEG:      ${formatBytes(optimized)} (${jpegSavings}% smaller)`);
    console.log(`  WebP:      ${formatBytes(webp)} (${webpSavings}% smaller)`);
  });

  if (results.length > 0) {
    const totalJpegSavings = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);
    const totalWebpSavings = ((totalOriginal - totalWebp) / totalOriginal * 100).toFixed(1);

    console.log(`\n🎯 Total Results:`);
    console.log(`  Original size:  ${formatBytes(totalOriginal)}`);
    console.log(`  JPEG total:     ${formatBytes(totalOptimized)} (${totalJpegSavings}% smaller)`);
    console.log(`  WebP total:     ${formatBytes(totalWebp)} (${totalWebpSavings}% smaller)`);
    console.log(`  Space saved:    ${formatBytes(totalOriginal - totalWebp)} with WebP!`);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run the optimization
optimizeImages(); 