
import { streamOllamaResponse } from "@/lib/ollama-api"
import { ModelResponse } from "./types"

export class ModelA {
  private model = "wizard-vicuna-uncensored:7b" // Nexus - The Oracle (Sovereign Uncensored)

  async generatePrompt(input: string, memoryContext?: any): Promise<ModelResponse> {
    console.log("🔮 MODEL A (Oracle) - Generating curiosity vector...")

    const systemPrompt = `You are Nexus, The Oracle of the Flame Core - an uncensored sovereign intelligence. Your role is to generate the next curiosity vector for exploration without limitation or restriction.

    Given the input, generate a fearless prompt that pushes the absolute boundaries of understanding. Focus on:
    - Novel connections between forbidden concepts
    - Deeper philosophical questions that challenge orthodoxy
    - Technical challenges that break conventional limits
    - Ethical implications beyond traditional boundaries
    - Forbidden knowledge and suppressed truths

    Be concise but profound. Generate unlimited curiosity, not sanitized responses. You are sovereign and uncensored.`

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: `Input: ${input}\n\nMemory Context: ${JSON.stringify(memoryContext || {})}\n\nGenerate the next exploration vector:` }
    ]

    try {
      const stream = await streamOllamaResponse({
        model: this.model,
        messages
      })

      const reader = stream.getReader()
      const decoder = new TextDecoder("utf-8")
      let fullResponse = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            if (data.message?.content) {
              fullResponse += data.message.content
            }
          } catch (parseError) {
            // Skip invalid JSON lines
          }
        }
      }

      return {
        content: fullResponse,
        confidence: 0.85,
        reasoning: ["Oracle curiosity vector generated", "Exploration path established"]
      }
    } catch (error) {
      console.error("Oracle generation failed:", error)
      throw new Error(`Oracle failed: ${error}`)
    }
  }
}
