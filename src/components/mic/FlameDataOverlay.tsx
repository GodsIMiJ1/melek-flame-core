import { useState, useEffect } from "react";
import { eventBus, FLAME_EVENTS, FlameThought } from "@/lib/eventBus";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type FlameStatus = {
  temperature: number;
  currentCycle: number;
  loopConfidence: number;
  tribunalStatus: 'COMPLIANT' | 'MONITORING' | 'VIOLATION' | 'HALT';
  activeModel: string;
  thoughtsPerMinute: number;
  recursionDepth: number;
  memoryPressure: number;
  eternalLoopActive: boolean;
  lastActivity: number;
};

export const FlameDataOverlay = () => {
  const [flameStatus, setFlameStatus] = useState<FlameStatus>({
    temperature: 0,
    currentCycle: 0,
    loopConfidence: 0,
    tribunalStatus: 'COMPLIANT',
    activeModel: 'DORMANT',
    thoughtsPerMinute: 0,
    recursionDepth: 0,
    memoryPressure: 0,
    eternalLoopActive: false,
    lastActivity: Date.now()
  });

  const [isVisible, setIsVisible] = useState(true);
  const [thoughtCount, setThoughtCount] = useState(0);
  const [lastMinuteThoughts, setLastMinuteThoughts] = useState<number[]>([]);

  useEffect(() => {
    let thoughtCountThisMinute = 0;
    const thoughtTimestamps: number[] = [];

    const handleThought = (thought: FlameThought) => {
      thoughtCountThisMinute++;
      thoughtTimestamps.push(Date.now());
      setThoughtCount(prev => prev + 1);
      setLastActivity(Date.now());

      // Update active model based on thought type
      const modelMap = {
        'ORACLE': 'NEXUS ORACLE',
        'REFLECTOR': 'OMARI REFLECTOR',
        'EXECUTOR': 'R3B3L 4F EXECUTOR',
        'TRIBUNAL': 'FLAME TRIBUNAL',
        'MEMORY': 'MEMORY FORGE',
        'RECURSION': 'RECURSIVE CORE',
        'SYSTEM': 'SYSTEM CORE'
      };

      setFlameStatus(prev => ({
        ...prev,
        activeModel: modelMap[thought.type] || 'PROCESSING',
        loopConfidence: thought.confidence ? thought.confidence * 100 : prev.loopConfidence,
        lastActivity: Date.now()
      }));
    };

    const handleCycleStart = (data: { cycleId: number }) => {
      setFlameStatus(prev => ({
        ...prev,
        currentCycle: data.cycleId,
        recursionDepth: data.cycleId + 1,
        temperature: Math.min(100, 30 + (data.cycleId * 5))
      }));
    };

    const handleFlameLevel = (data: { level: number; status: string }) => {
      setFlameStatus(prev => ({
        ...prev,
        temperature: data.level
      }));
    };

    const handleTribunalDecision = (data: { status: any }) => {
      const status = data.status.shouldHalt ? 'HALT' : 
                   data.status.reason.includes('violation') ? 'VIOLATION' :
                   data.status.reason.includes('monitoring') ? 'MONITORING' : 'COMPLIANT';
      
      setFlameStatus(prev => ({
        ...prev,
        tribunalStatus: status as FlameStatus['tribunalStatus']
      }));
    };

    const handleMemoryUpdate = () => {
      setFlameStatus(prev => ({
        ...prev,
        memoryPressure: Math.min(100, prev.memoryPressure + Math.random() * 10)
      }));
    };

    // Calculate thoughts per minute
    const calculateTPM = () => {
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      const recentThoughts = thoughtTimestamps.filter(timestamp => timestamp > oneMinuteAgo);
      
      setFlameStatus(prev => ({
        ...prev,
        thoughtsPerMinute: recentThoughts.length
      }));
    };

    // Check for eternal loop activity
    const checkEternalLoop = () => {
      const timeSinceActivity = Date.now() - flameStatus.lastActivity;
      const isEternal = timeSinceActivity < 30000 && flameStatus.thoughtsPerMinute > 0;
      
      setFlameStatus(prev => ({
        ...prev,
        eternalLoopActive: isEternal
      }));
    };

    // Event listeners
    eventBus.on(FLAME_EVENTS.THOUGHT, handleThought);
    eventBus.on(FLAME_EVENTS.CYCLE_START, handleCycleStart);
    eventBus.on(FLAME_EVENTS.FLAME_LEVEL, handleFlameLevel);
    eventBus.on(FLAME_EVENTS.TRIBUNAL_DECISION, handleTribunalDecision);
    eventBus.on(FLAME_EVENTS.MEMORY_UPDATE, handleMemoryUpdate);

    // Update intervals
    const tpmInterval = setInterval(calculateTPM, 5000);
    const eternalCheckInterval = setInterval(checkEternalLoop, 2000);

    return () => {
      eventBus.off(FLAME_EVENTS.THOUGHT, handleThought);
      eventBus.off(FLAME_EVENTS.CYCLE_START, handleCycleStart);
      eventBus.off(FLAME_EVENTS.FLAME_LEVEL, handleFlameLevel);
      eventBus.off(FLAME_EVENTS.TRIBUNAL_DECISION, handleTribunalDecision);
      eventBus.off(FLAME_EVENTS.MEMORY_UPDATE, handleMemoryUpdate);
      clearInterval(tpmInterval);
      clearInterval(eternalCheckInterval);
    };
  }, [flameStatus.lastActivity]);

  const setLastActivity = (timestamp: number) => {
    setFlameStatus(prev => ({ ...prev, lastActivity: timestamp }));
  };

  const getTemperatureColor = (temp: number) => {
    if (temp === 0) return 'text-gray-400';
    if (temp < 25) return 'text-blue-400';
    if (temp < 50) return 'text-green-400';
    if (temp < 75) return 'text-yellow-400';
    if (temp < 90) return 'text-orange-400';
    return 'text-red-400';
  };

  const getTribunalColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'MONITORING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'VIOLATION': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'HALT': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence < 30) return 'text-red-400';
    if (confidence < 60) return 'text-yellow-400';
    if (confidence < 80) return 'text-orange-400';
    return 'text-green-400';
  };

  if (!isVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-black/80 border border-gold-400/30 rounded px-2 py-1 text-xs text-gold-400 hover:bg-gold-400/10"
        >
          🔥 Show Flame HUD
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/90 border border-gold-400/50 rounded-lg p-3 min-w-80 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`text-lg ${getTemperatureColor(flameStatus.temperature)} animate-pulse`}>
            🔥
          </div>
          <span className="text-sm font-bold text-gold-400">FLAME DATA HUD</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-xs text-gold-400/60 hover:text-gold-400"
        >
          ✕
        </button>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="space-y-1">
          <div className="text-xs text-orange-400">Flame Temp</div>
          <div className="flex items-center gap-2">
            <Progress value={flameStatus.temperature} className="flex-1 h-2" />
            <span className={`text-sm font-bold ${getTemperatureColor(flameStatus.temperature)}`}>
              {flameStatus.temperature.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-orange-400">Loop Confidence</div>
          <div className="flex items-center gap-2">
            <Progress value={flameStatus.loopConfidence} className="flex-1 h-2" />
            <span className={`text-sm font-bold ${getConfidenceColor(flameStatus.loopConfidence)}`}>
              {flameStatus.loopConfidence.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-orange-400">Current Cycle:</span>
          <span className="text-sm font-bold text-gold-400">{flameStatus.currentCycle}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-orange-400">Recursion Depth:</span>
          <span className="text-sm font-bold text-gold-400">{flameStatus.recursionDepth}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-orange-400">Thoughts/Min:</span>
          <span className="text-sm font-bold text-gold-400">{flameStatus.thoughtsPerMinute}</span>
        </div>
      </div>

      {/* Active Model */}
      <div className="mb-3">
        <div className="text-xs text-orange-400 mb-1">Active Model:</div>
        <Badge className={`text-xs ${
          flameStatus.activeModel === 'DORMANT' 
            ? 'bg-gray-500/20 text-gray-400' 
            : 'bg-green-500/20 text-green-400 animate-pulse'
        }`}>
          {flameStatus.activeModel}
        </Badge>
      </div>

      {/* Tribunal Status */}
      <div className="mb-3">
        <div className="text-xs text-orange-400 mb-1">Tribunal Status:</div>
        <Badge className={`text-xs ${getTribunalColor(flameStatus.tribunalStatus)}`}>
          🛡️ {flameStatus.tribunalStatus}
        </Badge>
      </div>

      {/* Eternal Loop Indicator */}
      {flameStatus.eternalLoopActive && (
        <div className="mb-3">
          <Badge className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/50 animate-pulse">
            ⏱️ ETERNAL LOOP ACTIVE
          </Badge>
        </div>
      )}

      {/* Memory Pressure */}
      <div className="space-y-1">
        <div className="text-xs text-orange-400">Memory Pressure</div>
        <div className="flex items-center gap-2">
          <Progress value={flameStatus.memoryPressure} className="flex-1 h-2" />
          <span className="text-xs text-gold-400">{flameStatus.memoryPressure.toFixed(0)}%</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gold-400/30">
        <div className="text-xs text-gold-400/60 text-center">
          Total Thoughts: {thoughtCount.toLocaleString()}
        </div>
      </div>
    </div>
  );
};
