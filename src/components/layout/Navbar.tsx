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

  useEffect(() => {
    // System status polling
    const fetchSystemStatus = async () => {
      try {
        const response = await fetch('/api/oracle/status')
        if (response.ok) {
          const data = await response.json()
          setSystemStatus({
            isLive: data.success,
            activeProviders: data.data?.active_count || 2,
            totalProviders: data.data?.total_count || 10
          })
        }
      } catch (error) {
        console.error('Failed to fetch system status:', error)
      }
    }

    fetchSystemStatus()
    const interval = setInterval(fetchSystemStatus, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-2xl">⚡</div>
              <div className="text-white font-bold text-xl">
                Negravis
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-white bg-gray-800' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
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
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                    isActive(item.href)
                      ? 'text-white bg-gray-800' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
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
            {/* System Status */}
            <div className="hidden md:flex items-center space-x-2">
              <Circle 
                className={`w-2 h-2 ${systemStatus.isLive ? 'text-green-400 fill-green-400' : 'text-red-400 fill-red-400'}`} 
              />
              <span className="text-sm text-gray-300 whitespace-nowrap">
                {systemStatus.isLive ? 'Live Data Stream' : 'Offline'}
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

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === '/'
                  ? 'text-white bg-gray-800'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
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
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium whitespace-nowrap">{item.name}</div>
                      <div className="text-sm text-gray-400 truncate">{item.description}</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          
          {/* Mobile System Status */}
          <div className="border-t border-gray-800 px-4 py-3">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Circle 
                  className={`w-2 h-2 ${systemStatus.isLive ? 'text-green-400 fill-green-400' : 'text-red-400 fill-red-400'}`} 
                />
                <span className="text-sm text-gray-300">
                  {systemStatus.isLive ? 'Live Data Stream' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}