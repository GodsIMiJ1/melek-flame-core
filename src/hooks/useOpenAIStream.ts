import { useState, useCallback } from 'react'
import { callOpenAI, streamOpenAIResponse, getOpenAIModelName } from '@/lib/openai-api'

interface StreamMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface UseOpenAIStreamReturn {
  messages: StreamMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string, model: string) => Promise<void>
  clearMessages: () => void
}

export function useOpenAIStream(): UseOpenAIStreamReturn {
  const [messages, setMessages] = useState<StreamMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string, model: string) => {
    if (!content.trim()) return

    const userMessage: StreamMessage = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      // Prepare messages for OpenAI API
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Use streaming for real-time response
      if (model.startsWith('openai:')) {
        const stream = await streamOpenAIResponse({
          model: getOpenAIModelName(model),
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1000
        })

        const reader = stream.getReader()
        const decoder = new TextDecoder()
        let assistantContent = ''

        // Add empty assistant message that we'll update
        const assistantMessage: StreamMessage = { role: 'assistant', content: '' }
        setMessages(prev => [...prev, assistantMessage])

        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n').filter(line => line.trim() && line.startsWith('data: '))

          for (const line of lines) {
            try {
              const jsonStr = line.replace('data: ', '')
              if (jsonStr === '[DONE]') continue
              
              const data = JSON.parse(jsonStr)
              if (data.choices?.[0]?.delta?.content) {
                assistantContent += data.choices[0].delta.content
                
                // Update the assistant message in real-time
                setMessages(prev => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: assistantContent
                  }
                  return newMessages
                })
              }
            } catch (parseError) {
              // Skip invalid JSON lines
            }
          }
        }
      } else {
        // Fallback to non-streaming for non-OpenAI models
        const response = await callOpenAI({
          model: getOpenAIModelName(model),
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1000
        })

        const assistantMessage: StreamMessage = { role: 'assistant', content: response }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (err) {
      console.error('OpenAI Stream Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message')
      
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  }
}
