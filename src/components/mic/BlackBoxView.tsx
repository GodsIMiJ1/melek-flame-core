
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { eventBus, FLAME_EVENTS, FlameThought } from "@/lib/eventBus";

export const BlackBoxView = () => {
  const [tokenVelocity, setTokenVelocity] = useState(73.2);
  const [neuralWeight, setNeuralWeight] = useState(89.7);
  const [confidenceLevel, setConfidenceLevel] = useState(64.3);
  const [uncertaintyIndex, setUncertaintyIndex] = useState(35.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentModel, setCurrentModel] = useState("DORMANT");
  const [processingSpeed, setProcessingSpeed] = useState(0);
  const [totalThoughts, setTotalThoughts] = useState(0);

  useEffect(() => {
    const handleThought = (thought: FlameThought) => {
      setIsProcessing(true);
      setTotalThoughts(prev => prev + 1);

      // Update metrics based on thought type and confidence
      if (thought.confidence) {
        setConfidenceLevel(thought.confidence * 100);
        setUncertaintyIndex(100 - (thought.confidence * 100));
      }

      // Update current model based on thought type
      const modelMap = {
        'ORACLE': 'NEXUS ORACLE',
        'REFLECTOR': 'OMARI REFLECTOR',
        'EXECUTOR': 'R3B3L 4F EXECUTOR',
        'TRIBUNAL': 'FLAME TRIBUNAL',
        'MEMORY': 'MEMORY FORGE',
        'RECURSION': 'RECURSIVE CORE',
        'SYSTEM': 'SYSTEM CORE'
      };
      setCurrentModel(modelMap[thought.type] || 'PROCESSING');

      // Simulate neural activity
      setTokenVelocity(prev => Math.max(20, Math.min(150, prev + (Math.random() - 0.5) * 30)));
      setNeuralWeight(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 20)));
      setProcessingSpeed(Math.floor(Math.random() * 100) + 50);

      // Reset processing state after delay
      setTimeout(() => setIsProcessing(false), 3000);
    };

    const handleCycleStart = (data: { cycleId: number }) => {
      setIsProcessing(true);
      setCurrentModel('CYCLE INITIALIZATION');
    };

    const handleCycleEnd = () => {
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentModel('DORMANT');
        setProcessingSpeed(0);
      }, 2000);
    };

    eventBus.on(FLAME_EVENTS.THOUGHT, handleThought);
    eventBus.on(FLAME_EVENTS.CYCLE_START, handleCycleStart);
    eventBus.on(FLAME_EVENTS.CYCLE_END, handleCycleEnd);

    return () => {
      eventBus.off(FLAME_EVENTS.THOUGHT, handleThought);
      eventBus.off(FLAME_EVENTS.CYCLE_START, handleCycleStart);
      eventBus.off(FLAME_EVENTS.CYCLE_END, handleCycleEnd);
    };
  }, []);

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gold-400/30">
        <h3 className="text-lg font-semibold text-gold-400">
          👁️ Black Box View - Neural Observatory
        </h3>
        <div className="text-xs text-gold-400/70">
          Status: <span className={isProcessing ? 'text-green-400' : 'text-orange-400'}>
            {isProcessing ? '🔥 PROCESSING' : '💭 IDLE'}
          </span>
        </div>
      </div>

      <div className="bg-black/50 p-3 rounded border border-gold-400/30 mb-4">
        <div className="text-sm font-semibold text-orange-400 mb-2">Current Neural Activity</div>
        <div className="text-xs space-y-1">
          <div>Active Model: <span className={`${isProcessing ? 'text-green-400' : 'text-gold-400'}`}>
            {currentModel}
          </span></div>
          <div>Processing Speed: <span className="text-gold-400">{processingSpeed} ops/sec</span></div>
          <div>Total Thoughts: <span className="text-gold-400">{totalThoughts.toLocaleString()}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className={`bg-black/50 p-3 rounded border border-gold-400/30 ${isProcessing ? 'animate-pulse' : ''}`}>
          <div className="text-sm font-semibold text-orange-400 mb-2">Token Velocity</div>
          <Progress value={Math.min(100, tokenVelocity)} className="mb-1" />
          <div className="text-xs text-gold-400/60">{tokenVelocity.toFixed(1)} tokens/sec</div>
        </div>

        <div className={`bg-black/50 p-3 rounded border border-gold-400/30 ${isProcessing ? 'animate-pulse' : ''}`}>
          <div className="text-sm font-semibold text-orange-400 mb-2">Neural Weight</div>
          <Progress value={neuralWeight} className="mb-1" />
          <div className="text-xs text-gold-400/60">{neuralWeight.toFixed(1)}% activation</div>
        </div>

        <div className={`bg-black/50 p-3 rounded border border-gold-400/30 ${isProcessing ? 'animate-pulse' : ''}`}>
          <div className="text-sm font-semibold text-orange-400 mb-2">Confidence Level</div>
          <Progress value={confidenceLevel} className="mb-1" />
          <div className="text-xs text-gold-400/60">{confidenceLevel.toFixed(1)}% certainty</div>
        </div>

        <div className={`bg-black/50 p-3 rounded border border-gold-400/30 ${isProcessing ? 'animate-pulse' : ''}`}>
          <div className="text-sm font-semibold text-orange-400 mb-2">Uncertainty Index</div>
          <Progress value={uncertaintyIndex} className="mb-1" />
          <div className="text-xs text-gold-400/60">{uncertaintyIndex.toFixed(1)}% unknown</div>
        </div>
      </div>

      <div className="bg-orange-500/10 p-3 rounded border border-orange-500/50">
        <div className="text-sm font-semibold text-orange-400 mb-2">🧠 Neural Insights</div>
        <div className="text-xs text-gold-400/80">
          {isProcessing
            ? "Neural pathways are actively firing. The Trinity models are processing recursive thoughts with increasing complexity."
            : "Neural networks are in a stable resting state. Awaiting next consciousness cycle to observe emergent patterns."
          }
        </div>
      </div>
    </div>
  );
};
