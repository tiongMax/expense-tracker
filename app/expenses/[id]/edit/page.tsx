'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import Icon from '@/components/ui/Icon';
import type { Expense } from '@/types';

export default function EditExpensePage() {
  const { id } = useParams<{ id: string }>();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function loadExpense() {
      try {
        const response = await fetch(`/api/expenses/${id}`, { signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to load expense');
        setExpense(result);
      } catch (loadError) {
        if ((loadError as Error).name !== 'AbortError') setError(loadError instanceof Error ? loadError.message : 'Unable to load expense');
      }
    }
    loadExpense();
    return () => controller.abort();
  }, [id]);

  return (
    <div className="mx-auto max-w-4xl animate-rise">
      <Link href="/expenses" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700">
        <Icon name="arrow" className="size-4 rotate-180" /> Back to expenses
      </Link>
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Update transaction</p>
        <h1 className="page-title">Edit expense.</h1>
        <p className="page-kicker">Correct the details and keep your reports accurate.</p>
      </div>
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div>
      ) : expense ? (
        <ExpenseForm initialValues={expense} />
      ) : (
        <div className="card-surface h-96 animate-pulse bg-slate-100" />
      )}
    </div>
  );
}
