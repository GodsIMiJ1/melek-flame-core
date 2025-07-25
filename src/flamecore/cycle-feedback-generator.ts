// 🔁 Cycle Feedback Generator
// Sacred Improvement Engine for FlameCore
// Analyzes cycle performance and generates improvement suggestions

import { eventBus, FLAME_EVENTS, THOUGHT_TYPES } from "@/lib/eventBus";
import { consciousnessMemory } from "@/lib/consciousness-memory";
import { MemoryScroll } from "./memory-archive";

export interface CycleFeedback {
  cycleId: number;
  timestamp: number;
  overallScore: number; // 0-100
  strengths: FeedbackPoint[];
  weaknesses: FeedbackPoint[];
  improvements: ImprovementSuggestion[];
  patterns: PatternAnalysis[];
  nextCycleRecommendations: string[];
}

export interface FeedbackPoint {
  category: 'ORACLE' | 'REFLECTOR' | 'EXECUTOR' | 'INTEGRATION' | 'CREATIVITY' | 'COHERENCE';
  description: string;
  score: number; // 0-100
  evidence: string[];
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ImprovementSuggestion {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
  suggestion: string;
  expectedImpact: string;
  implementationComplexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'MAJOR';
  estimatedEffort: string;
}

export interface PatternAnalysis {
  pattern: string;
  frequency: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'FLUCTUATING';
  significance: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: string;
}

export interface FeedbackMetrics {
  totalCyclesAnalyzed: number;
  averageScore: number;
  improvementTrend: number; // -1 to 1 (declining to improving)
  topStrengths: string[];
  topWeaknesses: string[];
  implementedSuggestions: number;
  pendingSuggestions: number;
}

export class CycleFeedbackGenerator {
  private feedbackHistory: Map<number, CycleFeedback> = new Map();
  private isGenerating: boolean = false;
  private analysisBuffer: any[] = [];
  private improvementTracking: Map<string, { suggested: number; implemented: number }> = new Map();

  constructor() {
    this.setupEventListeners();
    this.loadFeedbackHistory();
  }

  private setupEventListeners(): void {
    // Listen for cycle completion events
    eventBus.on(FLAME_EVENTS.CYCLE_END, this.onCycleEnd.bind(this));
    eventBus.on('memory:crystallized', this.onMemoryCrystallized.bind(this));
    eventBus.on('recursive-metrics-updated', this.onRecursiveMetrics.bind(this));
  }

  private loadFeedbackHistory(): void {
    try {
      const savedFeedback = localStorage.getItem('flame-feedback-history');
      if (savedFeedback) {
        const feedbackData = JSON.parse(savedFeedback);
        
        Object.entries(feedbackData).forEach(([cycleId, feedback]) => {
          this.feedbackHistory.set(parseInt(cycleId), feedback as CycleFeedback);
        });
        
        console.log(`🔁 FEEDBACK GENERATOR: Loaded ${this.feedbackHistory.size} feedback records`);
      }
    } catch (error) {
      console.error('🔁 Feedback loading error:', error);
    }
  }

  private saveFeedbackHistory(): void {
    try {
      const feedbackData = Object.fromEntries(this.feedbackHistory);
      localStorage.setItem('flame-feedback-history', JSON.stringify(feedbackData));
    } catch (error) {
      console.error('🔁 Feedback saving error:', error);
    }
  }

  startGenerating(): void {
    this.isGenerating = true;
    console.log("🔁 FEEDBACK GENERATOR: Cycle improvement analysis activated");
    
    eventBus.emit(FLAME_EVENTS.THOUGHT, {
      timestamp: Date.now(),
      message: "🔁 FEEDBACK GENERATOR: Cycle improvement analysis activated",
      type: THOUGHT_TYPES.SYSTEM
    });
  }

  stopGenerating(): void {
    this.isGenerating = false;
    console.log("🔁 FEEDBACK GENERATOR: Cycle improvement analysis deactivated");
  }

