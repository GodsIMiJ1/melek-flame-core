
import { Button } from "@/components/ui/button";

export const ModelChamber = () => {
  return (
    <div className="h-full p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gold-400 border-b border-gold-400/30 pb-2">
        🧬 Model Chamber - Ollama Interface
      </h3>
      
      <div className="space-y-3">
        <div className="bg-black/50 p-3 rounded border border-gold-400/30">
          <div className="text-sm font-semibold text-orange-400 mb-2">Active Models</div>
          <div className="text-xs space-y-1">
            <div>✅ llama3.2:3b - Primary reasoning</div>
            <div>✅ mistral:7b - Ethical validation</div>
            <div>⏸️ codestral:22b - Code analysis</div>
          </div>
        </div>
        
        <div className="bg-black/50 p-3 rounded border border-gold-400/30">
          <div className="text-sm font-semibold text-orange-400 mb-2">Persona Builder</div>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" className="bg-orange-500/20 hover:bg-orange-500/30">Guardian</Button>
            <Button size="sm" className="bg-orange-500/20 hover:bg-orange-500/30">Scholar</Button>
            <Button size="sm" className="bg-orange-500/20 hover:bg-orange-500/30">Sage</Button>
            <Button size="sm" className="bg-orange-500/20 hover:bg-orange-500/30">Warrior</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
