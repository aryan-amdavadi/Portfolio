const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Read src/data/projects.ts to extract image paths
const projectsFilePath = path.resolve(__dirname, '../src/data/projects.ts');
const content = fs.readFileSync(projectsFilePath, 'utf8');

// Match all image: '...' lines
const imageMatches = [...content.matchAll(/image:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

if (imageMatches.length === 0) {
  console.error('❌ Error: No project image paths found in src/data/projects.ts');
  process.exit(1);
}

console.log(`🔍 Verifying ${imageMatches.length} project assets from src/data/projects.ts...\n`);

let hasError = false;

async function verifyAll() {
  for (const imgPath of imageMatches) {
    const fullPath = path.resolve(__dirname, '../public', imgPath.replace(/^\//, ''));
    
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Missing asset file: ${imgPath} -> (resolved: ${fullPath})`);
      hasError = true;
      continue;
    }

    const stat = fs.statSync(fullPath);
    if (stat.size === 0) {
      console.error(`❌ Asset is empty (0 bytes): ${imgPath}`);
      hasError = true;
      continue;
    }

    try {
      const meta = await sharp(fullPath).metadata();
      const kb = Math.round(stat.size / 1024);
      console.log(`✅ ${imgPath} [${meta.format?.toUpperCase()}] ${meta.width}x${meta.height} (${kb} KB)`);
    } catch (err) {
      console.error(`❌ Corrupted image file: ${imgPath} - ${err.message}`);
      hasError = true;
    }
  }

  if (hasError) {
    console.error('\n❌ Asset integrity check failed.');
    process.exit(1);
  } else {
    console.log('\n✨ All project assets verified successfully. Zero broken references.');
  }
}

verifyAll();
