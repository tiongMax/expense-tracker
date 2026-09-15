'use client';

import { useState } from 'react';
import { Category, Currency } from '@/types';
import { CATEGORIES, CURRENCIES, DEFAULT_CURRENCY } from '@/lib/constants';
import Icon from '@/components/ui/Icon';

interface Props {
  onSave: (category: Category, monthly_limit: number, currency: Currency) => Promise<void>;
}

export default function BudgetForm({ onSave }: Props) {
  const [category, setCategory] = useState<Category>('Food');
  const [limit, setLimit] = useState('');
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!limit || Number(limit) <= 0) {
      setError('Enter a valid budget limit.');
      return;
    }
    setLoading(true);
    try {
      await onSave(category, Number(limit), currency);
      setLimit('');
    } catch {
      setError('Failed to save budget.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-surface mb-7 overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h2 className="font-bold text-slate-900">Set a monthly budget</h2><p className="mt-1 text-xs text-slate-500">Choose a category and give it a comfortable limit.</p></div>
      <form onSubmit={handleSubmit} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-[1fr_1fr_1.2fr_auto] lg:items-end">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 shadow-sm"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Currency</label>
          <select value={currency} onChange={event => setCurrency(event.target.value as Currency)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 shadow-sm">
            {CURRENCIES.map(option => <option key={option.code} value={option.code}>{option.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Monthly limit</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={limit}
            onChange={e => setLimit(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 shadow-sm"
            placeholder="0.00"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0d1f31] px-5 text-sm font-semibold text-white hover:bg-[#17344f] disabled:opacity-50"
        >
          <Icon name="plus" className="size-4" />{loading ? 'Saving...' : 'Save budget'}
        </button>
      </form>
      {error && <p className="px-6 pb-5 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
