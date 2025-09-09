# GitHub Pages Deployment Guide

## Quick Setup

### 1. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**

### 2. Push Your Code
```bash
git add .
git commit -m "Add GitHub Pages deployment configuration"
git push origin main
```

### 3. Automatic Deployment
- The GitHub Actions workflow will automatically trigger
- Check the **Actions** tab in your repository to see the deployment progress
- Once complete, your site will be available at: `https://yourusername.github.io/Pera-Verse-Frontend/`

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

Then in GitHub repository settings:
1. Go to **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select **gh-pages** branch and **/ (root)** folder

## Troubleshooting

### Common Issues:

1. **404 Errors**: Make sure the `base` path in `vite.config.ts` matches your repository name
2. **Assets Not Loading**: Check that all images are in the `public/images/` folder
3. **Build Failures**: Run `npm run build` locally to test before pushing

### File Structure After Deployment:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
└── images/
    └── clickable_faculty_map.svg
```

## Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file in the `public/` folder with your domain
2. Configure DNS settings with your domain provider
3. Update the `base` path in `vite.config.ts` to `/` instead of `/Pera-Verse-Frontend/`

## Environment Variables

For different environments, you can create:
- `.env.local` for local development
- `.env.production` for production builds

Example:
```
VITE_APP_TITLE=Pera-Verse
VITE_API_URL=https://api.example.com
```
