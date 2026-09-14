'use client';

import { useState, useEffect } from 'react';
import { Expense, Category } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import Icon from '@/components/ui/Icon';

interface Props {
  initialValues?: Expense;
  onSubmit: (data: { amount: number; category: Category; description: string; date: string }) => Promise<void>;
  onCancel: () => void;
}

export default function ExpenseForm({ initialValues, onSubmit, onCancel }: Props) {
  const [amount, setAmount] = useState(initialValues?.amount?.toString() ?? '');
  const [category, setCategory] = useState<Category>(initialValues?.category ?? 'Food');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [date, setDate] = useState(initialValues?.date ?? new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setAmount(initialValues.amount.toString());
      setCategory(initialValues.category);
      setDescription(initialValues.description ?? '');
      setDate(initialValues.date);
    }
  }, [initialValues]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ amount: Number(amount), category, description, date });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#07121d]/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="expense-form-title">
      <div className="w-full max-w-md rounded-t-[24px] bg-white p-5 shadow-2xl sm:rounded-[24px] sm:p-6">
        <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-700">Transaction</p><h2 id="expense-form-title" className="mt-1 text-xl font-bold tracking-tight text-slate-900">
          {initialValues ? 'Edit Expense' : 'Add Expense'}
        </h2></div><button type="button" onClick={onCancel} className="grid size-9 place-items-center rounded-full bg-slate-100 text-lg text-slate-500 hover:bg-slate-200" aria-label="Close">×</button></div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-lg font-bold text-slate-900"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800"
              placeholder="Optional note"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800"
              required
            />
          </div>

          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0d1f31] py-2.5 text-sm font-semibold text-white hover:bg-[#17344f] disabled:opacity-50"
            >
              <Icon name={initialValues ? 'edit' : 'plus'} className="size-4" />{loading ? 'Saving...' : initialValues ? 'Save changes' : 'Add expense'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
