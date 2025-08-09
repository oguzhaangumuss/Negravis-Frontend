'use client'

import { useState, useRef, useEffect } from 'react'
import { Merriweather } from 'next/font/google'
import { Send, Bot, User, Zap, BarChart3, Cloud, Coins, Activity, AlertCircle, CheckCircle, Loader2, ExternalLink, Search } from 'lucide-react'
import { oracleApi } from '../services/oracleApi'
import { useOracleApi } from '../hooks/useOracleApi'

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather'
})

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const perspectiveOracles = [
  // Premium Oracles
  { 
    id: 'chainlink', 
    name: 'Chainlink', 
    icon: Activity, 
    color: 'text-blue-400',
    providers: ['chainlink'],
    perspective: 'Enterprise Oracle',
    context: 'Decentralized oracle network with proven reliability',
    description: 'Crypto prices, Market data, Enterprise - 95% reliability'
  },
  
  // Free Oracles
  { 
    id: 'coingecko', 
    name: 'CoinGecko', 
    icon: Coins, 
    color: 'text-yellow-400',
    providers: ['coingecko'],
    perspective: 'Crypto Market Data',
    context: 'Comprehensive cryptocurrency data and market info',
    description: 'Crypto prices, Market cap, Trading volume - 90% reliability'
  },
  { 
    id: 'dia', 
    name: 'DIA Oracle', 
    icon: BarChart3, 
    color: 'text-cyan-400',
    providers: ['dia'],
    perspective: 'Transparent Crypto Data',
    context: 'Transparent, customizable crypto price feeds',
    description: '3000+ tokens, Transparent data, DeFi - 91% reliability'
  },
  { 
    id: 'weather', 
    name: 'Weather Oracle', 
    icon: Cloud, 
    color: 'text-green-400',
    providers: ['weather'],
    perspective: 'Weather Data',
    context: 'Real-time weather data and forecasts',
    description: 'Weather forecasts, Climate data, Location - 89% reliability'
  },
  { 
    id: 'exchangerate', 
    name: 'Exchange Rate', 
    icon: Activity, 
    color: 'text-orange-400',
    providers: ['exchangerate'],
    perspective: 'Currency Exchange',
    context: 'Foreign exchange rates and currency conversion',
    description: 'Forex rates, Currency conversion, Financial - 90% reliability'
  },
  { 
    id: 'sports', 
    name: 'Sports Oracle', 
    icon: Activity, 
    color: 'text-purple-400',
    providers: ['sports'],
    perspective: 'Sports Data',
    context: 'NBA, Football, Soccer and global sports data',
    description: 'NBA stats, Team info, Player data, Leagues - 92% reliability'
  },
  
  // Official Oracles  
  { 
    id: 'nasa', 
    name: 'NASA', 
    icon: Zap, 
    color: 'text-red-400',
    providers: ['nasa'],
    perspective: 'Space & Astronomy',
    context: 'Space, astronomy, and Earth observation data',
    description: 'Astronomy, Space weather, Earth data - 92% reliability'
  },
  
  // Community Oracles
  { 
    id: 'wikipedia', 
    name: 'Wikipedia', 
    icon: Bot, 
    color: 'text-indigo-400',
    providers: ['wikipedia'],
    perspective: 'Knowledge Base',
    context: 'Global knowledge base and information encyclopedia',
    description: 'Knowledge, Information, Education - 88% reliability'
  },
  
]

// Keep old services array for backward compatibility
const services = perspectiveOracles

