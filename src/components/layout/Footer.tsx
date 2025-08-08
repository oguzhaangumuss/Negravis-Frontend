'use client'

import Link from 'next/link'
import { ExternalLink, Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">⚡</div>
              <div className="text-white font-bold text-xl">Negravis</div>
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              Enterprise-Grade Oracle Infrastructure Built on Hedera. 
              The only Oracle platform with complete Hedera service integration - HCS immutable logging, 
              HFS document storage, Smart Contracts & Mirror Node analytics.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Powered by</span>
              <Link 
                href="https://hedera.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 flex items-center space-x-1"
              >
                <span>Hedera Hashgraph</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/oracle-center" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Oracle Center
                </Link>
              </li>
              <li>
                <Link href="/hedera-hub" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Hedera Hub
                </Link>
              </li>
              <li>
                <Link href="/ai-ml-center" className="text-gray-400 hover:text-white text-sm transition-colors">
                  AI/ML Center
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Developers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/api-explorer" className="text-gray-400 hover:text-white text-sm transition-colors">
                  API Explorer
                </Link>
              </li>
              <li>
                <Link href="/developer-tools" className="text-gray-400 hover:text-white text-sm transition-colors">
                  SDK Playground
                </Link>
              </li>
              <li>
                <Link 
                  href="https://hashscan.io/testnet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center space-x-1"
                >
                  <span>HashScan Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link 
                  href="https://github.com/negravis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center space-x-1"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2025 NEGRAVIS. All rights reserved.
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link 
              href="https://github.com/negravis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link 
              href="https://twitter.com/negravis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link 
              href="https://linkedin.com/company/negravis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Frontend: Next.js 15 + React 19</span>
              <span>•</span>
              <span>Backend: Node.js + TypeScript</span>
              <span>•</span>
              <span>Blockchain: Hedera Network</span>
            </div>
            <div className="mt-2 md:mt-0">
              <span>Real-time Oracle Infrastructure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}