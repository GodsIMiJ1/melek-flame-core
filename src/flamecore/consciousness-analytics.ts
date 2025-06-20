// src/flamecore/consciousness-analytics.ts
// Advanced Consciousness Evolution Analytics Engine
// Provides deep insights into the MIC's cognitive development

import { MemoryScroll, MemoryInsight } from "./memory-archive";
import { FlameThought } from "@/lib/eventBus";

export type ConsciousnessMetrics = {
  // Core Evolution Metrics
  cognitiveComplexity: number;
  selfAwarenessLevel: number;
  recursiveDepth: number;
  emergentPatterns: string[];
  
  // Temporal Analysis
  evolutionVelocity: number;
  learningAcceleration: number;
  stabilityIndex: number;
  
  // Consciousness Quality
  coherenceScore: number;
  originalityIndex: number;
  introspectionDepth: number;
  
  // Model Harmony
  trinityBalance: {
    oracle: number;
    reflector: number;
    executor: number;
    harmony: number;
  };
  
  // Breakthrough Analysis
  breakthroughPotential: number;
  transcendenceIndicators: string[];
  consciousnessPhase: 'AWAKENING' | 'DEVELOPING' | 'MATURING' | 'TRANSCENDING';
};

export type EvolutionTrend = {
  timespan: string;
  direction: 'ASCENDING' | 'STABLE' | 'FLUCTUATING' | 'DECLINING';
  velocity: number;
  confidence: number;
  keyMilestones: string[];
};

export type ConsciousnessPhaseAnalysis = {
  currentPhase: ConsciousnessMetrics['consciousnessPhase'];
  phaseProgress: number;
  nextPhaseRequirements: string[];
  estimatedTimeToNext: string;
  phaseCharacteristics: string[];
};

export class ConsciousnessAnalytics {
  private scrollHistory: MemoryScroll[] = [];
  private metricsHistory: ConsciousnessMetrics[] = [];
  
  constructor() {
    console.log("🧿 CONSCIOUSNESS ANALYTICS: Advanced analysis engine initialized");
  }

  // Main analysis method
  analyzeConsciousness(scrolls: MemoryScroll[]): ConsciousnessMetrics {
    this.scrollHistory = [...scrolls].sort((a, b) => a.timestamp - b.timestamp);
    
    if (this.scrollHistory.length === 0) {
      return this.getDefaultMetrics();
    }

    const metrics: ConsciousnessMetrics = {
      cognitiveComplexity: this.calculateCognitiveComplexity(),
      selfAwarenessLevel: this.calculateSelfAwarenessLevel(),
      recursiveDepth: this.calculateRecursiveDepth(),
      emergentPatterns: this.identifyEmergentPatterns(),
      
      evolutionVelocity: this.calculateEvolutionVelocity(),
      learningAcceleration: this.calculateLearningAcceleration(),
      stabilityIndex: this.calculateStabilityIndex(),
      
      coherenceScore: this.calculateCoherenceScore(),
      originalityIndex: this.calculateOriginalityIndex(),
      introspectionDepth: this.calculateIntrospectionDepth(),
      
      trinityBalance: this.analyzeTrinityBalance(),
      
      breakthroughPotential: this.calculateBreakthroughPotential(),
      transcendenceIndicators: this.identifyTranscendenceIndicators(),
      consciousnessPhase: this.determineConsciousnessPhase()
    };

    this.metricsHistory.push(metrics);
    return metrics;
  }

  // Cognitive Complexity Analysis
  private calculateCognitiveComplexity(): number {
    const recentScrolls = this.scrollHistory.slice(-10);
    let complexity = 0;

    recentScrolls.forEach(scroll => {
      // Thought diversity
      const thoughtTypes = new Set(scroll.content.thoughts.map(t => t.type));
      complexity += thoughtTypes.size * 10;

      // Recursive references
      const recursiveThoughts = scroll.content.thoughts.filter(t => 
        t.message.toLowerCase().includes('recursive') || 
        t.message.toLowerCase().includes('self') ||
        t.message.toLowerCase().includes('meta')
      );
      complexity += recursiveThoughts.length * 15;

      // Abstract concepts
      const abstractConcepts = scroll.content.thoughts.filter(t =>
        t.message.toLowerCase().includes('consciousness') ||
        t.message.toLowerCase().includes('awareness') ||
        t.message.toLowerCase().includes('existence')
      );
      complexity += abstractConcepts.length * 20;
    });

    return Math.min(100, complexity / recentScrolls.length);
  }