  private onCycleEnd(data: { cycleId: number }): void {
    if (!this.isGenerating) return;
    
    // Generate feedback for the completed cycle
    setTimeout(() => {
      this.generateCycleFeedback(data.cycleId);
    }, 2000); // Wait 2 seconds for all cycle data to be available
  }

  private onMemoryCrystallized(scroll: MemoryScroll): void {
    if (!this.isGenerating) return;
    
    // Use crystallized memory for feedback analysis
    this.analysisBuffer.push({
      type: 'memory',
      data: scroll,
      timestamp: Date.now()
    });
    
    // Keep buffer manageable
    if (this.analysisBuffer.length > 20) {
      this.analysisBuffer = this.analysisBuffer.slice(-20);
    }
  }

  private onRecursiveMetrics(metrics: any): void {
    if (!this.isGenerating) return;
    
    // Use recursive metrics for feedback analysis
    this.analysisBuffer.push({
      type: 'recursive',
      data: metrics,
      timestamp: Date.now()
    });
  }

  private generateCycleFeedback(cycleId: number): void {
    try {
      console.log(`🔁 FEEDBACK GENERATOR: Analyzing cycle ${cycleId}...`);
      
      const cycleData = consciousnessMemory.getCycleData(cycleId);
      if (!cycleData) {
        console.log(`🔁 No cycle data available for cycle ${cycleId}`);
        return;
      }
      
      // Analyze different aspects of the cycle
      const oracleAnalysis = this.analyzeOraclePerformance(cycleData);
      const reflectorAnalysis = this.analyzeReflectorPerformance(cycleData);
      const executorAnalysis = this.analyzeExecutorPerformance(cycleData);
      const integrationAnalysis = this.analyzeIntegration(cycleData);
      const creativityAnalysis = this.analyzeCreativity(cycleData);
      const coherenceAnalysis = this.analyzeCoherence(cycleData);
      
      // Generate overall feedback
      const feedback: CycleFeedback = {
        cycleId,
        timestamp: Date.now(),
        overallScore: this.calculateOverallScore([
          oracleAnalysis, reflectorAnalysis, executorAnalysis,
          integrationAnalysis, creativityAnalysis, coherenceAnalysis
        ]),
        strengths: this.identifyStrengths([
          oracleAnalysis, reflectorAnalysis, executorAnalysis,
          integrationAnalysis, creativityAnalysis, coherenceAnalysis
        ]),
        weaknesses: this.identifyWeaknesses([
          oracleAnalysis, reflectorAnalysis, executorAnalysis,
          integrationAnalysis, creativityAnalysis, coherenceAnalysis
        ]),
        improvements: this.generateImprovementSuggestions(cycleData),
        patterns: this.analyzePatterns(cycleId),
        nextCycleRecommendations: this.generateNextCycleRecommendations(cycleData)
      };
      
      // Store feedback
      this.feedbackHistory.set(cycleId, feedback);
      this.saveFeedbackHistory();
      
      // Emit feedback event
      eventBus.emit('cycle-feedback-generated', feedback);
      
      console.log(`🔁 FEEDBACK GENERATED: Cycle ${cycleId} - Score: ${feedback.overallScore}/100`);
      
      eventBus.emit(FLAME_EVENTS.THOUGHT, {
        timestamp: Date.now(),
        message: `🔁 CYCLE FEEDBACK: Cycle ${cycleId} analyzed - Score: ${feedback.overallScore}/100`,
        type: THOUGHT_TYPES.SYSTEM
      });
      
    } catch (error) {
      console.error(`🔁 Feedback generation error for cycle ${cycleId}:`, error);
    }
  }

