import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, ShoppingBag } from "lucide-react";
import { PAYMENT_METHODS } from "@/constants/payment";

const paymentMethodOptions = [
  {
    value: PAYMENT_METHODS.CARD,
    id: 'card',
    label: 'Card',
    icon: CreditCard,
    primaryColor: 'primary',
    description: 'Pay with credit or debit card',
  },
  {
    value: PAYMENT_METHODS.CASHAPP,
    id: 'cashapp', 
    label: 'Cash App Pay',
    icon: Smartphone,
    primaryColor: 'green-500',
    description: 'Pay with Cash App',
  },
  {
    value: PAYMENT_METHODS.AMAZON,
    id: 'amazon',
    label: 'Amazon Pay', 
    icon: ShoppingBag,
    primaryColor: 'orange-500',
    description: 'Pay with Amazon account',
  },
];

/**
 * PaymentMethodSelector component for choosing payment method
 * @param {Object} props - Component props
 * @param {string} props.value - Currently selected payment method
 * @param {Function} props.onValueChange - Handler for payment method change
 * @param {boolean} props.disabled - Whether the selector is disabled
 */
export const PaymentMethodSelector = ({ 
  value, 
  onValueChange, 
  disabled = false 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Payment Method</h3>
      <RadioGroup 
        value={value} 
        onValueChange={onValueChange}
        disabled={disabled}
        className="grid grid-cols-3 gap-3"
      >
        {paymentMethodOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;
          
          // Define proper classes for each payment method when selected
          const getSelectedClasses = () => {
            if (!isSelected) return '';
            
            switch (option.value) {
              case PAYMENT_METHODS.CARD:
                return 'border-primary bg-primary text-primary-foreground';
              case PAYMENT_METHODS.CASHAPP:
                return 'border-green-500 bg-green-500 text-white';
              case PAYMENT_METHODS.AMAZON:
                return 'border-orange-500 bg-orange-500 text-white';
              default:
                return 'border-primary bg-primary text-primary-foreground';
            }
          };
          
          return (
            <div key={option.value}>
              <RadioGroupItem 
                value={option.value} 
                id={option.id} 
                className="peer sr-only" 
              />
              <Label
                htmlFor={option.id}
                className={`
                  flex flex-col items-center justify-center rounded-lg border-2 
                  p-3 cursor-pointer transition-all
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isSelected 
                    ? getSelectedClasses()
                    : 'border-muted bg-white hover:bg-accent hover:text-accent-foreground'
                  }
                `}
                aria-label={`Select ${option.label} payment method. ${option.description}`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium text-center leading-tight">
                  {option.label}
                </span>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};