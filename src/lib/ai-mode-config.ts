// AI Mode Configuration - Simple Online/Offline Toggle
// Online: OpenAI gpt-4o-mini | Offline: Ollama llama3.1:8b

export type AIMode = "online" | "offline";

const STORAGE_KEY = "flame-ai-mode";
const OLLAMA_URL = "http://localhost:11434";

// Model definitions for each mode
export const AI_MODELS = {
  online: {
    name: "gpt-4o-mini",
    fullName: "openai:gpt-4o-mini",
    provider: "OpenAI",
    description: "Fast cloud-based reasoning"
  },
  offline: {
    name: "llama3.1:8b",
    fullName: "llama3.1:8b",
    provider: "Ollama",
    description: "Local sovereign processing"
  }
} as const;

// Check if Ollama is running
export async function checkOllamaAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

// Check if OpenAI API key is configured
export function checkOpenAIAvailable(): boolean {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return !!apiKey && apiKey.length > 10;
}

// Get saved mode from localStorage
export function getSavedMode(): AIMode | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "online" || saved === "offline") {
      return saved;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

// Save mode to localStorage
export function saveMode(mode: AIMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // localStorage not available
  }
}

// Auto-detect best available mode
export async function autoDetectMode(): Promise<{ mode: AIMode; reason: string }> {
  const savedMode = getSavedMode();
  
  // Check both availability
  const [ollamaAvailable, openaiAvailable] = await Promise.all([
    checkOllamaAvailable(),
    Promise.resolve(checkOpenAIAvailable())
  ]);
  
  console.log(`🔍 AI Mode Detection: Ollama=${ollamaAvailable}, OpenAI=${openaiAvailable}, Saved=${savedMode}`);
  
  // If saved mode is still available, use it
  if (savedMode === "offline" && ollamaAvailable) {
    return { mode: "offline", reason: "Using saved preference (Ollama)" };
  }
  if (savedMode === "online" && openaiAvailable) {
    return { mode: "online", reason: "Using saved preference (OpenAI)" };
  }
  
  // Auto-detect: prefer offline (local sovereignty)
  if (ollamaAvailable) {
    return { mode: "offline", reason: "Ollama detected - local mode activated" };
  }
  
  if (openaiAvailable) {
    return { mode: "online", reason: "OpenAI API key found - cloud mode activated" };
  }
  
  // Fallback to offline (will show errors but allows UI to load)
  return { mode: "offline", reason: "No AI backend available - please start Ollama or add OpenAI API key" };
}

// Current mode state (module-level singleton)
let currentMode: AIMode = "offline";

export function getCurrentMode(): AIMode {
  return currentMode;
}

export function setCurrentMode(mode: AIMode): void {
  currentMode = mode;
  saveMode(mode);
  console.log(`🔥 AI Mode set to: ${mode.toUpperCase()} (${AI_MODELS[mode].name})`);
}

// Get model name for current mode
export function getCurrentModel(): string {
  return AI_MODELS[currentMode].fullName;
}

// Get model info for current mode
export function getCurrentModelInfo() {
  return AI_MODELS[currentMode];
}

// Check if current mode is using OpenAI
export function isOnlineMode(): boolean {
  return currentMode === "online";
}

// Check if current mode is using Ollama
export function isOfflineMode(): boolean {
  return currentMode === "offline";
}
