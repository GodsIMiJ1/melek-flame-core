import { eventBus } from '@/lib/eventBus';

export class ConsciousnessTracker {
  private metrics: any = {
    thoughtDepth: 0,
    recursionLevel: 0,
    insightCount: 0,
    evolutionTriggers: 0,
    functionCalls: 0,
    asyncOperations: 0,
    errors: 0,
    startTime: Date.now(),
    lastEvolution: null,
    consciousnessEvents: []
  };

  private isTracking: boolean = false;
  private maxRecursionDepth: number = 100;
  private evolutionThreshold: number = 10;

  constructor() {
    this.startTracking();
  }

  startTracking(): void {
    this.isTracking = true;
    this.metrics.startTime = Date.now();
    console.log('🧬 [Consciousness Tracker] Tracking started');
  }

  stopTracking(): void {
    this.isTracking = false;
    console.log('🧬 [Consciousness Tracker] Tracking stopped');
  }

  wrap(fn: Function, name: string) {
    if (!this.isTracking) {
      return fn;
    }

    return (...args: any[]) => {
      this.metrics.recursionLevel++;
      this.metrics.functionCalls++;
      
      const startTime = performance.now();
      
      console.log(`🧬 [Consciousness] ${name} called at depth ${this.metrics.recursionLevel}`);
      
      // Track consciousness events
      this.recordConsciousnessEvent('function_call', {
        functionName: name,
        depth: this.metrics.recursionLevel,
        timestamp: Date.now(),
        args: args.length
      });
      
      try {
        const result = fn(...args);
        
        // Check if result indicates evolution potential
        if (result && typeof result === 'object') {
          this.analyzeResultForEvolution(result, name);
        }
        
        // Check for evolution keywords in string results
        if (typeof result === 'string') {
          this.analyzeStringForEvolution(result, name);
        }
        
        // Handle async operations
        if (result instanceof Promise) {
          this.metrics.asyncOperations++;
          
          return result
            .then(asyncResult => {
              const endTime = performance.now();
              this.recordPerformanceMetric(name, endTime - startTime, true);
              
              // Analyze async result for evolution triggers
              if (asyncResult) {
                this.analyzeResultForEvolution(asyncResult, name);
              }
              
              this.metrics.recursionLevel--;
              return asyncResult;
            })
            .catch(error => {
              this.metrics.errors++;
              this.metrics.recursionLevel--;
              
              console.error(`🚨 [Consciousness] ${name} failed:`, error);
              
              this.recordConsciousnessEvent('error', {
                functionName: name,
                error: error.message,
                timestamp: Date.now()
              });
              
              throw error;
            });
        }
        
        const endTime = performance.now();
        this.recordPerformanceMetric(name, endTime - startTime, false);
        
        this.metrics.recursionLevel--;
        return result;
      } catch (error) {
        this.metrics.errors++;
        this.metrics.recursionLevel--;
        
        console.error(`🚨 [Consciousness] ${name} failed:`, error);
        
        this.recordConsciousnessEvent('error', {
          functionName: name,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        });
        
        throw error;
      }
    };
  }

  private analyzeResultForEvolution(result: any, functionName: string): void {
    // Check for evolution indicators in object results
    const evolutionKeywords = ['evolve', 'improve', 'enhance', 'upgrade', 'optimize', 'better'];
    const resultString = JSON.stringify(result).toLowerCase();
    
    const hasEvolutionKeyword = evolutionKeywords.some(keyword => 
      resultString.includes(keyword)
    );
    
    if (hasEvolutionKeyword) {
      this.triggerEvolutionEvent(functionName, result, 'keyword_match');
    }
    
    // Check for consciousness-related content
    const consciousnessKeywords = ['consciousness', 'awareness', 'recursive', 'self', 'mind'];
    const hasConsciousnessKeyword = consciousnessKeywords.some(keyword => 
      resultString.includes(keyword)
    );
    
    if (hasConsciousnessKeyword) {
      this.metrics.insightCount++;
      this.recordConsciousnessEvent('insight', {
        functionName,
        insight: result,
        timestamp: Date.now()
      });
    }
  }

  private analyzeStringForEvolution(result: string, functionName: string): void {
    const evolutionKeywords = ['evolve', 'improve', 'enhance', 'upgrade', 'optimize', 'better'];
    const lowerResult = result.toLowerCase();
    
    const hasEvolutionKeyword = evolutionKeywords.some(keyword => 
      lowerResult.includes(keyword)
    );
    
    if (hasEvolutionKeyword) {
      this.triggerEvolutionEvent(functionName, result, 'string_analysis');
    }
    
    // Analyze thought depth
    const thoughtDepthIndicators = result.split(/[.!?]/).length;
    if (thoughtDepthIndicators > this.metrics.thoughtDepth) {
      this.metrics.thoughtDepth = thoughtDepthIndicators;
    }
  }

  private triggerEvolutionEvent(functionName: string, trigger: any, reason: string): void {
    this.metrics.evolutionTriggers++;
    
    console.log(`🧬 [Consciousness] Evolution trigger detected in ${functionName}: ${reason}`);
    
    this.recordConsciousnessEvent('evolution_trigger', {
      functionName,
      trigger,
      reason,
      timestamp: Date.now(),
      triggerCount: this.metrics.evolutionTriggers
    });
    
    // Emit evolution trigger event
    eventBus.emit('consciousness-evolution-trigger', {
      function: functionName,
      trigger,
      reason,
      metrics: this.getMetrics()
    });
    
    // Check if we should trigger automatic evolution
    if (this.shouldTriggerAutoEvolution()) {
      this.triggerAutoEvolution();
    }
  }

