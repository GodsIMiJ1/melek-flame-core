
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getOllamaModels } from "@/lib/ollama-api";
import { agents } from "@/lib/models";

export const ModelChamber = () => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const models = await getOllamaModels();
        setAvailableModels(models);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const isModelAvailable = (modelName: string) => {
    return availableModels.some(available => available.includes(modelName.split(':')[0]));
  };

  return (
    <div className="h-full p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gold-400 border-b border-gold-400/30 pb-2">
        🧬 Model Chamber - Ollama Interface
      </h3>
      
      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {/* Agent Models */}
          <div className="bg-black/50 p-3 rounded border border-gold-400/30">
            <div className="text-sm font-semibold text-orange-400 mb-2">Configured Agents</div>
            <div className="text-xs space-y-2">
              {agents.map((agent) => (
                <div key={agent.name} className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gold-400">{agent.name}</span>
                    <div className="text-gold-400/60">{agent.model}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    isModelAvailable(agent.model) 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {isModelAvailable(agent.model) ? '✅ Ready' : '❌ Missing'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Models */}
          <div className="bg-black/50 p-3 rounded border border-gold-400/30">
            <div className="text-sm font-semibold text-orange-400 mb-2">
              Available Models ({availableModels.length})
            </div>
            {loading ? (
              <div className="text-xs text-gold-400/60">Loading models...</div>
            ) : availableModels.length > 0 ? (
              <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                {availableModels.map((model) => (
                  <div key={model} className="text-gold-400/80">
                    📦 {model}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-red-400">
                No models found. Make sure Ollama is running and models are installed.
              </div>
            )}
          </div>
          
          {/* Connection Status */}
          <div className="bg-black/50 p-3 rounded border border-gold-400/30">
            <div className="text-sm font-semibold text-orange-400 mb-2">Connection Status</div>
            <div className="text-xs space-y-1">
              <div className={`${loading ? 'text-yellow-400' : availableModels.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {loading ? '🔄 Checking connection...' : 
                 availableModels.length > 0 ? '🟢 Connected to Ollama' : '🔴 Ollama not accessible'}
              </div>
              <div className="text-gold-400/60">Endpoint: http://localhost:11434</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-black/50 p-3 rounded border border-gold-400/30">
            <div className="text-sm font-semibold text-orange-400 mb-2">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                className="bg-orange-500/20 hover:bg-orange-500/30 text-xs"
                onClick={() => window.open('http://localhost:11434', '_blank')}
              >
                🌐 Ollama Web
              </Button>
              <Button 
                size="sm" 
                className="bg-orange-500/20 hover:bg-orange-500/30 text-xs"
                onClick={() => setLoading(true) || getOllamaModels().then(setAvailableModels).finally(() => setLoading(false))}
              >
                🔄 Refresh Models
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
