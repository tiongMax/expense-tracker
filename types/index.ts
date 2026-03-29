export type Category =
  | 'Food'
  | 'Transport'
  | 'Housing'
  | 'Entertainment'
  | 'Health'
  | 'Shopping'
  | 'Utilities'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string | null;
  date: string;
  created_at: string;
}

export interface Budget {
  id: string;
  category: Category;
  monthly_limit: number;
  created_at: string;
}

export interface BudgetStatus extends Budget {
  spent: number;
  percentage: number;
  isWarning: boolean;
  isOver: boolean;
}
