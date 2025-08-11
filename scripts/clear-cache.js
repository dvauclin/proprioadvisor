const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Next.js cache...');

const cacheDirs = [
  '.next',
  'node_modules/.cache',
  '.vercel/output'
];

cacheDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`🗑️  Removing ${dir}...`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  } else {
    console.log(`ℹ️  ${dir} not found, skipping...`);
  }
});

console.log('✅ Cache cleared!');
console.log('💡 You can now restart your development server with: npm run dev');
