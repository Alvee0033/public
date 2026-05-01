import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { detectCardBrand } from "@/utils/cardValidation";

/**
 * CardBrandIcons component to display supported card brands
 */
const CardBrandIcons = ({ cardNumber }) => {
  const detectedBrand = detectCardBrand(cardNumber);
  
  return (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
      {/* Visa */}
      <div className={`h-5 w-8 bg-blue-600 rounded flex items-center justify-center ${detectedBrand === 'visa' ? 'ring-2 ring-blue-400' : 'opacity-60'}`}>
        <svg width="24" height="8" viewBox="0 0 24 8" fill="none">
          <path d="M0.5 0.5H23.5V7.5H0.5V0.5Z" fill="#1A1F71"/>
          <path d="M9.5 2L8.5 6H7L8 2H9.5ZM12 2L11 6H9.5L10.5 2H12ZM14.5 2L13.5 6H12L13 2H14.5ZM17 2L16 6H14.5L15.5 2H17Z" fill="white"/>
        </svg>
      </div>
      
      {/* Mastercard */}
      <div className={`h-5 w-8 bg-gray-100 rounded flex items-center justify-center ${detectedBrand === 'mastercard' ? 'ring-2 ring-gray-400' : 'opacity-60'}`}>
        <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
          <circle cx="9" cy="8" r="6" fill="#EB001B"/>
          <circle cx="15" cy="8" r="6" fill="#F79E1B"/>
          <path d="M12 4.5c1.5 1.5 1.5 4.5 0 6" stroke="#FF5F00" strokeWidth="0.5"/>
        </svg>
      </div>
      
      {/* American Express */}
      <div className={`h-5 w-8 bg-blue-700 rounded flex items-center justify-center ${detectedBrand === 'amex' ? 'ring-2 ring-blue-400' : 'opacity-60'}`}>
        <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
          <rect width="20" height="8" fill="#006FCF"/>
          <path d="M2 2H4L5 6H3L2 2ZM6 2H8L7 6H5L6 2ZM10 2H12L11 6H9L10 2ZM14 2H16L15 6H13L14 2Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

/**
 * ErrorMessage component for displaying field errors
 */
const ErrorMessage = ({ error, show }) => {
  if (!show || !error) return null;
  
  return (
    <p className="text-sm text-red-600 mt-1" role="alert">
      {error}
    </p>
  );
};

/**
 * CardPaymentForm component for credit card payment details
 */
export const CardPaymentForm = ({
  formData,
  errors,
  touched,
  countries = [], // Countries from SWR
  countriesLoading = false,
  onCardNumberChange,
  onExpiryChange,
  onSecurityCodeChange,
  onCountryChange,
  onFieldBlur,
  disabled = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Card Number */}
      <div className="space-y-2">
        <Label 
          htmlFor="card-number" 
          className="text-sm font-medium text-gray-700"
        >
          Card number
        </Label>
        <div className="relative">
          <Input
            id="card-number"
            type="text"
            placeholder="1234 1234 1234 1234"
            value={formData.cardNumber}
            onChange={onCardNumberChange}
            onBlur={() => onFieldBlur('cardNumber')}
            disabled={disabled}
            className={`h-10 pr-24 ${
              errors.cardNumber && touched.cardNumber 
                ? 'border-red-500 focus-visible:ring-red-500' 
                : ''
            }`}
            aria-describedby={errors.cardNumber && touched.cardNumber ? 'card-number-error' : undefined}
            aria-invalid={errors.cardNumber && touched.cardNumber ? 'true' : 'false'}
          />
          <CardBrandIcons cardNumber={formData.cardNumber} />
        </div>
        <ErrorMessage 
          error={errors.cardNumber} 
          show={touched.cardNumber} 
          id="card-number-error"
        />
      </div>

      {/* Expiry and Security Code */}
      <div className="grid grid-cols-2 gap-4">
        {/* Expiry Date */}
        <div className="space-y-2">
          <Label 
            htmlFor="expiry" 
            className="text-sm font-medium text-gray-700 h-5 flex items-center"
          >
            Expiration date
          </Label>
          <Input
            id="expiry"
            type="text"
            placeholder="MM / YY"
            value={formData.expiryDate}
            onChange={onExpiryChange}
            onBlur={() => onFieldBlur('expiryDate')}
            disabled={disabled}
            className={`h-10 ${
              errors.expiryDate && touched.expiryDate 
                ? 'border-red-500 focus-visible:ring-red-500' 
                : ''
            }`}
            aria-describedby={errors.expiryDate && touched.expiryDate ? 'expiry-error' : undefined}
            aria-invalid={errors.expiryDate && touched.expiryDate ? 'true' : 'false'}
          />
          <ErrorMessage 
            error={errors.expiryDate} 
            show={touched.expiryDate}
            id="expiry-error"
          />
        </div>
        
        {/* Security Code */}
        <div className="space-y-2">
          <Label 
            htmlFor="security-code" 
            className="text-sm font-medium text-gray-700 h-5 flex items-center justify-between"
          >
            <span>Security code </span>
            <Info className="h-3 w-3 text-gray-400" aria-label="3-digit code on back of card" />
          </Label>
          <div className="relative">
            <Input
              id="security-code"
              type="text"
              placeholder="CVC"
              value={formData.securityCode}
              onChange={onSecurityCodeChange}
              onBlur={() => onFieldBlur('securityCode')}
              disabled={disabled}
              className={`h-10 pr-12 ${
                errors.securityCode && touched.securityCode 
                  ? 'border-red-500 focus-visible:ring-red-500' 
                  : ''
              }`}
              aria-describedby={errors.securityCode && touched.securityCode ? 'security-code-error' : 'security-code-help'}
              aria-invalid={errors.securityCode && touched.securityCode ? 'true' : 'false'}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span 
                className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded"
                id="security-code-help"
              >
                123
              </span>
            </div>
          </div>
          <ErrorMessage 
            error={errors.securityCode} 
            show={touched.securityCode}
            id="security-code-error"
          />
        </div>
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label 
          htmlFor="country" 
          className="text-sm font-medium text-gray-700"
        >
          Country 
        </Label>
        <Select 
          value={formData.country} 
          onValueChange={onCountryChange}
          disabled={disabled || countriesLoading}
          onOpenChange={(open) => {
            if (!open) onFieldBlur('country');
          }}
        >
          <SelectTrigger 
            className={`h-10 ${
              errors.country && touched.country 
                ? 'border-red-500 focus:ring-red-500' 
                : ''
            }`}
            aria-describedby={errors.country && touched.country ? 'country-error' : undefined}
            aria-invalid={errors.country && touched.country ? 'true' : 'false'}
          >
            <SelectValue placeholder={countriesLoading ? "Loading countries..." : "Select country"} />
          </SelectTrigger>
          <SelectContent>
            {countriesLoading ? (
              <SelectItem value="loading" disabled>
                Loading countries...
              </SelectItem>
            ) : countries.length > 0 ? (
              countries.map((country) => (
                <SelectItem key={country.id || country.code || country.name} value={country.code || country.name || 'unknown'}>
                  {country.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-countries" disabled>
                No countries available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <ErrorMessage 
          error={errors.country} 
          show={touched.country}
          id="country-error"
        />
      </div>
    </div>
  );
};