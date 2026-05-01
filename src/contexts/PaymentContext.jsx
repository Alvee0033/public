"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';

/**
 * Payment State Management - Handle subscription states
 */

// Payment states
export const PAYMENT_STATES = {
  IDLE: 'idle',
  CREATING_SUBSCRIPTION: 'creating_subscription',
  PROCESSING_PAYMENT: 'processing_payment',
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading'
};

// Subscription states
export const SUBSCRIPTION_STATES = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  CANCELED: 'canceled',
  INCOMPLETE: 'incomplete',
  PAST_DUE: 'past_due',
  TRIALING: 'trialing',
  UNPAID: 'unpaid'
};

// Action types
const ACTION_TYPES = {
  SET_PAYMENT_STATE: 'SET_PAYMENT_STATE',
  SET_SUBSCRIPTION: 'SET_SUBSCRIPTION',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS_MESSAGE: 'SET_SUCCESS_MESSAGE',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  SET_LOADING: 'SET_LOADING',
  RESET_STATE: 'RESET_STATE'
};

// Initial state
const initialState = {
  paymentState: PAYMENT_STATES.IDLE,
  subscription: null,
  error: null,
  successMessage: null,
  isLoading: false,
  clientSecret: null
};

// Reducer function
function paymentReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_PAYMENT_STATE:
      return {
        ...state,
        paymentState: action.payload,
        error: null
      };

    case ACTION_TYPES.SET_SUBSCRIPTION:
      return {
        ...state,
        subscription: action.payload,
        paymentState: action.payload ? PAYMENT_STATES.SUCCESS : PAYMENT_STATES.IDLE
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        paymentState: PAYMENT_STATES.ERROR,
        isLoading: false
      };

    case ACTION_TYPES.SET_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: action.payload,
        paymentState: PAYMENT_STATES.SUCCESS,
        error: null,
        isLoading: false
      };

    case ACTION_TYPES.CLEAR_MESSAGES:
      return {
        ...state,
        error: null,
        successMessage: null
      };

    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };

    case ACTION_TYPES.RESET_STATE:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

// Create context
const PaymentContext = createContext();

/**
 * Payment Provider Component
 */
export function PaymentProvider({ children }) {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  // Action creators
  const actions = {
    setPaymentState: (paymentState) => {
      dispatch({ type: ACTION_TYPES.SET_PAYMENT_STATE, payload: paymentState });
    },

    setSubscription: (subscription) => {
      dispatch({ type: ACTION_TYPES.SET_SUBSCRIPTION, payload: subscription });
    },

    setError: (error) => {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'An error occurred';
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
    },

    setSuccessMessage: (message) => {
      dispatch({ type: ACTION_TYPES.SET_SUCCESS_MESSAGE, payload: message });
    },

    clearMessages: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_MESSAGES });
    },

    setLoading: (isLoading) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: isLoading });
    },

    resetState: () => {
      dispatch({ type: ACTION_TYPES.RESET_STATE });
    }
  };

  // Helper functions
  const helpers = {
    isProcessing: () => {
      return state.paymentState === PAYMENT_STATES.CREATING_SUBSCRIPTION || 
             state.paymentState === PAYMENT_STATES.PROCESSING_PAYMENT ||
             state.isLoading;
    },

    isSuccess: () => {
      return state.paymentState === PAYMENT_STATES.SUCCESS;
    },

    isError: () => {
      return state.paymentState === PAYMENT_STATES.ERROR;
    },

    hasActiveSubscription: () => {
      return state.subscription && state.subscription.status === SUBSCRIPTION_STATES.ACTIVE;
    },

    getSubscriptionStatus: () => {
      return state.subscription?.status || SUBSCRIPTION_STATES.INACTIVE;
    }
  };

  const contextValue = {
    ...state,
    ...actions,
    ...helpers
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
}

/**
 * Hook to use payment context
 */
export function usePayment() {
  const context = useContext(PaymentContext);
  
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  
  return context;
}

/**
 * Custom hook for subscription management
 */
export function useSubscription() {
  const {
    subscription,
    setSubscription,
    setError,
    setLoading,
    hasActiveSubscription,
    getSubscriptionStatus
  } = usePayment();

  const subscriptionHelpers = {
    isActive: hasActiveSubscription,
    status: getSubscriptionStatus(),
    
    updateSubscription: (newSubscription) => {
      setSubscription(newSubscription);
    },

    clearSubscription: () => {
      setSubscription(null);
    }
  };

  return {
    subscription,
    ...subscriptionHelpers
  };
}

export default PaymentContext;