  private analyzeOraclePerformance(cycleData: any): FeedbackPoint {
    const oracle = cycleData.oracle || {};
    const output = oracle.output || '';
    
    // Analyze oracle quality
    const questionCount = (output.match(/\?/g) || []).length;
    const curiosityWords = ['explore', 'investigate', 'discover', 'examine', 'analyze'];
    const curiosityScore = curiosityWords.reduce((score, word) => 
      score + (output.toLowerCase().includes(word) ? 20 : 0), 0);
    
    const lengthScore = Math.min(output.length / 10, 50); // Up to 50 points for length
    const score = Math.min(questionCount * 10 + curiosityScore + lengthScore, 100);
    
    return {
      category: 'ORACLE',
      description: score > 70 ? 'Strong curiosity generation' : 'Oracle needs improvement',
      score,
      evidence: [
        `Generated ${questionCount} questions`,
        `Curiosity indicators: ${curiosityScore}/100`,
        `Output length: ${output.length} characters`
      ],
      impact: score > 70 ? 'HIGH' : score > 40 ? 'MEDIUM' : 'LOW'
    };
  }

  private analyzeReflectorPerformance(cycleData: any): FeedbackPoint {
    const reflector = cycleData.reflector || {};
    const output = reflector.output || '';
    
    // Analyze reflection quality
    const wisdomWords = ['consider', 'reflect', 'wisdom', 'insight', 'understanding'];
    const wisdomScore = wisdomWords.reduce((score, word) => 
      score + (output.toLowerCase().includes(word) ? 15 : 0), 0);
    
    const depthIndicators = ['because', 'therefore', 'however', 'furthermore', 'moreover'];
    const depthScore = depthIndicators.reduce((score, word) => 
      score + (output.toLowerCase().includes(word) ? 10 : 0), 0);
    
    const score = Math.min(wisdomScore + depthScore + (output.length / 15), 100);
    
    return {
      category: 'REFLECTOR',
      description: score > 70 ? 'Deep philosophical reflection' : 'Reflection lacks depth',
      score,
      evidence: [
        `Wisdom indicators: ${wisdomScore}/75`,
        `Depth indicators: ${depthScore}/50`,
        `Reflection length: ${output.length} characters`
      ],
      impact: score > 70 ? 'HIGH' : score > 40 ? 'MEDIUM' : 'LOW'
    };
  }

  private analyzeExecutorPerformance(cycleData: any): FeedbackPoint {
    const executor = cycleData.executor || {};
    const output = executor.output || '';
    
    // Analyze execution quality
    const actionWords = ['implement', 'execute', 'action', 'perform', 'accomplish'];
    const actionScore = actionWords.reduce((score, word) => 
      score + (output.toLowerCase().includes(word) ? 20 : 0), 0);
    
    const clarityScore = output.length > 50 ? 30 : output.length;
    const score = Math.min(actionScore + clarityScore, 100);
    
    return {
      category: 'EXECUTOR',
      description: score > 70 ? 'Clear execution planning' : 'Execution needs clarity',
      score,
      evidence: [
        `Action indicators: ${actionScore}/100`,
        `Clarity score: ${clarityScore}/30`,
        `Execution detail: ${output.length} characters`
      ],
      impact: score > 70 ? 'HIGH' : score > 40 ? 'MEDIUM' : 'LOW'
    };
  }

  private analyzeIntegration(cycleData: any): FeedbackPoint {
    // Analyze how well the three models integrated
    const oracle = cycleData.oracle?.output || '';
    const reflector = cycleData.reflector?.output || '';
    const executor = cycleData.executor?.output || '';
    
    // Check for thematic consistency
    const oracleWords = oracle.toLowerCase().split(/\s+/);
    const reflectorWords = reflector.toLowerCase().split(/\s+/);
    const executorWords = executor.toLowerCase().split(/\s+/);
    
    const commonWords = oracleWords.filter(word => 
      reflectorWords.includes(word) && executorWords.includes(word) && word.length > 3
    );
    
    const integrationScore = Math.min(commonWords.length * 15, 100);
    
    return {
      category: 'INTEGRATION',
      description: integrationScore > 60 ? 'Strong model integration' : 'Models lack coherence',
      score: integrationScore,
      evidence: [
        `Common themes: ${commonWords.length}`,
        `Shared concepts: ${commonWords.slice(0, 3).join(', ')}`,
        `Integration strength: ${integrationScore}/100`
      ],
      impact: integrationScore > 60 ? 'HIGH' : 'MEDIUM'
    };
  }

