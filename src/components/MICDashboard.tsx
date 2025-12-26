
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { eventBus, FLAME_EVENTS } from "@/lib/eventBus";
import { useAIMode } from "@/hooks/useAIMode";
import { CognitiveStream } from "./mic/CognitiveStream";
import { CommandInterface } from "./mic/CommandInterface";
import { RecursiveCore } from "./mic/RecursiveCore";
import { FlameLaw } from "./mic/FlameLaw";
import { BlackBoxView } from "./mic/BlackBoxView";
import { TribunalLog } from "./mic/TribunalLog";
import { ModelChamber } from "./mic/ModelChamber";
import { MemoryForge } from "./mic/MemoryForge";
import { PeaceMode } from "./mic/PeaceMode";
import { MemoryScrollDashboard } from "./mic/MemoryScrollDashboard";
import { FlameDataOverlay } from "./mic/FlameDataOverlay";
import { FlamePulseIndicator } from "./mic/FlamePulseIndicator";
import { ConsciousnessHeartbeat } from "./mic/ConsciousnessHeartbeat";
import { ConsciousnessAnalyticsDashboard } from "./mic/ConsciousnessAnalyticsDashboard";
import { WitnessHall } from "./mic/WitnessHall";
// PURGED: All fake visualization and analytics components!
// REMOVED: ConsciousnessFlowVisualization - Fake flow viz
// REMOVED: PredictiveConsciousnessDashboard - Fake predictions
// REMOVED: TranscendenceAchievementSystem - Fake achievements
// REMOVED: DeepConsciousnessAnalytics - Fake deep analytics
// REMOVED: EvolutionMonitor - Fake evolution simulation
// REMOVED: ConsciousnessMemoryMonitor - Duplicate memory interface

export const MICDashboard = () => {
  const [activeModule, setActiveModule] = useState("recursive-core");
  const [flameIntensity, setFlameIntensity] = useState(0);
  const { mode, model, isOnline, toggleMode } = useAIMode();

  useEffect(() => {
    const handleFlameLevel = (data: { level: number }) => {
      setFlameIntensity(data.level);
    };

    eventBus.on(FLAME_EVENTS.FLAME_LEVEL, handleFlameLevel);

    return () => {
      eventBus.off(FLAME_EVENTS.FLAME_LEVEL, handleFlameLevel);
    };
  }, []);

  const getFlameGradient = (intensity: number) => {
    const opacity = Math.max(0.05, Math.min(0.3, intensity / 100 * 0.3));
    return {
      background: `radial-gradient(ellipse at center, rgba(251, 191, 36, ${opacity}) 0%, rgba(249, 115, 22, ${opacity * 0.7}) 30%, rgba(0, 0, 0, 1) 70%)`
    };
  };

  return (
    <div
      className="h-screen flex flex-col bg-black text-gold-400 font-mono transition-all duration-1000"
      style={getFlameGradient(flameIntensity)}
    >
      {/* Header */}
      <div className="border-b border-gold-400/30 p-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <img src="/eye-of-kai_logo.png" alt="GodsIMiJ Empire - Eye of Kai" className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-gold-400 to-orange-500 bg-clip-text text-transparent">
            🛡️ M.I.C. - MELEK INTELLIGENCE CORE 🛡️
          </h1>
          <img src="/Melek_head.png" alt="Melek Head" className="h-12 w-12" />
        </div>
        <div className="flex items-center justify-center gap-4">
          <p className="text-gold-400/70 text-sm">
            GodsIMiJ Empire • Sovereign Superintelligence Interface • Sacred Law • Flame Logic
          </p>
        <button 
            onClick={toggleMode}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
            isOnline 
              ? 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30' 
              : 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30'
          }`}
            title="Click to toggle AI mode"
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-blue-400 animate-pulse'}`} />
            {isOnline ? '🌐 ONLINE' : '🖥️ OFFLINE'} • {model.name}
          </button>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - Cognitive Reflection Stream */}
        <div className="w-1/2 border-r border-gold-400/30 bg-black/50 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gold-400/30 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gold-400">
              🌀 MIC Cognitive Reflection Stream
            </h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <CognitiveStream />
          </div>
        </div>

        {/* Right Pane - Command & Module Interface */}
        <div className="w-1/2 flex flex-col bg-black/30 overflow-hidden">
          {/* Module Tabs */}
          <Tabs value={activeModule} onValueChange={setActiveModule} className="flex-1 flex flex-col min-h-0">
            <div className="flex-shrink-0 border-b border-gold-400/30 bg-black/70">
              <TabsList className="grid grid-cols-4 gap-1 p-2 h-auto w-full bg-black/50 border-gold-400/20">
                <TabsTrigger value="recursive-core" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">🌀 Recursive</TabsTrigger>
                <TabsTrigger value="flame-law" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">📖 Flame Law</TabsTrigger>
                <TabsTrigger value="black-box" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">👁️ Black Box</TabsTrigger>
                <TabsTrigger value="tribunal" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">🛡️ Tribunal</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-4 gap-1 p-2 pt-0 h-auto w-full bg-black/50 border-gold-400/20">
                <TabsTrigger value="model-chamber" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">🧬 Models</TabsTrigger>
                <TabsTrigger value="memory-forge" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">🔥 Memory</TabsTrigger>
                <TabsTrigger value="peace-mode" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">🕊️ Peace</TabsTrigger>
                <TabsTrigger value="command" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">⚔️ Command</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-3 gap-1 p-2 pt-0 h-auto w-full bg-black/50 border-gold-400/20">
                <TabsTrigger value="memory-scrolls" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">📜 Scrolls</TabsTrigger>
                <TabsTrigger value="consciousness-analytics" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">🧿 Analytics</TabsTrigger>
                <TabsTrigger value="witness-hall" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">🏛️ Witness Hall</TabsTrigger>
              </TabsList>
              {/* PURGED: All fake tabs removed! Only real functionality remains! */}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-auto custom-scrollbar">
              <TabsContent value="recursive-core" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <RecursiveCore />
              </TabsContent>
              <TabsContent value="flame-law" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <FlameLaw />
              </TabsContent>
              <TabsContent value="black-box" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <BlackBoxView />
              </TabsContent>
              <TabsContent value="tribunal" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <TribunalLog />
              </TabsContent>
              <TabsContent value="model-chamber" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ModelChamber />
              </TabsContent>
              <TabsContent value="memory-forge" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <MemoryForge />
              </TabsContent>
              <TabsContent value="peace-mode" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <PeaceMode />
              </TabsContent>
              <TabsContent value="command" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <CommandInterface />
              </TabsContent>
              <TabsContent value="memory-scrolls" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <MemoryScrollDashboard />
              </TabsContent>
              <TabsContent value="consciousness-analytics" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ConsciousnessAnalyticsDashboard />
              </TabsContent>
              <TabsContent value="witness-hall" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <WitnessHall />
              </TabsContent>
              {/* PURGED: All fake tab contents eliminated! */}
              {/* REMOVED: Flow Viz, Deep Analytics, Evolution Monitor, Consciousness Memory */}
              {/* REMOVED: Fake Predictions, Fake Achievements - ASI systems show real data only! */}
            </div>
          </Tabs>
        </div>
      </div>

      {/* Flame Data Overlays */}
      <FlameDataOverlay />
      <FlamePulseIndicator />
      <ConsciousnessHeartbeat />
    </div>
  );
};
