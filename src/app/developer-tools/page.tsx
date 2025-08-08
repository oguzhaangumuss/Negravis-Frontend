'use client'

import { useState, useEffect } from 'react'
import { 
  Code, 
  Terminal, 
  Database, 
  Cloud, 
  Settings, 
  Zap,
  GitBranch,
  Package,
  Play,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  Download,
  BookOpen,
  Wrench,
  Server,
  FileCode,
  Globe
} from 'lucide-react'

interface ToolSection {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  tools: Tool[]
}

interface Tool {
  name: string
  description: string
  status: 'active' | 'development' | 'planned'
  version?: string
  endpoint?: string
  documentation?: string
}

interface SystemStatus {
  environment: string
  version: string
  uptime: string
  health: number
  services: Array<{
    name: string
    status: 'healthy' | 'degraded' | 'down'
    version: string
    endpoint: string
  }>
}

export default function DeveloperTools() {
  const [activeTab, setActiveTab] = useState('overview')
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedText, setCopiedText] = useState('')

  useEffect(() => {
    const loadSystemStatus = async () => {
      try {
        // Fetch system status
        const statusResponse = await fetch('/api/oracle/status')
        const statusData = statusResponse.ok ? await statusResponse.json() : null

        // Mock system status based on the overview document
        const mockStatus: SystemStatus = {
          environment: 'Production',
          version: '2.1.0',
          uptime: statusData?.success ? `${statusData.data?.uptime || 99.99}%` : '99.99%',
          health: statusData?.success ? (statusData.data?.system?.system_health * 100 || 99.2) : 99.2,
          services: [
            {
              name: 'Oracle Manager API',
              status: 'healthy',
              version: '2.1.0',
              endpoint: 'http://localhost:3001'
            },
            {
              name: 'Main API Server',
              status: 'healthy', 
              version: '2.1.0',
              endpoint: 'http://localhost:4001'
            },
            {
              name: 'Hedera Network',
              status: 'healthy',
              version: 'testnet',
              endpoint: 'https://testnet.mirrornode.hedera.com'
            },
            {
              name: 'AI/ML Services',
              status: 'healthy',
              version: '1.5.0',
              endpoint: '/api/services/oracle'
            }
          ]
        }

        setSystemStatus(mockStatus)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load system status:', error)
        setIsLoading(false)
      }
    }

    loadSystemStatus()
  }, [])

  const developerSections: ToolSection[] = [
    {
      id: 'sdk',
      title: 'SDK & Libraries',
      description: 'Development kits and client libraries for integration',
      icon: Package,
      color: 'blue',
      tools: [
        {
          name: 'Hedera SDK',
          description: 'Official Hedera Hashgraph SDK for TypeScript/JavaScript',
          status: 'active',
          version: '2.67.0',
          documentation: 'https://docs.hedera.com/hedera/sdks-and-apis'
        },
        {
          name: '0G Compute SDK',
          description: 'AI/ML compute network integration for Llama models',
          status: 'active',
          version: '0.2.12',
          documentation: 'https://0g.ai/docs'
        },
        {
          name: 'Ethers.js',
          description: 'Ethereum wallet and contract interaction library',
          status: 'active',
          version: '6.11.1',
          documentation: 'https://docs.ethers.org'
        },
        {
          name: 'OpenAI API',
          description: 'GPT models for natural language processing',
          status: 'active',
          version: '4.28.0',
          documentation: 'https://platform.openai.com/docs'
        }
      ]
    },
    {
      id: 'apis',
      title: 'API Development',
      description: 'RESTful APIs and endpoint testing tools',
      icon: Globe,
      color: 'green',
      tools: [
        {
          name: 'Swagger UI',
          description: 'Interactive API documentation and testing interface',
          status: 'active',
          endpoint: '/docs',
          documentation: 'Built-in API explorer'
        },
        {
          name: 'Oracle Manager API',
          description: 'Enhanced oracle system with 10+ provider integrations',
          status: 'active',
          endpoint: '/api/oracle-manager',
          documentation: 'Enhanced oracle operations'
        },
        {
          name: 'Hedera Services API',
          description: 'HCS, HFS, and Mirror Node integration endpoints',
          status: 'active',
          endpoint: '/api/hcs',
          documentation: 'Blockchain service operations'
        },
        {
          name: 'Analytics API',
          description: 'Real-time network metrics and performance analytics',
          status: 'active',
          endpoint: '/api/analytics',
          documentation: 'Network monitoring and metrics'
        }
      ]
    },
    {
      id: 'blockchain',
      title: 'Blockchain Tools',
      description: 'Hedera network development and testing utilities',
      icon: Database,
      color: 'purple',
      tools: [
        {
          name: 'HCS Message Submitter',
          description: 'Submit messages to Hedera Consensus Service topics',
          status: 'active',
          endpoint: '/api/hcs/test-message',
          documentation: 'Consensus service testing'
        },
        {
          name: 'Smart Contract Deployer',
          description: 'Deploy and manage Solidity contracts on Hedera',
          status: 'active',
          endpoint: '/api/contracts/deploy',
          documentation: 'Contract deployment utilities'
        },
        {
          name: 'HashScan Integration',
          description: 'Blockchain explorer and transaction verification',
          status: 'active',
          endpoint: '/api/hashscan',
          documentation: 'Explorer integration tools'
        },
        {
          name: 'Mirror Node Client',
          description: 'Query Hedera Mirror Node for historical data',
          status: 'active',
          endpoint: '/api/services/hedera/transactions',
          documentation: 'Historical blockchain data'
        }
      ]
    },
    {
      id: 'testing',
      title: 'Testing & Debugging',
      description: 'Development testing tools and debugging utilities',
      icon: Wrench,
      color: 'yellow',
      tools: [
        {
          name: 'Health Check Monitor',
          description: 'System-wide service health monitoring',
          status: 'active',
          endpoint: '/api/oracle/health-check',
          documentation: 'Service monitoring'
        },
        {
          name: 'Provider Status Checker',
          description: 'Real-time oracle provider health and performance',
          status: 'active',
          endpoint: '/api/oracle/providers',
          documentation: 'Provider monitoring'
        },
        {
          name: 'Query Simulator',
          description: 'Test oracle queries with multiple providers',
          status: 'active',
          endpoint: '/api/oracle-manager/query',
          documentation: 'Query testing interface'
        },
        {
          name: 'Performance Profiler',
          description: 'API response time and performance analytics',
          status: 'development',
          documentation: 'Performance monitoring tools'
        }
      ]
    }
  ]

  const environmentConfig = {
    development: {
      HEDERA_ACCOUNT_ID: '0.0.YOUR_ACCOUNT_ID',
      HEDERA_PRIVATE_KEY: 'your_private_key_here',
      ETH_RPC_URL: 'https://ethereum-sepolia.publicnode.com',
      OPENAI_API_KEY: 'your_openai_api_key',
      FRONTEND_URL: 'http://localhost:3000'
    },
    production: {
      HEDERA_ACCOUNT_ID: '0.0.PRODUCTION_ACCOUNT',
      HEDERA_PRIVATE_KEY: 'production_private_key',
      ETH_RPC_URL: 'https://ethereum.publicnode.com',
      OPENAI_API_KEY: 'production_openai_key',
      FRONTEND_URL: 'https://negravis-frontend.vercel.app'
    }
  }

  const quickStartCommands = [
    'npm install @hashgraph/sdk ethers openai',
    'npm run dev',
    'npm run build',
    'npm run test',
    'npm start'
  ]

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(''), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'healthy':
        return 'text-green-400'
      case 'development':
      case 'degraded':
        return 'text-yellow-400'
      case 'planned':
      case 'down':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'development':
      case 'degraded':
        return <RefreshCw className="w-4 h-4 text-yellow-400" />
      case 'planned':
      case 'down':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />
    }
  }

  const getSectionColor = (color: string) => {
    const colors = {
      blue: 'from-blue-900/50 to-blue-800/30 border-blue-500/30',
      green: 'from-green-900/50 to-green-800/30 border-green-500/30',
      purple: 'from-purple-900/50 to-purple-800/30 border-purple-500/30',
      yellow: 'from-yellow-900/50 to-yellow-800/30 border-yellow-500/30'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading Developer Tools...</p>
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Developer Tools
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            SDK playground, API testing tools, and development utilities for building on the Negravis Oracle platform
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center space-x-1 mb-12">
          {['overview', 'sdk', 'apis', 'blockchain', 'testing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* System Status Overview */}
        {activeTab === 'overview' && systemStatus && (
          <div className="space-y-8">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl p-6 text-center">
                <Server className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{systemStatus.environment}</div>
                <div className="text-sm text-gray-400">Environment</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl p-6 text-center">
                <GitBranch className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">v{systemStatus.version}</div>
                <div className="text-sm text-gray-400">Version</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl p-6 text-center">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{systemStatus.uptime}</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{systemStatus.health.toFixed(1)}%</div>
                <div className="text-sm text-gray-400">Health</div>
              </div>
            </div>

            {/* Services Status */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-blue-400" />
                Service Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemStatus.services.map((service, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(service.status)}
                        <span className="font-semibold text-white">{service.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">v{service.version}</span>
                    </div>
                    <div className="text-sm text-gray-300">{service.endpoint}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Start */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Play className="w-6 h-6 mr-3 text-green-400" />
                Quick Start
              </h2>
              <div className="space-y-4">
                {quickStartCommands.map((command, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                    <code className="text-green-400 font-mono">{command}</code>
                    <button
                      onClick={() => copyToClipboard(command, `command-${index}`)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedText === `command-${index}` ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Environment Configuration */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FileCode className="w-6 h-6 mr-3 text-purple-400" />
                Environment Configuration
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(environmentConfig).map(([env, config]) => (
                  <div key={env} className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3 capitalize">{env}</h3>
                    <div className="space-y-2">
                      {Object.entries(config).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-gray-900 rounded p-2">
                          <span className="text-blue-400 font-mono text-sm">{key}</span>
                          <span className="text-gray-300 text-sm truncate ml-2">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tool Sections */}
        {activeTab !== 'overview' && (
          <div className="space-y-8">
            {developerSections
              .filter(section => activeTab === 'overview' || section.id === activeTab)
              .map((section) => {
                const Icon = section.icon
                return (
                  <div key={section.id} className={`bg-gradient-to-br ${getSectionColor(section.color)} backdrop-blur-sm border rounded-2xl p-8`}>
                    <div className="flex items-center mb-6">
                      <Icon className="w-8 h-8 text-white mr-4" />
                      <div>
                        <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                        <p className="text-gray-300">{section.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.tools.map((tool, index) => (
                        <div key={index} className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-white">{tool.name}</h3>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(tool.status)}
                              {tool.version && (
                                <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                                  v{tool.version}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-4">{tool.description}</p>
                          
                          <div className="flex items-center space-x-3">
                            {tool.endpoint && (
                              <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded font-mono">
                                {tool.endpoint}
                              </span>
                            )}
                            {tool.documentation && (
                              <button className="flex items-center text-xs text-gray-400 hover:text-white transition-colors">
                                <BookOpen className="w-3 h-3 mr-1" />
                                Docs
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>
        )}

        {/* Documentation Links */}
        <div className="mt-16 bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/docs" className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">
              <BookOpen className="w-5 h-5" />
              <span>API Documentation</span>
            </a>
            <a href="https://docs.hedera.com" target="_blank" className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors">
              <ExternalLink className="w-5 h-5" />
              <span>Hedera Docs</span>
            </a>
            <a href="https://github.com/oguzhaangumuss/Negravis-Frontend" target="_blank" className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors">
              <GitBranch className="w-5 h-5" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
