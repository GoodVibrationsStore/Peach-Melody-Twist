{%- comment -%}
Enhanced Product Variant Picker Snippet
Following Shopify theme development instructions
Dropdown-only implementation with accessibility and error handling
{%- endcomment -%}

{%- liquid
  assign product_form_id = 'product-form-' | append: section.id | append: product.id
  assign current_variant = product.selected_or_first_available_variant
  assign variant_picker_id = 'variant-picker-' | append: section.id | append: product.id
-%}

{%- comment -%} Validate product exists and has variants {%- endcomment -%}
{%- if product and product.variants.size > 0 -%}
  {%- unless product.has_only_default_variant -%}
    <variant-picker-dropdown
      class="variant-picker no-js-hidden"
      data-section="{{ section.id }}"
      data-product-id="{{ product.id }}"
      data-theme-component="variant-picker"
      data-url="{{ product.url }}"
      id="{{ variant_picker_id }}"
      role="group"
      aria-label="{{ 'products.product.product_variants' | t | default: 'Product variants' }}">

      {%- comment -%} Loading indicator for better UX {%- endcomment -%}
      <div class="variant-picker__loading visually-hidden" data-loading-indicator>
        <span class="loading-spinner" aria-hidden="true"></span>
        <span class="visually-hidden">{{ 'products.product.updating_variants' | t | default: 'Loading variants...' }}</span>
      </div>

      {%- comment -%} Error display container {%- endcomment -%}
      <div
        class="variant-picker__error visually-hidden"
        data-error-display
        role="alert"
        aria-live="assertive">
        <span class="error-icon" aria-hidden="true">⚠</span>
        <span class="error-text"></span>
      </div>

      {%- comment -%} Enhanced product variant data for JavaScript - Fixed JSON formatting {%- endcomment -%}
      <script data-variant-data type="application/json">
        {
          "id": {{ product.id | json }},
          "title": {{ product.title | json }},
          "handle": {{ product.handle | json }},
          "url": {{ product.url | within: collection | json }},
          "moneyFormat": {{ shop.money_format | json }},
          "currencyCode": {{ cart.currency.iso_code | json }},
          "selectedVariant": {% if current_variant %}{{ current_variant | json }}{% else %}null{% endif %},
          "options": [
            {%- for option in product.options_with_values -%}
              {
                "name": {{ option.name | json }},
                "position": {{ option.position | json }},
                "values": [
                  {%- for value in option.values -%}
                    {{ value | json }}{% unless forloop.last %},{% endunless %}
                  {%- endfor -%}
                ]
              }{% unless forloop.last %},{% endunless %}
            {%- endfor -%}
          ],
          "variants": [
            {%- for variant in product.variants -%}
              {
                "id": {{ variant.id | json }},
                "title": {{ variant.title | json }},
                "available": {{ variant.available | json }},
                "price": {{ variant.price | json }},
                "compare_at_price": {% if variant.compare_at_price %}{{ variant.compare_at_price | json }}{% else %}null{% endif %},
                "sku": {{ variant.sku | json }},
                "barcode": {{ variant.barcode | json }},
                "weight": {{ variant.weight | json }},
                "weight_unit": {{ variant.weight_unit | json }},
                "inventory_quantity": {% if variant.inventory_management %}{{ variant.inventory_quantity | json }}{% else %}null{% endif %},
                "inventory_management": {{ variant.inventory_management | json }},
                "inventory_policy": {{ variant.inventory_policy | json }},
                "options": [
                  {%- for option in variant.options -%}
                    {{ option | json }}{% unless forloop.last %},{% endunless %}
                  {%- endfor -%}
                ],
                "featured_image": {% if variant.featured_image %}
                  {
                    "id": {{ variant.featured_image.id | json }},
                    "alt": {{ variant.featured_image.alt | json }},
                    "src": {{ variant.featured_image | image_url: width: 800 | json }},
                    "url": {{ variant.featured_image | image_url: width: 800 | json }},
                    "width": {{ variant.featured_image.width | json }},
                    "height": {{ variant.featured_image.height | json }}
                  }
                {% else %}null{% endif %}
              }{% unless forloop.last %},{% endunless %}
            {%- endfor -%}
          ],
          "settings": {
            "enableImages": {{ settings.enable_variant_images | default: true | json }},
            "enablePricing": {{ settings.enable_dynamic_pricing | default: true | json }},
            "showAvailability": {{ settings.show_variant_availability | default: true | json }},
            "updateUrl": {{ settings.update_url_on_variant_change | default: true | json }},
            "showInventory": {{ settings.show_inventory_quantity | default: false | json }},
            "lowStockThreshold": {{ settings.low_stock_threshold | default: 10 | json }},
            "selectionBehavior": {{ settings.variant_selection_behavior | default: 'auto_select_first' | json }}
          }
        }
      </script>

      {%- comment -%} Dropdown selectors for each product option {%- endcomment -%}
      <div class="variant-picker__dropdowns">
        {%- for option in product.options_with_values -%}
          <fieldset class="variant-picker__fieldset">
            <legend class="variant-picker__legend">
              {{ option.name }}
              <span class="required-indicator" aria-label="{{ 'general.accessibility.required' | t | default: 'required' }}">*</span>
            </legend>
            <div class="variant-picker__select-wrapper">
              <select
                class="variant-picker__select"
                id="Option-{{ option.position }}-{{ section.id }}"
                name="options[{{ option.name | escape }}]"
                data-option-position="{{ option.position }}"
                data-option-name="{{ option.name | escape }}"
                aria-describedby="Option-{{ option.position }}-{{ section.id }}-error"
                required>
                <option value="" disabled {% unless current_variant %}selected{% endunless %}>
                  {{ 'products.product.choose_option' | t: option: option.name | default: 'Choose [option]' | replace: '[option]', option.name }}
                </option>
                {%- for value in option.values -%}
                  <option
                    value="{{ value | escape }}"
                    {% if current_variant and current_variant.options[forloop.index0] == value %}selected{% endif %}
                    data-option-value="{{ value | escape }}">
                    {{ value }}
                  </option>
                {%- endfor -%}
              </select>
              <div class="variant-picker__select-icon" aria-hidden="true">
                {% render 'icon-caret' %}
              </div>
            </div>
            <div
              class="variant-picker__option-error visually-hidden"
              id="Option-{{ option.position }}-{{ section.id }}-error"
              role="alert"
              aria-live="polite">
            </div>
          </fieldset>
        {%- endfor -%}
      </div>

      {%- comment -%} Hidden input for form submission {%- endcomment -%}
      <input
        type="hidden"
        name="id"
        data-variant-id-input
        value="{{ current_variant.id | default: '' }}"
        form="{{ product_form_id }}"
        {% unless current_variant %}disabled{% endunless %}>

      {%- comment -%} Fallback for no-JS users {%- endcomment -%}
      <noscript>
        <div class="product-form__input product-form__input--dropdown">
          <label class="form__label" for="Variants-{{ section.id }}">
            {{ 'products.product.product_variants' | t | default: 'Variants' }}
          </label>
          <div class="select">
            <select
              name="id"
              id="Variants-{{ section.id }}"
              class="select__select"
              form="{{ product_form_id }}">
              {%- for variant in product.variants -%}
                <option
                  value="{{ variant.id }}"
                  {% if variant == current_variant %}selected="selected"{% endif %}
                  {% unless variant.available %}disabled{% endunless %}>
                  {{ variant.title }}
                  {%- if variant.available == false %} - {{ 'products.product.sold_out' | t | default: 'Sold out' }}{% endif %}
                  - {{ variant.price | money }}
                </option>
              {%- endfor -%}
            </select>
            {% render 'icon-caret' %}
          </div>
        </div>
      </noscript>

    </variant-picker-dropdown>

    {%- comment -%} Additional product information displays {%- endcomment -%}
    <div class="product__variant-info">
      {%- comment -%} Variant availability display {%- endcomment -%}
      <div class="variant-availability" data-variant-availability>
        {%- if current_variant -%}
          {%- if current_variant.available -%}
            <span class="variant-availability--available">
              {{ 'products.product.available' | t | default: 'Available' }}
            </span>
          {%- else -%}
            <span class="variant-availability--sold-out">
              {{ 'products.product.sold_out' | t | default: 'Sold out' }}
            </span>
          {%- endif -%}
        {%- else -%}
          <span class="variant-availability--select">
            {{ 'products.product.select_options' | t | default: 'Select options' }}
          </span>
        {%- endif -%}
      </div>

      {%- comment -%} Dynamic price display {%- endcomment -%}
      {%- if settings.enable_dynamic_pricing -%}
        <div class="price variant-price" data-variant-price>
          {%- if current_variant -%}
            {%- if current_variant.compare_at_price > current_variant.price -%}
              <span class="price--on-sale">{{ current_variant.price | money }}</span>
              <span class="price--compare">{{ current_variant.compare_at_price | money }}</span>
            {%- else -%}
              <span class="price--regular">{{ current_variant.price | money }}</span>
            {%- endif -%}
          {%- else -%}
            <span class="price--placeholder">
              {{ 'products.product.from_lowest_price_html' | t: lowest_price: product.price_min | money | default: 'From' }}
            </span>
          {%- endif -%}
        </div>
      {%- endif -%}

      {%- comment -%} Inventory quantity display - Fixed validation {%- endcomment -%}
      {%- if settings.show_inventory_quantity and current_variant and current_variant.inventory_management -%}
        <div class="variant-inventory" data-variant-inventory>
          {%- assign inventory_quantity = current_variant.inventory_quantity -%}
          {%- assign low_stock_threshold = settings.low_stock_threshold | default: 10 -%}

          {%- if inventory_quantity > 0 -%}
            {%- if inventory_quantity <= low_stock_threshold -%}
              <span class="inventory--low">
                {{ 'products.product.inventory_low_stock_show_count' | t: quantity: inventory_quantity | default: 'Only [quantity] left!' | replace: '[quantity]', inventory_quantity }}
              </span>
            {%- else -%}
              <span class="inventory--available">
                {{ 'products.product.inventory_in_stock_show_count' | t: quantity: inventory_quantity | default: '[quantity] in stock' | replace: '[quantity]', inventory_quantity }}
              </span>
            {%- endif -%}
          {%- elsif inventory_quantity == 0 -%}
            <span class="inventory--out-of-stock">
              {{ 'products.product.inventory_out_of_stock' | t | default: 'Out of stock' }}
            </span>
          {%- endif -%}
        </div>
      {%- endif -%}

      {%- comment -%} SKU display - Fixed validation {%- endcomment -%}
      {%- if current_variant and current_variant.sku != blank -%}
        <div class="variant-sku" data-variant-sku>
          <span class="sku-label">{{ 'products.product.sku' | t | default: 'SKU' }}:</span>
          <span class="sku-value">{{ current_variant.sku }}</span>
        </div>
      {%- endif -%}

      {%- comment -%} Barcode display (optional) {%- endcomment -%}
      {%- if settings.show_variant_barcode and current_variant and current_variant.barcode != blank -%}
        <div class="variant-barcode" data-variant-barcode>
          <span class="barcode-label">{{ 'products.product.barcode' | t | default: 'Barcode' }}:</span>
          <span class="barcode-value">{{ current_variant.barcode }}</span>
        </div>
      {%- endif -%}

      {%- comment -%} Weight display (optional) {%- endcomment -%}
      {%- if settings.show_variant_weight and current_variant and current_variant.weight > 0 -%}
        <div class="variant-weight" data-variant-weight>
          <span class="weight-label">{{ 'products.product.weight' | t | default: 'Weight' }}:</span>
          <span class="weight-value">{{ current_variant.weight | weight_with_unit }}</span>
        </div>
      {%- endif -%}
    </div>

  {%- else -%}
    {%- comment -%} Single variant product - just include hidden input {%- endcomment -%}
    <input
      type="hidden"
      name="id"
      value="{{ product.variants.first.id }}"
      form="{{ product_form_id }}">

    {%- comment -%} Show price for single variant {%- endcomment -%}
    <div class="price variant-price">
      {%- assign single_variant = product.variants.first -%}
      {%- if single_variant.compare_at_price > single_variant.price -%}
        <span class="price--on-sale">{{ single_variant.price | money }}</span>
        <span class="price--compare">{{ single_variant.compare_at_price | money }}</span>
      {%- else -%}
        <span class="price--regular">{{ single_variant.price | money }}</span>
      {%- endif -%}
    </div>
  {%- endunless -%}

  {%- comment -%} Enhanced accessibility announcements {%- endcomment -%}
  <div
    id="variant-picker-announcements-{{ product.id }}"
    class="visually-hidden"
    aria-live="polite"
    aria-atomic="true">
    {%- comment -%} Populated dynamically by JavaScript {%- endcomment -%}
  </div>

