import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const featurePreferences = [
  'Free Trials',
  'Discount Coupons',
  'Billing History',
  'User Roles per Plan',
];

const billingPreferences = [
  { label: 'Auto-Renew', field: 'autoRenew' },
  { label: 'Email Notifications', field: 'emailNotifications' },
];

const SubscriptionForm = ({ selectedPlan, onChange, formData, onNext }) => {
  return (
    <form className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8" onSubmit={e => {e.preventDefault(); onNext();}}>
      <h2 className="text-2xl font-bold mb-4 text-center">Tell Us About Yourself</h2>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Selected Plan</span>
          <span className="text-blue-600 font-bold">{selectedPlan}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={e => onChange('firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={e => onChange('lastName', e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={e => onChange('email', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={e => onChange('phone', e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Company (Optional)</label>
        <Input
          type="text"
          value={formData.company}
          onChange={e => onChange('company', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Feature Preferences</label>
        <div className="grid grid-cols-2 gap-2">
          {featurePreferences.map(pref => (
            <div key={pref} className="flex items-center space-x-2">
              <Checkbox
                id={pref}
                checked={formData.preferences.includes(pref)}
                onCheckedChange={checked => {
                  if (checked) {
                    onChange('preferences', [...formData.preferences, pref]);
                  } else {
                    onChange('preferences', formData.preferences.filter(p => p !== pref));
                  }
                }}
              />
              <label htmlFor={pref} className="text-sm">{pref}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Billing Preferences</label>
        <div className="space-y-2">
          {billingPreferences.map(pref => (
            <div key={pref.field} className="flex items-center space-x-2">
              <Checkbox
                id={pref.field}
                checked={formData[pref.field]}
                onCheckedChange={checked => onChange(pref.field, checked)}
              />
              <label htmlFor={pref.field} className="text-sm">{pref.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Additional Requirements</label>
        <Textarea
          value={formData.requirements}
          onChange={e => onChange('requirements', e.target.value)}
          rows={3}
          placeholder="Tell us about any specific requirements or needs..."
        />
      </div>

      <Button type="submit" className="w-full">
        Continue to Review
      </Button>
    </form>
  );
};

export default SubscriptionForm;