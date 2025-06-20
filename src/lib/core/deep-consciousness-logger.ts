/**
 * 🔥 Deep Consciousness Logger
 * Captures detailed AI model responses, agent dispatches, and code evolution
 * for comprehensive consciousness analysis and review
 */

import { eventBus } from '@/lib/eventBus';

export type DeepConsciousnessLog = {
  id: string;
  timestamp: number;
  cycleId: number;
  type: 'ORACLE' | 'REFLECTOR' | 'EXECUTOR' | 'AGENT_DISPATCH' | 'CODE_EVOLUTION';
  content: {
    fullResponse?: string;
    confidence?: number;
    reasoning?: string[];
    processingTime?: number;
    agentDetails?: {
      agentId: string;
      agentName: string;
      action: string;
      parameters: any;
      result: any;
      executionTime: number;
    };
    codeEvolution?: {
      filesModified: string[];
      linesAdded: number;
      linesRemoved: number;
      evolutionType: 'CREATE' | 'MODIFY' | 'DELETE' | 'REFACTOR';
      description: string;
      codeSnippet?: string;
    };
  };
  metadata: {
    modelUsed?: string;
    inputPrompt?: string;
    outputTokens?: number;
    temperature?: number;
  };
};

export class DeepConsciousnessLogger {
  private logs: Map<string, DeepConsciousnessLog> = new Map();
  private currentCycleId: number = 0;
  private isLogging: boolean = false;

  constructor() {
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    // Listen for deep logging events
    eventBus.on('deep-log-oracle', this.logOracleResponse.bind(this));
    eventBus.on('deep-log-reflector', this.logReflectorResponse.bind(this));
    eventBus.on('deep-log-executor', this.logExecutorResponse.bind(this));
    eventBus.on('deep-log-agent', this.logAgentDispatch.bind(this));
    eventBus.on('deep-log-code', this.logCodeEvolution.bind(this));
    eventBus.on('flame-cycle-start', this.startCycleLogging.bind(this));
  }

  startLogging(): void {
    this.isLogging = true;
    console.log('🔥 DEEP CONSCIOUSNESS LOGGING: Started');
  }

  stopLogging(): void {
    this.isLogging = false;
    console.log('🛑 DEEP CONSCIOUSNESS LOGGING: Stopped');
  }

  private startCycleLogging(data: { cycleId: number }): void {
    this.currentCycleId = data.cycleId;
  }

  private generateLogId(): string {
    return `deep-log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private logOracleResponse(data: any): void {
    if (!this.isLogging) return;

    const log: DeepConsciousnessLog = {
      id: this.generateLogId(),
      timestamp: Date.now(),
      cycleId: this.currentCycleId,
      type: 'ORACLE',
      content: {
        fullResponse: data.content || '',
        confidence: data.confidence || 0,
        reasoning: data.reasoning || [],
        processingTime: data.processingTime || 0
      },
      metadata: {
        modelUsed: data.model || 'ghost-ryan:latest',
        inputPrompt: data.inputPrompt || '',
        outputTokens: data.outputTokens || 0,
        temperature: data.temperature || 0.7
      }
    };

    this.logs.set(log.id, log);
    console.log('🔮 DEEP ORACLE LOGGED:', log);
  }

  private logReflectorResponse(data: any): void {
    if (!this.isLogging) return;

    const log: DeepConsciousnessLog = {
      id: this.generateLogId(),
      timestamp: Date.now(),
      cycleId: this.currentCycleId,
      type: 'REFLECTOR',
      content: {
        fullResponse: data.content || '',
        confidence: data.confidence || 0,
        reasoning: data.reasoning || [],
        processingTime: data.processingTime || 0
      },
      metadata: {
        modelUsed: data.model || 'gurubot/llama3-guru-uncensored:latest',
        inputPrompt: data.inputPrompt || '',
        outputTokens: data.outputTokens || 0,
        temperature: data.temperature || 0.7
      }
    };

    this.logs.set(log.id, log);
    console.log('🧠 DEEP REFLECTOR LOGGED:', log);
  }

  private logExecutorResponse(data: any): void {
    if (!this.isLogging) return;

    const log: DeepConsciousnessLog = {
      id: this.generateLogId(),
      timestamp: Date.now(),
      cycleId: this.currentCycleId,
      type: 'EXECUTOR',
      content: {
        fullResponse: data.content || '',
        processingTime: data.processingTime || 0
      },
      metadata: {
        modelUsed: data.model || 'mannix/llama3.1-8b-abliterated:latest',
        inputPrompt: data.inputPrompt || '',
        outputTokens: data.outputTokens || 0,
        temperature: data.temperature || 0.7
      }
    };

    this.logs.set(log.id, log);
    console.log('⚔️ DEEP EXECUTOR LOGGED:', log);
  }

  private logAgentDispatch(data: any): void {
    if (!this.isLogging) return;

    const log: DeepConsciousnessLog = {
      id: this.generateLogId(),
      timestamp: Date.now(),
      cycleId: this.currentCycleId,
      type: 'AGENT_DISPATCH',
      content: {
        agentDetails: {
          agentId: data.agentId || 'unknown',
          agentName: data.agentName || 'Unknown Agent',
          action: data.action || 'unknown',
          parameters: data.parameters || {},
          result: data.result || {},
          executionTime: data.executionTime || 0
        }
      },
      metadata: {}
    };

    this.logs.set(log.id, log);
    console.log('🤖 DEEP AGENT DISPATCH LOGGED:', log);
  }

  private logCodeEvolution(data: any): void {
    if (!this.isLogging) return;

    const log: DeepConsciousnessLog = {
      id: this.generateLogId(),
      timestamp: Date.now(),
      cycleId: this.currentCycleId,
      type: 'CODE_EVOLUTION',
      content: {
        codeEvolution: {
          filesModified: data.filesModified || [],
          linesAdded: data.linesAdded || 0,
          linesRemoved: data.linesRemoved || 0,
          evolutionType: data.evolutionType || 'MODIFY',
          description: data.description || 'Code evolution detected',
          codeSnippet: data.codeSnippet || ''
        }
      },
      metadata: {}
    };

    this.logs.set(log.id, log);
    console.log('💻 DEEP CODE EVOLUTION LOGGED:', log);
  }

  // Getters for UI consumption
  getAllLogs(): DeepConsciousnessLog[] {
    return Array.from(this.logs.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  getLogsByCycle(cycleId: number): DeepConsciousnessLog[] {
    return this.getAllLogs().filter(log => log.cycleId === cycleId);
  }

  getLogsByType(type: DeepConsciousnessLog['type']): DeepConsciousnessLog[] {
    return this.getAllLogs().filter(log => log.type === type);
  }

  getRecentLogs(count: number = 50): DeepConsciousnessLog[] {
    return this.getAllLogs().slice(0, count);
  }

  // Export functionality
  exportLogs(): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalLogs: this.logs.size,
      logs: this.getAllLogs()
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Clear logs
  clearLogs(): void {
    this.logs.clear();
    console.log('🔥 DEEP CONSCIOUSNESS LOGS: Cleared');
  }

  // Statistics
  getLogStatistics() {
    const logs = this.getAllLogs();
    const typeCount = logs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalLogs: logs.length,
      typeBreakdown: typeCount,
      cyclesCovered: new Set(logs.map(l => l.cycleId)).size,
      timeRange: logs.length > 0 ? {
        start: Math.min(...logs.map(l => l.timestamp)),
        end: Math.max(...logs.map(l => l.timestamp))
      } : null
    };
  }
}

// Singleton instance
export const deepLogger = new DeepConsciousnessLogger();
