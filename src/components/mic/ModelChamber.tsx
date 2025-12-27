// Simplified Model Chamber - Online/Offline Toggle
// OpenAI now uses Cloud edge function proxy (no local API key needed)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAIMode } from "@/hooks/useAIMode";
import { Wifi, WifiOff, RefreshCw, Loader2, Cloud, CheckCircle2 } from "lucide-react";

export const ModelChamber = () => {
  const {
    mode,
    isOnline,
    model,
    status,
    initialized,
    toggleMode,
    runAutoDetect,
    checkAvailability
  } = useAIMode();

  if (!initialized) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-gold-400 mx-auto" />
          <p className="text-sm text-gold-400/70">Detecting AI backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 space-y-6 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gold-400 border-b border-gold-400/30 pb-2">
        🔥 AI Mode
      </h3>

      {/* Main Toggle Section */}
      <div className="bg-black/50 p-4 rounded-lg border border-gold-400/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOnline ? (
              <Wifi className="w-6 h-6 text-blue-400" />
            ) : (
              <WifiOff className="w-6 h-6 text-orange-400" />
            )}
            <div>
              <div className="text-lg font-bold text-gold-400">
                {isOnline ? "ONLINE" : "OFFLINE"}
              </div>
              <div className="text-xs text-gold-400/70">
                {model.provider} • {model.name}
              </div>
            </div>
          </div>
          
          <Switch
            checked={isOnline}
            onCheckedChange={() => toggleMode()}
            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-orange-500"
          />
        </div>

        <div className="text-sm text-gold-400/80 p-3 bg-black/30 rounded border-l-4 border-gold-400/50">
          {model.description}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="bg-black/50 p-4 rounded-lg border border-gold-400/30 space-y-3">
        <div className="text-sm font-semibold text-orange-400">Connection Status</div>
        
        <div className="space-y-2">
          {/* OpenAI Status */}
          <div className="flex items-center justify-between p-2 bg-black/30 rounded">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gold-400">OpenAI (Cloud Proxy)</span>
            </div>
            <div className={`text-xs px-2 py-1 rounded ${
              status.openaiAvailable 
                ? "bg-green-500/20 text-green-400" 
                : "bg-red-500/20 text-red-400"
            }`}>
              {status.checking ? "Checking..." : status.openaiAvailable ? "✅ Ready" : "❌ Not Configured"}
            </div>
          </div>

          {/* Ollama Status */}
          <div className="flex items-center justify-between p-2 bg-black/30 rounded">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gold-400">Ollama (llama3.1:8b)</span>
            </div>
            <div className={`text-xs px-2 py-1 rounded ${
              status.ollamaAvailable 
                ? "bg-green-500/20 text-green-400" 
                : "bg-red-500/20 text-red-400"
            }`}>
              {status.checking ? "Checking..." : status.ollamaAvailable ? "✅ Running" : "❌ Not Running"}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-black/50 p-4 rounded-lg border border-gold-400/30 space-y-3">
        <div className="text-sm font-semibold text-orange-400">Quick Actions</div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/50 text-xs"
            onClick={runAutoDetect}
            disabled={status.checking}
          >
            {status.checking ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3 mr-1" />
            )}
            Auto-Detect
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/50 text-xs"
            onClick={checkAvailability}
            disabled={status.checking}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Current Configuration */}
      <div className="bg-black/50 p-4 rounded-lg border border-gold-400/30 space-y-2">
        <div className="text-sm font-semibold text-orange-400">Active Configuration</div>
        <div className="text-xs space-y-1 text-gold-400/70">
          <div>Mode: <span className="text-gold-400 font-mono">{mode.toUpperCase()}</span></div>
          <div>Model: <span className="text-gold-400 font-mono">{model.name}</span></div>
          <div>Provider: <span className="text-gold-400 font-mono">{model.provider}</span></div>
        </div>
      </div>

      {/* Cloud Status */}
      <div className="bg-black/50 p-4 rounded-lg border border-green-400/30 space-y-3">
        <div className="text-sm font-semibold text-green-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Cloud Proxy Enabled
        </div>
        <p className="text-xs text-gold-400/70">
          OpenAI API calls are routed through a secure Cloud edge function.
          No local API key required - credentials are stored securely in Cloud secrets.
        </p>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gold-400/50 p-3 bg-black/30 rounded border border-gold-400/20">
        <p><strong>ONLINE:</strong> Uses OpenAI via Cloud proxy (no setup needed)</p>
        <p><strong>OFFLINE:</strong> Requires Ollama running locally</p>
        <p className="mt-2">Start Ollama: <code className="bg-black/50 px-1 rounded">ollama serve</code></p>
      </div>
    </div>
  );
};