{%- else -%}
  {%- comment -%} No product or variants found - Enhanced error handling {%- endcomment -%}
  <div class="variant-picker__no-product" role="alert">
    <p>{{ 'products.product.no_variants_available' | t | default: 'This product is currently unavailable.' }}</p>
  </div>
{%- endif -%}

{%- comment -%} Schema.org structured data for SEO optimization {%- endcomment -%}
{%- if product and product.variants.size > 0 -%}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": {{ product.title | json }},
    "description": {{ product.description | strip_html | truncate: 160 | json }},
    "sku": {{ product.variants.first.sku | json }},
    "brand": {% if product.vendor %}{{ product.vendor | json }}{% else %}"{{ shop.name }}"{% endif %},
    "offers": [
      {%- for variant in product.variants -%}
        {
          "@type": "Offer",
          "name": {{ variant.title | json }},
          "price": "{{ variant.price | divided_by: 100.0 }}",
          "priceCurrency": "{{ cart.currency.iso_code }}",
          "sku": {{ variant.sku | json }},
          "availability": {% if variant.available %}"https://schema.org/InStock"{% else %}"https://schema.org/OutOfStock"{% endif %},
          "url": "{{ shop.url }}{{ product.url }}?variant={{ variant.id }}",
          "priceValidUntil": "{{ 'now' | date: '%Y' | plus: 1 }}-12-31"
        }{% unless forloop.last %},{% endunless %}
      {%- endfor -%}
    ]
  }
  </script>
{%- endif -%}

