'use client'

import { ReactNode, useEffect } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config, getAppKit } from '../../config/wallet'

// Create a query client
const queryClient = new QueryClient()

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  // Initialize AppKit on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      getAppKit()
    }
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
