"use client";

import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';

/**
 * Success/Error Handling - User feedback component
 */

/**
 * Payment Feedback Component
 */
export function PaymentFeedback({ className = "" }) {
  const { 
    error, 
    successMessage, 
    isProcessing, 
    isSuccess, 
    isError,
    clearMessages
  } = usePayment();

  // Don't render if no messages
  if (!error && !successMessage && !isProcessing()) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Loading State */}
      {isProcessing() && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          <div>
            <p className="font-medium text-blue-800">Processing...</p>
            <p className="text-sm text-blue-600">Please wait while we process your payment</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && isSuccess() && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-green-800">Success!</p>
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
          <button
            onClick={clearMessages}
            className="text-green-400 hover:text-green-600"
            aria-label="Close success message"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && isError() && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-800">Payment Failed</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={clearMessages}
            className="text-red-400 hover:text-red-600"
            aria-label="Close error message"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Toast Notification Component
 */
export function PaymentToast() {
  const { 
    error, 
    successMessage, 
    isSuccess, 
    isError,
    clearMessages
  } = usePayment();

  // Auto-clear success messages after 5 seconds
  React.useEffect(() => {
    if (successMessage && isSuccess()) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, isSuccess, clearMessages]);

  if (!error && !successMessage) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      {/* Success Toast */}
      {successMessage && isSuccess() && (
        <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 mb-3 animate-slide-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Payment Successful</p>
              <p className="text-sm text-gray-600">{successMessage}</p>
            </div>
            <button
              onClick={clearMessages}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && isError() && (
        <div className="bg-white border border-red-200 rounded-lg shadow-lg p-4 mb-3 animate-slide-in">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Payment Failed</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
            <button
              onClick={clearMessages}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Inline Status Component
 */
export function PaymentStatus({ showIcon = true, className = "" }) {
  const { 
    isProcessing, 
    isSuccess, 
    isError, 
    error, 
    successMessage 
  } = usePayment();

  if (isProcessing()) {
    return (
      <div className={`flex items-center gap-2 text-blue-600 ${className}`}>
        {showIcon && <Loader2 className="h-4 w-4 animate-spin" />}
        <span className="text-sm font-medium">Processing payment...</span>
      </div>
    );
  }

  if (isSuccess() && successMessage) {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${className}`}>
        {showIcon && <CheckCircle2 className="h-4 w-4" />}
        <span className="text-sm font-medium">Payment successful</span>
      </div>
    );
  }

  if (isError() && error) {
    return (
      <div className={`flex items-center gap-2 text-red-600 ${className}`}>
        {showIcon && <XCircle className="h-4 w-4" />}
        <span className="text-sm font-medium">Payment failed</span>
      </div>
    );
  }

  return null;
}

/**
 * Warning Component for incomplete payments
 */
export function PaymentWarning({ message, onRetry, className = "" }) {
  return (
    <div className={`flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium text-yellow-800">Action Required</p>
        <p className="text-sm text-yellow-600 mb-3">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Success Page Component
 */
export function PaymentSuccessPage({ 
  title = "Payment Successful!", 
  description = "Your subscription has been activated successfully.",
  onContinue,
  continueText = "Continue to Dashboard"
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        
        {onContinue && (
          <button
            onClick={onContinue}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            {continueText}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Error Page Component
 */
export function PaymentErrorPage({ 
  title = "Payment Failed", 
  description = "There was an issue processing your payment.",
  error,
  onRetry,
  retryText = "Try Again"
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 mb-2">{description}</p>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
}

export default PaymentFeedback;