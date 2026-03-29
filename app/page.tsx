'use client';

import { useState, useEffect } from 'react';
import { Expense, Budget, BudgetStatus } from '@/types';
import { isCurrentMonth } from '@/lib/utils';
import SummaryCards from '@/components/dashboard/SummaryCards';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import MonthlyBarChart from '@/components/dashboard/MonthlyBarChart';
import BudgetProgressCard from '@/components/budgets/BudgetProgressCard';

export default function DashboardPage() {
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

  const budgetStatuses: BudgetStatus[] = budgets.map(b => {
    const spent = expenses
      .filter(e => e.category === b.category && isCurrentMonth(e.date))
      .reduce((sum, e) => sum + e.amount, 0);
    const percentage = b.monthly_limit > 0 ? (spent / b.monthly_limit) * 100 : 0;
    return { ...b, spent, percentage, isWarning: percentage >= 80, isOver: percentage >= 100 };
  });

  const alertBudgets = budgetStatuses.filter(b => b.isWarning);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-72 bg-gray-200 rounded-xl" />
          <div className="h-72 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <SummaryCards expenses={expenses} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CategoryPieChart expenses={expenses} />
        <MonthlyBarChart expenses={expenses} />
      </div>

      {alertBudgets.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Budget Alerts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alertBudgets.map(b => (
              <BudgetProgressCard key={b.id} status={b} onDelete={() => {}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
