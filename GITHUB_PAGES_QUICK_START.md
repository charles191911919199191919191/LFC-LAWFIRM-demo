# LFC Legal Consultancy - GitHub Pages Deployment Quick Start

## 🚀 One-Click Deployment

Your Legal and Field Consultancy application is ready to deploy to GitHub Pages at:
```
https://charles191911919199191919191.github.io/LFC-LAWFIRM-demo/
```

## ✅ Prerequisites Checklist

- [x] Repository created on GitHub
- [x] Code pushed to the `master` branch
- [x] GitHub Pages enabled in repository settings
- [x] Build configuration already optimized for GitHub Pages

## 🎯 Three Ways to Deploy

### Method 1: Automatic Deployment (RECOMMENDED)

GitHub Actions will automatically deploy whenever you push to `master`.

```bash
# Make your changes, then push to master
git add .
git commit -m "Your changes here"
git push origin master
```

**What happens automatically:**
1. GitHub Actions builds your app ✨
2. Deploys to `gh-pages` branch 🚀
3. Live in 1-2 minutes at your GitHub Pages URL ⏱️

**Monitor deployment:**
- Go to GitHub repo → Actions tab
- Watch "Deploy to GitHub Pages" workflow
- See build logs and status

---

### Method 2: Manual Build (for testing locally)

```bash
# Build the app locally
cd client
npm install
npm run build

# Preview the build
npm run preview
```

Then manually push to trigger deployment:
```bash
git push origin master
```

---

### Method 3: Using the Deployment Script

```bash
# Make the script executable
chmod +x deploy-github-pages.sh

# Run the deployment script
./deploy-github-pages.sh
```

---

## 📋 Configuration Details (Already Done)

✅ **Vite Base Path:** `/LFC-LAWFIRM-demo/` - Configured in `client/vite.config.js`

✅ **React Router:** `basename="/LFC-LAWFIRM-demo/"` - Set in `client/src/main.jsx`

✅ **GitHub Actions Workflow:** Automatic build and deploy - In `.github/workflows/deploy.yml`

✅ **SPA Routing:** 404.html redirect - In `client/public/404.html`

✅ **Jekyll Bypass:** `.nojekyll` files - In root and client/public directories

---

## ⚡ First-Time Deployment

1. **Verify repository settings:**
   - Go to repo Settings → Pages
   - Source should be: "Deploy from a branch"
   - Branch should be: `gh-pages` (will be created automatically)

2. **Push to master:**
   ```bash
   git push origin master
   ```

3. **Wait 2-3 minutes** for GitHub Pages to build and deploy

4. **Visit your site:**
   - https://charles191911919199191919191.github.io/LFC-LAWFIRM-demo/

5. **Check status:**
   - GitHub repo → Actions tab
   - Look for "Deploy to GitHub Pages" workflow

---

## 🔍 Troubleshooting

### "Page not found" or "404 errors"
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Wait 2-3 minutes for cache to clear
- Check workflow status in Actions tab

### "Assets not loading"
- All paths include `/LFC-LAWFIRM-demo/` prefix
- Check browser console for errors
- Verify build completed successfully

### "Routes not working"
- SPA routing handled by `404.html` redirect
- React Router uses correct basename
- Clear browser cache if needed

### API calls failing
- Without a backend, API calls will fail
- The app has mock data as fallback
- To use a real backend, see section below

---

## 🌐 Adding a Backend API

By default, the app works without a backend using mock data. To connect a real API:

### Step 1: Deploy Your Backend
Deploy to: [Railway](https://railway.app/), [Render](https://render.com/), [Heroku](https://www.heroku.com/), or similar

### Step 2: Update Workflow
Edit `.github/workflows/deploy.yml`:

```yaml
- name: Build client
  run: npm run build --workspace client
  env:
    VITE_API_URL: https://your-backend-url/api  # ← YOUR API URL HERE
    VITE_GITHUB_PAGES: 'true'
```

### Step 3: Deploy
```bash
git add .
git commit -m "Add backend API URL"
git push origin master
```

---

## 📚 Environment Variables

**Development (localhost):**
```env
VITE_API_URL=http://localhost:5000/api
```

**GitHub Pages (production):**
```env
VITE_API_URL=/LFC-LAWFIRM-demo/api  # or your backend URL
VITE_GITHUB_PAGES=true
```

---

## 🧪 Local Development

### Start full stack locally:

**Terminal 1 - Backend:**
```bash
npm run dev --workspace server
```

**Terminal 2 - Frontend:**
```bash
npm run dev --workspace client
```

Runs at: `http://localhost:5173`

API connects to: `http://localhost:5000/api`

---

## 📦 Folder Structure

```
LFC-LAWFIRM-demo/
├── .github/workflows/
│   └── deploy.yml              # ✨ Automatic GitHub Pages deployment
├── client/                      # 🎨 React frontend (deployed to GitHub Pages)
│   ├── src/
│   ├── public/
│   ├── vite.config.js          # ✅ Base path configured
│   └── package.json
├── server/                      # 🖥️ Node/Express backend (optional)
├── DEPLOYMENT_GITHUB_PAGES.md   # 📖 Detailed deployment guide
└── deploy-github-pages.sh       # 🚀 Deployment helper script
```

---

## ✨ Features

- ⚡ **Fast:** Vite builds optimized bundles (~900KB gzipped)
- 🔀 **SPA Routing:** Works perfectly on GitHub Pages
- 🎨 **Responsive:** Mobile-friendly design
- 🔐 **Secure:** CSRF protection, auth, role-based access
- 📊 **Analytics:** Charts and dashboards
- 📅 **Appointments:** Scheduling system
- 👨‍⚖️ **Lawyer Profiles:** Directory and availability
- 📱 **Multiple Dashboards:** Client, Lawyer, Staff, Admin

---

## 🎓 Learning Resources

- [GitHub Pages Docs](https://pages.github.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [React Router Docs](https://reactrouter.com/)
- [GitHub Actions Guide](https://docs.github.com/en/actions)

---

## ✅ Deployment Checklist

Before each deployment:
- [ ] All changes committed to `master`
- [ ] No uncommitted changes (`git status` shows clean)
- [ ] Build works locally (`npm run build --workspace client`)
- [ ] No TypeScript/ESLint errors
- [ ] API URL configured correctly (if using backend)

---

## 📞 Need Help?

1. Check GitHub Actions logs for build errors
2. Review browser console for runtime errors
3. Read `DEPLOYMENT_GITHUB_PAGES.md` for detailed guide
4. Check repository Settings → Pages configuration

---

## 🎉 You're Ready!

Your LFC Legal Consultancy application is configured and ready to deploy to GitHub Pages.

**Next step:** Push your changes and watch it go live!

```bash
git push origin master
```

Monitor at: GitHub Repo → Actions tab

View at: https://charles191911919199191919191.github.io/LFC-LAWFIRM-demo/

---

*Happy deploying! 🚀*
