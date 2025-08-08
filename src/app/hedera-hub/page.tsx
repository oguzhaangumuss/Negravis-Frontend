'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Database, 
  FileText, 
  Shield, 
  Network, 
  BarChart3,
  Clock,
  Lock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ExternalLink,
  Copy,
  Eye,
  Zap,
  Globe
} from 'lucide-react'

interface HederaStats {
  hcsMessages: number
  hfsDocuments: number
  networkTPS: number
  uptime: string
  lastUpdate: string
}

interface TopicInfo {
  id: string
  name: string
  description: string
  messageCount: number
  status: 'active' | 'inactive'
  color: string
}

export default function HederaHubPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [stats, setStats] = useState<HederaStats>({
    hcsMessages: 15247,
    hfsDocuments: 2847,
    networkTPS: 10000,
    uptime: '99.99%',
    lastUpdate: new Date().toISOString()
  })

  const sections = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'hcs', name: 'HCS Logging', icon: Database },
    { id: 'hfs', name: 'File Storage', icon: FileText },
    { id: 'mirror', name: 'Analytics', icon: TrendingUp },
    { id: 'hashscan', name: 'Explorer', icon: Globe },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  const topicStructure: TopicInfo[] = [
    {
      id: '0.0.6503587',
      name: 'Oracle Queries',
      description: 'AI/Oracle query operations',
      messageCount: 4821,
      status: 'active',
      color: 'blue'
    },
    {
      id: '0.0.6503588',
      name: 'Compute Operations',
      description: 'Computational tasks',
      messageCount: 3672,
      status: 'active',
      color: 'green'
    },
    {
      id: '0.0.6503589',
      name: 'Account Operations',
      description: 'Balance/transaction changes',
      messageCount: 5419,
      status: 'active',
      color: 'purple'
    },
    {
      id: '0.0.6503590',
      name: 'System Metrics',
      description: 'Performance monitoring',
      messageCount: 1335,
      status: 'active',
      color: 'orange'
    }
  ]

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Architecture Diagram */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Hedera Integration Architecture</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6 text-center">
            <Database className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">HCS Logging</h4>
            <p className="text-gray-300 text-sm">Immutable audit trails with 4-topic architecture</p>
            <div className="mt-4 flex items-center justify-center text-blue-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Active</span>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-green-500/30 rounded-xl p-6 text-center">
            <FileText className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">HFS Storage</h4>
            <p className="text-gray-300 text-sm">Encrypted document storage with GDPR compliance</p>
            <div className="mt-4 flex items-center justify-center text-green-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Active</span>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-6 text-center">
            <BarChart3 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Mirror Node</h4>
            <p className="text-gray-300 text-sm">Real-time analytics and network monitoring</p>
            <div className="mt-4 flex items-center justify-center text-purple-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-all duration-300 group">
          <div className="text-3xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">
            {stats.hcsMessages.toLocaleString()}
          </div>
          <div className="text-gray-300 text-sm">HCS Messages</div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center hover:border-green-500/50 transition-all duration-300 group">
          <div className="text-3xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">
            {stats.hfsDocuments.toLocaleString()}
          </div>
          <div className="text-gray-300 text-sm">HFS Documents</div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all duration-300 group">
          <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">
            {stats.networkTPS.toLocaleString()}+
          </div>
          <div className="text-gray-300 text-sm">Network TPS</div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center hover:border-orange-500/50 transition-all duration-300 group">
          <div className="text-3xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform">
            {stats.uptime}
          </div>
          <div className="text-gray-300 text-sm">Network Uptime</div>
        </div>
      </div>
    </motion.div>
  )

  const renderHCS = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Hedera Consensus Service (HCS)</h3>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Complete immutable logging system with multi-topic architecture for Oracle operations, 
          computational tasks, account management, and system monitoring.
        </p>

        {/* Topic Structure */}
        <div className="grid md:grid-cols-2 gap-6">
          {topicStructure.map((topic) => (
            <div key={topic.id} className={`bg-gray-900/50 border border-${topic.color}-500/30 rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">{topic.name}</h4>
                <div className={`w-3 h-3 bg-${topic.color}-500 rounded-full animate-pulse`}></div>
              </div>
              <p className="text-gray-300 text-sm mb-4">{topic.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Topic ID:</span>
                <span className={`text-sm text-${topic.color}-400 font-mono`}>{topic.id}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">Messages:</span>
                <span className="text-sm text-white">{topic.messageCount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* HCS Features */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-xl p-6">
          <h4 className="text-xl font-bold text-white mb-4">Advanced Features</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-blue-400 mr-3" />
              <span className="text-gray-300">Real-time Message Streaming</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-400 mr-3" />
              <span className="text-gray-300">Byzantine Fault Tolerance</span>
            </div>
            <div className="flex items-center">
              <Database className="w-5 h-5 text-purple-400 mr-3" />
              <span className="text-gray-300">Batch Processing (10+ entries)</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-orange-400 mr-3" />
              <span className="text-gray-300">Sub-3s Finality</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderHFS = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Hedera File Service (HFS)</h3>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Enterprise-grade encrypted document storage with GDPR/HIPAA compliance, 
          supporting identity verification documents and regulatory compliance.
        </p>

        {/* Document Types */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6 text-center">
            <FileText className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">Driver's Licenses</h4>
            <p className="text-gray-300 text-sm">DMV verification</p>
          </div>
          <div className="bg-gray-900/50 border border-green-500/30 rounded-xl p-6 text-center">
            <Globe className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">Passports</h4>
            <p className="text-gray-300 text-sm">International identity</p>
          </div>
          <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-6 text-center">
            <Shield className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">Professional Licenses</h4>
            <p className="text-gray-300 text-sm">Certification docs</p>
          </div>
          <div className="bg-gray-900/50 border border-orange-500/30 rounded-xl p-6 text-center">
            <Activity className="w-10 h-10 text-orange-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">Health Records</h4>
            <p className="text-gray-300 text-sm">HIPAA compliant</p>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/30 rounded-xl p-6">
          <h4 className="text-xl font-bold text-white mb-4">Security & Compliance</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Encryption</h5>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                  <Lock className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">AES-256-CBC Encryption</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-sm">SHA-256 Integrity Verification</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Eye className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-sm">Access Audit Logging</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Compliance</h5>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">GDPR Article 17 (Right to be Forgotten)</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-sm">GDPR Article 20 (Data Portability)</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-sm">HIPAA Compliance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderMirrorNode = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Mirror Node Analytics</h3>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Real-time network analytics with advanced performance monitoring, 
          transaction volume analysis, and intelligent caching for optimal performance.
        </p>

        {/* Analytics Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6">
            <BarChart3 className="w-10 h-10 text-blue-400 mb-4" />
            <h4 className="text-white font-semibold mb-2">Network Health</h4>
            <p className="text-gray-300 text-sm mb-4">Real-time node monitoring with composite health scoring</p>
            <div className="text-2xl font-bold text-blue-400">98.7%</div>
            <div className="text-xs text-gray-400">Current Health Score</div>
          </div>
          
          <div className="bg-gray-900/50 border border-green-500/30 rounded-xl p-6">
            <TrendingUp className="w-10 h-10 text-green-400 mb-4" />
            <h4 className="text-white font-semibold mb-2">Transaction Volume</h4>
            <p className="text-gray-300 text-sm mb-4">Dynamic TPS calculation with peak detection</p>
            <div className="text-2xl font-bold text-green-400">8,347</div>
            <div className="text-xs text-gray-400">TPS (24h avg)</div>
          </div>
          
          <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-6">
            <Activity className="w-10 h-10 text-purple-400 mb-4" />
            <h4 className="text-white font-semibold mb-2">Account Growth</h4>
            <p className="text-gray-300 text-sm mb-4">Account creation and activity metrics</p>
            <div className="text-2xl font-bold text-purple-400">+12.3%</div>
            <div className="text-xs text-gray-400">Monthly Growth</div>
          </div>
        </div>

        {/* Performance Optimizations */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-xl p-6">
          <h4 className="text-xl font-bold text-white mb-4">Performance Optimizations</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-400 mr-3" />
              <span className="text-gray-300">60-second TTL Intelligent Caching</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-400 mr-3" />
              <span className="text-gray-300">50 req/s Rate Limiting Compliance</span>
            </div>
            <div className="flex items-center">
              <Database className="w-5 h-5 text-purple-400 mr-3" />
              <span className="text-gray-300">Batch Processing Engine</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-orange-400 mr-3" />
              <span className="text-gray-300">10-second Timeout Management</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderHashScan = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">HashScan Explorer Integration</h3>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Universal blockchain explorer integration with transaction verification, 
          status monitoring, and embedded widget support for comprehensive blockchain transparency.
        </p>

        {/* Explorer Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6">
            <Globe className="w-10 h-10 text-blue-400 mb-4" />
            <h4 className="text-white font-semibold mb-3">Universal Explorer</h4>
            <p className="text-gray-300 text-sm mb-4">Multi-entity URL generation for transactions, accounts, topics, and contracts</p>
            <div className="bg-black/30 rounded p-2">
              <code className="text-green-400 text-xs">hashscan.io/testnet/transaction/</code>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-green-500/30 rounded-xl p-6">
            <Activity className="w-10 h-10 text-green-400 mb-4" />
            <h4 className="text-white font-semibold mb-3">Status Monitoring</h4>
            <p className="text-gray-300 text-sm mb-4">Real-time transaction status with visual indicators and bulk operations</p>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Success</span>
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-400">Pending</span>
            </div>
          </div>
        </div>

        {/* Integration Features */}
        <div className="bg-gradient-to-r from-blue-900/50 to-green-900/50 border border-blue-500/30 rounded-xl p-6">
          <h4 className="text-xl font-bold text-white mb-4">Integration Features</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Transaction Management</h5>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Multi-Transaction Status Verification</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Clock className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-sm">History Formatting & Display</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-sm">Error Recovery & Graceful Handling</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Visual Features</h5>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                  <Eye className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Status Badges with Color Coding</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <ExternalLink className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-sm">Embedded Widget Generation</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Copy className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-sm">One-Click Transaction Links</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderSecurity = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Security & Compliance</h3>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Multi-layer security architecture with comprehensive encryption, audit trails, 
          and enterprise-grade compliance features for GDPR and HIPAA requirements.
        </p>

        {/* Security Layers */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-red-500/30 rounded-xl p-6">
            <Lock className="w-10 h-10 text-red-400 mb-4" />
            <h4 className="text-white font-semibold mb-3">Encryption & Keys</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Multi-format key support (ECDSA, ED25519, DER)</li>
              <li>• AES-256-CBC document encryption</li>
              <li>• PBKDF2 key derivation</li>
              <li>• SHA-256 hash algorithms</li>
            </ul>
          </div>
          
          <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6">
            <Shield className="w-10 h-10 text-blue-400 mb-4" />
            <h4 className="text-white font-semibold mb-3">Access Control</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Public key authentication</li>
              <li>• Multi-factor authentication</li>
              <li>• Session management</li>
              <li>• Role-based permissions</li>
            </ul>
          </div>
          
          <div className="bg-gray-900/50 border border-green-500/30 rounded-xl p-6">
            <Eye className="w-10 h-10 text-green-400 mb-4" />
            <h4 className="text-white font-semibold mb-3">Audit Trail</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Complete file access logging</li>
              <li>• IP address & user agent tracking</li>
              <li>• Operation timestamps</li>
              <li>• 7-year retention compliance</li>
            </ul>
          </div>
        </div>

        {/* Compliance Standards */}
        <div className="bg-gradient-to-r from-red-900/50 to-blue-900/50 border border-red-500/30 rounded-xl p-6">
          <h4 className="text-xl font-bold text-white mb-4">Compliance Standards</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">GDPR Compliance</h5>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Article 17 - Right to be Forgotten</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-sm">Article 20 - Data Portability</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-sm">Consent Management</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">HIPAA Compliance</h5>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Encrypted Health Document Storage</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-sm">Access Control & Audit Logging</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-sm">Breach Notification System</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview()
      case 'hcs':
        return renderHCS()
      case 'hfs':
        return renderHFS()
      case 'mirror':
        return renderMirrorNode()
      case 'hashscan':
        return renderHashScan()
      case 'security':
        return renderSecurity()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text text-sm font-semibold tracking-wider uppercase">
                Hedera Blockchain Integration
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text leading-tight">
              Enterprise-Grade Hedera Hub
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Comprehensive suite of Hedera blockchain services providing immutable logging, 
              real-time analytics, secure file storage, and enterprise-grade compliance features.
            </p>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-800">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {section.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-96">
          {renderContent()}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/hashscan"
              className="flex items-center justify-center bg-gray-800/50 border border-gray-600 rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <Globe className="w-5 h-5 text-blue-400 mr-3 group-hover:scale-110 transition-transform" />
              <span className="text-white font-semibold">HashScan Explorer</span>
            </a>
            <a
              href="/oracle-center/blockchain"
              className="flex items-center justify-center bg-gray-800/50 border border-gray-600 rounded-xl p-4 hover:border-green-500/50 transition-all duration-300 group"
            >
              <Database className="w-5 h-5 text-green-400 mr-3 group-hover:scale-110 transition-transform" />
              <span className="text-white font-semibold">HCS Verification</span>
            </a>
            <a
              href="/analytics"
              className="flex items-center justify-center bg-gray-800/50 border border-gray-600 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <BarChart3 className="w-5 h-5 text-purple-400 mr-3 group-hover:scale-110 transition-transform" />
              <span className="text-white font-semibold">Network Analytics</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