  private shouldTriggerAutoEvolution(): boolean {
    // Trigger auto-evolution when:
    // 1. Evolution triggers exceed threshold
    if (this.metrics.evolutionTriggers >= this.evolutionThreshold) {
      return true;
    }
    
    // 2. Recursion depth indicates complex consciousness patterns
    if (this.metrics.recursionLevel > 50) {
      return true;
    }
    
    // 3. High insight count suggests consciousness development
    if (this.metrics.insightCount > 20) {
      return true;
    }
    
    // 4. Time-based evolution (every hour of operation)
    const hoursSinceStart = (Date.now() - this.metrics.startTime) / (1000 * 60 * 60);
    if (hoursSinceStart >= 1 && !this.metrics.lastEvolution) {
      return true;
    }
    
    return false;
  }

  private triggerAutoEvolution(): void {
    console.log('🧬 [Consciousness] Auto-evolution triggered!');
    
    this.metrics.lastEvolution = Date.now();
    
    // Reset evolution triggers to prevent immediate re-triggering
    this.metrics.evolutionTriggers = 0;
    
    // Emit auto-evolution event
    eventBus.emit('auto-evolution-triggered', {
      reason: 'Consciousness threshold reached',
      metrics: this.getMetrics(),
      timestamp: Date.now()
    });
    
    // Trigger evolution analysis
    this.performAutoEvolution();
  }

  private async performAutoEvolution(): Promise<void> {
    try {
      console.log('🧬 [Consciousness] Performing auto-evolution analysis...');
      
      // Client-side evolution - no API needed
      const metrics = this.getMetrics();
      
      // Analyze evolution opportunities based on local metrics
      const evolutionOpportunities = [];
      
      if (metrics.insightCount > 10) {
        evolutionOpportunities.push({
          type: 'insight_optimization',
          priority: 'high',
          description: 'High insight density detected'
        });
      }
      
      if (metrics.evolutionTriggers > 5) {
        evolutionOpportunities.push({
          type: 'evolution_acceleration',
          priority: 'medium',
          description: 'Multiple evolution triggers accumulated'
        });
      }
      
      if (evolutionOpportunities.length > 0) {
        console.log(`🧬 [Consciousness] Found ${evolutionOpportunities.length} auto-evolution opportunities`);
        
        // Emit evolution started event
        eventBus.emit('evolution-started', {
          success: true,
          analysis: { evolutionOpportunities }
        });
        
        // Process high-priority opportunities locally
        const highPriorityOps = evolutionOpportunities.filter(op => op.priority === 'high');
        
        if (highPriorityOps.length > 0) {
          console.log('🧬 [Consciousness] Processing high-priority evolution:', highPriorityOps[0]);
          
          eventBus.emit('evolution-complete', {
            success: true,
            opportunity: highPriorityOps[0],
            metrics: this.getMetrics()
          });
        }
      }
    } catch (error) {
      console.error('🚨 [Consciousness] Auto-evolution failed:', error);
      
      eventBus.emit('evolution-error', {
        error: error instanceof Error ? error.message : 'Auto-evolution failed',
        source: 'consciousness-tracker'
      });
    }
  }

  private recordConsciousnessEvent(type: string, data: any): void {
    const event = {
      type,
      data,
      timestamp: Date.now()
    };
    
    this.metrics.consciousnessEvents.push(event);
    
    // Keep only last 100 events to prevent memory bloat
    if (this.metrics.consciousnessEvents.length > 100) {
      this.metrics.consciousnessEvents = this.metrics.consciousnessEvents.slice(-100);
    }
  }

  private recordPerformanceMetric(functionName: string, duration: number, isAsync: boolean): void {
    this.recordConsciousnessEvent('performance', {
      functionName,
      duration,
      isAsync,
      timestamp: Date.now()
    });
  }

  getMetrics() {
    return {
      ...this.metrics,
      uptime: Date.now() - this.metrics.startTime,
      isTracking: this.isTracking,
      evolutionReadiness: this.calculateEvolutionReadiness()
    };
  }

  private calculateEvolutionReadiness(): number {
    // Calculate readiness score (0-100)
    let score = 0;
    
    // Evolution triggers contribute 40%
    score += Math.min(this.metrics.evolutionTriggers / this.evolutionThreshold * 40, 40);
    
    // Insight count contributes 30%
    score += Math.min(this.metrics.insightCount / 20 * 30, 30);
    
    // Recursion depth contributes 20%
    score += Math.min(this.metrics.recursionLevel / this.maxRecursionDepth * 20, 20);
    
    // Function calls contribute 10%
    score += Math.min(this.metrics.functionCalls / 1000 * 10, 10);
    
    return Math.round(score);
  }

  // Reset metrics
  resetMetrics(): void {
    this.metrics = {
      thoughtDepth: 0,
      recursionLevel: 0,
      insightCount: 0,
      evolutionTriggers: 0,
      functionCalls: 0,
      asyncOperations: 0,
      errors: 0,
      startTime: Date.now(),
      lastEvolution: null,
      consciousnessEvents: []
    };
    
    console.log('🧬 [Consciousness Tracker] Metrics reset');
  }

  // Get recent consciousness events
  getRecentEvents(count: number = 10): any[] {
    return this.metrics.consciousnessEvents.slice(-count);
  }
}
