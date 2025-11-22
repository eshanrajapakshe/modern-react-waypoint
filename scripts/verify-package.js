#!/usr/bin/env node

/**
 * Verify package is ready for publishing
 * Run with: node scripts/verify-package.js
 */

import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const REQUIRED_FILES = ['dist/index.js', 'dist/index.cjs', 'dist/index.d.ts', 'README.md', 'LICENSE'];

const SHOULD_NOT_PUBLISH = [
  'src',
  'tests',
  'demo',
  'codesandbox-demo',
  'node_modules',
  'tsconfig.json',
  'vite.config.ts',
  '.gitignore',
  'eslint.config.js',
];

console.log('🔍 Verifying package for publishing...\n');

// Check required files exist
console.log('✅ Checking required files:');
let allRequiredExist = true;
for (const file of REQUIRED_FILES) {
  const exists = existsSync(file);
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
  if (!exists) allRequiredExist = false;
}

if (!allRequiredExist) {
  console.log('\n❌ Missing required files. Run "npm run build" first.\n');
  process.exit(1);
}

// Check what will be published
console.log('\n📦 Files that will be published to npm:');
try {
  const output = execSync('npm pack --dry-run', { encoding: 'utf8' });
  console.log(output);

  // Check for files that shouldn't be published
  let foundUnwanted = false;
  for (const unwanted of SHOULD_NOT_PUBLISH) {
    if (output.includes(unwanted + '/') || output.includes(unwanted + '\n')) {
      console.log(`⚠️  WARNING: Found "${unwanted}" in package - should be excluded!`);
      foundUnwanted = true;
    }
  }

  if (foundUnwanted) {
    console.log('\n❌ Unwanted files found in package. Check .npmignore\n');
    process.exit(1);
  }
} catch (error) {
  console.error('Error running npm pack:', error.message);
  process.exit(1);
}

// Check package size
console.log('\n📊 Package size:');
try {
  const sizeOutput = execSync('npm pack --dry-run 2>&1 | grep "package size"', {
    encoding: 'utf8',
    shell: true,
  });
  console.log(sizeOutput);
} catch (error) {
  // Size info might not be available in all npm versions
  console.log('  (Size info not available)');
}

console.log('\n✅ Package verification complete!');
console.log('\n📋 Next steps:');
console.log('  1. npm login');
console.log('  2. npm publish --access public');
console.log('  3. Verify at: https://www.npmjs.com/package/@modern/react-waypoint\n');

