# Deployment Guide

This project uses GitHub Pages for hosting.

## GitHub Pages Setup

**Prerequisites:**

- GitHub repository for the project
- Node.js and npm installed

**Steps:**

### 1. Install gh-pages package

```bash
npm install --save-dev gh-pages
```

### 2. Add deployment configuration to package.json

Add the `homepage` field and deployment scripts:

```json
{
  "homepage": "https://yourusername.github.io/name-exchange-draw",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

Replace `yourusername` with your GitHub username.

### 3. Deploy

```bash
npm run deploy
```

This will:

1. Run the build process (`npm run build`)
2. Push the `build` folder to the `gh-pages` branch
3. GitHub will automatically serve it at your configured URL

### 4. Configure GitHub Repository

1. Go to your repository settings on GitHub
2. Navigate to "Pages" section
3. Ensure "Source" is set to the `gh-pages` branch
4. Save and wait for deployment (usually takes 1-2 minutes)

## Subsequent Deployments

After the initial setup, just run:

```bash
npm run deploy
```

Every time you want to publish changes to production.

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings
