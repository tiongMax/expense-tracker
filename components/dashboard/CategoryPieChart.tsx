'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Expense, Currency } from '@/types';
import { CATEGORY_COLORS } from '@/lib/constants';
import { formatCurrency, isCurrentMonth } from '@/lib/utils';

interface Props {
  expenses: Expense[];
  currency: Currency;
}

export default function CategoryPieChart({ expenses, currency }: Props) {
  const thisMonth = expenses.filter(e => isCurrentMonth(e.date));

  const data = Object.entries(
    thisMonth.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return (
      <div className="card-surface flex min-h-[374px] flex-col p-6">
        <div><h2 className="font-bold text-slate-900">By category</h2><p className="mt-1 text-xs text-slate-500">This month&apos;s breakdown</p></div>
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400">No expenses this month</div>
      </div>
    );
  }

  return (
    <div className="card-surface p-5 sm:p-6">
      <div className="mb-3"><h2 className="font-bold text-slate-900">By category</h2><p className="mt-1 text-xs text-slate-500">This month&apos;s breakdown</p></div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={64} outerRadius={96} paddingAngle={3} stroke="none">
            {data.map(entry => (
              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] ?? '#6b7280'} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e9e6', boxShadow: '0 8px 24px rgba(16,24,40,.08)' }} formatter={(value) => formatCurrency(Number(value), currency)} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#667085' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
