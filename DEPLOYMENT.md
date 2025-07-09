# 🚀 Quick Deployment Guide

## Step 1: Connect to Shopify

First, authenticate with your Shopify store:

```bash
shopify auth login
```

## Step 2: Choose Your Deployment Method

### Option A: Direct GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit with enhanced variant picker"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **Set up GitHub Secrets:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Add these secrets:
     - `SHOPIFY_CLI_THEME_TOKEN`: Your private app token
     - `SHOPIFY_SHOP`: Your shop domain (e.g., `mystore.myshopify.com`)
     - `SHOPIFY_THEME_ID`: Your theme ID (optional)

3. **Automatic Deployment:**
   - Pull requests → Deploy to development theme
   - Push to main → Deploy to live theme

### Option B: Manual Deployment

1. **Development Theme:**
   ```bash
   npm run deploy:dev
   ```

2. **Live Theme:**
   ```bash
   npm run deploy:live
   ```

## Step 3: VS Code Tasks

Use **Ctrl+Shift+P** → "Tasks: Run Task" to access:

- **Shopify: Start Development Server** - Live preview with hot reload
- **Shopify: Deploy to Development** - Deploy to dev theme
- **Shopify: Deploy to Live Theme** - Deploy to production
- **Shopify: Theme Check** - Validate theme code
- **Shopify: Authenticate** - Login to Shopify

## Step 4: Test Your Variant Picker

1. **Create a test product** with multiple variants (colors, sizes)
2. **Navigate to the product page**
3. **Test the dropdown functionality:**
   - Select different options
   - Verify price updates
   - Check availability states
   - Test on mobile devices

## Available Scripts

```bash
npm run dev          # Start development server
npm run deploy:dev   # Deploy to development theme
npm run deploy:live  # Deploy to live theme
npm run check        # Run theme check
npm run pull         # Pull latest from Shopify
```

## 🎯 Next Steps

1. **Customize the variant picker** by editing:
   - `snippets/product-variant-picker.liquid`
   - `assets/variant-selector.css`
   - `assets/variant-picker-dropdown.js`

2. **Add your branding** by updating:
   - Colors in CSS custom properties
   - Typography settings
   - Layout and spacing

3. **Test thoroughly** on:
   - Different browsers
   - Mobile devices
   - Products with various configurations

## 🛠️ Troubleshooting

**Theme not deploying?**
- Check authentication: `shopify auth login`
- Verify store permissions
- Check GitHub secrets

**Variant picker not working?**
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify product has variants

**Need help?**
- Check the README.md for detailed documentation
- Review browser developer tools
- Test with a simple product first
