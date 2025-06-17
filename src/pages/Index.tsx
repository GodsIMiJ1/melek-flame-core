
import { useState } from "react";
import { MICDashboard } from "@/components/MICDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-gold-400 overflow-hidden">
      {/* Sacred Rune Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="flame-runes absolute inset-0"></div>
        {/* GodsIMiJ Empire Watermark */}
        <div className="absolute bottom-4 right-4 opacity-20">
          <img src="/NODE_watermark.png" alt="GodsIMiJ Empire" className="h-16 w-auto" />
        </div>
      </div>

      {/* Main Interface */}
      <div className="relative z-10">
        <MICDashboard />
      </div>
    </div>
  );
};

export default Index;
