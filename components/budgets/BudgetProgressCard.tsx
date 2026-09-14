import { BudgetStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/lib/constants';
import Icon from '@/components/ui/Icon';

interface Props {
  status: BudgetStatus;
  onDelete: (id: string) => void;
  compact?: boolean;
}

export default function BudgetProgressCard({ status, onDelete, compact = false }: Props) {
  const { category, monthly_limit, spent, percentage, isWarning, isOver } = status;

  const barColor = isOver
    ? 'bg-rose-500'
    : isWarning
    ? 'bg-amber-400'
    : 'bg-emerald-500';

  const clampedPercent = Math.min(percentage, 100);

  return (
    <div className={compact ? 'rounded-2xl border border-slate-100 bg-slate-50/60 p-4' : 'card-surface p-5'}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: CATEGORY_COLORS[category] ?? '#6b7280' }}
          />
          <span className="font-semibold text-slate-900">{category}</span>
        </div>
        <div className="flex items-center gap-2">
          {isOver && (
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700">
              Over Budget
            </span>
          )}
          {isWarning && !isOver && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
              Near Limit
            </span>
          )}
          {!compact && <button
            onClick={() => onDelete(status.id)}
            className="grid size-7 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            aria-label={`Remove ${category} budget`}
          >
            <Icon name="trash" className="size-3.5" />
          </button>}
        </div>
      </div>

      <div className="mb-2 flex justify-between text-sm">
        <span className="font-semibold text-slate-800">{formatCurrency(spent)} <span className="font-normal text-slate-400">spent</span></span>
        <span className="text-slate-500">{formatCurrency(monthly_limit)}</span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-slate-400"><span>{formatCurrency(Math.max(monthly_limit - spent, 0))} left</span><span className="font-semibold text-slate-500">{percentage.toFixed(0)}% used</span></div>
    </div>
  );
}
