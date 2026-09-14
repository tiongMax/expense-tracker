import { Expense } from '@/types';
import { formatCurrency, isCurrentMonth } from '@/lib/utils';
import Icon, { IconName } from '@/components/ui/Icon';

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
    { label: 'Total spent', value: formatCurrency(total), note: 'this month', icon: 'wallet' as IconName, tone: 'emerald' },
    { label: 'Transactions', value: count.toString(), note: count === 1 ? 'expense logged' : 'expenses logged', icon: 'receipt' as IconName, tone: 'blue' },
    { label: 'Top category', value: topCategory ? topCategory[0] : '—', note: topCategory ? formatCurrency(topCategory[1]) : 'No spend yet', icon: 'target' as IconName, tone: 'amber' },
    { label: 'Daily average', value: formatCurrency(avgPerDay), note: 'for this month', icon: 'trend' as IconName, tone: 'coral' },
  ];

  const tones: Record<string, string> = { emerald: 'bg-emerald-50 text-emerald-700', blue: 'bg-blue-50 text-blue-700', amber: 'bg-amber-50 text-amber-700', coral: 'bg-rose-50 text-rose-700' };

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(card => (
        <div key={card.label} className="card-surface group p-5 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm font-medium text-slate-500">{card.label}</p><p className="mt-3 text-[1.7rem] font-bold tracking-tight text-slate-950">{card.value}</p></div>
            <span className={`grid size-11 place-items-center rounded-full ${tones[card.tone]}`}><Icon name={card.icon} className="size-5" /></span>
          </div>
          <p className="mt-2 text-xs text-slate-400">{card.note}</p>
        </div>
      ))}
    </div>
  );
}
