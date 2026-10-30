import { GoogleGenAI } from '@google/genai';
import {
  ActionMemo,
  AffinityLiftItem,
  ComparativeProof,
  MusicBridgeArtist,
  TagDivergence,
} from '@/types';

export class GeminiActionCopywriter {
  private ai: GoogleGenAI;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY || '';
    if (!key || key.trim() === '') {
      throw new Error(
        'Missing Gemini API Key. Live copywriting requires a valid Google AI Studio Gemini API Key.'
      );
    }
    // Initialize the official Google Gen AI client
    this.ai = new GoogleGenAI({ apiKey: key });
  }

  public async generateActionMemo(
    destination: string,
    origin: string,
    venueType: string,
    surgingVenues: AffinityLiftItem[],
    tagDivergences: TagDivergence[],
    musicBridge: MusicBridgeArtist[]
  ): Promise<ActionMemo> {
    const prompt = `
You are the Chief Cultural Intelligence Officer for an independent hospitality group.
Translate the following empirical Qloo Taste Graph divergence data into a strictly structured, professional 1-page Venue Programming Action Memo.

Destination City: ${destination}
Visitor Cohort Origin City: ${origin}
Venue Category: ${venueType}

Top Surging Venues (Empirical Lift %):
${surgingVenues.map((v) => `- ${v.name} (+${v.liftPercentage}% lift): ${v.significanceReason}`).join('\n')}

Top Cultural Tag Divergences:
${tagDivergences.map((t) => `- ${t.tag}: +${t.liftPercentage}% lift (Action: ${t.actionableInsight})`).join('\n')}

Music Affinity Bridges:
${musicBridge.map((m) => `- ${m.name} (${m.subgenre}): Time Slot: ${m.recommendedTimeSlot}`).join('\n')}

Output ONLY a raw, valid JSON object matching this schema with no markdown formatting:
{
  "executiveSummary": "...",
  "beverageAdjustments": ["... 3 specific operational adjustments with provenance"],
  "musicalProgramming": {
    "afternoon": "...",
    "evening": "...",
    "lateNight": "..."
  },
  "spatialAtmosphere": ["... 3 physical layout or aesthetic adjustments"],
  "crossPromotions": ["... 2 concrete local brand or artisanal partner activations"],
  "curatedEntityIds": ["${surgingVenues[0]?.urn || 'urn:entity:place:live'}", "${musicBridge[0]?.urn || 'urn:entity:artist:live'}"]
}
`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Gemini API returned an empty completion.');
    }

    const parsed = JSON.parse(rawText);

    return {
      destinationCity: destination,
      originCity: origin,
      venueType,
      executiveSummary: parsed.executiveSummary,
      beverageAdjustments: parsed.beverageAdjustments,
      musicalProgramming: parsed.musicalProgramming,
      spatialAtmosphere: parsed.spatialAtmosphere,
      crossPromotions: parsed.crossPromotions,
      curatedEntityIds: parsed.curatedEntityIds || [surgingVenues[0]?.urn || 'urn:sample'],
      generatedAt: new Date().toISOString(),
      engineUsed: 'Gemini 1.5 Flash (Constrained Qloo Grounding)',
    };
  }

  public async generateComparativeProof(
    destination: string,
    origin: string,
    venueType: string,
    surgingVenues: AffinityLiftItem[],
    tagDivergences: TagDivergence[],
    musicBridge: MusicBridgeArtist[]
  ): Promise<ComparativeProof> {
    const prompt = `
Generate a comparative benchmark contrasting what an ungrounded, stereotypical LLM would recommend vs. what our empirical Qloo taste graph actually reveals.

Scenario: A ${venueType} in ${destination} appealing to travelers from ${origin}.

Empirical Qloo Data:
- Surging Venues: ${surgingVenues.slice(0, 3).map((v) => `${v.name} (+${v.liftPercentage}%)`).join(', ')}
- Tag Spikes: ${tagDivergences.slice(0, 3).map((t) => `${t.tag} (+${t.liftPercentage}%)`).join(', ')}
- Music Bridges: ${musicBridge.slice(0, 3).map((m) => m.name).join(', ')}

Output ONLY a raw, valid JSON object matching this schema with no markdown:
{
  "scenarioTitle": "${destination} ${venueType} Targeting ${origin} Travelers",
  "genericLlmPrompt": "What menu items, music, and atmosphere should a ${venueType} in ${destination} feature to appeal to visitors from ${origin}?",
  "genericLlmOutput": {
    "menu": ["3 clichéd, stereotypical food/drink items ungrounded models always output"],
    "music": ["2 stereotypical, nationality-based musical clichés"],
    "vibe": ["2 lazy aesthetic stereotypes"],
    "criticalFlaw": "1 concise sentence identifying why this stereotype fails in reality"
  },
  "tasteBriefQlooOutput": {
    "menuDeltas": ["3 items directly drawn from the top surging Qloo tags/venues with lift percentages"],
    "musicBridge": ["2 artist bridge recommendations based on empirical harmonic overlap"],
    "spatialAtmosphere": ["2 spatial points contrasting real data with tourist assumptions"],
    "empiricalValidation": "Summary of statistical affinity divergence across Qloo v2 place and artist entities"
  }
}
`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Gemini API returned an empty completion for comparative proof.');
    }

    return JSON.parse(rawText);
  }
}