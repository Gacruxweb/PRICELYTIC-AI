export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  offers: Offer[];
  history: PriceHistory[];
}

export interface Offer {
  id: string;
  storeName: string;
  price: number;
  currency: string;
  link: string;
  isLocal: boolean;
  isInternational: boolean;
  location?: string;
  updatedAt: string;
}

export interface PriceHistory {
  date: string;
  price: number;
}

export type CurrencyCode = 'USD' | 'BDT' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'AED';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number; // Rate relative to USD
}

export interface UserPreferences {
  darkMode: boolean;
  currency: CurrencyCode;
  watchedItems: string[];
  favoriteStores: string[];
}
