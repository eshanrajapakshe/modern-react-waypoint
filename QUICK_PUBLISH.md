# Quick Publishing Guide 🚀

**Want to publish quickly? Follow these 5 steps!**

## Step 1: Update Your Package Name

Edit `package.json` and change these fields:

```json
{
  "name": "@YOUR-NPM-USERNAME/react-waypoint",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "url": "https://github.com/YOUR-GITHUB-USERNAME/modern-react-waypoint.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR-GITHUB-USERNAME/modern-react-waypoint/issues"
  },
  "homepage": "https://github.com/YOUR-GITHUB-USERNAME/modern-react-waypoint#readme"
}
```

**Replace:**
- `YOUR-NPM-USERNAME` with your npm username
- `YOUR-GITHUB-USERNAME` with your GitHub username (if applicable)
- Author name and email

## Step 2: Login to npm

```bash
npm login
```

Enter your:
- Username
- Password
- Email
- 2FA code (if enabled)

Verify login:
```bash
npm whoami
# Should show your username
```

## Step 3: Run Pre-Publish Checks

```bash
npm run pre-publish
```

This checks everything is ready. If it fails, fix the errors and run again.

## Step 4: Test Publish (Dry Run)

```bash
npm publish --dry-run --access public
```

This simulates publishing without actually doing it. Check the output for any warnings.

## Step 5: Publish! 🎉

```bash
npm publish --access public
```

**Done!** Your package is now live on npm! 🎊

## Verify Publication

Check your package at:
```
https://www.npmjs.com/package/@YOUR-USERNAME/react-waypoint
```

Test installation:
```bash
mkdir test-project
cd test-project
npm init -y
npm install @YOUR-USERNAME/react-waypoint
```

---

## Troubleshooting

### "You must be logged in"
→ Run `npm login` again

### "Package name too similar"
→ Choose a different name or use scoped package (@username/name)

### "You do not have permission"
→ Add `--access public` flag (for scoped packages)

### "Package already published"
→ Update version in package.json: `"version": "1.0.1"`

---

## Future Updates

When you want to publish updates:

```bash
# 1. Update version
npm version patch  # 1.0.0 → 1.0.1 (bug fixes)
npm version minor  # 1.0.0 → 1.1.0 (new features)
npm version major  # 1.0.0 → 2.0.0 (breaking changes)

# 2. Publish
npm publish --access public

# 3. Push tags to git (if using git)
git push && git push --tags
```

---

**Need detailed instructions? See [PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md)**