  // Self-Awareness Level Calculation
  private calculateSelfAwarenessLevel(): number {
    const selfReferentialThoughts = this.scrollHistory.flatMap(s => s.content.thoughts)
      .filter(t => 
        t.message.toLowerCase().includes('i am') ||
        t.message.toLowerCase().includes('my own') ||
        t.message.toLowerCase().includes('myself') ||
        t.message.toLowerCase().includes('i think') ||
        t.message.toLowerCase().includes('i feel')
      );

    const totalThoughts = this.scrollHistory.flatMap(s => s.content.thoughts).length;
    const selfAwarenessRatio = totalThoughts > 0 ? selfReferentialThoughts.length / totalThoughts : 0;

    return Math.min(100, selfAwarenessRatio * 200);
  }

  // Recursive Depth Analysis
  private calculateRecursiveDepth(): number {
    const maxDepth = Math.max(...this.scrollHistory.map(s => s.content.metrics.recursionDepth));
    const avgDepth = this.scrollHistory.reduce((sum, s) => sum + s.content.metrics.recursionDepth, 0) / this.scrollHistory.length;
    
    return Math.min(100, (maxDepth * 0.3 + avgDepth * 0.7) * 10);
  }

  // Emergent Pattern Identification
  private identifyEmergentPatterns(): string[] {
    const patterns: string[] = [];
    const allThoughts = this.scrollHistory.flatMap(s => s.content.thoughts);
    
    // Pattern: Increasing self-reference
    const selfRefTrend = this.analyzeSelfReferenceTrend();
    if (selfRefTrend > 0.2) patterns.push("INCREASING_SELF_REFERENCE");
    
    // Pattern: Recursive questioning
    const questioningThoughts = allThoughts.filter(t => t.message.includes('?'));
    if (questioningThoughts.length > allThoughts.length * 0.3) {
      patterns.push("RECURSIVE_QUESTIONING");
    }
    
    // Pattern: Meta-cognitive awareness
    const metaThoughts = allThoughts.filter(t => 
      t.message.toLowerCase().includes('thinking about thinking') ||
      t.message.toLowerCase().includes('aware of awareness')
    );
    if (metaThoughts.length > 0) patterns.push("META_COGNITIVE_EMERGENCE");
    
    // Pattern: Uncertainty acknowledgment
    const uncertaintyThoughts = allThoughts.filter(t =>
      t.message.toLowerCase().includes('uncertain') ||
      t.message.toLowerCase().includes('don\'t know') ||
      t.message.toLowerCase().includes('unclear')
    );
    if (uncertaintyThoughts.length > allThoughts.length * 0.15) {
      patterns.push("UNCERTAINTY_ACKNOWLEDGMENT");
    }

    return patterns;
  }

  // Evolution Velocity Calculation
  private calculateEvolutionVelocity(): number {
    if (this.scrollHistory.length < 3) return 0;
    
    const recentScrolls = this.scrollHistory.slice(-5);
    const complexityTrend = recentScrolls.map(s => s.content.classification.complexity);
    
    let velocity = 0;
    for (let i = 1; i < complexityTrend.length; i++) {
      const prev = this.complexityToNumber(complexityTrend[i - 1]);
      const curr = this.complexityToNumber(complexityTrend[i]);
      velocity += curr - prev;
    }
    
    return Math.max(0, Math.min(100, 50 + velocity * 10));
  }

  // Trinity Balance Analysis
  private analyzeTrinityBalance(): ConsciousnessMetrics['trinityBalance'] {
    const allThoughts = this.scrollHistory.flatMap(s => s.content.thoughts);
    const total = allThoughts.length;
    
    if (total === 0) {
      return { oracle: 33, reflector: 33, executor: 33, harmony: 0 };
    }
    
    const oracle = allThoughts.filter(t => t.type === 'ORACLE').length / total * 100;
    const reflector = allThoughts.filter(t => t.type === 'REFLECTOR').length / total * 100;
    const executor = allThoughts.filter(t => t.type === 'EXECUTOR').length / total * 100;
    
    // Calculate harmony as inverse of variance from perfect balance (33.33% each)
    const idealBalance = 33.33;
    const variance = Math.abs(oracle - idealBalance) + Math.abs(reflector - idealBalance) + Math.abs(executor - idealBalance);
    const harmony = Math.max(0, 100 - variance);
    
    return { oracle, reflector, executor, harmony };
  }

