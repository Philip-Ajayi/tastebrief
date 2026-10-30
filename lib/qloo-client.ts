// FILE: lib/qloo-client.ts
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
      take: (params.limit || 20).toString(),
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

      // Handle all Qloo response envelope structures safely:
      // 1. json.results.entities (Qloo /v2/insights standard envelope)
      // 2. json.results (if array)
      // 3. json.data.entities
      // 4. json.data (if array)
      // 5. json.entities
      // 6. Direct array
      let rawList: any[] = [];
      if (Array.isArray(json.results?.entities)) {
        rawList = json.results.entities;
      } else if (Array.isArray(json.results)) {
        rawList = json.results;
      } else if (Array.isArray(json.data?.entities)) {
        rawList = json.data.entities;
      } else if (Array.isArray(json.data)) {
        rawList = json.data;
      } else if (Array.isArray(json.entities)) {
        rawList = json.entities;
      } else if (Array.isArray(json)) {
        rawList = json;
      }

      const category = (params.filterType.replace('urn:entity:', '') as any) || 'place';

      const entities: QlooEntity[] = rawList.map((item: any, index: number) => {
        // Tag normalization: clean URN prefixes & handle object/string types
        const rawTags = Array.isArray(item.tags)
          ? item.tags
          : Array.isArray(item.taxonomy)
          ? item.taxonomy
          : [];

        const tags: string[] = rawTags
          .map((t: any) => {
            if (typeof t === 'string') {
              return t.replace(/^urn:tag:[^:]*:[^:]*:/, '').replace(/^urn:tag:/, '');
            }
            return t?.name || t?.tag || t?.id || '';
          })
          .filter((t: string) => typeof t === 'string' && t.trim().length > 0);

        // Qloo /v2/insights places entity affinities under item.query.affinity
        let score = 0.5;
        if (typeof item.query?.affinity === 'number') {
          score = item.query.affinity;
        } else if (typeof item.affinity === 'number') {
          score = item.affinity;
        } else if (typeof item.score === 'number') {
          score = item.score;
        }

        const id = item.entity_id || item.id || `ent_${index}`;
        const urn =
          item.urn ||
          (item.entity_id
            ? `urn:entity:${category}:${item.entity_id}`
            : `urn:entity:${category}:${index}`);

        return {
          id,
          urn,
          name: item.name || item.title || 'Unknown Entity',
          category,
          tags,
          score,
          metadata: {
            description: item.description || item.snippet || item.metadata?.description,
            subgenre: item.subgenre || (tags.length > 0 ? tags[0] : undefined),
            address: item.address || item.location?.address,
          },
        };
      });

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