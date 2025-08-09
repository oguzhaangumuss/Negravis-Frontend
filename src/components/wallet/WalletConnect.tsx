'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, 
  Power, 
  ChevronDown, 
  Copy, 
  ExternalLink, 
  CheckCircle,
  Loader2,
  Network
} from 'lucide-react'
import { useAccount, useDisconnect, useBalance, useSwitchChain } from 'wagmi'
import { hederaTestnet, hederaMainnet, getAppKit } from '../../config/wallet'

interface WalletConnectProps {
  variant?: 'navbar' | 'standalone'
  className?: string
}

export default function WalletConnect({ variant = 'navbar', className = '' }: WalletConnectProps) {
  const { address, isConnected, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChainAsync } = useSwitchChain()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Initialize AppKit on client side
  const openModal = () => {
    const appKit = getAppKit()
    if (appKit) {
      appKit.open()
    }
  }

  const activeNetwork = useMemo(() => {
    if (chainId === hederaMainnet.id) return 'mainnet' as const
    return 'testnet' as const
  }, [chainId])

  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
    chainId: chainId ?? hederaTestnet.id
  })

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const formattedBalance = useMemo(() => {
    if (!balanceData) return '-.-- HBAR'
    const num = Number(balanceData.formatted)
    if (Number.isNaN(num)) return '-.-- HBAR'
    if (num === 0) return '0.00 HBAR'
    if (num < 0.01) return '<0.01 HBAR'
    return `${num.toFixed(2)} ${balanceData.symbol}`
  }, [balanceData])

  const getExplorerUrl = (addr: string) => {
    const baseUrl = activeNetwork === 'mainnet' ? 'https://hashscan.io/mainnet' : 'https://hashscan.io/testnet'
    // HashScan supports EVM address lookups
    return `${baseUrl}/address/${addr}`
  }

  if (variant === 'navbar') {
    if (!isConnected) {
      return (
        <div className={className}>
          <button
            onClick={openModal}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </button>
        </div>
      )
    }

    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-300 rounded-full mr-3"></div>
            <div className="text-left">
              <div className="text-sm">{address ? formatAddress(address) : ''}</div>
              <div className="text-xs text-green-100">{isBalanceLoading ? '...' : formattedBalance}</div>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 ml-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-600 rounded-xl shadow-xl min-w-80 z-50"
            >
              <div className="p-4">
                {/* Account Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Address</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={copyAddress}
                        className="p-1 text-gray-400 hover:text-white transition-colors"

                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <a
                        href={address ? getExplorerUrl(address) : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-400 hover:text-white transition-colors"

                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <div className="text-white font-mono text-sm">{address}</div>
                </div>

                {/* Balance */}
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Balance</div>
                  <div className="text-white font-semibold">{isBalanceLoading ? '...' : formattedBalance}</div>
                </div>

                {/* Network Selector */}
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Network</div>
                  <div className="flex space-x-2">
                    <button
                      onClick={async () => {
                        if (chainId !== hederaTestnet.id) {
                          await switchChainAsync({ chainId: hederaTestnet.id })
                        }
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeNetwork === 'testnet'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Network className="w-4 h-4 inline mr-2" />
                      Testnet
                    </button>
                    <button
                      onClick={async () => {
                        if (chainId !== hederaMainnet.id) {
                          await switchChainAsync({ chainId: hederaMainnet.id })
                        }
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeNetwork === 'mainnet'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Network className="w-4 h-4 inline mr-2" />
                      Mainnet
                    </button>
                  </div>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={() => {
                    disconnect()
                    setIsDropdownOpen(false)
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                >
                  <Power className="w-4 h-4 mr-2" />
                  Disconnect
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click outside to close */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    )
  }

  // Standalone variant for dedicated wallet pages
  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="bg-gray-800 border border-gray-600 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 text-center">Hedera Wallet</h3>
        
        {!isConnected ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-300 mb-6">Connect your Hedera wallet to get started</p>
            <button
              onClick={openModal}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-green-400 font-medium">Connected</span>
            </div>

            {/* Account Details */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Address</label>
                <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                  <span className="text-white font-mono text-sm">{address}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyAddress}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={address ? getExplorerUrl(address) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Balance</label>
                <div className="bg-gray-900 rounded-lg p-3">
                  <span className="text-white font-semibold">{isBalanceLoading ? '...' : formattedBalance}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Network</label>
                <div className="flex space-x-2">
                  <button
                    onClick={async () => {
                      if (chainId !== hederaTestnet.id) {
                        await switchChainAsync({ chainId: hederaTestnet.id })
                      }
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeNetwork === 'testnet'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Testnet
                  </button>
                  <button
                    onClick={async () => {
                      if (chainId !== hederaMainnet.id) {
                        await switchChainAsync({ chainId: hederaMainnet.id })
                      }
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeNetwork === 'mainnet'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Mainnet
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => disconnect()}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 mt-6"
            >
              <Power className="w-4 h-4 mr-2" />
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
