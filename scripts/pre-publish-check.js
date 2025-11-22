#!/usr/bin/env node

/**
 * Pre-publish check script
 * Verifies everything is ready for npm publish
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Running pre-publish checks...\n');

const checks = [];
let allPassed = true;

// Helper to run checks
function check(name, fn) {
  try {
    process.stdout.write(`⏳ ${name}... `);
    fn();
    console.log('✅');
    checks.push({ name, passed: true });
  } catch (error) {
    console.log('❌');
    console.error(`   Error: ${error.message}\n`);
    checks.push({ name, passed: false, error: error.message });
    allPassed = false;
  }
}

// Check 1: package.json exists and is valid
check('package.json is valid', () => {
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    throw new Error('package.json not found');
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  if (!pkg.name) throw new Error('package.json missing "name"');
  if (!pkg.version) throw new Error('package.json missing "version"');
  if (!pkg.main) throw new Error('package.json missing "main"');
  if (!pkg.module) throw new Error('package.json missing "module"');
  if (!pkg.types) throw new Error('package.json missing "types"');
});

// Check 2: dist folder exists
check('dist/ folder exists', () => {
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('dist/ folder not found. Run "npm run build" first');
  }
});

// Check 3: Required dist files exist
check('Required build files exist', () => {
  const requiredFiles = ['dist/index.js', 'dist/index.cjs', 'dist/index.d.ts'];
  const missing = requiredFiles.filter(f => !fs.existsSync(path.join(process.cwd(), f)));
  if (missing.length > 0) {
    throw new Error(`Missing files: ${missing.join(', ')}. Run "npm run build"`);
  }
});

// Check 4: TypeScript declarations are valid
check('TypeScript declarations valid', () => {
  const dtsPath = path.join(process.cwd(), 'dist', 'index.d.ts');
  const content = fs.readFileSync(dtsPath, 'utf8');

  // Check for essential exports
  const hasWaypoint = content.includes('Waypoint');
  const hasTypes = content.includes('WaypointProps');

  if (!hasWaypoint || !hasTypes) {
    throw new Error('Type declarations incomplete');
  }
});

// Check 5: README exists
check('README.md exists', () => {
  const readmePath = path.join(process.cwd(), 'README.md');
  if (!fs.existsSync(readmePath)) {
    throw new Error('README.md not found');
  }
  const content = fs.readFileSync(readmePath, 'utf8');
  if (content.length < 100) {
    throw new Error('README.md seems too short');
  }
});

// Check 6: LICENSE exists
check('LICENSE file exists', () => {
  const licensePath = path.join(process.cwd(), 'LICENSE');
  if (!fs.existsSync(licensePath)) {
    throw new Error('LICENSE file not found');
  }
});

// Check 7: No test files in dist
check('No test files in dist/', () => {
  const distPath = path.join(process.cwd(), 'dist');
  const files = fs.readdirSync(distPath);
  const testFiles = files.filter(f => f.includes('.test.') || f.includes('.spec.'));
  if (testFiles.length > 0) {
    throw new Error(`Test files found in dist/: ${testFiles.join(', ')}`);
  }
});

// Check 8: Git status (optional but recommended)
check('Git working directory clean', () => {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.log('\n   ⚠️  Warning: You have uncommitted changes');
    }
  } catch (e) {
    // Git not available or not a git repo - skip this check
  }
});

// Check 9: npm login status
check('Logged in to npm', () => {
  try {
    execSync('npm whoami', { encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    throw new Error('Not logged in to npm. Run "npm login"');
  }
});

// Print summary
console.log('\n' + '='.repeat(50));
console.log('📋 Summary\n');

const passed = checks.filter(c => c.passed).length;
const failed = checks.filter(c => !c.passed).length;

console.log(`✅ Passed: ${passed}`);
if (failed > 0) {
  console.log(`❌ Failed: ${failed}`);
  console.log('\nFailed checks:');
  checks.filter(c => !c.passed).forEach(c => {
    console.log(`  - ${c.name}: ${c.error}`);
  });
}

console.log('='.repeat(50) + '\n');

if (allPassed) {
  console.log('🎉 All checks passed! Ready to publish.\n');
  console.log('Next steps:');
  console.log('  1. Review package.json (name, author, repository)');
  console.log('  2. Test publish: npm publish --dry-run --access public');
  console.log('  3. Actual publish: npm publish --access public\n');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please fix them before publishing.\n');
  process.exit(1);
}
