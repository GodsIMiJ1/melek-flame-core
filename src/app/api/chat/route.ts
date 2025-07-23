import { NextRequest, NextResponse } from 'next/server'
import { callOpenAI, streamOpenAIResponse, getOpenAIModelName, isOpenAIModel } from '@/lib/openai-api'

export async function POST(request: NextRequest) {
  try {
    const { messages, model, stream = false } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    if (!model) {
      return NextResponse.json({ error: 'Model is required' }, { status: 400 })
    }

    // Validate OpenAI model
    if (!isOpenAIModel(model)) {
      return NextResponse.json({ error: 'Only OpenAI models are supported' }, { status: 400 })
    }

    if (stream) {
      // Return streaming response
      const openaiStream = await streamOpenAIResponse({
        model: getOpenAIModelName(model),
        messages,
        temperature: 0.7,
        max_tokens: 1000
      })

      // Create a readable stream that forwards the OpenAI stream
      const readableStream = new ReadableStream({
        start(controller) {
          const reader = openaiStream.getReader()
          
          function pump(): Promise<void> {
            return reader.read().then(({ done, value }) => {
              if (done) {
                controller.close()
                return
              }
              
              controller.enqueue(value)
              return pump()
            })
          }
          
          return pump()
        }
      })

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } else {
      // Return non-streaming response
      const response = await callOpenAI({
        model: getOpenAIModelName(model),
        messages,
        temperature: 0.7,
        max_tokens: 1000
      })

      return NextResponse.json({ 
        content: response,
        model: model,
        timestamp: Date.now()
      })
    }
  } catch (error) {
    console.error('Chat API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json({ 
      error: errorMessage,
      details: 'Failed to process chat request'
    }, { status: 500 })
  }
}
