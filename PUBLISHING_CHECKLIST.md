# Publishing Checklist for @modern/react-waypoint

## ✅ Pre-Publishing Setup (COMPLETED)

- [x] Updated `package.json` with correct repository URLs
- [x] Created `.npmignore` to exclude unnecessary files from npm package
- [x] Verified `.gitignore` to prevent committing unwanted files
- [x] Created CodeSandbox demo files

## 📋 Before First Publish

### 1. Build and Test
```bash
# Run all checks
npm run typecheck
npm run lint
npm test
npm run build

# Verify dist folder is created with:
# - dist/index.js (ESM)
# - dist/index.cjs (CommonJS)
# - dist/index.d.ts (TypeScript definitions)
```

### 2. Verify Package Contents
```bash
# See what will be published (dry run)
npm pack --dry-run

# This should ONLY include:
# - dist/ folder
# - package.json
# - README.md
# - LICENSE
```

### 3. Login to npm
```bash
# Login with your npm account
npm login

# Verify you're logged in as: eshan.rajapakshe
npm whoami
```

### 4. Publish to npm
```bash
# First publish (version 0.0.1)
npm publish --access public

# Note: Use --access public for scoped packages (@modern/react-waypoint)
```

## 🔄 For Future Updates

### Version Bumping
```bash
# Patch version (0.0.1 -> 0.0.2) - bug fixes
npm version patch

# Minor version (0.0.1 -> 0.1.0) - new features
npm version minor

# Major version (0.0.1 -> 1.0.0) - breaking changes
npm version major
```

### Publish Update
```bash
npm run build
npm test
npm publish
```

## 🎨 CodeSandbox Demo Setup

### Option 1: Import from GitHub
1. Go to https://codesandbox.io/
2. Click "Import from GitHub"
3. Paste: `https://github.com/eshanrajapakshe/modern-react-waypoint`
4. Select the `codesandbox-demo` folder

### Option 2: Manual Setup
1. Go to https://codesandbox.io/
2. Create new "React TypeScript" sandbox
3. Copy files from `codesandbox-demo/` folder:
   - `package.json`
   - `index.tsx`
   - `App.tsx`
   - `styles.css`
   - `public/index.html`
   - `tsconfig.json`
4. Wait for dependencies to install
5. Demo should run automatically!

### Share the Demo
- Get the CodeSandbox URL (e.g., https://codesandbox.io/s/xxxxx)
- Add it to your README.md
- Share on social media, GitHub discussions, etc.

## 🚀 Git Workflow

### Initial Commit
```bash
# Check what will be committed
git status

# Should NOT include:
# - node_modules/
# - dist/
# - coverage/
# - .env files
# - IDE files (.vscode, .idea)

# Add files
git add .

# Commit
git commit -m "Initial release v0.0.1"

# Push to GitHub
git push origin main
```

### Create Release Tag
```bash
# Tag the release
git tag -a v0.0.1 -m "Release version 0.0.1"

# Push tags
git push --tags
```

## 📦 What Gets Published to npm

Only these files will be published (controlled by `.npmignore`):
- ✅ `dist/` - Built JavaScript and TypeScript definitions
- ✅ `package.json` - Package metadata
- ✅ `README.md` - Documentation
- ✅ `LICENSE` - MIT License

NOT published:
- ❌ `src/` - Source code
- ❌ `tests/` - Test files
- ❌ `demo/` - Demo files
- ❌ `codesandbox-demo/` - CodeSandbox demo
- ❌ `node_modules/` - Dependencies
- ❌ Config files (tsconfig.json, vite.config.ts, etc.)

## 🔍 Verification After Publishing

1. Check npm page: https://www.npmjs.com/package/@modern/react-waypoint
2. Test installation in a new project:
   ```bash
   mkdir test-install
   cd test-install
   npm init -y
   npm install @modern/react-waypoint
   ```
3. Verify TypeScript types work in IDE
4. Check package size (should be < 5KB gzipped)

## 📝 Post-Publishing Tasks

- [ ] Add CodeSandbox demo link to README
- [ ] Create GitHub release with changelog
- [ ] Share on Twitter/LinkedIn
- [ ] Submit to React newsletter/communities
- [ ] Update personal portfolio

## 🆘 Troubleshooting

### "Package name already exists"
- The package name `@modern/react-waypoint` might be taken
- Try: `@eshan/react-waypoint` or `modern-react-waypoint` (without scope)

### "You must be logged in to publish"
```bash
npm logout
npm login
```

### "403 Forbidden"
- Check if you have permission to publish scoped packages
- Use `--access public` flag

### Build fails
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

