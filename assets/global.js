/* Basic global JavaScript functionality */

class Theme {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initAccessibility();
  }

  setupEventListeners() {
    // Cart functionality
    document.addEventListener('submit', this.handleCartSubmit.bind(this));

    // Accessibility improvements
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }

  handleCartSubmit(event) {
    const form = event.target;
    if (!form.matches('[action*="/cart/add"]')) return;

    // Basic cart add functionality
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Adding...';

      // Re-enable after a short delay (basic UX improvement)
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }, 2000);
    }
  }

  handleKeyboard(event) {
    // ESC key handling for modals/popups
    if (event.key === 'Escape') {
      const activeModal = document.querySelector('.modal[aria-hidden="false"]');
      if (activeModal) {
        this.closeModal(activeModal);
      }
    }
  }

  closeModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';

    // Return focus to trigger element
    const trigger = document.querySelector(`[aria-controls="${modal.id}"]`);
    if (trigger) {
      trigger.focus();
    }
  }

  initAccessibility() {
    // Add focus-visible polyfill behavior for older browsers
    document.addEventListener('mousedown', () => {
      document.body.classList.add('using-mouse');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.remove('using-mouse');
      }
    });
  }
}

// Initialize theme when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Theme();
});

// Shopify theme events
document.addEventListener('shopify:section:load', () => {
  console.log('Section loaded');
});

document.addEventListener('shopify:section:unload', () => {
  console.log('Section unloaded');
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.Theme = Theme;
}
