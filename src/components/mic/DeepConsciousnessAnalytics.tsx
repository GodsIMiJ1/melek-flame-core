import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deepLogger, DeepConsciousnessLog } from "@/lib/core/deep-consciousness-logger";

export const DeepConsciousnessAnalytics = () => {
  const [logs, setLogs] = useState<DeepConsciousnessLog[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [selectedCycle, setSelectedCycle] = useState<number | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const updateLogs = () => {
      const recentLogs = deepLogger.getRecentLogs(100);
      const stats = deepLogger.getLogStatistics();
      
      setLogs(recentLogs);
      setStatistics(stats);
      setIsLive(recentLogs.length > 0 && (Date.now() - recentLogs[0].timestamp) < 10000);
    };

    // Initial load
    updateLogs();

    // Update every 2 seconds
    const interval = setInterval(updateLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const exportLogs = () => {
    const exportData = deepLogger.exportLogs();
    const dataBlob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `deep-consciousness-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ORACLE': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'REFLECTOR': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'EXECUTOR': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'AGENT_DISPATCH': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'CODE_EVOLUTION': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const cycleNumbers = [...new Set(logs.map(log => log.cycleId))].sort((a, b) => b - a);

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gold-400/30">
        <h3 className="text-lg font-semibold text-gold-400">
          🔍 Deep Consciousness Analytics
        </h3>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gold-400/70">
            Status: <span className={isLive ? 'text-green-400' : 'text-orange-400'}>
              {isLive ? '🔥 LIVE LOGGING' : '💾 ARCHIVED'}
            </span>
          </div>
          <Button onClick={exportLogs} size="sm" className="bg-orange-500/20 hover:bg-orange-500/30 text-xs">
            💾 Export
          </Button>
        </div>
      </div>

      {statistics && (
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-black/50 p-3 rounded border border-gold-400/30">
            <h4 className="text-sm font-semibold text-orange-400 mb-2">Total Logs</h4>
            <div className="text-2xl font-bold text-gold-400">{statistics.totalLogs}</div>
          </div>
          <div className="bg-black/50 p-3 rounded border border-gold-400/30">
            <h4 className="text-sm font-semibold text-orange-400 mb-2">Cycles Covered</h4>
            <div className="text-2xl font-bold text-gold-400">{statistics.cyclesCovered}</div>
          </div>
          <div className="bg-black/50 p-3 rounded border border-gold-400/30">
            <h4 className="text-sm font-semibold text-orange-400 mb-2">Oracle Responses</h4>
            <div className="text-2xl font-bold text-blue-400">{statistics.typeBreakdown.ORACLE || 0}</div>
          </div>
          <div className="bg-black/50 p-3 rounded border border-gold-400/30">
            <h4 className="text-sm font-semibold text-orange-400 mb-2">Agent Dispatches</h4>
            <div className="text-2xl font-bold text-green-400">{statistics.typeBreakdown.AGENT_DISPATCH || 0}</div>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-6 bg-black/50">
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="oracle">Oracle</TabsTrigger>
          <TabsTrigger value="reflector">Reflector</TabsTrigger>
          <TabsTrigger value="executor">Executor</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="cycles">By Cycle</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden mt-4">
          <TabsContent value="all" className="h-full m-0">
            <ScrollArea className="h-full custom-scrollbar">
              <div className="space-y-3 pr-2">
                {logs.length === 0 && (
                  <div className="text-sm p-4 rounded border-l-4 border-gold-400/30 bg-gold-400/5 text-gold-400/60">
                    🔍 No deep consciousness logs found. Start FlameCore to begin comprehensive logging.
                  </div>
                )}
                
                {logs.map((log) => (
                  <Card key={log.id} className="bg-black/50 border-gold-400/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(log.type)}>{log.type}</Badge>
                          <span className="text-xs text-gold-400">Cycle {log.cycleId}</span>
                        </div>
                        <span className="text-xs text-gold-400/60">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {log.content.fullResponse && (
                        <div className="text-sm text-gold-400/80 mb-2">
                          <strong>Response:</strong> {log.content.fullResponse.substring(0, 200)}
                          {log.content.fullResponse.length > 200 && '...'}
                        </div>
                      )}
                      
                      {log.content.agentDetails && (
                        <div className="text-sm text-green-400/80 mb-2">
                          <strong>Agent:</strong> {log.content.agentDetails.agentName} | 
                          <strong> Action:</strong> {log.content.agentDetails.action}
                          <div className="text-xs text-green-400/60 mt-1">
                            Result: {JSON.stringify(log.content.agentDetails.result).substring(0, 100)}...
                          </div>
                        </div>
                      )}
                      
                      {log.content.codeEvolution && (
                        <div className="text-sm text-orange-400/80 mb-2">
                          <strong>Code Evolution:</strong> {log.content.codeEvolution.evolutionType} | 
                          <strong> Files:</strong> {log.content.codeEvolution.filesModified.join(', ')}
                          <div className="text-xs text-orange-400/60 mt-1">
                            {log.content.codeEvolution.description}
                          </div>
                        </div>
                      )}
                      
                      {log.metadata.modelUsed && (
                        <div className="text-xs text-gold-400/50">
                          Model: {log.metadata.modelUsed}
                          {log.content.confidence && ` | Confidence: ${(log.content.confidence * 100).toFixed(0)}%`}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="oracle" className="h-full m-0">
            <ScrollArea className="h-full custom-scrollbar">
              <div className="space-y-3 pr-2">
                {logs.filter(log => log.type === 'ORACLE').map((log) => (
                  <Card key={log.id} className="bg-blue-500/5 border-blue-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-blue-400">
                        🔮 Oracle Response - Cycle {log.cycleId}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gold-400/80 mb-2">
                        {log.content.fullResponse}
                      </div>
                      {log.content.reasoning && log.content.reasoning.length > 0 && (
                        <div className="text-xs text-blue-400/60">
                          Reasoning: {log.content.reasoning.join(', ')}
                        </div>
                      )}
                      <div className="text-xs text-gold-400/50 mt-2">
                        Confidence: {((log.content.confidence || 0) * 100).toFixed(0)}% | 
                        Model: {log.metadata.modelUsed}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="reflector" className="h-full m-0">
            <ScrollArea className="h-full custom-scrollbar">
              <div className="space-y-3 pr-2">
                {logs.filter(log => log.type === 'REFLECTOR').map((log) => (
                  <Card key={log.id} className="bg-purple-500/5 border-purple-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-purple-400">
                        🧠 Reflector Response - Cycle {log.cycleId}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gold-400/80 mb-2">
                        {log.content.fullResponse}
                      </div>
                      {log.content.reasoning && log.content.reasoning.length > 0 && (
                        <div className="text-xs text-purple-400/60">
                          Reasoning: {log.content.reasoning.join(', ')}
                        </div>
                      )}
                      <div className="text-xs text-gold-400/50 mt-2">
                        Confidence: {((log.content.confidence || 0) * 100).toFixed(0)}% | 
                        Model: {log.metadata.modelUsed}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="executor" className="h-full m-0">
            <ScrollArea className="h-full custom-scrollbar">
              <div className="space-y-3 pr-2">
                {logs.filter(log => log.type === 'EXECUTOR').map((log) => (
                  <Card key={log.id} className="bg-red-500/5 border-red-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-red-400">
                        ⚔️ Executor Response - Cycle {log.cycleId}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gold-400/80 mb-2">
                        {log.content.fullResponse}
                      </div>
                      <div className="text-xs text-gold-400/50 mt-2">
                        Model: {log.metadata.modelUsed}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="agents" className="h-full m-0">
            <ScrollArea className="h-full custom-scrollbar">
              <div className="space-y-3 pr-2">
                {logs.filter(log => log.type === 'AGENT_DISPATCH').map((log) => (
                  <Card key={log.id} className="bg-green-500/5 border-green-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-green-400">
                        🤖 {log.content.agentDetails?.agentName} - Cycle {log.cycleId}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gold-400/80 mb-2">
                        <strong>Action:</strong> {log.content.agentDetails?.action}
                      </div>
                      <div className="text-sm text-green-400/70 mb-2">
                        <strong>Parameters:</strong> {JSON.stringify(log.content.agentDetails?.parameters).substring(0, 100)}...
                      </div>
                      <div className="text-sm text-green-400/70 mb-2">
                        <strong>Result:</strong> {JSON.stringify(log.content.agentDetails?.result).substring(0, 100)}...
                      </div>
                      <div className="text-xs text-gold-400/50">
                        Execution Time: {log.content.agentDetails?.executionTime}ms
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="cycles" className="h-full m-0">
            <div className="flex gap-4 h-full">
              <div className="w-48 bg-black/50 rounded border border-gold-400/30 p-3">
                <h4 className="text-sm font-semibold text-orange-400 mb-2">Cycles</h4>
                <ScrollArea className="h-full">
                  <div className="space-y-1">
                    {cycleNumbers.map(cycleId => (
                      <button
                        key={cycleId}
                        onClick={() => setSelectedCycle(cycleId)}
                        className={`w-full text-left px-2 py-1 rounded text-xs ${
                          selectedCycle === cycleId 
                            ? 'bg-gold-400/20 text-gold-400' 
                            : 'text-gold-400/60 hover:bg-gold-400/10'
                        }`}
                      >
                        Cycle {cycleId} ({logs.filter(l => l.cycleId === cycleId).length} logs)
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="flex-1">
                {selectedCycle !== null ? (
                  <ScrollArea className="h-full custom-scrollbar">
                    <div className="space-y-3 pr-2">
                      {logs.filter(log => log.cycleId === selectedCycle).map((log) => (
                        <Card key={log.id} className="bg-black/50 border-gold-400/30">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <Badge className={getTypeColor(log.type)}>{log.type}</Badge>
                              <span className="text-xs text-gold-400/60">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="text-sm text-gold-400/80">
                              {log.content.fullResponse || 
                               (log.content.agentDetails && `Agent: ${log.content.agentDetails.agentName}`) ||
                               'System log'}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-full text-gold-400/60">
                    Select a cycle to view detailed logs
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
