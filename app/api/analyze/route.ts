import { NextRequest, NextResponse } from 'next/server';
import { QlooClient } from '@/lib/qloo-client';
import { AffinityEngine } from '@/lib/affinity-engine';
import { GeminiActionCopywriter } from '@/lib/gemini-client';
import { AnalysisResponse, CityPair } from '@/types';
import { PRESET_CITY_PAIRS } from '@/lib/fixtures';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      cityPairId,
      customDestination,
      customOrigin,
      customVenueType,
      customApiKey,
      customGeminiKey,
    } = body;

    const qlooKey = customApiKey || process.env.QLOO_API_KEY;
    const geminiKey = customGeminiKey || process.env.GEMINI_API_KEY;

    if (!qlooKey) {
      return NextResponse.json(
        {
          error: 'Missing Qloo API Key',
          details: 'A live Qloo x-api-key is required. Enter your key in the API Keys modal or configure QLOO_API_KEY in your environment.',
        },
        { status: 400 }
      );
    }

    if (!geminiKey) {
      return NextResponse.json(
        {
          error: 'Missing Gemini API Key',
          details: 'A live Google Gemini API key is required for Action Memo generation. Enter your key in the API Keys modal or configure GEMINI_API_KEY in your environment.',
        },
        { status: 400 }
      );
    }

    // Resolve city pair configuration
    let selectedPair: CityPair;

    if (cityPairId && cityPairId !== 'custom') {
      const match = PRESET_CITY_PAIRS.find((p) => p.id === cityPairId);
      if (!match) {
        return NextResponse.json({ error: `Unknown city pair id: ${cityPairId}` }, { status: 400 });
      }
      selectedPair = match;
    } else {
      if (!customDestination || !customOrigin) {
        return NextResponse.json(
          { error: 'Custom city pairs require both customDestination and customOrigin' },
          { status: 400 }
        );
      }
      selectedPair = {
        id: 'custom',
        destinationCity: customDestination.split(',')[0].trim(),
        destinationCountry: customDestination.split(',')[1]?.trim() || 'Global',
        destinationQuery: customDestination,
        originCity: customOrigin.split(',')[0].trim(),
        originCountry: customOrigin.split(',')[1]?.trim() || 'Global',
        originQuery: customOrigin,
        venueType: customVenueType || 'café_wine_bar',
        baselineTags: ['coffee', 'wine_bar', 'dining'],
      };
    }

    const qloo = new QlooClient(qlooKey);
    const gemini = new GeminiActionCopywriter(geminiKey);

    // 1. Dual Query Live Orchestration: Destination Baseline vs Inbound Signal
    const [baselineVenues, visitorVenues, destArtists, visitorArtists] = await Promise.all([
      // Domestic Destination Venue Baseline
      qloo.fetchInsights({
        filterType: 'urn:entity:place',
        filterLocationQuery: selectedPair.destinationQuery,
        filterTags: selectedPair.baselineTags.join(','),
        limit: 15,
      }),
      // Inbound Visitor Signal for Destination Venues
      qloo.fetchInsights({
        filterType: 'urn:entity:place',
        filterLocationQuery: selectedPair.destinationQuery,
        signalLocationQuery: selectedPair.originQuery,
        filterTags: selectedPair.baselineTags.join(','),
        limit: 15,
      }),
      // Domestic Destination Music Entities
      qloo.fetchInsights({
        filterType: 'urn:entity:artist',
        filterLocationQuery: selectedPair.destinationQuery,
        limit: 10,
      }),
      // Inbound Visitor Music Signal
      qloo.fetchInsights({
        filterType: 'urn:entity:artist',
        filterLocationQuery: selectedPair.destinationQuery,
        signalLocationQuery: selectedPair.originQuery,
        limit: 10,
      }),
    ]);

    // 2. Mathematical Affinity Lift & Bridge Calculations
    const reconciledVenues = AffinityEngine.reconcileVenues(baselineVenues, visitorVenues);
    const tagDivergences = AffinityEngine.computeTagDivergences(reconciledVenues);
    const musicBridge = AffinityEngine.reconcileMusicBridge(destArtists, visitorArtists);

    // 3. Live Gemini Action Memo & Comparative Proof Generation
    const [actionMemo, comparativeProof] = await Promise.all([
      gemini.generateActionMemo(
        selectedPair.destinationCity,
        selectedPair.originCity,
        selectedPair.venueType.replace(/_/g, ' '),
        reconciledVenues.slice(0, 5),
        tagDivergences,
        musicBridge
      ),
      gemini.generateComparativeProof(
        selectedPair.destinationCity,
        selectedPair.originCity,
        selectedPair.venueType.replace(/_/g, ' '),
        reconciledVenues.slice(0, 5),
        tagDivergences,
        musicBridge
      ),
    ]);

    const logs = qloo.getLogs();

    const responsePayload: AnalysisResponse = {
      cityPair: selectedPair,
      affinityLiftVenues: reconciledVenues,
      tagDivergences,
      musicBridge,
      actionMemo,
      comparativeProof,
      networkLogs: logs,
      isDemoMode: false,
    };

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'TasteBrief Analysis Execution Failed',
        details: err.message || 'An unexpected error occurred during live graph processing',
      },
      { status: 500 }
    );
  }
}