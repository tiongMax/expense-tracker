'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Expense } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface Props {
  expenses: Expense[];
}

function getLast6Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

export default function MonthlyBarChart({ expenses }: Props) {
  const months = getLast6Months();

  const totals = months.reduce<Record<string, number>>((acc, m) => {
    acc[m] = 0;
    return acc;
  }, {});

  expenses.forEach(e => {
    const key = e.date.slice(0, 7);
    if (key in totals) totals[key] += e.amount;
  });

  const data = months.map(m => ({
    month: new Date(m + '-01').toLocaleString('en-US', { month: 'short' }),
    total: totals[m],
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Monthly Spending (Last 6 Months)</h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v: number) => `$${v}`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