/**
 * Enhanced Variant Picker Dropdown - JavaScript Component
 * Following Shopify theme development instructions
 * Dropdown-only implementation with accessibility and error handling
 */

class VariantPickerDropdown extends HTMLElement {
  constructor() {
    super();
    
    try {
      // Initialize properties following development guidelines
      this.isLoading = false;
      this.debounceTimer = null;
      
      // Cache DOM elements
      this.cacheElements();
      
      // Parse product data
      this.parseProductData();
      
      // Initialize component
      this.init();
      
      console.log('Enhanced Variant Picker: Initialized successfully for product', this.productData?.id);
    } catch (error) {
      console.error('Enhanced Variant Picker: Initialization error', error);
      this.handleError(error, 'Initialization');
    }
  }

  /**
   * Cache frequently accessed DOM elements following development guidelines
   */
  cacheElements() {
    try {
      this.selects = this.querySelectorAll('.variant-picker__select');
      this.hiddenInput = this.querySelector('[data-variant-id-input]');
      this.loadingIndicator = this.querySelector('[data-loading-indicator]');
      this.errorDisplay = this.querySelector('[data-error-display]');
      this.priceElement = document.querySelector('[data-variant-price]');
      this.availabilityElement = document.querySelector('[data-variant-availability]');
      this.inventoryElement = document.querySelector('[data-variant-inventory]');
      this.skuElement = document.querySelector('[data-variant-sku]');
      this.barcodeElement = document.querySelector('[data-variant-barcode]');
      this.weightElement = document.querySelector('[data-variant-weight]');
      this.announcementElement = document.querySelector(`#variant-picker-announcements-${this.dataset.productId}`);
    } catch (error) {
      console.error('Enhanced Variant Picker: Error caching elements', error);
    }
  }

