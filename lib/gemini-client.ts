import { GoogleGenAI } from '@google/genai';
import {
  ActionMemo,
  AffinityLiftItem,
  ComparativeProof,
  MusicBridgeArtist,
  TagDivergence,
} from '@/types';

/**
 * Safely strips markdown code blocks (e.g., ```json ... ```) and parses JSON.
 */
function safeParseJson<T = any>(rawText: string, fallback?: T): T {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Failed to parse Gemini JSON output: ${cleaned}`);
  }
}

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
    const venuesText =
      surgingVenues.length > 0
        ? surgingVenues
            .map((v) => `- ${v.name} (+${v.liftPercentage}% lift): ${v.significanceReason}`)
            .join('\n')
        : '- Standard domestic baseline applies';

    const tagsText =
      tagDivergences.length > 0
        ? tagDivergences
            .map((t) => `- ${t.tag}: +${t.liftPercentage}% lift (Action: ${t.actionableInsight})`)
            .join('\n')
        : '- General specialty hospitality profile';

    const musicText =
      musicBridge.length > 0
        ? musicBridge
            .map((m) => `- ${m.name} (${m.subgenre}): Time Slot: ${m.recommendedTimeSlot}`)
            .join('\n')
        : '- Ambient and contemporary cross-genre';

    const prompt = `
You are the Chief Cultural Intelligence Officer for an independent hospitality group.
Translate the following empirical Qloo Taste Graph divergence data into a strictly structured, professional 1-page Venue Programming Action Memo.

Destination City: ${destination}
Visitor Cohort Origin City: ${origin}
Venue Category: ${venueType}

Top Surging Venues (Empirical Lift %):
${venuesText}

Top Cultural Tag Divergences:
${tagsText}

Music Affinity Bridges:
${musicText}

Output ONLY a raw, valid JSON object matching this schema with no markdown formatting:
{
  "executiveSummary": "Concise 2-sentence executive summary highlighting key divergence and operational opportunity",
  "beverageAdjustments": ["3 specific operational adjustments with provenance and style"],
  "musicalProgramming": {
    "afternoon": "Specific genre/vibe description with artists",
    "evening": "Specific transition sound with artists",
    "lateNight": "Late night tempo and aesthetic"
  },
  "spatialAtmosphere": ["3 physical layout, lighting, or aesthetic adjustments"],
  "crossPromotions": ["2 concrete local brand or artisanal partner activations"],
  "curatedEntityIds": ["${surgingVenues[0]?.urn || 'urn:entity:place:live'}", "${musicBridge[0]?.urn || 'urn:entity:artist:live'}"]
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
      throw new Error('Gemini API returned an empty completion.');
    }

    const parsed = safeParseJson(rawText);

    return {
      destinationCity: destination,
      originCity: origin,
      venueType,
      executiveSummary:
        parsed.executiveSummary ||
        'Operational recommendations derived from inbound cultural taste graph divergence.',
      beverageAdjustments: Array.isArray(parsed.beverageAdjustments)
        ? parsed.beverageAdjustments
        : [],
      musicalProgramming: {
        afternoon:
          parsed.musicalProgramming?.afternoon ||
          'Curated daytime acoustic and ambient selections.',
        evening:
          parsed.musicalProgramming?.evening ||
          'Aperitivo tempo transition incorporating crossover artists.',
        lateNight:
          parsed.musicalProgramming?.lateNight ||
          'Downtempo and deep selections tailored to inbound taste profile.',
      },
      spatialAtmosphere: Array.isArray(parsed.spatialAtmosphere)
        ? parsed.spatialAtmosphere
        : [],
      crossPromotions: Array.isArray(parsed.crossPromotions) ? parsed.crossPromotions : [],
      curatedEntityIds:
        Array.isArray(parsed.curatedEntityIds) && parsed.curatedEntityIds.length > 0
          ? parsed.curatedEntityIds
          : [surgingVenues[0]?.urn || 'urn:sample'],
      generatedAt: new Date().toISOString(),
      engineUsed: 'Gemini 3.5 Flash-Lite (Constrained Qloo Grounding)',
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
    const surgingSummary =
      surgingVenues.length > 0
        ? surgingVenues
            .slice(0, 3)
            .map((v) => `${v.name} (+${v.liftPercentage}%)`)
            .join(', ')
        : 'Regional specialty baselines';

    const tagSummary =
      tagDivergences.length > 0
        ? tagDivergences
            .slice(0, 3)
            .map((t) => `${t.tag} (+${t.liftPercentage}%)`)
            .join(', ')
        : 'Natural wine, third-wave coffee';

    const musicSummary =
      musicBridge.length > 0
        ? musicBridge
            .slice(0, 3)
            .map((m) => m.name)
            .join(', ')
        : 'Eclectic crossover artists';

    const prompt = `
Generate a comparative benchmark contrasting what an ungrounded, stereotypical LLM would recommend vs. what our empirical Qloo taste graph actually reveals.

Scenario: A ${venueType} in ${destination} appealing to travelers from ${origin}.

Empirical Qloo Data:
- Surging Venues: ${surgingSummary}
- Tag Spikes: ${tagSummary}
- Music Bridges: ${musicSummary}

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

    const parsed = safeParseJson(rawText);

    return {
      scenarioTitle:
        parsed.scenarioTitle || `${destination} ${venueType} Targeting ${origin} Travelers`,
      genericLlmPrompt:
        parsed.genericLlmPrompt ||
        `What menu items, music, and atmosphere should a ${venueType} in ${destination} feature to appeal to visitors from ${origin}?`,
      genericLlmOutput: {
        menu: Array.isArray(parsed.genericLlmOutput?.menu)
          ? parsed.genericLlmOutput.menu
          : [],
        music: Array.isArray(parsed.genericLlmOutput?.music)
          ? parsed.genericLlmOutput.music
          : [],
        vibe: Array.isArray(parsed.genericLlmOutput?.vibe)
          ? parsed.genericLlmOutput.vibe
          : [],
        criticalFlaw:
          parsed.genericLlmOutput?.criticalFlaw ||
          'Relies on lazy national stereotypes rather than real traveler affinities.',
      },
      tasteBriefQlooOutput: {
        menuDeltas: Array.isArray(parsed.tasteBriefQlooOutput?.menuDeltas)
          ? parsed.tasteBriefQlooOutput.menuDeltas
          : [],
        musicBridge: Array.isArray(parsed.tasteBriefQlooOutput?.musicBridge)
          ? parsed.tasteBriefQlooOutput.musicBridge
          : [],
        spatialAtmosphere: Array.isArray(parsed.tasteBriefQlooOutput?.spatialAtmosphere)
          ? parsed.tasteBriefQlooOutput.spatialAtmosphere
          : [],
        empiricalValidation:
          parsed.tasteBriefQlooOutput?.empiricalValidation ||
          'Summary of statistical affinity divergence across Qloo v2 place and artist entities.',
      },
    };
  }
}