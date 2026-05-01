import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const PaymentSuccess = ({ plan, formData, orderDate, subscription }) => {
  const formatPrice = (amount, currency = 'USD') => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(Number(amount || 0));
    } catch (_error) {
      return `$${Number(amount || 0).toFixed(2)}`;
    }
  };

  const formatDate = (dateValue, fallback) => {
    if (!dateValue) {
      return fallback;
    }

    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) {
      return fallback;
    }

    return parsed.toLocaleDateString();
  };

  const billingLabel = plan.billingLabel || 'month';
  const createdDate = formatDate(subscription?.created_at, orderDate);

  return (
    <div className="w-full max-w-xl mx-auto bg-green-50 rounded-xl shadow-md p-6 mb-8">
      <div className="flex flex-col items-center mb-6">
        <span className="text-5xl text-green-500 mb-2">✔</span>
        <h2 className="text-2xl font-bold mb-2 text-center">Subscription Confirmed!</h2>
        <p className="text-center text-gray-700">Welcome to ScholarPASS! Your subscription is now active.</p>
      </div>
      <div className="bg-white rounded-lg p-4 mb-4">
        <h3 className="font-semibold mb-2">Order Confirmation</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{plan.name === 'Starter Plan' ? '🧑' : plan.name === 'Regular Plan' ? '⚡' : '⭐'}</span>
          <span className="font-bold">{plan.name}</span>
        </div>
        <div className="mb-1"><span className="font-bold">Customer:</span> {formData.firstName} {formData.lastName}</div>
        <div className="mb-1"><span className="font-bold">Email:</span> {formData.email}</div>
        <div className="mb-1">
          <span className="font-bold">Subscription ID:</span> {subscription?.id || 'Pending'}
        </div>
        <div className="mb-1"><span className="font-bold">Order Date:</span> {createdDate}</div>
        <div className="mb-1">
          <span className="font-bold">Amount:</span> {formatPrice(plan.price, plan.currency)}/{billingLabel}
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 mb-4">
        <h3 className="font-semibold mb-2">What's Next?</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Check your email for subscription confirmation</li>
          <li>• Access your courses from the dashboard</li>
          <li>• Update billing preferences from your account settings</li>
          <li>• Start exploring premium features now</li>
        </ul>
      </div>
      <div className="flex gap-4">
        <Link href="/learninghub" className="flex-1">
          <Button className="w-full">
            Go to Dashboard
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;