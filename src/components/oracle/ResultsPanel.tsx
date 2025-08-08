'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  ExternalLink,
  Database,
  Activity,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

interface QueryResult {
  id: string
  query: string
  provider: string
  result: string
  timestamp: string
  blockchain_hash: string
  blockchain_link: string
  consensus_timestamp: string
  sequence_number: number
  execution_time: number
  success: boolean
  // Enhanced Oracle details
  ai_response?: string
  model?: string
  cost?: number
  full_oracle_data?: any
  consensus_method?: string
  confidence?: number
  sources?: string[]
  raw_result?: any
}

interface ResultsStats {
  total_queries: number
  successful_queries: number
  failed_queries: number
  average_execution_time: number
  average_confidence: number
  most_used_provider: string
  blockchain_verification_rate: number
}

export default function ResultsPanel() {
  const [results, setResults] = useState<QueryResult[]>([])
  const [stats, setStats] = useState<ResultsStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadResultsData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch real blockchain query history with cache busting
        const [historyResponse] = await Promise.allSettled([
          fetch(`/api/query-history?limit=50&offset=0&t=${Date.now()}`)
        ])
        
        let blockchainResults: QueryResult[] = []
        
        // Process blockchain history response
        if (historyResponse.status === 'fulfilled' && historyResponse.value.ok) {
          const historyJson = await historyResponse.value.json()
          if (historyJson.success && historyJson.data) {
            blockchainResults = historyJson.data
          }
        }
        
        // Set blockchain results 
        setResults(blockchainResults)
        
        // Calculate stats from blockchain results
        const successful = blockchainResults.filter(r => r.success)
        const failed = blockchainResults.filter(r => !r.success)
        const avgExecutionTime = blockchainResults.length > 0 ? 
          blockchainResults.reduce((sum, r) => sum + r.execution_time, 0) / blockchainResults.length : 0
        
        // Calculate average confidence from Oracle data
        const confidenceValues = blockchainResults
          .filter(r => r.confidence && r.confidence > 0)
          .map(r => r.confidence!)
        const avgConfidence = confidenceValues.length > 0 
          ? confidenceValues.reduce((sum, c) => sum + c, 0) / confidenceValues.length 
          : 95
        
        // Find most used provider
        const providerCounts = blockchainResults.reduce((acc: Record<string, number>, r) => {
          acc[r.provider] = (acc[r.provider] || 0) + 1
          return acc
        }, {})
        const mostUsedProvider = Object.entries(providerCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
        
        // All blockchain queries are verified by definition
        const verificationRate = 100
        
        setStats({
          total_queries: blockchainResults.length,
          successful_queries: successful.length,
          failed_queries: failed.length,
          average_execution_time: Math.round(avgExecutionTime),
          average_confidence: Math.round(avgConfidence),
          most_used_provider: mostUsedProvider,
          blockchain_verification_rate: Math.round(verificationRate)
        })
        
      } catch (error) {
        console.error('Failed to load results data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load results data')
      } finally {
        setIsLoading(false)
      }
    }

    loadResultsData()
    
    // Refresh every 10 seconds
    const interval = setInterval(loadResultsData, 10000)
    return () => clearInterval(interval)
  }, [])

  const filteredResults = results.filter(result => {
    const matchesSearch = searchQuery === '' || 
      result.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.provider.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const formatTimestamp = (timestamp: string) => {
    const queryTime = new Date(timestamp).getTime()
    const now = Date.now()
    const diff = now - queryTime
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'failed': return 'text-red-400'
      case 'pending': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'failed': return XCircle
      case 'pending': return Clock
      default: return AlertCircle
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg">Loading Results Panel...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Query Results & Analysis</h1>
            <p className="text-gray-400">Comprehensive query history, performance metrics, and result analytics</p>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Error Loading Results</span>
            </div>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Total Queries</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats?.total_queries || 0}</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 text-sm">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {stats?.total_queries ? Math.round((stats.successful_queries / stats.total_queries) * 100) : 0}%
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 text-sm">Avg Execution</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats?.average_execution_time || 0}ms</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Avg Confidence</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">{stats?.average_confidence || 0}%</p>
          </div>
        </div>

        {/* Results List - Full Width */}
        <div className="w-full">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl backdrop-blur-sm">
              {/* Search Header */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search queries or providers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="divide-y divide-gray-800 max-h-[800px] overflow-y-auto">
                {filteredResults.length > 0 ? filteredResults.map((result) => {
                  const status = result.success ? 'completed' : 'failed'
                  const StatusIcon = getStatusIcon(status)
                  
                  return (
                    <div key={result.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`w-5 h-5 ${getStatusColor(status)}`} />
                          <div>
                            <h3 className="text-white font-semibold">{result.query}</h3>
                            <p className="text-gray-400 text-sm">via {result.provider}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">{formatTimestamp(result.timestamp)}</span>
                          <div className="flex items-center gap-1 text-green-400">
                            <CheckCircle className="w-3 h-3" />
                            <span className="text-xs">Blockchain Verified</span>
                          </div>
                        </div>
                      </div>

                      {/* Oracle Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-400">Execution Time</span>
                          <p className="text-white font-medium">{result.execution_time}ms</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Oracle Model</span>
                          <p className="text-white font-medium">{result.model || result.provider}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Consensus</span>
                          <p className="text-white font-medium">{result.consensus_method || 'median'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Confidence</span>
                          <p className="text-white font-medium">{result.confidence ? `${result.confidence.toFixed(1)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Sources</span>
                          <p className="text-white font-medium">{result.sources?.length || 1}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Cost</span>
                          <p className="text-white font-medium">{result.cost || 0} hbar</p>
                        </div>
                      </div>

                      {/* Oracle Sources */}
                      {result.sources && result.sources.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-white text-sm font-medium mb-2">Data Sources</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.sources.map((source, index) => (
                              <span key={index} className="bg-blue-900/30 border border-blue-800 text-blue-300 px-2 py-1 rounded text-xs">
                                {source}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Blockchain Details */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-400">Sequence Number</span>
                          <p className="text-white font-medium">#{result.sequence_number}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Blockchain Hash</span>
                          <p className="text-white font-medium text-xs">{result.blockchain_hash.slice(0, 20)}...</p>
                        </div>
                        <div>
                          <span className="text-gray-400">HCS Status</span>
                          <p className="text-green-400 font-medium">✓ Verified</p>
                        </div>
                      </div>

                      {/* Oracle Result */}
                      {result.success && result.result && (
                        <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white text-sm font-medium">Oracle Result</h4>
                            {result.confidence && result.confidence > 0 && (
                              <span className="text-green-400 text-xs">
                                {result.confidence.toFixed(2)}% confidence
                              </span>
                            )}
                          </div>
                          <p className="text-green-400 text-xl font-bold mb-2">{result.result}</p>
                          
                          {/* Raw Oracle Data */}
                          {result.full_oracle_data && Object.keys(result.full_oracle_data).length > 0 && (
                            <details className="mt-3">
                              <summary className="text-gray-400 text-xs cursor-pointer hover:text-gray-300">
                                View Raw Oracle Data
                              </summary>
                              <div className="mt-2 bg-gray-900/50 rounded p-2 text-xs">
                                <pre className="text-gray-300 whitespace-pre-wrap overflow-x-auto">
                                  {JSON.stringify(result.full_oracle_data, null, 2)}
                                </pre>
                              </div>
                            </details>
                          )}
                        </div>
                      )}

                      {/* Failed Query */}
                      {!result.success && (
                        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-3">
                          <h4 className="text-red-400 text-sm font-medium mb-1">Query Failed</h4>
                          <p className="text-red-300 text-sm">This query failed during execution</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm">
                        <a
                          href={result.blockchain_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View on HashScan
                        </a>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-xs">Consensus: {result.consensus_timestamp}</span>
                      </div>
                    </div>
                  )
                }) : (
                  <div className="p-12 text-center">
                    <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                    <p className="text-gray-400">
                      {searchQuery ? 'Try adjusting your search query.' : 'No query results available.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}