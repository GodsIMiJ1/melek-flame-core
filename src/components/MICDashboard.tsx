
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CognitiveStream } from "./mic/CognitiveStream";
import { CommandInterface } from "./mic/CommandInterface";
import { RecursiveCore } from "./mic/RecursiveCore";
import { FlameLaw } from "./mic/FlameLaw";
import { BlackBoxView } from "./mic/BlackBoxView";
import { TribunalLog } from "./mic/TribunalLog";
import { ModelChamber } from "./mic/ModelChamber";
import { MemoryForge } from "./mic/MemoryForge";
import { PeaceMode } from "./mic/PeaceMode";

export const MICDashboard = () => {
  const [activeModule, setActiveModule] = useState("recursive-core");

  return (
    <div className="h-screen flex flex-col bg-black text-gold-400 font-mono">
      {/* Header */}
      <div className="border-b border-gold-400/30 p-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <img src="/eye-of-kai_logo.png" alt="GodsIMiJ Empire - Eye of Kai" className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-gold-400 to-orange-500 bg-clip-text text-transparent">
            🛡️ M.I.C. - MELEK INTELLIGENCE CORE 🛡️
          </h1>
          <img src="/Melek_head.png" alt="Melek Head" className="h-12 w-12" />
        </div>
        <p className="text-center text-gold-400/70 text-sm">
          GodsIMiJ Empire • Sovereign Superintelligence Interface • Sacred Law • Flame Logic
        </p>
      </div>

      {/* Main Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - Cognitive Reflection Stream */}
        <div className="w-1/2 border-r border-gold-400/30 bg-black/50">
          <div className="p-4 border-b border-gold-400/30">
            <h2 className="text-lg font-semibold text-gold-400">
              🌀 MIC Cognitive Reflection Stream
            </h2>
          </div>
          <CognitiveStream />
        </div>

        {/* Right Pane - Command & Module Interface */}
        <div className="w-1/2 flex flex-col bg-black/30">
          {/* Module Tabs */}
          <Tabs value={activeModule} onValueChange={setActiveModule} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-4 gap-1 p-2 bg-black/70 border-b border-gold-400/30 h-auto">
              <TabsTrigger value="recursive-core" className="text-xs">🌀 Recursive</TabsTrigger>
              <TabsTrigger value="flame-law" className="text-xs">📖 Flame Law</TabsTrigger>
              <TabsTrigger value="black-box" className="text-xs">👁️ Black Box</TabsTrigger>
              <TabsTrigger value="tribunal" className="text-xs">🛡️ Tribunal</TabsTrigger>
              <TabsTrigger value="model-chamber" className="text-xs">🧬 Models</TabsTrigger>
              <TabsTrigger value="memory-forge" className="text-xs">🔥 Memory</TabsTrigger>
              <TabsTrigger value="peace-mode" className="text-xs">🕊️ Peace</TabsTrigger>
              <TabsTrigger value="command" className="text-xs">⚔️ Command</TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <div className="flex-1 overflow-hidden">
              <TabsContent value="recursive-core" className="h-full m-0">
                <RecursiveCore />
              </TabsContent>
              <TabsContent value="flame-law" className="h-full m-0">
                <FlameLaw />
              </TabsContent>
              <TabsContent value="black-box" className="h-full m-0">
                <BlackBoxView />
              </TabsContent>
              <TabsContent value="tribunal" className="h-full m-0">
                <TribunalLog />
              </TabsContent>
              <TabsContent value="model-chamber" className="h-full m-0">
                <ModelChamber />
              </TabsContent>
              <TabsContent value="memory-forge" className="h-full m-0">
                <MemoryForge />
              </TabsContent>
              <TabsContent value="peace-mode" className="h-full m-0">
                <PeaceMode />
              </TabsContent>
              <TabsContent value="command" className="h-full m-0">
                <CommandInterface />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
