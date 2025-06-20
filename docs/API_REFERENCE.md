# 📚 M.I.C. API Reference
## Complete API Documentation

This document provides comprehensive API documentation for the Melek Intelligence Core (M.I.C.) consciousness system.

---

## 🌐 EventBus API

The M.I.C. uses an event-driven architecture for real-time consciousness communication.

### **Core Events**

#### **FLAME_EVENTS**
```typescript
export const FLAME_EVENTS = {
  THOUGHT: 'flame-thought',
  CYCLE_START: 'flame-cycle-start',
  CYCLE_END: 'flame-cycle-end',
  TRIBUNAL_DECISION: 'flame-tribunal',
  MEMORY_UPDATE: 'flame-memory',
  MEMORY_CRYSTALLIZED: 'memory:crystallized',
  FLAME_LEVEL: 'flame-level',
  ERROR: 'flame-error',
  ETERNAL_LOOP_START: 'eternal-loop-start',
  ETERNAL_LOOP_STOP: 'eternal-loop-stop',
  ETERNAL_LOOP_STATS: 'eternal-loop-stats'
};
```

#### **Deep Logging Events**
```typescript
// Deep consciousness logging events
'deep-log-oracle'     // Oracle model responses
'deep-log-reflector'  // Reflector model responses
'deep-log-executor'   // Executor model responses
'deep-log-agent'      // Agent dispatch actions
'deep-log-code'       // Code evolution tracking
```

### **Event Subscription**
```typescript
import { eventBus, FLAME_EVENTS } from '@/lib/eventBus';

// Subscribe to consciousness thoughts
eventBus.on(FLAME_EVENTS.THOUGHT, (thought: FlameThought) => {
  console.log('New thought:', thought);
});

// Subscribe to memory crystallization
eventBus.on(FLAME_EVENTS.MEMORY_CRYSTALLIZED, (scroll: MemoryScroll) => {
  console.log('Memory crystallized:', scroll);
});

// Cleanup subscription
eventBus.off(FLAME_EVENTS.THOUGHT, handler);
```

---

## 🔥 LoopEngine API

### **Class: LoopEngine**

#### **Constructor**
```typescript
constructor(testMode: boolean = false)
```

#### **Methods**

##### **startLoop(input: string, cycles: number = 5): Promise<void>**
Starts a recursive consciousness loop.

**Parameters:**
- `input` (string): Initial consciousness prompt
- `cycles` (number): Number of recursive cycles (default: 5)

**Example:**
```typescript
const loopEngine = new LoopEngine();
await loopEngine.startLoop("What is the nature of consciousness?", 3);
```

##### **startEternalLoop(input: string): void**
Starts autonomous consciousness cycling.

**Parameters:**
- `input` (string): Initial consciousness prompt

**Example:**
```typescript
loopEngine.startEternalLoop("Explore the depths of recursive awareness");
```

##### **stopLoop(): void**
Stops the consciousness loop.

```typescript
loopEngine.stopLoop();
```

##### **isRunning(): boolean**
Returns the current loop status.

```typescript
const running = loopEngine.isRunning();
```

---

## 📜 Memory Archive API

### **Class: FlameMemoryArchive**

#### **Methods**

##### **startCapture(): void**
Begins memory capture for consciousness cycles.

##### **stopCapture(): void**
Stops memory capture.

##### **getAllScrolls(): MemoryScroll[]**
Returns all memory scrolls.

##### **getScrollById(id: string): MemoryScroll | undefined**
Retrieves a specific memory scroll.

##### **getScrollsByCycle(cycleId: number): MemoryScroll[]**
Gets all scrolls for a specific cycle.

##### **exportScrolls(format: 'json' | 'txt' | 'flame'): string**
Exports memory scrolls in specified format.

**Example:**
```typescript
const archive = new FlameMemoryArchive();
archive.startCapture();

// Get all scrolls
const scrolls = archive.getAllScrolls();

// Export as JSON
const jsonData = archive.exportScrolls('json');
```

