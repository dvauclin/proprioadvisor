#!/usr/bin/env node
/*
  Global encoding fixer: detects common mojibake sequences (Ã©, Â, â€™, etc.)
  and rewrites files by reinterpreting current text as Latin-1 bytes then
  decoding as UTF-8. Only files with suspicious patterns are rewritten.

  Usage:
    node scripts/fix-encoding.js           # dry run
    node scripts/fix-encoding.js --write   # apply changes
*/

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

const shouldWrite = process.argv.includes('--write');

// Directories to scan
const TARGET_DIRS = [
  'src',
  'supabase',
  'docs'
];

// File extensions to process
const TARGET_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.mdx', '.css', '.scss', '.html', '.txt'
]);

// Ignore directories
const IGNORE_DIRS = new Set([
  'node_modules', '.next', 'dist', 'build', '.git', '.vercel', '.turbo', '.cache', 'temp-ui-kit'
]);

// Heuristic: patterns that indicate mojibake is present
const MOJIBAKE_REGEX = /(Ã.|Â|â€™|â€œ|â€\u009d|â€\u009c|â€“|â€”|â€¦|â€¢)/;

function decodeLatin1AsUtf8(text) {
  // Convert each 0-255 code point to a byte, then decode as UTF-8
  // TextDecoder is available in Node 18+
  const bytes = Uint8Array.from(Array.from(text, ch => ch.charCodeAt(0) & 0xFF));
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

function countMojibake(text) {
  const matches = text.match(/Ã.|Â|â€™|â€œ|â€\u009d|â€\u009c|â€“|â€”|â€¦|â€¢/g);
  return matches ? matches.length : 0;
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');

  // Step 0: strip leading BOM or stray replacement char at file start
  let cleaned = original.replace(/^\uFEFF/, '').replace(/^\uFFFD/, '');

  // Step 0.1: remove general replacement chars and invisible control chars (except \n, \r, \t)
  cleaned = cleaned
    .replace(/\uFFFD/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

  // If we changed by stripping, write immediately unless further fixes will apply
  let stripped = cleaned !== original;

  // If there is no mojibake pattern and we only stripped leading markers
  if (!MOJIBAKE_REGEX.test(cleaned)) {
    if (stripped && shouldWrite) {
      fs.writeFileSync(filePath, cleaned, 'utf8');
    }
    return { changed: stripped };
  }

  const fixed = decodeLatin1AsUtf8(cleaned)
    .replace(/^\uFEFF/, '')
    .replace(/^\uFFFD/, '')
    .replace(/\uFFFD/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

  const before = countMojibake(original);
  const after = countMojibake(fixed);

  if (after < before) {
    if (shouldWrite) {
      fs.writeFileSync(filePath, fixed, 'utf8');
    }
    return { changed: true, before, after };
  }

  // Fallback: targeted replacements for stubborn cases
  let replaced = cleaned
    .replace(/â€™/g, '’')
    .replace(/â€œ/g, '“')
    .replace(/â€\u009d/g, '”')
    .replace(/â€\u009c/g, '“')
    .replace(/â€“/g, '–')
    .replace(/â€”/g, '—')
    .replace(/â€¦/g, '…')
    .replace(/â€¢/g, '•')
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ãª/g, 'ê')
    .replace(/Ã«/g, 'ë')
    .replace(/Ã /g, 'à')
    .replace(/Ã /g, 'à')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ã»/g, 'û')
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã²/g, 'ò')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã§/g, 'ç')
    .replace(/Ã‰/g, 'É')
    .replace(/ÃŠ/g, 'Ê')
    .replace(/Ã‹/g, 'Ë')
    .replace(/Ãˆ/g, 'È')
    .replace(/Ã€/g, 'À')
    .replace(/Ã‡/g, 'Ç')
    .replace(/Ã™/g, 'Ù')
    .replace(/Ã›/g, 'Û')
    .replace(/Ãœ/g, 'Ü')
    .replace(/Ã”/g, 'Ô')
    .replace(/Ã–/g, 'Ö')
    .replace(/mÂ²/g, 'm²')
    .replace(/Â°/g, '°')
    .replace(/Â²/g, '²')
    .replace(/Â€/g, '€')
    .replace(/Â©/g, '©')
    // Remove stray Â preceding spaces or punctuation
    .replace(/Â(?=\s)/g, '')
    .replace(/Â(?=[\W])/g, '')
    // Specific French fixes observed post-decoding
    .replace(/�`/g, 'Ê')
    .replace(/�0/g, 'É');

  const replacedBefore = countMojibake(cleaned);
  const replacedAfter = countMojibake(replaced);
  if (replacedAfter < replacedBefore) {
    if (shouldWrite) {
      fs.writeFileSync(filePath, replaced, 'utf8');
    }
    return { changed: true, before: replacedBefore, after: replacedAfter };
  }

  return { changed: false };
}

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(full, results);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (TARGET_EXTENSIONS.has(ext)) results.push(full);
    }
  }
  return results;
}

function main() {
  const candidates = [];
  for (const base of TARGET_DIRS) {
    const abs = path.join(projectRoot, base);
    if (fs.existsSync(abs)) {
      candidates.push(...walk(abs));
    }
  }

  let changedCount = 0;
  let totalScanned = 0;
  const changedFiles = [];

  for (const file of candidates) {
    totalScanned += 1;
    try {
      const res = processFile(file);
      if (res.changed) {
        changedCount += 1;
        changedFiles.push(file.replace(projectRoot + path.sep, ''));
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }

  if (shouldWrite) {
    console.log(`Encoding fix complete. Changed ${changedCount} / ${totalScanned} files.`);
  } else {
    console.log(`[Dry run] ${changedCount} files would be changed out of ${totalScanned} scanned.`);
  }

  if (changedFiles.length) {
    console.log('Changed files:');
    for (const f of changedFiles) console.log(' -', f);
  }
}

main();


