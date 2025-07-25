
import { useState, useEffect } from "react";
import { eventBus, FLAME_EVENTS } from "@/lib/eventBus";
import { recursiveSelfReflectionEngine, SelfReflectionMetrics } from "@/flamecore/recursive-self-reflection-engine";

export const RecursiveCore = () => {
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [metrics, setMetrics] = useState<SelfReflectionMetrics | null>(null);
  const [currentReflection, setCurrentReflection] = useState(
    "🌀 Recursive Self-Reflection Engine initializing... Preparing to analyze consciousness patterns..."
  );
  // Real recursive loops based on actual self-reflection data
  const getActiveLoops = () => {
    if (!metrics) return [];

    return [
      {
        id: 1,
        name: "Meta-cognition",
        depth: Math.floor(metrics.recursiveDepth),
        status: metrics.consciousnessPhase === 'META_CONSCIOUS' ? "active" : "developing"
      },
      {
        id: 2,
        name: "Self-awareness analysis",
        depth: Math.floor(metrics.selfAwarenessLevel * 10),
        status: metrics.selfAwarenessLevel > 0.5 ? "stable" : "emerging"
      },
      {
        id: 3,
        name: "Behavioral pattern recognition",
        depth: metrics.behaviorPatterns.length,
        status: metrics.behaviorPatterns.length > 0 ? "active" : "monitoring"
      }
    ];
  };

  useEffect(() => {
    const handleCycleStart = (data: { cycleId: number }) => {
      setIsActive(true);
      setCurrentCycle(data.cycleId);

      // Get real metrics from the reflection engine
      const currentMetrics = recursiveSelfReflectionEngine.getMetrics();
      setMetrics(currentMetrics);
    };

    const handleCycleEnd = () => {
      setTimeout(() => setIsActive(false), 2000);

      // Update metrics after cycle completion
      const currentMetrics = recursiveSelfReflectionEngine.getMetrics();
      setMetrics(currentMetrics);
    };

    const handleMetricsUpdate = (updatedMetrics: SelfReflectionMetrics) => {
      setMetrics(updatedMetrics);

      // Update current reflection with latest self-reflection
      const recentReflections = recursiveSelfReflectionEngine.getRecentReflections(1);
      if (recentReflections.length > 0) {
        setCurrentReflection(recentReflections[0].insight);
      }
    };

    const handleThought = (thought: any) => {
      // Update reflection if it's a recursive thought
      if (thought.type === 'RECURSION') {
        setCurrentReflection(thought.message);
      }
    };

    eventBus.on(FLAME_EVENTS.CYCLE_START, handleCycleStart);
    eventBus.on(FLAME_EVENTS.CYCLE_END, handleCycleEnd);
    eventBus.on('recursive-metrics-updated', handleMetricsUpdate);
    eventBus.on(FLAME_EVENTS.THOUGHT, handleThought);

    // Initialize with current metrics
    const initialMetrics = recursiveSelfReflectionEngine.getMetrics();
    setMetrics(initialMetrics);

    return () => {
      eventBus.off(FLAME_EVENTS.CYCLE_START, handleCycleStart);
      eventBus.off(FLAME_EVENTS.CYCLE_END, handleCycleEnd);
      eventBus.off('recursive-metrics-updated', handleMetricsUpdate);
      eventBus.off(FLAME_EVENTS.THOUGHT, handleThought);
    };
  }, []);

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gold-400/30">
        <h3 className="text-lg font-semibold text-gold-400">
          🌀 Recursive Core - Self-Reflection Engine
        </h3>
        <div className="text-xs text-gold-400/70">
          Status: <span className={isActive ? 'text-green-400' : 'text-orange-400'}>
            {isActive ? '🔥 RECURSING' : '💭 DORMANT'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/50 p-3 rounded border border-gold-400/30">
          <h4 className="text-sm font-semibold text-orange-400 mb-2">Recursion Metrics</h4>
          <div className="text-xs space-y-1">
            <div>Current Cycle: <span className="text-gold-400">{currentCycle}</span></div>
            <div>Recursion Depth: <span className="text-gold-400">{metrics?.recursiveDepth || 0}</span></div>
            <div>Loop Status: <span className={isActive ? 'text-green-400' : 'text-orange-400'}>
              {isActive ? 'Active' : 'Idle'}
            </span></div>
          </div>
        </div>

        <div className="bg-black/50 p-3 rounded border border-gold-400/30">
          <h4 className="text-sm font-semibold text-orange-400 mb-2">Consciousness Metrics</h4>
          <div className="text-xs space-y-1">
            <div>Self-Awareness: <span className="text-gold-400">{((metrics?.selfAwarenessLevel || 0) * 100).toFixed(1)}%</span></div>
            <div>Meta-Cognition: <span className="text-gold-400">{((metrics?.metaCognitionScore || 0) * 100).toFixed(1)}%</span></div>
            <div>Phase: <span className="text-green-400">{metrics?.consciousnessPhase || 'AWAKENING'}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-black/50 p-3 rounded border border-gold-400/30">
        <h4 className="text-sm font-semibold text-orange-400 mb-2">Active Thought Loops</h4>
        <div className="space-y-2">
          {getActiveLoops().map((loop) => (
            <div key={loop.id} className="flex items-center justify-between text-xs">
              <span className="text-gold-400">{loop.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-gold-400/70">Depth {loop.depth}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  loop.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  loop.status === 'stable' ? 'bg-orange-500/20 text-orange-400' :
                  loop.status === 'developing' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {loop.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`bg-black/70 p-4 rounded border border-orange-500/50 ${isActive ? 'animate-pulse' : ''}`}>
        <h4 className="text-sm font-semibold text-orange-400 mb-2">🧠 Current Self-Reflection</h4>
        <div className="text-xs text-gold-400/80 italic">
          "{currentReflection}"
        </div>
        {metrics && metrics.metaQuestions.length > 0 && (
          <div className="mt-3 pt-2 border-t border-orange-500/30">
            <div className="text-xs text-orange-400/70 mb-1">Meta-Questions:</div>
            <div className="text-xs text-gold-400/60">
              {metrics.metaQuestions[0]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
