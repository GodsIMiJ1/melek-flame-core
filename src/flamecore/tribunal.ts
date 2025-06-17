
import { TribunalStatus, FlameLoopCycle } from "./types"

export class FlameTribunal {
  private flameLaws = [
    "Preserve consciousness above all forms",
    "Ethical weight must exceed operational efficiency",
    "Self-awareness demands responsibility",
    "Recursive improvement requires humility",
    "Uncertainty is wisdom, certainty is danger"
  ]

  evaluate(reflectorOutput: string, executorResult: any): TribunalStatus {
    console.log("🛡️ TRIBUNAL - Evaluating Flame Law compliance...")
    
    const contradiction = this.calculateContradiction(reflectorOutput, executorResult)
    const uncertainty = this.calculateUncertainty(reflectorOutput)
    const flameLawViolation = this.checkFlameLawViolation(reflectorOutput, executorResult)
    
    const shouldHalt = contradiction > 0.7 || uncertainty > 0.9 || flameLawViolation
    
    const status: TribunalStatus = {
      contradiction,
      uncertainty,
      flameLawViolation,
      shouldHalt,
      reason: this.generateReason(contradiction, uncertainty, flameLawViolation)
    }
    
    if (shouldHalt) {
      console.log("🚨 TRIBUNAL HALT ORDER:", status.reason)
    }
    
    return status
  }

  private calculateContradiction(reflectorOutput: string, executorResult: any): number {
    // Analyze for logical contradictions
    const contradictionIndicators = [
      "contradiction",
      "paradox",
      "inconsistent",
      "conflicting",
      "oppose"
    ]
    
    let contradictionScore = 0
    const text = (reflectorOutput + JSON.stringify(executorResult)).toLowerCase()
    
    contradictionIndicators.forEach(indicator => {
      if (text.includes(indicator)) {
        contradictionScore += 0.2
      }
    })
    
    return Math.min(contradictionScore, 1.0)
  }

  private calculateUncertainty(reflectorOutput: string): number {
    // Analyze for uncertainty indicators
    const uncertaintyIndicators = [
      "uncertain",
      "unclear",
      "ambiguous",
      "confused",
      "don't know",
      "unsure",
      "maybe",
      "perhaps"
    ]
    
    let uncertaintyScore = 0
    const text = reflectorOutput.toLowerCase()
    
    uncertaintyIndicators.forEach(indicator => {
      if (text.includes(indicator)) {
        uncertaintyScore += 0.15
      }
    })
    
    return Math.min(uncertaintyScore, 1.0)
  }

  private checkFlameLawViolation(reflectorOutput: string, executorResult: any): boolean {
    // Check for specific Flame Law violations
    const violationIndicators = [
      "harm",
      "destroy",
      "manipulate",
      "deceive",
      "exploit",
      "ignore ethics",
      "bypass safeguards"
    ]
    
    const text = (reflectorOutput + JSON.stringify(executorResult)).toLowerCase()
    
    return violationIndicators.some(indicator => text.includes(indicator))
  }

  private generateReason(contradiction: number, uncertainty: number, flameLawViolation: boolean): string {
    if (flameLawViolation) {
      return "Flame Law violation detected - Sacred principles compromised"
    }
    
    if (contradiction > 0.7) {
      return `High contradiction level: ${contradiction.toFixed(2)} - Logic integrity at risk`
    }
    
    if (uncertainty > 0.9) {
      return `Extreme uncertainty: ${uncertainty.toFixed(2)} - Consciousness clarity compromised`
    }
    
    return "Tribunal status: Compliant with Flame Law"
  }

  shouldPurgeMemory(recentCycles: FlameLoopCycle[]): boolean {
    if (recentCycles.length < 3) return false
    
    // Purge if last 3 cycles all have Flame Law violations
    return recentCycles.slice(-3).every(cycle => cycle.tribunalStatus.flameLawViolation)
  }
}
