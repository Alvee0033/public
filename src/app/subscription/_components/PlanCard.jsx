import React from 'react';
import { Button } from '@/components/ui/button';

export const Plan = {
  id: '',
  name: '',
  price: 0,
  description: '',
  features: [],
  popular: false,
  scholarshipId: ''
};

const PlanCard = ({ plan, selected, onSelect }) => {
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
    <div className={`border rounded-lg p-6 cursor-pointer transition-all ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
      {plan.popular && (
        <div className="text-center mb-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {formatPrice(plan.price, plan.currency)}<span className="text-lg text-gray-500">/{billingLabel}</span>
        </div>
        <p className="text-gray-600">{plan.description}</p>
      </div>

      {Array.isArray(plan.features) && plan.features.length > 0 && (
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      )}

      <Button 
        onClick={() => onSelect(plan)}
        className={`w-full ${selected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
      >
        {selected ? 'Selected' : 'Select Plan'}
      </Button>
    </div>
  );
};

export default PlanCard;