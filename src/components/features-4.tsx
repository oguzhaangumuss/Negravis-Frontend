import { Database, Brain, Shield, Network, Zap, BarChart3 } from 'lucide-react'

export default function Features() {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-black via-gray-900 to-black text-white">
            <div className="mx-auto max-w-7xl space-y-12 md:space-y-20 px-4 sm:px-6 lg:px-8">
                <div className="relative z-10 mx-auto max-w-4xl space-y-6 text-center md:space-y-8">
                    <div className="mb-6">
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text text-sm font-semibold tracking-wider uppercase">
                            Core Infrastructure
                        </span>
                    </div>
                    <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text leading-tight">
                        Enterprise-Grade Oracle & AI Infrastructure
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                        Negravis delivers production-ready multi-source data aggregation with AI model integration, powered by Hedera Hashgraph blockchain technology.
                    </p>
                </div>

                <div className="relative mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        <div className="group bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:bg-gray-800/70">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                                    <Database className="size-6 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold">Multi-Source Oracle</h3>
                            </div>
                            <p className="text-gray-300 leading-relaxed">Chainlink, CoinGecko, Weather APIs with advanced consensus algorithms (Median, Weighted Average, Majority Vote)</p>
                        </div>
                        
                        <div className="group bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:bg-gray-800/70">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                                    <Brain className="size-6 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold">AI Integration</h3>
                            </div>
                            <p className="text-gray-300 leading-relaxed">llama-3.3-70b & deepseek-r1-70b models via 0G Compute Network with TEE verification</p>
                        </div>
                        
                        <div className="group bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-800/70">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                                    <Network className="size-6 text-green-400" />
                                </div>
                                <h3 className="text-xl font-semibold">Hedera Blockchain</h3>
                            </div>
                            <p className="text-gray-300 leading-relaxed">HCS real-time logging, HashScan explorer integration, and immutable data tracking</p>
                        </div>
                        
                        <div className="group bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-300 hover:bg-gray-800/70">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:bg-yellow-500/30 transition-colors">
                                    <Zap className="size-6 text-yellow-400" />
                                </div>
                                <h3 className="text-xl font-semibold">High Performance</h3>
                            </div>
                            <p className="text-gray-300 leading-relaxed">300ms average response time, 50+ concurrent queries, 85%+ cache hit rate</p>
                        </div>
                        
                        <div className="group bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300 hover:bg-gray-800/70">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-red-500/20 rounded-xl group-hover:bg-red-500/30 transition-colors">
                                    <Shield className="size-6 text-red-400" />
                                </div>
                                <h3 className="text-xl font-semibold">Production Ready</h3>
                            </div>
                            <p className="text-gray-300 leading-relaxed">90%+ test coverage, comprehensive error handling, enterprise-grade architecture</p>
                        </div>
                        
                        <div className="group bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:bg-gray-800/70">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-cyan-500/20 rounded-xl group-hover:bg-cyan-500/30 transition-colors">
                                    <BarChart3 className="size-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold">Analytics & Monitoring</h3>
                            </div>
                            <p className="text-gray-300 leading-relaxed">Real-time metrics, cost tracking, performance monitoring with Swagger/OpenAPI docs</p>
                        </div>
                    </div>
                </div>
                
                {/* Additional CTA section */}
                <div className="text-center pt-12 md:pt-16">
                    <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto backdrop-blur-sm">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
                        <p className="text-gray-300 mb-6 text-lg">Experience the power of enterprise-grade Oracle infrastructure on Hedera</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/oracle-center" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                                Start Building
                            </a>
                            <a href="/api-docs" className="border border-white/30 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/10 transition-all duration-300">
                                Explore API
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
