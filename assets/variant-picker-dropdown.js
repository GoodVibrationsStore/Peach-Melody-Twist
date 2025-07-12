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
    this.selects = this.querySelectorAll('.variant-picker__select');
    this.hiddenInput = this.querySelector('[data-variant-id-input]');
    this.errorDisplay = this.querySelector('[data-error-display]');
    this.loadingIndicator = this.querySelector('[data-loading-indicator]');
    this.productData = null;
    this.init();
  }

  init() {
    try {
      this.parseProductData();
      this.selects.forEach(select => {
        select.addEventListener('change', this.onSelectChange.bind(this));
      });
    } catch (e) {
      this.showError('Failed to initialize variant picker.');
      console.error(e);
    }
  }

  parseProductData() {
    const dataScript = this.querySelector('[data-variant-data]');
    if (!dataScript) throw new Error('No variant data found.');
    this.productData = JSON.parse(dataScript.textContent);
  }

  onSelectChange() {
    try {
      this.showLoading();
      const selectedOptions = Array.from(this.selects).map(select => select.value);
      if (selectedOptions.includes('')) {
        this.clearSelection();
        this.hideLoading();
        return;
      }
      const variant = this.productData.variants.find(v =>
        v.options.every((opt, i) => opt === selectedOptions[i])
      );
      if (variant) {
        this.selectVariant(variant);
      } else {
        this.showError('This combination is not available.');
        this.clearSelection();
      }
    } catch (e) {
      this.showError('Error updating variant.');
      console.error(e);
    } finally {
      this.hideLoading();
    }
  }

  selectVariant(variant) {
    if (this.hiddenInput) {
      this.hiddenInput.value = variant.id;
      this.hiddenInput.disabled = false;
    }
    this.hideError();
    // Dispatch event for integration with product form
    this.dispatchEvent(new CustomEvent('variant:changed', {
      bubbles: true,
      detail: { variant }
    }));
  }

  clearSelection() {
    if (this.hiddenInput) {
      this.hiddenInput.value = '';
      this.hiddenInput.disabled = true;
    }
  }

  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.remove('visually-hidden');
    }
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.add('visually-hidden');
    }
  }

  showError(message) {
    if (this.errorDisplay) {
      this.errorDisplay.classList.remove('visually-hidden');
      const errorText = this.errorDisplay.querySelector('.error-text');
      if (errorText) errorText.textContent = message;
    }
  }

  hideError() {
    if (this.errorDisplay) this.errorDisplay.classList.add('visually-hidden');
  }
}

if (!customElements.get('variant-picker-dropdown')) {
  customElements.define('variant-picker-dropdown', VariantPickerDropdown);
}
