
import { Progress } from "@/components/ui/progress";

interface FlameMeterProps {
  level: number;
}

export const FlameMeter = ({ level }: FlameMeterProps) => {
  const getFlameColor = () => {
    if (level < 30) return "text-blue-400";
    if (level < 70) return "text-gold-400";
    return "text-orange-500";
  };

  const getFlameStatus = () => {
    if (level < 30) return "COOL";
    if (level < 50) return "STABLE";
    if (level < 70) return "WARM";
    if (level < 85) return "HOT";
    return "CRITICAL";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">🔥 FlameMeter</span>
        <span className={`text-sm font-bold ${getFlameColor()}`}>
          {level.toFixed(1)}% {getFlameStatus()}
        </span>
      </div>
      
      <Progress 
        value={level} 
        className="h-3 bg-black/50 border border-gold-400/30"
      />
      
      <div className="text-xs text-gold-400/60 grid grid-cols-3 gap-2">
        <div>🧊 Ethical Temperature</div>
        <div>⚡ Neural Stress</div>
        <div>🚨 Anomaly Alert</div>
      </div>
    </div>
  );
};
