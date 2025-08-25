#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Check if canvas is installed
try {
  require.resolve('canvas');
} catch (e) {
  console.error('❌ canvasパッケージがインストールされていません');
  console.log('インストール: npm install --save-dev canvas');
  process.exit(1);
}

// Configuration
const ICON_SIZE = 140; // 70 * 2 (retina)
const PADDING = 2;
const MAX_TEXTURE_SIZE = 2048;

const iconDir = path.join(__dirname, '../public/images/icons');
const qrDir = path.join(__dirname, '../public/images/qr');
const outputDir = path.join(__dirname, '../public/images/sprites');
const outputJsonPath = path.join(__dirname, '../src/app/bg/spritesheet-data.json');

// コマンドライン引数をパース
const args = process.argv.slice(2);
const shouldCleanup = args.includes('--cleanup') || args.includes('-c');
const keepOriginals = args.includes('--keep') || args.includes('-k');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Get all image files from directories
 */
function collectImageFiles() {
  const images = [];
  
  // Collect icon images
  if (fs.existsSync(iconDir)) {
    const iconFiles = fs.readdirSync(iconDir)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .sort();
    
    iconFiles.forEach(file => {
      images.push({
        path: path.join(iconDir, file),
        name: file.replace(/\.(jpg|jpeg|png)$/i, ''),
        type: 'icon',
        file
      });
    });
  }
  
  // Collect QR images
  if (fs.existsSync(qrDir)) {
    const qrFiles = fs.readdirSync(qrDir)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .sort();
    
    qrFiles.forEach(file => {
      images.push({
        path: path.join(qrDir, file),
        name: file.replace(/\.(jpg|jpeg|png)$/i, ''),
        type: 'qr',
        file
      });
    });
  }
  
  return images;
}

/**
 * Calculate optimal grid size for all images
 */
function calculateOptimalLayout(numImages) {
  // Try to make a square-ish layout
  const cols = Math.ceil(Math.sqrt(numImages));
  const rows = Math.ceil(numImages / cols);
  
  const width = cols * (ICON_SIZE + PADDING);
  const height = rows * (ICON_SIZE + PADDING);
  
  // Check if it fits within MAX_TEXTURE_SIZE
  if (width > MAX_TEXTURE_SIZE || height > MAX_TEXTURE_SIZE) {
    // Adjust to fit within limits
    const maxCols = Math.floor(MAX_TEXTURE_SIZE / (ICON_SIZE + PADDING));
    return {
      cols: maxCols,
      rows: Math.ceil(numImages / maxCols),
      width: maxCols * (ICON_SIZE + PADDING) - PADDING,
      height: Math.ceil(numImages / maxCols) * (ICON_SIZE + PADDING) - PADDING
    };
  }
  
  return {
    cols,
    rows,
    width: width - PADDING,
    height: height - PADDING
  };
}

/**
 * Create unified spritesheet
 */
