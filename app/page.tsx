'use client';

import { useState, useEffect } from 'react';
import { Expense, Budget, BudgetStatus } from '@/types';
import { isCurrentMonth } from '@/lib/utils';
import SummaryCards from '@/components/dashboard/SummaryCards';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import MonthlyBarChart from '@/components/dashboard/MonthlyBarChart';
import BudgetProgressCard from '@/components/budgets/BudgetProgressCard';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [expenseResponse, budgetResponse] = await Promise.all([fetch('/api/expenses'), fetch('/api/budgets')]);
        if (!expenseResponse.ok || !budgetResponse.ok) throw new Error('Could not load dashboard data');
        const [exp, bud] = await Promise.all([expenseResponse.json(), budgetResponse.json()]);
        setExpenses(exp); setBudgets(bud);
      } catch { setError('We could not connect to your data. Check that the database is running, then refresh.'); }
      finally { setLoading(false); }
    }
    loadDashboard();
  }, []);

  const budgetStatuses: BudgetStatus[] = budgets.map(b => {
    const spent = expenses
      .filter(e => e.category === b.category && isCurrentMonth(e.date))
      .reduce((sum, e) => sum + e.amount, 0);
    const percentage = b.monthly_limit > 0 ? (spent / b.monthly_limit) * 100 : 0;
    return { ...b, spent, percentage, isWarning: percentage >= 80, isOver: percentage >= 100 };
  });

  const alertBudgets = budgetStatuses.filter(b => b.isWarning);
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-16 w-72 rounded-xl bg-slate-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-slate-200 rounded-[18px]" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-96 bg-slate-200 rounded-[18px]" />
          <div className="h-96 bg-slate-200 rounded-[18px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-rise">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-emerald-700">{monthLabel}</p>
          <h1 className="page-title">Your money, at a glance.</h1>
          <p className="page-kicker">Keep an eye on your spending without the noise.</p>
        </div>
        <Link href="/expenses" className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#0d1f31] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#17344f]">
          <Icon name="plus" className="size-4" /> Add expense
        </Link>
      </div>
      <SummaryCards expenses={expenses} />

      {error && <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">{error}</div>}

      <div className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_.85fr]">
        <MonthlyBarChart expenses={expenses} />
        <CategoryPieChart expenses={expenses} />
      </div>

      <div className="card-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div><h2 className="font-bold text-slate-900">Budget watch</h2><p className="mt-0.5 text-xs text-slate-500">Categories closest to their limit</p></div>
          <Link href="/budgets" className="flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800">View all <Icon name="arrow" className="size-4" /></Link>
        </div>
        {alertBudgets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3 sm:p-6">
            {alertBudgets.map(b => <BudgetProgressCard key={b.id} status={b} onDelete={() => {}} compact />)}
          </div>
        ) : (
          <div className="flex items-center gap-4 px-6 py-7">
            <span className="grid size-11 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Icon name="target" className="size-5" /></span>
            <div><p className="text-sm font-semibold text-slate-800">Everything looks healthy</p><p className="mt-0.5 text-sm text-slate-500">No budget is near its limit this month.</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
