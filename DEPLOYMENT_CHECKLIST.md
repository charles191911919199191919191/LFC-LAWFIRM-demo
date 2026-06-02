# GitHub Pages Deployment - Pre-Deployment Checklist ✅

## Repository Configuration

- [ ] Repository created on GitHub
- [ ] Master branch is the default branch
- [ ] Repository is accessible (not private if using free GitHub Pages)
- [ ] GitHub Pages is enabled in Settings → Pages
- [ ] Source is set to "Deploy from a branch"

## Code Configuration

- [ ] `client/vite.config.js` has `base: "/LFC-LAWFIRM-demo/"`
- [ ] `client/src/main.jsx` has `basename="/LFC-LAWFIRM-demo/"`
- [ ] Environment files configured:
  - [ ] `client/.env.production`
  - [ ] `client/.env.development`
  - [ ] `client/.env.github-pages`
- [ ] `.nojekyll` files present in root and `client/public/`

## Build Configuration

- [ ] `.github/workflows/deploy.yml` exists and is configured
- [ ] Workflow triggers on push to master
- [ ] Build command: `npm run build --workspace client`
- [ ] Deployment directory: `./client/dist`
- [ ] Node.js version set to 20+

## SPA Routing

- [ ] `client/public/404.html` exists with redirect script
- [ ] React Router using correct basename
- [ ] History API properly configured

## Pre-Deployment Testing

```bash
# Test 1: Local Build
cd client
npm install
npm run build

# Verify output
ls -la client/dist/
# Should show: index.html, 404.html, assets/, favicon.svg

# Test 2: Build Verification
cat client/dist/index.html | grep "/LFC-LAWFIRM-demo/"
# Should show paths like: /LFC-LAWFIRM-demo/assets/...

# Test 3: Preview Build
npm run preview
# Should run at http://localhost:4173
# Check that assets load correctly
```

## Deployment Steps

1. [ ] Verify all changes are committed:
   ```bash
   git status
   # Should show "nothing to commit, working tree clean"
   ```

2. [ ] Ensure you're on master branch:
   ```bash
   git branch
   # Should show * master
   ```

3. [ ] Pull latest changes:
   ```bash
   git pull origin master
   ```

4. [ ] Push to trigger deployment:
   ```bash
   git push origin master
   ```

5. [ ] Monitor GitHub Actions:
   - Go to repository → Actions tab
   - Watch "Deploy to GitHub Pages" workflow
   - Wait for green checkmark (✓)
   - Typically takes 1-3 minutes

## Post-Deployment Verification

1. [ ] Visit deployed URL:
   ```
   https://charles191911919199191919191.github.io/LFC-LAWFIRM-demo/
   ```

2. [ ] Check page loads:
   - [ ] Page title displays
   - [ ] Favicon loads
   - [ ] No console errors (F12)
   - [ ] CSS styling applied

3. [ ] Test navigation:
   - [ ] Click navigation links
   - [ ] URL updates correctly
   - [ ] Page content changes
   - [ ] No 404 errors

4. [ ] Test routes directly:
   - [ ] /about
   - [ ] /services
   - [ ] /lawyers
   - [ ] /contact
   - [ ] /login

5. [ ] Performance check:
   - [ ] Page loads quickly
   - [ ] No broken assets
   - [ ] Network tab shows 200 status codes

6. [ ] Browser compatibility:
   - [ ] Works on Chrome/Edge
   - [ ] Works on Firefox
   - [ ] Works on Safari
   - [ ] Works on mobile browsers

## Troubleshooting

### Issue: Build Failed in GitHub Actions
**Check:**
- GitHub Actions logs for error messages
- All dependencies installed correctly
- No TypeScript errors
- Node modules not corrupted

**Fix:**
```bash
npm install
npm run build --workspace client
```

### Issue: Page Not Found
**Check:**
- URL is exactly: `https://charles191911919199191919191.github.io/LFC-LAWFIRM-demo/`
- GitHub Pages deployment completed (green checkmark in Actions)
- Browser cache cleared (Ctrl+Shift+R)

**Fix:**
- Wait 2-3 minutes for GitHub to publish
- Hard refresh browser
- Check repository Settings → Pages

### Issue: Assets Not Loading (404 errors)
**Check:**
- Base path configured: `/LFC-LAWFIRM-demo/`
- Paths in built index.html include base: `/LFC-LAWFIRM-demo/assets/...`
- File names match exactly

**Fix:**
```bash
cat client/dist/index.html | grep "src\|href"
# Verify all paths start with /LFC-LAWFIRM-demo/
```

### Issue: Routes Not Working
**Check:**
- 404.html exists in dist folder
- React Router basename set correctly
- Not using hash routing

**Fix:**
- Clear browser cache completely
- Try in incognito/private mode
- Check browser console for JavaScript errors

### Issue: API Calls Failing
**Expected:** Without backend, API will fail but app should still show
**Status:** App uses mock data as fallback

**To Fix:**
- Deploy backend separately
- Update VITE_API_URL in deploy workflow
- Redeploy

## Environment Variables Reference

### Development
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME="Legal and Field Consultancy Firms"
```

### GitHub Pages
```env
VITE_API_URL=/LFC-LAWFIRM-demo/api
VITE_GITHUB_PAGES=true
VITE_APP_NAME="Legal and Field Consultancy Firms"
```

### With Custom Backend
```env
VITE_API_URL=https://your-backend-api.com/api
VITE_GITHUB_PAGES=true
VITE_APP_NAME="Legal and Field Consultancy Firms"
```

## Performance Metrics

After deployment, check:
- [ ] Lighthouse score (DevTools) > 80
- [ ] First Contentful Paint < 2s
- [ ] Total bundle size < 500KB gzipped
- [ ] No console errors or warnings

## Security Checklist

- [ ] HTTPS enabled (GitHub Pages default)
- [ ] No sensitive data in frontend
- [ ] Environment variables not exposed
- [ ] CSRF tokens properly handled
- [ ] API endpoints properly secured

## Rollback Procedure

If deployment has issues:

```bash
# Revert to previous commit
git revert HEAD
git push origin master

# Or reset to specific commit
git reset --hard <commit-hash>
git push origin master --force

# Monitor the new deployment in Actions tab
```

## Success Criteria ✨

- [x] Repository is on GitHub
- [x] Master branch has all code
- [x] GitHub Actions workflow exists
- [x] Build configuration correct
- [x] Vite base path set
- [x] React Router basename set
- [x] 404.html for routing
- [x] .nojekyll files present
- [x] Local build successful
- [x] No build errors

## Next Steps

1. Follow the "Deployment Steps" section above
2. Monitor GitHub Actions workflow
3. Verify deployed site loads
4. Test all routes and features
5. Share with users at the GitHub Pages URL

---

**Your app will be live at:**
```
https://charles191911919199191919191.github.io/LFC-LAWFIRM-demo/
```

**Last Updated:** June 2, 2026
**Status:** ✅ Ready for Deployment
