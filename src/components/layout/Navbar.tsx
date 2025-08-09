'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Database, 
  Activity, 
  Brain, 
  BarChart3, 
  Code, 
  FileText,
  Menu,
  X,
  Circle
} from 'lucide-react'
import dynamic from 'next/dynamic'

const WalletConnect = dynamic(() => import('../wallet/WalletConnect'), { ssr: false })

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const navigationItems: NavItem[] = [
  {
    name: 'Oracle Center',
    href: '/oracle-center',
    icon: Database,
    description: 'Multi-provider Oracle dashboard'
  },
  {
    name: 'Hedera Hub',
    href: '/hedera-hub',
    icon: Activity,
    description: 'Blockchain monitoring platform'
  },
  {
    name: 'AI/ML Center',
    href: '/ai-ml-center',
    icon: Brain,
    description: 'AI intelligence showcase'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Real-time insights'
  },
  {
    name: 'Developer Tools',
    href: '/developer-tools',
    icon: Code,
    description: 'SDK playground & tools'
  },
  {
    name: 'API Explorer',
    href: '/api-explorer',
    icon: FileText,
    description: '150+ endpoint documentation'
  }
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [systemStatus, setSystemStatus] = useState({
    isLive: true,
    activeProviders: 2,
    totalProviders: 10
  })
  const pathname = usePathname()

  // Removed automatic API polling for faster page loads
  // Status is now static for instant loading

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-black/95 border-b border-gray-800/50 sticky top-0 z-50 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Clean Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <div className="flex flex-col">
                <div className="text-white font-bold text-xl">
                  Negravis
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  ORACLE PLATFORM
                </div>
              </div>
            </Link>
          </div>

          {/* Compact Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-white bg-blue-600' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              Home
            </Link>
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                    isActive(item.href)
                      ? 'text-white bg-blue-600' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* System Status, Wallet & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Simple System Status */}
            <div className="hidden lg:flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${systemStatus.isLive ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-gray-300">
                {systemStatus.isLive ? 'Live' : 'Offline'}
              </span>
            </div>

            {/* Wallet */}
            <div className="hidden md:block">
              <WalletConnect variant="navbar" />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                pathname === '/'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                    isActive(item.href)
                      ? 'text-white bg-blue-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </div>
          
          {/* Mobile System Status & Wallet */}
          <div className="border-t border-gray-800 px-4 py-4 space-y-3">
            <div className="flex items-center justify-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${systemStatus.isLive ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-gray-300">
                {systemStatus.isLive ? 'Live' : 'Offline'}
              </span>
            </div>
            <div>
              <WalletConnect variant="navbar" />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}