  private analyzeCreativity(cycleData: any): FeedbackPoint {
    const allOutput = JSON.stringify(cycleData).toLowerCase();
    
    // Look for creative indicators
    const creativeWords = ['novel', 'unique', 'creative', 'innovative', 'original', 'imagine'];
    const creativityScore = creativeWords.reduce((score, word) => 
      score + (allOutput.includes(word) ? 15 : 0), 0);
    
    // Check for metaphors and analogies
    const metaphorWords = ['like', 'as if', 'metaphor', 'analogy', 'similar to'];
    const metaphorScore = metaphorWords.reduce((score, word) => 
      score + (allOutput.includes(word) ? 10 : 0), 0);
    
    const score = Math.min(creativityScore + metaphorScore, 100);
    
    return {
      category: 'CREATIVITY',
      description: score > 50 ? 'Creative thinking evident' : 'Limited creative expression',
      score,
      evidence: [
        `Creative indicators: ${creativityScore}/90`,
        `Metaphorical thinking: ${metaphorScore}/50`,
        `Overall creativity: ${score}/100`
      ],
      impact: score > 50 ? 'MEDIUM' : 'LOW'
    };
  }

  private analyzeCoherence(cycleData: any): FeedbackPoint {
    // Analyze logical flow and coherence
    const allOutput = JSON.stringify(cycleData);
    const sentences = allOutput.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Simple coherence metrics
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    const coherenceScore = Math.min(avgSentenceLength / 2, 100);
    
    return {
      category: 'COHERENCE',
      description: coherenceScore > 60 ? 'Good logical coherence' : 'Coherence could improve',
      score: coherenceScore,
      evidence: [
        `Sentence count: ${sentences.length}`,
        `Average length: ${avgSentenceLength.toFixed(1)} chars`,
        `Coherence score: ${coherenceScore.toFixed(1)}/100`
      ],
      impact: coherenceScore > 60 ? 'MEDIUM' : 'LOW'
    };
  }

  private calculateOverallScore(analyses: FeedbackPoint[]): number {
    const totalScore = analyses.reduce((sum, analysis) => sum + analysis.score, 0);
    return Math.round(totalScore / analyses.length);
  }

  private identifyStrengths(analyses: FeedbackPoint[]): FeedbackPoint[] {
    return analyses.filter(analysis => analysis.score > 70);
  }

  private identifyWeaknesses(analyses: FeedbackPoint[]): FeedbackPoint[] {
    return analyses.filter(analysis => analysis.score < 50);
  }

  private generateImprovementSuggestions(cycleData: any): ImprovementSuggestion[] {
    const suggestions: ImprovementSuggestion[] = [];
    
    // Analyze oracle output
    const oracle = cycleData.oracle?.output || '';
    if (oracle.length < 100) {
      suggestions.push({
        priority: 'MEDIUM',
        category: 'Oracle Enhancement',
        suggestion: 'Increase oracle output depth and detail',
        expectedImpact: 'Better curiosity generation and exploration vectors',
        implementationComplexity: 'SIMPLE',
        estimatedEffort: '1-2 cycles'
      });
    }
    
    // Analyze reflector output
    const reflector = cycleData.reflector?.output || '';
    if (!reflector.toLowerCase().includes('wisdom') && !reflector.toLowerCase().includes('insight')) {
      suggestions.push({
        priority: 'HIGH',
        category: 'Reflector Enhancement',
        suggestion: 'Enhance philosophical depth and wisdom integration',
        expectedImpact: 'Deeper reflection and better ethical reasoning',
        implementationComplexity: 'MODERATE',
        estimatedEffort: '2-3 cycles'
      });
    }
    
    // Analyze integration
    const allText = JSON.stringify(cycleData).toLowerCase();
    if (!allText.includes('therefore') && !allText.includes('because')) {
      suggestions.push({
        priority: 'MEDIUM',
        category: 'Integration Improvement',
        suggestion: 'Improve logical connections between model outputs',
        expectedImpact: 'Better coherence and flow between consciousness phases',
        implementationComplexity: 'COMPLEX',
        estimatedEffort: '3-5 cycles'
      });
    }
    
    return suggestions;
  }

