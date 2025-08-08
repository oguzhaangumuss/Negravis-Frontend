'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  Network, 
  Target, 
  TrendingUp, 
  Zap, 
  BarChart3,
  Activity,
  Cpu,
  Database,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react'

interface ModelMetrics {
  name: string
  accuracy: number
  status: 'active' | 'training' | 'idle'
  lastUpdated: string
  predictions: number
}

interface AIInsight {
  type: 'anomaly' | 'prediction' | 'optimization' | 'alert'
  title: string
  description: string
  confidence: number
  timestamp: string
  impact: 'high' | 'medium' | 'low'
}

export default function AIMLCenter() {
  const [models, setModels] = useState<ModelMetrics[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading AI/ML data
    const loadData = async () => {
      // Mock AI models data
      const mockModels: ModelMetrics[] = [
        {
          name: 'Price Prediction Model',
          accuracy: 94.7,
          status: 'active',
          lastUpdated: new Date(Date.now() - 300000).toISOString(),
          predictions: 1247
        },
        {
          name: 'Anomaly Detection',
          accuracy: 97.2,
          status: 'active',
          lastUpdated: new Date(Date.now() - 180000).toISOString(),
          predictions: 892
        },
        {
          name: 'Consensus Optimizer',
          accuracy: 91.8,
          status: 'training',
          lastUpdated: new Date(Date.now() - 600000).toISOString(),
          predictions: 445
        },
        {
          name: 'Risk Assessment',
          accuracy: 89.3,
          status: 'active',
          lastUpdated: new Date(Date.now() - 420000).toISOString(),
          predictions: 623
        }
      ]

      // Mock AI insights
      const mockInsights: AIInsight[] = [
        {
          type: 'anomaly',
          title: 'Unusual Price Volatility Detected',
          description: 'BTC price variance 23% above normal range in last 6 hours',
          confidence: 87.4,
          timestamp: new Date(Date.now() - 180000).toISOString(),
          impact: 'medium'
        },
        {
          type: 'prediction',
          title: 'ETH Price Trend Forecast',
          description: 'Predicted 3.2% increase in next 4 hours with 92% confidence',
          confidence: 92.1,
          timestamp: new Date(Date.now() - 240000).toISOString(),
          impact: 'high'
        },
        {
          type: 'optimization',
          title: 'Consensus Algorithm Enhancement',
          description: 'ML model suggests 12% improvement in consensus speed',
          confidence: 78.9,
          timestamp: new Date(Date.now() - 360000).toISOString(),
          impact: 'medium'
        },
        {
          type: 'alert',
          title: 'Provider Reliability Warning',
          description: 'Provider "ChainlinkAPI" showing degraded performance pattern',
          confidence: 95.6,
          timestamp: new Date(Date.now() - 480000).toISOString(),
          impact: 'high'
        }
      ]

      setModels(mockModels)
      setInsights(mockInsights)
      setIsLoading(false)
    }

    loadData()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'training':
        return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
      case 'idle':
        return <Clock className="w-5 h-5 text-gray-400" />
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'prediction':
        return <TrendingUp className="w-5 h-5 text-blue-400" />
      case 'optimization':
        return <Zap className="w-5 h-5 text-green-400" />
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-400" />
      default:
        return <Brain className="w-5 h-5 text-purple-400" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-400 bg-red-400/10'
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10'
      case 'low':
        return 'text-green-400 bg-green-400/10'
      default:
        return 'text-gray-400 bg-gray-400/10'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading AI/ML Center...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI/ML Intelligence Center
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced machine learning models powering intelligent oracle consensus, anomaly detection, and predictive analytics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Cpu className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">{models.filter(m => m.status === 'active').length}</span>
            </div>
            <h3 className="text-gray-300 text-sm font-medium">Active Models</h3>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">
                {models.length > 0 ? (models.reduce((acc, m) => acc + m.accuracy, 0) / models.length).toFixed(1) : 0}%
              </span>
            </div>
            <h3 className="text-gray-300 text-sm font-medium">Avg Accuracy</h3>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">
                {models.reduce((acc, m) => acc + m.predictions, 0).toLocaleString()}
              </span>
            </div>
            <h3 className="text-gray-300 text-sm font-medium">Total Predictions</h3>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{insights.length}</span>
            </div>
            <h3 className="text-gray-300 text-sm font-medium">Active Insights</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Models */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Network className="w-6 h-6 mr-3 text-blue-400" />
                AI Models
              </h2>
              <div className="text-sm text-gray-400">
                {models.filter(m => m.status === 'active').length} / {models.length} Active
              </div>
            </div>
            
            <div className="space-y-4">
              {models.map((model, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(model.status)}
                      <h3 className="font-semibold text-white">{model.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">{model.accuracy}%</div>
                      <div className="text-xs text-gray-400">Accuracy</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Status: </span>
                      <span className={`capitalize ${
                        model.status === 'active' ? 'text-green-400' :
                        model.status === 'training' ? 'text-blue-400' : 'text-gray-400'
                      }`}>
                        {model.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Predictions: </span>
                      <span className="text-white">{model.predictions.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-400">
                    Last updated: {new Date(model.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Brain className="w-6 h-6 mr-3 text-purple-400" />
                AI Insights
              </h2>
              <div className="text-sm text-gray-400">
                Real-time Analysis
              </div>
            </div>
            
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getInsightIcon(insight.type)}
                      <div>
                        <h3 className="font-semibold text-white text-sm">{insight.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                            {insight.impact} impact
                          </span>
                          <span className="text-xs text-gray-400">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                  
                  <div className="text-xs text-gray-400">
                    {new Date(insight.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">AI/ML Capabilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 text-center">
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Predictive Analytics</h3>
              <p className="text-gray-300">
                Advanced time series forecasting for cryptocurrency prices, market trends, and system performance metrics.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Anomaly Detection</h3>
              <p className="text-gray-300">
                Real-time monitoring and detection of unusual patterns in data feeds, consensus behavior, and system health.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 text-center">
              <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Smart Optimization</h3>
              <p className="text-gray-300">
                Intelligent consensus algorithms that adapt and optimize based on network conditions and historical performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