  /**
   * Parse product data from JSON script tag with proper error handling
   */
  parseProductData() {
    try {
      const dataScript = this.querySelector('[data-variant-data]');
      if (!dataScript) {
        throw new Error('Product variant data not found');
      }
      
      this.productData = JSON.parse(dataScript.textContent);
      
      // Validate required data following Shopify object checks
      if (!this.productData.variants || !Array.isArray(this.productData.variants)) {
        throw new Error('Invalid variant data structure');
      }
      
      console.log('Enhanced Variant Picker: Product data loaded', this.productData);
    } catch (error) {
      console.error('Enhanced Variant Picker: Error parsing product data', error);
      this.showError('Failed to load product data. Please refresh the page.');
    }
  }

  /**
   * Initialize the variant picker component
   */
  init() {
    try {
      // Add event listeners
      this.addEventListeners();
      
      // Set initial state
      this.setInitialState();
      
      // Dispatch ready event for other components
      this.dispatchEvent(new CustomEvent('variant-picker:ready', {
        bubbles: true,
        detail: { productData: this.productData }
      }));
      
    } catch (error) {
      console.error('Enhanced Variant Picker: Initialization error', error);
      this.showError('Failed to initialize variant picker');
    }
  }

  /**
   * Add event listeners following accessibility guidelines
   */
  addEventListeners() {
    try {
      // Listen for select changes with proper error handling
      this.selects.forEach(select => {
        select.addEventListener('change', this.handleSelectChange.bind(this));
        select.addEventListener('focus', this.handleSelectFocus.bind(this));
        select.addEventListener('blur', this.handleSelectBlur.bind(this));
        
        // Enhanced keyboard navigation for accessibility
        select.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
      });

      // Listen for Shopify section events (dynamic content loading)
      document.addEventListener('shopify:section:load', this.handleSectionLoad.bind(this));
      document.addEventListener('shopify:section:unload', this.handleSectionUnload.bind(this));
      
      // Handle form submission validation
      const form = document.querySelector(`form[id*="${this.dataset.productId}"]`);
      if (form) {
        form.addEventListener('submit', this.handleFormSubmit.bind(this));
      }
    } catch (error) {
      console.error('Enhanced Variant Picker: Error adding event listeners', error);
    }
  }

