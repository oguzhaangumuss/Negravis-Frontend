import React from 'react'
import { Hash, CheckCircle, ExternalLink } from 'lucide-react'
import { HashscanTransactionResult } from '../../services/oracleApi'

interface TransactionDetailsCardProps {
  transactionResult: HashscanTransactionResult
}

export default function TransactionDetailsCard({ transactionResult }: TransactionDetailsCardProps) {
  const formatTimestamp = (timestamp: string | number) => {
    const date = new Date(typeof timestamp === 'number' ? timestamp : timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Hash className="w-6 h-6 text-green-400" />
        Transaction Details
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2 text-gray-300">Transaction ID</h3>
          <p className="font-mono text-sm bg-gray-800 p-3 rounded-lg break-all mb-4">
            {transactionResult.id}
          </p>
          
          <h3 className="font-semibold mb-2 text-gray-300">Status</h3>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold">
              {transactionResult.status}
            </span>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2 text-gray-300">Timestamp</h3>
          <p className="mb-4">{formatTimestamp(transactionResult.timestamp)}</p>
          
          <h3 className="font-semibold mb-2 text-gray-300">Network</h3>
          <p className="text-blue-400 mb-4">{transactionResult.network}</p>
          
          <a
            href={transactionResult.explorer_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors inline-flex"
          >
            <ExternalLink className="w-4 h-4" />
            View on Explorer
          </a>
        </div>
      </div>
      
      {transactionResult.details && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-gray-300">Payload</h3>
          <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(transactionResult.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}