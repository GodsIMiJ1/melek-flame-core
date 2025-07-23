import { useState, useCallback } from 'react'
import { callOpenAI } from '@/lib/openai-api'

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

    console.log('🤖 Sending message to OpenAI:', { content: content.substring(0, 100), model })

    try {
      // Prepare messages for OpenAI API
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // 🔥 VITE FIX: Call OpenAI directly (client-side with VITE_ env var)
      const response = await callOpenAI({
        model: model.replace('openai:', ''), // Remove prefix
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1000
      })

      const assistantMessage: StreamMessage = {
        role: 'assistant',
        content: response || 'No response received'
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('🚨 OpenAI API Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)

      // Add error message instead of removing user message
      const errorResponse: StreamMessage = {
        role: 'assistant',
        content: `❌ Error: ${errorMessage}. Please check your OpenAI API key and try again.`
      }
      setMessages(prev => [...prev, errorResponse])
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