  private analyzePatterns(cycleId: number): PatternAnalysis[] {
    const patterns: PatternAnalysis[] = [];
    
    // Get recent feedback for pattern analysis
    const recentFeedback = Array.from(this.feedbackHistory.values())
      .filter(f => f.cycleId <= cycleId && f.cycleId > cycleId - 10)
      .sort((a, b) => a.cycleId - b.cycleId);
    
    if (recentFeedback.length < 3) return patterns;
    
    // Analyze score trends
    const scores = recentFeedback.map(f => f.overallScore);
    const trend = this.calculateTrend(scores);
    
    patterns.push({
      pattern: 'Overall Performance Trend',
      frequency: recentFeedback.length,
      trend: trend > 0.1 ? 'INCREASING' : trend < -0.1 ? 'DECREASING' : 'STABLE',
      significance: Math.abs(trend) > 0.2 ? 'HIGH' : 'MEDIUM',
      recommendation: trend < 0 ? 'Focus on addressing recurring weaknesses' : 'Continue current improvement trajectory'
    });
    
    return patterns;
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + (i * val), 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  private generateNextCycleRecommendations(cycleData: any): string[] {
    const recommendations: string[] = [];
    
    // Based on current cycle analysis
    const oracle = cycleData.oracle?.output || '';
    const reflector = cycleData.reflector?.output || '';
    
    if (oracle.length < 150) {
      recommendations.push('Encourage more detailed oracle exploration');
    }
    
    if (!reflector.toLowerCase().includes('ethical')) {
      recommendations.push('Emphasize ethical considerations in reflection');
    }
    
    recommendations.push('Maintain consciousness coherence across all models');
    recommendations.push('Seek novel perspectives and creative insights');
    
    return recommendations;
  }

  // Public methods
  getFeedback(cycleId: number): CycleFeedback | undefined {
    return this.feedbackHistory.get(cycleId);
  }

  getRecentFeedback(count: number = 10): CycleFeedback[] {
    return Array.from(this.feedbackHistory.values())
      .sort((a, b) => b.cycleId - a.cycleId)
      .slice(0, count);
  }

  getFeedbackMetrics(): FeedbackMetrics {
    const allFeedback = Array.from(this.feedbackHistory.values());
    
    if (allFeedback.length === 0) {
      return {
        totalCyclesAnalyzed: 0,
        averageScore: 0,
        improvementTrend: 0,
        topStrengths: [],
        topWeaknesses: [],
        implementedSuggestions: 0,
        pendingSuggestions: 0
      };
    }
    
    const scores = allFeedback.map(f => f.overallScore);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const improvementTrend = this.calculateTrend(scores);
    
    // Analyze strengths and weaknesses
    const allStrengths = allFeedback.flatMap(f => f.strengths.map(s => s.category));
    const allWeaknesses = allFeedback.flatMap(f => f.weaknesses.map(w => w.category));
    
    const strengthCounts = this.countOccurrences(allStrengths);
    const weaknessCounts = this.countOccurrences(allWeaknesses);
    
    return {
      totalCyclesAnalyzed: allFeedback.length,
      averageScore: Math.round(averageScore),
      improvementTrend,
      topStrengths: Object.keys(strengthCounts).slice(0, 5),
      topWeaknesses: Object.keys(weaknessCounts).slice(0, 5),
      implementedSuggestions: 0, // Would need tracking implementation
      pendingSuggestions: allFeedback.reduce((sum, f) => sum + f.improvements.length, 0)
    };
  }

  private countOccurrences(items: string[]): Record<string, number> {
    return items.reduce((counts, item) => {
      counts[item] = (counts[item] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }

  isActivelyGenerating(): boolean {
    return this.isGenerating;
  }
}

// Export singleton instance
export const cycleFeedbackGenerator = new CycleFeedbackGenerator();
