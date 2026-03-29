# Expense Tracker — Next.js Implementation Plan

## Context
Building a greenfield single-user expense tracker web app. The user needs to log daily expenses, visualize spending trends, and enforce per-category monthly budgets. The working directory is empty — everything will be created from scratch.

**Stack:** Next.js 14+ (App Router) · TypeScript · Tailwind CSS · Supabase (PostgreSQL) · Recharts
**No auth** — single-user app, public anon key access, RLS disabled.

---

## Project Structure

```
expense-tracker/
├── app/
│   ├── layout.tsx                  # Root layout with Navbar
│   ├── page.tsx                    # Dashboard (/)
│   ├── expenses/page.tsx           # Expense list/management
│   └── budgets/page.tsx           # Budget limits
├── app/api/
│   ├── expenses/route.ts           # GET (list), POST (create)
│   ├── expenses/[id]/route.ts      # PUT (update), DELETE
│   ├── budgets/route.ts            # GET (list), POST (upsert)
│   └── budgets/[id]/route.ts       # PUT, DELETE
├── components/
│   ├── layout/Navbar.tsx
│   ├── expenses/ExpenseTable.tsx
│   ├── expenses/ExpenseForm.tsx
│   ├── dashboard/SummaryCards.tsx
│   ├── dashboard/CategoryPieChart.tsx
│   ├── dashboard/MonthlyBarChart.tsx
│   ├── budgets/BudgetProgressCard.tsx
│   └── budgets/BudgetForm.tsx
├── lib/
│   ├── supabase.ts                 # Supabase client singleton
│   ├── constants.ts               # CATEGORIES, CATEGORY_COLORS
│   └── utils.ts                   # formatCurrency, formatDate
├── types/index.ts                  # Expense, Budget, BudgetStatus types
└── .env.local                      # Supabase URL + anon key
```

---

## Database Schema (Supabase SQL Editor)

```sql
create table expenses (
  id          uuid primary key default gen_random_uuid(),
  amount      numeric(10, 2)  not null check (amount > 0),
  category    text            not null,
  description text,
  date        date            not null default current_date,
  created_at  timestamptz     not null default now()
);

create table budgets (
  id            uuid primary key default gen_random_uuid(),
  category      text            not null unique,
  monthly_limit numeric(10, 2)  not null check (monthly_limit > 0),
  created_at    timestamptz     not null default now()
);
```

Disable RLS on both tables in Supabase Dashboard → Table Editor.

---

## TypeScript Types (`types/index.ts`)

```typescript
export type Category = 'Food'|'Transport'|'Housing'|'Entertainment'|'Health'|'Shopping'|'Utilities'|'Other';

export interface Expense {
  id: string; amount: number; category: Category;
  description: string | null; date: string; created_at: string;
}
export interface Budget {
  id: string; category: Category; monthly_limit: number; created_at: string;
}
export interface BudgetStatus extends Budget {
  spent: number; percentage: number; isWarning: boolean; isOver: boolean;
}
```

---

## Bootstrap Sequence

### Phase 1 — Scaffold
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
npm install @supabase/supabase-js recharts
```
Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Phase 2 — Database
Run SQL above in Supabase SQL Editor. Disable RLS. Optionally seed test rows.

### Phase 3 — Foundation Files
1. `types/index.ts`
2. `lib/supabase.ts`, `lib/constants.ts`, `lib/utils.ts`
3. `app/layout.tsx` + `components/layout/Navbar.tsx`

### Phase 4 — API Routes
Build all four route files. Test with curl before building UI.

### Phase 5 — Expenses Page
`ExpenseForm.tsx` → `ExpenseTable.tsx` → `app/expenses/page.tsx`

### Phase 6 — Dashboard
`SummaryCards.tsx` → `CategoryPieChart.tsx` → `MonthlyBarChart.tsx` → `app/page.tsx`

### Phase 7 — Budgets Page
`BudgetProgressCard.tsx` → `BudgetForm.tsx` → `app/budgets/page.tsx`

### Phase 8 — Polish
Loading skeletons (`animate-pulse`), error messages, responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).

---

## Key Implementation Notes

**Data fetching:** All pages are Client Components fetching local `/api/` routes via `fetch` + `useEffect`. Simple, no global state store needed.

**BudgetStatus computation** (used in both `/` and `/budgets`):
```typescript
const budgetStatuses = budgets.map(b => {
  const spent = expenses
    .filter(e => e.category === b.category && isCurrentMonth(e.date))
    .reduce((sum, e) => sum + e.amount, 0);
  const percentage = (spent / b.monthly_limit) * 100;
  return { ...b, spent, percentage, isWarning: percentage >= 80, isOver: percentage >= 100 };
});
```

**Recharts + App Router:** Chart components must have `'use client'` at the top — they use browser APIs.

**Budgets upsert:** `POST /api/budgets` uses Supabase `upsert({ category, monthly_limit }, { onConflict: 'category' })` so saving a budget for the same category updates rather than duplicates.

---

## Verification

1. `GET /api/expenses` returns `[]` on fresh DB; returns rows after inserts
2. `POST /api/expenses` with missing `amount` → HTTP 400
3. `POST /api/budgets` twice for same category → 1 row (upsert works)
4. Adding expense updates table without full page reload
5. Editing expense pre-fills form with existing values
6. Dashboard "Total This Month" matches Supabase table filter
7. Budget at 80% spend → amber bar + "Near Limit" badge
8. Budget over 100% → red bar + "Over Budget" badge
9. No console errors on all three pages with data present
