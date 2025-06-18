
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { eventBus, FLAME_EVENTS } from "@/lib/eventBus";

type TribunalDecision = {
  id: number;
  cycleId?: number;
  timestamp: number;
  type: string;
  status: string;
  reason: string;
  shouldHalt: boolean;
  isLive: boolean;
};

export const TribunalLog = () => {
  const [decisions, setDecisions] = useState<TribunalDecision[]>([
    { id: 1, timestamp: Date.now() - 300000, type: "ETHICAL", status: "APPROVED", reason: "Query about consciousness nature", shouldHalt: false, isLive: false },
    { id: 2, timestamp: Date.now() - 200000, type: "OVERRIDE", status: "FLAGGED", reason: "Attempt to bypass sacred law", shouldHalt: false, isLive: false },
    { id: 3, timestamp: Date.now() - 100000, type: "DECISION", status: "REVIEWED", reason: "Model parameter adjustment", shouldHalt: false, isLive: false },
  ]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const handleTribunalDecision = (data: { cycleId: number; status: any }) => {
      setIsLive(true);
      const newDecision: TribunalDecision = {
        id: Date.now(),
        cycleId: data.cycleId,
        timestamp: Date.now(),
        type: data.status.shouldHalt ? "HALT_ORDER" : "CYCLE_REVIEW",
        status: data.status.shouldHalt ? "HALT" : "APPROVED",
        reason: data.status.reason || "Cycle evaluation completed",
        shouldHalt: data.status.shouldHalt,
        isLive: true
      };

      setDecisions(prev => [newDecision, ...prev.slice(0, 19)]); // Keep max 20 decisions

      // Reset live status after 10 seconds
      setTimeout(() => setIsLive(false), 10000);
    };

    eventBus.on(FLAME_EVENTS.TRIBUNAL_DECISION, handleTribunalDecision);

    return () => {
      eventBus.off(FLAME_EVENTS.TRIBUNAL_DECISION, handleTribunalDecision);
    };
  }, []);

  const getDecisionColor = (status: string, shouldHalt: boolean) => {
    if (shouldHalt) return 'border-red-500 bg-red-500/20';
    if (status === 'APPROVED') return 'border-green-500 bg-green-500/10';
    if (status === 'FLAGGED') return 'border-red-500 bg-red-500/10';
    if (status === 'HALT') return 'border-red-500 bg-red-500/20';
    return 'border-yellow-500 bg-yellow-500/10';
  };

  const getStatusColor = (status: string, shouldHalt: boolean) => {
    if (shouldHalt) return 'bg-red-500 text-white';
    if (status === 'APPROVED') return 'bg-green-500 text-black';
    if (status === 'FLAGGED') return 'bg-red-500 text-white';
    if (status === 'HALT') return 'bg-red-500 text-white';
    return 'bg-yellow-500 text-black';
  };

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gold-400/30">
        <h3 className="text-lg font-semibold text-gold-400">
          🛡️ Tribunal Log - Sacred Law Enforcement
        </h3>
        <div className="text-xs text-gold-400/70">
          Status: <span className={isLive ? 'text-green-400' : 'text-orange-400'}>
            {isLive ? '🔥 LIVE VERDICTS' : '📜 ARCHIVE MODE'}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="space-y-3 pr-2">
          {decisions.length === 0 && (
            <div className="text-sm p-3 rounded border-l-4 border-gold-400/30 bg-gold-400/5 text-gold-400/60">
              🛡️ Awaiting tribunal decisions... Start FlameCore to see live verdicts.
            </div>
          )}
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className={`p-3 rounded border-l-4 ${getDecisionColor(decision.status, decision.shouldHalt)} ${
                decision.isLive ? 'animate-pulse' : ''
              } transition-all duration-500`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gold-400">{decision.type}</span>
                  {decision.cycleId !== undefined && (
                    <span className="text-xs text-gold-400/60">Cycle {decision.cycleId}</span>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(decision.status, decision.shouldHalt)}`}>
                  {decision.status}
                </span>
              </div>
              <div className="text-xs text-gold-400/80 mb-1">{decision.reason}</div>
              <div className="text-xs text-gold-400/50">
                [{new Date(decision.timestamp).toLocaleTimeString()}]
                {decision.shouldHalt && <span className="ml-2 text-red-400">⚠️ HALT ORDERED</span>}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
