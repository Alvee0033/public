import axios from '@/lib/axios';

const DEFAULT_PLAN_FEATURES = [
  'Priority support',
  'Access to premium resources',
  'Manage your subscription anytime',
];

const ACTIVE_SUBSCRIPTION_STATES = new Set(['active', 'trialing']);

const extractApiData = (responseData) => {
  if (responseData && typeof responseData === 'object' && 'data' in responseData) {
    return responseData.data;
  }
  return responseData;
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseFeatureList = (featureValue) => {
  if (!featureValue || typeof featureValue !== 'string') {
    return [];
  }

  return featureValue
    .split(/\r?\n|,/)
    .map((item) => item.replace(/^[\-*\u2022]\s*/, '').trim())
    .filter(Boolean);
};

const resolveBillingLabel = (durationType) => {
  const rawName = durationType?.name;
  if (!rawName || typeof rawName !== 'string') {
    return 'month';
  }

  const normalized = rawName.toLowerCase();
  if (normalized.includes('year')) return 'year';
  if (normalized.includes('month')) return 'month';
  if (normalized.includes('week')) return 'week';
  if (normalized.includes('day')) return 'day';

  return rawName;
};

const toBillingCycleValue = (billingLabel) => {
  if (billingLabel === 'year') return 'yearly';
  if (billingLabel === 'month') return 'monthly';
  return String(billingLabel || 'monthly');
};

const mapPlan = (subscriptionType, index = 0) => {
  const features = parseFeatureList(subscriptionType?.key_features);
  const billingLabel = resolveBillingLabel(subscriptionType?.master_duration_type);

  return {
    id: subscriptionType?.id,
    name: subscriptionType?.name || `Plan ${index + 1}`,
    price: toNumber(subscriptionType?.price, 0),
    description:
      subscriptionType?.description ||
      'Subscription plan with premium support and learner resources.',
    features: features.length ? features : DEFAULT_PLAN_FEATURES,
    popular: subscriptionType?.display_sequence === 1 || index === 0,
    currency: (subscriptionType?.master_currency_id || 'USD').toUpperCase(),
    billingLabel,
    billingCycle: toBillingCycleValue(billingLabel),
    isActive: subscriptionType?.is_active !== false,
    raw: subscriptionType,
  };
};

const normalizeSubscription = (rawSubscription) => {
  if (!rawSubscription || typeof rawSubscription !== 'object') {
    return rawSubscription;
  }

  return {
    ...rawSubscription,
    amount: toNumber(rawSubscription.amount, 0),
  };
};

const getApiErrorMessage = (error, fallbackMessage) => {
  const payload = error?.response?.data;
  const message = payload?.message || payload?.error;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return fallbackMessage;
};

/**
 * Subscription Service - API calls to CRM backend
 */
export class SubscriptionService {

  /**
   * Get active subscription plans for checkout
   * @returns {Promise<Array>} Plan list for UI
   */
  static async getSubscriptionPlans() {
    try {
      const response = await axios.get('/master-app-subscription-types');
      const payload = extractApiData(response.data);
      const rawPlans = Array.isArray(payload) ? payload : [];

      return rawPlans
        .map((plan, index) => mapPlan(plan, index))
        .filter((plan) => plan.isActive);
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, 'Failed to load subscription plans')
      );
    }
  }

  /**
   * Build backend-compatible payload for app-user-subscription
   * @param {Object} params
   * @returns {Object}
   */
  static buildCreateSubscriptionPayload({
    userId,
    plan,
    formData = {},
    paymentMethod,
    billingCountry,
  }) {
    if (!userId) {
      throw new Error('User session is required for subscription checkout.');
    }

    if (!plan?.id) {
      throw new Error('Please select a subscription plan.');
    }

    const normalizedPaymentMethod = billingCountry
      ? `${paymentMethod || 'card'} (${billingCountry})`.slice(0, 50)
      : (paymentMethod || 'card');

    return {
      user_id: Number(userId),
      master_app_subscription_types_id: Number(plan.id),
      auto_renew: Boolean(formData.autoRenew),
      payment_method: normalizedPaymentMethod,
      amount: toNumber(plan.price, 0),
      master_currency_id: (plan.currency || 'USD').toUpperCase(),
      billing_cycle: plan.billingCycle || 'monthly',
    };
  }
  
  /**
   * Create a new subscription
  * @param {Object} subscriptionData - CreateAppUserSubscriptionDto payload
   * @returns {Promise<Object>} Subscription creation response
   */
  static async createSubscription(subscriptionData) {
    try {
      const response = await axios.post('/app-user-subscription', subscriptionData);
      const createdSubscription = normalizeSubscription(extractApiData(response.data));

      if (!createdSubscription?.id) {
        throw new Error('Invalid subscription response received from server.');
      }

      return createdSubscription;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, 'Failed to create subscription')
      );
    }
  }

  /**
   * Get active subscription
   * @returns {Promise<Object>} Active subscription data
   */
  static async getActiveSubscription(userId) {
    try {
      const activeSubscriptions = await this.getActiveSubscriptionsByUserId(userId);

      const withKnownState = activeSubscriptions.find((subscription) =>
        ACTIVE_SUBSCRIPTION_STATES.has(String(subscription?.status || '').toLowerCase())
      );

      return withKnownState || activeSubscriptions[0] || null;
    } catch (error) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw new Error(
        getApiErrorMessage(error, 'Failed to fetch active subscription')
      );
    }
  }

  /**
   * Get all subscriptions for a user
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  static async getUserSubscriptions(userId) {
    try {
      const response = await axios.get(`/app-user-subscription/user/${userId}`);
      const payload = extractApiData(response.data);
      const subscriptions = Array.isArray(payload) ? payload : [];

      return subscriptions.map((subscription) => normalizeSubscription(subscription));
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, 'Failed to fetch subscription history')
      );
    }
  }

  /**
   * Get active subscriptions for a user
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  static async getActiveSubscriptionsByUserId(userId) {
    if (!userId) {
      return [];
    }

    try {
      const response = await axios.get(`/app-user-subscription/user/${userId}/active`);
      const payload = extractApiData(response.data);
      const subscriptions = Array.isArray(payload) ? payload : [];

      return subscriptions.map((subscription) => normalizeSubscription(subscription));
    } catch (error) {
      if (error?.response?.status === 404) {
        return [];
      }

      throw new Error(
        getApiErrorMessage(error, 'Failed to fetch active subscriptions')
      );
    }
  }

  /**
   * Cancel subscription
   * @param {string} subscriptionId - Stripe subscription ID
   * @param {boolean} cancelAtPeriodEnd - Whether to cancel at period end
   * @returns {Promise<Object>} Cancellation response
   */
  static async cancelSubscription(subscriptionId, canceledByUserId, reason = 'Canceled by user') {
    try {
      if (!subscriptionId) {
        throw new Error('Subscription id is required to cancel a subscription.');
      }

      const response = await axios.patch(`/app-user-subscription/${subscriptionId}/cancel`, {
        canceledByUserId: Number(canceledByUserId),
        reason,
      });

      return normalizeSubscription(extractApiData(response.data));
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, 'Failed to cancel subscription')
      );
    }
  }

  /**
   * Resume subscription
   * @param {string} subscriptionId - Stripe subscription ID
   * @returns {Promise<Object>} Resume response
   */
  static async resumeSubscription(subscriptionId) {
    try {
      const response = await axios.patch(`/app-user-subscription/${subscriptionId}/renew`);
      return normalizeSubscription(extractApiData(response.data));
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, 'Failed to resume subscription')
      );
    }
  }

  /**
   * Get subscription history
   * @returns {Promise<Object>} Subscription history
   */
  static async getSubscriptionHistory(userId) {
    try {
      return await this.getUserSubscriptions(userId);
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, 'Failed to fetch subscription history')
      );
    }
  }
}

/**
 * Predefined subscription plans
 */
export const SUBSCRIPTION_PLANS = {
  PASSPORT_YEARLY: {
    id: 'passport_yearly',
    name: 'ScholarPASS Passport - Yearly',
    price_id: process.env.NEXT_PUBLIC_STRIPE_PASSPORT_YEARLY_PRICE_ID || 'price_passport_yearly',
    amount: 95,
    currency: 'USD',
    interval: 'year',
    features: [
      'Personalized Pathway',
      'Scholarship Matching Engine', 
      'Verified Student Portfolio',
      'Assessment-Driven Readiness',
      '2 Mentors + 5 AI Agents'
    ],
    metadata: {
      plan_type: 'passport',
      billing_cycle: 'yearly'
    }
  }
};

export default SubscriptionService;