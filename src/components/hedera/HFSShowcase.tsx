'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Document {
  id: string
  name: string
  type: 'drivers_license' | 'passport' | 'national_id' | 'professional_license'
  status: 'verified' | 'pending' | 'expired'
  uploadDate: string
  fileId: string
  hash: string
  encrypted: boolean
}

export default function HFSShowcase() {
  const [activeFeature, setActiveFeature] = useState('storage')
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Driver License - John Doe',
      type: 'drivers_license',
      status: 'verified',
      uploadDate: '2024-01-15',
      fileId: '0.0.4629750',
      hash: 'sha256:a1b2c3d4e5f6...',
      encrypted: true
    },
    {
      id: '2', 
      name: 'Professional License - Jane Smith',
      type: 'professional_license',
      status: 'verified',
      uploadDate: '2024-01-12',
      fileId: '0.0.4629751',
      hash: 'sha256:f6e5d4c3b2a1...',
      encrypted: true
    },
    {
      id: '3',
      name: 'Passport - Mike Johnson', 
      type: 'passport',
      status: 'pending',
      uploadDate: '2024-01-10',
      fileId: '0.0.4629752',
      hash: 'sha256:b2a1c3d4e5f6...',
      encrypted: true
    }
  ])

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'drivers_license': return '🚗'
      case 'passport': return '🛂'
      case 'national_id': return '🆔'
      case 'professional_license': return '📜'
      default: return '📄'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-400 bg-green-900/30 border-green-500/50'
      case 'pending': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50'
      case 'expired': return 'text-red-400 bg-red-900/30 border-red-500/50'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/50'
    }
  }

  const features = [
    {
      id: 'storage',
      title: 'Secure Storage',
      icon: '🔐',
      description: 'AES-256 encrypted document storage with SHA-256 integrity verification'
    },
    {
      id: 'compliance',
      title: 'GDPR/HIPAA',
      icon: '🛡️',
      description: 'Built-in compliance with data portability and right to be forgotten'
    },
    {
      id: 'verification',
      title: 'Identity Verification',
      icon: '✅',
      description: 'DMV integration and AI-based document authenticity verification'
    },
    {
      id: 'audit',
      title: 'Audit Trail',
      icon: '📋',
      description: 'Complete access logging with immutable audit trails'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text text-sm font-semibold tracking-wider uppercase">
              Hedera File Service Integration
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Enterprise Document Storage
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              GDPR-compliant identity document management with AES-256 encryption, 
              SHA-256 integrity verification, and immutable file storage on Hedera&apos;s distributed ledger.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Feature Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`p-4 rounded-xl border transition-all ${
                    activeFeature === feature.id
                      ? 'border-purple-500 bg-purple-900/30'
                      : 'border-gray-700 bg-gray-800/50 hover:border-purple-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <div className="text-white font-semibold text-sm">{feature.title}</div>
                </button>
              ))}
            </div>

            {/* Feature Details */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              {activeFeature === 'storage' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    🔐 Secure Document Storage
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Documents are encrypted with AES-256 before storage on Hedera File Service, 
                    ensuring maximum security and privacy compliance.
                  </p>
                  
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-sm text-green-400 mb-2">Encryption Process:</div>
                    <pre className="text-xs text-gray-300 overflow-x-auto">
{`1. Document upload → AES-256 encryption
2. Generate SHA-256 hash for integrity
3. Store encrypted file on HFS
4. Record file metadata on HCS
5. Return File ID for retrieval`}
                    </pre>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-green-400 font-semibold">Encryption</div>
                      <div className="text-xs text-gray-400">AES-256-GCM</div>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-blue-400 font-semibold">Integrity</div>
                      <div className="text-xs text-gray-400">SHA-256 Hash</div>
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === 'compliance' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    🛡️ GDPR & HIPAA Compliance
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Built-in compliance features ensure your document management meets 
                    international data protection standards.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
                      <span className="text-green-400">✅ Right to be Forgotten</span>
                      <span className="text-xs text-gray-400">Article 17</span>
                    </div>
                    <div className="flex items-center justify-between bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
                      <span className="text-blue-400">✅ Data Portability</span>
                      <span className="text-xs text-gray-400">Article 20</span>
                    </div>
                    <div className="flex items-center justify-between bg-purple-900/20 border border-purple-500/30 p-3 rounded-lg">
                      <span className="text-purple-400">✅ Consent Management</span>
                      <span className="text-xs text-gray-400">Article 7</span>
                    </div>
                    <div className="flex items-center justify-between bg-orange-900/20 border border-orange-500/30 p-3 rounded-lg">
                      <span className="text-orange-400">✅ Access Audit Logs</span>
                      <span className="text-xs text-gray-400">Article 30</span>
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === 'verification' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    ✅ Identity Verification System
                  </h3>
                  <p className="text-gray-300 mb-4">
                    AI-powered document verification with DMV integration for 
                    authentic identity document validation.
                  </p>

                  <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/30 p-4 rounded-lg">
                    <div className="text-green-400 font-semibold mb-2">Verification Pipeline:</div>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>1. 🔍 Document type detection</div>
                      <div>2. 🤖 AI authenticity verification</div>
                      <div>3. 🏛️ DMV database cross-check</div>
                      <div>4. 📊 Confidence score calculation</div>
                      <div>5. ✅ Verification result + audit log</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">94%</div>
                      <div className="text-xs text-gray-400">Accuracy Rate</div>
                    </div>
                    <div className="text-center bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">2.3s</div>
                      <div className="text-xs text-gray-400">Avg Process Time</div>
                    </div>
                    <div className="text-center bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">4</div>
                      <div className="text-xs text-gray-400">Document Types</div>
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === 'audit' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    📋 Complete Audit Trail
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Every document access, modification, and verification logged 
                    immutably on Hedera for complete transparency.
                  </p>

                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-sm text-blue-400 mb-2">Recent Audit Events:</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-gray-300">
                        <span>Document verified: drivers_license_001</span>
                        <span className="text-green-400">2024-01-15 14:32:11</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Access granted: user@company.com</span>
                        <span className="text-blue-400">2024-01-15 14:31:45</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Document uploaded: passport_002</span>
                        <span className="text-purple-400">2024-01-15 14:30:12</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-yellow-400 font-semibold">Total Events</div>
                      <div className="text-2xl text-white">15,247</div>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-green-400 font-semibold">Retention</div>
                      <div className="text-2xl text-white">∞ Years</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Document Management Interface */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Document Vault</h3>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  + Upload Document
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-800/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getDocumentIcon(doc.type)}</span>
                        <div>
                          <div className="text-white font-semibold text-sm">{doc.name}</div>
                          <div className="text-xs text-gray-400">
                            Uploaded: {doc.uploadDate}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(doc.status)}`}>
                        {doc.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-black/30 p-2 rounded">
                        <span className="text-gray-400">File ID:</span>
                        <div className="text-blue-400 font-mono">{doc.fileId}</div>
                      </div>
                      <div className="bg-black/30 p-2 rounded">
                        <span className="text-gray-400">Hash:</span>
                        <div className="text-green-400 font-mono">{doc.hash.slice(0, 20)}...</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                      <div className="flex items-center text-xs text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        AES-256 Encrypted
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 text-xs">
                        View Details →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Storage Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">2.4 GB</div>
                <div className="text-xs text-gray-400">Total Storage</div>
              </div>
              <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">1,247</div>
                <div className="text-xs text-gray-400">Documents</div>
              </div>
              <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">100%</div>
                <div className="text-xs text-gray-400">Compliance</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}