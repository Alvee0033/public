import React, { useEffect, useState } from 'react';
import PlanCard from './PlanCard';
import { SubscriptionService } from '@/services/subscriptionService';

const PlanSelector = ({ selectedPlan, setSelectedPlan }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError('');

      const fetchedPlans = await SubscriptionService.getSubscriptionPlans();
      setPlans(fetchedPlans);
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load subscription plans.');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-3xl font-bold text-center mb-2">Choose Your Subscription Plan</h2>
      <p className="text-center text-gray-500 mb-6 max-w-xl">
        Pick a plan that fits your learning goals and continue to secure checkout.
      </p>
      {loading ? (
        <div className="text-center py-8">Loading plans...</div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
            onClick={loadPlans}
          >
            Retry
          </button>
        </div>
      ) : !plans.length ? (
        <div className="text-center py-8 text-gray-600">
          No active subscription plans are available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan?.id === plan.id}
              onSelect={setSelectedPlan}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanSelector;