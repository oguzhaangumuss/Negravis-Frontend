'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Metric {
  label: string
  value: string
  change: string
  color: string
  icon: string
}

export default function TechnicalBenefits() {
  const [metrics] = useState<Metric[]>([
    {
      label: 'Network Finality',
      value: '2.8s',
      change: '-67% vs Ethereum',
      color: 'text-green-400',
      icon: '⚡'
    },
    {
      label: 'Energy Efficiency',
      value: '0.001 kWh',
      change: '-99.9% vs Bitcoin',
      color: 'text-emerald-400',
      icon: '🌱'
    },
    {
      label: 'Transaction Cost',
      value: '$0.0001',
      change: '-99.5% vs Ethereum',
      color: 'text-blue-400',
      icon: '💰'
    },
    {
      label: 'Throughput',
      value: '10,000 TPS',
      change: '+1400% vs Bitcoin',
      color: 'text-purple-400',
      icon: '🚀'
    }
  ])

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % metrics.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [metrics.length])

  const benefits = [
    {
      title: 'Byzantine Fault Tolerant Consensus',
      description: 'Asynchronous Byzantine Fault Tolerant (ABFT) consensus ensures security even with up to 1/3 malicious nodes',
      icon: '🛡️',
      details: [
        'Mathematically proven security',
        'No forks or rollbacks possible',
        'Instant finality guarantee',
        'Resilient to network partitions'
      ]
    },
    {
      title: 'Linear Scaling Architecture',
      description: 'Hashgraph consensus scales linearly with network size, increasing throughput as more nodes join',
      icon: '📈',
      details: [
        'Gossip protocol efficiency',
        'Virtual voting mechanism',
        'No bottlenecks or single points of failure',
        'Performance improves with scale'
      ]
    },
    {
      title: 'Carbon Negative Operations',
      description: 'Hedera is the most sustainable DLT platform, offsetting more carbon than it produces',
      icon: '🌍',
      details: [
        'Certified carbon negative',
        '250,000x more energy efficient than Bitcoin',
        'Sustainable consensus algorithm',
        'Environmental impact reporting'
      ]
    },
    {
      title: 'Enterprise-Grade Governance',
      description: 'Governed by the Hedera Governing Council of global enterprises ensuring stability and trust',
      icon: '🏛️',
      details: [
        'Google, IBM, Boeing governance',
        'Term limits prevent centralization',
        'Transparent decision making',
        'Regulatory compliance focus'
      ]
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text text-sm font-semibold tracking-wider uppercase">
            Technical Excellence
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Why Hedera Powers Enterprise Oracles
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built on the world&apos;s most advanced distributed ledger technology with 
            mathematically proven consensus and enterprise-grade performance.
          </p>
        </motion.div>

        {/* Real-time Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Live Network Performance</h3>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0.6, scale: 0.95 }}
                  animate={{ 
                    opacity: currentIndex === index ? 1 : 0.7,
                    scale: currentIndex === index ? 1 : 0.95
                  }}
                  transition={{ duration: 0.5 }}
                  className={`text-center p-6 bg-gray-800/50 rounded-xl border ${
                    currentIndex === index ? 'border-blue-500/50 bg-blue-900/20' : 'border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">{metric.icon}</div>
                  <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                    {metric.value}
                  </div>
                  <div className="text-gray-400 text-sm mb-1">{metric.label}</div>
                  <div className="text-xs text-gray-500">{metric.change}</div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <div className="flex space-x-2">
                {metrics.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentIndex === index ? 'bg-blue-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technical Benefits Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-8 hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-white">{benefit.title}</h3>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {benefit.description}
              </p>

              <ul className="space-y-2">
                {benefit.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-center text-gray-400">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Hedera vs. Traditional Blockchains
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-400">Metric</th>
                    <th className="text-center py-4 px-4 text-green-400">Hedera</th>
                    <th className="text-center py-4 px-4 text-gray-500">Ethereum</th>
                    <th className="text-center py-4 px-4 text-gray-500">Bitcoin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700/50">
                    <td className="py-4 px-4 text-gray-300">Throughput</td>
                    <td className="py-4 px-4 text-center text-green-400 font-bold">10,000 TPS</td>
                    <td className="py-4 px-4 text-center text-gray-500">15 TPS</td>
                    <td className="py-4 px-4 text-center text-gray-500">7 TPS</td>
                  </tr>
                  <tr className="border-b border-gray-700/50">
                    <td className="py-4 px-4 text-gray-300">Finality</td>
                    <td className="py-4 px-4 text-center text-green-400 font-bold">3 seconds</td>
                    <td className="py-4 px-4 text-center text-gray-500">13+ minutes</td>
                    <td className="py-4 px-4 text-center text-gray-500">60+ minutes</td>
                  </tr>
                  <tr className="border-b border-gray-700/50">
                    <td className="py-4 px-4 text-gray-300">Energy per Tx</td>
                    <td className="py-4 px-4 text-center text-green-400 font-bold">0.001 kWh</td>
                    <td className="py-4 px-4 text-center text-gray-500">62.5 kWh</td>
                    <td className="py-4 px-4 text-center text-gray-500">700+ kWh</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-300">Avg Fee</td>
                    <td className="py-4 px-4 text-center text-green-400 font-bold">$0.0001</td>
                    <td className="py-4 px-4 text-center text-gray-500">$15-50</td>
                    <td className="py-4 px-4 text-center text-gray-500">$5-20</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Security & Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid md:grid-cols-2 gap-8"
        >
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              🔒 Security & Audits
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                aBFT consensus mathematically proven
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Multiple security audits completed
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                No smart contract vulnerabilities
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Enterprise-grade key management
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              ✅ Compliance Ready
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                GDPR & HIPAA compatible
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                SOC 2 Type II certification
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Enterprise governance model
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Regulatory reporting tools
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}