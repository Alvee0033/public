"use client";

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { SubscriptionService } from '@/services/subscriptionService';
import PlanSelector from './PlanSelector';
import SubscriptionForm from './SubscriptionForm';
import OrderReview from './OrderReview';
import CheckoutForm from './CheckoutForm';
import PaymentSuccess from './PaymentSuccess';

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  preferences: [],
  autoRenew: true,
  emailNotifications: true,
  requirements: '',
};

const SubscriptionFlow = () => {
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [orderDate] = useState(new Date().toLocaleDateString());
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [createdSubscription, setCreatedSubscription] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentUser = async () => {
      try {
        setIsUserLoading(true);
        setUserError('');

        const response = await axios.post('/auth/me');
        const userData = response?.data?.data || response?.data?.user || response?.data;
        const userId = userData?.id || userData?.user_id;

        if (!userId) {
          throw new Error('Unable to verify your account. Please sign in again.');
        }

        if (!isMounted) {
          return;
        }

        setCurrentUser({ ...userData, id: Number(userId) });

        if (typeof userData?.email === 'string') {
          setFormData((prev) => (prev.email ? prev : { ...prev, email: userData.email }));
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setUserError(error?.message || 'Unable to load user profile.');
      } finally {
        if (isMounted) {
          setIsUserLoading(false);
        }
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (section) => {
    setSubmissionError('');

    if (section === 'plan') {
      setStep(0);
    } else if (section === 'info' || section === 'preferences') {
      setStep(1);
    }
  };

  const handlePay = async ({ paymentMethod, billingCountry }) => {
    if (!selectedPlan) {
      const message = 'Please choose a subscription plan before checkout.';
      setSubmissionError(message);
      return { success: false, error: message };
    }

    if (!currentUser?.id) {
      const message = 'Unable to verify your account. Please sign in again.';
      setSubmissionError(message);
      return { success: false, error: message };
    }

    setLoading(true);
    setSubmissionError('');

    try {
      const payload = SubscriptionService.buildCreateSubscriptionPayload({
        userId: currentUser.id,
        plan: selectedPlan,
        formData,
        paymentMethod,
        billingCountry,
      });

      const created = await SubscriptionService.createSubscription(payload);
      setCreatedSubscription(created);
      setPaymentSuccess(true);
      setStep(4);

      return { success: true, subscription: created };
    } catch (error) {
      const message = error?.message || 'Failed to create subscription.';
      setSubmissionError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-2 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">Loading your subscription workspace...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-2 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Unable to Start Subscription</h2>
          <p className="text-red-600 mb-4">{userError}</p>
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        {step === 0 && (
          <PlanSelector
            selectedPlan={selectedPlan}
            setSelectedPlan={(plan) => {
              setSelectedPlan(plan);
              setSubmissionError('');
              setCreatedSubscription(null);
              setStep(1);
            }}
          />
        )}

        {step === 1 && selectedPlan && (
          <SubscriptionForm
            selectedPlan={selectedPlan.name}
            onChange={handleFormChange}
            formData={formData}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && selectedPlan && (
          <OrderReview
            plan={selectedPlan}
            formData={formData}
            onEdit={handleEdit}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && selectedPlan && (
          <CheckoutForm
            plan={selectedPlan}
            formData={formData}
            onPay={handlePay}
            loading={loading}
            onBack={() => setStep(2)}
            errorMessage={submissionError}
          />
        )}

        {step === 4 && selectedPlan && paymentSuccess && (
          <PaymentSuccess
            plan={selectedPlan}
            formData={formData}
            orderDate={orderDate}
            subscription={createdSubscription}
          />
        )}
      </div>
    </div>
  );
};

export default SubscriptionFlow;