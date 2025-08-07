import React from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onSearch: () => void
  loading: boolean
}

export default function SearchBar({ 
  searchQuery, 
  onSearchQueryChange, 
  onSearch, 
  loading 
}: SearchBarProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter Query ID or Transaction Hash..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={onSearch}
          disabled={loading || !searchQuery.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
      <div className="mt-3 text-sm text-gray-400">
        Enter a Query ID (e.g., bitcoin-price-123) or Transaction Hash to explore Oracle data
      </div>
    </div>
  )
}