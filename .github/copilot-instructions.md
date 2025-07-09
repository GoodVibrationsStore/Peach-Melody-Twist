<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Shopify Theme Development Instructions

## Project Context
This is a Shopify theme development workspace with an enhanced product variant picker system. The project focuses on dropdown-only variant selection with comprehensive accessibility, error handling, and responsive design.

## Key Files and Structure
- `assets/variant-picker-dropdown.js` - Main JavaScript for variant selection logic
- `assets/variant-selector.css` - CSS styles for variant picker components
- `snippets/product-variant-picker.liquid` - Liquid template for rendering variant picker
- `sections/` - Shopify theme sections
- `templates/` - Shopify theme templates
- `layout/` - Theme layout files

## Development Guidelines

### Liquid Development
- Always use proper Liquid syntax and filters
- Include accessibility attributes (aria-labels, roles)
- Handle edge cases (single variants, out-of-stock)
- Use semantic HTML structure
- Follow Shopify's theme development best practices

### JavaScript Development
- Use modern ES6+ syntax
- Implement proper error handling with try-catch blocks
- Add console logging for debugging
- Ensure compatibility with Shopify's environment
- Handle dynamic content loading (AJAX sections)
- Follow accessibility best practices

### CSS Development
- Use CSS custom properties for theming
- Implement responsive design with mobile-first approach
- Include focus states and accessibility features
- Support dark mode and high contrast modes
- Use BEM-like naming conventions for variant picker classes

### Shopify-Specific Considerations
- Always handle variant availability properly
- Include proper Shopify object checks (product.variants.size)
- Use Shopify's money formatting when available
- Handle URL parameters for variant selection
- Support Shopify's section loading events

### Accessibility Requirements
- Include proper ARIA labels and descriptions
- Ensure keyboard navigation works correctly
- Provide screen reader announcements for state changes
- Use semantic HTML elements
- Include skip links and focus management

### Performance Considerations
- Minimize DOM queries and manipulations
- Use event delegation for efficiency
- Implement proper cleanup for dynamic content
- Optimize CSS for rendering performance

## Common Patterns
When working with variant selection:
1. Always validate variant data exists before processing
2. Use proper error handling for JSON parsing
3. Update all relevant UI elements (price, availability, images)
4. Dispatch custom events for other components to listen
5. Handle browser navigation and URL updates
