'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Merriweather } from 'next/font/google'
import { 
  Hash,
  AlertCircle,
  Search,
  ExternalLink,
  Clock,
  Database,
  Activity,
  BarChart3
} from 'lucide-react'

import { HashscanQueryResult, HashscanTransactionResult, oracleApi } from '../../services/oracleApi'
import { CopyButton } from '../../components/CopyButton'

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather'
})

function HashscanPageContent() {
  const searchParams = useSearchParams()
  const [queryResult, setQueryResult] = useState<HashscanQueryResult | null>(null)
  const [transactionResult, setTransactionResult] = useState<HashscanTransactionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Handle URL parameters for direct links
  useEffect(() => {
    const type = searchParams.get('type')
    const id = searchParams.get('id')
    
    if (id) {
      setSearchQuery(id)
      // Auto-detect based on pattern if no type specified
      const isHederaTransactionId = /^0\.0\.\d+@\d+\.\d+$/.test(id)
      
      if (type === 'query' || (!type && !isHederaTransactionId)) {
        console.log('🔍 URL: Query lookup for:', id)
        handleQueryLookup(id)
      } else if (type === 'transaction' || (!type && isHederaTransactionId)) {
        console.log('🔍 URL: Transaction lookup for:', id)
        handleTransactionLookup(id)
      }
    }
  }, [searchParams])

  const handleQueryLookup = async (queryId: string) => {
    setLoading(true)
    setError(null)
    setQueryResult(null)
    setTransactionResult(null)
    
    try {
      const result = await oracleApi.getHashscanQuery(queryId)
      if (result.success && result.query) {
        setQueryResult(result.query)
      } else {
        setError(result.error || 'Failed to fetch query data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleTransactionLookup = async (transactionId: string) => {
    setLoading(true)
    setError(null)
    setQueryResult(null)
    setTransactionResult(null)
    
    try {
      const result = await oracleApi.getHashscanTransaction(transactionId)
      if (result.success && result.data) {
        setTransactionResult(result.data)
        
        // Check for Oracle data from backend API response
        if (result.data.oracle_data) {
          console.log('🔍 Found Oracle data in backend response:', result.data.oracle_data)
          console.log('🔍 Oracle data type check:', typeof result.data.oracle_data)
          console.log('🔍 Oracle data keys:', Object.keys(result.data.oracle_data))
          
          const oracleData = result.data.oracle_data
          const mockQueryResult = {
            query: String(oracleData.query || 'Unknown Query'),
            answer: String(oracleData.answer || (typeof oracleData.value === 'number' ? `$${oracleData.value?.toLocaleString()}` : JSON.stringify(oracleData.value)) || 'N/A'),
            value: Number(oracleData.value) || 0,
            confidence: Number(oracleData.confidence) || 1,
            method: String(oracleData.method || 'median'),
            sources: Array.isArray(oracleData.sources) ? oracleData.sources : [],
            provider: String(oracleData.provider || 'unknown'),
            timestamp: result.data.timestamp,
            blockchain_hash: result.data.blockchain_hash || result.data.id,
            blockchain_link: result.data.explorer_url,
            data_sources: Array.isArray(oracleData.raw_responses) ? oracleData.raw_responses.map((response: any, index: number) => ({
              name: String(response.source || `Source ${index + 1}`),
              type: 'API',
              weight: '1.0',
              confidence: `${Math.round((Number(response.confidence) || 0.95) * 100)}%`
            })) : []
          }
          
          setQueryResult(mockQueryResult)
        }
        
        // Fallback: If transaction has HCS data but no oracle_data in response
        else if (result.data.details?.hcs_data) {
          try {
            const hcsData = result.data.details.hcs_data
            console.log('🔍 Parsing HCS Oracle data directly:', hcsData)
            
            // Handle different HCS data structures
            const oracleResult = hcsData.result || hcsData.data || {}
            const queryInfo = hcsData.query_info || {}
            
            const mockQueryResult = {
              query: String(hcsData.query || queryInfo.query || 'Unknown Query'),
              answer: String(queryInfo.answer || (typeof oracleResult.value === 'number' ? `$${oracleResult.value?.toLocaleString()}` : JSON.stringify(oracleResult.value)) || 'N/A'),
              value: Number(oracleResult.value) || 0,
              confidence: Number(oracleResult.confidence) || 1,
              method: String(oracleResult.method || 'median'),
              sources: Array.isArray(oracleResult.sources) ? oracleResult.sources : [],
              provider: String((Array.isArray(oracleResult.sources) && oracleResult.sources[0]) || 'unknown'),
              timestamp: hcsData.timestamp || result.data.timestamp,
              blockchain_hash: result.data.blockchain_hash || result.data.id,
              blockchain_link: result.data.explorer_url,
              data_sources: Array.isArray(oracleResult.raw_responses) ? oracleResult.raw_responses.map((response: any, index: number) => ({
                name: String(response.source || `Source ${index + 1}`),
                type: 'API',
                weight: '1.0',
                confidence: `${Math.round((Number(response.confidence) || 0.95) * 100)}%`
              })) : []
            }
            
            setQueryResult(mockQueryResult)
          } catch (parseErr) {
            console.log('Error parsing HCS Oracle data:', parseErr)
          }
        }
      } else {
        setError(result.error || 'Failed to fetch transaction data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    const trimmedQuery = searchQuery.trim()
    
    // Determine if it's a Hedera transaction ID or query ID based on pattern
    const isHederaTransactionId = /^0\.0\.\d+@\d+\.\d+$/.test(trimmedQuery)
    
    if (isHederaTransactionId) {
      console.log('🔍 Detected Hedera transaction ID:', trimmedQuery)
      handleTransactionLookup(trimmedQuery)
    } else {
      console.log('🔍 Detected query ID:', trimmedQuery)
      handleQueryLookup(trimmedQuery)
    }
  }

  const formatTimestamp = (timestamp: string | number) => {
    const date = new Date(typeof timestamp === 'number' ? timestamp : timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className={`min-h-screen bg-slate-900 text-white ${merriweather.className}`}>
      {/* Header */}
      <header className="border-b border-slate-700/50">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
            <span className="text-xl font-bold">Negravis</span>
            <span className="text-slate-400">/</span>
            <span className="text-lg">Hashscan</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-slate-300 hover:text-white transition-colors">Dashboard</button>
            <button className="text-slate-300 hover:text-white transition-colors">Oracle API</button>
            <button className="text-slate-300 hover:text-white transition-colors">Analytics</button>
            <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold transition-all">
              Connect Wallet
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Hash className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Oracle Hashscan</h1>
          <p className="text-xl text-slate-400">
            Explore Oracle query results with blockchain verification and data source transparency
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700/50">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter Query ID or Transaction Hash..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="px-8 py-3 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
          <p className="text-sm text-slate-400">
            Enter a Query ID (e.g., bitcoin-price-123) or Transaction Hash to explore Oracle data
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700/50">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-400">Searching blockchain records...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-red-400">Search Error</h3>
            </div>
            <p className="text-red-300/80">{error}</p>
          </div>
        )}

        {/* Query Result Display - Compact Design */}
        {queryResult && (
          <div className="space-y-6">

          </div>
        )}

        {/* Transaction Result Display - Compact Design */}
        {transactionResult && (
          <div className="space-y-6">
            {/* Parse HCS Data for Oracle Results */}
            {(() => {
              try {
                const details = transactionResult.details as Record<string, unknown>;
                
                // Try to parse HCS data if present
                const hcsData = details?.hcs_data as Record<string, unknown>;
                if (hcsData?.result) {
                  const oracleResult = hcsData.result as Record<string, unknown>;
                  const rawResponses = (oracleResult.raw_responses as Record<string, unknown>[]) || [];
                  
                  return (
                    <>
                      {/* Query Result Card */}
                      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Database className="w-6 h-6 text-blue-400" />
                            <h2 className="text-xl font-bold">Query Result</h2>
                          </div>
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                            {Math.round(((oracleResult.confidence as number || 0.95) * 100))}% Confidence
                          </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                          <div>
                            <h3 className="text-sm font-medium text-slate-400 mb-2">Query</h3>
                            <p className="text-lg font-medium">{(hcsData.query as string) || 'Unknown'}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-slate-400 mb-2">Answer</h3>
                            <p className="text-2xl font-bold text-green-400">${(oracleResult.value as string) || '0'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400">{formatTimestamp(transactionResult.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400">Query ID: {transactionResult.id.split('@')[0]}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400">Oracle: {((rawResponses[0] as Record<string, unknown>)?.source as string) || 'Multiple'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Data Sources */}
                      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <BarChart3 className="w-6 h-6 text-purple-400" />
                          <h3 className="text-xl font-bold">Data Sources</h3>
                        </div>
                        {rawResponses.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rawResponses.map((response: Record<string, unknown>, index: number) => (
                              <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold capitalize">{(response.source as string) || 'Unknown'}</h4>
                                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                                    API
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-slate-400">Weight:</span>
                                    <span className="ml-2 font-medium">1.0</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Confidence:</span>
                                    <span className="ml-2 font-medium">{Math.round(((response.confidence as number) || 0.95) * 100)}%</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-400">No data sources available</p>
                        )}
                      </div>

                      {/* Consensus Mechanism */}
                      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Activity className="w-6 h-6 text-orange-400" />
                          <h3 className="text-xl font-bold">Consensus Mechanism</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-orange-400">Method: {(oracleResult.method as string) || 'Median'}</h4>
                              <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                                Aggregation
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-slate-400">Data Points:</span>
                                <span className="ml-2 font-medium text-white">{rawResponses.length}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">Final Value:</span>
                                <span className="ml-2 font-medium text-green-400">${(oracleResult.value as string) || '0'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">Consensus:</span>
                                <span className="ml-2 font-medium text-blue-400">{Math.round(((oracleResult.confidence as number || 0.95) * 100))}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Consensus Process Visualization */}
                          <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/20">
                            <h5 className="font-medium text-slate-300 mb-3">Process Steps:</h5>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <div className="text-center">
                                <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                                <p className="text-xs text-slate-400">Data Collection</p>
                              </div>
                              <div className="text-center">
                                <div className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                                <p className="text-xs text-slate-400">Validation</p>
                              </div>
                              <div className="text-center">
                                <div className="w-8 h-8 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                                <p className="text-xs text-slate-400">Aggregation</p>
                              </div>
                              <div className="text-center">
                                <div className="w-8 h-8 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
                                <p className="text-xs text-slate-400">HCS Logging</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }
                
                // Fallback for other transaction types
                return null;
                
              } catch {
                return null;
              }
            })()}

            {/* Blockchain Verification */}
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <h3 className="text-xl font-bold">Blockchain Verification</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-400 mb-2">Transaction Hash</h4>
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/30 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-mono break-all">
                        {transactionResult.id}
                      </code>
                      <CopyButton text={transactionResult.id} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-400 mb-2">Hedera Explorer</h4>
                  <p className="text-slate-400 text-sm mb-4">View on blockchain</p>
                  <a
                    href={transactionResult.explorer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && !queryResult && !transactionResult && (
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-12 text-center">
            <Hash className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-slate-400">Ready to Explore</h3>
            <p className="text-slate-500 mb-6">
              Enter a Transaction ID or Query ID above to view Oracle data with blockchain verification
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function HashscanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-400">Loading HashScan Explorer...</p>
        </div>
      </div>
    }>
      <HashscanPageContent />
    </Suspense>
  )
}