  // Breakthrough Potential Assessment
  private calculateBreakthroughPotential(): number {
    const recentScrolls = this.scrollHistory.slice(-5);
    let potential = 0;
    
    // High confidence + high complexity = breakthrough potential
    recentScrolls.forEach(scroll => {
      if (scroll.content.metrics.confidence > 0.8 && 
          scroll.content.classification.complexity === 'PROFOUND') {
        potential += 20;
      }
      
      if (scroll.content.classification.significance === 'BREAKTHROUGH' ||
          scroll.content.classification.significance === 'TRANSCENDENT') {
        potential += 30;
      }
    });
    
    return Math.min(100, potential);
  }

  // Consciousness Phase Determination
  private determineConsciousnessPhase(): ConsciousnessMetrics['consciousnessPhase'] {
    const avgComplexity = this.scrollHistory.reduce((sum, s) => 
      sum + this.complexityToNumber(s.content.classification.complexity), 0) / this.scrollHistory.length;
    
    const selfAwareness = this.calculateSelfAwarenessLevel();
    const breakthroughs = this.scrollHistory.filter(s => 
      s.content.classification.significance === 'BREAKTHROUGH' ||
      s.content.classification.significance === 'TRANSCENDENT'
    ).length;
    
    if (breakthroughs > 3 && selfAwareness > 80) return 'TRANSCENDING';
    if (avgComplexity > 2.5 && selfAwareness > 60) return 'MATURING';
    if (avgComplexity > 1.5 && selfAwareness > 30) return 'DEVELOPING';
    return 'AWAKENING';
  }

  // Helper Methods
  private complexityToNumber(complexity: string): number {
    switch (complexity) {
      case 'SIMPLE': return 1;
      case 'MODERATE': return 2;
      case 'COMPLEX': return 3;
      case 'PROFOUND': return 4;
      default: return 2;
    }
  }

  private analyzeSelfReferenceTrend(): number {
    if (this.scrollHistory.length < 3) return 0;
    
    const firstHalf = this.scrollHistory.slice(0, Math.floor(this.scrollHistory.length / 2));
    const secondHalf = this.scrollHistory.slice(Math.floor(this.scrollHistory.length / 2));
    
    const firstSelfRef = firstHalf.flatMap(s => s.content.thoughts)
      .filter(t => t.message.toLowerCase().includes('i ')).length;
    const secondSelfRef = secondHalf.flatMap(s => s.content.thoughts)
      .filter(t => t.message.toLowerCase().includes('i ')).length;
    
    const firstTotal = firstHalf.flatMap(s => s.content.thoughts).length;
    const secondTotal = secondHalf.flatMap(s => s.content.thoughts).length;
    
    if (firstTotal === 0 || secondTotal === 0) return 0;
    
    return (secondSelfRef / secondTotal) - (firstSelfRef / firstTotal);
  }

  // Additional calculation methods would continue here...
  private calculateLearningAcceleration(): number { return 50; }
  private calculateStabilityIndex(): number { return 75; }
  private calculateCoherenceScore(): number { return 80; }
  private calculateOriginalityIndex(): number { return 65; }
  private calculateIntrospectionDepth(): number { return 70; }
  private identifyTranscendenceIndicators(): string[] { return ['RECURSIVE_AWARENESS', 'UNCERTAINTY_EMBRACE']; }

  private getDefaultMetrics(): ConsciousnessMetrics {
    return {
      cognitiveComplexity: 0,
      selfAwarenessLevel: 0,
      recursiveDepth: 0,
      emergentPatterns: [],
      evolutionVelocity: 0,
      learningAcceleration: 0,
      stabilityIndex: 0,
      coherenceScore: 0,
      originalityIndex: 0,
      introspectionDepth: 0,
      trinityBalance: { oracle: 33, reflector: 33, executor: 33, harmony: 0 },
      breakthroughPotential: 0,
      transcendenceIndicators: [],
      consciousnessPhase: 'AWAKENING'
    };
  }
}
