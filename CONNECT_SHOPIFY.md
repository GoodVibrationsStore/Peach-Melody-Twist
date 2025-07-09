# 🛒 Connect to Your Shopify Store

## Quick Start Guide

### Step 1: Get Your Store URL
Your Shopify store URL format: `yourstore.myshopify.com`

Example: If your store is `https://myboutique.myshopify.com`, use `myboutique.myshopify.com`

### Step 2: Run Development Server

**Option A: Using VS Code Tasks (Recommended)**
1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select "Shopify: Start Development Server"
4. Enter your store URL when prompted (e.g., `yourstore.myshopify.com`)
5. Follow the authentication prompts in your browser

**Option B: Using Terminal**
```bash
npm run dev --store=yourstore.myshopify.com
```

### Step 3: Authentication Process
1. The CLI will open your browser for authentication
2. Log in to your Shopify store
3. Grant permissions to the Shopify CLI
4. Return to VS Code - the development server will start

### Step 4: Access Your Development Theme
After successful authentication, you'll see:
- **Local preview**: `http://127.0.0.1:9292` (with live reload)
- **Theme editor**: Link to edit in Shopify admin
- **Preview link**: Shareable preview URL

## Environment Variables (Optional)
Set these to avoid repeated prompts:

```bash
# In your terminal or .env file
export SHOPIFY_FLAG_STORE=yourstore.myshopify.com
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev -- --store=yourstore.myshopify.com` | Start with specific store |
| `npm run check` | Validate theme code |
| `npm run deploy:dev` | Deploy to development theme |
| `npm run deploy:live` | Deploy to live theme |

## Troubleshooting

**"A store is required" error:**
- Add `--store=yourstore.myshopify.com` to your command
- Or set the `SHOPIFY_FLAG_STORE` environment variable

**Authentication issues:**
- Clear browser cookies for Shopify
- Try incognito/private browsing mode
- Check if you have admin access to the store

**Permission denied:**
- Ensure you have theme development permissions
- Contact your store owner for access

## Next Steps
Once connected:
1. ✅ Test the variant picker on a product with multiple options
2. ✅ Customize the CSS variables in `assets/variant-selector.css`
3. ✅ Deploy to development theme for testing
4. ✅ Set up GitHub deployment for automation

## Need Help?
- Check the main README.md for detailed documentation
- Review the DEPLOYMENT.md for deployment options
- Test with a simple product first
