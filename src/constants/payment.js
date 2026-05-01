// Payment form constants and configuration

export const PAYMENT_CONSTANTS = {
  CARD_NUMBER_MAX_LENGTH: 19, // 16 digits + 3 spaces
  EXPIRY_MAX_LENGTH: 7, // MM / YY format
  SECURITY_CODE_MAX_LENGTH: 3,
  CARD_NUMBER_DIGITS: 16,
};

export const PAYMENT_METHODS = {
  CARD: 'card',
  CASHAPP: 'cashapp',
  AMAZON: 'amazon',
};

export const TEST_CARDS = {
  SUCCESS: '4242 4242 4242 4242',
  REQUIRES_AUTH: '4000 0025 0000 3155',
  DECLINED: '4000 0000 0000 9995',
};

export const COUNTRIES = [
  { value: 'Austria', label: 'Austria' },
  { value: 'Germany', label: 'Germany' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'France', label: 'France' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Spain', label: 'Spain' },
];

export const DEFAULT_COUNTRY = 'United States';

export const VALIDATION_MESSAGES = {
  CARD_NUMBER_REQUIRED: 'Card number is required',
  CARD_NUMBER_INVALID: 'Please enter a valid card number',
  EXPIRY_REQUIRED: 'Expiration date is required',
  EXPIRY_INVALID: 'Please enter a valid expiration date (MM/YY)',
  SECURITY_CODE_REQUIRED: 'Security code is required',
  SECURITY_CODE_INVALID: 'Please enter a valid security code',
  COUNTRY_REQUIRED: 'Please select a country',
};