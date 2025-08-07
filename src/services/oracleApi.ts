/**
 * Oracle API Service
 * Frontend service for interacting with backend Oracle APIs
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://negravis-app.vercel.app';

export interface OracleQueryResponse {
  success: boolean;
  data: {
    query: string;
    result: Record<string, unknown>;
    confidence: number;
    consensus_method: string;
    sources: string[];
    timestamp: number;
    execution_time_ms: number;
  };
  metadata?: Record<string, unknown>;
  error?: string;
}

export interface PriceResponse {
  success: boolean;
  data: {
    symbol: string;
    price: number;
    confidence: number;
    sources: string[];
    timestamp: number;
    market_data?: {
      market_cap: number;
      volume_24h: number;
      change_24h: number;
    };
  };
  error?: string;
}

export interface WeatherResponse {
  success: boolean;
  data: {
    location: string;
    temperature: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    visibility: number;
    wind: {
      speed: number;
      direction: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    confidence: number;
    sources: string[];
    timestamp: number;
  };
  error?: string;
}

export interface ProvidersResponse {
  success: boolean;
  data: {
    total_providers: number;
    active_providers: number;
    providers: Array<{
      name: string;
      weight: number;
      reliability: number;
      latency: number;
      healthy: boolean;
      metrics: {
        total_queries: number;
        successful_queries: number;
        success_rate: number;
        average_latency: number;
        last_health_check: number;
      };
    }>;
  };
  error?: string;
}

export interface SystemStatusResponse {
  success: boolean;
  data: {
    system: {
      total_providers: number;
      active_providers: number;
      system_health: number;
      last_check: number;
    };
    providers: Array<Record<string, unknown>>;
    health_status: Record<string, boolean>;
    chatbots: Record<string, unknown> | null;
    uptime: number;
    timestamp: string;
  };
  error?: string;
}

export interface HashscanQueryResult {
  id: string;
  query: string;
  answer: string;
  timestamp: number;
  sources: Array<{
    name: string;
    url: string;
    type: string;
    weight: number;
    confidence: number;
  }>;
  data_sources: Array<{
    name: string;
    url: string;
    type: string;
    weight: number;
    confidence: number;
  }>; // Compatibility alias for DataSourcesCard
  metadata: {
    consensus_method: string;
    confidence_score: number;
    provider_count: number;
    execution_time_ms: number;
    blockchain_verified: boolean;
  };
  blockchain: {
    transaction_id: string;
    network: string;
    verified: boolean;
  };
  blockchain_hash: string; // For compatibility
  blockchain_link: string; // For compatibility
}

export interface HashscanQueryResponse {
  success: boolean;
  query?: HashscanQueryResult;
  error?: string;
}

export interface HashscanTransactionResult {
  id: string;
  type: string;
  status: string;
  timestamp: number;
  network: string;
  details: {
    query: string;
    answer: string;
    sources: string[];
    confidence: number;
    provider_count: number;
    consensus_method: string;
    execution_time: string;
  };
  blockchain_hash: string;
  explorer_url: string;
}

export interface HashscanTransactionResponse {
  success: boolean;
  data?: HashscanTransactionResult;
  error?: string;
}

export interface HashscanVerificationResponse {
  success: boolean;
  data?: {
    hash: string;
    verified: boolean;
    transaction_id?: string;
    timestamp?: string;
    network?: string;
  };
  error?: string;
}

class OracleApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Enhanced oracle query using Oracle Manager (new API)
   */
  async queryOracle(
    provider: string,
    query: string,
    userId?: string
  ): Promise<{
    success: boolean;
    data?: Record<string, unknown>;
    query_info?: {
      symbol?: string;
      answer?: string;
      sources?: Record<string, unknown>[];
      consensus?: Record<string, unknown>;
    };
    blockchain?: {
      transaction_id: string;
      hash: string;
      network: string;
      verified: boolean;
      explorer_link: string;
    };
    hashscan_url?: string;
    metadata?: Record<string, unknown>;
    error?: string;
  }> {
    try {
      console.log(`🔍 Oracle query: ${provider} - "${query}"`);
      
      // Use the new enhanced Oracle Manager endpoint
      const response = await fetch(`${this.baseUrl}/api/oracle-manager/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          query,
          userId: userId || 'frontend-user'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Oracle response:', data);

      if (data.success) {
        // Use real transaction ID from backend - no fake query ID generation
        const transactionId = data.blockchain?.transaction_id || data.data?.blockchain_hash || 'N/A';
        
        console.log('🔍 Backend transaction_id:', data.blockchain?.transaction_id);
        console.log('🔍 Backend blockchain_hash:', data.data?.blockchain_hash);
        console.log('🔍 Final transactionId used:', transactionId);
        
        const result = {
          ...data,
          blockchain: {
            transaction_id: transactionId,
            hash: transactionId, // Use actual transaction ID as hash
            network: 'hedera-testnet',
            verified: true,
            explorer_link: `https://hashscan.io/testnet/transaction/${encodeURIComponent(transactionId)}`
          },
          // Redirect to local hashscan page first to show all data
          hashscan_url: `https://negravis-frontend.vercel.app/hashscan?id=${encodeURIComponent(transactionId)}`
        };
        
        // Use backend query_info if available, otherwise create enhanced query_info for better UI formatting
        if (data.query_info) {
          // Backend already provided proper query_info, use it directly
          console.log('✅ Using backend query_info:', data.query_info);
          result.query_info = data.query_info;
        } else {
          // No query_info from backend - this shouldn't happen with new backend
          console.log('⚠️ No query_info from backend');
        }
        
        return result;
      }

      return data;
    } catch (error: unknown) {
      console.error('Enhanced oracle query error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * General oracle query (legacy)
   */
  async query(
    query: string, 
    options?: {
      sources?: string[];
      method?: string;
      timeout?: number;
    }
  ): Promise<OracleQueryResponse> {
    try {
      const params = new URLSearchParams({ q: query });
      
      if (options?.sources?.length) {
        params.append('sources', options.sources.join(','));
      }
      if (options?.method) {
        params.append('method', options.method);
      }
      if (options?.timeout) {
        params.append('timeout', options.timeout.toString());
      }

      const response = await fetch(`${this.baseUrl}/api/oracles/query?${params}`);
      return await response.json();
    } catch (error: unknown) {
      console.error('Oracle query error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: {} as OracleQueryResponse['data']
      };
    }
  }

  /**
   * Get cryptocurrency price
   */
  async getPrice(symbol: string, options?: { sources?: string[]; method?: string }): Promise<PriceResponse> {
    try {
      const params = new URLSearchParams();
      
      if (options?.sources?.length) {
        params.append('sources', options.sources.join(','));
      }
      if (options?.method) {
        params.append('method', options.method);
      }

      const queryString = params.toString() ? `?${params}` : '';
      const response = await fetch(`${this.baseUrl}/api/oracles/price/${symbol}${queryString}`);
      return await response.json();
    } catch (error: unknown) {
      console.error('Price query error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: {} as PriceResponse['data']
      };
    }
  }

  /**
   * Get weather data
   */
  async getWeather(location: string): Promise<WeatherResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/oracles/weather/${encodeURIComponent(location)}`);
      return await response.json();
    } catch (error: unknown) {
      console.error('Weather query error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: {} as WeatherResponse['data']
      };
    }
  }

  /**
   * Get oracle providers
   */
  async getProviders(): Promise<ProvidersResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/oracles/providers`);
      return await response.json();
    } catch (error: unknown) {
      console.error('Providers query error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: {} as ProvidersResponse['data']
      };
    }
  }

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<SystemStatusResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/oracles/status`);
      return await response.json();
    } catch (error: unknown) {
      console.error('System status query error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: {} as SystemStatusResponse['data']
      };
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/oracles/health-check`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error: unknown) {
      console.error('Health check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Batch queries
   */
  async batchQuery(queries: Array<{
    query: string;
    sources?: string[];
    method?: string;
    timeout?: number;
  }>): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/oracles/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ queries })
      });
      return await response.json();
    } catch (error: unknown) {
      console.error('Batch query error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get Hashscan query result by query ID
   */
  async getHashscanQuery(queryId: string): Promise<HashscanQueryResponse> {
    try {
      console.log(`🔍 Fetching hashscan query: ${queryId}`);
      const response = await fetch(`${this.baseUrl}/api/hashscan/query/${encodeURIComponent(queryId)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 Hashscan response:', data);
      
      if (data.success && data.query) {
        // Get current frontend URL (for localhost:3000 or production)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const frontendUrl = typeof window !== 'undefined' ? window.location.origin : 'https://negravis-frontend.vercel.app';
        
        // Transform backend response to match frontend interface
        const transformedQuery: HashscanQueryResult = {
          ...data.query,
          data_sources: data.query.sources || [], // Map sources to data_sources for compatibility
          blockchain_hash: data.query.blockchain?.transaction_id || 'N/A',
          blockchain_link: `https://hashscan.io/testnet/transaction/${encodeURIComponent(data.query.blockchain?.transaction_id || '')}`
        };
        
        return {
          success: true,
          query: transformedQuery
        };
      }
      
      return data;
    } catch (error: unknown) {
      console.error('Hashscan query error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get Hashscan transaction result by transaction ID
   */
  async getHashscanTransaction(transactionId: string): Promise<HashscanTransactionResponse> {
    try {
      console.log(`🔍 Fetching hashscan transaction: ${transactionId}`);
      const response = await fetch(`${this.baseUrl}/api/hashscan/transaction/${encodeURIComponent(transactionId)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 Transaction response:', data);
      
      if (data.success && data.transaction) {
        return {
          success: true,
          data: data.transaction
        };
      }
      
      return data;
    } catch (error: unknown) {
      console.error('Hashscan transaction error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Verify a hash on the blockchain
   */
  async verifyHashscanHash(hash: string): Promise<HashscanVerificationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/hashscan/verify/${encodeURIComponent(hash)}`);
      return await response.json();
    } catch (error: unknown) {
      console.error('Hashscan verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const oracleApi = new OracleApiService();
export default oracleApi;