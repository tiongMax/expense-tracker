import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { monthly_limit } = body;

  if (!monthly_limit || isNaN(Number(monthly_limit)) || Number(monthly_limit) <= 0) {
    return NextResponse.json({ error: 'monthly_limit must be a positive number' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('budgets')
    .update({ monthly_limit: Number(monthly_limit) })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { error, count } = await supabase
    .from('budgets')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
