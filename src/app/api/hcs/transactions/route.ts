import { NextRequest, NextResponse } from 'next/server'

// Mock HCS transaction data generator
function generateHCSTransactions(limit: number, type?: string) {
  const messageTypes = ['oracle_query', 'consensus_result', 'health_check', 'system_metrics']
  const topicIds = ['0.0.4629584', '0.0.4629583', '0.0.4629585', '0.0.4629586']
  
  const transactions = []
  
  for (let i = 0; i < limit; i++) {
    const messageType = type || messageTypes[Math.floor(Math.random() * messageTypes.length)]
    const timestamp = new Date(Date.now() - (i * 5000)).toISOString()
    const transactionId = `0.0.1234-${Date.now()}-${i}`
    
    let data = {}
    
    switch (messageType) {
      case 'oracle_query':
        data = {
          symbol: ['BTC', 'ETH', 'HBAR'][Math.floor(Math.random() * 3)],
          price: (Math.random() * 100000).toFixed(2),
          source: ['CoinGecko', 'Chainlink', 'Binance'][Math.floor(Math.random() * 3)],
          confidence: (0.95 + Math.random() * 0.05).toFixed(3)
        }
        break
      case 'consensus_result':
        data = {
          consensus_price: (Math.random() * 100000).toFixed(2),
          participating_oracles: Math.floor(Math.random() * 5) + 3,
          variance: (Math.random() * 0.1).toFixed(4),
          finality_time: `${(Math.random() * 3 + 1).toFixed(1)}s`
        }
        break
      case 'health_check':
        data = {
          provider: ['CoinGecko', 'Chainlink', 'Binance', 'CryptoCompare'][Math.floor(Math.random() * 4)],
          status: Math.random() > 0.1 ? 'healthy' : 'degraded',
          latency: `${Math.floor(Math.random() * 200 + 50)}ms`,
          success_rate: `${(Math.random() * 5 + 95).toFixed(1)}%`
        }
        break
      case 'system_metrics':
        data = {
          active_providers: Math.floor(Math.random() * 3) + 5,
          system_health: (Math.random() * 0.05 + 0.95).toFixed(3),
          total_queries: Math.floor(Math.random() * 1000 + 5000),
          uptime: (Math.random() * 0.01 + 99.99).toFixed(2)
        }
        break
    }
    
    transactions.push({
      transactionId,
      timestamp,
      type: messageType,
      data,
      topicId: topicIds[Math.floor(Math.random() * topicIds.length)],
      consensusTimestamp: timestamp,
      memo: `HCS message: ${messageType}`,
      running_hash: `hash-${Date.now()}-${i}`,
      sequence_number: 1000 + i
    })
  }
  
  return transactions
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 10
    
    // Generate mock HCS transactions
    const transactions = generateHCSTransactions(Math.min(limit, 100), type || undefined)
    
    const responseData = {
      success: true,
      data: {
        transactions,
        total: transactions.length,
        limit,
        type: type || 'all'
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('HCS transactions error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate HCS transactions',
        data: { transactions: [], total: 0 }
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}