import Link from 'next/link';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import Icon from '@/components/ui/Icon';

export default function NewExpensePage() {
  return (
    <div className="mx-auto max-w-4xl animate-rise">
      <Link href="/expenses" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700">
        <Icon name="arrow" className="size-4 rotate-180" /> Back to expenses
      </Link>
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-emerald-700">New transaction</p>
        <h1 className="page-title">Add an expense.</h1>
        <p className="page-kicker">Capture the details now and keep your monthly picture accurate.</p>
      </div>
      <ExpenseForm />
    </div>
  );
}
