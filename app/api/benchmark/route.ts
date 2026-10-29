import { NextResponse } from 'next/server';
import { COMPARATIVE_PROOF_SCENARIO } from '@/lib/fixtures';

export async function GET() {
  return NextResponse.json(COMPARATIVE_PROOF_SCENARIO);
}
