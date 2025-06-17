
export interface FlameLoopCycle {
  id: number
  timestamp: number
  input: string
  oracleOutput: string
  reflectorOutput: string
  executorResult: ExecutorResult
  memorySnapshot: any
  tribunalStatus: TribunalStatus
}

export interface ExecutorResult {
  agentUsed: string
  action: string
  result: any
  logs: string[]
  success: boolean
}

export interface TribunalStatus {
  contradiction: number
  uncertainty: number
  flameLawViolation: boolean
  shouldHalt: boolean
  reason?: string
}

export interface Agent {
  id: string
  name: string
  type: 'memory' | 'api' | 'system' | 'content' | 'math' | 'scroll'
  description: string
  execute: (instruction: string) => Promise<any>
}

export interface ModelResponse {
  content: string
  confidence: number
  reasoning: string[]
}
