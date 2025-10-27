import { NextResponse } from 'next/server';
import { loyaltyTiers, sampleLoyaltyProfile } from '@/data/loyalty';

export const dynamic = 'force-dynamic';

export const GET = async () => NextResponse.json({ tiers: loyaltyTiers, profile: sampleLoyaltyProfile });
