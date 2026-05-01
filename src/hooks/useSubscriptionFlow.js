"use client";

import { useState, useCallback, useEffect } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { SubscriptionService, SUBSCRIPTION_PLANS } from '@/services/subscriptionService';
import { getStripeService } from '@/services/stripeService';

/**
 * Custom hook for subscription management
 * Combines all the services and state management
 */
export function useSubscriptionFlow() {
  const {
    setPaymentState,
    setSubscription,
    setError,
    setSuccessMessage,
    setLoading,
    isProcessing,
    PAYMENT_STATES
  } = usePayment();

  const [stripeService] = useState(() => getStripeService());
  const [isStripeReady, setIsStripeReady] = useState(false);

  // Initialize Stripe on component mount
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        await stripeService.initialize();
        setIsStripeReady(true);
      } catch (error) {
        setError(`Stripe initialization failed: ${error.message}`);
      }
    };

    initializeStripe();
  }, [stripeService, setError]);

  /**
   * Create subscription and handle payment
   */
  const createSubscription = useCallback(async (planId, paymentDetails = {}) => {
    try {
      setLoading(true);
      setPaymentState(PAYMENT_STATES.CREATING_SUBSCRIPTION);

      // Get plan details
      const plan = SUBSCRIPTION_PLANS[planId];
      if (!plan) {
        throw new Error('Invalid subscription plan');
      }

      console.log('🔄 Creating subscription for plan:', plan);

      // Create subscription on backend
      const subscriptionData = {
        price_id: plan.price_id,
        metadata: {
          ...plan.metadata,
          plan_name: plan.name,
          plan_id: planId
        }
      };

      const response = await SubscriptionService.createSubscription(subscriptionData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create subscription');
      }

      const { subscription } = response.data;
      
      // Check if payment is needed (subscription status is incomplete)
      if (subscription.status === 'incomplete' && subscription.client_secret) {
        setPaymentState(PAYMENT_STATES.PROCESSING_PAYMENT);
        
        // Process payment with Stripe
        const paymentResult = await stripeService.confirmCardPayment(
          subscription.client_secret,
          paymentDetails
        );

        if (paymentResult.error) {
          throw new Error(paymentResult.error.message);
        }

        // Payment successful
        setSubscription(subscription);
        setSuccessMessage('Subscription activated successfully!');
        
        return {
          success: true,
          subscription,
          paymentIntent: paymentResult.paymentIntent
        };
      } else if (subscription.status === 'active') {
        // Subscription is already active
        setSubscription(subscription);
        setSuccessMessage('Subscription activated successfully!');
        
        return {
          success: true,
          subscription
        };
      } else {
        throw new Error('Unexpected subscription status');
      }

    } catch (error) {
      console.error('❌ Subscription creation failed:', error);
      setError(error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  }, [
    setLoading, 
    setPaymentState, 
    setSubscription, 
    setSuccessMessage, 
    setError,
    stripeService,
    PAYMENT_STATES
  ]);

  /**
   * Fetch active subscription
   */
  const fetchActiveSubscription = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await SubscriptionService.getActiveSubscription();
      
      if (response && response.success) {
        setSubscription(response.data);
      } else {
        setSubscription(null);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch active subscription:', error);
      // Don't set error for this, as it's normal to not have a subscription
      setSubscription(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSubscription]);

  /**
   * Cancel subscription
   */
  const cancelSubscription = useCallback(async (subscriptionId, cancelAtPeriodEnd = true) => {
    try {
      setLoading(true);
      
      const response = await SubscriptionService.cancelSubscription(subscriptionId, cancelAtPeriodEnd);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel subscription');
      }

      setSuccessMessage('Subscription cancelled successfully');
      
      // Refresh subscription data
      await fetchActiveSubscription();
      
      return { success: true };
    } catch (error) {
      console.error('❌ Subscription cancellation failed:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [fetchActiveSubscription, setLoading, setSuccessMessage, setError]);

  /**
   * Resume subscription
   */
  const resumeSubscription = useCallback(async (subscriptionId) => {
    try {
      setLoading(true);
      
      const response = await SubscriptionService.resumeSubscription(subscriptionId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to resume subscription');
      }

      setSuccessMessage('Subscription resumed successfully');
      
      // Refresh subscription data
      await fetchActiveSubscription();
      
      return { success: true };
    } catch (error) {
      console.error('❌ Subscription resume failed:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [fetchActiveSubscription, setLoading, setSuccessMessage, setError]);

  /**
   * Setup Stripe card element
   */
  const setupStripeCardElement = useCallback(async (containerSelector) => {
    try {
      if (!isStripeReady) {
        throw new Error('Stripe not ready');
      }

      stripeService.createCardElement();
      await stripeService.mountCardElement(containerSelector);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to setup Stripe card element:', error);
      setError(`Card element setup failed: ${error.message}`);
      return false;
    }
  }, [isStripeReady, stripeService, setError]);

  return {
    // State
    isStripeReady,
    isProcessing: isProcessing(),
    
    // Actions
    createSubscription,
    cancelSubscription,
    resumeSubscription,
    fetchActiveSubscription,
    setupStripeCardElement,
    
    // Stripe service instance
    stripeService,
    
    // Available plans
    plans: SUBSCRIPTION_PLANS
  };
}

export default useSubscriptionFlow;