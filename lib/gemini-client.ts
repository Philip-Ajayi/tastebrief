import { ActionMemo, AffinityLiftItem, MusicBridgeArtist, TagDivergence } from '@/types';
import { FIXTURE_DATA } from './fixtures';

export class GeminiActionCopywriter {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
  }

  public async generateActionMemo(
    destination: string,
    origin: string,
    venueType: string,
    surgingVenues: AffinityLiftItem[],
    tagDivergences: TagDivergence[],
    musicBridge: MusicBridgeArtist[]
  ): Promise<ActionMemo> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      return this.generateDeterministicMemo(destination, origin, venueType, surgingVenues, tagDivergences, musicBridge);
    }

    const prompt = `
You are the Chief Cultural Intelligence Officer for an independent hospitality group.
Translate the following empirical Qloo Taste Graph divergence data into a strictly structured, highly professional 1-page Venue Programming Action Memo.

Destination City: ${destination}
Visitor Cohort Origin City: ${origin}
Venue Category: ${venueType}

Top Surging Venues (Affinity Lift %):
${surgingVenues.map((v) => `- ${v.name} (+${v.liftPercentage}% lift): ${v.significanceReason}`).join('\n')}

Top Cultural Tag Divergences:
${tagDivergences.map((t) => `- ${t.tag}: +${t.liftPercentage}% lift (Action: ${t.actionableInsight})`).join('\n')}

Music Affinity Bridges:
${musicBridge.map((m) => `- ${m.name} (${m.subgenre}): Time Slot: ${m.recommendedTimeSlot}`).join('\n')}

Output ONLY a raw, valid JSON object matching this schema without markdown codeblocks:
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
  "curatedEntityIds": ["${surgingVenues[0]?.urn || 'urn:entity:place:sample'}", "${musicBridge[0]?.urn || 'urn:entity:artist:sample'}"]
}
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        return this.generateDeterministicMemo(destination, origin, venueType, surgingVenues, tagDivergences, musicBridge);
      }

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
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
    } catch {
      return this.generateDeterministicMemo(destination, origin, venueType, surgingVenues, tagDivergences, musicBridge);
    }
  }

  private generateDeterministicMemo(
    destination: string,
    origin: string,
    venueType: string,
    surgingVenues: AffinityLiftItem[],
    tagDivergences: TagDivergence[],
    musicBridge: MusicBridgeArtist[]
  ): ActionMemo {
    // If Lisbon-Berlin fixture is selected, return curated high-fidelity memo
    if (destination.toLowerCase().includes('lisbon') && origin.toLowerCase().includes('berlin')) {
      return FIXTURE_DATA['lisbon-berlin'].memo;
    }
    if (destination.toLowerCase().includes('tokyo')) {
      return FIXTURE_DATA['tokyo-paris'].memo;
    }

    const topTag = tagDivergences[0]?.tag || 'Natural Wine & Artisanal Roasting';
    const topArtist = musicBridge[0]?.name || 'Floating Points';

    return {
      destinationCity: destination,
      originCity: origin,
      venueType,
      executiveSummary: `Inbound visitor cohorts from ${origin} visiting ${destination} demonstrate an empirical affinity lift toward ${topTag.toLowerCase()}. Local operators should align soundscapes and curated pour lists with these cross-border behavioral correlations rather than relying on blunt nationality clichés.`,
      beverageAdjustments: [
        `Introduce 3 rotating low-intervention offerings highlighting local producers favored by ${origin} travelers.`,
        `Complement espresso options with single-origin batch brew filtered coffee.`,
        `Curate an artisanal non-alcoholic spritz program highlighting regional botanicals.`,
      ],
      musicalProgramming: {
        afternoon: `Warm acoustic and neoclassical arrangements bridging ${origin} and ${destination} listener profiles.`,
        evening: `Leftfield jazz fusion featuring ${topArtist} and vinyl selector cuts.`,
        lateNight: `Deep downtempo rhythms calibrated for intimate conversation.`,
      },
      spatialAtmosphere: [
        `Highlight authentic regional materials and open sunlit areas; avoid generic metropolitan stereotypes.`,
        `Expose physical sound equipment and album covers as tactile proof of curation.`,
        `Keep printed menus minimal with bilingual supplier credits.`,
      ],
      crossPromotions: [
        `Host monthly tasting evenings with independent regional wine importers.`,
        `Partner with neighborhood record stores for weekend vinyl selector pop-ups.`,
      ],
      curatedEntityIds: surgingVenues.map((v) => v.urn).slice(0, 3),
      generatedAt: new Date().toISOString(),
      engineUsed: 'TasteBrief Deterministic Rules Engine',
    };
  }
}
