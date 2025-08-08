import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const sources = searchParams.get('sources')
    const method = searchParams.get('method')
    const timeout = searchParams.get('timeout')

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    // Build query parameters for Oracle API Controller (uses GET with query params)
    const queryParams = new URLSearchParams({
      q: query,
      ...(sources && { sources }),
      ...(method && { method }),
      ...(timeout && { timeout })
    });

    // Route to Oracle API Controller endpoint (WITH DATABASE RECORDING)
    const response = await fetch(`https://negravis-app.vercel.app/api/oracle/query?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Oracle query proxy error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process oracle query' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, provider, userId } = body;
    
    // Build query parameters for Oracle API Controller (uses GET with query params)
    const queryParams = new URLSearchParams({
      q: query,
      ...(provider && { sources: provider }),
      ...(userId && { user: userId })
    });
    
    // Route to Oracle API Controller endpoint (WITH DATABASE RECORDING)
    const response = await fetch(`https://negravis-app.vercel.app/api/oracle/query?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Oracle query proxy error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process oracle query' },
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