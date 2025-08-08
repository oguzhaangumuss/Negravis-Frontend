import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://negravis-app.vercel.app/api/oracle-manager/providers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    // Update Web Search provider to Chatbot
    if (data.success && data.data && data.data.categories) {
      // Find and update Web Search provider in Dynamic category
      if (data.data.categories.Dynamic) {
        const webSearchIndex = data.data.categories.Dynamic.findIndex(
          (provider: any) => provider.id === 'web-scraping' || provider.name === 'Web Search'
        )
        
        if (webSearchIndex !== -1) {
          data.data.categories.Dynamic[webSearchIndex] = {
            ...data.data.categories.Dynamic[webSearchIndex],
            id: 'chatbot',
            name: 'Chatbot',
            icon: '🤖',
            description: 'AI-powered chatbot with intelligent responses and general knowledge',
            category: 'Dynamic',
            specialties: [
              'AI chat',
              'Natural language',
              'General knowledge',
              'Q&A assistance'
            ],
            latency: '1200ms',
            reliability: '87%'
          }
        }
      }
    }
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Oracle manager providers proxy error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch oracle manager providers' },
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