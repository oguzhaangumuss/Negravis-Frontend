import React from 'react'
import { Shield, ExternalLink } from 'lucide-react'

interface BlockchainVerificationCardProps {
  blockchainHash: string
  blockchainLink: string
}

export default function BlockchainVerificationCard({ 
  blockchainHash, 
  blockchainLink 
}: BlockchainVerificationCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-green-400" />
        Blockchain Verification
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2 text-gray-300">Transaction Hash</h4>
          <p className="font-mono text-sm bg-gray-800 p-3 rounded-lg break-all">
            {blockchainHash}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold mb-2 text-gray-300">Hedera Explorer</h4>
            <p className="text-sm text-gray-400 mb-3">View on blockchain</p>
          </div>
          <a
            href={blockchainLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View
          </a>
        </div>
      </div>
    </div>
  )
}