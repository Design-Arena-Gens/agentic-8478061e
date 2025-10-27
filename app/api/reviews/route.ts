import { NextResponse } from 'next/server';
import { sampleReviews } from '@/data/reviews';
import type { Review } from '@/types';

let reviews = [...sampleReviews];

export const dynamic = 'force-dynamic';

export const GET = async () => NextResponse.json({ reviews });

export const POST = async (request: Request) => {
  const body = (await request.json()) as Review;
  reviews = [body, ...reviews];
  return NextResponse.json({ review: body }, { status: 201 });
};
