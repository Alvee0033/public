import { loadStripe } from "@stripe/stripe-js";

let stripePromise = null;

export const getStripe = () => {
  if (!stripePromise) {
    // Use NEXT_PUBLIC_ prefixed environment variable for client-side access
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;


    if (!stripeKey) {
      console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables");
      console.error("Make sure to add it to your .env.local file or deployment environment");
      return null;
    }

    stripePromise = loadStripe(stripeKey);
  }
  return stripePromise;
};

// Helper function to format card number with spaces
export const formatCardNumber = (value) => {
  if (!value) return value;
  return value
    .replace(/\s+/g, '')
    .replace(/[^0-9]/gi, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();
};

// Helper function to format expiry date
export const formatExpiryDate = (value) => {
  if (!value) return value;
  value = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (value.length > 2) {
    return `${value.slice(0, 2)}/${value.slice(2, 4)}`;
  }
  return value;
};

// Helper function to format CVC
export const formatCVC = (value) => {
  if (!value) return value;
  return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').slice(0, 4);
};
