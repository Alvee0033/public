import { useState, useCallback } from 'react';
import { 
  formatCardNumber, 
  formatExpiryDate, 
  validateCardForm 
} from '@/utils/cardValidation';
import { 
  PAYMENT_CONSTANTS, 
  PAYMENT_METHODS, 
  DEFAULT_COUNTRY 
} from '@/constants/payment';

/**
 * Custom hook for managing payment form state and validation
 * @returns {Object} Form state, handlers, and validation functions
 */
export const usePaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CARD);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    country: DEFAULT_COUNTRY,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});

  /**
   * Handles card number input with formatting
   */
  const handleCardNumberChange = useCallback((e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= PAYMENT_CONSTANTS.CARD_NUMBER_MAX_LENGTH) {
      setFormData(prev => ({ ...prev, cardNumber: formatted }));
      
      // Clear error when user starts typing
      if (errors.cardNumber) {
        setErrors(prev => ({ ...prev, cardNumber: null }));
      }
    }
  }, [errors.cardNumber]);

  /**
   * Handles expiry date input with formatting
   */
  const handleExpiryChange = useCallback((e) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= PAYMENT_CONSTANTS.EXPIRY_MAX_LENGTH) {
      setFormData(prev => ({ ...prev, expiryDate: formatted }));
      
      // Clear error when user starts typing
      if (errors.expiryDate) {
        setErrors(prev => ({ ...prev, expiryDate: null }));
      }
    }
  }, [errors.expiryDate]);

  /**
   * Handles security code input (numbers only)
   */
  const handleSecurityCodeChange = useCallback((e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= PAYMENT_CONSTANTS.SECURITY_CODE_MAX_LENGTH) {
      setFormData(prev => ({ ...prev, securityCode: value }));
      
      // Clear error when user starts typing
      if (errors.securityCode) {
        setErrors(prev => ({ ...prev, securityCode: null }));
      }
    }
  }, [errors.securityCode]);

  /**
   * Handles country selection
   */
  const handleCountryChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, country: value }));
    
    // Clear error when user selects
    if (errors.country) {
      setErrors(prev => ({ ...prev, country: null }));
    }
  }, [errors.country]);

  /**
   * Marks field as touched for validation display
   */
  const handleFieldBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  /**
   * Validates the entire form
   */
  const validateForm = useCallback(() => {
    if (paymentMethod !== PAYMENT_METHODS.CARD) {
      return { isValid: true, errors: {} };
    }

    const validation = validateCardForm(formData);
    setErrors(validation.errors);
    
    return validation;
  }, [paymentMethod, formData]);

  /**
   * Resets the form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData({
      cardNumber: '',
      expiryDate: '',
      securityCode: '',
      country: DEFAULT_COUNTRY,
    });
    setErrors({});
    setTouched({});
    setIsLoading(false);
  }, []);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async (onSubmit) => {
    const validation = validateForm();
    
    if (!validation.isValid) {
      // Mark all fields as touched to show errors
      setTouched({
        cardNumber: true,
        expiryDate: true,
        securityCode: true,
        country: true,
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      await onSubmit({
        paymentMethod,
        ...formData,
      });
      return true;
    } catch (error) {
      console.error('Payment submission error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, paymentMethod, formData]);

  return {
    // State
    paymentMethod,
    formData,
    errors,
    isLoading,
    touched,
    
    // Handlers
    setPaymentMethod,
    handleCardNumberChange,
    handleExpiryChange,
    handleSecurityCodeChange,
    handleCountryChange,
    handleFieldBlur,
    
    // Actions
    validateForm,
    resetForm,
    handleSubmit,
    
    // Computed
    isCardPayment: paymentMethod === PAYMENT_METHODS.CARD,
    isFormValid: Object.keys(errors).length === 0,
  };
};