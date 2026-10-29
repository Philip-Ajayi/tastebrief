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

    // Resolve or build city pair
    let selectedPair: CityPair;

    if (cityPairId && cityPairId !== 'custom') {
      const match = PRESET_CITY_PAIRS.find((p) => p.id === cityPairId);
      selectedPair = match || PRESET_CITY_PAIRS[0];
    } else {
      selectedPair = {
        id: 'custom',
        destinationCity: customDestination || 'Lisbon',
        destinationCountry: 'Global',
        destinationQuery: customDestination || 'Lisbon, Portugal',
        originCity: customOrigin || 'Berlin',
        originCountry: 'Global',
        originQuery: customOrigin || 'Berlin, Germany',
        venueType: customVenueType || 'café_wine_bar',
        baselineTags: ['coffee', 'wine_bar', 'dining'],
      };
    }

    const qloo = new QlooClient(customApiKey);
    const gemini = new GeminiActionCopywriter(customGeminiKey);

    // 1. Dual Query Orchestration: Baseline vs Inbound Signal
    const [baselineVenues, visitorVenues, musicEntities] = await Promise.all([
      // Baseline Destination Query
      qloo.fetchInsights({
        filterType: 'urn:entity:place',
        filterLocationQuery: selectedPair.destinationQuery,
        filterTags: selectedPair.baselineTags.join(','),
        limit: 15,
      }),
      // Inbound Visitor Signal Query
      qloo.fetchInsights({
        filterType: 'urn:entity:place',
        filterLocationQuery: selectedPair.destinationQuery,
        signalLocationQuery: selectedPair.originQuery,
        filterTags: selectedPair.baselineTags.join(','),
        limit: 15,
      }),
      // Cross-Domain Music Bridge Query
      qloo.fetchInsights({
        filterType: 'urn:entity:artist',
        filterLocationQuery: selectedPair.destinationQuery,
        signalLocationQuery: selectedPair.originQuery,
        limit: 10,
      }),
    ]);

    // 2. Mathematical Affinity Lift Calculation
    const reconciledVenues = AffinityEngine.reconcileVenues(baselineVenues, visitorVenues);
    const tagDivergences = AffinityEngine.computeTagDivergences(reconciledVenues);
    const musicBridge = AffinityEngine.reconcileMusicBridge(musicEntities);

    // 3. Operational Action Brief Generation
    const actionMemo = await gemini.generateActionMemo(
      selectedPair.destinationCity,
      selectedPair.originCity,
      selectedPair.venueType.replace(/_/g, ' '),
      reconciledVenues.slice(0, 5),
      tagDivergences,
      musicBridge
    );

    const logs = qloo.getLogs();
    const isDemoMode = !customApiKey && !process.env.QLOO_API_KEY;

    const responsePayload: AnalysisResponse = {
      cityPair: selectedPair,
      affinityLiftVenues: reconciledVenues,
      tagDivergences,
      musicBridge,
      actionMemo,
      networkLogs: logs,
      isDemoMode,
    };

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to execute TasteBrief analysis', details: err.message },
      { status: 500 }
    );
  }
}
