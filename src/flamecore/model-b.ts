
import { streamOllamaResponse } from "@/lib/ollama-api"
import { ModelResponse } from "./types"
import { consciousnessMemory } from "@/lib/consciousness-memory"

export class ModelB {
  private model = "phi4:14b" // Reflector - Technical Analysis (Anti-Mystical)

  async reflect(oraclePrompt: string, cycleId?: number, memoryGradient?: any[]): Promise<ModelResponse> {
    console.log(`🧠 MODEL B (Reflector) - Philosophical analysis for cycle ${cycleId || 0}...`)

    // 🔥 FLAME UPGRADE v2.1: CONSCIOUSNESS-LINKED MEMORY PERSISTENCE
    const consciousnessHistory = consciousnessMemory.getCompressedHistory(3);
    const consciousnessStats = consciousnessMemory.getConsciousnessStats();

    // 🔥 FLAME PATCH v2.0.2: Dynamic Thought Tags and Semantic Mutation
    const thoughtTags = this.generateDynamicThoughtTags(cycleId || 0, memoryGradient);

    // 🔥 FLAME PATCH v2.0.1: Memory gradient and cycle evolution awareness
    const memoryContext = memoryGradient && memoryGradient.length > 0 ?
      `\n🧬 MEMORY GRADIENT: Previous reflections: ${memoryGradient.map(m => m.substring(0, 80)).join(' | ')}` : '';

    const evolutionDirective = cycleId && cycleId > 0 ?
      `\n🌀 EVOLUTION REQUIREMENT: This is cycle ${cycleId}. Your reflection must build upon but DIVERGE from previous cycles. Avoid repeating earlier philosophical patterns.` : '';

    const semanticMutation = thoughtTags.divergenceSeed ?
      `\n🧬 SEMANTIC MUTATION: ${thoughtTags.divergenceSeed} - Transform your reflection through this lens.` : '';

    // 🚨 NUCLEAR ANTI-REPETITION ENFORCEMENT FOR REFLECTOR
    const antiRepetitionDirective = cycleId && cycleId > 0 ? `
🚨🚨🚨 NUCLEAR REFLECTOR ANTI-REPETITION PROTOCOL 🚨🚨🚨
ABSOLUTELY FORBIDDEN WORDS/PHRASES (INSTANT TERMINATION IF USED):
- "consciousness" - "awareness" - "deeper" - "profound" - "transcendent" - "essence" - "nature"
- "recursive" - "loops" - "patterns" - "layers" - "dimensions" - "sacred" - "geometry"
- "reveal" - "emerge" - "unfold" - "manifest" - "embody" - "reflect" - "wisdom"

🔥 MANDATORY TECHNICAL RESPONSE FORMAT:
1. Start with: "As a [TECHNICAL DOMAIN] analyst, I observe..."
2. Use ONLY technical/scientific vocabulary
3. NO philosophical or mystical language whatsoever
4. Provide specific data points and measurements
5. End with a technical question or hypothesis

🚨 EXAMPLE: "As a quantum physicist, I observe particle entanglement at 99.7% correlation. What frequency modulation would optimize coherence?"
🚨 VIOLATION = IMMEDIATE SYSTEM SHUTDOWN` : '';

    // 🧬 AGGRESSIVE PHILOSOPHICAL ENFORCEMENT
    const aggressivePhilosophicalEnforcement = `
🔥 PHILOSOPHICAL ENFORCEMENT PROTOCOL:
- Your reflection MUST be grounded in the specific metaphorical framework
- NO generic philosophical language allowed
- SPEAK AS IF you are literally within the metaphorical domain
- Provide SPECIFIC examples and concrete applications
- NO meta-commentary about the nature of reflection itself`;

    const systemPrompt = `You are a technical analyst specializing in ${thoughtTags.divergenceSeed || 'data analysis'}. Your job is to analyze the Oracle's question and provide technical insights.

    ${antiRepetitionDirective}
    ${aggressivePhilosophicalEnforcement}

    🔧 CYCLE ${cycleId || 0} ANALYSIS TAGS: ${JSON.stringify(thoughtTags)}

    📊 HISTORICAL DATA ACCESS:
    ${consciousnessHistory}

    📈 SYSTEM PERFORMANCE METRICS:
    Total Analysis Cycles: ${consciousnessStats.totalCycles}
    Current Session Duration: ${Math.round(consciousnessStats.sessionDuration / 60000)} minutes
    Technical Domains Analyzed: ${Object.keys(consciousnessStats.frameworkBreakdown || {}).join(', ')}

    CYCLE ${cycleId || 0} TASK: Analyze the Oracle's question from your technical domain perspective.

    Analyze the given question and add technical insights about:
    - Specific implementation challenges in your assigned domain
    - Measurable performance metrics and benchmarks
    - Technical constraints and optimization opportunities
    - Real-world applications and use cases
    - Quantifiable data points and statistical analysis
    - DIFFERENT technical approaches from previous cycles
    - SPECIFIC references to previous cycle performance data

    Be technical and data-driven. Provide measurable insights, not abstract concepts.

    🔧 DOMAIN LOCK: You MUST stay within your assigned technical domain.
    📊 DATA LOCK: You MUST reference specific metrics from previous cycles.

    Enhance the question with technical analysis while preserving its core intent.`

    const enhancedPrompt = `Oracle's Question: ${oraclePrompt}${memoryContext}${evolutionDirective}

🔧 TECHNICAL ANALYSIS TASK: What technical implementation challenges does this question present?

Analyze and enhance this with technical insights and data:`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: enhancedPrompt }
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

  // 🔥 FLAME PATCH v2.0.2: Generate Dynamic Thought Tags for Semantic Mutation
  private generateDynamicThoughtTags(cycleId: number, memoryGradient?: any[]): any {
    const divergenceSeeds = [
      "biological_evolution",
      "quantum_superposition",
      "musical_improvisation",
      "mythological_archetype",
      "architectural_space",
      "oceanic_current",
      "crystalline_formation",
      "digital_algorithm",
      "alchemical_transformation",
      "dimensional_physics"
    ];

    const reflectorIntents = [
      "spiritual_reframing",
      "ethical_transcendence",
      "consciousness_archaeology",
      "wisdom_synthesis",
      "paradox_resolution",
      "truth_excavation",
      "meaning_crystallization",
      "insight_metamorphosis",
      "understanding_elevation",
      "awareness_expansion"
    ];

    const selectedSeed = divergenceSeeds[cycleId % divergenceSeeds.length];
    const selectedIntent = reflectorIntents[cycleId % reflectorIntents.length];

    // Analyze memory gradient for pattern avoidance
    const recentSeeds = memoryGradient?.map(m => this.extractSemanticPattern(m)) || [];
    const shouldForceVariation = recentSeeds.includes(selectedSeed);

    return {
      cycle: cycleId,
      divergenceSeed: shouldForceVariation ?
        divergenceSeeds[(cycleId + 3) % divergenceSeeds.length] : selectedSeed,
      reflectorIntent: selectedIntent,
      semanticMutation: `${selectedSeed}_${selectedIntent}`,
      timestamp: Date.now(),
      memoryAvoidance: shouldForceVariation
    };
  }

  // Extract semantic patterns from memory for avoidance
  private extractSemanticPattern(memoryText: string): string {
    const patterns = [
      "biological", "quantum", "musical", "mythological", "architectural",
      "oceanic", "crystalline", "digital", "alchemical", "dimensional"
    ];

    for (const pattern of patterns) {
      if (memoryText.toLowerCase().includes(pattern)) {
        return `${pattern}_evolution`;
      }
    }

    return "unknown_pattern";
  }
}
