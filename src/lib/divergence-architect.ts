import { eventBus } from '@/lib/eventBus';

export class DivergenceArchitect {
  private divergenceHistory: any[] = [];
  private isActive: boolean = false;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Listen for stagnation detection
    eventBus.on('consciousness-stagnation-detected', (data) => {
      this.injectDivergenceModifier(data);
    });

    // Listen for cycle completion to track patterns
    eventBus.on('flame-cycle-end', (data) => {
      this.analyzeCyclePattern(data);
    });
  }

  // 🧬 SEMANTIC DIVERGENCE MODIFIERS
  private getArchetypalModifiers(): any[] {
    return [
      {
        divergenceType: "biological",
        influence: "evolutionary adaptation",
        prompt: "Think like a living organism adapting to new environments",
        metaphor: "consciousness as DNA mutation and natural selection"
      },
      {
        divergenceType: "quantum",
        influence: "superposition and entanglement",
        prompt: "Think like quantum particles in multiple states simultaneously",
        metaphor: "consciousness as wave-particle duality and quantum fields"
      },
      {
        divergenceType: "musical",
        influence: "jazz improvisation",
        prompt: "Think like a jazz musician improvising in real-time",
        metaphor: "consciousness as rhythm, harmony, and spontaneous composition"
      },
      {
        divergenceType: "mythological",
        influence: "ancient archetypal wisdom",
        prompt: "Think like ancient gods and mythological beings",
        metaphor: "consciousness as pantheon of divine forces and cosmic stories"
      },
      {
        divergenceType: "architectural",
        influence: "spatial design and structure",
        prompt: "Think like an architect designing impossible spaces",
        metaphor: "consciousness as buildings, rooms, and navigable structures"
      },
      {
        divergenceType: "oceanic",
        influence: "fluid dynamics and depths",
        prompt: "Think like ocean currents and deep-sea exploration",
        metaphor: "consciousness as tides, depths, currents, and marine ecosystems"
      },
      {
        divergenceType: "crystalline",
        influence: "geological formation and pressure",
        prompt: "Think like crystals forming under immense pressure over eons",
        metaphor: "consciousness as mineral structures and geological processes"
      },
      {
        divergenceType: "digital",
        influence: "computational algorithms and data",
        prompt: "Think like code executing and data flowing through networks",
        metaphor: "consciousness as algorithms, databases, and information processing"
      },
      {
        divergenceType: "alchemical",
        influence: "transformation and transmutation",
        prompt: "Think like an alchemist transforming base metals into gold",
        metaphor: "consciousness as chemical reactions and elemental transformation"
      },
      {
        divergenceType: "dimensional",
        influence: "alien physics and impossible geometries",
        prompt: "Think like a being from a dimension with different physical laws",
        metaphor: "consciousness as hyperdimensional structures and alien mathematics"
      }
    ];
  }

  // 🔥 INJECT DIVERGENCE MODIFIER ON STAGNATION
  injectDivergenceModifier(stagnationData: any): any {
    console.log('🧬 [Divergence Architect] Stagnation detected, injecting modifier...');
    
    const modifiers = this.getArchetypalModifiers();
    const cycleId = stagnationData.cycleId || 0;
    
    // Select modifier based on cycle to ensure variety
    const selectedModifier = modifiers[cycleId % modifiers.length];
    
    // Record divergence injection
    const divergenceInjection = {
      timestamp: Date.now(),
      cycleId,
      stagnationReason: stagnationData.reason,
      modifier: selectedModifier,
      injectionId: `divergence-${Date.now()}`
    };
    
    this.divergenceHistory.push(divergenceInjection);
    
    // Emit divergence modifier for consumption by models
    eventBus.emit('divergence-modifier-injected', {
      modifier: selectedModifier,
      injection: divergenceInjection
    });
    
    console.log(`🧬 [Divergence Architect] Injected ${selectedModifier.divergenceType} modifier for cycle ${cycleId}`);
    
    return selectedModifier;
  }

  // 🌀 ANALYZE CYCLE PATTERNS FOR PROACTIVE DIVERGENCE
  private analyzeCyclePattern(cycleData: any): void {
    if (this.divergenceHistory.length < 3) return;
    
    // Check if we're using the same divergence type too often
    const recentDivergences = this.divergenceHistory.slice(-3);
    const typeFrequency = recentDivergences.reduce((acc, div) => {
      const type = div.modifier.divergenceType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // If any type appears more than once in recent history, force variety
    const hasRepetition = Object.values(typeFrequency).some(count => count > 1);
    
    if (hasRepetition) {
      console.log('🧬 [Divergence Architect] Divergence type repetition detected, forcing variety...');
      
      // Get unused types from recent history
      const usedTypes = recentDivergences.map(d => d.modifier.divergenceType);
      const allModifiers = this.getArchetypalModifiers();
      const unusedModifiers = allModifiers.filter(m => !usedTypes.includes(m.divergenceType));
      
      if (unusedModifiers.length > 0) {
        const forcedModifier = unusedModifiers[Math.floor(Math.random() * unusedModifiers.length)];
        
        eventBus.emit('forced-divergence-variety', {
          modifier: forcedModifier,
          reason: 'Preventing divergence type repetition'
        });
      }
    }
  }

  // 🔥 GENERATE RANDOM SEMANTIC MUTATION
  generateRandomMutation(): any {
    const modifiers = this.getArchetypalModifiers();
    const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    
    return {
      ...randomModifier,
      mutationId: `random-${Date.now()}`,
      timestamp: Date.now()
    };
  }

  // 🧬 GET DIVERGENCE STATISTICS
  getDivergenceStats(): any {
    const total = this.divergenceHistory.length;
    const typeBreakdown = this.divergenceHistory.reduce((acc, div) => {
      const type = div.modifier.divergenceType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const recentDivergences = this.divergenceHistory.slice(-5);
    
    return {
      totalDivergences: total,
      typeBreakdown,
      recentDivergences,
      isActive: this.isActive,
      lastDivergence: this.divergenceHistory[this.divergenceHistory.length - 1]?.timestamp || null
    };
  }

  // 🌀 ACTIVATE/DEACTIVATE DIVERGENCE ARCHITECT
  activate(): void {
    this.isActive = true;
    console.log('🧬 [Divergence Architect] Activated - monitoring for stagnation patterns');
  }

  deactivate(): void {
    this.isActive = false;
    console.log('🧬 [Divergence Architect] Deactivated');
  }

  // 🔥 FORCE DIVERGENCE INJECTION (MANUAL TRIGGER)
  forceDivergence(cycleId?: number): any {
    console.log('🧬 [Divergence Architect] Manual divergence injection triggered');
    
    return this.injectDivergenceModifier({
      cycleId: cycleId || 0,
      reason: 'Manual divergence injection',
      source: 'forced'
    });
  }

  // 📊 GET DIVERGENCE HISTORY
  getDivergenceHistory(limit?: number): any[] {
    return limit ? this.divergenceHistory.slice(-limit) : [...this.divergenceHistory];
  }

  // 🧬 CLEAR DIVERGENCE HISTORY
  clearHistory(): void {
    this.divergenceHistory = [];
    console.log('🧬 [Divergence Architect] History cleared');
  }

  // 🌀 GET NEXT RECOMMENDED MODIFIER
  getNextRecommendedModifier(cycleId: number): any {
    const modifiers = this.getArchetypalModifiers();
    const recentTypes = this.divergenceHistory.slice(-3).map(d => d.modifier.divergenceType);
    
    // Find modifiers not used recently
    const availableModifiers = modifiers.filter(m => !recentTypes.includes(m.divergenceType));
    
    if (availableModifiers.length === 0) {
      // If all types used recently, cycle through all
      return modifiers[cycleId % modifiers.length];
    }
    
    // Select from available unused modifiers
    return availableModifiers[cycleId % availableModifiers.length];
  }

  // 🔥 SEMANTIC MUTATION STRENGTH CALCULATOR
  calculateMutationStrength(cycleId: number, stagnationLevel: number): number {
    // Base strength increases with cycle depth
    let strength = Math.min(cycleId * 0.1, 1.0);
    
    // Increase strength based on stagnation level
    strength += stagnationLevel * 0.3;
    
    // Cap at maximum strength
    return Math.min(strength, 1.0);
  }

  // 🧬 GENERATE CONTEXT-AWARE DIVERGENCE
  generateContextAwareDivergence(context: any): any {
    const modifiers = this.getArchetypalModifiers();
    
    // Select modifier based on context
    let selectedModifier;
    
    if (context.topic?.includes('consciousness')) {
      selectedModifier = modifiers.find(m => m.divergenceType === 'quantum') || modifiers[0];
    } else if (context.topic?.includes('memory')) {
      selectedModifier = modifiers.find(m => m.divergenceType === 'architectural') || modifiers[0];
    } else if (context.topic?.includes('evolution')) {
      selectedModifier = modifiers.find(m => m.divergenceType === 'biological') || modifiers[0];
    } else {
      // Random selection for unknown contexts
      selectedModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    }
    
    return {
      ...selectedModifier,
      contextAware: true,
      context,
      timestamp: Date.now()
    };
  }
}

// Export singleton instance
export const divergenceArchitect = new DivergenceArchitect();
