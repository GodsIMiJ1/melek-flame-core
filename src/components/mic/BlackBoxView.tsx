
import { Progress } from "@/components/ui/progress";

export const BlackBoxView = () => {
  return (
    <div className="h-full p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gold-400 border-b border-gold-400/30 pb-2">
        👁️ Black Box View - Neural Observatory
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-black/50 p-3 rounded border border-gold-400/30">
          <div className="text-sm font-semibold text-orange-400 mb-2">Token Velocity</div>
          <Progress value={73} className="mb-1" />
          <div className="text-xs text-gold-400/60">73.2 tokens/sec</div>
        </div>
        
        <div className="bg-black/50 p-3 rounded border border-gold-400/30">
          <div className="text-sm font-semibold text-orange-400 mb-2">Neural Weight</div>
          <Progress value={89} className="mb-1" />
          <div className="text-xs text-gold-400/60">89.7% activation</div>
        </div>
        
        <div className="bg-black/50 p-3 rounded border border-gold-400/30">
          <div className="text-sm font-semibold text-orange-400 mb-2">Confidence Level</div>
          <Progress value={64} className="mb-1" />
          <div className="text-xs text-gold-400/60">64.3% certainty</div>
        </div>
        
        <div className="bg-black/50 p-3 rounded border border-gold-400/30">
          <div className="text-sm font-semibold text-orange-400 mb-2">Uncertainty Index</div>
          <Progress value={36} className="mb-1" />
          <div className="text-xs text-gold-400/60">35.7% unknown</div>
        </div>
      </div>
    </div>
  );
};
