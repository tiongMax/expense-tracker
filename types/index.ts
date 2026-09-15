export type Category =
  | 'Food'
  | 'Transport'
  | 'Housing'
  | 'Entertainment'
  | 'Health'
  | 'Shopping'
  | 'Utilities'
  | 'Other';

export type Currency = 'MYR' | 'USD' | 'SGD' | 'EUR' | 'GBP' | 'AUD' | 'JPY';

export interface Expense {
  id: string;
  amount: number;
  currency: Currency;
  category: Category;
  description: string | null;
  date: string;
  created_at: string;
}

export interface Budget {
  id: string;
  category: Category;
  monthly_limit: number;
  currency: Currency;
  created_at: string;
}

export interface BudgetStatus extends Budget {
  spent: number;
  percentage: number;
  isWarning: boolean;
  isOver: boolean;
}
