import { BudgetStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/lib/constants';

interface Props {
  status: BudgetStatus;
  onDelete: (id: string) => void;
}

export default function BudgetProgressCard({ status, onDelete }: Props) {
  const { category, monthly_limit, spent, percentage, isWarning, isOver } = status;

  const barColor = isOver
    ? 'bg-red-500'
    : isWarning
    ? 'bg-amber-400'
    : 'bg-green-500';

  const clampedPercent = Math.min(percentage, 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: CATEGORY_COLORS[category] ?? '#6b7280' }}
          />
          <span className="font-medium text-gray-900">{category}</span>
        </div>
        <div className="flex items-center gap-2">
          {isOver && (
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              Over Budget
            </span>
          )}
          {isWarning && !isOver && (
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Near Limit
            </span>
          )}
          <button
            onClick={() => onDelete(status.id)}
            className="text-xs text-gray-400 hover:text-red-500"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600 mb-1.5">
        <span>{formatCurrency(spent)} spent</span>
        <span>{formatCurrency(monthly_limit)} limit</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`${barColor} h-2 rounded-full transition-all`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-1.5 text-right">
        {percentage.toFixed(0)}% used
      </p>
    </div>
  );
}
