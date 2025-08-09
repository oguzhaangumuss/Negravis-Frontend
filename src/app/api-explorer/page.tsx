'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Search, 
  Play, 
  Code, 
  Database, 
  Cloud, 
  Zap,
  Globe,
  Shield,
  Activity,
  Server,
  RefreshCw,
  CheckCircle,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Clock,
  BookOpen
} from 'lucide-react'

interface APIEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  title: string
  description: string
  category: string
  parameters?: Parameter[]
  requestBody?: RequestBodySchema
  responseSchema: any
  examples: {
    request?: any
    response: any
  }
  status: 'stable' | 'beta' | 'deprecated'
  authenticated?: boolean
}

interface Parameter {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
}

interface RequestBodySchema {
  type: string
  properties: Record<string, any>
  required?: string[]
}

interface Category {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  endpoints: APIEndpoint[]
}

export default function APIExplorer() {
  const [selectedCategory, setSelectedCategory] = useState('analytics')
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set())
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  const categories: Category[] = [
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Network analytics and performance metrics',
      icon: Activity,
      color: 'blue',
      endpoints: [
        {
          id: 'analytics-health',
          method: 'GET',
          path: '/api/analytics/health',
          title: 'Network Health',
          description: 'Get comprehensive network health metrics and status',
          category: 'analytics',
          status: 'stable',
          responseSchema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  overallHealth: { type: 'number', description: '0-100 health score' },
                  nodeCount: { type: 'number' },
                  activeNodes: { type: 'number' },
                  networkUptime: { type: 'number' },
                  consensusStatus: { type: 'string' },
                  lastUpdate: { type: 'string' }
                }
              }
            }
          },
          examples: {
            response: {
              success: true,
              data: {
                overallHealth: 99.2,
                nodeCount: 39,
                activeNodes: 37,
                networkUptime: 99.98,
                consensusStatus: 'active',
                lastUpdate: '2025-01-08T23:30:00.000Z'
              }
            }
          }
        },
        {
          id: 'analytics-tps',
          method: 'GET', 
          path: '/api/analytics/tps',
          title: 'Transaction Performance',
          description: 'Real-time TPS calculations with historical data',
          category: 'analytics',
          status: 'stable',
          parameters: [
            {
              name: 'timeframe',
              type: 'string',
              required: false,
              description: 'Time period for TPS calculation',
              example: '24h'
            },
            {
              name: 'granularity', 
              type: 'string',
              required: false,
              description: 'Data point granularity',
              example: 'hour'
            }
          ],
          responseSchema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  currentTPS: { type: 'number' },
                  averageTPS: { type: 'number' },
                  peakTPS: { type: 'number' },
                  timeframe: { type: 'string' },
                  dataPoints: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        timestamp: { type: 'string' },
                        tps: { type: 'number' },
                        transactionCount: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          },
          examples: {
            response: {
              success: true,
              data: {
                currentTPS: 3247,
                averageTPS: 2850,
                peakTPS: 10000,
                timeframe: '24h',
                dataPoints: [
                  {
                    timestamp: '2025-01-08T22:00:00Z',
                    tps: 3100,
                    transactionCount: 11160000
                  }
                ]
              }
            }
          }
        }
      ]
    },
    {
      id: 'oracles',
      name: 'Oracle Services',
      description: 'Multi-source data aggregation and consensus',
      icon: Database,
      color: 'green',
      endpoints: [
        {
          id: 'oracle-query',
          method: 'POST',
          path: '/api/oracle-manager/query',
          title: 'Oracle Query',
          description: 'Execute oracle queries with multi-provider consensus',
          category: 'oracles',
          status: 'stable',
          authenticated: true,
          requestBody: {
            type: 'object',
            properties: {
              provider: { type: 'string', description: 'Oracle provider name' },
              query: { type: 'string', description: 'Query string' },
              userId: { type: 'string', description: 'Optional user identifier' }
            },
            required: ['provider', 'query']
          },
          responseSchema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: { type: 'object' },
              query_info: {
                type: 'object',
                properties: {
                  symbol: { type: 'string' },
                  answer: { type: 'string' },
                  sources: { type: 'array' },
                  consensus: { type: 'object' }
                }
              },
              blockchain: {
                type: 'object',
                properties: {
                  transaction_id: { type: 'string' },
                  hash: { type: 'string' },
                  network: { type: 'string' },
                  verified: { type: 'boolean' },
                  explorer_link: { type: 'string' }
                }
              }
            }
          },
          examples: {
            request: {
              provider: 'chainlink',
              query: 'BTC/USD',
              userId: 'user123'
            },
            response: {
              success: true,
              data: { price: 94250.00 },
              query_info: {
                symbol: 'BTC',
                answer: '94250.00',
                sources: ['chainlink', 'coingecko'],
                consensus: { confidence: 0.98 }
              },
              blockchain: {
                transaction_id: '0.0.1234-567890',
                verified: true,
                explorer_link: 'https://hashscan.io/testnet/transaction/...'
              }
            }
          }
        }
      ]
    },
    {
      id: 'blockchain',
      name: 'Blockchain Services',
      description: 'Hedera HCS, HFS, and Mirror Node integration',
      icon: Shield,
      color: 'purple',
      endpoints: [
        {
          id: 'hcs-transactions',
          method: 'GET',
          path: '/api/hcs/transactions',
          title: 'HCS Transactions',
          description: 'Retrieve Hedera Consensus Service transactions',
          category: 'blockchain',
          status: 'stable',
          parameters: [
            {
              name: 'limit',
              type: 'number',
              required: false,
              description: 'Number of transactions to return',
              example: '10'
            },
            {
              name: 'type',
              type: 'string', 
              required: false,
              description: 'Filter by transaction type',
              example: 'oracle_query'
            }
          ],
          responseSchema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  transactions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        transactionId: { type: 'string' },
                        timestamp: { type: 'string' },
                        type: { type: 'string' },
                        data: { type: 'object' },
                        topicId: { type: 'string' }
                      }
                    }
                  },
                  total: { type: 'number' },
                  limit: { type: 'number' }
                }
              }
            }
          },
          examples: {
            response: {
              success: true,
              data: {
                transactions: [
                  {
                    transactionId: '0.0.1234-567890-0',
                    timestamp: '2025-01-08T23:30:00Z',
                    type: 'oracle_query',
                    data: {
                      symbol: 'BTC',
                      price: '94250.00',
                      source: 'chainlink'
                    },
                    topicId: '0.0.4629584'
                  }
                ],
                total: 1,
                limit: 10
              }
            }
          }
        }
      ]
    },
    {
      id: 'contracts',
      name: 'Smart Contracts',
      description: 'Contract deployment and execution',
      icon: Code,
      color: 'yellow',
      endpoints: [
        {
          id: 'contract-deploy',
          method: 'POST',
          path: '/api/contracts/deploy',
          title: 'Deploy Contract',
          description: 'Deploy Solidity smart contracts to Hedera',
          category: 'contracts',
          status: 'stable',
          authenticated: true,
          requestBody: {
            type: 'object',
            properties: {
              contractName: { type: 'string', description: 'Contract name' },
              constructorParams: { type: 'array', description: 'Constructor parameters' },
              gasLimit: { type: 'number', description: 'Gas limit (optional)' }
            },
            required: ['contractName']
          },
          responseSchema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              contractAddress: { type: 'string' },
              transactionId: { type: 'string' },
              gasUsed: { type: 'string' },
              deploymentTime: { type: 'string' }
            }
          },
          examples: {
            request: {
              contractName: 'OracleContract',
              constructorParams: [],
              gasLimit: 1000000
            },
            response: {
              success: true,
              contractAddress: '0.0.1234567',
              transactionId: '0.0.1234-567890',
              gasUsed: '847293',
              deploymentTime: '2.8s'
            }
          }
        }
      ]
    }
  ]

  const toggleEndpoint = (endpointId: string) => {
    const newExpanded = new Set(expandedEndpoints)
    if (newExpanded.has(endpointId)) {
      newExpanded.delete(endpointId)
    } else {
      newExpanded.add(endpointId)
    }
    setExpandedEndpoints(newExpanded)
  }

  const testEndpoint = async (endpoint: APIEndpoint) => {
    setIsLoading(prev => ({ ...prev, [endpoint.id]: true }))
    
    try {
      const url = endpoint.path + (endpoint.parameters ? '?limit=5&type=oracle_query' : '')
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      }

      if (endpoint.method !== 'GET' && endpoint.examples.request) {
        options.body = JSON.stringify(endpoint.examples.request)
      }

      const response = await fetch(url, options)
      const data = await response.json()
      
      setTestResults(prev => ({
        ...prev,
        [endpoint.id]: {
          status: response.status,
          data,
          timestamp: new Date().toISOString()
        }
      }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpoint.id]: {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }))
    } finally {
      setIsLoading(prev => ({ ...prev, [endpoint.id]: false }))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-green-600',
      POST: 'bg-blue-600', 
      PUT: 'bg-yellow-600',
      DELETE: 'bg-red-600'
    }
    return colors[method as keyof typeof colors] || 'bg-gray-600'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      stable: 'text-green-400',
      beta: 'text-yellow-400',
      deprecated: 'text-red-400'
    }
    return colors[status as keyof typeof colors] || 'text-gray-400'
  }

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'from-blue-900/50 to-blue-800/30 border-blue-500/30',
      green: 'from-green-900/50 to-green-800/30 border-green-500/30',
      purple: 'from-purple-900/50 to-purple-800/30 border-purple-500/30',
      yellow: 'from-yellow-900/50 to-yellow-800/30 border-yellow-500/30'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            API Explorer
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Interactive documentation for 150+ API endpoints with live testing capabilities and comprehensive examples
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-white mb-6">API Categories</h2>
            <div className="space-y-3">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">{category.name}</div>
                        <div className="text-sm opacity-75">{category.endpoints.length} endpoints</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">API Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Endpoints</span>
                  <span className="text-white font-semibold">150+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Categories</span>
                  <span className="text-white font-semibold">{categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-green-400 font-semibold">&lt; 200ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-green-400 font-semibold">99.9%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {categories
              .filter(category => category.id === selectedCategory)
              .map((category) => {
                const Icon = category.icon
                return (
                  <div key={category.id}>
                    {/* Category Header */}
                    <div className={`bg-gradient-to-br ${getCategoryColor(category.color)} backdrop-blur-sm border rounded-2xl p-6 mb-8`}>
                      <div className="flex items-center mb-4">
                        <Icon className="w-8 h-8 text-white mr-4" />
                        <div>
                          <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                          <p className="text-gray-300">{category.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Endpoints */}
                    <div className="space-y-6">
                      {category.endpoints.map((endpoint) => (
                        <div key={endpoint.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl overflow-hidden">
                          {/* Endpoint Header */}
                          <div 
                            className="p-6 cursor-pointer hover:bg-gray-700/50 transition-colors"
                            onClick={() => toggleEndpoint(endpoint.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 rounded text-white text-sm font-medium ${getMethodColor(endpoint.method)}`}>
                                  {endpoint.method}
                                </span>
                                <div>
                                  <h3 className="text-lg font-semibold text-white">{endpoint.title}</h3>
                                  <p className="text-gray-400 text-sm">{endpoint.description}</p>
                                  <code className="text-blue-400 text-sm font-mono">{endpoint.path}</code>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className={`text-sm ${getStatusColor(endpoint.status)}`}>
                                  {endpoint.status}
                                </span>
                                {endpoint.authenticated && (
                                  <Shield className="w-4 h-4 text-yellow-400" />
                                )}
                                {expandedEndpoints.has(endpoint.id) ? (
                                  <ChevronDown className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Endpoint Details */}
                          {expandedEndpoints.has(endpoint.id) && (
                            <div className="border-t border-gray-600 p-6 space-y-6">
                              {/* Parameters */}
                              {endpoint.parameters && endpoint.parameters.length > 0 && (
                                <div>
                                  <h4 className="text-lg font-semibold text-white mb-3">Parameters</h4>
                                  <div className="bg-gray-900 rounded-lg p-4">
                                    {endpoint.parameters.map((param, index) => (
                                      <div key={index} className="mb-3 last:mb-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <code className="text-blue-400">{param.name}</code>
                                          <span className="text-gray-400">({param.type})</span>
                                          {param.required && (
                                            <span className="text-red-400 text-sm">required</span>
                                          )}
                                        </div>
                                        <p className="text-gray-300 text-sm">{param.description}</p>
                                        {param.example && (
                                          <code className="text-green-400 text-sm">Example: {param.example}</code>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Request Body */}
                              {endpoint.requestBody && (
                                <div>
                                  <h4 className="text-lg font-semibold text-white mb-3">Request Body</h4>
                                  <div className="bg-gray-900 rounded-lg p-4">
                                    <pre className="text-green-400 text-sm overflow-x-auto">
                                      {JSON.stringify(endpoint.examples.request || endpoint.requestBody, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}

                              {/* Response Example */}
                              <div>
                                <h4 className="text-lg font-semibold text-white mb-3">Response Example</h4>
                                <div className="bg-gray-900 rounded-lg p-4">
                                  <pre className="text-green-400 text-sm overflow-x-auto">
                                    {JSON.stringify(endpoint.examples.response, null, 2)}
                                  </pre>
                                </div>
                              </div>

                              {/* Test Button & Results */}
                              <div>
                                <div className="flex items-center space-x-4 mb-4">
                                  <button
                                    onClick={() => testEndpoint(endpoint)}
                                    disabled={isLoading[endpoint.id]}
                                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                                  >
                                    {isLoading[endpoint.id] ? (
                                      <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Play className="w-4 h-4" />
                                    )}
                                    <span>Test Endpoint</span>
                                  </button>
                                  <button
                                    onClick={() => copyToClipboard(endpoint.path)}
                                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                                  >
                                    <Copy className="w-4 h-4" />
                                    <span>Copy URL</span>
                                  </button>
                                </div>

                                {/* Test Results */}
                                {testResults[endpoint.id] && (
                                  <div className="bg-gray-900 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <h5 className="font-semibold text-white">Test Result</h5>
                                      <div className="flex items-center space-x-2">
                                        {testResults[endpoint.id].status === 'error' ? (
                                          <AlertCircle className="w-4 h-4 text-red-400" />
                                        ) : (
                                          <CheckCircle className="w-4 h-4 text-green-400" />
                                        )}
                                        <span className="text-sm text-gray-400">
                                          {new Date(testResults[endpoint.id].timestamp).toLocaleTimeString()}
                                        </span>
                                      </div>
                                    </div>
                                    <pre className="text-green-400 text-sm overflow-x-auto">
                                      {JSON.stringify(testResults[endpoint.id], null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Need More Information?</h2>
            <p className="text-gray-300 mb-6">
              Access the complete interactive API documentation with advanced testing capabilities
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/docs"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Full Documentation</span>
              </a>
              <a
                href="https://negravis-app.vercel.app/docs"
                target="_blank"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Swagger UI</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
