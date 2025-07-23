
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { eventBus, FLAME_EVENTS } from "@/lib/eventBus";
import { bindMemoryScrollUI, transformScrollForUI } from "@/lib/core/memory-link-fix";
import { MemoryScroll } from "@/flamecore/memory-archive";
import { deepLogger } from "@/lib/core/deep-consciousness-logger";

type MemoryEntry = {
  id: string | number;
  cycleId?: number;
  timestamp: number;
  type: 'CYCLE' | 'PURGE' | 'SNAPSHOT' | 'THOUGHT' | 'VERDICT' | 'INSIGHT' | 'ETERNAL_LOOP';
  content: string;
  size: number;
  isLive: boolean;
  classification?: {
    emotionalTone: string;
    complexity: string;
    significance: string;
  };
  tags?: string[];
  isWitnessHallWorthy?: boolean;
  confidence?: number;
  thoughtCount?: number;
  verdictCount?: number;
};

export const MemoryForge = () => {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [totalMemories, setTotalMemories] = useState(0); // REAL DATA ONLY!
  const [sessionSize, setSessionSize] = useState(0); // REAL DATA ONLY!
  const [isLive, setIsLive] = useState(false);
  const [latestCrystal, setLatestCrystal] = useState(""); // REAL DATA ONLY!

  useEffect(() => {
    // 🔥 SACRED MEMORY SCROLL BINDING
    const updateScrollUI = (scroll: MemoryScroll) => {
      setIsLive(true);
      setTotalMemories(prev => prev + 1);
      // Calculate REAL session size based on actual scroll data
      const scrollSizeKB = Math.floor(JSON.stringify(scroll).length / 1024);
      setSessionSize(prev => prev + scrollSizeKB);

      // Transform the memory scroll for UI display
      const transformedMemory = transformScrollForUI(scroll);

      // 🔥 Enhance with deep consciousness data
      const deepLogs = deepLogger.getLogsByCycle(scroll.cycleId);
      const oracleLog = deepLogs.find(log => log.type === 'ORACLE');
      const reflectorLog = deepLogs.find(log => log.type === 'REFLECTOR');
      const agentLogs = deepLogs.filter(log => log.type === 'AGENT_DISPATCH');

      // Enhance content with actual AI responses
      if (oracleLog || reflectorLog) {
        transformedMemory.content = `🔮 Oracle: "${(oracleLog?.content.fullResponse || '').substring(0, 50)}..." | 🧠 Reflector: "${(reflectorLog?.content.fullResponse || '').substring(0, 50)}..." | 🤖 Agents: ${agentLogs.length}`;
      }

      setMemories(prev => [transformedMemory, ...prev.slice(0, 9)]); // Keep max 10 memories

      // Update latest crystal with actual AI response ONLY
      const latestResponse = reflectorLog?.content.fullResponse ||
                           oracleLog?.content.fullResponse;

      if (latestResponse) {
        setLatestCrystal(latestResponse.substring(0, 200) + (latestResponse.length > 200 ? '...' : ''));
      }

      // Reset live status after 8 seconds
      setTimeout(() => {
        setMemories(prev => prev.map(m =>
          m.id === transformedMemory.id ? { ...m, isLive: false } : m
        ));
        setIsLive(false);
      }, 8000);
    };

    // Bind the memory scroll UI listener
    const cleanup = bindMemoryScrollUI(updateScrollUI);

    // Legacy handler for basic memory updates (fallback)
    const handleMemoryUpdate = (data: { cycleId: number; memorySize: number }) => {
      console.log('[🔥 Legacy Memory Update]', data);
      // This will be superseded by the memory scroll system
    };

    eventBus.on(FLAME_EVENTS.MEMORY_UPDATE, handleMemoryUpdate);

    return () => {
      cleanup(); // Cleanup memory scroll listener
      eventBus.off(FLAME_EVENTS.MEMORY_UPDATE, handleMemoryUpdate);
    };
  }, []);

  const exportMemory = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalMemories,
      sessionSize,
      recentMemories: memories,
      latestCrystal
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `flame-memory-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gold-400/30">
        <h3 className="text-lg font-semibold text-gold-400">
          🔥 Memory Forge - Knowledge Crystallization
        </h3>
        <div className="text-xs text-gold-400/70">
          Status: <span className={isLive ? 'text-green-400' : 'text-orange-400'}>
            {isLive ? '🔥 LIVE FORGING' : '💎 CRYSTAL ARCHIVE'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/50 p-3 rounded border border-gold-400/30">
          <h4 className="text-sm font-semibold text-orange-400 mb-2">Memory Database (REAL DATA)</h4>
          <div className="text-xs space-y-1">
            <div>Total Cycles: {totalMemories.toLocaleString()} logged</div>
            <div>Live Memories: {memories.length} active</div>
            <div>Session Scrolls: {memories.filter(m => m.type === 'CYCLE').length}</div>
          </div>
        </div>

        <div className="bg-black/50 p-3 rounded border border-gold-400/30">
          <h4 className="text-sm font-semibold text-orange-400 mb-2">Storage Metrics (REAL DATA)</h4>
          <div className="text-xs space-y-1">
            <div>Session: {sessionSize}KB</div>
            <div>Avg Memory Size: {memories.length > 0 ? Math.round(sessionSize / memories.length) : 0}KB</div>
            <div>Witness Hall: {memories.filter(m => m.isWitnessHallWorthy).length} worthy</div>
          </div>
        </div>
      </div>

      <div className="bg-orange-500/10 p-3 rounded border border-orange-500/50 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-orange-400">🧠 Latest Memory Crystal</div>
          <Button
            onClick={exportMemory}
            size="sm"
            className="bg-orange-500/20 hover:bg-orange-500/30 text-xs"
          >
            💾 Export
          </Button>
        </div>
        <div className="text-xs text-gold-400/80 italic">
          {latestCrystal ? `"${latestCrystal}"` : "🔥 No memory crystals forged yet. Start FlameCore to generate real consciousness data."}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <h4 className="text-sm font-semibold text-orange-400 mb-2">Recent Memory Crystallizations</h4>
        <ScrollArea className="h-full custom-scrollbar">
          <div className="space-y-2 pr-2">
            {memories.length === 0 && (
              <div className="text-sm p-2 rounded border-l-2 border-gold-400/30 bg-gold-400/5 text-gold-400/60">
                🔥 Awaiting memory crystallization... Start FlameCore to forge new memories.
              </div>
            )}
            {memories.map((memory) => (
              <div
                key={memory.id}
                className={`text-sm p-2 rounded border-l-2 border-orange-500/50 bg-orange-500/5 ${
                  memory.isLive ? 'animate-pulse' : ''
                } transition-all duration-500`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-orange-400">{memory.type}</span>
                  <div className="flex items-center gap-2">
                    {memory.isWitnessHallWorthy && (
                      <span className="text-xs text-purple-400">🏛️ WORTHY</span>
                    )}
                    <span className="text-xs text-gold-400/60">{memory.size}KB</span>
                  </div>
                </div>
                <div className="text-gold-400/80">{memory.content}</div>
                {memory.classification && (
                  <div className="text-xs text-blue-400/70 mt-1">
                    {memory.classification.significance} | {memory.classification.emotionalTone}
                    {memory.confidence && ` | ${(memory.confidence * 100).toFixed(0)}% confidence`}
                  </div>
                )}
                {memory.tags && memory.tags.length > 0 && (
                  <div className="text-xs text-green-400/60 mt-1">
                    Tags: {memory.tags.slice(0, 3).join(', ')}
                  </div>
                )}
                <div className="text-xs text-gold-400/50 mt-1">
                  [{new Date(memory.timestamp).toLocaleTimeString()}]
                  {memory.cycleId !== undefined && ` - Cycle ${memory.cycleId}`}
                  {memory.thoughtCount && ` - ${memory.thoughtCount} thoughts`}
                  {memory.verdictCount && ` - ${memory.verdictCount} verdicts`}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