  /**
   * Handle select change events with proper debouncing
   */
  handleSelectChange(event) {
    try {
      // Clear existing debounce timer for performance
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      
      // Debounce selection updates
      this.debounceTimer = setTimeout(() => {
        this.updateVariantSelection();
      }, 150);
      
    } catch (error) {
      console.error('Enhanced Variant Picker: Error handling select change', error);
      this.showError('Error updating variant selection');
    }
  }

  /**
   * Enhanced keyboard navigation following accessibility guidelines
   */
  handleKeyboardNavigation(event) {
    const { key } = event;
    
    try {
      switch (key) {
        case 'Home':
          event.preventDefault();
          event.target.selectedIndex = 1; // Skip placeholder option
          event.target.dispatchEvent(new Event('change', { bubbles: true }));
          break;
          
        case 'End':
          event.preventDefault();
          event.target.selectedIndex = event.target.options.length - 1;
          event.target.dispatchEvent(new Event('change', { bubbles: true }));
          break;
          
        case 'Escape':
          event.target.blur();
          break;
      }
    } catch (error) {
      console.error('Enhanced Variant Picker: Error in keyboard navigation', error);
    }
  }

  /**
   * Update variant selection based on current select values
   */
  updateVariantSelection() {
    try {
      this.showLoading();
      
      // Get current option values
      const selectedOptions = Array.from(this.selects).map(select => select.value);
      
      // Validate all options are selected (handle edge cases)
      if (selectedOptions.some(option => !option)) {
        this.clearVariantSelection();
        return;
      }
      
      // Find matching variant using Shopify patterns
      const matchingVariant = this.findVariantByOptions(selectedOptions);
      
      if (matchingVariant) {
        this.selectVariant(matchingVariant);
      } else {
        this.showError('This combination is not available');
        this.clearVariantSelection();
      }
      
    } catch (error) {
      console.error('Enhanced Variant Picker: Error updating variant selection', error);
      this.showError('Error finding variant combination');
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Find variant by option combination using Shopify patterns
   */
  findVariantByOptions(selectedOptions) {
    try {
      return this.productData.variants.find(variant => {
        return selectedOptions.every((option, index) => {
          return variant.options[index] === option;
        });
      });
    } catch (error) {
      console.error('Enhanced Variant Picker: Error finding variant by options', error);
      return null;
    }
  }

  /**
   * Select a specific variant with proper UI updates
   */
  selectVariant(variant, updateUrl = true) {
    try {
      console.log('Enhanced Variant Picker: Selecting variant', variant.title);
      
      // Update hidden input for form submission
      if (this.hiddenInput) {
        this.hiddenInput.value = variant.id;
        this.hiddenInput.disabled = false;
      }
      
      // Update select elements to match variant
      this.updateSelectElements(variant);
      
      // Update all UI elements following Shopify patterns
      this.updatePriceDisplay(variant);
      this.updateAvailabilityDisplay(variant);
      this.updateInventoryDisplay(variant);
      this.updateSkuDisplay(variant);
      this.updateBarcodeDisplay(variant);
      this.updateWeightDisplay(variant);
      this.updateVariantImage(variant);
      
      // Update URL if enabled (handle browser navigation)
      if (updateUrl && this.productData.settings.updateUrl) {
        this.updateUrl(variant);
      }
      
      // Clear any errors
      this.hideError();
      
      // Announce to screen readers for accessibility
      this.announceVariantChange(variant);
      
      // Dispatch custom event for other components to listen
      this.dispatchEvent(new CustomEvent('variant-picker:change', {
        bubbles: true,
        detail: { 
          variant: variant,
          productData: this.productData 
        }
      }));
      
    } catch (error) {
      console.error('Enhanced Variant Picker: Error selecting variant', error);
      this.showError('Error selecting variant');
    }
  }

  /**
   * Update select elements to match variant
   */
  updateSelectElements(variant) {
    try {
      this.selects.forEach((select, index) => {
        if (variant.options[index]) {
          select.value = variant.options[index];
        }
      });
    } catch (error) {
      console.error('Enhanced Variant Picker: Error updating select elements', error);
    }
  }

  /**
   * Update price display using Shopify's money formatting
   */
  updatePriceDisplay(variant) {
    if (!this.priceElement || !this.productData.settings.enablePricing) return;
    
    try {
      let priceHtml = '';
      
      // Handle compare at price following Shopify patterns
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        priceHtml = `
          <span class="price--on-sale">${this.formatMoney(variant.price)}</span>
          <span class="price--compare">${this.formatMoney(variant.compare_at_price)}</span>
        `;
      } else {
        priceHtml = `<span class="price--regular">${this.formatMoney(variant.price)}</span>`;
      }
      
      this.priceElement.innerHTML = priceHtml;
    } catch (error) {
      console.error('Enhanced Variant Picker: Error updating price display', error);
    }
  }

  /**
   * Update availability display with proper accessibility
   */
  updateAvailabilityDisplay(variant) {
    if (!this.availabilityElement) return;
    
    try {
      // Handle variant availability properly following Shopify patterns
      const availabilityClass = variant.available ? 'variant-availability--available' : 'variant-availability--sold-out';
      const availabilityText = variant.available ? 'Available' : 'Sold out';
      
      this.availabilityElement.innerHTML = `<span class="${availabilityClass}">${availabilityText}</span>`;
    } catch (error) {
      console.error('Enhanced Variant Picker: Error updating availability display', error);
    }
  }

  /**
   * Update inventory display
   */
  updateInventoryDisplay(variant) {
    if (!this.inventoryElement || !this.productData.settings.showInventory || !variant.inventory_management) return;
    
    try {
      const quantity = variant.inventory_quantity;
      const threshold = this.productData.settings.lowStockThreshold || 10;
      
      let inventoryHtml = '';
      
      if (quantity > 0) {
        if (quantity <= threshold) {
          inventoryHtml = `<span class="inventory--low">Only ${quantity} left!</span>`;
        } else {
          inventoryHtml = `<span class="inventory--available">${quantity} in stock</span>`;
        }
      } else {
        inventoryHtml = `<span class="inventory--out-of-stock">Out of stock</span>`;
      }
      
      this.inventoryElement.innerHTML = inventoryHtml;
    } catch (error) {
      console.error('Enhanced Variant Picker: Error updating inventory display', error);
    }
  }

  /**
   * Update SKU display with proper validation
   */
  updateSkuDisplay(variant) {
    if (!this.skuElement || !variant.sku) return;
    
    try {
      const skuValueElement = this.skuElement.querySelector('.sku-value');
      if (skuValueElement) {
        skuValueElement.textContent = variant.sku;
      }
    } catch (error) {
      console.error('Enhanced Variant Picker: Error updating SKU display', error);
    }
  }

  /**
   * Update barcode display
   */
  updateBarcodeDisplay(variant) {
    if (!this.barcodeElement || !variant.barcode) return;
    
    try {
      const barcodeValueElement = this.barcodeElement.querySelector('.barcode-value');
      if (barcodeValueElement) {
        barcodeValueElement.textContent = variant.barcode;
      }
    } catch (error) {
      console.error('Enhanced Variant Picker: Error updating barcode display', error);
    }
  }

  /**
   * Update weight display
   */
  updateWeightDisplay(variant) {
    if (!this.weightElement || !variant.weight) return;
    
    try {
      const weightValueElement = this.weightElement.querySelector('.weight-value');
      if (weightValueElement) {
        const weightText = `${variant.weight} ${variant.weight_unit || 'g'}`;
        weightValueElement.textContent = weightText;
      }
    } catch (error) {
      console.error('Enhanced Variant Picker: Error updating weight display', error);
    }
  }

  /**
   * Update variant image following Shopify patterns
   */
  updateVariantImage(variant) {
    if (!this.productData.settings.enableImages || !variant.featured_image) return;
    
    try {
      // Find and update product images
      const productImages = document.querySelectorAll('.product__media img, .product-gallery img');
      
      productImages.forEach(img => {
        if (img.dataset.variantId === variant.featured_image.id.toString()) {
          img.parentElement.classList.add('is-active');
        } else {
          img.parentElement.classList.remove('is-active');
        }
      });
      
      // Dispatch image change event
      this.dispatchEvent(new CustomEvent('variant-picker:image-change', {
        bubbles: true,
        detail: { image: variant.featured_image }
      }));
      
    } catch (error) {
      console.error('Enhanced Variant Picker: Error updating variant image', error);
    }
  }

  /**
   * Clear variant selection following Shopify patterns
   */
  clearVariantSelection() {
    try {
      // Disable hidden input
      if (this.hiddenInput) {
        this.hiddenInput.value = '';
        this.hiddenInput.disabled = true;
      }
      
      // Reset displays to default state
      if (this.availabilityElement) {
        this.availabilityElement.innerHTML = '<span class="variant-availability--select">Select options</span>';
      }
      
      if (this.priceElement) {
        this.priceElement.innerHTML = '<span class="price--placeholder">Select options to see price</span>';
      }
      
      // Clear inventory, SKU, barcode, weight displays
      [this.inventoryElement, this.skuElement, this.barcodeElement, this.weightElement].forEach(element => {
        if (element) {
          element.innerHTML = '';
        }
      });
      
    } catch (error) {
      console.error('Enhanced Variant Picker: Error clearing variant selection', error);
    }
  }

  /**
   * Show loading state with accessibility support
   */
  showLoading() {
    this.isLoading = true;
    this.classList.add('variant-picker--loading');
    
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.remove('visually-hidden');
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    this.isLoading = false;
    this.classList.remove('variant-picker--loading');
    
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.add('visually-hidden');
    }
  }

