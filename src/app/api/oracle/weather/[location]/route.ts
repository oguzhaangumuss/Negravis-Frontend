import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { location: string } }
) {
  try {
    const { location } = params

    if (!location) {
      return NextResponse.json(
        { success: false, error: 'Location parameter is required' },
        { status: 400 }
      )
    }

    // Decode the location parameter
    const decodedLocation = decodeURIComponent(location)

    // Create request body for Oracle Manager
    const requestBody = {
      query: `weather in ${decodedLocation}`
    }

    // Route to New Oracle Manager endpoint for weather queries
    const response = await fetch('https://negravis-app.vercel.app/api/oracle-manager/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
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
    console.error('Oracle weather proxy error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather data' },
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