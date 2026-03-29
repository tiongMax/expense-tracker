'use client';

import { useState, useEffect } from 'react';
import { Budget, BudgetStatus, Expense, Category } from '@/types';
import { isCurrentMonth } from '@/lib/utils';
import BudgetForm from '@/components/budgets/BudgetForm';
import BudgetProgressCard from '@/components/budgets/BudgetProgressCard';

export default function BudgetsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/expenses').then(r => r.json()),
      fetch('/api/budgets').then(r => r.json()),
    ]).then(([exp, bud]) => {
      setExpenses(exp);
      setBudgets(bud);
      setLoading(false);
    });
  }, []);

  async function handleSaveBudget(category: Category, monthly_limit: number) {
    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, monthly_limit }),
    });
    const saved = await res.json();
    setBudgets(prev => {
      const exists = prev.find(b => b.category === category);
      if (exists) return prev.map(b => b.category === category ? saved : b);
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
      .filter(e => e.category === b.category && isCurrentMonth(e.date))
      .reduce((sum, e) => sum + e.amount, 0);
    const percentage = b.monthly_limit > 0 ? (spent / b.monthly_limit) * 100 : 0;
    return { ...b, spent, percentage, isWarning: percentage >= 80, isOver: percentage >= 100 };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Monthly Budgets</h1>

      <BudgetForm onSave={handleSaveBudget} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-36 bg-gray-200 rounded-xl" />)}
        </div>
      ) : budgetStatuses.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No budgets set yet. Add one above!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetStatuses.map(b => (
            <BudgetProgressCard key={b.id} status={b} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
