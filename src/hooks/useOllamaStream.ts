
import { useState, useCallback } from "react"
import { streamOllamaResponse } from "@/lib/ollama-api"

export function useOllamaStream() {
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendPrompt = useCallback(async (model: string, messages: any[]) => {
    setLoading(true)
    setResponse("")
    setError(null)

    try {
      const stream = await streamOllamaResponse({ model, messages })
      const reader = stream.getReader()
      const decoder = new TextDecoder("utf-8")

      let finalText = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            if (data.message?.content) {
              const content = data.message.content
              finalText += content
              setResponse(prev => prev + content)
            }
          } catch (parseError) {
            // Skip invalid JSON lines
            console.warn("Failed to parse JSON line:", line)
          }
        }
      }

      setLoading(false)
      return finalText
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      setLoading(false)
      throw err
    }
  }, [])

  const resetResponse = useCallback(() => {
    setResponse("")
    setError(null)
  }, [])

  return { sendPrompt, response, loading, error, resetResponse }
}
