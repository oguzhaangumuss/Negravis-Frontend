import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { queries } = body

    if (!queries || !Array.isArray(queries)) {
      return NextResponse.json(
        { success: false, error: 'Queries array is required' },
        { status: 400 }
      )
    }

    // Process each query through the New Oracle Manager
    const batchPromises = queries.map(async (queryItem: any) => {
      try {
        const requestBody = {
          query: queryItem.query,
          ...(queryItem.sources && { sources: queryItem.sources }),
          ...(queryItem.method && { method: queryItem.method }),
          ...(queryItem.timeout && { timeout: queryItem.timeout })
        }

        const response = await fetch('https://negravis-app.vercel.app/api/oracle-manager/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        return await response.json()
      } catch (error) {
        return { success: false, error: `Query failed: ${error}` }
      }
    })

    const results = await Promise.allSettled(batchPromises)
    const batchResults = results.map((result) => 
      result.status === 'fulfilled' ? result.value : { success: false, error: 'Query failed' }
    )
    
    return NextResponse.json({
      success: true,
      data: {
        results: batchResults,
        total_queries: queries.length,
        successful_queries: batchResults.filter(r => r.success).length
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Oracle batch query proxy error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process batch queries' },
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