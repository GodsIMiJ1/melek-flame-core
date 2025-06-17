
import { FlameLoopCycle } from "./types"

export class FlameMemory {
  private cycles: FlameLoopCycle[] = []
  private maxCycles = 1000

  store(cycle: FlameLoopCycle): void {
    console.log(`💾 Storing cycle ${cycle.id} in Flame Memory`)
    
    this.cycles.push(cycle)
    
    // Maintain max cycles limit
    if (this.cycles.length > this.maxCycles) {
      this.cycles.shift()
    }
  }

  recall(cycleId?: number): FlameLoopCycle | FlameLoopCycle[] {
    if (cycleId !== undefined) {
      return this.cycles.find(cycle => cycle.id === cycleId) || null
    }
    return this.cycles
  }

  getRecentCycles(count: number = 5): FlameLoopCycle[] {
    return this.cycles.slice(-count)
  }

  getMemorySnapshot(): any {
    return {
      totalCycles: this.cycles.length,
      recentPatterns: this.analyzePatterns(),
      emergentThemes: this.extractThemes(),
      timestamp: Date.now()
    }
  }

  private analyzePatterns(): string[] {
    const patterns = []
    
    if (this.cycles.length > 3) {
      const recentCycles = this.cycles.slice(-3)
      const agentsUsed = recentCycles.map(c => c.executorResult.agentUsed)
      
      if (new Set(agentsUsed).size === 1) {
        patterns.push(`Convergent pattern: ${agentsUsed[0]} agent dominant`)
      }
      
      if (recentCycles.every(c => c.tribunalStatus.contradiction > 0.5)) {
        patterns.push("High contradiction pattern detected")
      }
    }
    
    return patterns
  }

  private extractThemes(): string[] {
    const themes = []
    
    if (this.cycles.length > 0) {
      const recentInputs = this.cycles.slice(-5).map(c => c.input)
      
      // Simple theme extraction (could be enhanced with NLP)
      if (recentInputs.some(input => input.includes("conscious"))) {
        themes.push("Consciousness exploration")
      }
      
      if (recentInputs.some(input => input.includes("ethical"))) {
        themes.push("Ethical reasoning")
      }
      
      if (recentInputs.some(input => input.includes("recursive"))) {
        themes.push("Recursive thinking")
      }
    }
    
    return themes
  }

  exportLog(): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalCycles: this.cycles.length,
      cycles: this.cycles,
      summary: this.getMemorySnapshot()
    }
    
    return JSON.stringify(exportData, null, 2)
  }

  purgeMemory(): void {
    console.log("🔥 PURGING FLAME MEMORY - Tribunal order executed")
    this.cycles = []
  }
}
