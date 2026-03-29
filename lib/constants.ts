import { Category } from '@/types';

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
