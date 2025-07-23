
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOllamaModels } from "@/lib/ollama-api";
import { getOpenAIModels, DEFAULT_OPENAI_MODELS } from "@/lib/openai-api";
import { agents } from "@/lib/models";

export const ModelChamber = () => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentModels, setAgentModels] = useState<Record<string, string>>({});
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Fetch both Ollama and OpenAI models
        const [ollamaModels, openaiModels] = await Promise.all([
          getOllamaModels().catch(() => []),
          getOpenAIModels().catch(() => DEFAULT_OPENAI_MODELS)
        ]);

        const allModels = [...ollamaModels, ...openaiModels];
        setAvailableModels(allModels);

        // Initialize agent models from current configuration
        const currentModels: Record<string, string> = {};
        agents.forEach(agent => {
          currentModels[agent.name] = agent.model;
        });
        setAgentModels(currentModels);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const isModelAvailable = (modelName: string) => {
    // Check for exact match first
    if (availableModels.includes(modelName)) {
      return true;
    }
    // Check for partial match (for models with paths like gurubot/llama3-guru-uncensored:latest)
    return availableModels.some(available =>
      available === modelName ||
      available.includes(modelName.split(':')[0]) ||
      modelName.includes(available.split(':')[0])
    );
  };

  const handleRefreshModels = async () => {
    setLoading(true);
    try {
      // Refresh both Ollama and OpenAI models
      const [ollamaModels, openaiModels] = await Promise.all([
        getOllamaModels().catch(() => []),
        getOpenAIModels().catch(() => DEFAULT_OPENAI_MODELS)
      ]);

      const allModels = [...ollamaModels, ...openaiModels];
      setAvailableModels(allModels);
    } catch (error) {
      console.error("Failed to refresh models:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = async (agentName: string, newModel: string) => {
    setUpdating(agentName);
    try {
      // Update the runtime configuration
      const response = await fetch('/api/models/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName, model: newModel })
      });

      if (response.ok) {
        setAgentModels(prev => ({ ...prev, [agentName]: newModel }));
        console.log(`✅ Updated ${agentName} to use ${newModel}`);
      } else {
        console.error(`❌ Failed to update ${agentName} model`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${agentName} model:`, error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="h-full p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gold-400 border-b border-gold-400/30 pb-2">
        🧬 Model Chamber - Ollama Interface
      </h3>

      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {/* Agent Models - FUNCTIONAL CONFIGURATION */}
          <div className="bg-black/50 p-3 rounded border border-gold-400/30">
            <div className="text-sm font-semibold text-orange-400 mb-2">🔧 Agent Configuration (LIVE)</div>
            <div className="text-xs space-y-3">
              {agents.map((agent) => {
                const currentModel = agentModels[agent.name] || agent.model;
                const isAvailable = isModelAvailable(currentModel);
                const isUpdatingThis = updating === agent.name;

                return (
                  <div key={agent.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gold-400">{agent.name}</span>
                      <div className={`text-xs px-2 py-1 rounded ${
                        isAvailable
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {isUpdatingThis ? '🔄 Updating...' : isAvailable ? '✅ Ready' : '❌ Missing'}
                      </div>
                    </div>
                    <Select
                      value={currentModel}
                      onValueChange={(newModel) => handleModelChange(agent.name, newModel)}
                      disabled={isUpdatingThis || loading}
                    >
                      <SelectTrigger className="h-8 text-xs bg-black/30 border-gold-400/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gold-400/30">
                        {availableModels.map((model) => (
                          <SelectItem key={model} value={model} className="text-xs">
                            <div className="flex items-center gap-2">
                              <span className={isModelAvailable(model) ? 'text-green-400' : 'text-red-400'}>
                                {isModelAvailable(model) ? '✅' : '❌'}
                              </span>
                              {model}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
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
                  <div key={model} className="text-gold-400/80 flex items-center gap-2">
                    {model.startsWith('openai:') ? '🤖' : '📦'}
                    <span className={model.startsWith('openai:') ? 'text-blue-400' : 'text-gold-400/80'}>
                      {model}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-red-400">
                No models found. Make sure Ollama is running and OpenAI API key is set.
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
                onClick={handleRefreshModels}
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
