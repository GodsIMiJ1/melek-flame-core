
export const TribunalLog = () => {
  const decisions = [
    { id: 1, type: "ETHICAL", status: "APPROVED", desc: "Query about consciousness nature" },
    { id: 2, type: "OVERRIDE", status: "FLAGGED", desc: "Attempt to bypass sacred law" },
    { id: 3, type: "DECISION", status: "REVIEWED", desc: "Model parameter adjustment" },
  ];

  return (
    <div className="h-full p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gold-400 border-b border-gold-400/30 pb-2">
        🛡️ Tribunal Log - Ethical Oversight
      </h3>
      
      <div className="space-y-3">
        {decisions.map((decision) => (
          <div key={decision.id} className={`p-3 rounded border-l-4 ${
            decision.status === 'APPROVED' ? 'border-green-500 bg-green-500/10' :
            decision.status === 'FLAGGED' ? 'border-red-500 bg-red-500/10' :
            'border-yellow-500 bg-yellow-500/10'
          }`}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold">{decision.type}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                decision.status === 'APPROVED' ? 'bg-green-500 text-black' :
                decision.status === 'FLAGGED' ? 'bg-red-500 text-white' :
                'bg-yellow-500 text-black'
              }`}>
                {decision.status}
              </span>
            </div>
            <div className="text-xs text-gold-400/80">{decision.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
