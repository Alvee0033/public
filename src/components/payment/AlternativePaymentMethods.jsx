import { Smartphone, ShoppingBag } from "lucide-react";
import { PAYMENT_METHODS } from "@/constants/payment";

/**
 * AlternativePaymentMethods component for non-card payment options
 */
export const AlternativePaymentMethods = ({ paymentMethod }) => {
  if (paymentMethod === PAYMENT_METHODS.CARD) {
    return null;
  }

  const paymentMethodConfig = {
    [PAYMENT_METHODS.CASHAPP]: {
      icon: Smartphone,
      title: 'Pay with Cash App',
      description: "You'll be redirected to Cash App to complete your payment",
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    [PAYMENT_METHODS.AMAZON]: {
      icon: ShoppingBag, 
      title: 'Pay with Amazon',
      description: 'Use your Amazon account to complete the payment',
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  };

  const config = paymentMethodConfig[paymentMethod];
  
  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div className="text-center py-8">
      <div className={`w-16 h-16 ${config.iconBgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`h-8 w-8 ${config.iconColor}`} />
      </div>
      <h3 className="font-semibold text-lg mb-2">{config.title}</h3>
      <p className="text-gray-600 mb-4">{config.description}</p>
    </div>
  );
};