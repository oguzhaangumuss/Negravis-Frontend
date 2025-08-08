'use client'

import { Suspense } from 'react'
import BlockchainVerification from '../../../components/oracle/BlockchainVerification'

export default function BlockchainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-white text-lg">Loading Blockchain Verification...</div>
          </div>
        </div>
      }>
        <BlockchainVerification />
      </Suspense>
    </div>
  )
}