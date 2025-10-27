import { NextResponse } from 'next/server';
import { dishes } from '@/data/dishes';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  return NextResponse.json({ dishes });
};
