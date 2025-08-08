'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Send, 
  Clock,
  Database,
  Settings,
  TrendingUp,
  Activity,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy
} from 'lucide-react'

interface QueryResult {
  success: boolean
  data?: Record<string, unknown>
  query_info?: {
    symbol?: string
    answer?: string
    sources?: Record<string, unknown>[]
    consensus?: Record<string, unknown>
  }
  blockchain?: {
    transaction_id: string
    hash: string
    network: string
    verified: boolean
    explorer_link: string
  }
  hashscan_url?: string
  metadata?: Record<string, unknown>
  error?: string
}

interface Provider {
  name: string
  status: string
  reliability: number
  stats: any
  supportedSymbols: string[]
  providerInfo: {
    name: string
    version: string
    description: string
    rateLimit: number
    features: string[]
  }
}

const SAMPLE_QUERIES = [
  { label: 'Bitcoin Price', query: 'bitcoin price', provider: 'coingecko' },
  { label: 'Weather NYC', query: 'weather new york', provider: 'weather' },
  { label: 'NASA APOD', query: 'nasa astronomy picture', provider: 'nasa' },
  { label: 'Ethereum Price', query: 'ethereum price', provider: 'chainlink' },
  { label: 'Random Quote', query: 'random quote', provider: 'quotable' },
  { label: 'Tech News', query: 'latest tech news', provider: 'newsapi' }
]

// Provider name mapping: Display Name -> Internal Name
const PROVIDER_MAPPING: Record<string, string> = {
  'Chainlink': 'chainlink',
  'CoinGecko': 'coingecko', 
  'DIA Oracle': 'dia',
  'Weather Oracle': 'weather',
  'Exchange Rate': 'exchangerate',
  'Sports Oracle': 'sports',
  'NASA': 'nasa',
  'Wikipedia': 'wikipedia'
}

export default function InteractiveQueryBuilder() {
  const [query, setQuery] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [providers, setProviders] = useState<Provider[]>([])
  const [providersLoading, setProvidersLoading] = useState(true)

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setProvidersLoading(true)
        const response = await fetch('/api/oracle-manager/providers')
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            // Oracle Manager endpoint'ten gelen kategorili veriyi flatten et
            const allProviders = [
              ...result.data.categories.Premium,
              ...result.data.categories.Free,
              ...result.data.categories.Official,
              ...result.data.categories.Dynamic
            ]
            setProviders(allProviders || [])
          }
        }
      } catch (error) {
        console.error('Failed to load providers:', error)
      } finally {
        setProvidersLoading(false)
      }
    }

    loadProviders()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) return
    
    setIsLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/oracle-manager/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: PROVIDER_MAPPING[selectedProvider] || selectedProvider,
          query: query.trim(),
          userId: 'frontend-user'
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Query failed:', error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Query failed'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleQuery = (sampleQuery: string, provider: string) => {
    setQuery(sampleQuery)
    setSelectedProvider(provider)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    })
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Interactive Query Builder</h1>
          <p className="text-gray-400">Build and execute queries across multiple Oracle providers with real-time results</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Query Builder Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Query Form */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Query Builder
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step Instructions */}
                {!selectedProvider && (
                  <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Getting Started</span>
                    </div>
                    <p className="text-blue-300 text-sm">
                      First select an Oracle Assistant from the dropdown below, then enter your query.
                    </p>
                  </div>
                )}
                
                {/* Provider Selection */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Oracle Assistant
                  </label>
                  <select 
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Oracle Assistant...</option>
                    {providersLoading ? (
                      <option disabled>Loading providers...</option>
                    ) : (
                      providers.map((provider) => (
                        <option key={provider.name} value={provider.name}>
                          {provider.name} {provider.status === 'active' ? '✓' : '✗'}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Query Input */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Query
                  </label>
                  <textarea 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your query here... (e.g., 'bitcoin price', 'weather in london', 'nasa picture of the day')"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !query.trim() || !selectedProvider}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Query...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Execute Query
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sample Queries */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Sample Queries</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SAMPLE_QUERIES.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleQuery(sample.query, sample.provider)}
                    className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg p-3 text-left transition-colors"
                  >
                    <div className="text-white text-sm font-medium">{sample.label}</div>
                    <div className="text-gray-400 text-xs mt-1">{sample.provider}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Query Result */}
            {result && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    Query Result
                  </h3>
                  
                  {result.success && result.hashscan_url && (
                    <a 
                      href={result.hashscan_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                    >
                      View on Hashscan <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {result.success ? (
                  <div className="space-y-4">
                    {/* Answer */}
                    {result.query_info?.answer && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Answer</h4>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <p className="text-gray-300">{result.query_info.answer}</p>
                        </div>
                      </div>
                    )}

                    {/* Raw Data */}
                    {result.data && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">Raw Data</h4>
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(result.data, null, 2))}
                            className="text-gray-400 hover:text-gray-300"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                          <pre className="text-gray-300 text-sm">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Blockchain Verification */}
                    {result.blockchain && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Blockchain Verification</h4>
                        <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Transaction ID:</span>
                            <span className="text-gray-300 font-mono text-sm">{result.blockchain.transaction_id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Network:</span>
                            <span className="text-gray-300">{result.blockchain.network}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Verified:</span>
                            <span className={result.blockchain.verified ? 'text-green-400' : 'text-red-400'}>
                              {result.blockchain.verified ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sources */}
                    {result.query_info?.sources && result.query_info.sources.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Data Sources</h4>
                        <div className="space-y-2">
                          {result.query_info.sources.map((source: any, index: number) => (
                            <div key={index} className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between">
                              <span className="text-gray-300">{source.name || `Source ${index + 1}`}</span>
                              <div className="text-sm text-gray-400">
                                Weight: {source.weight || 'N/A'} | Confidence: {source.confidence || 'N/A'}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">Query Failed</span>
                    </div>
                    <p className="text-red-300 text-sm">{result.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Query Stats */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Query Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Providers</span>
                  <span className="text-white font-semibold">
                    {providers.filter(p => p.status === 'active').length}/{providers.length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Avg Rate Limit</span>
                  <span className="text-white font-semibold">
                    {providers.length > 0 ? 
                      Math.round(providers.reduce((avg, p) => avg + (p.providerInfo?.rateLimit || 60), 0) / providers.length) : 60}/min
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Avg Reliability</span>
                  <span className="text-white font-semibold">
                    {providers.length > 0 ? 
                      Math.round(providers.reduce((avg, p) => avg + (p.reliability * 100), 0) / providers.length) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Provider Status */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Provider Status
              </h3>
              
              <div className="space-y-3">
                {providersLoading ? (
                  <div className="text-gray-400 text-center py-4">Loading providers...</div>
                ) : providers.length > 0 ? (
                  providers.slice(0, 8).map((provider, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${provider.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="text-gray-300 text-sm capitalize">{provider.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{Math.round(provider.reliability * 100)}%</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-4">No providers available</div>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                System Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Oracle Manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Hedera Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Consensus Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Blockchain Logger</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}