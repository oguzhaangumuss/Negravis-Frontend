import React from 'react'
import { BarChart3, CheckCircle } from 'lucide-react'

interface DataSource {
  name: string;
  url: string;
  type: string;
  weight: number;
  confidence: number;
}

interface DataSourcesCardProps {
  dataSources: DataSource[]
}

export default function DataSourcesCard({ dataSources }: DataSourcesCardProps) {
  if (!dataSources || !Array.isArray(dataSources)) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Data Sources
        </h3>
        <p className="text-gray-400">No data sources available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-400" />
        Data Sources ({dataSources.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSources.map((source, index) => (
          <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="font-semibold">{source.name}</span>
              {source.type === 'blockchain' && (
                <span className="px-2 py-1 text-xs bg-blue-900 text-blue-300 rounded">
                  Blockchain
                </span>
              )}
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-400">Confidence: {source.confidence}%</p>
              <p className="text-gray-400">Weight: {source.weight}</p>
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                View Source →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}