export default function OracleAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to Negravis Oracle System!\n\n**Available Oracle Agents (8 Total):**\n\n**Premium:**\n**Chainlink** - Enterprise oracle network (95% reliability)\n\n**Standard:**\n**CoinGecko** - Crypto market data (90% reliability)\n**DIA Oracle** - 3000+ transparent token feeds (91% reliability)\n**Weather Oracle** - Global forecasts and climate (89% reliability)\n**Exchange Rate** - Forex and currency conversion (90% reliability)\n**Sports Oracle** - NBA and global sports data (92% reliability)\n\n**Official:**\n**NASA** - Space, astronomy, Earth data (92% reliability)\n\n**Community:**\n**Wikipedia** - Knowledge encyclopedia (88% reliability)\n\n**How to start:**\n1. Select your preferred Oracle from the dropdown above\n2. Click "Launch Agent"\n3. Ask questions - responses include blockchain verification!\n\nAll responses are logged on Hedera blockchain with hash & explorer links.',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [selectedService, setSelectedService] = useState('oracle')
  const [isLoading, setIsLoading] = useState(false)
  const [isAgentLaunched, setIsAgentLaunched] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const {
    queryState,
    priceState,
    weatherState,
    statusState,
    getSystemStatus,
    clearErrors,
    resetStates
  } = useOracleApi()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Clear errors when switching services
  useEffect(() => {
    clearErrors()
  }, [selectedService, clearErrors])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    const currentInput = inputValue
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // CRITICAL: Clear all states before each request to prevent response caching/mixing
    clearErrors()
    resetStates()

    try {
      // Call real API with unique message tracking
      const response = await generateResponse(currentInput, selectedService)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error: unknown) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `❌ Error: ${error instanceof Error ? error.message : 'Failed to process request'}`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }


  const formatPriceDataByPerspective = (data: Record<string, unknown>, perspective?: string): string => {
    const result = data.result as Record<string, unknown>;
    const symbol = result.symbol as string;
    const price = result.price as number;
    const confidence = (data.confidence as number * 100).toFixed(1);
    const sources = (data.sources as string[]).join(', ');

    switch (perspective) {
      case 'coingecko-oracle':
        return `💰 **${symbol} Financial Analysis**\n\n` +
               `💵 **Current Price:** $${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}\n` +
               `📊 **Data Confidence:** ${confidence}% (${sources})\n` +
               (result.market_cap ? `📈 **Market Cap:** $${(result.market_cap as number).toLocaleString()}\n` : '') +
               (result.volume_24h ? `💹 **24h Volume:** $${(result.volume_24h as number).toLocaleString()}\n` : '') +
               (result.change_24h ? `${(result.change_24h as number) >= 0 ? '🟢' : '🔴'} **24h Change:** ${(result.change_24h as number).toFixed(2)}%\n` : '') +
               `\n🦎 **CoinGecko Data:** Real-time cryptocurrency market data from CoinGecko API.`;
      
      case 'web-search-oracle':
        return `📊 **${symbol} Market Intelligence**\n\n` +
               `🎯 **Price Signal:** $${price.toLocaleString()}\n` +
               `🧠 **Intelligence Grade:** ${confidence}% confidence\n` +
               `🔍 **Data Sources:** ${sources}\n` +
               (result.change_24h ? `📈 **Momentum:** ${(result.change_24h as number) >= 0 ? 'Bullish' : 'Bearish'} (${(result.change_24h as number).toFixed(2)}%)\n` : '') +
               `\n🔮 **Market Intelligence:** Real-time price discovery through consensus algorithms.`;
      
      default:
        return `💰 **${symbol} Price: $${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}**\n` +
               `📊 Confidence: ${confidence}%\n🔗 Sources: ${sources}` +
               (result.market_cap ? `\n📈 Market Cap: $${(result.market_cap as number).toLocaleString()}` : '') +
               (result.volume_24h ? `\n📊 24h Volume: $${(result.volume_24h as number).toLocaleString()}` : '') +
               (result.change_24h ? `\n${(result.change_24h as number) >= 0 ? '📈' : '📉'} 24h Change: ${(result.change_24h as number).toFixed(2)}%` : '');
    }
  };

  // System info formatting removed - no longer needed

  const formatWeatherDataByPerspective = (data: Record<string, unknown>, perspective?: string): string => {
    const result = data.result as Record<string, unknown>;
    
    switch (perspective) {
      case 'weather-oracle':
        return `🌍 **Environmental Analysis**\n\n` +
               `📍 **Location:** ${result.location || 'Unknown'}\n` +
               `🌡️ **Temperature:** ${result.temperature || 'N/A'}°C\n` +
               `💧 **Humidity:** ${result.humidity || 'N/A'}%\n` +
               `🌬️ **Wind Conditions:** ${result.wind_speed || 'N/A'} m/s\n` +
               `☁️ **Sky Conditions:** ${result.weather_description || 'N/A'}\n\n` +
               `🌿 **Environmental Perspective:** Real-time atmospheric monitoring for environmental assessment.`;
      
      default:
        return `🌤️ **Weather Data:** ${JSON.stringify(result)}`;
    }
  };

  const formatFallbackByPerspective = (data: Record<string, unknown>, perspective?: string): string => {
    const confidence = (data.confidence as number * 100).toFixed(1);
    const sources = (data.sources as string[]).join(', ');
    
    switch (perspective) {
      case 'web-search-oracle':
        return `🔍 **Web Search:** ${JSON.stringify(data.result)}\n📊 **Confidence:** ${confidence}% 🔗 **Sources:** ${sources}`;
      case 'weather-oracle':
        return `🌤️ **Weather Data:** ${JSON.stringify(data.result)}\n📊 **Accuracy:** ${confidence}% 🌿 **Sources:** ${sources}`;
      case 'coingecko-oracle':
        return `🦎 **CoinGecko:** ${JSON.stringify(data.result)}\n📊 **Confidence:** ${confidence}% 🔗 **Sources:** ${sources}`;
      case 'chat-oracle':
        return `💬 **Chat:** ${JSON.stringify(data.result)}\n📊 **Response:** ${confidence}% 🤖 **Sources:** ${sources}`;
      default:
        return `✅ **Oracle Response:** ${JSON.stringify(data.result)} 📊 Confidence: ${confidence}% 🔗 Sources: ${sources}`;
    }
  };

  const generateResponse = async (query: string, service: string): Promise<string> => {
    setConnectionStatus('connecting')
    
    // Get selected Oracle perspective
    const selectedOracle = perspectiveOracles.find(oracle => oracle.id === service);
    if (selectedOracle) {
      console.log(`🎭 Using ${selectedOracle.name} perspective for query: "${query}"`);
      console.log(`📋 Context: ${selectedOracle.context}`);
    }
    
    try {
      // Use oracle API for all queries
      const response = await oracleApi.queryOracle(service, query, 'frontend-user');
      
      if (response.success && response.data) {
        setConnectionStatus('connected')
        
        // Format response based on legacy API structure
        const data = response.data;
        let formattedResponse = '';
        
        // Handle enhanced query_info response format
        console.log('🔍 Debug - Full response:', response);
        console.log('🔍 Debug - query_info:', response.query_info);
        console.log('🔍 Debug - query_info exists:', !!response.query_info);
        console.log('🔍 Debug - query_info symbol:', response.query_info?.symbol);
        console.log('🔍 Debug - query_info answer:', response.query_info?.answer);
        
        if (response.query_info && (response.query_info.symbol || response.query_info.answer)) {
          const queryInfo = response.query_info;
          const symbol = queryInfo.symbol || 'Asset';
          const answer = queryInfo.answer || 'N/A';
          
          // Format query response
          formattedResponse = `🔍 **${symbol} Query Analysis**\n\n`;
          formattedResponse += `**Result:** ${answer}\n\n`;
          
          // Data sources
          if (queryInfo.sources && Array.isArray(queryInfo.sources)) {
            formattedResponse += `📊 **Data Sources:**\n`;
            queryInfo.sources.forEach((source: Record<string, unknown>) => {
              const icon = source.type === 'blockchain' ? '🔗' : '📡';
              formattedResponse += `${icon} **${source.name}**: ${source.confidence}% confidence\n`;
            });
            formattedResponse += `\n`;
          }
          
          // Consensus metadata
          if (queryInfo.consensus) {
            formattedResponse += `📊 **Data Quality:**\n`;
            formattedResponse += `• Confidence: ${queryInfo.consensus.confidence_score}%\n`;
            formattedResponse += `• Sources: ${queryInfo.sources?.map((s: Record<string, unknown>) => String(s.name)?.toLowerCase() || 'unknown').join(', ') || 'N/A'}\n`;
            formattedResponse += `• Method: ${queryInfo.consensus.method}\n`;
            formattedResponse += `• Providers: ${queryInfo.consensus.provider_count}\n`;
          }
          
          // Add blockchain verification if available
          if (response.blockchain) {
            formattedResponse += `\n🔗 **Blockchain Verification:**\n`;
            formattedResponse += `• Transaction ID: ${response.blockchain.transaction_id}\n`;
            formattedResponse += `• Hash: ${response.blockchain.hash.slice(0, 16)}...\n`;
            formattedResponse += `• Network: ${response.blockchain.network}\n`;
            formattedResponse += `• Verified: ✅ ${response.blockchain.verified ? 'Yes' : 'No'}\n`;
          }
          
          // Add hashscan link for detailed query exploration
          if (response.hashscan_url) {
            formattedResponse += `\n🔍 **Query Details:**\n`;
            formattedResponse += `HASHSCAN_BUTTON::${response.hashscan_url}::View detailed analysis with sources and blockchain verification\n`;
          }
        }
        // Legacy price format fallback
        else if (data.price !== undefined) {
          // New price feed format
          const symbol = (data.pair && typeof data.pair === 'string') ? data.pair.split('/')[0] : 'BTC';
          const price = (data.decimals && typeof data.price === 'number' && typeof data.decimals === 'number') 
            ? data.price / Math.pow(10, data.decimals) 
            : (typeof data.price === 'number' ? data.price : 0);
          
          formattedResponse = `💰 **${symbol} Price Update**\n\n`;
          formattedResponse += `Current Price: **$${price.toLocaleString()}**\n`;
          
          if (response.metadata) {
            const meta = response.metadata;
            if (meta.confidence && typeof meta.confidence === 'number') {
              formattedResponse += `Confidence: ${(meta.confidence * 100).toFixed(1)}%\n`;
            }
            if (meta.sources && Array.isArray(meta.sources)) {
              formattedResponse += `Sources: ${meta.sources.join(', ')}\n`;
            }
            formattedResponse += `Method: ${meta.method || 'N/A'}\n`;
            formattedResponse += `Providers: ${meta.providersUsed || 0}\n`;
            
            // Add blockchain verification if available
            if (response.blockchain as Record<string, unknown>) {
              formattedResponse += `\n🔗 **Blockchain Verification:**\n`;
              const blockchain = response.blockchain as Record<string, unknown>;
              formattedResponse += `• Transaction ID: ${blockchain.transaction_id}\n`;
              formattedResponse += `• Hash: ${(blockchain.hash as string)?.slice(0, 16)}...\n`;
              formattedResponse += `• Network: ${blockchain.network}\n`;
              formattedResponse += `• Verified: ✅ ${blockchain.verified ? 'Yes' : 'No'}\n`;
            }
            
            // Add hashscan link for detailed query exploration
            if (response.hashscan_url) {
              formattedResponse += `\n🔍 **Query Details:**\n`;
              formattedResponse += `HASHSCAN_BUTTON::${response.hashscan_url}::View detailed analysis with sources and blockchain verification\n`;
            }
          }
        } else if (data.result && typeof data.result === 'object') {
          const result = data.result as Record<string, unknown>;
          
          if (result.symbol && result.price) {
            // Legacy crypto price response
            formattedResponse = `💰 **${result.symbol} Price Update**\n\n`;
            formattedResponse += `Current Price: **$${result.price.toLocaleString()}**\n`;
            if (result.confidence_score && typeof result.confidence_score === 'number') {
              formattedResponse += `Confidence: ${(result.confidence_score * 100).toFixed(1)}%\n`;
            }
            if (result.data_sources && Array.isArray(result.data_sources)) {
              formattedResponse += `Sources: ${result.data_sources.join(', ')}\n`;
            }
          } else if (result.temperature !== undefined) {
            // Weather response
            formattedResponse = `🌤️ **Weather Information**\n\n`;
            formattedResponse += `Temperature: ${result.temperature}°C\n`;
            if (result.location) {
              formattedResponse += `Location: ${result.location}\n`;
            }
          } else {
            // Generic response
            formattedResponse = `📊 **Oracle Response**\n\n${JSON.stringify(result, null, 2)}`;
          }
        } else if (data.result && typeof data.result === 'string') {
          formattedResponse = data.result;
        }
        
        // Add metadata if not already included
        if (!formattedResponse.includes('**Data Quality:**')) {
          formattedResponse += `\n\n📊 **Data Quality:**`;
          
          const meta = response.metadata || {};
          formattedResponse += `\n• Confidence: ${meta.confidence && typeof meta.confidence === 'number' ? (meta.confidence * 100).toFixed(1) : 'N/A'}%`;
          formattedResponse += `\n• Sources: ${meta.sources && Array.isArray(meta.sources) ? meta.sources.join(', ') : 'N/A'}`;
          formattedResponse += `\n• Method: ${meta.method || 'N/A'}`;
          formattedResponse += `\n• Providers: ${meta.providersUsed || 0}`;
        }
        
        return formattedResponse;
      } else {
        setConnectionStatus('connected')
        return `❌ Query failed: ${response.error || 'Unknown error'}`;
      }
    } catch (apiError: unknown) {
      setConnectionStatus('connected')
      return `❌ API Error: ${apiError instanceof Error ? apiError.message : 'Connection failed - ensure backend is running on port 4001'}`;
    }
  }

  const handleLaunchAgent = async () => {
    setIsAgentLaunched(true)
    setConnectionStatus('connecting')
    
    // Test connection by getting system status
    try {
      await getSystemStatus()
      setConnectionStatus('connected')
    } catch (error: unknown) {
      setConnectionStatus('connected')
      // Silently handle connection test error
      void error;
    }
    
    const selectedOracle = perspectiveOracles.find(s => s.id === selectedService)
    const serviceName = selectedOracle?.name || 'Oracle Assistant'
    
    let welcomeContent = '';
    
    switch (selectedService) {
        
      case 'chainlink':
        welcomeContent = `🔗 **Chainlink Oracle Activated!**\n\n🏛️ Enterprise-grade decentralized oracle with 95% reliability!\n\n**What I can do:**\n• Proven reliable crypto price feeds\n• Enterprise market data\n• Institutional-grade accuracy\n• Battle-tested oracle network\n\n**Try asking:**\n• "Chainlink BTC price"\n• "Enterprise crypto data"\n• "Market price validation"\n• "Institutional price feeds"\n\n🎯 Enterprise oracle ready!`;
        break;
        
      case 'coingecko':
        welcomeContent = `🦎 **CoinGecko Oracle Activated!**\n\n💰 Comprehensive crypto market data with 90% reliability!\n\n**What I can do:**\n• Real-time prices for 10,000+ cryptocurrencies\n• Market cap, trading volume, price changes\n• Historical data and market trends\n• Free-tier crypto intelligence\n\n**Try asking:**\n• "Bitcoin price and market cap"\n• "Ethereum trading volume"\n• "Top 10 crypto prices"\n• "Altcoin market analysis"\n\n📈 Crypto data ready!`;
        break;
        
      case 'dia':
        welcomeContent = `💎 **DIA Oracle Activated!**\n\n🔍 Transparent crypto data for 3000+ tokens with 91% reliability!\n\n**What I can do:**\n• Transparent, customizable price feeds\n• 3000+ token coverage including DeFi\n• Open-source data methodology\n• Community-driven oracle network\n\n**Try asking:**\n• "DeFi token prices"\n• "Transparent price methodology"\n• "Lesser-known token prices"\n• "Community-verified data"\n\n💫 Transparent data ready!`;
        break;
        
      case 'weather':
        welcomeContent = `🌤️ **Weather Oracle Activated!**\n\n🌍 Global weather data with 89% reliability!\n\n**What I can do:**\n• Real-time weather for any location\n• Temperature, humidity, wind conditions\n• Weather forecasts and climate data\n• Atmospheric monitoring\n\n**Try asking:**\n• "Weather in Istanbul"\n• "Temperature in London"\n• "Climate data for Tokyo"\n• "Current conditions in New York"\n\n🌡️ Weather data ready!`;
        break;
        
      case 'exchangerate':
        welcomeContent = `💱 **Exchange Rate Oracle Activated!**\n\n💰 Foreign exchange data with 90% reliability!\n\n**What I can do:**\n• Real-time forex exchange rates\n• Currency conversion calculations\n• Major currency pair monitoring\n• Financial market data\n\n**Try asking:**\n• "USD to EUR exchange rate"\n• "Convert 100 USD to GBP"\n• "Latest forex rates"\n• "Currency market analysis"\n\n💸 Forex data ready!`;
        break;
        
      case 'nasa':
        welcomeContent = `🚀 **NASA Oracle Activated!**\n\n🌌 Official space and astronomy data with 92% reliability!\n\n**What I can do:**\n• Astronomy Picture of the Day\n• Near Earth Objects tracking\n• Mars rover mission data\n• Space weather information\n\n**Try asking:**\n• "NASA astronomy picture today"\n• "Near Earth objects"\n• "Mars mission updates"\n• "Space weather data"\n\n🛰️ Space data ready!`;
        break;
        
      case 'wikipedia':
        welcomeContent = `📚 **Wikipedia Oracle Activated!**\n\n🧠 Global knowledge encyclopedia with 88% reliability!\n\n**What I can do:**\n• Search Wikipedia knowledge base\n• Educational information retrieval\n• Historical and factual data\n• General knowledge queries\n\n**Try asking:**\n• "What is blockchain technology?"\n• "History of Bitcoin"\n• "Explain quantum computing"\n• "Tell me about space exploration"\n\n📖 Knowledge ready!`;
        break;
        
      case 'sports':
        welcomeContent = `🏀 **Sports Oracle Activated!**\n\n⚽ Comprehensive NBA and global sports data with 92% reliability!\n\n**What I can do:**\n• NBA team information and profiles\n• Basketball league standings\n• Team statistics and history\n• Global sports leagues data\n\n**Try asking (use full team names):**\n• "Los Angeles Lakers"\n• "Golden State Warriors"\n• "Boston Celtics"\n• "Chicago Bulls"\n\n**💡 Tip:** Use complete team names for best results (e.g., "Los Angeles Lakers" instead of just "Lakers")\n\n🏆 Sports data ready!`;
        break;
        
      default:
        welcomeContent = `🎭 ${serviceName} activated!\n\n🔮 Oracle system ready with blockchain verification.\n\n🔗 All responses include transaction hash and explorer links.\n\nWhat would you like me to help you with?`;
    }
    
    const welcomeMessage: Message = {
      id: (Date.now() + 2).toString(),
      type: 'assistant',
      content: welcomeContent,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, welcomeMessage])
  }

  const quickActions = [
    { icon: Activity, label: 'Check Balance', action: 'check balance' },
    { icon: BarChart3, label: 'List Services', action: 'list available services' },
    { icon: Zap, label: 'Chat', action: 'start chat session' },
    { icon: Bot, label: 'Providers', action: 'show oracle providers' }
  ]

  // Function to render message content with clickable buttons
  const renderMessageContent = (content: string) => {
    console.log('Rendering content:', content);
    // Split content by button markers
    const parts = content.split(/(EXPLORER_BUTTON::|HASHSCAN_BUTTON::)/);
    console.log('Split parts:', parts);
    const elements: React.ReactElement[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (part === 'EXPLORER_BUTTON::') {
        // Next part should be URL::Text
        const nextPart = parts[i + 1];
        if (nextPart && nextPart.includes('::')) {
          const [url, buttonText] = nextPart.split('::');
          if (url && buttonText) {
            elements.push(
              <button
                key={i}
                onClick={() => {
                  console.log('Opening explorer URL:', url);
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors my-1"
              >
                <ExternalLink className="w-3 h-3" />
                {buttonText}
              </button>
            );
            i++; // Skip next part as we processed it
            continue;
          }
        }
      } else if (part === 'HASHSCAN_BUTTON::') {
        // Next part should be URL::Text
        const nextPart = parts[i + 1];
        if (nextPart && nextPart.includes('::')) {
          const [url, buttonText] = nextPart.split('::');
          if (url && buttonText) {
            elements.push(
              <button
                key={i}
                onClick={() => {
                  console.log('Opening hashscan URL:', url);
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors my-1"
              >
                <Search className="w-3 h-3" />
                {buttonText}
              </button>
            );
            i++; // Skip next part as we processed it
            continue;
          }
        }
      }
      
      // Regular text content
      if (part && part !== 'EXPLORER_BUTTON::' && part !== 'HASHSCAN_BUTTON::') {
        elements.push(
          <span key={i} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      }
    }
    
    return <div className="space-y-1">{elements}</div>;
  }

  return (
    <div className={`flex flex-col h-full bg-gray-900 text-white ${merriweather.className} relative`}>
      
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full transition-colors ${
              connectionStatus === 'connected' ? 'bg-green-400' :
              connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
              'bg-red-400'
            }`}></div>
            <h2 className="text-lg font-bold">Oracle Assistant</h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {connectionStatus === 'connected' && <CheckCircle className="w-4 h-4 text-green-400" />}
            {connectionStatus === 'connecting' && <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />}
            {connectionStatus === 'disconnected' && <AlertCircle className="w-4 h-4 text-red-400" />}
            <span className={`capitalize ${
              connectionStatus === 'connected' ? 'text-green-400' :
              connectionStatus === 'connecting' ? 'text-yellow-400' :
              'text-red-400'
            }`}>{connectionStatus}</span>
          </div>
        </div>
        
        {/* Service Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-cyan-400">Select AI Agent:</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleLaunchAgent}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            {isAgentLaunched ? 'Agent Active' : 'Launch Agent'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-gray-950">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.type === 'user' 
                ? 'bg-blue-600' 
                : 'bg-purple-600'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div className={`max-w-[75%] rounded-lg p-3 ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-100'
            }`}>
              <div className="text-sm">
                {message.type === 'assistant' ? 
                  renderMessageContent(message.content) : 
                  <span className="whitespace-pre-wrap">{message.content}</span>
                }
              </div>
              <span className="text-xs text-gray-400 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex gap-2 items-center">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs text-gray-400 ml-2">
                  {connectionStatus === 'connecting' ? 'Connecting to Oracle...' : 'Processing your request...'}
                </span>
                {(queryState.loading || priceState.loading || weatherState.loading || statusState.loading) && (
                  <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                )}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-gray-800">
        <div className="flex gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInputValue(action.action)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-2 rounded text-xs transition-colors flex items-center justify-center gap-1"
            >
              <action.icon className="w-3 h-3" />
              <span className="hidden sm:inline">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about our API or test a service..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-white disabled:text-gray-400 p-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}