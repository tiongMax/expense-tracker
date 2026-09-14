import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { budgets } from '@/lib/schema';
import { asc } from 'drizzle-orm';
import { isCategory, parsePositiveMoney } from '@/lib/validation';

export async function GET() {
  try {
    const rows = await db.select().from(budgets).orderBy(asc(budgets.category));
    return NextResponse.json(rows.map(r => ({ ...r, monthly_limit: Number(r.monthly_limit) })));
  } catch (e: unknown) {
    console.error('Failed to list budgets', e);
    return NextResponse.json({ error: 'Failed to load budgets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'A valid JSON body is required' }, { status: 400 });
  const { category, monthly_limit } = body;
  const parsedLimit = parsePositiveMoney(monthly_limit);

  if (!isCategory(category)) return NextResponse.json({ error: 'category is invalid' }, { status: 400 });
  if (parsedLimit === null) {
    return NextResponse.json({ error: 'monthly_limit must be a positive number' }, { status: 400 });
  }

  try {
    const [row] = await db.insert(budgets)
      .values({ category, monthly_limit: parsedLimit.toFixed(2) })
      .onConflictDoUpdate({
        target: budgets.category,
        set: { monthly_limit: parsedLimit.toFixed(2) },
      })
      .returning();
    return NextResponse.json({ ...row, monthly_limit: Number(row.monthly_limit) }, { status: 201 });
  } catch (e: unknown) {
    console.error('Failed to save budget', e);
    return NextResponse.json({ error: 'Failed to save budget' }, { status: 500 });
  }
}
