'use client';

import { useState, useEffect, useCallback } from 'react';
import { Expense } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import ExpenseForm from './ExpenseForm';
import { CATEGORY_COLORS } from '@/lib/constants';
import Icon from '@/components/ui/Icon';

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const fetchExpenses = useCallback(async () => {
    const res = await fetch('/api/expenses');
    const data = await res.json();
    if (!res.ok) setError('We could not connect to your data. Check that the database is running, then refresh.');
    else setExpenses(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this expense?')) return;
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  async function handleSubmit(data: Parameters<React.ComponentProps<typeof ExpenseForm>['onSubmit']>[0]) {
    if (editTarget) {
      const res = await fetch(`/api/expenses/${editTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Failed to update expense');
      setExpenses(prev => prev.map(e => e.id === editTarget.id ? updated : e));
    } else {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created.error || 'Failed to create expense');
      setExpenses(prev => [created, ...prev]);
    }
    setShowForm(false);
    setEditTarget(null);
  }

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Your activity</p>
          <h1 className="page-title">Every expense, in one place.</h1>
          <p className="page-kicker">Review, edit, and keep your day-to-day spending tidy.</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#0d1f31] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#17344f]"
        >
          <Icon name="plus" className="size-4" /> <span className="hidden sm:inline">Add expense</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">{error}</div>
      ) : expenses.length === 0 ? (
        <div className="card-surface flex flex-col items-center px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Icon name="receipt" className="size-6" /></span>
          <p className="mt-4 font-semibold text-slate-800">No expenses yet</p>
          <p className="mt-1 text-sm text-slate-500">Add your first expense to start seeing your spending story.</p>
        </div>
      ) : (
        <div className="card-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div><h2 className="font-bold text-slate-900">Expense history</h2><p className="mt-0.5 text-xs text-slate-500">{expenses.length} {expenses.length === 1 ? 'transaction' : 'transactions'} recorded</p></div>
          </div>
          <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Description</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Amount</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(expense => (
                <tr key={expense.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 text-slate-500">{formatDate(expense.date)}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700"
                    >
                      <span className="size-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[expense.category] }} />{expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{expense.description ?? '—'}</td>
                  <td className="px-4 py-4 text-right font-bold text-slate-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => { setEditTarget(expense); setShowForm(true); }}
                        className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-emerald-50 hover:text-emerald-700"
                        aria-label={`Edit ${expense.description ?? 'expense'}`}
                      >
                        <Icon name="edit" className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Delete ${expense.description ?? 'expense'}`}
                      >
                        <Icon name="trash" className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="divide-y divide-slate-100 md:hidden">
            {expenses.map(expense => (
              <div key={expense.id} className="p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}><Icon name="receipt" className="size-4" /></span>
                  <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="truncate font-semibold text-slate-800">{expense.description || expense.category}</p><p className="mt-1 text-xs text-slate-400">{expense.category} · {formatDate(expense.date)}</p></div><p className="shrink-0 font-bold text-slate-900">{formatCurrency(expense.amount)}</p></div>
                    <div className="mt-3 flex gap-2"><button onClick={() => { setEditTarget(expense); setShowForm(true); }} className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">Edit</button><button onClick={() => handleDelete(expense.id)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600">Delete</button></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <ExpenseForm
          initialValues={editTarget ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}
    </>
  );
}
