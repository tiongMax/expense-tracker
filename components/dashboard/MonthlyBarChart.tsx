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
    <div className="card-surface p-5 sm:p-6">
      <div className="mb-5"><h2 className="font-bold text-slate-900">Spending trend</h2><p className="mt-1 text-xs text-slate-500">Your last six months</p></div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1ef" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#98a2b3' }} dy={8} />
          <YAxis axisLine={false} tickLine={false} width={52} tickFormatter={(v: number) => `$${v}`} tick={{ fontSize: 11, fill: '#98a2b3' }} />
          <Tooltip cursor={{ fill: '#f6f8f7' }} contentStyle={{ borderRadius: 12, border: '1px solid #e5e9e6', boxShadow: '0 8px 24px rgba(16,24,40,.08)' }} formatter={(value) => formatCurrency(Number(value))} />
          <Bar dataKey="total" fill="#168a60" radius={[7, 7, 2, 2]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
