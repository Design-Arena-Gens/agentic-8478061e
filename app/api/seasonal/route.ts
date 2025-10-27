import { NextResponse } from 'next/server';
import { seasonalDishes } from '@/data/seasonal';

export const dynamic = 'force-dynamic';

export const GET = async () => NextResponse.json({ seasonal: seasonalDishes });
