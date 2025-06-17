
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOllamaStream } from "@/hooks/useOllamaStream";
import { agents, getAgentByModel } from "@/lib/models";
import { getOllamaModels } from "@/lib/ollama-api";

export const CommandInterface = () => {
  const [input, setInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(agents[0].name);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [history, setHistory] = useState<Array<{type: 'command' | 'response' | 'system', text: string, timestamp: string, agent?: string}>>([
    {
      type: 'system',
      text: '🛡️ M.I.C. Core Online. Sacred law protocols active. Awaiting divine command...',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const { sendPrompt, response, loading, error, resetResponse } = useOllamaStream();

  useEffect(() => {
    // Check available models on component mount
    getOllamaModels().then(setAvailableModels);
  }, []);

  useEffect(() => {
    // Add streaming response to history when complete
    if (response && !loading) {
      const timestamp = new Date().toLocaleTimeString();
      const agent = getAgentByModel(agents.find(a => a.name === selectedAgent)?.model || "");
      
      setHistory(prev => [...prev, {
        type: 'response',
        text: response,
        timestamp,
        agent: agent?.name
      }]);
      resetResponse();
    }
  }, [response, loading, selectedAgent, resetResponse]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const timestamp = new Date().toLocaleTimeString();
    const agent = agents.find(a => a.name === selectedAgent);
    
    if (!agent) {
      console.error("No agent selected");
      return;
    }

    // Add command to history
    setHistory(prev => [...prev, {
      type: 'command',
      text: input,
      timestamp,
      agent: agent.name
    }]);

    // Prepare messages for Ollama
    const messages = [
      { role: "system" as const, content: agent.systemPrompt || "You are a helpful AI assistant." },
      { role: "user" as const, content: input }
    ];

    try {
      await sendPrompt(agent.model, messages);
    } catch (err) {
      const errorTimestamp = new Date().toLocaleTimeString();
      setHistory(prev => [...prev, {
        type: 'response',
        text: `❌ Error: ${error || 'Failed to connect to Ollama. Make sure Ollama is running on localhost:11434'}`,
        timestamp: errorTimestamp,
        agent: 'SYSTEM'
      }]);
    }

    setInput("");
  };

  const getAgentColor = (agentName?: string) => {
    const colorMap: Record<string, string> = {
      'Nexus': 'border-blue-500 bg-blue-500/10 text-blue-300',
      'Omari': 'border-green-500 bg-green-500/10 text-green-300',
      'Bianca': 'border-purple-500 bg-purple-500/10 text-purple-300',
      'R3B3L 4F': 'border-red-500 bg-red-500/10 text-red-300',
    };
    return colorMap[agentName || ''] || 'border-gold-400 bg-gold-400/10 text-gold-400';
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Agent Selection */}
      <div className="mb-4 flex gap-2 items-center">
        <span className="text-sm text-gold-400">Active Agent:</span>
        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
          <SelectTrigger className="w-48 bg-black/50 border-gold-400/30 text-gold-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black border-gold-400/30">
            {agents.map((agent) => (
              <SelectItem key={agent.name} value={agent.name} className="text-gold-400">
                {agent.name} ({agent.model})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-xs text-gold-400/60">
          Models: {availableModels.length > 0 ? availableModels.length : 'Checking...'}
        </div>
      </div>

      {/* Command History */}
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-3">
          {history.map((entry, index) => (
            <div key={index} className={`p-3 rounded border-l-4 ${
              entry.type === 'command' 
                ? 'border-orange-500 bg-orange-500/10 text-orange-300' 
                : entry.type === 'system'
                ? 'border-gold-400 bg-gold-400/10 text-gold-400'
                : getAgentColor(entry.agent)
            }`}>
              <div className="text-xs opacity-60 mb-1">
                [{entry.timestamp}] {entry.agent && `${entry.agent} • `}
                {entry.type === 'command' ? 'USER' : entry.type.toUpperCase()}
              </div>
              <div className="text-sm whitespace-pre-wrap">{entry.text}</div>
            </div>
          ))}
          
          {/* Show streaming response */}
          {loading && response && (
            <div className={`p-3 rounded border-l-4 ${getAgentColor(selectedAgent)} animate-pulse`}>
              <div className="text-xs opacity-60 mb-1">
                [{new Date().toLocaleTimeString()}] {selectedAgent} • STREAMING...
              </div>
              <div className="text-sm whitespace-pre-wrap">{response}</div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Command Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()}
          placeholder="Enter sacred command..."
          className="bg-black/50 border-gold-400/30 text-gold-400 placeholder-gold-400/50"
          disabled={loading}
        />
        <Button 
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="bg-orange-500 hover:bg-orange-600 text-black font-bold min-w-24"
        >
          {loading ? "🔄" : "⚔️"} {loading ? "PROCESSING" : "EXECUTE"}
        </Button>
      </div>
    </div>
  );
};
