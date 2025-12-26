// React Hook for AI Mode Management
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import {
  AIMode,
  AI_MODELS,
  getCurrentMode,
  setCurrentMode,
  autoDetectMode,
  checkOllamaAvailable,
  checkOpenAIAvailable
} from "@/lib/ai-mode-config";

export interface AIStatus {
  ollamaAvailable: boolean;
  openaiAvailable: boolean;
  checking: boolean;
}

export function useAIMode() {
  const [mode, setMode] = useState<AIMode>(getCurrentMode());
  const [status, setStatus] = useState<AIStatus>({
    ollamaAvailable: false,
    openaiAvailable: false,
    checking: true
  });
  const [initialized, setInitialized] = useState(false);

  // Check availability of both providers
  const checkAvailability = useCallback(async () => {
    setStatus(prev => ({ ...prev, checking: true }));
    
    const [ollamaAvailable, openaiAvailable] = await Promise.all([
      checkOllamaAvailable(),
      Promise.resolve(checkOpenAIAvailable())
    ]);
    
    setStatus({
      ollamaAvailable,
      openaiAvailable,
      checking: false
    });
    
    return { ollamaAvailable, openaiAvailable };
  }, []);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      const { mode: detectedMode, reason } = await autoDetectMode();
      
      setCurrentMode(detectedMode);
      setMode(detectedMode);
      
      await checkAvailability();
      
      setInitialized(true);
      
      // Show startup auto-detection toast
      const modelInfo = AI_MODELS[detectedMode];
      toast({
        title: `🔍 AI Mode Auto-Detected`,
        description: `${detectedMode === "online" ? "🌐 ONLINE" : "🖥️ OFFLINE"} mode selected • ${reason} • Using ${modelInfo.name}`,
      });
    };
    
    init();
  }, [checkAvailability]);

  // Switch mode
  const switchMode = useCallback(async (newMode: AIMode) => {
    // Check if new mode is available
    const { ollamaAvailable, openaiAvailable } = await checkAvailability();
    
    if (newMode === "offline" && !ollamaAvailable) {
      toast({
        title: "❌ Ollama Not Available",
        description: "Start Ollama with: ollama serve",
        variant: "destructive"
      });
      return false;
    }
    
    if (newMode === "online" && !openaiAvailable) {
      toast({
        title: "❌ OpenAI Not Configured",
        description: "Add VITE_OPENAI_API_KEY to your .env file",
        variant: "destructive"
      });
      return false;
    }
    
    setCurrentMode(newMode);
    setMode(newMode);
    
    const modelInfo = AI_MODELS[newMode];
    toast({
      title: `🔥 Switched to ${newMode === "online" ? "ONLINE" : "OFFLINE"} Mode`,
      description: `Now using ${modelInfo.provider} ${modelInfo.name}`,
    });
    
    return true;
  }, [checkAvailability]);

  // Toggle between modes
  const toggleMode = useCallback(async () => {
    const newMode = mode === "online" ? "offline" : "online";
    return switchMode(newMode);
  }, [mode, switchMode]);

  // Re-run auto-detection
  const runAutoDetect = useCallback(async () => {
    const { mode: detectedMode, reason } = await autoDetectMode();
    
    setCurrentMode(detectedMode);
    setMode(detectedMode);
    
    await checkAvailability();
    
    const modelInfo = AI_MODELS[detectedMode];
    toast({
      title: `🔍 Auto-Detected: ${detectedMode.toUpperCase()}`,
      description: `${reason}`,
    });
    
    return detectedMode;
  }, [checkAvailability]);

  return {
    mode,
    isOnline: mode === "online",
    isOffline: mode === "offline",
    model: AI_MODELS[mode],
    status,
    initialized,
    switchMode,
    toggleMode,
    runAutoDetect,
    checkAvailability
  };
}
