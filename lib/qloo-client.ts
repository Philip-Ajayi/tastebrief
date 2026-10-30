import { QlooEntity, NetworkCallLog } from '@/types';

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

    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error(
        'Missing Qloo API Key. A live API key is required. Please set QLOO_API_KEY or input it via the API Keys modal.'
      );
    }
  }

  public getLogs(): NetworkCallLog[] {
    return [...this.logs];
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

    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          Accept: 'application/json',
        },
      });

      const durationMs = Date.now() - startTime;
      const responseBody = await response.text();

      if (!response.ok) {
        this.logs.push({
          timestamp: new Date().toISOString(),
          endpoint: '/v2/insights',
          method: 'GET',
          queryParams,
          status: response.status,
          durationMs,
          isMocked: false,
          responsePreview: `HTTP ${response.status}: ${responseBody.slice(0, 500)}`,
        });
        throw new Error(`Qloo API Error (${response.status}): ${responseBody}`);
      }

      const json = JSON.parse(responseBody);
      const results: any[] = json.results || json.data || [];

      const entities: QlooEntity[] = results.map((item: any, index: number) => ({
        id: item.id || `ent_${index}`,
        urn: item.urn || `urn:entity:${params.filterType}:${index}`,
        name: item.name || 'Unknown Entity',
        category: (params.filterType.replace('urn:entity:', '') as any) || 'place',
        tags: Array.isArray(item.tags) ? item.tags : [],
        score: typeof item.affinity === 'number' ? item.affinity : typeof item.score === 'number' ? item.score : 0.5,
        metadata: {
          description: item.description || item.snippet,
          subgenre: item.subgenre || (item.tags && item.tags[0]),
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
        responsePreview: JSON.stringify(entities.slice(0, 3), null, 2),
      });

      return entities;
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      if (!this.logs.some((l) => l.durationMs === durationMs)) {
        this.logs.push({
          timestamp: new Date().toISOString(),
          endpoint: '/v2/insights',
          method: 'GET',
          queryParams,
          status: 500,
          durationMs,
          isMocked: false,
          responsePreview: `Network exception: ${err.message}`,
        });
      }
      throw err;
    }
  }
}