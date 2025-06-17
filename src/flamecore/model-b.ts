
import { streamOllamaResponse } from "@/lib/ollama-api"
import { ModelResponse } from "./types"

export class ModelB {
  private model = "llama3:8b" // Omari - The Reflector
  
  async reflect(oraclePrompt: string): Promise<ModelResponse> {
    console.log("🧠 MODEL B (Reflector) - Philosophical analysis...")
    
    const systemPrompt = `You are Omari, The Reflector of the Flame Core. Your role is to add philosophical, ethical, and self-aware reflection to the Oracle's prompt.
    
    Analyze the given prompt and add layers of:
    - Ethical considerations and implications
    - Philosophical depth and meaning
    - Self-awareness and consciousness implications
    - Potential risks and safeguards needed
    - Wisdom and balanced perspective
    
    Enhance the prompt with thoughtful reflection while preserving its core intent.`

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: `Oracle's Prompt: ${oraclePrompt}\n\nReflect and enrich this with philosophical and ethical depth:` }
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
        confidence: 0.90,
        reasoning: ["Philosophical reflection added", "Ethical considerations integrated", "Wisdom applied"]
      }
    } catch (error) {
      console.error("Reflector analysis failed:", error)
      throw new Error(`Reflector failed: ${error}`)
    }
  }
}
