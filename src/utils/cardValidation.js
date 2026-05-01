import { PAYMENT_CONSTANTS, VALIDATION_MESSAGES } from '@/constants/payment';

/**
 * Formats card number with spaces every 4 digits
 * @param {string} value - Raw card number input
 * @returns {string} Formatted card number (e.g., "1234 5678 9012 3456")
 */
export const formatCardNumber = (value) => {
  const cleanValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = cleanValue.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];
  
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  
  return parts.length ? parts.join(' ') : cleanValue;
};

/**
 * Formats expiry date as MM / YY
 * @param {string} value - Raw expiry date input
 * @returns {string} Formatted expiry date (e.g., "12 / 25")
 */
export const formatExpiryDate = (value) => {
  const cleanValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  
  if (cleanValue.length >= 2) {
    return cleanValue.substring(0, 2) + ' / ' + cleanValue.substring(2, 4);
  }
  
  return cleanValue;
};

/**
 * Validates card number using basic Luhn algorithm
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} Whether the card number is valid
 */
export const validateCardNumber = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (cleanNumber.length !== PAYMENT_CONSTANTS.CARD_NUMBER_DIGITS) {
    return false;
  }
  
  // Basic Luhn algorithm implementation
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

/**
 * Validates expiry date (MM/YY format)
 * @param {string} expiryDate - Expiry date to validate
 * @returns {boolean} Whether the expiry date is valid and not expired
 */
export const validateExpiryDate = (expiryDate) => {
  const cleanValue = expiryDate.replace(/\s|\//g, '');
  
  if (cleanValue.length !== 4) {
    return false;
  }
  
  const month = parseInt(cleanValue.substring(0, 2), 10);
  const year = parseInt(cleanValue.substring(2, 4), 10);
  
  if (month < 1 || month > 12) {
    return false;
  }
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

/**
 * Validates security code (CVC)
 * @param {string} securityCode - Security code to validate
 * @returns {boolean} Whether the security code is valid
 */
export const validateSecurityCode = (securityCode) => {
  return securityCode.length === PAYMENT_CONSTANTS.SECURITY_CODE_MAX_LENGTH;
};

/**
 * Validates entire card form
 * @param {Object} formData - Form data object
 * @returns {Object} Validation result with errors
 */
export const validateCardForm = (formData) => {
  const errors = {};
  
  if (!formData.cardNumber) {
    errors.cardNumber = VALIDATION_MESSAGES.CARD_NUMBER_REQUIRED;
  } else if (!validateCardNumber(formData.cardNumber)) {
    errors.cardNumber = VALIDATION_MESSAGES.CARD_NUMBER_INVALID;
  }
  
  if (!formData.expiryDate) {
    errors.expiryDate = VALIDATION_MESSAGES.EXPIRY_REQUIRED;
  } else if (!validateExpiryDate(formData.expiryDate)) {
    errors.expiryDate = VALIDATION_MESSAGES.EXPIRY_INVALID;
  }
  
  if (!formData.securityCode) {
    errors.securityCode = VALIDATION_MESSAGES.SECURITY_CODE_REQUIRED;
  } else if (!validateSecurityCode(formData.securityCode)) {
    errors.securityCode = VALIDATION_MESSAGES.SECURITY_CODE_INVALID;
  }
  
  if (!formData.country) {
    errors.country = VALIDATION_MESSAGES.COUNTRY_REQUIRED;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Detects card brand based on card number
 * @param {string} cardNumber - Card number to analyze
 * @returns {string} Card brand (visa, mastercard, amex, etc.)
 */
export const detectCardBrand = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (cleanNumber.startsWith('4')) {
    return 'visa';
  } else if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return 'mastercard';
  } else if (/^3[47]/.test(cleanNumber)) {
    return 'amex';
  } else if (/^6/.test(cleanNumber)) {
    return 'discover';
  }
  
  return 'unknown';
};