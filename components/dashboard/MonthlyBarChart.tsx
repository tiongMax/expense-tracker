'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Expense, Currency } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface Props {
  expenses: Expense[];
  currency: Currency;
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

export default function MonthlyBarChart({ expenses, currency }: Props) {
  const [range, setRange] = useState<'month' | 'six-months'>('month');
  const months = getLast6Months();
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const totals = months.reduce<Record<string, number>>((acc, m) => {
    acc[m] = 0;
    return acc;
  }, {});

  expenses.forEach(e => {
    const key = e.date.slice(0, 7);
    if (key in totals) totals[key] += e.amount;
  });

  const sixMonthData = months.map(m => ({
    label: new Date(m + '-01').toLocaleString('en-US', { month: 'short' }),
    total: totals[m],
  }));

  const dailyTotals = expenses
    .filter(expense => expense.date.startsWith(currentMonthKey))
    .reduce<Record<number, number>>((result, expense) => {
      const day = Number(expense.date.slice(8, 10));
      result[day] = (result[day] ?? 0) + expense.amount;
      return result;
    }, {});

  const monthData = Array.from({ length: now.getDate() }, (_, index) => ({
    label: String(index + 1),
    total: dailyTotals[index + 1] ?? 0,
  }));

  const data = range === 'month' ? monthData : sixMonthData;
  const periodTotal = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="card-surface p-5 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="font-bold text-slate-900">Spending trend</h2>
          <p className="mt-1 text-xs text-slate-500">{range === 'month' ? `Daily breakdown · ${formatCurrency(periodTotal, currency)} this month` : 'Monthly totals across the last six months'}</p>
        </div>
        <div className="flex w-fit rounded-xl bg-slate-100 p-1" aria-label="Chart period">
          <button type="button" aria-pressed={range === 'month'} onClick={() => setRange('month')} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${range === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>This month</button>
          <button type="button" aria-pressed={range === 'six-months'} onClick={() => setRange('six-months')} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${range === 'six-months' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>6 months</button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1ef" />
          <XAxis dataKey="label" interval={range === 'month' ? 2 : 0} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#98a2b3' }} dy={8} />
          <YAxis axisLine={false} tickLine={false} width={62} tickFormatter={(v: number) => formatCurrency(v, currency)} tick={{ fontSize: 11, fill: '#98a2b3' }} />
          <Tooltip labelFormatter={label => range === 'month' ? `${now.toLocaleString('en-US', { month: 'long' })} ${label}` : label} cursor={{ fill: '#f6f8f7' }} contentStyle={{ borderRadius: 12, border: '1px solid #e5e9e6', boxShadow: '0 8px 24px rgba(16,24,40,.08)' }} formatter={(value) => [formatCurrency(Number(value), currency), 'Spent']} />
          <Bar dataKey="total" name="Spent" fill="#168a60" radius={[7, 7, 2, 2]} maxBarSize={range === 'month' ? 24 : 48} />
        </BarChart>
      </ResponsiveContainer>
      {range === 'month' && <p className="mt-2 text-center text-[11px] font-medium text-slate-400">Day of month</p>}
    </div>
  );
}
