'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon, { IconName } from '@/components/ui/Icon';

const links = [
  { href: '/', label: 'Overview', icon: 'overview' as IconName },
  { href: '/expenses', label: 'Expenses', icon: 'expenses' as IconName },
  { href: '/budgets', label: 'Budgets', icon: 'budgets' as IconName },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#0d1f31] px-5 py-7 text-white lg:flex">
        <Link href="/" className="flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-400 text-[#0d1f31] shadow-lg shadow-emerald-950/20">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 4c-7 0-12 4-12 10 0 3 2 5 5 5 6 0 8-7 7-15Z"/><path d="M5 21c2-6 6-9 12-13"/></svg>
          </span>
          <span><span className="block text-xl font-bold tracking-tight">Pennywise</span><span className="block text-[10px] text-slate-400">Clear money. Calm mind.</span></span>
        </Link>

        <nav className="mt-10 space-y-2" aria-label="Primary navigation">
          {links.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium ${
                pathname === href
                  ? 'bg-emerald-400/15 text-emerald-300 ring-1 ring-inset ring-emerald-300/10'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon name={icon} className="size-5" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/8 bg-white/5 p-4">
          <p className="text-sm font-semibold text-white">Small choices add up.</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Keep tracking. Your future self will thank you.</p>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-[#f6f7f4]/90 px-4 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-500 text-white"><Icon name="trend" className="size-4" /></span>
          Pennywise
        </Link>
        <span className="text-xs font-medium text-slate-500">Expense tracker</span>
      </header>

      <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur lg:hidden" aria-label="Mobile navigation">
        {links.map(({ href, label, icon }) => (
          <Link key={href} href={href} className={`flex min-w-20 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-semibold ${pathname === href ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500'}`}>
            <Icon name={icon} className="size-5" />{label}
          </Link>
        ))}
      </nav>
    </>
  );
}
