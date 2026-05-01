import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const paymentMethods = [
  { label: 'Card', value: 'card' },
  { label: 'Bank Transfer', value: 'bank_transfer' },
  { label: 'Mobile Banking', value: 'mobile_banking' },
];

const CheckoutForm = ({ plan, formData, onPay, onBack, loading, errorMessage }) => {
  const [method, setMethod] = React.useState('card');
  const [country, setCountry] = React.useState('Bangladesh');
  const [submitting, setSubmitting] = React.useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await onPay({
        paymentMethod: method,
        billingCountry: country,
      });

      if (result?.success === false) {
        return;
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = loading || submitting;
  const billingLabel = plan.billingLabel || 'month';

  return (
    <form className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

      <div className="mb-4 bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          You are subscribing to <span className="font-semibold">{plan.name}</span> for{' '}
          <span className="font-semibold">
            {formatPrice(plan.price, plan.currency)}/{billingLabel}
          </span>
          .
        </p>
        <p className="text-xs text-blue-700 mt-2">
          Subscriber email: {formData.email}
        </p>
      </div>

      <div className="mb-4">
        <span className="font-semibold">Payment Method Preference</span>
        <div className="flex gap-4 mt-2">
          {paymentMethods.map(pm => (
            <button
              key={pm.value}
              type="button"
              className={`px-4 py-2 rounded-lg border font-semibold ${method === pm.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setMethod(pm.value)}
            >
              {pm.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Billing Country</label>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bangladesh">Bangladesh</SelectItem>
            <SelectItem value="USA">USA</SelectItem>
            <SelectItem value="UK">UK</SelectItem>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 bg-gray-50 rounded-lg p-4">
        <span className="font-semibold">Before you confirm</span>
        <ul className="text-xs text-gray-600 mt-2 space-y-1">
          <li>Your subscription will be created and tied to your account.</li>
          <li>You can manage renewal preferences from your profile later.</li>
          <li>Our team can contact you if billing follow-up is required.</li>
        </ul>
      </div>

      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="flex gap-4 mt-6">
        <Button type="button" variant="outline" className="w-full" disabled={isBusy} onClick={onBack}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-500 text-white"
          disabled={isBusy}
        >
          {isBusy ? 'Processing...' : `Confirm Subscription ${formatPrice(plan.price, plan.currency)}`}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;