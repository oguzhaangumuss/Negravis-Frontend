'use client'

import { useState, useEffect } from 'react'
import { 
  Database, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  AlertCircle,
  Zap,
  Globe
} from 'lucide-react'

interface Provider {
  id: string
  name: string
  icon: string
  description: string
  category: string
  specialties: string[]
  latency: string
  reliability: string
}

interface ProvidersData {
  categories: {
    Premium: Provider[]
    Free: Provider[]
    Official: Provider[]
    Dynamic: Provider[]
  }
  total_providers: number
}

export default function ProviderDashboard() {
  const [providersData, setProvidersData] = useState<ProvidersData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/oracle-manager/providers')
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch provider data')
        }
        
        setProvidersData(result.data)
      } catch (error) {
        console.error('Failed to load providers:', error)
        setError(error instanceof Error ? error.message : 'Failed to load providers')
      } finally {
        setIsLoading(false)
      }
    }

    loadProviders()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadProviders, 30000)
    return () => clearInterval(interval)
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Premium': return 'text-yellow-400'
      case 'Free': return 'text-green-400'
      case 'Official': return 'text-blue-400'
      case 'Dynamic': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'Premium': return 'bg-yellow-500/20 border-yellow-500/30'
      case 'Free': return 'bg-green-500/20 border-green-500/30'
      case 'Official': return 'bg-blue-500/20 border-blue-500/30'
      case 'Dynamic': return 'bg-purple-500/20 border-purple-500/30'
      default: return 'bg-gray-500/20 border-gray-500/30'
    }
  }

  const getAllProviders = (): Provider[] => {
    if (!providersData) return []
    return [
      ...providersData.categories.Premium,
      ...providersData.categories.Free,
      ...providersData.categories.Official,
      ...providersData.categories.Dynamic
    ]
  }

  const formatLatency = (latency: number) => {
    return `${Math.round(latency)}ms`
  }

  const formatSuccessRate = (rate: number) => {
    return `${Math.round(rate)}%`
  }

  const formatLastCheck = (timestamp: number) => {
    const now = Date.now()
    const diff = now - (timestamp * 1000)
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes === 1) return '1 minute ago'
    if (minutes < 60) return `${minutes} minutes ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return '1 hour ago'
    if (hours < 24) return `${hours} hours ago`
    
    const days = Math.floor(hours / 24)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg">Loading Provider Dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Provider Dashboard</h1>
          <p className="text-gray-400">Monitor all Oracle providers and their real-time performance metrics</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Error Loading Providers</span>
            </div>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Total Providers</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {providersData?.total_providers || 0}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 text-sm">Free Providers</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {providersData?.categories?.Free?.length || 0}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Avg Reliability</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {(() => {
                const allProviders = getAllProviders()
                if (allProviders.length === 0) return 0
                const avgReliability = allProviders.reduce((sum, p) => {
                  const reliabilityNum = parseInt(p.reliability.replace('%', ''))
                  return sum + reliabilityNum
                }, 0) / allProviders.length
                return Math.round(avgReliability)
              })()}%
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 text-sm">Premium Providers</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {providersData?.categories?.Premium?.length || 0}
            </div>
          </div>
        </div>

        {/* All Providers */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-white">
              Oracle Providers
            </h2>
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm">
              {getAllProviders().length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getAllProviders().map((provider) => (
              <div key={provider.id} className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 backdrop-blur-sm hover:border-gray-600 transition-all duration-200">
                {/* Provider Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{provider.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                        {provider.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-green-400">
                      Available
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{provider.description}</p>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {provider.specialties?.slice(0, 3).map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg border border-blue-500/30">
                        {specialty}
                      </span>
                    ))}
                    {provider.specialties?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-lg">
                        +{provider.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">Latency</span>
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {provider.latency}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">Reliability</span>
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {provider.reliability}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-sm">Reliability</span>
                      <span className="text-white text-sm">{provider.reliability}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600"
                        style={{ width: provider.reliability }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!providersData?.total_providers && !isLoading && !error && (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Providers Found</h3>
            <p className="text-gray-400">No provider data available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}