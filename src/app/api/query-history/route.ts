import { NextRequest, NextResponse } from 'next/server'

interface HCSMessage {
  consensus_timestamp: string
  message: string
  payer_account_id: string
  sequence_number: number
  topic_id: string
  chunk_info: {
    initial_transaction_id: {
      account_id: string
      transaction_valid_start: string
    }
  }
}

interface OracleQueryLog {
  timestamp: string
  type: string
  queryId: string
  inputPrompt: string
  aiResponse: string
  model: string
  provider: string
  cost: number
  executionTime: number
  success: boolean
}

interface ParsedQueryHistory {
  id: string
  query: string
  provider: string
  result: string
  timestamp: string
  blockchain_hash: string
  blockchain_link: string
  consensus_timestamp: string
  sequence_number: number
  execution_time: number
  success: boolean
  // Enhanced Oracle details
  ai_response?: string
  model?: string
  cost?: number
  full_oracle_data?: any
  consensus_method?: string
  confidence?: number
  sources?: string[]
  raw_result?: any
}

// Oracle HCS Topic ID from backend
const ORACLE_TOPIC_ID = "0.0.6533324"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '20'
    const offset = searchParams.get('offset') || '0'
    
    // Fetch messages from Hedera Mirror Node
    const mirrorNodeUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${ORACLE_TOPIC_ID}/messages?limit=${limit}&order=desc`
    
    const response = await fetch(mirrorNodeUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Mirror Node error: ${response.status}`)
    }

    const data = await response.json()
    const messages: HCSMessage[] = data.messages || []

    // Parse and transform messages
    const queryHistory: ParsedQueryHistory[] = messages.map((message) => {
      try {
        // Decode base64 message
        const decodedMessage = Buffer.from(message.message, 'base64').toString('utf-8')
        const queryLog: OracleQueryLog = JSON.parse(decodedMessage)
        
        // Extract result from aiResponse - safer parsing
        let result = "Query result not available"
        try {
          if (queryLog.aiResponse && queryLog.aiResponse.includes('Oracle query result:')) {
            // Extract the JSON part more carefully
            const resultStart = queryLog.aiResponse.indexOf('{')
            if (resultStart !== -1) {
              const afterStart = queryLog.aiResponse.substring(resultStart)
              
              // Find matching closing brace
              let braceCount = 0
              let jsonEnd = -1
              for (let i = 0; i < afterStart.length; i++) {
                if (afterStart[i] === '{') braceCount++
                if (afterStart[i] === '}') {
                  braceCount--
                  if (braceCount === 0) {
                    jsonEnd = i + 1
                    break
                  }
                }
              }
              
              if (jsonEnd > 0) {
                const jsonStr = afterStart.substring(0, jsonEnd)
                const parsed = JSON.parse(jsonStr)
                
                // Format result nicely
                if (parsed.result && typeof parsed.result === 'number') {
                  result = `$${parsed.result.toLocaleString()}`
                } else if (parsed.answer) {
                  result = parsed.answer
                } else if (parsed.data) {
                  result = parsed.data
                } else {
                  result = "Result available"
                }
              }
            }
          }
        } catch (parseError) {
          console.log('Result parsing failed, using fallback:', parseError)
          // Fallback: try to extract any number
          const numberMatch = queryLog.aiResponse.match(/result[":]\s*(\d+\.?\d*)/i)
          if (numberMatch) {
            result = `$${parseFloat(numberMatch[1]).toLocaleString()}`
          }
        }

        // Extract additional Oracle data from aiResponse
        let oracleDetails: any = {}
        let sources: string[] = []
        let consensusMethod = 'unknown'
        let confidence = 0
        
        try {
          if (queryLog.aiResponse && queryLog.aiResponse.includes('Oracle query result:')) {
            const resultStart = queryLog.aiResponse.indexOf('{')
            if (resultStart !== -1) {
              const afterStart = queryLog.aiResponse.substring(resultStart)
              let braceCount = 0
              let jsonEnd = -1
              for (let i = 0; i < afterStart.length; i++) {
                if (afterStart[i] === '{') braceCount++
                if (afterStart[i] === '}') {
                  braceCount--
                  if (braceCount === 0) {
                    jsonEnd = i + 1
                    break
                  }
                }
              }
              
              if (jsonEnd > 0) {
                const jsonStr = afterStart.substring(0, jsonEnd)
                oracleDetails = JSON.parse(jsonStr)
                
                // Extract Oracle metadata
                sources = oracleDetails.sources || []
                consensusMethod = oracleDetails.consensus_method || 'median'
                confidence = oracleDetails.confidence || 0
              }
            }
          }
        } catch (parseError) {
          console.log('Oracle details parsing failed:', parseError)
        }

        // Create blockchain transaction ID
        const txId = message.chunk_info.initial_transaction_id
        const blockchainHash = `${txId.account_id}@${txId.transaction_valid_start}`
        
        return {
          id: queryLog.queryId,
          query: queryLog.inputPrompt,
          provider: queryLog.model || queryLog.provider,
          result,
          timestamp: queryLog.timestamp,
          blockchain_hash: blockchainHash,
          blockchain_link: `https://hashscan.io/testnet/transaction/${encodeURIComponent(blockchainHash)}`,
          consensus_timestamp: message.consensus_timestamp,
          sequence_number: message.sequence_number,
          execution_time: queryLog.executionTime,
          success: queryLog.success,
          // Enhanced Oracle details
          ai_response: queryLog.aiResponse,
          model: queryLog.model,
          cost: queryLog.cost,
          full_oracle_data: oracleDetails,
          consensus_method: consensusMethod,
          confidence: confidence * 100, // Convert to percentage
          sources: sources,
          raw_result: oracleDetails
        }
      } catch (error) {
        console.error('Error parsing message:', error)
        return null
      }
    }).filter((item): item is ParsedQueryHistory => item !== null)

    return NextResponse.json({
      success: true,
      data: queryHistory,
      meta: {
        total: queryHistory.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        source: 'hedera-blockchain'
      }
    })

  } catch (error) {
    console.error('Query history fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch query history',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}