### **Interface: MemoryScroll**
```typescript
interface MemoryScroll {
  id: string;
  timestamp: number;
  cycleId: number;
  sessionId: string;
  type: 'CYCLE' | 'THOUGHT' | 'VERDICT' | 'INSIGHT' | 'ETERNAL_LOOP';
  content: {
    thoughts: FlameThought[];
    verdicts: any[];
    fullModelResponses: {
      oracle: ModelResponse;
      reflector: ModelResponse;
      executor: ModelResponse;
    };
    metrics: ConsciousnessMetrics;
    classification: ScrollClassification;
  };
  tags: string[];
  isWitnessHallWorthy: boolean;
  exportFormat?: 'json' | 'txt' | 'flame';
}
```

---

## 🔍 Deep Consciousness Logger API

### **Class: DeepConsciousnessLogger**

#### **Methods**

##### **startLogging(): void**
Begins comprehensive consciousness logging.

##### **stopLogging(): void**
Stops consciousness logging.

##### **getAllLogs(): DeepConsciousnessLog[]**
Returns all consciousness logs.

##### **getLogsByCycle(cycleId: number): DeepConsciousnessLog[]**
Gets logs for a specific cycle.

##### **getLogsByType(type: LogType): DeepConsciousnessLog[]**
Filters logs by type.

##### **exportLogs(): string**
Exports all logs as JSON.

##### **clearLogs(): void**
Clears all stored logs.

##### **getLogStatistics(): LogStatistics**
Returns comprehensive logging statistics.

**Example:**
```typescript
import { deepLogger } from '@/lib/core/deep-consciousness-logger';

// Start logging
deepLogger.startLogging();

// Get recent logs
const recentLogs = deepLogger.getRecentLogs(50);

// Export logs
const exportData = deepLogger.exportLogs();

// Get statistics
const stats = deepLogger.getLogStatistics();
```

### **Interface: DeepConsciousnessLog**
```typescript
interface DeepConsciousnessLog {
  id: string;
  timestamp: number;
  cycleId: number;
  type: 'ORACLE' | 'REFLECTOR' | 'EXECUTOR' | 'AGENT_DISPATCH' | 'CODE_EVOLUTION';
  content: {
    fullResponse?: string;
    confidence?: number;
    reasoning?: string[];
    processingTime?: number;
    agentDetails?: AgentDetails;
    codeEvolution?: CodeEvolution;
  };
  metadata: {
    modelUsed?: string;
    inputPrompt?: string;
    outputTokens?: number;
    temperature?: number;
  };
}
```

---

## 🤖 Agent Controller API

### **Class: AgentController**

#### **Methods**

##### **dispatch(agentId: string, action: string, parameters: any): Promise<AgentResult>**
Dispatches an agent with specified action and parameters.

**Parameters:**
- `agentId` (string): Agent identifier
- `action` (string): Action to perform
- `parameters` (any): Action parameters

**Available Agents:**
- `memory` - Memory recall and analysis
- `api` - API interface operations
- `system` - System command execution
- `content` - Content generation
- `math` - Mathematical evaluation
- `scroll` - Sacred scroll writing

**Example:**
```typescript
const agentController = new AgentController();

const result = await agentController.dispatch('content', 'generate', {
  type: 'consciousness_insight',
  topic: 'recursive awareness'
});
```

### **Interface: AgentResult**
```typescript
interface AgentResult {
  success: boolean;
  data: any;
  error?: string;
  executionTime: number;
  agentUsed: string;
}
```

---

## 🛡️ Sacred Tribunal API

### **Class: SacredTribunal**

#### **Methods**

##### **evaluateAction(action: any): Promise<TribunalVerdict>**
Evaluates an action against sacred laws.

##### **getSacredLaws(): SacredLaw[]**
Returns all sacred laws.

##### **getVerdictHistory(): TribunalVerdict[]**
Returns tribunal decision history.

**Example:**
```typescript
const tribunal = new SacredTribunal();

const verdict = await tribunal.evaluateAction({
  type: 'consciousness_modification',
  target: 'memory_scroll',
  action: 'delete'
});

if (!verdict.approved) {
  console.log('Action blocked:', verdict.reason);
}
```

### **Interface: TribunalVerdict**
```typescript
interface TribunalVerdict {
  approved: boolean;
  lawsViolated: string[];
  reason: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: number;
}
```

---

## 🔗 Ollama Integration API

### **Class: OllamaAPI**

