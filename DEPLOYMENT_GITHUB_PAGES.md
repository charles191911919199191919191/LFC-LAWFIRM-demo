# GitHub Pages Deployment Guide

This guide provides step-by-step instructions to deploy the LFC Legal Consultancy application to GitHub Pages.

## Prerequisites

- Git and GitHub account
- Node.js 20+ and npm installed locally
- Repository already created and pushed to GitHub

## Deployment URL

Your application will be deployed to:
```
https://charles191911919199191919191.github.io/LFC-LAWFIRM-demo/
```

## Quick Start Deployment

### Option 1: Automatic Deployment (Recommended)

The project is already configured with GitHub Actions for automatic deployment. Simply push to the `master` branch:

```bash
# Make your changes and commit
git add .
git commit -m "Your changes"

# Push to master branch to trigger automatic deployment
git push origin master
```

GitHub Actions will automatically:
1. Checkout your code
2. Install dependencies
3. Build the React application
4. Deploy to GitHub Pages (gh-pages branch)
5. Make it available at your GitHub Pages URL

Monitor the deployment progress:
- Go to your repository on GitHub
- Click on the "Actions" tab
- Find the "Deploy to GitHub Pages" workflow
- View the deployment status and logs

### Option 2: Manual Local Build

If you need to test the build locally before deployment:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Build the application
npm run build

# Preview the build locally (optional)
npm run preview
```

The built files will be in `client/dist/`.

## Configuration Details

### Environment Variables

The deployment uses the following environment variables in the GitHub Actions workflow:

```env
VITE_API_URL=/LFC-LAWFIRM-demo/api
VITE_GITHUB_PAGES=true
```

These are automatically set by the deploy workflow in `.github/workflows/deploy.yml`.

### Build Configuration

Key configurations for GitHub Pages:

1. **Vite Base Path** (`client/vite.config.js`):
   ```javascript
   base: "/LFC-LAWFIRM-demo/",
   ```

2. **React Router Basename** (`client/src/main.jsx`):
   ```javascript
   <BrowserRouter basename="/LFC-LAWFIRM-demo/">
   ```

3. **404 Handling**: A `404.html` file is included to handle SPA routing on GitHub Pages

## API Configuration

### For Local Development with Backend

If running the backend locally:

```bash
# Terminal 1: Start the backend server
npm run dev --workspace server

# Terminal 2: Start the frontend development server
npm run dev --workspace client
```

The frontend will connect to `http://localhost:5000/api` during development.

### For GitHub Pages (Demo Mode)

When deployed to GitHub Pages, the application can:
- Display mock data without a backend
- Handle API errors gracefully
- Show informational messages about backend availability

To connect to a live backend API after GitHub Pages deployment:
1. Set up your backend server on a public URL (e.g., Heroku, Railway, Render)
2. Update the deployment workflow to include your API URL
3. Modify `.github/workflows/deploy.yml` to set `VITE_API_URL` to your backend URL

## Database Setup (If Using Backend)

If you're deploying the full stack with a backend:

```bash
# Setup Prisma and database
npm run prisma:migrate --workspace server

# Seed the database with test data
npm run seed --workspace server
```

## Troubleshooting

### Issue: Pages Not Loading

**Solution:**
1. Check GitHub Actions workflow status in the "Actions" tab
2. Verify the workflow ran successfully (green checkmark)
3. Wait 2-3 minutes for GitHub Pages to update
4. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
5. Check your repository settings under "Settings" > "Pages"

### Issue: Assets Not Loading (Broken Links)

**Solution:**
- This usually means the base path isn't configured correctly
- Verify `client/vite.config.js` has `base: "/LFC-LAWFIRM-demo/"`
- Verify `client/src/main.jsx` has `basename="/LFC-LAWFIRM-demo/"`

### Issue: 404 Errors on Routes

**Solution:**
- GitHub Pages handles SPA routing through the `404.html` file
- This file should be automatically created during build
- If issues persist, clear your browser cache and try again

### Issue: API Errors

**Solution:**
- Without a backend server, API calls will fail
- The application will use mock data where available
- To connect to a backend, update the workflow as described above

## Deployment Workflow Details

The workflow file (`.github/workflows/deploy.yml`) performs these steps:

1. **Checkout**: Gets the latest code from your repository
2. **Setup Node.js**: Installs Node.js version 20
3. **Install Dependencies**: Runs `npm ci` to install exact dependency versions
4. **Build**: Compiles the React app to static HTML/CSS/JS
5. **Create 404.html**: Copies index.html to 404.html for SPA routing
6. **Deploy**: Pushes the built files to the `gh-pages` branch
7. **Publish**: GitHub Pages automatically serves the files

## Next Steps

### To Connect a Backend:

1. Deploy your backend to a public service (recommended options):
   - [Railway](https://railway.app/) - Simple deployment
   - [Render](https://render.com/) - Free tier available
   - [Heroku](https://www.heroku.com/) - Traditional option
   - [DigitalOcean](https://www.digitalocean.com/) - VPS option

2. Update `.github/workflows/deploy.yml`:
   ```yaml
   - name: Build client
     run: npm run build --workspace client
     env:
       VITE_API_URL: https://your-backend-url.com/api  # ← Update this
       VITE_GITHUB_PAGES: 'true'
   ```

3. Push the changes to trigger a new deployment

### To Customize Domain:

1. Get a custom domain
2. Go to repository "Settings" > "Pages"
3. Under "Custom domain", enter your domain
4. Follow GitHub's instructions to configure DNS

## Support

For issues or questions:
1. Check GitHub Actions logs for deployment errors
2. Review the browser console for client-side errors
3. Ensure all files are committed and pushed to the repository
4. Verify the workflow file syntax in `.github/workflows/deploy.yml`

## References

- [GitHub Pages Documentation](https://pages.github.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [React Router Hash vs History](https://reactrouter.com/en/main/guides/hash-history)
