'use client';

import { useState, useEffect } from 'react';
import { Budget, BudgetStatus, Expense, Category, Currency } from '@/types';
import { isCurrentMonth } from '@/lib/utils';
import BudgetForm from '@/components/budgets/BudgetForm';
import BudgetProgressCard from '@/components/budgets/BudgetProgressCard';
import Icon from '@/components/ui/Icon';

export default function BudgetsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBudgets() {
      try {
        const [expenseResponse, budgetResponse] = await Promise.all([fetch('/api/expenses'), fetch('/api/budgets')]);
        if (!expenseResponse.ok || !budgetResponse.ok) throw new Error('Could not load budgets');
        const [exp, bud] = await Promise.all([expenseResponse.json(), budgetResponse.json()]);
        setExpenses(exp); setBudgets(bud);
      } catch { setError('We could not connect to your data. Check that the database is running, then refresh.'); }
      finally { setLoading(false); }
    }
    loadBudgets();
  }, []);

  async function handleSaveBudget(category: Category, monthly_limit: number, currency: Currency) {
    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, monthly_limit, currency }),
    });
    const saved = await res.json();
    if (!res.ok) throw new Error(saved.error || 'Failed to save budget');
    setBudgets(prev => {
      const exists = prev.find(b => b.category === category && b.currency === currency);
      if (exists) return prev.map(b => b.category === category && b.currency === currency ? saved : b);
      return [...prev, saved];
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this budget?')) return;
    await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
    setBudgets(prev => prev.filter(b => b.id !== id));
  }

  const budgetStatuses: BudgetStatus[] = budgets.map(b => {
    const spent = expenses
      .filter(e => e.category === b.category && e.currency === b.currency && isCurrentMonth(e.date))
      .reduce((sum, e) => sum + e.amount, 0);
    const percentage = b.monthly_limit > 0 ? (spent / b.monthly_limit) * 100 : 0;
    return { ...b, spent, percentage, isWarning: percentage >= 80, isOver: percentage >= 100 };
  });

  return (
    <div className="animate-rise">
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Plan ahead</p>
        <h1 className="page-title">Budgets that keep you steady.</h1>
        <p className="page-kicker">Set monthly limits and see where your money has room to breathe.</p>
      </div>

      <BudgetForm onSave={handleSaveBudget} />

      {error && <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-slate-200 rounded-[18px]" />)}
        </div>
      ) : budgetStatuses.length === 0 ? (
        <div className="card-surface flex flex-col items-center px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Icon name="target" className="size-6" /></span>
          <p className="mt-4 font-semibold text-slate-800">No budgets yet</p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">Set your first category limit above and we&apos;ll track the progress here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {budgetStatuses.map(b => (
            <BudgetProgressCard key={b.id} status={b} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
