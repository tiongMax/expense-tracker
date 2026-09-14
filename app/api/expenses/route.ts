import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expenses } from '@/lib/schema';
import { desc } from 'drizzle-orm';
import { isCategory, isIsoDate, parsePositiveMoney } from '@/lib/validation';

export async function GET() {
  try {
    const rows = await db.select().from(expenses).orderBy(desc(expenses.date));
    return NextResponse.json(rows.map(r => ({ ...r, amount: Number(r.amount) })));
  } catch (e: unknown) {
    console.error('Failed to list expenses', e);
    return NextResponse.json({ error: 'Failed to load expenses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'A valid JSON body is required' }, { status: 400 });
  const { amount, category, description, date } = body;
  const parsedAmount = parsePositiveMoney(amount);

  if (parsedAmount === null) {
    return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 });
  }
  if (!isCategory(category)) return NextResponse.json({ error: 'category is invalid' }, { status: 400 });
  if (!isIsoDate(date)) return NextResponse.json({ error: 'date must use YYYY-MM-DD' }, { status: 400 });
  if (description != null && typeof description !== 'string') return NextResponse.json({ error: 'description must be text' }, { status: 400 });

  try {
    const [row] = await db.insert(expenses).values({
      amount: parsedAmount.toFixed(2),
      category,
      description: description || null,
      date,
    }).returning();
    return NextResponse.json({ ...row, amount: Number(row.amount) }, { status: 201 });
  } catch (e: unknown) {
    console.error('Failed to create expense', e);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
