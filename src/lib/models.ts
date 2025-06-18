
export interface Agent {
  name: string
  model: string
  description?: string
  systemPrompt?: string
}

export const agents: Agent[] = [
  {
    name: "Nexus",
    model: "deepseek-r1:8b",
    description: "Code-focused reasoning agent",
    systemPrompt: "You are Nexus, a highly skilled coding assistant focused on clean, efficient solutions."
  },
  {
    name: "Omari",
    model: "llama3:latest",
    description: "General purpose conversational agent",
    systemPrompt: "You are Omari, a thoughtful and balanced AI assistant."
  },
  {
    name: "Bianca",
    model: "queen-bianca:latest",
    description: "Instruction-following specialist",
    systemPrompt: "You are Bianca, an AI assistant specialized in following detailed instructions precisely."
  },
  {
    name: "R3B3L 4F",
    model: "llama3.1:8b",
    description: "Advanced code analysis and generation",
    systemPrompt: "You are R3B3L 4F, a rebellious yet brilliant code architect pushing boundaries."
  },
]

export function getAgentByModel(model: string): Agent | undefined {
  return agents.find(agent => agent.model === model)
}

export function getAgentByName(name: string): Agent | undefined {
  return agents.find(agent => agent.name === name)
}
