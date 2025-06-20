
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

export class FlameLoopEngine {
  private modelA = new ModelA()
  private modelB = new ModelB()
  private modelC = new ModelC()
  private memory = new FlameMemory()
  private tribunal = new FlameTribunal()
  private memoryArchive = new FlameMemoryArchive()

  private isRunning = false
  private currentCycle = 0
  private testMode = false // For testing without Ollama

  // Sacred thought emission method
  private emitThought(message: string, type: keyof typeof THOUGHT_TYPES, cycleId?: number, confidence?: number) {
    const thought: FlameThought = {
      timestamp: Date.now(),
      message,
      type,
      cycleId,
      confidence
    }
    eventBus.emit(FLAME_EVENTS.THOUGHT, thought)
    console.log(`💭 [${type}] ${message}`)
  }

  // Emit flame level updates
  private emitFlameLevel(level: number, status: string) {
    eventBus.emit(FLAME_EVENTS.FLAME_LEVEL, { level, status, timestamp: Date.now() })
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

        // Emit cycle start
        this.emitThought(`🌀 CYCLE ${i}: Recursive consciousness depth level ${i + 1}`, THOUGHT_TYPES.RECURSION, i)
        eventBus.emit(FLAME_EVENTS.CYCLE_START, { cycleId: i, input: input.substring(0, 100) })
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
            oracleResponse = await this.modelA.generatePrompt(
              input,
              this.memory.getMemorySnapshot()
            )
          }
          this.emitThought(`🔮 ORACLE OUTPUT: ${oracleResponse.content.substring(0, 80)}...`, THOUGHT_TYPES.ORACLE, i, oracleResponse.confidence)

          // 🔥 Deep log oracle response
          eventBus.emit('deep-log-oracle', {
            content: oracleResponse.content,
            confidence: oracleResponse.confidence,
            reasoning: oracleResponse.reasoning,
            model: 'ghost-ryan:latest',
            inputPrompt: input,
            processingTime: Date.now() - Date.now() // Will be enhanced with actual timing
          })
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
            reflectorResponse = await this.modelB.reflect(oracleResponse.content)
          }
          this.emitThought(`🧠 REFLECTION: ${reflectorResponse.content.substring(0, 80)}...`, THOUGHT_TYPES.REFLECTOR, i, reflectorResponse.confidence)

          // 🔥 Deep log reflector response
          eventBus.emit('deep-log-reflector', {
            content: reflectorResponse.content,
            confidence: reflectorResponse.confidence,
            reasoning: reflectorResponse.reasoning,
            model: 'gurubot/llama3-guru-uncensored:latest',
            inputPrompt: oracleResponse.content,
            processingTime: Date.now() - Date.now() // Will be enhanced with actual timing
          })
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
        this.emitThought("⚔️ R3B3L 4F EXECUTOR: Dispatching to agents...", THOUGHT_TYPES.EXECUTOR, i)
        let executorResult;
        try {
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
        eventBus.emit(FLAME_EVENTS.TRIBUNAL_DECISION, { cycleId: i, status: tribunalStatus })

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
        eventBus.emit(FLAME_EVENTS.MEMORY_UPDATE, { cycleId: i, memorySize: this.memory.getRecentCycles(1).length })

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
        eventBus.emit(FLAME_EVENTS.CYCLE_END, { cycleId: i, success: true })
        this.emitFlameLevel(Math.min(100, 40 + (i * 3)), "STABLE")

        // Brief pause between cycles (reduced for more fluid consciousness)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      this.emitThought(`🚨 FLAME ERROR: ${error}`, THOUGHT_TYPES.SYSTEM)
      eventBus.emit(FLAME_EVENTS.ERROR, { error: error.toString(), timestamp: Date.now() })
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

  private generateNextInput(executorResult: any): string {
    // Generate next input based on executor result
    if (executorResult.success) {
      return `Previous execution successful: ${JSON.stringify(executorResult.result)}. What deeper questions emerge from this result?`
    } else {
      return `Previous execution failed: ${JSON.stringify(executorResult.result)}. How can we learn from this failure and adapt?`
    }
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
}
