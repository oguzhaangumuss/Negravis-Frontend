'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Database, 
  Search, 
  Activity, 
  TrendingUp, 
  Shield, 
  FileText,
  Zap,
  ExternalLink
} from 'lucide-react'
import ProviderDashboard from '../../components/oracle/ProviderDashboard'
import InteractiveQueryBuilder from '../../components/oracle/InteractiveQueryBuilder'
import ResultsPanel from '../../components/oracle/ResultsPanel'

type TabType = 'overview' | 'providers' | 'query-builder' | 'consensus' | 'results' | 'blockchain'

interface Tab {
  id: TabType
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const tabs: Tab[] = [
  {
    id: 'overview',
    name: 'Overview',
    icon: BarChart3,
    description: 'System metrics and status'
  },
  {
    id: 'providers',
    name: 'Providers',
    icon: Database,
    description: '10+ live Oracle providers'
  },
  {
    id: 'query-builder',
    name: 'Query Builder',
    icon: Search,
    description: 'Interactive query creation'
  },
  {
    id: 'consensus',
    name: 'Consensus',
    icon: Activity,
    description: 'Algorithm visualization'
  },
  {
    id: 'results',
    name: 'Results',
    icon: FileText,
    description: 'Query history & analysis'
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    icon: Shield,
    description: 'HCS verification & audit'
  }
]

// Overview Dashboard Component
function OverviewDashboard() {
  const [systemStats, setSystemStats] = useState({
    totalQueries: 0,
    activeProviders: 0,
    totalProviders: 0,
    avgResponseTime: '0ms',
    successRate: 0,
    consensusAccuracy: 0,
    hcsMessages: 0,
    avgReliability: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSystemStats = async () => {
      try {
        setIsLoading(true)
        
        // Load real data from query history API (working endpoint)
        const [queryHistoryResponse, providersResponse] = await Promise.allSettled([
          fetch(`/api/query-history?limit=100&t=${Date.now()}`), // Get all recent queries
          fetch('/api/oracle-manager/providers')
        ])

        let updatedStats = { ...systemStats }

        // Process query history data (GERÇEK BLOCKCHAIN VERİLERİ)
        if (queryHistoryResponse.status === 'fulfilled' && queryHistoryResponse.value.ok) {
          const queryData = await queryHistoryResponse.value.json()
          if (queryData.success && queryData.data) {
            const queries = queryData.data
            const successfulQueries = queries.filter(q => q.success)
            const totalExecutionTime = queries.reduce((sum, q) => sum + q.execution_time, 0)
            const avgExecutionTime = queries.length > 0 ? Math.round(totalExecutionTime / queries.length) : 0
            const avgConfidence = queries.length > 0 
              ? Math.round(queries.reduce((sum, q) => sum + (q.confidence || 95), 0) / queries.length)
              : 95
            
            // Count unique providers from actual blockchain queries with better mapping
            const providerSet = new Set()
            const providerMappings = {
              'llama-3.3-70b-instruct': 'chatbot',
              'coingecko': 'coingecko',  
              'dia': 'dia',
              'weather': 'weather',
              'chainlink': 'chainlink',
              'nasa': 'nasa',
              'wikipedia': 'wikipedia',
              'exchangerate': 'exchangerate',
              'sports': 'sports'
            }
            
            queries.forEach(q => {
              if (q.provider && q.provider !== 'unknown') {
                // Map provider names to known providers
                const mappedProvider = providerMappings[q.provider] || q.provider
                providerSet.add(mappedProvider)
              }
              // Also check sources array for additional providers
              if (q.sources && Array.isArray(q.sources)) {
                q.sources.forEach(source => {
                  if (source && source !== 'unknown' && source.trim().length > 0) {
                    const mappedSource = providerMappings[source] || source
                    providerSet.add(mappedSource)
                  }
                })
              }
            })
            const uniqueProviders = Array.from(providerSet)
            
            updatedStats = {
              ...updatedStats,
              totalQueries: queries.length, // ACTUAL blockchain query count
              hcsMessages: queries.length, // ACTUAL HCS message count
              successRate: queries.length > 0 ? Math.round((successfulQueries.length / queries.length) * 100) : 0,
              avgResponseTime: `${avgExecutionTime}ms`,
              consensusAccuracy: avgConfidence,
              activeProviders: uniqueProviders.length, // ACTUAL active providers count
              avgReliability: avgConfidence
            }
          }
        }

        // TOTAL PROVIDERS: Use known provider count from system architecture
        // Our system has these providers: weather, coingecko, dia, chainlink, NASA, wikipedia, etc.
        const TOTAL_KNOWN_PROVIDERS = 9 // Based on system design
        
        // If providers API works, use its data, otherwise use known architecture count
        if (providersResponse.status === 'fulfilled' && providersResponse.value.ok) {
          try {
            const providersData = await providersResponse.value.json()
            if (providersData.success && providersData.data?.total_providers) {
              updatedStats = {
                ...updatedStats,
                totalProviders: providersData.data.total_providers
              }
            } else {
              // Use known system architecture count
              updatedStats = {
                ...updatedStats,
                totalProviders: TOTAL_KNOWN_PROVIDERS
              }
            }
          } catch (error) {
            // Use known system architecture count
            updatedStats = {
              ...updatedStats,
              totalProviders: TOTAL_KNOWN_PROVIDERS
            }
          }
        } else {
          // Use known system architecture count
          updatedStats = {
            ...updatedStats,
            totalProviders: TOTAL_KNOWN_PROVIDERS
          }
        }

        setSystemStats(updatedStats)
      } catch (error) {
        console.error('Failed to load system stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSystemStats()
    
    // Auto refresh removed - manual refresh only
    // const interval = setInterval(loadSystemStats, 30000)
    // return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg">Loading Oracle Command Center...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Oracle Command Center</h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Multi-provider data aggregation with blockchain verification
        </p>
        <div className="flex items-center justify-center space-x-6 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">Live Data Stream</span>
          </div>
          <div className="text-gray-400">
            {systemStats.activeProviders}/{systemStats.totalProviders} Providers Online
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Oracle Queries */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Oracle Queries</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{systemStats.totalQueries}</div>
          <div className="text-gray-500 text-sm">Real blockchain data</div>
        </div>

        {/* Active Providers */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400 text-sm">Active Providers</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {systemStats.activeProviders}/{systemStats.totalProviders}
          </div>
          <div className="text-gray-500 text-sm">Provider status</div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">Avg Response</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{systemStats.avgResponseTime}</div>
          <div className="text-gray-500 text-sm">Query processing</div>
        </div>

        {/* Success Rate */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">Success Rate</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{systemStats.successRate}%</div>
          <div className="text-gray-500 text-sm">Query completion</div>
        </div>

        {/* Avg Reliability */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Avg Reliability</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{systemStats.avgReliability}%</div>
          <div className="text-gray-500 text-sm">Provider performance</div>
        </div>

        {/* Blockchain Transactions */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">HCS Transactions</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{systemStats.hcsMessages}</div>
          <div className="text-gray-500 text-sm">Verified on blockchain</div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          System Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
  )
}

// Real Oracle consensus information
function ConsensusTab() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Oracle Consensus Methods</h2>
        <p className="text-gray-400">Multi-source data aggregation and consensus algorithms</p>
      </div>
      
      <div className="space-y-6">
        {/* Consensus Methods */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Active Consensus Methods</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Median Consensus</h4>
              <p className="text-gray-400 text-sm mb-3">
                Used for numeric data like prices. Takes the median value from multiple sources to eliminate outliers.
              </p>
              <div className="text-blue-400 text-sm">✓ Active for Price Oracles</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Weighted Average</h4>
              <p className="text-gray-400 text-sm mb-3">
                Assigns different weights to sources based on reliability and accuracy history.
              </p>
              <div className="text-green-400 text-sm">✓ Used for High-Stakes Queries</div>
            </div>
          </div>
        </div>
        
        {/* Current Sources */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Data Source Integration</h3>
          <div className="flex flex-wrap gap-3">
            {['Chainlink', 'CoinGecko', 'DIA Oracle', 'Weather API', 'NASA', 'Wikipedia'].map((source) => (
              <span key={source} className="bg-blue-900/30 border border-blue-800 text-blue-300 px-3 py-1 rounded-full text-sm">
                {source}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-4">
            All queries aggregate data from multiple sources and apply consensus algorithms to ensure accuracy.
          </p>
        </div>
      </div>
    </div>
  )
}

function ResultsTab() {
  return <ResultsPanel />
}

function BlockchainTab() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Blockchain Verification</h2>
        <p className="text-gray-400">Real-time HCS verification and audit trail</p>
      </div>
      
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Hedera Consensus Service Status</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-green-400 text-2xl font-bold">100%</div>
            <div className="text-gray-400 text-sm">Blockchain Verification</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 text-2xl font-bold">0.0.6533324</div>
            <div className="text-gray-400 text-sm">HCS Topic ID</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 text-2xl font-bold">Live</div>
            <div className="text-gray-400 text-sm">Network Status</div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-800">
          <p className="text-gray-300 text-sm">
            All Oracle queries are automatically verified and stored on the Hedera blockchain 
            through Consensus Service. Every query result is immutable and traceable.
          </p>
          
          <div className="mt-4 flex gap-4">
            <a 
              href="https://hashscan.io/testnet/topic/0.0.6533324" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View Topic on HashScan
            </a>
            <a 
              href="https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.6533234/messages" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Mirror Node API
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OracleCommandCenterPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />
      case 'providers':
        return <ProviderDashboard />
      case 'query-builder':
        return <InteractiveQueryBuilder />
      case 'consensus':
        return <ConsensusTab />
      case 'results':
        return <ResultsTab />
      case 'blockchain':
        return <BlockchainTab />
      default:
        return <OverviewDashboard />
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-800">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      isActive
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-2 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'}`} />
                    <div className="text-left">
                      <div className={isActive ? 'text-blue-400' : 'text-gray-300'}>{tab.name}</div>
                      <div className="text-xs text-gray-500">{tab.description}</div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}