import type { Currency } from '@/types';

export function formatCurrency(amount: number, currency: Currency = 'MYR'): string {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr + 'T00:00:00'));
}

export function isCurrentMonth(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export function toMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // "YYYY-MM"
}
