import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { budgets } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { parsePositiveMoney } from '@/lib/validation';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'A valid JSON body is required' }, { status: 400 });
  const { monthly_limit } = body;
  const parsedLimit = parsePositiveMoney(monthly_limit);

  if (parsedLimit === null) {
    return NextResponse.json({ error: 'monthly_limit must be a positive number' }, { status: 400 });
  }

  try {
    const [row] = await db.update(budgets)
      .set({ monthly_limit: parsedLimit.toFixed(2) })
      .where(eq(budgets.id, id))
      .returning();
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ...row, monthly_limit: Number(row.monthly_limit) });
  } catch (e: unknown) {
    console.error('Failed to update budget', e);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const [row] = await db.delete(budgets).where(eq(budgets.id, id)).returning();
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('Failed to delete budget', e);
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
}
