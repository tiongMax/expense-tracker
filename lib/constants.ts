import { Category, Currency } from '@/types';

export const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Housing',
  'Entertainment',
  'Health',
  'Shopping',
  'Utilities',
  'Other',
];

export const CURRENCIES: { code: Currency; label: string }[] = [
  { code: 'MYR', label: 'MYR — Malaysian Ringgit' },
  { code: 'USD', label: 'USD — US Dollar' },
  { code: 'SGD', label: 'SGD — Singapore Dollar' },
  { code: 'EUR', label: 'EUR — Euro' },
  { code: 'GBP', label: 'GBP — British Pound' },
  { code: 'AUD', label: 'AUD — Australian Dollar' },
  { code: 'JPY', label: 'JPY — Japanese Yen' },
];

export const DEFAULT_CURRENCY: Currency = 'MYR';

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Housing: '#8b5cf6',
  Entertainment: '#ec4899',
  Health: '#10b981',
  Shopping: '#f59e0b',
  Utilities: '#6366f1',
  Other: '#6b7280',
};
