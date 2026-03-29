import { Expense } from '@/types';
import { formatCurrency, isCurrentMonth } from '@/lib/utils';

interface Props {
  expenses: Expense[];
}

export default function SummaryCards({ expenses }: Props) {
  const thisMonth = expenses.filter(e => isCurrentMonth(e.date));
  const total = thisMonth.reduce((sum, e) => sum + e.amount, 0);
  const count = thisMonth.length;

  const byCategory = thisMonth.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  const avgPerDay = count > 0 ? total / new Date().getDate() : 0;

  const cards = [
    { label: 'Total This Month', value: formatCurrency(total) },
    { label: 'Transactions', value: count.toString() },
    { label: 'Top Category', value: topCategory ? topCategory[0] : '—' },
    { label: 'Avg per Day', value: formatCurrency(avgPerDay) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map(card => (
        <div key={card.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-1">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
