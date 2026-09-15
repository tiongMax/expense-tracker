'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Expense, Category } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import Icon from '@/components/ui/Icon';

interface Props { initialValues?: Expense; }

export default function ExpenseForm({ initialValues }: Props) {
  const router = useRouter();
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
      const response = await fetch(initialValues ? `/api/expenses/${initialValues.id}` : '/api/expenses', {
        method: initialValues ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), category, description, date }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to save expense');
      router.push('/expenses');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-surface overflow-hidden">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 lg:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="amount" className="mb-2 block text-sm font-semibold text-slate-700">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">$</span>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              autoFocus
              className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-xl font-bold text-slate-900 focus:border-emerald-500 focus:bg-white"
              placeholder="0.00"
              required
            />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 focus:border-emerald-500"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="mb-2 block text-sm font-semibold text-slate-700">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 focus:border-emerald-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span></label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 focus:border-emerald-500"
              placeholder="e.g. Lunch with friends"
            />
          </div>
          </div>

          {error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/expenses"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 px-6 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0d1f31] px-6 text-sm font-semibold text-white hover:bg-[#17344f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name={initialValues ? 'edit' : 'plus'} className="size-4" />{loading ? 'Saving...' : initialValues ? 'Save changes' : 'Add expense'}
            </button>
          </div>
        </form>

        <aside className="border-t border-slate-100 bg-slate-50/70 p-6 lg:border-l lg:border-t-0 lg:p-8">
          <span className="grid size-11 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Icon name="receipt" className="size-5" /></span>
          <h2 className="mt-5 font-bold text-slate-900">A clearer spending picture</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Each expense updates your monthly total, category breakdown, and budget progress automatically.</p>
          <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-xs text-slate-500">
            <p className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-500" />Amounts are stored to two decimal places</p>
            <p className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-500" />Your data stays in local PostgreSQL</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
