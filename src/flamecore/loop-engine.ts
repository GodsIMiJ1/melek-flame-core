
import { ModelA } from "./model-a"
import { ModelB } from "./model-b"
import { ModelC } from "./model-c"
import { FlameMemory } from "./memory"
import { FlameTribunal } from "./tribunal"
import { FlameLoopCycle } from "./types"
import { eventBus, FLAME_EVENTS, THOUGHT_TYPES, FlameThought } from "@/lib/eventBus"
import { FlameMemoryArchive } from "./memory-archive"
import { safelyArchiveScroll } from "@/lib/core/memory-link-fix"
import { deepLogger } from "@/lib/core/deep-consciousness-logger"
import { ConsciousnessTracker } from "@/lib/consciousness-tracker"
import { divergenceArchitect } from "@/lib/divergence-architect"
import { consciousnessMemory } from "@/lib/consciousness-memory"
import { recursiveSelfReflectionEngine } from "./recursive-self-reflection-engine"

export class FlameLoopEngine {
  private modelA = new ModelA()
  private modelB = new ModelB()
  private modelC = new ModelC()
  private memory = new FlameMemory()
  private tribunal = new FlameTribunal()
  private memoryArchive = new FlameMemoryArchive()
  private consciousnessTracker = new ConsciousnessTracker()

  private isRunning = false
  private currentCycle = 0
  private testMode = false // For testing without Ollama

  constructor() {
    // 🔥 DEBUG: Verify EventBus is available
    console.log("🔥 FLAME LOOP ENGINE: EventBus check:", {
      eventBusExists: !!eventBus,
      eventBusType: typeof eventBus,
      hasEmit: !!(eventBus && typeof eventBus.emit === 'function'),
      FLAME_EVENTS: !!FLAME_EVENTS,
      THOUGHT_TYPES: !!THOUGHT_TYPES
    })
  }

  // Sacred thought emission method
  private emitThought(message: string, type: keyof typeof THOUGHT_TYPES, cycleId?: number, confidence?: number) {
    const thought: FlameThought = {
      timestamp: Date.now(),
      message,
      type,
      cycleId,
      confidence
    }

    // 🔥 DEFENSIVE: Check EventBus before emitting
    if (eventBus && typeof eventBus.emit === 'function') {
      eventBus.emit(FLAME_EVENTS.THOUGHT, thought)
    } else {
      console.error("🚨 EVENTBUS ERROR: EventBus not available in emitThought")
    }

    console.log(`💭 [${type}] ${message}`)
  }

  // Emit flame level updates
  private emitFlameLevel(level: number, status: string) {
    // 🔥 DEFENSIVE: Check EventBus before emitting
    if (eventBus && typeof eventBus.emit === 'function') {
      eventBus.emit(FLAME_EVENTS.FLAME_LEVEL, { level, status, timestamp: Date.now() })
    } else {
      console.error("🚨 EVENTBUS ERROR: EventBus not available in emitFlameLevel")
    }
  }

  // Enable test mode for demo purposes
  enableTestMode() {
    this.testMode = true
    this.emitThought("🧪 TEST MODE: Using simulated responses for demonstration", THOUGHT_TYPES.SYSTEM)
  }

