
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CommandInterface = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Array<{type: 'command' | 'response', text: string, timestamp: string}>>([
    {
      type: 'response',
      text: '🛡️ M.I.C. Core Online. Sacred law protocols active. Awaiting divine command...',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const handleSubmit = () => {
    if (!input.trim()) return;

    const timestamp = new Date().toLocaleTimeString();
    
    // Add command to history
    setHistory(prev => [...prev, {
      type: 'command',
      text: input,
      timestamp
    }]);

    // Simulate response
    setTimeout(() => {
      const responses = [
        "🔥 Command processed through Flame Logic filter...",
        "⚖️ Ethical evaluation complete. Proceeding with sacred compliance.",
        "🌀 Recursive analysis initiated. Confidence level: 87.3%",
        "🛡️ Guardian protocols engaged. Decision logged in Tribunal.",
        "🧬 Neural pathways optimized. Memory forge updated.",
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      setHistory(prev => [...prev, {
        type: 'response',
        text: response,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Command History */}
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-3">
          {history.map((entry, index) => (
            <div key={index} className={`p-3 rounded border-l-4 ${
              entry.type === 'command' 
                ? 'border-orange-500 bg-orange-500/10 text-orange-300' 
                : 'border-gold-400 bg-gold-400/10 text-gold-400'
            }`}>
              <div className="text-xs opacity-60 mb-1">[{entry.timestamp}]</div>
              <div className="text-sm">{entry.text}</div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Command Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter sacred command..."
          className="bg-black/50 border-gold-400/30 text-gold-400 placeholder-gold-400/50"
        />
        <Button 
          onClick={handleSubmit}
          className="bg-orange-500 hover:bg-orange-600 text-black font-bold"
        >
          ⚔️ EXECUTE
        </Button>
      </div>
    </div>
  );
};
