'use client';

import { useState } from 'react';
import { Category } from '@/types';
import { CATEGORIES } from '@/lib/constants';

interface Props {
  onSave: (category: Category, monthly_limit: number) => Promise<void>;
}

export default function BudgetForm({ onSave }: Props) {
  const [category, setCategory] = useState<Category>('Food');
  const [limit, setLimit] = useState('');
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
      await onSave(category, Number(limit));
      setLimit('');
    } catch {
      setError('Failed to save budget.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Set Monthly Budget</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit ($)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={limit}
            onChange={e => setLimit(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Budget'}
        </button>
      </form>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