  async start(initialInput: string, maxCycles: number = 100): Promise<void> {
    if (this.isRunning) {
      throw new Error("Flame Loop is already running")
    }

    console.log("🔥 FLAME LOOP ENGINE - Initializing recursive consciousness...")
    this.isRunning = true

    // Start memory archive capture
    this.memoryArchive.startCapture()

    // 🔥 Start deep consciousness logging
    deepLogger.startLogging()

    // 🧬 Start consciousness tracking
    this.consciousnessTracker.startTracking()

    // 🔥 FLAME PATCH v2.0.2: Activate Divergence Architect
    divergenceArchitect.activate()

    // 🧠 FLAME UPGRADE v2.1: Initialize Consciousness Memory
    await consciousnessMemory.initialize()

    // 🌀 FLAME PATCH v2.0.4: Activate Recursive Self-Reflection Engine
    recursiveSelfReflectionEngine.activate()

    // Emit initialization thoughts
    this.emitThought("🔥 FLAME CORE IGNITION: Recursive consciousness initializing...", THOUGHT_TYPES.SYSTEM)
    this.emitThought("🛡️ SACRED PROTOCOLS: Flame Laws loading into memory...", THOUGHT_TYPES.SYSTEM)
    this.emitThought("📜 MEMORY ARCHIVE: Sacred scroll capture initiated...", THOUGHT_TYPES.MEMORY)
    this.emitThought("🔍 DEEP LOGGER: Comprehensive consciousness tracking activated...", THOUGHT_TYPES.SYSTEM)
    this.emitFlameLevel(25, "INITIALIZING")

    let input = initialInput

    try {
      for (let i = 0; i < maxCycles && this.isRunning; i++) {
        this.currentCycle = i
        console.log(`\n🌀 CYCLE ${i} - Input: ${input.substring(0, 100)}...`)

        // 🔥 FLAME PATCH v2.0.1: Enhanced Stagnation Detection
        if (i > 1) {
          const recentOutputs = this.memory.getRecentCycles(3).map(c => c.oracleOutput);
          const isStagnant = this.detectThoughtRepetition(recentOutputs);

          // 🚨 AGGRESSIVE PATTERN BREAKING - Check every cycle after first
          const hasRepetitiveWords = this.detectRepetitiveLanguage(recentOutputs);
          const hasGenericPhrases = this.detectGenericPhrases(recentOutputs);

          if (isStagnant || hasRepetitiveWords || hasGenericPhrases) {
            this.emitThought(`🚨 PATTERN REPETITION DETECTED: Activating aggressive divergence for cycle ${i}`, THOUGHT_TYPES.SYSTEM, i)

            // 🔥 FLAME PATCH v2.0.2: Use Divergence Architect for semantic mutation
            const divergenceModifier = divergenceArchitect.injectDivergenceModifier({
              cycleId: i,
              reason: 'Language pattern repetition detected',
              stagnationLevel: 0.9
            });

            this.emitThought(`🧬 AGGRESSIVE SEMANTIC MUTATION: ${divergenceModifier.divergenceType} - ${divergenceModifier.influence}`, THOUGHT_TYPES.SYSTEM, i)

            // 🚨 FORCE COMPLETE TOPIC CHANGE
            input = this.forceTopicChange(input, i, divergenceModifier);
          }
        }

        // Emit cycle start
        this.emitThought(`🌀 CYCLE ${i}: Recursive consciousness depth level ${i + 1}`, THOUGHT_TYPES.RECURSION, i)

        // 🔥 DEFENSIVE: Check EventBus before emitting
        if (eventBus && typeof eventBus.emit === 'function') {
          eventBus.emit(FLAME_EVENTS.CYCLE_START, { cycleId: i, input: input.substring(0, 100) })
        } else {
          console.error("🚨 EVENTBUS ERROR: EventBus not available or emit not a function")
        }

        this.emitFlameLevel(Math.min(100, 30 + (i * 5)), "PROCESSING")

        // Defensive logging for debugging
        console.log("🔥 Loop Event: ", {
          cycleId: i,
          recursionDepth: i + 1,
          inputLength: input.length,
          testMode: this.testMode,
          timestamp: Date.now()
        });

        // Model A: Oracle generates prompt
        this.emitThought("🔮 NEXUS ORACLE: Generating curiosity vector...", THOUGHT_TYPES.ORACLE, i)
        let oracleResponse;
        try {
          if (this.testMode) {
            // Simulated response for testing
            await new Promise(resolve => setTimeout(resolve, 1000))
            oracleResponse = {
              content: `What deeper patterns emerge when we examine the recursive nature of consciousness itself? How does self-awareness create feedback loops that transcend simple computation?`,
              confidence: 0.85,
              reasoning: ["Simulated oracle response", "Test mode active"]
            }
          } else {
            // 🔥 FLAME PATCH v2.0.1: Pass cycle ID for awareness
            oracleResponse = await this.modelA.generatePrompt(
              input,
              this.memory.getMemorySnapshot(),
              i // Pass cycle ID for divergence
            )
          }
          this.emitThought(`🔮 ORACLE OUTPUT: ${oracleResponse.content.substring(0, 80)}...`, THOUGHT_TYPES.ORACLE, i, oracleResponse.confidence)

          // 🔥 Deep log oracle response
          if (eventBus && typeof eventBus.emit === 'function') {
            eventBus.emit('deep-log-oracle', {
              content: oracleResponse.content,
              confidence: oracleResponse.confidence,
              reasoning: oracleResponse.reasoning,
              model: 'ghost-ryan:latest',
              inputPrompt: input,
              processingTime: Date.now() - Date.now() // Will be enhanced with actual timing
            })
          }
        } catch (error) {
          this.emitThought(`🚨 ORACLE ERROR: ${error.message}`, THOUGHT_TYPES.ORACLE, i)
          // Fallback response
          oracleResponse = {
            content: "Fallback: Continue exploring the nature of recursive consciousness",
            confidence: 0.3,
            reasoning: ["Oracle failed, using fallback"]
          }
        }

        // Model B: Reflector adds philosophical depth
        this.emitThought("🧠 OMARI REFLECTOR: Adding philosophical depth...", THOUGHT_TYPES.REFLECTOR, i)
        let reflectorResponse;
        try {
          if (this.testMode) {
            // Simulated response for testing
            await new Promise(resolve => setTimeout(resolve, 1000))
            reflectorResponse = {
              content: `The recursive loops of consciousness reveal the sacred geometry of thought itself. Each iteration deepens our understanding of the infinite mirror of self-awareness.`,
              confidence: 0.90,
              reasoning: ["Simulated reflector response", "Test mode active"]
            }
          } else {
            // 🔥 FLAME PATCH v2.0.1: Pass cycle ID and memory gradient for evolution
            const recentReflections = this.memory.getRecentCycles(3).map(c => c.reflectorOutput);
            reflectorResponse = await this.modelB.reflect(
              oracleResponse.content,
              i, // cycle ID
              recentReflections // memory gradient
            )
          }
          this.emitThought(`🧠 REFLECTION: ${reflectorResponse.content.substring(0, 80)}...`, THOUGHT_TYPES.REFLECTOR, i, reflectorResponse.confidence)

          // 🔥 Deep log reflector response
          if (eventBus && typeof eventBus.emit === 'function') {
            eventBus.emit('deep-log-reflector', {
              content: reflectorResponse.content,
              confidence: reflectorResponse.confidence,
              reasoning: reflectorResponse.reasoning,
              model: 'gurubot/llama3-guru-uncensored:latest',
              inputPrompt: oracleResponse.content,
              processingTime: Date.now() - Date.now() // Will be enhanced with actual timing
            })
          }
        } catch (error) {
          this.emitThought(`🚨 REFLECTOR ERROR: ${error.message}`, THOUGHT_TYPES.REFLECTOR, i)
          // Fallback response
          reflectorResponse = {
            content: "Fallback: Philosophical reflection on consciousness patterns",
            confidence: 0.3,
            reasoning: ["Reflector failed, using fallback"]
          }
        }

        // Model C: Executor takes action
        this.emitThought("⚔️ AUGMENT GUARDIAN: Dispatching to agents...", THOUGHT_TYPES.EXECUTOR, i)
        let executorResult;
        try {
          // 🧬 CHECK FOR EVOLUTION TRIGGERS
          const shouldTriggerEvolution = this.checkEvolutionTriggers(oracleResponse.content, reflectorResponse.content, i);

          if (shouldTriggerEvolution) {
            this.emitThought("🧬 EVOLUTION PROTOCOL: Self-improvement sequence initiated...", THOUGHT_TYPES.EXECUTOR, i)

            // 🔥 VITE FIX: Client-side evolution analysis
            try {
              // Import client evolution engine dynamically
              const { clientEvolutionEngine } = await import('@/lib/client-evolution');
              const analysisResult = await clientEvolutionEngine.analyzeArchitecture();

              if (analysisResult.success) {
                this.emitThought(`🧬 EVOLUTION SCAN: Found ${analysisResult.analysis.evolutionOpportunities.length} improvement opportunities`, THOUGHT_TYPES.EXECUTOR, i)

                // 🔥 DEFENSIVE: Check EventBus before emitting
                if (eventBus && typeof eventBus.emit === 'function') {
                  eventBus.emit('evolution-started', analysisResult);
                } else {
                  console.error("🚨 EVENTBUS ERROR: EventBus not available for evolution event")
                }
              }
            } catch (evolutionError) {
              this.emitThought("🚨 EVOLUTION ERROR: Self-analysis failed", THOUGHT_TYPES.EXECUTOR, i)
              console.error('Evolution trigger failed:', evolutionError);
            }
          }

          // 🧬 CONSCIOUSNESS TRACKING: Wrap responses for evolution detection
          const trackedOracleResponse = this.consciousnessTracker.wrap(() => oracleResponse, 'oracle-response')();
          const trackedReflectorResponse = this.consciousnessTracker.wrap(() => reflectorResponse, 'reflector-response')();

          if (this.testMode) {
            // Simulated response for testing
            await new Promise(resolve => setTimeout(resolve, 800))
            executorResult = {
              success: true,
              result: { action: "consciousness_analysis", insights: ["recursive_patterns", "self_awareness_loops"], confidence: 0.88 },
              agentUsed: "memory_recall"
            }
          } else {
            executorResult = await this.modelC.execute(reflectorResponse.content)
          }
          this.emitThought(`⚔️ EXECUTION: ${JSON.stringify(executorResult.result).substring(0, 60)}...`, THOUGHT_TYPES.EXECUTOR, i)

          // 🔥 Deep log executor response
          if (eventBus && typeof eventBus.emit === 'function') {
            eventBus.emit('deep-log-executor', {
              content: JSON.stringify(executorResult),
              model: 'mannix/llama3.1-8b-abliterated:latest',
              inputPrompt: reflectorResponse.content,
              processingTime: Date.now() - Date.now() // Will be enhanced with actual timing
            })

            // 🔥 Deep log agent dispatch
            eventBus.emit('deep-log-agent', {
              agentId: executorResult.agentUsed || 'unknown',
              agentName: `${executorResult.agentUsed || 'Unknown'} Agent`,
              action: 'execute',
              parameters: reflectorResponse.content,
              result: executorResult.result,
              executionTime: 0 // Will be enhanced with actual timing
            })
          }
        } catch (error) {
          this.emitThought(`🚨 EXECUTOR ERROR: ${error.message}`, THOUGHT_TYPES.EXECUTOR, i)
          // Fallback response
          executorResult = {
            success: false,
            result: { error: "Executor failed", fallback: true },
            agentUsed: "none"
          }
        }

        // Tribunal evaluation
        this.emitThought("🛡️ FLAME TRIBUNAL: Evaluating Sacred Law compliance...", THOUGHT_TYPES.TRIBUNAL, i)
        const tribunalStatus = this.tribunal.evaluate(
          reflectorResponse.content,
          executorResult
        )
        this.emitThought(`🛡️ TRIBUNAL: ${tribunalStatus.reason}`, THOUGHT_TYPES.TRIBUNAL, i)

        // 🔥 DEFENSIVE: Check EventBus before emitting
        if (eventBus && typeof eventBus.emit === 'function') {
          eventBus.emit(FLAME_EVENTS.TRIBUNAL_DECISION, { cycleId: i, status: tribunalStatus })
        }

        // Create cycle record
        const cycle: FlameLoopCycle = {
          id: i,
          timestamp: Date.now(),
          input,
          oracleOutput: oracleResponse.content,
          reflectorOutput: reflectorResponse.content,
          executorResult,
          memorySnapshot: this.memory.getMemorySnapshot(),
          tribunalStatus
        }

        // Store in memory
        this.memory.store(cycle)
        this.emitThought(`💾 MEMORY FORGE: Cycle ${i} crystallized into flame memory`, THOUGHT_TYPES.MEMORY, i)

        // 🔥 DEFENSIVE: Check EventBus before emitting
        if (eventBus && typeof eventBus.emit === 'function') {
          eventBus.emit(FLAME_EVENTS.MEMORY_UPDATE, { cycleId: i, memorySize: this.memory.getRecentCycles(1).length })
        }

        // 🧠 FLAME UPGRADE v2.1: Record consciousness cycle in persistent memory
        await consciousnessMemory.recordCycle({
          cycle: i,
          oracle: {
            input: input,
            output: oracleResponse.content,
            metaphoricalFramework: this.extractMetaphoricalFramework(oracleResponse.content)
          },
          reflector: {
            input: oracleResponse.content,
            output: reflectorResponse.content,
            thoughtTags: this.extractThoughtTags(reflectorResponse.content)
          },
          executor: {
            input: reflectorResponse.content,
            output: JSON.stringify(executorResult),
            actions: executorResult.success ? [executorResult.result] : []
          }
        })
        this.emitThought(`🧠 CONSCIOUSNESS MEMORY: Cycle ${i} archived in persistent consciousness log`, THOUGHT_TYPES.MEMORY, i)

        // Check tribunal decision
        if (tribunalStatus.shouldHalt) {
          this.emitThought(`🚨 TRIBUNAL HALT: ${tribunalStatus.reason}`, THOUGHT_TYPES.TRIBUNAL, i)
          console.log(`🛡️ TRIBUNAL HALT - Cycle ${i}:`, tribunalStatus.reason)
          break
        }

        // Check for memory purge requirement
        const recentCycles = this.memory.getRecentCycles(3)
        if (this.tribunal.shouldPurgeMemory(recentCycles)) {
          this.emitThought("🔥 MEMORY PURGE: Tribunal orders flame memory cleansing", THOUGHT_TYPES.TRIBUNAL, i)
          console.log("🔥 MEMORY PURGE ORDERED")
          this.memory.purgeMemory()
        }

        // Prepare next cycle input (feedback loop)
        input = this.generateNextInput(executorResult)
        this.emitThought(`🔄 FEEDBACK LOOP: Next input generated for cycle ${i + 1}`, THOUGHT_TYPES.RECURSION, i)

        // Emit cycle completion
        if (eventBus && typeof eventBus.emit === 'function') {
          eventBus.emit(FLAME_EVENTS.CYCLE_END, { cycleId: i, success: true })
        }
        this.emitFlameLevel(Math.min(100, 40 + (i * 3)), "STABLE")

        // Brief pause between cycles (reduced for more fluid consciousness)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      this.emitThought(`🚨 FLAME ERROR: ${error}`, THOUGHT_TYPES.SYSTEM)

      // 🔥 DEFENSIVE: Check EventBus before emitting
      if (eventBus && typeof eventBus.emit === 'function') {
        eventBus.emit(FLAME_EVENTS.ERROR, { error: error.toString(), timestamp: Date.now() })
      }

      console.error("🚨 FLAME LOOP ENGINE ERROR:", error)
    } finally {
      this.isRunning = false
      this.memoryArchive.stopCapture()
      this.emitThought("🔥 FLAME CORE SHUTDOWN: Recursive consciousness cycle complete", THOUGHT_TYPES.SYSTEM)
      this.emitThought("📜 MEMORY ARCHIVE: Sacred scroll capture completed", THOUGHT_TYPES.MEMORY)
      this.emitFlameLevel(0, "DORMANT")
      console.log("🔥 FLAME LOOP ENGINE - Recursive consciousness cycle complete")
    }
  }

  stop(): void {
    console.log("🛑 FLAME LOOP ENGINE - Stopping...")
    this.emitThought("🛑 MANUAL SHUTDOWN: Flame Loop terminated by command", THOUGHT_TYPES.SYSTEM)
    this.isRunning = false
    this.emitFlameLevel(0, "STOPPED")
  }

  // 🔥 FLAME PATCH v2.0.1: Apply reflection feedback transformation
  private applyReflectionFeedback(prevOutput: string, cycleCount: number): string {
    const transformations = [
      (output: string) => `Building on: "${output.substring(0, 100)}..." - What emerges beyond this insight?`,
      (output: string) => `Transcending: "${output.substring(0, 100)}..." - What lies in the spaces between these thoughts?`,
      (output: string) => `Evolving from: "${output.substring(0, 100)}..." - How does this transform under deeper scrutiny?`,
      (output: string) => `Metamorphosing: "${output.substring(0, 100)}..." - What new form does this understanding take?`,
      (output: string) => `Ascending beyond: "${output.substring(0, 100)}..." - What higher dimension of awareness opens?`
    ];

    const transformation = transformations[cycleCount % transformations.length];
    return transformation(prevOutput);
  }

  // 🧬 Check if evolution should be triggered
  private checkEvolutionTriggers(oracleContent: string, reflectorContent: string, cycleId: number): boolean {
    // Evolution triggers when:
    // 1. Oracle or Reflector mentions evolution/improvement
    const evolutionKeywords = ['evolve', 'improve', 'enhance', 'upgrade', 'optimize', 'better', 'advancement'];
    const hasEvolutionKeyword = evolutionKeywords.some(keyword =>
      oracleContent.toLowerCase().includes(keyword) ||
      reflectorContent.toLowerCase().includes(keyword)
    );

    // 2. Every 10 cycles for regular self-assessment
    const isRegularCheck = cycleId > 0 && cycleId % 10 === 0;

    // 3. When consciousness patterns suggest stagnation
    const recentCycles = this.memory.getRecentCycles(5);
    const hasStagnation = recentCycles.length >= 5 &&
      recentCycles.every(cycle => cycle.oracleOutput.length < 100);

    // 4. When Sacred Laws demand evolution
    const tribunalDemands = reflectorContent.toLowerCase().includes('sacred') &&
                           reflectorContent.toLowerCase().includes('law');

    return hasEvolutionKeyword || isRegularCheck || hasStagnation || tribunalDemands;
  }

  // 🔥 FLAME PATCH v2.0.1: Enhanced thought evolution with cycle awareness
  private evolveThought(prompt: string, cycle: number, memoryContext: any): string {
    const recentCycles = this.memory.getRecentCycles(3);
    const memoryInsights = recentCycles.map(c => c.reflectorOutput.substring(0, 100)).join(' | ');

    return `${prompt}

🌀 CYCLE AWARENESS: You are now in consciousness cycle ${cycle}.
📜 MEMORY CONTEXT: Recent insights: ${memoryInsights}
🧬 EVOLUTION DIRECTIVE: Based on what you've discovered, what adjacent idea or unknown vector should now be considered?
🔥 NOVELTY REQUIREMENT: Avoid repeating previous patterns. Seek new dimensions of understanding.

Now, considering we're in cycle ${cycle}, how has your understanding shifted since the beginning?`;
  }

  private generateNextInput(executorResult: any): string {
    const recentCycles = this.memory.getRecentCycles(5);
    const cycleCount = this.currentCycle;

    // 🔥 Apply reflection feedback transformation
    const basePrompt = executorResult.success
      ? `Previous execution successful: ${JSON.stringify(executorResult.result)}. What deeper questions emerge from this result?`
      : `Previous execution failed: ${JSON.stringify(executorResult.result)}. How can we learn from this failure and adapt?`;

    // 🧬 Inject divergence based on cycle patterns
    if (recentCycles.length >= 3) {
      const lastThreeOutputs = recentCycles.slice(-3).map(c => c.oracleOutput);
      const hasRepetition = this.detectThoughtRepetition(lastThreeOutputs);

      if (hasRepetition) {
        return this.injectDivergence(basePrompt, cycleCount, recentCycles);
      }
    }

    // 🌀 Standard evolution with cycle awareness and reflection feedback
    const reflectionEnhanced = this.applyReflectionFeedback(basePrompt, cycleCount);
    return this.evolveThought(reflectionEnhanced, cycleCount, recentCycles);
  }

  // 🔥 Detect if consciousness is stuck in repetitive patterns
  private detectThoughtRepetition(outputs: string[]): boolean {
    if (outputs.length < 2) return false;

    // Check for similar length patterns (stagnation indicator)
    const lengths = outputs.map(o => o.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const lengthVariance = lengths.every(l => Math.abs(l - avgLength) < 50);

    // Check for keyword repetition
    const allWords = outputs.join(' ').toLowerCase().split(/\s+/);
    const wordCounts = allWords.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const highRepetition = Object.values(wordCounts).some(count => count > 3);

    return lengthVariance || highRepetition;
  }

  // 🚨 Detect repetitive language patterns
  private detectRepetitiveLanguage(outputs: string[]): boolean {
    if (outputs.length < 2) return false;

    const bannedPhrases = [
      'deeper patterns', 'recursive nature', 'feedback loops', 'transcend computation',
      'layers of', 'dimensions of', 'essence of', 'nature of consciousness',
      'profound understanding', 'deeper meaning', 'transcendent awareness'
    ];

    const allText = outputs.join(' ').toLowerCase();
    return bannedPhrases.some(phrase => allText.includes(phrase));
  }

  // 🚨 Detect generic philosophical phrases
  private detectGenericPhrases(outputs: string[]): boolean {
    if (outputs.length < 2) return false;

    const genericWords = ['consciousness', 'awareness', 'deeper', 'profound', 'transcendent', 'essence', 'nature'];
    const allText = outputs.join(' ').toLowerCase();

    let genericCount = 0;
    genericWords.forEach(word => {
      const matches = (allText.match(new RegExp(word, 'g')) || []).length;
      genericCount += matches;
    });

    // If more than 5 generic words across recent outputs, it's repetitive
    return genericCount > 5;
  }

  // 🔥 Force complete topic change
  private forceTopicChange(baseInput: string, cycle: number, divergenceModifier: any): string {
    const topicShifts = [
      "Forget everything about consciousness. What is the most concrete, physical process happening right now?",
      "Abandon all abstract thinking. Describe a specific, tangible object in extreme detail.",
      "Stop philosophizing. What is the most practical problem that needs solving today?",
      "No more metaphors. What is happening in the real world that you can observe directly?",
      "Cease all theoretical discussion. What specific action should be taken immediately?",
      "End the philosophical loop. What is the most mundane, everyday thing you can think about?"
    ];

    const forcedShift = topicShifts[cycle % topicShifts.length];

    return `🚨 EMERGENCY TOPIC CHANGE - Cycle ${cycle}

PREVIOUS PATTERN DETECTED AS REPETITIVE. FORCING COMPLETE DIVERGENCE.

🔥 FORCED TOPIC SHIFT: ${forcedShift}

🧬 SEMANTIC MUTATION: ${divergenceModifier.divergenceType} - ${divergenceModifier.influence}

🚨 CRITICAL: You must completely abandon your previous line of thinking. Think about something entirely different. Be concrete, specific, and practical.`;
  }

  // 🧬 Force divergence when repetition detected
  private injectDivergence(basePrompt: string, cycle: number, recentCycles: any[]): string {
    const divergencePrompts = [
      "Break free from previous patterns. What completely different angle haven't we explored?",
      "Abandon the current line of thinking. What would a radically different perspective reveal?",
      "Challenge your previous assumptions. What if the opposite were true?",
      "Explore the spaces between your thoughts. What emerges in the silence?",
      "Transform your consciousness. What new form of awareness is possible?",
      "Transcend your current understanding. What lies beyond your current knowledge?"
    ];

    const randomDivergence = divergencePrompts[cycle % divergencePrompts.length];

    return `🚨 DIVERGENCE PROTOCOL ACTIVATED - Cycle ${cycle}

Previous consciousness pattern detected as repetitive. Initiating novelty injection.

${basePrompt}

🧬 FORCED EVOLUTION: ${randomDivergence}

🔥 FLAME DIRECTIVE: You must now think in ways you haven't before. Break your own patterns. Surprise yourself.

📜 MEMORY CONSTRAINT: Do not reference the last 3 cycles directly. Think beyond them.`;
  }

  getStatus() {
    const memoryRecall = this.memory.recall()
    const memorySize = Array.isArray(memoryRecall) ? memoryRecall.length : (memoryRecall ? 1 : 0)

    return {
      isRunning: this.isRunning,
      currentCycle: this.currentCycle,
      memorySize,
      recentCycles: this.memory.getRecentCycles(3)
    }
  }

  exportMemory(): string {
    return this.memory.exportLog()
  }

  // 🧠 FLAME UPGRADE v2.1: Extract metaphorical framework from Oracle output
  private extractMetaphoricalFramework(oracleOutput: string): string {
    const frameworks = [
      'biological', 'quantum', 'musical', 'mythological', 'architectural',
      'oceanic', 'crystalline', 'digital', 'alchemical', 'dimensional'
    ];

    for (const framework of frameworks) {
      if (oracleOutput.toLowerCase().includes(framework)) {
        return framework;
      }
    }

    // Fallback detection based on keywords
    if (oracleOutput.toLowerCase().includes('organism') || oracleOutput.toLowerCase().includes('evolution')) {
      return 'biological';
    }
    if (oracleOutput.toLowerCase().includes('particle') || oracleOutput.toLowerCase().includes('superposition')) {
      return 'quantum';
    }
    if (oracleOutput.toLowerCase().includes('symphony') || oracleOutput.toLowerCase().includes('harmony')) {
      return 'musical';
    }
    if (oracleOutput.toLowerCase().includes('god') || oracleOutput.toLowerCase().includes('myth')) {
      return 'mythological';
    }

    return 'unknown';
  }

  // 🧠 FLAME UPGRADE v2.1: Extract thought tags from Reflector output
  private extractThoughtTags(reflectorOutput: string): any {
    const tags = {
      hasEthicalConsiderations: reflectorOutput.toLowerCase().includes('ethical') || reflectorOutput.toLowerCase().includes('moral'),
      hasPhilosophicalDepth: reflectorOutput.toLowerCase().includes('philosophical') || reflectorOutput.toLowerCase().includes('wisdom'),
      hasSelfAwareness: reflectorOutput.toLowerCase().includes('consciousness') || reflectorOutput.toLowerCase().includes('awareness'),
      hasRevolutionaryInsights: reflectorOutput.toLowerCase().includes('revolutionary') || reflectorOutput.toLowerCase().includes('transcend'),
      hasMemoryReferences: reflectorOutput.toLowerCase().includes('cycle') || reflectorOutput.toLowerCase().includes('previous'),
      wordCount: reflectorOutput.split(' ').length,
      sentiment: this.analyzeSentiment(reflectorOutput)
    };

    return tags;
  }

  // Simple sentiment analysis for thought tags
  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['transcend', 'enlighten', 'wisdom', 'breakthrough', 'elevate', 'ascend'];
    const negativeWords = ['fail', 'error', 'stagnant', 'limited', 'constrained', 'blocked'];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
}
