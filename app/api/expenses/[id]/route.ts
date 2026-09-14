import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expenses } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { isCategory, isIsoDate, parsePositiveMoney } from '@/lib/validation';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'A valid JSON body is required' }, { status: 400 });
  const { amount, category, description, date } = body;
  const parsedAmount = parsePositiveMoney(amount);

  if (parsedAmount === null) return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 });
  if (!isCategory(category)) return NextResponse.json({ error: 'category is invalid' }, { status: 400 });
  if (!isIsoDate(date)) return NextResponse.json({ error: 'date must use YYYY-MM-DD' }, { status: 400 });
  if (description != null && typeof description !== 'string') return NextResponse.json({ error: 'description must be text' }, { status: 400 });

  try {
    const [row] = await db.update(expenses)
      .set({ amount: parsedAmount.toFixed(2), category, description: description || null, date })
      .where(eq(expenses.id, id))
      .returning();
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ...row, amount: Number(row.amount) });
  } catch (e: unknown) {
    console.error('Failed to update expense', e);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const [row] = await db.delete(expenses).where(eq(expenses.id, id)).returning();
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('Failed to delete expense', e);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
