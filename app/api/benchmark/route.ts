import { NextRequest, NextResponse } from 'next/server';
import { GeminiActionCopywriter } from '@/lib/gemini-client';

export async function POST(req: NextRequest) {
  try {
    const { destination, origin, venueType, customGeminiKey } = await req.json();
    const geminiKey = customGeminiKey || process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is required for live benchmark comparisons.' },
        { status: 400 }
      );
    }

    const gemini = new GeminiActionCopywriter(geminiKey);
    const proof = await gemini.generateComparativeProof(
      destination || 'Lisbon',
      origin || 'Berlin',
      venueType || 'café & wine bar',
      [],
      [],
      []
    );

    return NextResponse.json(proof);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to generate live benchmark', details: err.message },
      { status: 500 }
    );
  }
}