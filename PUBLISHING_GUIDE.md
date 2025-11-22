# Publishing to npm - Complete Guide

This guide will walk you through publishing `@modern/react-waypoint` to npm.

## Prerequisites

### 1. Create an npm Account
If you don't have an npm account:
1. Go to https://www.npmjs.com/signup
2. Create an account
3. Verify your email address

### 2. Install npm (if not already installed)
```bash
node --version  # Should show v18 or higher
npm --version   # Should show npm version
```

## Step-by-Step Publishing Process

### Step 1: Login to npm

Open your terminal and login:

```bash
npm login
```

You'll be prompted for:
- **Username**: Your npm username
- **Password**: Your npm password
- **Email**: Your verified email
- **One-time password**: If you have 2FA enabled

Verify you're logged in:
```bash
npm whoami
# Should display your npm username
```

### Step 2: Update Package Information

Before publishing, update `package.json` with your information:

```json
{
  "name": "@your-npm-username/react-waypoint",  // ← Change this
  "version": "1.0.0",
  "description": "Modern, fully TypeScript implementation of react-waypoint with React 19 compatibility",
  "author": "Your Name <your.email@example.com>",  // ← Change this
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/modern-react-waypoint.git"  // ← Change this
  },
  "bugs": {
    "url": "https://github.com/your-username/modern-react-waypoint/issues"  // ← Change this
  },
  "homepage": "https://github.com/your-username/modern-react-waypoint#readme"  // ← Change this
}
```

**Important Notes:**

#### Option A: Scoped Package (Recommended)
- Format: `@your-username/react-waypoint`
- Requires publishing with `--access public` flag
- Example: `@johndoe/react-waypoint`
- **Pros**: Avoids name conflicts, professional look
- **Cons**: None really!

#### Option B: Unscoped Package
- Format: `react-waypoint-modern` (pick unique name)
- Must check if name is available first
- **Pros**: Shorter import statement
- **Cons**: Harder to find unique names

Check if a package name is available:
```bash
npm view react-waypoint-modern
# If it returns an error, the name is available!
```

### Step 3: Verify Package Contents

Check what will be published:

```bash
npm pack --dry-run
```

This shows all files that will be included. You should see:
- ✅ `dist/` folder (built files)
- ✅ `README.md`
- ✅ `LICENSE`
- ✅ `package.json`
- ❌ NOT `src/` (source files - users get built version)
- ❌ NOT `tests/` (test files)
- ❌ NOT `node_modules/`

Our `package.json` already has:
```json
{
  "files": ["dist"]  // Only ships the built files
}
```

### Step 4: Run Final Checks

Before publishing, ensure everything works:

#### A. Clean Install
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### B. Run All Checks
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Format check
npm run format:check

# Tests
npm test

# Build
npm run build
```

All should pass! ✅

### Step 5: Version Your Package

If this is your first publish, you're already at `1.0.0`.

For future updates, use semantic versioning:

```bash
# Patch release (1.0.0 → 1.0.1) - Bug fixes
npm version patch

# Minor release (1.0.0 → 1.1.0) - New features, backward compatible
npm version minor

# Major release (1.0.0 → 2.0.0) - Breaking changes
npm version major
```

For now, keep it at `1.0.0` for the first release.

### Step 6: Build for Production

```bash
npm run build
```

Verify the build succeeded and check `dist/` folder:
```bash
ls -la dist/
```

You should see:
- `index.js` (ESM)
- `index.cjs` (CommonJS)
- `index.d.ts` (TypeScript types)
- `*.map` files (source maps)

### Step 7: Publish to npm! 🚀

#### For Scoped Packages (@your-username/package-name):
```bash
npm publish --access public
```

#### For Unscoped Packages:
```bash
npm publish
```

**Important Flags:**

- `--access public` - Required for scoped packages (otherwise they're private)
- `--dry-run` - Test publish without actually publishing
- `--tag beta` - Publish as beta version

**Test First (Recommended):**
```bash
npm publish --dry-run --access public
```

This simulates publishing without actually doing it.

### Step 8: Verify Publication

After publishing, verify it worked:

1. **Check npm website:**
   - Go to: `https://www.npmjs.com/package/@your-username/react-waypoint`
   - You should see your package page!

2. **Search on npm:**
   ```bash
   npm search @your-username/react-waypoint
   ```

