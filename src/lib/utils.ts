import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Exchange rates relative to 1 USD
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  BDT: 110.5,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151.4,
  INR: 83.3,
  AED: 3.67,
};

export const CURRENCIES: { code: string; symbol: string; label: string }[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'BDT', symbol: '৳', label: 'Bangladeshi Taka' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
];

export function formatPrice(price: number, currency: string = 'USD') {
  // Use specialized formatting for BDT and others
  if (currency === 'BDT') {
    return `৳${price.toLocaleString('en-IN')}`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

export function convertPrice(priceUSD: number, targetCurrency: string) {
  const rate = EXCHANGE_RATES[targetCurrency] || 1;
  return priceUSD * rate;
}
