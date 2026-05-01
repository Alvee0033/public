/**
 * Stripe Integration - Frontend payment processing
 */

/**
 * Stripe Service for handling frontend payment processing
 */
export class StripeService {
  
  constructor() {
    this.stripe = null;
    this.elements = null;
    this.cardElement = null;
  }

  /**
   * Initialize Stripe
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      if (!window.Stripe) {
        console.error('❌ Stripe.js not loaded');
        throw new Error('Stripe.js not loaded. Please include Stripe script.');
      }

      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        console.error('❌ Stripe publishable key not found');
        throw new Error('Stripe publishable key not configured');
      }

      this.stripe = window.Stripe(publishableKey);
      console.log('✅ Stripe initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Stripe initialization failed:', error.message);
      throw error;
    }
  }

  /**
   * Create Stripe Elements
   * @param {Object} options - Element options
   * @returns {Object} Elements instance
   */
  createElements(options = {}) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not initialized');
      }

      const defaultOptions = {
        fonts: [{
          cssSrc: 'https://fonts.googleapis.com/css?family=Inter:400,500,600'
        }],
        ...options
      };

      this.elements = this.stripe.elements(defaultOptions);
      console.log('✅ Stripe Elements created');
      return this.elements;
    } catch (error) {
      console.error('❌ Failed to create Stripe Elements:', error.message);
      throw error;
    }
  }

  /**
   * Create card element
   * @param {Object} options - Card element options
   * @returns {Object} Card element
   */
  createCardElement(options = {}) {
    try {
      if (!this.elements) {
        this.createElements();
      }

      const defaultOptions = {
        style: {
          base: {
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#9e2146',
          },
        },
        ...options
      };

      this.cardElement = this.elements.create('card', defaultOptions);
      console.log('✅ Card element created');
      return this.cardElement;
    } catch (error) {
      console.error('❌ Failed to create card element:', error.message);
      throw error;
    }
  }

  /**
   * Confirm card payment for subscription
   * @param {string} clientSecret - Client secret from backend
   * @param {Object} paymentDetails - Payment details
   * @returns {Promise<Object>} Payment result
   */
  async confirmCardPayment(clientSecret, paymentDetails = {}) {
    try {
      if (!this.stripe || !this.cardElement) {
        throw new Error('Stripe or card element not initialized');
      }

      console.log('🔄 Confirming card payment...');

      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: paymentDetails.name || '',
            email: paymentDetails.email || '',
            address: {
              line1: paymentDetails.address || '',
              city: paymentDetails.city || '',
              state: paymentDetails.state || '',
              postal_code: paymentDetails.postalCode || '',
              country: paymentDetails.country || 'US'
            }
          }
        }
      });

      if (result.error) {
        console.error('❌ Payment confirmation failed:', result.error.message);
        throw new Error(result.error.message);
      }

      console.log('✅ Payment confirmed successfully:', result.paymentIntent);
      return result;
    } catch (error) {
      console.error('❌ Payment confirmation error:', error.message);
      throw error;
    }
  }

  /**
   * Mount card element to DOM
   * @param {string} selector - DOM selector
   * @returns {Promise<void>}
   */
  async mountCardElement(selector) {
    try {
      if (!this.cardElement) {
        throw new Error('Card element not created');
      }

      await this.cardElement.mount(selector);
      console.log('✅ Card element mounted to:', selector);
    } catch (error) {
      console.error('❌ Failed to mount card element:', error.message);
      throw error;
    }
  }

  /**
   * Destroy Stripe elements
   */
  destroy() {
    try {
      if (this.cardElement) {
        this.cardElement.destroy();
        this.cardElement = null;
        console.log('✅ Card element destroyed');
      }
    } catch (error) {
      console.error('❌ Error destroying Stripe elements:', error.message);
    }
  }

  /**
   * Check if Stripe is ready
   * @returns {boolean} Ready status
   */
  isReady() {
    return !!(this.stripe && this.cardElement);
  }
}

/**
 * Singleton instance
 */
let stripeServiceInstance = null;

/**
 * Get Stripe service instance
 * @returns {StripeService} Stripe service instance
 */
export const getStripeService = () => {
  if (!stripeServiceInstance) {
    stripeServiceInstance = new StripeService();
  }
  return stripeServiceInstance;
};

export default StripeService;