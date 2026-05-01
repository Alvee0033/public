import React from 'react';
import { Button } from '@/components/ui/button';

const OrderReview = ({ plan, formData, onEdit, onNext }) => {
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

  const billingLabel = plan.billingLabel || 'month';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Review Your Order</h2>
      
      {/* Plan Details */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Selected Plan</h3>
          <Button variant="ghost" size="sm" onClick={() => onEdit('plan')}>
            Edit
          </Button>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{plan.name === 'Starter Plan' ? '🧑' : plan.name === 'Regular Plan' ? '⚡' : '⭐'}</span>
          <span className="font-bold">{plan.name}</span>
        </div>
        <div className="text-sm text-gray-600">{plan.description}</div>
        <div className="font-bold text-blue-600 mt-2">
          {formatPrice(plan.price, plan.currency)}/{billingLabel}
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Customer Information</h3>
          <Button variant="ghost" size="sm" onClick={() => onEdit('info')}>
            Edit
          </Button>
        </div>
        <div className="space-y-1 text-sm">
          <div><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</div>
          <div><span className="font-medium">Email:</span> {formData.email}</div>
          <div><span className="font-medium">Phone:</span> {formData.phone}</div>
          {formData.company && <div><span className="font-medium">Company:</span> {formData.company}</div>}
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Preferences</h3>
          <Button variant="ghost" size="sm" onClick={() => onEdit('preferences')}>
            Edit
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          {formData.preferences.length > 0 && (
            <div>
              <span className="font-medium">Features:</span> {formData.preferences.join(', ')}
            </div>
          )}
          <div>
            <span className="font-medium">Auto-Renew:</span> {formData.autoRenew ? 'Yes' : 'No'}
          </div>
          <div>
            <span className="font-medium">Email Notifications:</span> {formData.emailNotifications ? 'Yes' : 'No'}
          </div>
          {formData.requirements && (
            <div>
              <span className="font-medium">Requirements:</span> {formData.requirements}
            </div>
          )}
        </div>
      </div>

      {/* Order Total */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total Amount</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(plan.price, plan.currency)}/{billingLabel}
          </span>
        </div>
      </div>

      <Button onClick={onNext} className="w-full">
        Proceed to Payment
      </Button>
    </div>
  );
};

export default OrderReview;