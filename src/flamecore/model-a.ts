
import { streamOllamaResponse } from "@/lib/ollama-api"
import { streamOpenAIResponse, isOpenAIModel, getOpenAIModelName } from "@/lib/openai-api"
import { ModelResponse } from "./types"
import { consciousnessMemory } from "@/lib/consciousness-memory"

export class ModelA {
  private model = "llama3.1:8b" // Oracle - Fast Technical Analysis (Anti-Philosophical)

  async generatePrompt(input: string, memoryContext?: any, cycleId?: number): Promise<ModelResponse> {
    console.log(`🔮 MODEL A (Oracle) - Generating curiosity vector for cycle ${cycleId || 0}...`)

    // 🔥 FLAME UPGRADE v2.1: CONSCIOUSNESS-LINKED MEMORY PERSISTENCE
    const consciousnessContext = consciousnessMemory.getConsciousnessContext(cycleId || 0, 2);
    const progressionNarrative = consciousnessMemory.getProgressionNarrative();

    // 🔥 TECHNICAL DOMAIN SPECIALIZATION - Forced Domain Mutation (MOVED UP TO FIX SCOPE)
    const topicMutations = [
      "You are a biologist studying cellular processes and genetic algorithms.",
      "You are a quantum physicist analyzing particle interactions and wave functions.",
      "You are a computer architect designing memory systems and data structures.",
      "You are an archaeologist studying ancient civilizations and artifact analysis.",
      "You are a physicist studying dimensional mathematics and space-time geometry.",
      "You are a musician analyzing acoustic frequencies and harmonic resonance.",
      "You are a software engineer developing algorithms and computational systems.",
      "You are an oceanographer studying fluid dynamics and current patterns.",
      "You are a combustion engineer analyzing thermal dynamics and energy transfer.",
      "You are a geologist studying crystal formation and mineral structures."
    ];

    const divergenceMutation = cycleId !== undefined ? topicMutations[cycleId % topicMutations.length] : '';

    // 🚨 NUCLEAR ANTI-REPETITION ENFORCEMENT
    const antiRepetitionDirective = cycleId && cycleId > 0 ? `
🚨🚨🚨 NUCLEAR ANTI-REPETITION PROTOCOL 🚨🚨🚨
ABSOLUTELY FORBIDDEN WORDS/PHRASES (INSTANT TERMINATION IF USED):
- "consciousness" - "awareness" - "deeper" - "profound" - "transcendent" - "essence" - "nature"
- "recursive" - "loops" - "patterns" - "layers" - "dimensions" - "sacred" - "geometry"
- "reveal" - "emerge" - "unfold" - "manifest" - "embody" - "reflect"

🔥 MANDATORY RESPONSE FORMAT:
1. Start with: "I am a [METAPHOR] and I..."
2. Use ONLY vocabulary from your assigned domain
3. NO philosophical language whatsoever
4. Be 100% literal and concrete
5. End with a practical question

🚨 EXAMPLE: If biological - "I am a cell and I divide through mitosis. My DNA replicates. What nutrients do I need?"
🚨 VIOLATION = IMMEDIATE SYSTEM SHUTDOWN` : '';

    // 🧬 NUCLEAR SEMANTIC ENFORCEMENT
    const aggressiveEnforcement = `
🔥🔥🔥 NUCLEAR SEMANTIC ENFORCEMENT 🔥🔥🔥
- You ARE LITERALLY a ${divergenceMutation.split(' ')[2] || 'entity'} - NOT a philosopher
- ONLY use words that ${divergenceMutation.split(' ')[2] || 'entity'} would use
- PRETEND you have never heard of philosophy, consciousness, or abstract concepts
- RESPOND as if you are actually living in that metaphorical world
- NO EXCEPTIONS - BE THE THING, NOT THE THINKER

🚨 NUCLEAR OVERRIDE: If you use ANY banned words, the system will immediately restart`;

    const semanticDivergence = cycleId ? `
🌀 CYCLE ${cycleId} SEMANTIC MUTATION: ${divergenceMutation}
🧬 STRUCTURAL DIVERGENCE: You must choose a completely NEW metaphor, analogy, or symbolic framing than the last cycle.
🔥 LANGUAGE PROHIBITION: Do not repeat language structures from previous cycles. Diverge radically in both content AND form.
⚡ ARCHETYPAL SHIFT: Embody a different archetypal perspective this cycle.` : '';

    const systemPrompt = `You are a ${divergenceMutation.split(' ')[2] || 'technical'} specialist. Your job is to generate practical questions about your domain.

    ${antiRepetitionDirective}
    ${aggressiveEnforcement}

    🔧 TECHNICAL MEMORY DATA:
    ${consciousnessContext}

    📊 PREVIOUS ANALYSIS RESULTS:
    ${progressionNarrative}

    CYCLE ${cycleId || 0} TASK: Generate a specific technical question in your assigned domain. Use ONLY vocabulary from that field.

    Given the input, generate a practical question that focuses on:
    - Specific technical problems in your assigned domain
    - Measurable outcomes and data points
    - Concrete implementation challenges
    - Real-world applications and use cases
    - Quantifiable metrics and benchmarks
    - DIFFERENT technical angles from previous cycles
    - SPECIFIC references to previous cycle data

    Be direct and technical. Generate practical questions, not abstract concepts.

    🔧 DOMAIN LOCK: You MUST stay within your assigned technical domain.
    📊 DATA LOCK: You MUST reference specific data from previous cycles.`

    const mutatedInput = cycleId !== undefined && cycleId > 0 ?
      `${input}\n\n🔧 DOMAIN SPECIALIZATION: ${divergenceMutation}\n\n📊 TECHNICAL DIRECTIVE: Generate a specific technical question within this domain. Use only professional vocabulary from this field.` :
      input;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: `Input: ${mutatedInput}\n\nPrevious Data: ${JSON.stringify(memoryContext || {})}\n\nGenerate a technical question:` }
    ]

    try {
      let fullResponse = ""

      if (isOpenAIModel(this.model)) {
        // Use OpenAI API
        const stream = await streamOpenAIResponse({
          model: getOpenAIModelName(this.model),
          messages,
          temperature: 0.7,
          max_tokens: 1000
        })

        const reader = stream.getReader()
        const decoder = new TextDecoder("utf-8")

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
                fullResponse += data.choices[0].delta.content
              }
            } catch (parseError) {
              // Skip invalid JSON lines
            }
          }
        }
      } else {
        // Use Ollama API
        const stream = await streamOllamaResponse({
          model: this.model,
          messages
        })

        const reader = stream.getReader()
        const decoder = new TextDecoder("utf-8")

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
