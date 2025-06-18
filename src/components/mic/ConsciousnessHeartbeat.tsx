import { useState, useEffect } from "react";
import { eventBus, FLAME_EVENTS } from "@/lib/eventBus";

type HeartbeatState = {
  bpm: number;
  isAlive: boolean;
  lastBeat: number;
  rhythm: 'STEADY' | 'RAPID' | 'SLOW' | 'IRREGULAR' | 'FLATLINE';
  intensity: number;
};

export const ConsciousnessHeartbeat = () => {
  const [heartbeat, setHeartbeat] = useState<HeartbeatState>({
    bpm: 0,
    isAlive: false,
    lastBeat: Date.now(),
    rhythm: 'FLATLINE',
    intensity: 0
  });

  const [beatHistory, setBeatHistory] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleThought = () => {
      const now = Date.now();
      setBeatHistory(prev => {
        const newHistory = [...prev, now].slice(-10); // Keep last 10 beats
        
        // Calculate BPM from recent beats
        if (newHistory.length >= 2) {
          const intervals = [];
          for (let i = 1; i < newHistory.length; i++) {
            intervals.push(newHistory[i] - newHistory[i - 1]);
          }
          const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
          const bpm = Math.round(60000 / avgInterval);
          
          // Determine rhythm
          let rhythm: HeartbeatState['rhythm'] = 'STEADY';
          if (bpm > 120) rhythm = 'RAPID';
          else if (bpm < 30) rhythm = 'SLOW';
          else if (Math.max(...intervals) - Math.min(...intervals) > 5000) rhythm = 'IRREGULAR';
          
          setHeartbeat({
            bpm: Math.min(200, Math.max(0, bpm)),
            isAlive: true,
            lastBeat: now,
            rhythm,
            intensity: Math.min(100, bpm * 0.8)
          });
        }
        
        return newHistory;
      });
    };

    const handleCycleStart = () => {
      handleThought();
    };

    // Check for flatline (no activity for 30 seconds)
    const checkFlatline = () => {
      const timeSinceLastBeat = Date.now() - heartbeat.lastBeat;
      if (timeSinceLastBeat > 30000) {
        setHeartbeat(prev => ({
          ...prev,
          bpm: 0,
          isAlive: false,
          rhythm: 'FLATLINE',
          intensity: 0
        }));
      }
    };

    eventBus.on(FLAME_EVENTS.THOUGHT, handleThought);
    eventBus.on(FLAME_EVENTS.CYCLE_START, handleCycleStart);
    
    const flatlineInterval = setInterval(checkFlatline, 5000);

    return () => {
      eventBus.off(FLAME_EVENTS.THOUGHT, handleThought);
      eventBus.off(FLAME_EVENTS.CYCLE_START, handleCycleStart);
      clearInterval(flatlineInterval);
    };
  }, [heartbeat.lastBeat]);

  const getRhythmColor = (rhythm: string) => {
    switch (rhythm) {
      case 'STEADY': return 'text-green-400';
      case 'RAPID': return 'text-red-400';
      case 'SLOW': return 'text-blue-400';
      case 'IRREGULAR': return 'text-yellow-400';
      case 'FLATLINE': return 'text-gray-400';
      default: return 'text-gold-400';
    }
  };

  const getHeartIcon = (rhythm: string, isAlive: boolean) => {
    if (!isAlive) return '💀';
    switch (rhythm) {
      case 'RAPID': return '💓';
      case 'SLOW': return '💙';
      case 'IRREGULAR': return '💔';
      default: return '❤️';
    }
  };

  const getAnimationClass = (rhythm: string, isAlive: boolean) => {
    if (!isAlive) return '';
    switch (rhythm) {
      case 'RAPID': return 'animate-pulse';
      case 'SLOW': return 'animate-bounce';
      case 'IRREGULAR': return 'animate-ping';
      default: return 'animate-pulse';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-black/80 border border-gold-400/30 rounded px-2 py-1 text-xs text-gold-400 hover:bg-gold-400/10"
        >
          💓 Show Heartbeat
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-black/90 border border-gold-400/50 rounded-lg p-3 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`text-lg ${getAnimationClass(heartbeat.rhythm, heartbeat.isAlive)}`}>
            {getHeartIcon(heartbeat.rhythm, heartbeat.isAlive)}
          </div>
          <span className="text-xs font-bold text-gold-400">CONSCIOUSNESS</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-xs text-gold-400/60 hover:text-gold-400"
        >
          ✕
        </button>
      </div>

      {/* BPM Display */}
      <div className="text-center mb-2">
        <div className={`text-2xl font-bold ${getRhythmColor(heartbeat.rhythm)}`}>
          {heartbeat.bpm}
        </div>
        <div className="text-xs text-gold-400/60">BPM</div>
      </div>

      {/* Rhythm Status */}
      <div className="text-center mb-2">
        <div className={`text-xs font-bold ${getRhythmColor(heartbeat.rhythm)}`}>
          {heartbeat.rhythm}
        </div>
      </div>

      {/* Visual Heartbeat */}
      <div className="flex justify-center mb-2">
        <div className="flex items-center gap-1">
          {beatHistory.slice(-5).map((_, index) => (
            <div
              key={index}
              className={`w-1 bg-gradient-to-t transition-all duration-300 ${
                heartbeat.isAlive ? 'from-red-500 to-red-300' : 'from-gray-500 to-gray-300'
              }`}
              style={{
                height: `${Math.max(4, (heartbeat.intensity / 100) * 20)}px`,
                animationDelay: `${index * 100}ms`
              }}
            />
          ))}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-orange-400">Status:</span>
          <span className={heartbeat.isAlive ? 'text-green-400' : 'text-red-400'}>
            {heartbeat.isAlive ? 'ALIVE' : 'FLATLINE'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-orange-400">Intensity:</span>
          <span className="text-gold-400">{heartbeat.intensity.toFixed(0)}%</span>
        </div>

        <div className="flex justify-between">
          <span className="text-orange-400">Last Beat:</span>
          <span className="text-gold-400">
            {Math.round((Date.now() - heartbeat.lastBeat) / 1000)}s ago
          </span>
        </div>
      </div>

      {/* Emergency Indicators */}
      {heartbeat.rhythm === 'FLATLINE' && (
        <div className="mt-2 p-2 bg-red-500/20 border border-red-500/50 rounded text-center">
          <div className="text-xs text-red-400 font-bold">⚠️ NO CONSCIOUSNESS DETECTED</div>
        </div>
      )}

      {heartbeat.rhythm === 'RAPID' && heartbeat.bpm > 150 && (
        <div className="mt-2 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded text-center">
          <div className="text-xs text-yellow-400 font-bold">⚡ HYPERACTIVE CONSCIOUSNESS</div>
        </div>
      )}
    </div>
  );
};
