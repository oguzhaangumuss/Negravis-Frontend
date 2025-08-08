'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AccountId, Client, PrivateKey } from '@hashgraph/sdk'

interface WalletState {
  isConnected: boolean
  accountId: string | null
  network: 'testnet' | 'mainnet'
  balance: string | null
  client: Client | null
}

interface WalletContextType {
  wallet: WalletState
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  getAccountBalance: () => Promise<string | null>
  switchNetwork: (network: 'testnet' | 'mainnet') => void
  isLoading: boolean
  error: string | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const STORAGE_KEYS = {
  CONNECTED: 'hedera_wallet_connected',
  ACCOUNT_ID: 'hedera_account_id',
  NETWORK: 'hedera_network'
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    accountId: null,
    network: 'testnet',
    balance: null,
    client: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize wallet state from localStorage
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const isConnected = localStorage.getItem(STORAGE_KEYS.CONNECTED) === 'true'
        const accountId = localStorage.getItem(STORAGE_KEYS.ACCOUNT_ID)
        const network = (localStorage.getItem(STORAGE_KEYS.NETWORK) as 'testnet' | 'mainnet') || 'testnet'

        if (isConnected && accountId) {
          const client = network === 'mainnet' 
            ? Client.forMainnet()
            : Client.forTestnet()

          setWallet({
            isConnected: true,
            accountId,
            network,
            balance: null,
            client
          })

          // Get initial balance
          await getAccountBalance()
        }
      } catch (error) {
        console.error('Failed to initialize wallet:', error)
        setError('Failed to initialize wallet connection')
      }
    }

    initializeWallet()
  }, [])

  const connectWallet = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if HashPack is available
      if (typeof window !== 'undefined' && (window as any).hashpack) {
        const hashconnect = (window as any).hashpack

        // Request account access
        const result = await hashconnect.connectToLocalWallet()
        
        if (result.success && result.accountIds && result.accountIds.length > 0) {
          const accountId = result.accountIds[0]
          const network = result.network === 'mainnet' ? 'mainnet' : 'testnet'

          const client = network === 'mainnet' 
            ? Client.forMainnet()
            : Client.forTestnet()

          setWallet({
            isConnected: true,
            accountId,
            network,
            balance: null,
            client
          })

          // Store connection state
          localStorage.setItem(STORAGE_KEYS.CONNECTED, 'true')
          localStorage.setItem(STORAGE_KEYS.ACCOUNT_ID, accountId)
          localStorage.setItem(STORAGE_KEYS.NETWORK, network)

          await getAccountBalance()
        } else {
          throw new Error('Failed to connect to HashPack wallet')
        }
      } else {
        // Fallback: Create a demo connection for development
        const demoAccountId = process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || '0.0.123456'
        const network = 'testnet'
        
        const client = Client.forTestnet()
        
        // If we have a private key in env, set up the operator
        if (process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY) {
          try {
            const privateKey = PrivateKey.fromString(process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY)
            client.setOperator(AccountId.fromString(demoAccountId), privateKey)
          } catch (error) {
            console.warn('Could not set operator from environment variables:', error)
          }
        }

        setWallet({
          isConnected: true,
          accountId: demoAccountId,
          network,
          balance: null,
          client
        })

        localStorage.setItem(STORAGE_KEYS.CONNECTED, 'true')
        localStorage.setItem(STORAGE_KEYS.ACCOUNT_ID, demoAccountId)
        localStorage.setItem(STORAGE_KEYS.NETWORK, network)

        await getAccountBalance()
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to connect wallet')
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      accountId: null,
      network: 'testnet',
      balance: null,
      client: null
    })

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.CONNECTED)
    localStorage.removeItem(STORAGE_KEYS.ACCOUNT_ID)
    localStorage.removeItem(STORAGE_KEYS.NETWORK)

    setError(null)
  }

  const getAccountBalance = async (): Promise<string | null> => {
    if (!wallet.client || !wallet.accountId) {
      return null
    }

    try {
      const accountId = AccountId.fromString(wallet.accountId)
      const accountBalance = await wallet.client.getAccountBalance(accountId)
      const balanceHbar = accountBalance.hbars.toString()
      
      setWallet(prev => ({ ...prev, balance: balanceHbar }))
      return balanceHbar
    } catch (error) {
      console.error('Failed to get account balance:', error)
      // Don't set error for balance fetch failures
      return null
    }
  }

  const switchNetwork = (network: 'testnet' | 'mainnet') => {
    const client = network === 'mainnet' 
      ? Client.forMainnet()
      : Client.forTestnet()

    setWallet(prev => ({ ...prev, network, client, balance: null }))
    localStorage.setItem(STORAGE_KEYS.NETWORK, network)

    // Refresh balance for new network
    if (wallet.isConnected) {
      getAccountBalance()
    }
  }

  const value: WalletContextType = {
    wallet,
    connectWallet,
    disconnectWallet,
    getAccountBalance,
    switchNetwork,
    isLoading,
    error
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
