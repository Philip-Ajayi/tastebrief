export interface CityPair {
  id: string;
  destinationCity: string;
  destinationCountry: string;
  destinationQuery: string;
  originCity: string;
  originCountry: string;
  originQuery: string;
  venueType: 'café_wine_bar' | 'cocktail_lounge' | 'boutique_hotel' | 'bistro';
  baselineTags: string[];
}

export interface QlooEntity {
  id: string;
  urn: string;
  name: string;
  category: 'place' | 'artist' | 'brand' | 'book';
  tags: string[];
  score: number;
  metadata?: {
    neighborhood?: string;
    subgenre?: string;
    description?: string;
    address?: string;
  };
}

export interface AffinityLiftItem {
  id: string;
  urn: string;
  name: string;
  category: string;
  baselineScore: number;
  visitorScore: number;
  liftPercentage: number;
  status: 'surging' | 'over_indexing' | 'neutral' | 'under_indexing';
  tags: string[];
  significanceReason: string;
}

export interface TagDivergence {
  tag: string;
  baselineAffinity: number;
  visitorAffinity: number;
  liftPercentage: number;
  actionableInsight: string;
}

export interface MusicBridgeArtist {
  urn: string;
  name: string;
  subgenre: string;
  originAffinity: number;
  destinationAffinity: number;
  harmonicOverlapScore: number;
  recommendedTimeSlot: string;
  rationale: string;
}

export interface ActionMemo {
  executiveSummary: string;
  destinationCity: string;
  originCity: string;
  venueType: string;
  beverageAdjustments: string[];
  musicalProgramming: {
    afternoon: string;
    evening: string;
    lateNight: string;
  };
  spatialAtmosphere: string[];
  crossPromotions: string[];
  curatedEntityIds: string[];
  generatedAt: string;
  engineUsed: 'Gemini 1.5 Flash (Constrained Qloo Grounding)' | 'TasteBrief Deterministic Rules Engine';
}

export interface NetworkCallLog {
  timestamp: string;
  endpoint: string;
  method: 'GET' | 'POST';
  queryParams: Record<string, string>;
  status: number;
  durationMs: number;
  isMocked: boolean;
  responsePreview: string;
}

export interface AnalysisResponse {
  cityPair: CityPair;
  affinityLiftVenues: AffinityLiftItem[];
  tagDivergences: TagDivergence[];
  musicBridge: MusicBridgeArtist[];
  actionMemo: ActionMemo;
  networkLogs: NetworkCallLog[];
  isDemoMode: boolean;
}

export interface ComparativeProof {
  scenarioTitle: string;
  genericLlmPrompt: string;
  genericLlmOutput: {
    menu: string[];
    music: string[];
    vibe: string[];
    criticalFlaw: string;
  };
  tasteBriefQlooOutput: {
    menuDeltas: string[];
    musicBridge: string[];
    spatialAtmosphere: string[];
    empiricalValidation: string;
  };
}
