'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function SmartContractShowcase() {
  const [activeTab, setActiveTab] = useState('deployment')
  const [isExecuting, setIsExecuting] = useState(false)

  const executeContract = async () => {
    setIsExecuting(true)
    // Simulate contract execution
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsExecuting(false)
  }

  const contractCode = `// PriceFeed Oracle Contract
pragma solidity ^0.8.0;

contract PriceFeed {
    struct Price {
        uint256 value;
        uint256 timestamp;
        bool isValid;
        address[] providers;
    }
    
    mapping(string => Price) public prices;
    mapping(address => bool) public authorizedOracles;
    
    event PriceUpdated(
        string symbol,
        uint256 price,
        uint256 timestamp,
        uint256 confidence
    );
    
    function updatePrice(
        string memory symbol,
        uint256 price,
        address[] memory providers
    ) external onlyAuthorizedOracle {
        require(price > 0, "Invalid price");
        
        prices[symbol] = Price({
            value: price,
            timestamp: block.timestamp,
            isValid: true,
            providers: providers
        });
        
        emit PriceUpdated(symbol, price, block.timestamp, 98);
    }
}`

  const deploymentStats = [
    { label: 'Gas Used', value: '1,847,293', change: '-23%' },
    { label: 'Transaction Fee', value: '$0.001', change: '-95%' },
    { label: 'Deployment Time', value: '2.8s', change: '-87%' },
    { label: 'Contract Size', value: '12.4 KB', change: '+5%' }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text text-sm font-semibold tracking-wider uppercase">
              Hedera Smart Contract Service
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Oracle Contract Management
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Deploy, execute, and manage Oracle smart contracts on Hedera with 10,000+ TPS throughput 
              and $0.001 transaction fees - enabling profitable micro-oracle queries.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contract Interface */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Tab Navigation */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              {[
                { id: 'deployment', label: 'Deployment', icon: '🚀' },
                { id: 'execution', label: 'Execution', icon: '⚡' },
                { id: 'monitoring', label: 'Monitoring', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              {activeTab === 'deployment' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">🏗️ Automated Contract Deployment</h3>
                  <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400">
{`✅ Solidity compilation successful
✅ Bytecode optimized (23% gas reduction)  
✅ ABI generated automatically
✅ Contract deployed to: 0.0.1234567
✅ Verification completed
✅ Oracle authorization granted

Transaction ID: 0.0.1234567@1734567890.123456789
Gas Used: 1,847,293 (2M limit)
Cost: $0.001 HBAR`}
                    </pre>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {deploymentStats.map((stat) => (
                      <div key={stat.label} className="bg-gray-900/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                        <div className={`text-xs ${stat.change.startsWith('-') ? 'text-green-400' : 'text-blue-400'}`}>
                          {stat.change} vs Ethereum
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'execution' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">⚡ Contract Execution</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <label className="block text-sm text-gray-400 mb-2">Function</label>
                      <select className="w-full bg-black/30 border border-gray-600 rounded px-3 py-2 text-white">
                        <option>updatePrice(string, uint256, address[])</option>
                        <option>getPrice(string) view returns (uint256)</option>
                        <option>authorizeOracle(address)</option>
                        <option>validateConsensus(string, uint256[])</option>
                      </select>
                    </div>

                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <label className="block text-sm text-gray-400 mb-2">Parameters</label>
                      <textarea
                        className="w-full bg-black/30 border border-gray-600 rounded px-3 py-2 text-white h-24"
                        defaultValue={`symbol: "BTC"
price: 9425000 // $94,250 in wei
providers: ["0x...", "0x...", "0x..."]
confidence: 98`}
                      />
                    </div>

                    <button
                      onClick={executeContract}
                      disabled={isExecuting}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                    >
                      {isExecuting ? 'Executing Transaction...' : 'Execute Contract Function'}
                    </button>
                  </div>

                  {isExecuting && (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                        <span className="text-blue-400">Transaction in progress...</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Consensus Node: 0.0.3 | Estimated finality: 2.8s
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'monitoring' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">📊 Contract Analytics</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">2,847</div>
                      <div className="text-sm text-gray-400">Total Executions</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">$12.34</div>
                      <div className="text-sm text-gray-400">Total Gas Costs</div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white font-semibold">Recent Oracle Updates</span>
                      <span className="text-xs text-gray-400">Last 24h</span>
                    </div>
                    <div className="space-y-2">
                      {['BTC: $94,250 (+2.3%)', 'ETH: $3,681 (+1.8%)', 'SOL: $198 (+4.2%)'].map((update, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                          <span className="text-gray-300">{update}</span>
                          <span className="text-green-400 text-xs">✅ Verified</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Contract Code */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
              <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">PriceFeed.sol</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
                  <code>{contractCode}</code>
                </pre>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">🏆 Key Advantages</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  10,000+ TPS throughput capacity
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  $0.001 transaction fees (vs $10+ Ethereum)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Sub-3 second finality guaranteed
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  Multi-oracle consensus validation
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}