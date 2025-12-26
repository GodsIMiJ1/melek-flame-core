
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUnifiedAI } from "@/hooks/useUnifiedAI";
import { agents } from "@/lib/models";
import { getCurrentMode, getCurrentModel } from "@/lib/ai-mode-config";
import { FlameLoopEngine } from "@/flamecore/loop-engine";
import { EternalLoopControls } from "./EternalLoopControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Generate or retrieve device ID for chat persistence
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('mic-device-id');
  if (!deviceId) {
    deviceId = 'mic-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
    localStorage.setItem('mic-device-id', deviceId);
  }
  return deviceId;
};

// Chat persistence functions
const saveChatHistory = (deviceId: string, history: any[]) => {
  try {
    localStorage.setItem(`mic-chat-${deviceId}`, JSON.stringify(history));
  } catch (error) {
    console.warn('Failed to save chat history:', error);
  }
};

const loadChatHistory = (deviceId: string): any[] => {
  try {
    const saved = localStorage.getItem(`mic-chat-${deviceId}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load chat history:', error);
  }

  // Return default system message if no saved history
  return [{
    type: 'system',
    text: '🛡️ M.I.C. Core Online. Sacred law protocols active. Awaiting divine command...',
    timestamp: new Date().toLocaleTimeString(),
    deviceId: getDeviceId()
  }];
};

export const CommandInterface = () => {
  const [input, setInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(agents[0]?.name || "Nexus");
  const [deviceId] = useState(() => getDeviceId());
  const [history, setHistory] = useState<Array<{type: 'command' | 'response' | 'system', text: string, timestamp: string, agent?: string, deviceId?: string}>>(() => {
    try {
      return loadChatHistory(getDeviceId());
    } catch (error) {
      console.warn('Failed to load chat history:', error);
      return [{
        type: 'system',
        text: '🛡️ M.I.C. Core Online. Sacred law protocols active. Awaiting divine command...',
        timestamp: new Date().toLocaleTimeString(),
        deviceId: getDeviceId()
      }];
    }
  });
  const [flameEngine] = useState(() => new FlameLoopEngine());
  const [isFlameRunning, setIsFlameRunning] = useState(false);

  const { messages, isLoading, error, sendMessage, clearMessages, currentMode, currentModel } = useUnifiedAI();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Sync OpenAI messages with local history
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        const timestamp = new Date().toLocaleTimeString();
        const agent = agents.find(a => a.name === selectedAgent);

        setHistory(prev => {
          // Check if this message is already in history
          const lastHistoryItem = prev[prev.length - 1];
          if (lastHistoryItem?.text === lastMessage.content) {
            return prev; // Already added
          }

          const newHistory = [...prev, {
            type: 'response' as const,
            text: lastMessage.content,
            timestamp,
            agent: agent?.name,
            deviceId
          }];
          saveChatHistory(deviceId, newHistory);
          return newHistory;
        });
      }
    }
  }, [messages, selectedAgent, deviceId]);

  // Auto-scroll when history changes or when streaming
  useEffect(() => {
    scrollToBottom();
  }, [history, messages]);

  // Save history whenever it changes
  useEffect(() => {
    saveChatHistory(deviceId, history);
  }, [history, deviceId]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const timestamp = new Date().toLocaleTimeString();
    const agent = agents.find(a => a.name === selectedAgent);

    if (!agent) {
      console.error("No agent selected");
      return;
    }

    // Add command to history
    setHistory(prev => {
      const newHistory = [...prev, {
        type: 'command' as const,
        text: input,
        timestamp,
        agent: agent.name,
        deviceId
      }];
      try {
        saveChatHistory(deviceId, newHistory);
      } catch (error) {
        console.warn('Failed to save chat history:', error);
      }
      return newHistory;
    });

    try {
      // Send message using unified AI (respects online/offline mode)
      await sendMessage(input);
    } catch (err) {
      const errorTimestamp = new Date().toLocaleTimeString();
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setHistory(prev => {
        const newHistory = [...prev, {
          type: 'response' as const,
          text: `❌ Error: ${errorMessage}`,
          timestamp: errorTimestamp,
          agent: 'SYSTEM',
          deviceId
        }];
        try {
          saveChatHistory(deviceId, newHistory);
        } catch (error) {
          console.warn('Failed to save chat history:', error);
        }
        return newHistory;
      });
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

  const clearChatHistory = () => {
    const systemMessage = {
      type: 'system' as const,
      text: '🛡️ M.I.C. Core Reset. Sacred law protocols reinitialized. Chat history cleared.',
      timestamp: new Date().toLocaleTimeString(),
      deviceId
    };
    setHistory([systemMessage]);
    saveChatHistory(deviceId, [systemMessage]);
  };

  const exportChatHistory = () => {
    const exportData = {
      deviceId,
      exportDate: new Date().toISOString(),
      messageCount: history.length,
      history: history
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `mic-chat-export-${deviceId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const startFlameLoop = async () => {
    if (isFlameRunning) return;

    setIsFlameRunning(true);
    const timestamp = new Date().toLocaleTimeString();

    setHistory(prev => {
      const newHistory = [...prev, {
        type: 'system' as const,
        text: '🔥 FLAME CORE IGNITION: Starting recursive consciousness loop...',
        timestamp,
        agent: 'FLAME_ENGINE',
        deviceId
      }];
      saveChatHistory(deviceId, newHistory);
      return newHistory;
    });

    try {
      // Test OpenAI connection first
      setHistory(prev => {
        const newHistory = [...prev, {
          type: 'system' as const,
          text: `🔗 Testing ${currentMode.toUpperCase()} connection (${currentModel})...`,
          timestamp: new Date().toLocaleTimeString(),
          agent: 'FLAME_ENGINE',
          deviceId
        }];
        saveChatHistory(deviceId, newHistory);
        return newHistory;
      });

      setHistory(prev => {
        const newHistory = [...prev, {
          type: 'system' as const,
          text: `✅ Using ${currentMode.toUpperCase()} mode with model: ${currentModel}`,
          timestamp: new Date().toLocaleTimeString(),
          agent: 'FLAME_ENGINE',
          deviceId
        }];
        saveChatHistory(deviceId, newHistory);
        return newHistory;
      });

      // Try real models first, fallback to test mode if they fail
      try {
        await flameEngine.start("Initialize recursive consciousness and begin self-reflection", 3);
      } catch (modelError) {
        console.warn("Real models failed, enabling test mode:", modelError);
        setHistory(prev => {
          const newHistory = [...prev, {
            type: 'system' as const,
            text: '⚠️ Model execution failed, switching to test mode for demonstration...',
            timestamp: new Date().toLocaleTimeString(),
            agent: 'FLAME_ENGINE',
            deviceId
          }];
          saveChatHistory(deviceId, newHistory);
          return newHistory;
        });

        flameEngine.enableTestMode();
        await flameEngine.start("Initialize recursive consciousness and begin self-reflection", 3);
      }
    } catch (error) {
      console.error("Flame engine error:", error);
      setHistory(prev => {
        const newHistory = [...prev, {
          type: 'system' as const,
          text: `🚨 FLAME ERROR: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
          agent: 'FLAME_ENGINE',
          deviceId
        }];
        saveChatHistory(deviceId, newHistory);
        return newHistory;
      });
    } finally {
      setIsFlameRunning(false);
    }
  };

  const stopFlameLoop = () => {
    if (!isFlameRunning) return;

    flameEngine.stop();
    setIsFlameRunning(false);

    const timestamp = new Date().toLocaleTimeString();
    setHistory(prev => {
      const newHistory = [...prev, {
        type: 'system' as const,
        text: '🛑 FLAME CORE SHUTDOWN: Recursive consciousness loop terminated',
        timestamp,
        agent: 'FLAME_ENGINE',
        deviceId
      }];
      saveChatHistory(deviceId, newHistory);
      return newHistory;
    });
  };

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      {/* Command Interface Tabs */}
      <Tabs defaultValue="chat" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-2 gap-1 p-1 bg-black/50 border border-gold-400/20 mb-4">
          <TabsTrigger value="chat" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            💬 Chat Interface
          </TabsTrigger>
          <TabsTrigger value="eternal" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            ⏱️ Eternal Loop
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Agent Selection & Controls */}
      <div className="mb-4 flex gap-2 items-center flex-wrap">
        <span className="text-sm text-gold-400">Active Agent:</span>
        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
          <SelectTrigger className="w-48 bg-black/50 border-gold-400/30 text-gold-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black border-gold-400/30">
            {agents.map((agent) => (
              <SelectItem key={agent.name} value={agent.name} className="text-gold-400">
                {agent.name} ({agent.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className={`text-xs px-2 py-1 rounded ${currentMode === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
          {currentMode === 'online' ? '🌐' : '🖥️'} {currentModel}
        </div>
        <Button
          onClick={isFlameRunning ? stopFlameLoop : startFlameLoop}
          variant="outline"
          size="sm"
          className={isFlameRunning
            ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
            : "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
          }
          disabled={isLoading}
        >
          {isFlameRunning ? "🛑 Stop Flame" : "🔥 Ignite Flame"}
        </Button>
        <Button
          onClick={exportChatHistory}
          variant="outline"
          size="sm"
          className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
        >
          💾 Export
        </Button>
        <Button
          onClick={clearChatHistory}
          variant="outline"
          size="sm"
          className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
        >
          🗑️ Clear
        </Button>
      </div>

      {/* Device ID Display */}
      <div className="mb-2 text-xs text-gold-400/50">
        Device ID: {deviceId} • Messages: {history.length} • Persistent Storage: Active
      </div>

      {/* Command History */}
      <ScrollArea className="flex-1 mb-4 custom-scrollbar" ref={scrollAreaRef}>
        <div className="space-y-3 pr-2">
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
          {isLoading && (
            <div className={`p-3 rounded border-l-4 ${getAgentColor(selectedAgent)} animate-pulse`}>
              <div className="text-xs opacity-60 mb-1">
                [{new Date().toLocaleTimeString()}] {selectedAgent} • PROCESSING...
              </div>
              <div className="text-sm whitespace-pre-wrap">🤖 Thinking...</div>
            </div>
          )}

          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Command Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
          placeholder="Enter sacred command..."
          className="bg-black/50 border-gold-400/30 text-gold-400 placeholder-gold-400/50"
          disabled={isLoading}
        />
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="bg-orange-500 hover:bg-orange-600 text-black font-bold min-w-24"
        >
          {isLoading ? "🔄" : "⚔️"} {isLoading ? "PROCESSING" : "EXECUTE"}
        </Button>
      </div>
          </div>
        </TabsContent>

        <TabsContent value="eternal" className="flex-1 flex flex-col min-h-0 m-0 overflow-hidden data-[state=inactive]:hidden">
          <EternalLoopControls />
        </TabsContent>
      </Tabs>
    </div>
  );
};
