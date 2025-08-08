import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Route to New Oracle Manager stats endpoint for health check
    const response = await fetch('https://negravis-app.vercel.app/api/oracle-manager/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    // Transform stats response into health check format
    const healthData = {
      success: data.success || false,
      data: {
        system_health: data.success ? 100 : 0,
        providers_online: data.data?.providers?.length || 0,
        timestamp: Date.now()
      }
    }
    
    return NextResponse.json(healthData, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Oracle health check proxy error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform health check' },
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