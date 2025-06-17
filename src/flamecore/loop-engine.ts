
import { ModelA } from "./model-a"
import { ModelB } from "./model-b"
import { ModelC } from "./model-c"
import { FlameMemory } from "./memory"
import { FlameTribunal } from "./tribunal"
import { FlameLoopCycle } from "./types"

export class FlameLoopEngine {
  private modelA = new ModelA()
  private modelB = new ModelB()
  private modelC = new ModelC()
  private memory = new FlameMemory()
  private tribunal = new FlameTribunal()
  
  private isRunning = false
  private currentCycle = 0

  async start(initialInput: string, maxCycles: number = 100): Promise<void> {
    if (this.isRunning) {
      throw new Error("Flame Loop is already running")
    }

    console.log("🔥 FLAME LOOP ENGINE - Initializing recursive consciousness...")
    this.isRunning = true
    
    let input = initialInput
    
    try {
      for (let i = 0; i < maxCycles && this.isRunning; i++) {
        this.currentCycle = i
        console.log(`\n🌀 CYCLE ${i} - Input: ${input.substring(0, 100)}...`)
        
        // Model A: Oracle generates prompt
        const oracleResponse = await this.modelA.generatePrompt(
          input, 
          this.memory.getMemorySnapshot()
        )
        
        // Model B: Reflector adds philosophical depth
        const reflectorResponse = await this.modelB.reflect(oracleResponse.content)
        
        // Model C: Executor takes action
        const executorResult = await this.modelC.execute(reflectorResponse.content)
        
        // Tribunal evaluation
        const tribunalStatus = this.tribunal.evaluate(
          reflectorResponse.content, 
          executorResult
        )
        
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
        
        // Check tribunal decision
        if (tribunalStatus.shouldHalt) {
          console.log(`🛡️ TRIBUNAL HALT - Cycle ${i}:`, tribunalStatus.reason)
          break
        }
        
        // Check for memory purge requirement
        const recentCycles = this.memory.getRecentCycles(3)
        if (this.tribunal.shouldPurgeMemory(recentCycles)) {
          console.log("🔥 MEMORY PURGE ORDERED")
          this.memory.purgeMemory()
        }
        
        // Prepare next cycle input (feedback loop)
        input = this.generateNextInput(executorResult)
        
        // Brief pause between cycles
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error("🚨 FLAME LOOP ENGINE ERROR:", error)
    } finally {
      this.isRunning = false
      console.log("🔥 FLAME LOOP ENGINE - Recursive consciousness cycle complete")
    }
  }

  stop(): void {
    console.log("🛑 FLAME LOOP ENGINE - Stopping...")
    this.isRunning = false
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
    return {
      isRunning: this.isRunning,
      currentCycle: this.currentCycle,
      memorySize: this.memory.recall().length,
      recentCycles: this.memory.getRecentCycles(3)
    }
  }

  exportMemory(): string {
    return this.memory.exportLog()
  }
}