async function createUnifiedSpritesheet() {
  console.log('🎨 統合スプライトシート生成を開始...\n');
  
  // Collect all images
  const images = collectImageFiles();
  
  if (images.length === 0) {
    console.error('画像ファイルが見つかりません');
    console.log('確認: public/images/icons/ と public/images/qr/ に画像があるか');
    process.exit(1);
  }
  
  console.log(`📊 画像ファイル発見:`);
  console.log(`  - アイコン: ${images.filter(img => img.type === 'icon').length}個`);
  console.log(`  - QRコード: ${images.filter(img => img.type === 'qr').length}個`);
  console.log(`  - 合計: ${images.length}個\n`);
  
  // Calculate layout
  const layout = calculateOptimalLayout(images.length);
  console.log(`📐 レイアウト: ${layout.cols}×${layout.rows} (${layout.width}×${layout.height}px)\n`);
  
  // Create canvas
  const canvas = createCanvas(layout.width, layout.height);
  const ctx = canvas.getContext('2d');
  
  // Fill with transparent background
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, layout.width, layout.height);
  
  // Prepare metadata
  const frames = {};
  const iconFrames = {};
  const qrFrames = {};
  
  // Process each image
  console.log('🖼️  画像を処理中...');
  let processedCount = 0;
  
  for (let i = 0; i < images.length; i++) {
    const imgData = images[i];
    
    try {
      // Load image
      const image = await loadImage(imgData.path);
      
      // Calculate position
      const col = i % layout.cols;
      const row = Math.floor(i / layout.cols);
      const x = col * (ICON_SIZE + PADDING);
      const y = row * (ICON_SIZE + PADDING);
      
      // Draw image on canvas
      ctx.drawImage(image, x, y, ICON_SIZE, ICON_SIZE);
      
      // Create frame data
      const frameData = {
        frame: { x, y, w: ICON_SIZE, h: ICON_SIZE },
        rotated: false,
        trimmed: false,
        spriteSourceSize: { x: 0, y: 0, w: ICON_SIZE, h: ICON_SIZE },
        sourceSize: { w: ICON_SIZE, h: ICON_SIZE },
        type: imgData.type // アイコンかQRかを識別
      };
      
      // Store in appropriate category
      frames[`${imgData.type}_${imgData.name}`] = frameData;
      
      if (imgData.type === 'icon') {
        iconFrames[imgData.name] = frameData;
      } else {
        qrFrames[imgData.name] = frameData;
      }
      
      processedCount++;
      process.stdout.write(`\r  処理済み: ${processedCount}/${images.length}`);
    } catch (error) {
      console.error(`\n✗ エラー: ${imgData.file}:`, error.message);
    }
  }
  console.log('\n✓ 全画像の処理完了\n');
  
  // Save as PNG
  const pngPath = path.join(outputDir, 'all-sprites.png');
  const pngBuffer = canvas.toBuffer('image/png');
  fs.writeFileSync(pngPath, pngBuffer);
  console.log(`💾 PNG保存: all-sprites.png (${(pngBuffer.length / 1024).toFixed(1)}KB)`);
  
  // Try to convert to WebP
  let webpPath = null;
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    await execAsync('cwebp -version');
    
    // Convert with optimal settings
    webpPath = path.join(outputDir, 'all-sprites.webp');
    const command = `cwebp -q 85 -m 6 "${pngPath}" -o "${webpPath}"`;
    await execAsync(command);
    
    const webpSize = fs.statSync(webpPath).size;
    const reduction = ((1 - webpSize / pngBuffer.length) * 100).toFixed(1);
    
    console.log(`💾 WebP保存: all-sprites.webp (${(webpSize / 1024).toFixed(1)}KB) - ${reduction}%削減`);
  } catch (error) {
    console.log('⚠️  WebP変換をスキップ（cwebpが利用できません）');
  }
  
  // Save metadata JSON
  const metadata = {
    unified: {
      frames: frames,
      meta: {
        app: 'hellooo-unified-spritesheet',
        version: '2.0',
        image: '/images/sprites/all-sprites.png',
        imageWebp: webpPath ? '/images/sprites/all-sprites.webp' : null,
        format: 'RGBA8888',
        size: { w: layout.width, h: layout.height },
        scale: 1
      }
    },
    // 互換性のため分割版も含める
    icons: {
      frames: iconFrames,
      meta: {
        image: '/images/sprites/all-sprites.png',
        imageWebp: webpPath ? '/images/sprites/all-sprites.webp' : null
      }
    },
    qr: {
      frames: qrFrames,
      meta: {
        image: '/images/sprites/all-sprites.png',
        imageWebp: webpPath ? '/images/sprites/all-sprites.webp' : null
      }
    }
  };
  
  fs.writeFileSync(outputJsonPath, JSON.stringify(metadata, null, 2));
  console.log(`📄 メタデータ保存: spritesheet-data.json\n`);
  
  // Cleanup if requested
  if (shouldCleanup && !keepOriginals) {
    console.log('🧹 不要な個別画像ファイルを削除中...');
    
    let deletedCount = 0;
    
    // Delete individual icon files
    if (fs.existsSync(iconDir)) {
      const iconFiles = fs.readdirSync(iconDir);
      iconFiles.forEach(file => {
        if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
          fs.unlinkSync(path.join(iconDir, file));
          deletedCount++;
        }
      });
    }
    
    // Delete individual QR files
    if (fs.existsSync(qrDir)) {
      const qrFiles = fs.readdirSync(qrDir);
      qrFiles.forEach(file => {
        if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
          fs.unlinkSync(path.join(qrDir, file));
          deletedCount++;
        }
      });
    }
    
    // Delete old separate spritesheets if they exist
    const oldSprites = ['icons-sprite.png', 'icons-sprite.webp', 'qr-sprite.png', 'qr-sprite.webp'];
    oldSprites.forEach(file => {
      const filePath = path.join(outputDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`  削除: ${file}`);
      }
    });
    
    console.log(`✓ ${deletedCount}個の個別画像ファイルを削除しました\n`);
  }
  
  // Summary
  console.log('========================================');
  console.log('✅ 統合スプライトシート生成完了！\n');
  
  const totalSize = pngBuffer.length + (webpPath ? fs.statSync(webpPath).size : 0);
  console.log(`📦 生成されたファイル:`);
  console.log(`  - all-sprites.png: ${(pngBuffer.length / 1024).toFixed(1)}KB`);
  if (webpPath) {
    console.log(`  - all-sprites.webp: ${(fs.statSync(webpPath).size / 1024).toFixed(1)}KB`);
  }
  console.log(`  - 合計: ${(totalSize / 1024).toFixed(1)}KB\n`);
  
  console.log(`🚀 効果:`);
  console.log(`  - HTTPリクエスト: ${images.length}回 → 1回（${((1 - 1/images.length) * 100).toFixed(0)}%削減）`);
  console.log(`  - ファイル管理: ${images.length}ファイル → 1ファイル`);
  console.log(`  - 読み込み時間: 大幅短縮\n`);
  
  if (!shouldCleanup) {
    console.log(`💡 ヒント: --cleanup オプションで個別画像を自動削除できます`);
    console.log(`  使用例: node scripts/create-unified-spritesheet.js --cleanup\n`);
  }
  
  console.log('次のステップ:');
  console.log('1. index.tsを更新して統合スプライトシートを使用');
  console.log('2. アプリケーションをテスト');
  if (!shouldCleanup) {
    console.log('3. 不要な個別画像ファイルを削除（オプション）');
  }
  console.log('========================================');
}

// Main
createUnifiedSpritesheet().catch(error => {
  console.error('\n❌ エラーが発生しました:', error);
  process.exit(1);
});