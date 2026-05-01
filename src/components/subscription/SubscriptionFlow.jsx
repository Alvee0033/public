"use client";

import React, { useEffect, useRef } from 'react';
import { ArrowRight, CreditCard } from 'lucide-react';
import { useSubscriptionFlow } from '@/hooks/useSubscriptionFlow';
import { PaymentFeedback } from '@/components/payment/PaymentFeedback';

/**
 * Subscription Component - Complete subscription flow
 */
export function SubscriptionFlow({ planId = 'PASSPORT_YEARLY', onSuccess }) {
  const cardElementRef = useRef(null);
  const {
    isStripeReady,
    isProcessing,
    createSubscription,
    setupStripeCardElement,
    plans
  } = useSubscriptionFlow();

  const plan = plans[planId];

  // Setup Stripe card element when component mounts
  useEffect(() => {
    const setupCard = async () => {
      if (isStripeReady && cardElementRef.current) {
        await setupStripeCardElement('#card-element');
      }
    };

    setupCard();
  }, [isStripeReady, setupStripeCardElement]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!isStripeReady) {
      return;
    }

    const formData = new FormData(event.target);
    const paymentDetails = {
      name: formData.get('name'),
      email: formData.get('email'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      postalCode: formData.get('postalCode'),
      country: formData.get('country') || 'US'
    };

    const result = await createSubscription(planId, paymentDetails);
    
    if (result.success && onSuccess) {
      onSuccess(result);
    }
  };

  if (!plan) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Invalid subscription plan</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-emerald-600">${plan.amount}</span>
          <span className="text-gray-600">/{plan.interval}</span>
        </div>
      </div>

      {/* Payment Feedback */}
      <PaymentFeedback className="mb-6" />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Card Element */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Information
          </label>
          <div 
            id="card-element"
            ref={cardElementRef}
            className="p-3 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500"
          >
            {!isStripeReady && (
              <div className="flex items-center gap-2 text-gray-500">
                <CreditCard className="h-4 w-4" />
                <span>Loading payment form...</span>
              </div>
            )}
          </div>
        </div>

        {/* Billing Address */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isStripeReady || isProcessing}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span>Processing...</span>
          ) : (
            <>
              Subscribe for ${plan.amount}/{plan.interval}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}

export default SubscriptionFlow;