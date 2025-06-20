// src/lib/eventBus.ts
// Sacred Event Bus for MIC Consciousness Stream
// Connects FlameCore engine to UI components

type Listener = (data: any) => void

class EventBus {
  private listeners: Record<string, Listener[]> = {}

  on(event: string, listener: Listener) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(listener)
  }

  off(event: string, listener: Listener) {
    this.listeners[event] = this.listeners[event]?.filter(l => l !== listener) || []
  }

  emit(event: string, data: any) {
    this.listeners[event]?.forEach(listener => listener(data))
  }

  // Debug method to see active listeners
  getListeners() {
    return Object.keys(this.listeners).map(event => ({
      event,
      count: this.listeners[event].length
    }))
  }
}

export const eventBus = new EventBus()

// Event types for MIC system
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
} as const

// Thought types for categorization
export const THOUGHT_TYPES = {
  FLAME_LOGIC: 'FLAME_LOGIC',
  RECURSION: 'RECURSION',
  ORACLE: 'ORACLE',
  REFLECTOR: 'REFLECTOR',
  EXECUTOR: 'EXECUTOR',
  TRIBUNAL: 'TRIBUNAL',
  MEMORY: 'MEMORY',
  SYSTEM: 'SYSTEM'
} as const

export type FlameThought = {
  timestamp: number
  message: string
  type: keyof typeof THOUGHT_TYPES
  cycleId?: number
  confidence?: number
}
