import { NextResponse } from 'next/server';
import { baseMealPlan } from '@/data/mealPlans';
import type { MealPlan } from '@/types';

let currentPlan: MealPlan = baseMealPlan;

export const dynamic = 'force-dynamic';

export const GET = async () => NextResponse.json({ plan: currentPlan });

export const POST = async (request: Request) => {
  const body = (await request.json()) as Partial<MealPlan>;
  currentPlan = {
    ...currentPlan,
    ...body,
    schedule: body.schedule ?? currentPlan.schedule
  } as MealPlan;
  return NextResponse.json({ plan: currentPlan }, { status: 200 });
};