3. **Try installing it:**
   ```bash
   # Create a test folder
   mkdir test-install
   cd test-install
   npm init -y
   npm install @your-username/react-waypoint
   ```

4. **Test the installation:**
   ```bash
   # Check if types are available
   ls node_modules/@your-username/react-waypoint/dist/
   # Should show index.d.ts
   ```

## Post-Publication

### 1. Add npm Badge to README

Add this to the top of your README.md:

```markdown
[![npm version](https://badge.fury.io/js/%40your-username%2Freact-waypoint.svg)](https://www.npmjs.com/package/@your-username/react-waypoint)
[![npm downloads](https://img.shields.io/npm/dm/@your-username/react-waypoint.svg)](https://www.npmjs.com/package/@your-username/react-waypoint)
```

### 2. Create a GitHub Release

If you're using GitHub:

1. Go to your repository
2. Click "Releases" → "Create a new release"
3. Tag: `v1.0.0`
4. Title: `v1.0.0 - Initial Release`
5. Description: Copy your release notes

### 3. Update README Installation Instructions

Make sure your README shows the correct package name:

```markdown
## Installation

\`\`\`bash
npm install @your-username/react-waypoint
\`\`\`
```

## Troubleshooting

### Error: "You must be logged in to publish packages"
**Solution:** Run `npm login` again

### Error: "Package name too similar to existing package"
**Solution:** Choose a different name or use scoped package (@username/name)

### Error: "You do not have permission to publish"
**Solution:**
- For scoped packages, add `--access public`
- Make sure you own the package name

### Error: "Package already exists"
**Solution:**
- Package was already published
- Increment version: `npm version patch`
- Or choose different name

### Types not showing in IDE after installation
**Solution:**
- Check `package.json` has `"types": "./dist/index.d.ts"`
- Verify `dist/index.d.ts` exists
- Restart your IDE

## Updating Your Package

When you make changes and want to publish a new version:

```bash
# 1. Make your changes
# 2. Update version
npm version patch  # or minor, or major

# 3. Run checks
npm run typecheck
npm run lint
npm test
npm run build

# 4. Publish
npm publish --access public

# 5. Push to git (npm version creates a git tag)
git push && git push --tags
```

## Best Practices

### 1. Use .npmignore (Optional)
We're using `"files": ["dist"]` in package.json, which is better.
But you could also create `.npmignore`:

```
src/
tests/
*.test.ts
*.test.tsx
.eslintrc
.prettierrc
tsconfig.json
vite.config.ts
```

### 2. Semantic Versioning
- **Patch** (1.0.x): Bug fixes only
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

### 3. Changelog
Create `CHANGELOG.md` to track changes:

```markdown
# Changelog

## [1.0.0] - 2025-01-15
### Added
- Initial release
- Full TypeScript support
- React 19 compatibility
- IntersectionObserver support
```

### 4. Pre-publish Script
Add to `package.json`:

```json
{
  "scripts": {
    "prepublishOnly": "npm run typecheck && npm run lint && npm test && npm run build"
  }
}
```

This automatically runs checks before publishing!

## Quick Command Reference

```bash
# Login
npm login

# Check who you're logged in as
npm whoami

# Check if name is available
npm view package-name

# Dry run (test publish)
npm publish --dry-run --access public

# Actually publish
npm publish --access public

# Update version
npm version patch|minor|major

# Unpublish (within 72 hours only!)
npm unpublish package-name@version
```

## Complete Publishing Checklist

- [ ] Logged into npm (`npm login`)
- [ ] Updated `package.json` with your info
- [ ] Chosen unique package name
- [ ] All tests passing (`npm test`)
- [ ] All linting passing (`npm run lint`)
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Built successfully (`npm run build`)
- [ ] Verified package contents (`npm pack --dry-run`)
- [ ] Dry run successful (`npm publish --dry-run --access public`)
- [ ] Published! (`npm publish --access public`)
- [ ] Verified on npmjs.com
- [ ] Tested installation in fresh project
- [ ] Updated README with correct package name
- [ ] Created GitHub release (optional)
- [ ] Celebrated! 🎉

## Need Help?

- npm documentation: https://docs.npmjs.com/
- npm support: https://www.npmjs.com/support
- Check package status: https://npm.im/your-package-name

---

**Ready to publish? Follow the steps above and share your amazing library with the world! 🚀**
