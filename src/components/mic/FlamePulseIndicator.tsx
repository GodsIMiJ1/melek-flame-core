import { useState, useEffect } from "react";
import { eventBus, FLAME_EVENTS, FlameThought } from "@/lib/eventBus";

type PulseState = {
  isActive: boolean;
  intensity: number;
  color: string;
  lastPulse: number;
  pulseType: 'THOUGHT' | 'CYCLE' | 'TRIBUNAL' | 'MEMORY' | 'IDLE';
};

export const FlamePulseIndicator = () => {
  const [pulseState, setPulseState] = useState<PulseState>({
    isActive: false,
    intensity: 0,
    color: 'gold',
    lastPulse: Date.now(),
    pulseType: 'IDLE'
  });

  useEffect(() => {
    const handleThought = (thought: FlameThought) => {
      const colorMap = {
        'ORACLE': 'blue',
        'REFLECTOR': 'purple',
        'EXECUTOR': 'red',
        'TRIBUNAL': 'orange',
        'MEMORY': 'green',
        'RECURSION': 'gold',
        'SYSTEM': 'gray'
      };

      setPulseState({
        isActive: true,
        intensity: thought.confidence ? thought.confidence * 100 : 70,
        color: colorMap[thought.type] || 'gold',
        lastPulse: Date.now(),
        pulseType: 'THOUGHT'
      });

      // Reset after pulse duration
      setTimeout(() => {
        setPulseState(prev => ({ ...prev, isActive: false }));
      }, 1500);
    };

    const handleCycleStart = () => {
      setPulseState({
        isActive: true,
        intensity: 90,
        color: 'gold',
        lastPulse: Date.now(),
        pulseType: 'CYCLE'
      });

      setTimeout(() => {
        setPulseState(prev => ({ ...prev, isActive: false }));
      }, 2000);
    };

    const handleTribunalDecision = (data: { status: any }) => {
      const color = data.status.shouldHalt ? 'red' : 'orange';
      setPulseState({
        isActive: true,
        intensity: data.status.shouldHalt ? 100 : 80,
        color,
        lastPulse: Date.now(),
        pulseType: 'TRIBUNAL'
      });

      setTimeout(() => {
        setPulseState(prev => ({ ...prev, isActive: false }));
      }, 2500);
    };

    const handleMemoryUpdate = () => {
      setPulseState({
        isActive: true,
        intensity: 60,
        color: 'green',
        lastPulse: Date.now(),
        pulseType: 'MEMORY'
      });

      setTimeout(() => {
        setPulseState(prev => ({ ...prev, isActive: false }));
      }, 1000);
    };

    eventBus.on(FLAME_EVENTS.THOUGHT, handleThought);
    eventBus.on(FLAME_EVENTS.CYCLE_START, handleCycleStart);
    eventBus.on(FLAME_EVENTS.TRIBUNAL_DECISION, handleTribunalDecision);
    eventBus.on(FLAME_EVENTS.MEMORY_UPDATE, handleMemoryUpdate);

    return () => {
      eventBus.off(FLAME_EVENTS.THOUGHT, handleThought);
      eventBus.off(FLAME_EVENTS.CYCLE_START, handleCycleStart);
      eventBus.off(FLAME_EVENTS.TRIBUNAL_DECISION, handleTribunalDecision);
      eventBus.off(FLAME_EVENTS.MEMORY_UPDATE, handleMemoryUpdate);
    };
  }, []);

  const getPulseColor = (color: string) => {
    const colorMap = {
      'gold': '#fbbf24',
      'blue': '#60a5fa',
      'purple': '#a78bfa',
      'red': '#f87171',
      'orange': '#fb923c',
      'green': '#4ade80',
      'gray': '#9ca3af'
    };
    return colorMap[color] || colorMap.gold;
  };

  const getPulseTypeIcon = (type: string) => {
    const iconMap = {
      'THOUGHT': '💭',
      'CYCLE': '🌀',
      'TRIBUNAL': '🛡️',
      'MEMORY': '💾',
      'IDLE': '🔥'
    };
    return iconMap[type] || iconMap.IDLE;
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {/* Main Pulse Circle */}
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            pulseState.isActive 
              ? 'animate-pulse shadow-lg' 
              : 'opacity-60'
          }`}
          style={{
            borderColor: getPulseColor(pulseState.color),
            backgroundColor: `${getPulseColor(pulseState.color)}20`,
            boxShadow: pulseState.isActive 
              ? `0 0 20px ${getPulseColor(pulseState.color)}60` 
              : 'none'
          }}
        >
          <span className="text-lg">
            {getPulseTypeIcon(pulseState.pulseType)}
          </span>
        </div>

        {/* Ripple Effect */}
        {pulseState.isActive && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              border: `2px solid ${getPulseColor(pulseState.color)}40`
            }}
          />
        )}

        {/* Intensity Ring */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-500"
          style={{
            background: `conic-gradient(${getPulseColor(pulseState.color)} ${pulseState.intensity * 3.6}deg, transparent 0deg)`,
            mask: 'radial-gradient(circle, transparent 70%, black 72%, black 100%)',
            WebkitMask: 'radial-gradient(circle, transparent 70%, black 72%, black 100%)'
          }}
        />
      </div>

      {/* Status Text */}
      <div className="mt-2 text-center">
        <div 
          className="text-xs font-bold transition-colors duration-300"
          style={{ color: getPulseColor(pulseState.color) }}
        >
          {pulseState.pulseType}
        </div>
        <div className="text-xs text-gold-400/60">
          {pulseState.intensity.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};