  /**
   * Show error message with proper accessibility
   */
  showError(message) {
    if (!this.errorDisplay) return;
    
    this.classList.add('variant-picker--error');
    this.errorDisplay.classList.remove('visually-hidden');
    
    const errorText = this.errorDisplay.querySelector('.error-text');
    if (errorText) {
      errorText.textContent = message;
    }
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }

  /**
   * Hide error message
   */
  hideError() {
    if (!this.errorDisplay) return;
    
    this.classList.remove('variant-picker--error');
    this.errorDisplay.classList.add('visually-hidden');
  }

  /**
   * Announce variant change to screen readers
   */
  announceVariantChange(variant) {
    if (!this.announcementElement) return;
    
    try {
      const announcement = `Selected ${variant.title}, ${variant.available ? 'available' : 'sold out'}, ${this.formatMoney(variant.price)}`;
      this.announcementElement.textContent = announcement;
      
      // Clear announcement after a delay
      setTimeout(() => {
        this.announcementElement.textContent = '';
      }, 1000);
    } catch (error) {
      console.error('Enhanced Variant Picker: Error announcing variant change', error);
    }
  }

  /**
   * Format money using Shopify's money format
   */
  formatMoney(cents) {
    try {
      const money = cents / 100;
      const format = this.productData.moneyFormat || '${{amount}}';
      return format.replace('{{amount}}', money.toFixed(2));
    } catch (error) {
      console.error('Enhanced Variant Picker: Error formatting money', error);
      return `$${(cents / 100).toFixed(2)}`;
    }
  }

