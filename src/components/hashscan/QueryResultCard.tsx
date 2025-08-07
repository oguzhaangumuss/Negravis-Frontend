import React from 'react'
import { Database, Clock, Activity, TrendingUp } from 'lucide-react'
import { HashscanQueryResult } from '../../services/oracleApi'

interface QueryResultCardProps {
  queryResult: HashscanQueryResult
}

export default function QueryResultCard({ queryResult }: QueryResultCardProps) {
  const formatTimestamp = (timestamp: string | number) => {
    const date = new Date(typeof timestamp === 'number' ? timestamp : timestamp)
    return date.toLocaleString()
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400'
    if (confidence >= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-400/20'
    if (confidence >= 0.6) return 'bg-yellow-400/20'
    return 'bg-red-400/20'
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6 text-blue-400" />
          Query Result
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceBg(queryResult.confidence)} ${getConfidenceColor(queryResult.confidence)}`}>
          {Math.round(queryResult.confidence * 100)}% Confidence
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2 text-gray-300">Query</h3>
          <p className="text-lg mb-4">{queryResult.query}</p>
          
          <h3 className="font-semibold mb-2 text-gray-300">Answer</h3>
          <p className="text-xl font-bold text-green-400 mb-4">{queryResult.answer}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              {formatTimestamp(queryResult.timestamp)}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              Query ID: {queryResult.query_id}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              Oracle: {queryResult.oracle_used}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}