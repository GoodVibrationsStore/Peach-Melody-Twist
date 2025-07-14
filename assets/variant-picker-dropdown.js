// Enhanced Variant Picker Dropdown - JavaScript Component
// Following Shopify theme development instructions
// Dropdown-only implementation with accessibility and error handling

class VariantPickerDropdown extends HTMLElement {
  constructor() {
    super();
    this.selects = this.querySelectorAll('.variant-picker__select');
    this.hiddenInput = this.querySelector('[data-variant-id-input]');
    this.errorDisplay = this.querySelector('[data-error-display]');
    this.loadingIndicator = this.querySelector('[data-loading-indicator]');
    this.announcementRegion = document.getElementById(`variant-picker-announcements-${this.dataset.productId}`);
    this.skipLink = null;
    this.productData = null;
    this.handleSectionUnload = this.handleSectionUnload.bind(this);
    this.handleSectionLoad = this.handleSectionLoad.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.init();
    document.addEventListener('shopify:section:unload', this.handleSectionUnload);
    document.addEventListener('shopify:section:load', this.handleSectionLoad);
  }

  addSkipLink() {
    if (!this.skipLink) {
      this.skipLink = document.createElement('a');
      this.skipLink.href = '#main-content';
      this.skipLink.className = 'variant-picker__skip-link visually-hidden-focusable';
      this.skipLink.textContent = 'Skip to main content';
      this.insertAdjacentElement('beforebegin', this.skipLink);
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
        this.announce('This combination is not available.');
        // Set aria-invalid for all selects
        this.selects.forEach(select => select.setAttribute('aria-invalid', 'true'));
      }
    } catch (e) {
      this.showError('Error updating variant.');
      this.announce('Error updating variant.');
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
    this.announce(`Selected variant: ${variant.title}`);
    // Dispatch event for integration with product form
    this.dispatchEvent(new CustomEvent('variant:changed', {
      bubbles: true,
      detail: { variant }
    }));
    // Remove aria-invalid on successful selection
    this.selects.forEach(select => select.removeAttribute('aria-invalid'));
  }

  announce(message) {
    if (this.announcementRegion) {
      this.announcementRegion.textContent = message;
      this.announcementRegion.setAttribute('tabindex', '-1');
      try {
        this.announcementRegion.focus();
      } catch (e) {
        // Element may not be focusable; ignore error
        console.warn('Announcement region could not be focused:', e);
      }
      setTimeout(() => {
        this.announcementRegion.removeAttribute('tabindex');
      }, 1000);
    }
  }
  handleSectionUnload(event) {
    if (event && event.detail && event.detail.sectionId === this.dataset.sectionId) {
      this.removeSelectListeners();
      // Do not remove global event listeners here; only clean up select listeners.
    }
  }

  handleSectionLoad(event) {
    if (event && event.detail && event.detail.sectionId === this.dataset.section) {
      this.init();
    }
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

  addSelectListeners() {
    if (this.selects && typeof this.selects.forEach === 'function') {
      this.selects.forEach(select => {
        select.addEventListener('change', this.onSelectChange);
        select.addEventListener('keydown', this.onSelectKeydown);
      });
    }
  }

  removeSelectListeners() {
    if (this.selects && typeof this.selects.forEach === 'function') {
      this.selects.forEach(select => {
        select.removeEventListener('change', this.onSelectChange);
        select.removeEventListener('keydown', this.onSelectKeydown);
      });
    }
  }

  onSelectKeydown(e) {
    // Keyboard navigation: Enter/Space triggers dropdown, Esc closes, Tab moves
    if (e.key === 'Enter' || e.key === ' ') {
      e.target.click();
    }
    if (e.key === 'Escape') {
      e.target.blur();
    }
  }

  init() {
    try {
      this.parseProductData();
      this.removeSelectListeners();
      this.addSelectListeners();
      this.addSkipLink();
    } catch (e) {
      this.showError('Failed to initialize variant picker.');
      console.error(e);
    }
  }

  disconnectedCallback() {
    this.removeSelectListeners();
    document.removeEventListener('shopify:section:unload', this.handleSectionUnload);
    document.removeEventListener('shopify:section:load', this.handleSectionLoad);
  }
}

if (!customElements.get('variant-picker-dropdown')) {
  customElements.define('variant-picker-dropdown', VariantPickerDropdown);
}
