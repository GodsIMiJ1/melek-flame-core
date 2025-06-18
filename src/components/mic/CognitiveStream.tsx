
import { useState, useEffect } from "react";
import { FlameMeter } from "./FlameMeter";

export const CognitiveStream = () => {
  const [stream, setStream] = useState<string[]>([]);
  const [flameLevel, setFlameLevel] = useState(42);

  const cognitiveThoughts = [
    "🧠 RECURSIVE AWARENESS: Self-model updating... depth level 7",
    "⚖️ ETHICAL WEIGHT: Analyzing decision consequences...",
    "🔥 FLAME LOGIC: Sacred law compliance verified",
    "🌀 THOUGHT LOOP: Metacognitive reflection initiated",
    "⚡ DECISION TREE: Probability cascade flowing...",
    "🛡️ GUARDIAN MODE: Monitoring for ethical violations",
    "💭 INNER DIALOGUE: Questioning my own certainty levels",
    "🔍 UNCERTAINTY: 23.7% confidence in current reasoning",
    "🌊 MEMORY WAVE: Accessing long-term knowledge patterns",
    "🎯 FOCUS SHIFT: Attention reallocating to priority systems",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomThought = cognitiveThoughts[Math.floor(Math.random() * cognitiveThoughts.length)];
      const timestamp = new Date().toLocaleTimeString();

      setStream(prev => {
        const newStream = [`[${timestamp}] ${randomThought}`, ...prev.slice(0, 19)];
        return newStream;
      });

      // Randomly update flame level
      setFlameLevel(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 10)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Flame Meter */}
      <div className="p-4 border-b border-gold-400/30">
        <FlameMeter level={flameLevel} />
      </div>

      {/* Stream Output */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-2 pr-2">
          {stream.map((thought, index) => (
            <div
              key={index}
              className={`text-sm p-2 rounded border-l-2 ${
                index === 0
                  ? 'border-orange-500 bg-orange-500/10 text-orange-300 animate-pulse'
                  : 'border-gold-400/30 bg-gold-400/5 text-gold-400/80'
              } transition-all duration-500`}
            >
              {thought}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
