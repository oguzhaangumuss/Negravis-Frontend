'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Merriweather } from 'next/font/google'
import { 
  Hash,
  AlertCircle
} from 'lucide-react'

import { HashscanQueryResult, HashscanTransactionResult, oracleApi } from '../../services/oracleApi'
import SearchBar from '../../components/hashscan/SearchBar'
import QueryResultCard from '../../components/hashscan/QueryResultCard'
import DataSourcesCard from '../../components/hashscan/DataSourcesCard'
import BlockchainVerificationCard from '../../components/hashscan/BlockchainVerificationCard'
import TransactionDetailsCard from '../../components/hashscan/TransactionDetailsCard'

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather'
})

interface HashscanPageContentProps {}

function HashscanPageContent({}: HashscanPageContentProps) {
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
    
    if (type === 'query' && id) {
      handleQueryLookup(id)
    } else if (type === 'transaction' && id) {
      handleTransactionLookup(id)
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
    
    // Determine if it's a query ID or transaction ID based on pattern
    if (searchQuery.includes('-') || searchQuery.length < 20) {
      handleQueryLookup(searchQuery.trim())
    } else {
      handleTransactionLookup(searchQuery.trim())
    }
  }


  return (
    <div className={`min-h-screen bg-black text-white ${merriweather.className}`}>
      {/* Header */}
      <header className="border-b border-gray-800">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded"></div>
            <span className="text-xl font-bold">Negravis</span>
            <span className="text-gray-400">/</span>
            <span className="text-lg">Hashscan</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-300 hover:text-white">Dashboard</button>
            <button className="text-gray-300 hover:text-white">Oracle API</button>
            <button className="text-gray-300 hover:text-white">Analytics</button>
            <button className="bg-white text-black px-4 py-2 rounded-md font-semibold">Connect Wallet</button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Hash className="w-8 h-8 text-blue-400" />
            Oracle Hashscan
          </h1>
          <p className="text-gray-400">
            Explore Oracle query results with blockchain verification and data source transparency
          </p>
        </div>

        {/* Search Section */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Searching blockchain records...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-red-400">Error</h3>
            </div>
            <p className="text-gray-300">{error}</p>
          </div>
        )}

        {/* Query Result Display */}
        {queryResult && (
          <div className="space-y-6">
            <QueryResultCard queryResult={queryResult} />
            <DataSourcesCard dataSources={queryResult.data_sources} />
            <BlockchainVerificationCard 
              blockchainHash={queryResult.blockchain_hash}
              blockchainLink={queryResult.blockchain_link}
            />

            {/* Raw Data (if available) */}
            {queryResult.raw_data && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Raw Data</h3>
                <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(queryResult.raw_data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Transaction Result Display */}
        {transactionResult && (
          <TransactionDetailsCard transactionResult={transactionResult} />
        )}

        {/* No Results State */}
        {!loading && !error && !queryResult && !transactionResult && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <Hash className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-300">Start Exploring</h3>
            <p className="text-gray-400 mb-4">
              Enter a Query ID or Transaction Hash to view detailed Oracle data and blockchain verification
            </p>
            <div className="text-sm text-gray-500">
              Example: bitcoin-price-1734567890 or 0.0.123456@1234567890.123456789
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function HashscanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    }>
      <HashscanPageContent />
    </Suspense>
  )
}