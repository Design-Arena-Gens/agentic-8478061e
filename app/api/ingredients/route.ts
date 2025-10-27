import { NextResponse } from 'next/server';
import { ingredientOptions } from '@/data/ingredients';

export const dynamic = 'force-dynamic';

export const GET = async () => NextResponse.json({ ingredients: ingredientOptions });