  /**
   * Set initial state based on current variant or URL parameters
   */
  setInitialState() {
    try {
      // Handle URL parameters for variant selection
      const urlParams = new URLSearchParams(window.location.search);
      const variantId = urlParams.get('variant');
      
      let targetVariant = null;
      
      if (variantId) {
        targetVariant = this.productData.variants.find(variant => 
          variant.id.toString() === variantId
        );
      } else if (this.productData.selectedVariant) {
        targetVariant = this.productData.selectedVariant;
      }
      
      if (targetVariant) {
        this.selectVariant(targetVariant, false);
      } else {
        // Auto-select first available variant if enabled
        if (this.productData.settings.selectionBehavior === 'auto_select_first') {
          const firstAvailable = this.productData.variants.find(variant => variant.available);
          if (firstAvailable) {
            this.selectVariant(firstAvailable, false);
          }
        }
      }
    } catch (error) {
      console.error('Enhanced Variant Picker: Error setting initial state', error);
    }
  }

  /**
   * Update URL with variant parameter (handle browser navigation)
   */
  updateUrl(variant) {
    if (!window.history || !window.history.replaceState) return;
    
    try {
      const url = new URL(window.location);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);
    } catch (error) {
      console.error('Enhanced Variant Picker: Error updating URL', error);
    }
  }

  /**
   * Handle form submission validation
   */
  handleFormSubmit(event) {
    try {
      // Validate variant is selected
      if (!this.hiddenInput || !this.hiddenInput.value || this.hiddenInput.disabled) {
        event.preventDefault();
        this.showError('Please select all product options');
        return false;
      }
      
      // Check if variant is available
      const currentVariant = this.productData.variants.find(v => v.id.toString() === this.hiddenInput.value);
      if (currentVariant && !currentVariant.available) {
        event.preventDefault();
        this.showError('Selected variant is out of stock');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Enhanced Variant Picker: Error in form submission', error);
      event.preventDefault();
      return false;
    }
  }

  /**
   * Handle error with proper logging
   */
  handleError(error, context) {
    console.error(`Enhanced Variant Picker Error [${context}]:`, error);
    this.showError('An error occurred. Please refresh the page.');
  }

  /**
   * Handle Shopify section events (dynamic content loading)
   */
  handleSectionLoad(event) {
    if (event.detail.sectionId === this.dataset.section) {
      this.init();
    }
  }

  handleSectionUnload(event) {
    if (event.detail.sectionId === this.dataset.section) {
      this.cleanup();
    }
  }

  handleSelectFocus(event) {
    event.target.parentElement.classList.add('variant-picker__select-wrapper--focused');
  }

  handleSelectBlur(event) {
    event.target.parentElement.classList.remove('variant-picker__select-wrapper--focused');
  }

  /**
   * Cleanup method for proper memory management
   */
  cleanup() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  /**
   * Disconnected callback (Web Components lifecycle)
   */
  disconnectedCallback() {
    this.cleanup();
  }
}

// Register the custom element
if (!customElements.get('variant-picker-dropdown')) {
  customElements.define('variant-picker-dropdown', VariantPickerDropdown);
}

// Initialize existing elements on page load
document.addEventListener('DOMContentLoaded', () => {
  const existingPickers = document.querySelectorAll('variant-picker-dropdown:not([data-initialized])');
  existingPickers.forEach(picker => {
    picker.setAttribute('data-initialized', 'true');
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VariantPickerDropdown;
}
