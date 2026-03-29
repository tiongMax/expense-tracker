import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .order('category');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { category, monthly_limit } = body;

  if (!category || !monthly_limit) {
    return NextResponse.json({ error: 'category and monthly_limit are required' }, { status: 400 });
  }
  if (isNaN(Number(monthly_limit)) || Number(monthly_limit) <= 0) {
    return NextResponse.json({ error: 'monthly_limit must be a positive number' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('budgets')
    .upsert({ category, monthly_limit: Number(monthly_limit) }, { onConflict: 'category' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