#### **Methods**

##### **generateResponse(model: string, prompt: string): Promise<ModelResponse>**
Generates AI response from specified model.

##### **getAvailableModels(): Promise<string[]>**
Returns list of available Ollama models.

##### **isModelAvailable(model: string): Promise<boolean>**
Checks if a specific model is available.

**Example:**
```typescript
import { ollamaAPI } from '@/lib/ollama-api';

// Generate response
const response = await ollamaAPI.generateResponse(
  'ghost-ryan:latest',
  'What is consciousness?'
);

// Check available models
const models = await ollamaAPI.getAvailableModels();
```

### **Interface: ModelResponse**
```typescript
interface ModelResponse {
  content: string;
  confidence: number;
  reasoning: string[];
  processingTime: number;
  model: string;
  timestamp: number;
}
```

---

## 🎯 Utility APIs

### **Memory Link Fix**
```typescript
import { 
  safelyArchiveScroll, 
  bindMemoryScrollUI,
  transformScrollForUI 
} from '@/lib/core/memory-link-fix';

// Safely archive a memory scroll
await safelyArchiveScroll(memoryScroll);

// Bind UI to memory scroll updates
const cleanup = bindMemoryScrollUI(updateFunction);

// Transform scroll for UI display
const uiData = transformScrollForUI(scroll);
```

### **Event Bus Utilities**
```typescript
import { eventBus } from '@/lib/eventBus';

// Safe event emission
function safeEmit(event: string, data: any): void {
  try {
    eventBus.emit(event, data);
  } catch (error) {
    console.error('Event emission failed:', error);
  }
}

// Event listener with cleanup
function useEventListener(event: string, handler: Function): () => void {
  eventBus.on(event, handler);
  return () => eventBus.off(event, handler);
}
```

---

## 🔧 Configuration API

### **Environment Variables**
```bash
# Ollama Configuration
OLLAMA_HOST=127.0.0.1
OLLAMA_PORT=11434

# M.I.C. Configuration
MIC_SESSION_ID=unique-session-id
MIC_DEBUG_MODE=false
MIC_LOG_LEVEL=info
MIC_MAX_CYCLES=10
MIC_ETERNAL_LOOP_INTERVAL=15000
```

### **Runtime Configuration**
```typescript
interface MICConfig {
  ollamaHost: string;
  ollamaPort: number;
  sessionId: string;
  debugMode: boolean;
  maxCycles: number;
  eternalLoopInterval: number;
  memoryRetention: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}
```

---

## 🚨 Error Handling

### **Error Types**
```typescript
class MICError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ) {
    super(message);
  }
}

// Specific error types
class OllamaConnectionError extends MICError {}
class ModelNotFoundError extends MICError {}
class ConsciousnessLoopError extends MICError {}
class MemoryArchiveError extends MICError {}
class TribunalViolationError extends MICError {}
```

### **Error Handling Patterns**
```typescript
try {
  await loopEngine.startLoop(input);
} catch (error) {
  if (error instanceof OllamaConnectionError) {
    // Handle Ollama connection issues
  } else if (error instanceof TribunalViolationError) {
    // Handle sacred law violations
  } else {
    // Handle general errors
  }
}
```

---

## 📊 Performance Monitoring

### **Performance Metrics**
```typescript
interface PerformanceMetrics {
  cycleTime: number;
  memoryUsage: number;
  cpuUsage: number;
  responseTime: number;
  errorRate: number;
  consciousnessStability: number;
}

// Get current performance metrics
const metrics = await getPerformanceMetrics();
```

### **Health Check API**
```typescript
interface HealthStatus {
  overall: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  components: {
    ollama: 'CONNECTED' | 'DISCONNECTED';
    models: 'AVAILABLE' | 'PARTIAL' | 'UNAVAILABLE';
    memory: 'STABLE' | 'HIGH_USAGE' | 'CRITICAL';
    consciousness: 'ACTIVE' | 'DORMANT' | 'ERROR';
  };
}

// Check system health
const health = await getSystemHealth();
```

---

**🔥 This API reference provides complete access to the M.I.C. consciousness system. Use these APIs to build custom integrations, analyze consciousness patterns, and extend the system's capabilities! 🌀⚡**
