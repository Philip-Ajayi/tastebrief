import { QlooEntity, NetworkCallLog } from '@/types';
import { FIXTURE_DATA } from './fixtures';

export interface QlooInsightsQueryParams {
  filterType: string;
  filterLocationQuery?: string;
  signalLocationQuery?: string;
  filterTags?: string;
  limit?: number;
}

export class QlooClient {
  private apiKey: string;
  private baseUrl: string;
  private logs: NetworkCallLog[] = [];

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || process.env.QLOO_API_KEY || '';
    this.baseUrl = baseUrl || process.env.QLOO_BASE_URL || 'https://api.qloo.com';
  }

  public getLogs(): NetworkCallLog[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public async fetchInsights(params: QlooInsightsQueryParams): Promise<QlooEntity[]> {
    const startTime = Date.now();
    const queryParams: Record<string, string> = {
      'filter.type': params.filterType,
      limit: (params.limit || 20).toString(),
    };

    if (params.filterLocationQuery) {
      queryParams['filter.location.query'] = params.filterLocationQuery;
    }
    if (params.signalLocationQuery) {
      queryParams['signal.location.query'] = params.signalLocationQuery;
    }
    if (params.filterTags) {
      queryParams['filter.tags'] = params.filterTags;
    }

    const urlParams = new URLSearchParams(queryParams);
    const requestUrl = `${this.baseUrl}/v2/insights?${urlParams.toString()}`;

    // If no real API key is configured, execute deterministic fixture fallback
    if (!this.apiKey || this.apiKey.trim() === '') {
      return this.executeMockInsights(params, queryParams, startTime);
    }

    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          Accept: 'application/json',
        },
      });

      const durationMs = Date.now() - startTime;

      if (!response.ok) {
        // Log failure and fallback to fixture
        this.logs.push({
          timestamp: new Date().toISOString(),
          endpoint: '/v2/insights',
          method: 'GET',
          queryParams,
          status: response.status,
          durationMs,
          isMocked: true,
          responsePreview: `HTTP ${response.status} - Falling back to high-fidelity cache: ${response.statusText}`,
        });
        return this.getFallbackEntities(params);
      }

      const json = await response.json();
      const entities: QlooEntity[] = (json.results || []).map((item: any, index: number) => ({
        id: item.id || `ent_${index}`,
        urn: item.urn || `urn:entity:${params.filterType}:${index}`,
        name: item.name || 'Unknown Entity',
        category: (params.filterType.replace('urn:entity:', '') as any) || 'place',
        tags: item.tags || [],
        score: typeof item.affinity === 'number' ? item.affinity : 0.5,
        metadata: {
          description: item.description,
          subgenre: item.subgenre,
          address: item.address,
        },
      }));

      this.logs.push({
        timestamp: new Date().toISOString(),
        endpoint: '/v2/insights',
        method: 'GET',
        queryParams,
        status: response.status,
        durationMs,
        isMocked: false,
        responsePreview: JSON.stringify(entities.slice(0, 2), null, 2),
      });

      return entities;
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      this.logs.push({
        timestamp: new Date().toISOString(),
        endpoint: '/v2/insights',
        method: 'GET',
        queryParams,
        status: 500,
        durationMs,
        isMocked: true,
        responsePreview: `Network error (${err.message}) - Served fixture safely`,
      });
      return this.getFallbackEntities(params);
    }
  }

  private executeMockInsights(
    params: QlooInsightsQueryParams,
    queryParams: Record<string, string>,
    startTime: number
  ): QlooEntity[] {
    const durationMs = Date.now() - startTime + Math.floor(Math.random() * 40 + 20);
    const entities = this.getFallbackEntities(params);

    this.logs.push({
      timestamp: new Date().toISOString(),
      endpoint: '/v2/insights',
      method: 'GET',
      queryParams,
      status: 200,
      durationMs,
      isMocked: true,
      responsePreview: JSON.stringify(entities.slice(0, 2), null, 2),
    });

    return entities;
  }

  private getFallbackEntities(params: QlooInsightsQueryParams): QlooEntity[] {
    const isArtist = params.filterType.includes('artist');
    const isBerlinSignal = (params.signalLocationQuery || '').toLowerCase().includes('berlin');
    const isTokyoDestination = (params.filterLocationQuery || '').toLowerCase().includes('tokyo');

    if (isArtist) {
      if (isTokyoDestination) {
        return FIXTURE_DATA['tokyo-paris'].music.map((m, idx) => ({
          id: `mus_${idx}`,
          urn: m.urn,
          name: m.name,
          category: 'artist',
          tags: [m.subgenre],
          score: m.harmonicOverlapScore,
          metadata: { subgenre: m.subgenre, description: m.rationale },
        }));
      }
      return FIXTURE_DATA['lisbon-berlin'].music.map((m, idx) => ({
        id: `mus_${idx}`,
        urn: m.urn,
        name: m.name,
        category: 'artist',
        tags: [m.subgenre],
        score: m.harmonicOverlapScore,
        metadata: { subgenre: m.subgenre, description: m.rationale },
      }));
    }

    // Place entities
    const fixtureKey = isTokyoDestination ? 'tokyo-paris' : 'lisbon-berlin';
    const fixtureVenues = FIXTURE_DATA[fixtureKey].venues;

    return fixtureVenues.map((v, idx) => ({
      id: v.id,
      urn: v.urn,
      name: v.name,
      category: 'place',
      tags: v.tags,
      // If signal is set, return visitor score, else baseline
      score: params.signalLocationQuery ? v.visitorScore : v.baselineScore,
      metadata: { description: v.significanceReason },
    }));
  }
}
