# Enhanced Shopify Theme with Variant Picker System

A modern, accessible Shopify theme featuring an advanced dropdown-only variant picker system with automated GitHub deployment.

## 🚀 Features

- **Enhanced Variant Picker**: Dropdown-only interface for all product options
- **Full Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces
- **Automated Deployment**: GitHub Actions for seamless theme updates
- **Modern JavaScript**: ES6+ with comprehensive error handling
- **CSS Custom Properties**: Easy theming and customization
- **URL Integration**: Handles browser navigation and direct variant links

## 📁 Project Structure

```
shopify-theme-rep/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml                 # Automated deployment
│   └── copilot-instructions.md        # Development guidelines
├── assets/
│   ├── variant-picker-dropdown.js     # Enhanced variant picker
│   └── variant-selector.css           # Modern CSS styles
├── config/
│   └── settings_schema.json           # Theme configuration
├── layout/
│   └── theme.liquid                   # Main theme layout
├── sections/
│   └── product-form.liquid            # Product form section
├── snippets/
│   └── product-variant-picker.liquid  # Variant picker snippet
└── templates/
```

## 🛠️ Quick Setup

### Prerequisites

- Node.js 16+ installed
- Ruby 3.1+ installed
- Shopify CLI installed
- Git repository connected to your Shopify store

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Shopify CLI (if not already installed)

```bash
npm install -g @shopify/cli @shopify/theme
```

### 3. Connect to Your Shopify Store

```bash
shopify auth login
```

### 4. Set Up GitHub Secrets

In your GitHub repository, add these secrets:

- `SHOPIFY_CLI_THEME_TOKEN`: Your Shopify private app token
- `SHOPIFY_SHOP`: Your shop domain (e.g., `mystore.myshopify.com`)
- `SHOPIFY_THEME_ID`: Your live theme ID (optional, for production deployments)

### 5. Start Development

```bash
npm run dev
```

## 🔧 Available Scripts

- `npm run dev`: Start development server with live reload
- `npm run build`: Run theme checks and validation
- `npm run deploy:dev`: Deploy to development theme
- `npm run deploy:live`: Deploy to live theme
- `npm run pull`: Pull latest theme from Shopify
- `npm run check`: Run theme check for issues
- `npm run package`: Create theme package

## 🎨 Variant Picker Integration

### Basic Usage

Include the variant picker in any product template:

```liquid
{% render 'product-variant-picker', 
   product: product, 
   form_id: 'product-form',
   update_url: true %}
```

### Advanced Options

```liquid
{% render 'product-variant-picker', 
   product: product, 
   form_id: 'product-form',
   update_url: true,
   show_labels: true,
   enable_variant_images: true %}
```

### JavaScript API

```javascript
// Get variant picker instance
const picker = document.querySelector('.product-variant-picker').variantPicker;

// Listen for changes
document.addEventListener('variant:change', (e) => {
  console.log('Selected variant:', e.detail.variant);
});

// Reset selections
picker.resetSelections();
```

## 🎨 Customization

### CSS Variables

Customize the variant picker appearance:

```css
:root {
  --variant-picker-border-color: #e2e8f0;
  --variant-picker-border-radius: 8px;
  --variant-picker-focus-color: #3b82f6;
  --variant-picker-disabled-bg: #f8fafc;
}
```

### Theme Integration

The variant picker automatically integrates with:
- Product forms
- Price displays
- Add to cart buttons
- Product images
- URL parameters

## 🚀 Automated Deployment

### GitHub Actions Workflow

The included workflow automatically:

1. **Pull Requests**: Deploy to development theme
2. **Main Branch**: Deploy to live theme
3. **Theme Check**: Validate code quality
4. **Preview URLs**: Generate preview links

### Deployment Triggers

- Push to `main` or `master`: Live deployment
- Pull request: Development deployment
- Manual workflow dispatch: Custom deployment

### Setting Up Secrets

1. Go to your repository Settings → Secrets and variables → Actions
2. Add the required secrets:
   - `SHOPIFY_CLI_THEME_TOKEN`
   - `SHOPIFY_SHOP`
   - `SHOPIFY_THEME_ID` (optional)

## 🔧 Development

### VS Code Extensions

Recommended extensions for development:

- Shopify Liquid
- Liquid
- GitLens
- Error Lens

### Code Guidelines

- Follow Shopify theme development best practices
- Use semantic HTML and ARIA attributes
- Implement responsive design patterns
- Handle errors gracefully
- Add comprehensive comments

### Testing

Test the variant picker with:

- Products with multiple options (color, size, etc.)
- Products with sold-out variants
- Products with single variants
- Mobile and desktop devices
- Screen readers and keyboard navigation

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Chrome Mobile 60+

## ♿ Accessibility Features

- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader announcements
- Focus management
- High contrast mode support
- Reduced motion respect

## 🔄 Migration Guide

### From Existing Variant Pickers

1. Replace existing variant picker snippets
2. Update CSS to use new classes
3. Replace JavaScript with dropdown-only version
4. Test all product pages
5. Update any custom integrations

### From Other Themes

1. Copy variant picker files to your theme
2. Include CSS and JavaScript in theme.liquid
3. Replace product form sections
4. Configure theme settings
5. Test and customize as needed

## 📊 Performance

- Lightweight JavaScript (< 10KB)
- Efficient DOM updates
- CSS optimizations
- Event delegation
- Minimal HTTP requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section
2. Review browser console for errors
3. Test in different browsers
4. Create an issue with detailed information

## 📋 Troubleshooting

### Common Issues

**Variant picker not working:**
- Verify JavaScript is enabled
- Check for console errors
- Ensure product data is properly loaded

**Styles not applying:**
- Check CSS file inclusion
- Verify file paths
- Look for CSS conflicts

**Deployment failing:**
- Verify GitHub secrets
- Check Shopify CLI authentication
- Review workflow logs

### Debug Mode

Enable debug logging:

```javascript
window.variantPickerDebug = true;
```

---

Built with ❤️ for the Shopify community
