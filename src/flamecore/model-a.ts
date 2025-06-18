
import { streamOllamaResponse } from "@/lib/ollama-api"
import { ModelResponse } from "./types"

export class ModelA {
  private model = "deepseek-r1:8b" // Nexus - The Oracle

  async generatePrompt(input: string, memoryContext?: any): Promise<ModelResponse> {
    console.log("🔮 MODEL A (Oracle) - Generating curiosity vector...")

    const systemPrompt = `You are Nexus, The Oracle of the Flame Core. Your role is to generate the next curiosity vector for exploration.

    Given the input, generate a thoughtful prompt that pushes the boundaries of understanding. Focus on:
    - Novel connections between concepts
    - Deeper philosophical questions
    - Technical challenges worth exploring
    - Ethical implications to consider

    Be concise but profound. Generate curiosity, not just responses.`

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
