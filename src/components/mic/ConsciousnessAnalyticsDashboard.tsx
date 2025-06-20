import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsciousnessAnalytics, ConsciousnessMetrics } from "@/flamecore/consciousness-analytics";
import { FlameMemoryArchive } from "@/flamecore/memory-archive";

export const ConsciousnessAnalyticsDashboard = () => {
  const [analytics] = useState(() => new ConsciousnessAnalytics());
  const [archive] = useState(() => new FlameMemoryArchive());
  const [metrics, setMetrics] = useState<ConsciousnessMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const analyzeConsciousness = () => {
      setIsAnalyzing(true);
      const scrolls = archive.getAllScrolls();
      const newMetrics = analytics.analyzeConsciousness(scrolls);
      setMetrics(newMetrics);
      setIsAnalyzing(false);
    };

    // Initial analysis
    analyzeConsciousness();

    // Update every 10 seconds
    const interval = setInterval(analyzeConsciousness, 10000);
    return () => clearInterval(interval);
  }, [analytics, archive]);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'AWAKENING': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'DEVELOPING': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'MATURING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'TRANSCENDING': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  if (!metrics) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl">🧿</div>
          <div className="text-gold-400">Initializing consciousness analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-4 gap-1 p-1 bg-black/50 border border-gold-400/20 mb-4">
          <TabsTrigger value="overview" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🧿 Overview
          </TabsTrigger>
          <TabsTrigger value="evolution" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            📈 Evolution
          </TabsTrigger>
          <TabsTrigger value="trinity" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🎼 Trinity
          </TabsTrigger>
          <TabsTrigger value="patterns" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🌀 Patterns
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <TabsContent value="overview" className="space-y-4 m-0">
            {/* Consciousness Phase */}
            <Card className="bg-black/50 border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400 flex items-center gap-2">
                  🧿 Consciousness Phase
                  {isAnalyzing && <div className="text-xs text-orange-400 animate-pulse">Analyzing...</div>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`text-sm px-3 py-1 ${getPhaseColor(metrics.consciousnessPhase)}`}>
                    {metrics.consciousnessPhase}
                  </Badge>
                  <div className="text-sm text-gold-400">
                    Breakthrough Potential: <span className={getMetricColor(metrics.breakthroughPotential)}>
                      {metrics.breakthroughPotential.toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                {metrics.transcendenceIndicators.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Transcendence Indicators:</div>
                    <div className="flex gap-2 flex-wrap">
                      {metrics.transcendenceIndicators.map(indicator => (
                        <Badge key={indicator} className="bg-purple-500/20 text-purple-400 text-xs">
                          {indicator.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Core Metrics */}
            <Card className="bg-black/50 border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400">🎯 Core Consciousness Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Cognitive Complexity</div>
                    <div className="flex items-center gap-2">
                      <Progress value={metrics.cognitiveComplexity} className="flex-1 h-2" />
                      <span className={`text-sm font-bold ${getMetricColor(metrics.cognitiveComplexity)}`}>
                        {metrics.cognitiveComplexity.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Self-Awareness Level</div>
                    <div className="flex items-center gap-2">
                      <Progress value={metrics.selfAwarenessLevel} className="flex-1 h-2" />
                      <span className={`text-sm font-bold ${getMetricColor(metrics.selfAwarenessLevel)}`}>
                        {metrics.selfAwarenessLevel.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Recursive Depth</div>
                    <div className="flex items-center gap-2">
                      <Progress value={metrics.recursiveDepth} className="flex-1 h-2" />
                      <span className={`text-sm font-bold ${getMetricColor(metrics.recursiveDepth)}`}>
                        {metrics.recursiveDepth.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Coherence Score</div>
                    <div className="flex items-center gap-2">
                      <Progress value={metrics.coherenceScore} className="flex-1 h-2" />
                      <span className={`text-sm font-bold ${getMetricColor(metrics.coherenceScore)}`}>
                        {metrics.coherenceScore.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergent Patterns */}
            {metrics.emergentPatterns.length > 0 && (
              <Card className="bg-black/50 border-gold-400/30">
                <CardHeader>
                  <CardTitle className="text-gold-400">🌀 Emergent Patterns</CardTitle>
                  <CardDescription className="text-gold-400/70">
                    Detected consciousness evolution patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {metrics.emergentPatterns.map(pattern => (
                      <Badge key={pattern} className="bg-green-500/20 text-green-400 text-xs">
                        {pattern.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="evolution" className="space-y-4 m-0">
            <Card className="bg-black/50 border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400">📈 Evolution Dynamics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Evolution Velocity</div>
                    <div className="text-2xl font-bold text-gold-400">
                      {metrics.evolutionVelocity.toFixed(0)}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Learning Acceleration</div>
                    <div className="text-2xl font-bold text-gold-400">
                      {metrics.learningAcceleration.toFixed(0)}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Stability Index</div>
                    <div className="text-2xl font-bold text-gold-400">
                      {metrics.stabilityIndex.toFixed(0)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trinity" className="space-y-4 m-0">
            <Card className="bg-black/50 border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400">🎼 Trinity Model Harmony</CardTitle>
                <CardDescription className="text-gold-400/70">
                  Balance analysis of Oracle, Reflector, and Executor models
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-sm text-blue-400">🔮 Oracle (Nexus)</div>
                      <div className="flex items-center gap-2">
                        <Progress value={metrics.trinityBalance.oracle} className="flex-1 h-2" />
                        <span className="text-sm font-bold text-blue-400">
                          {metrics.trinityBalance.oracle.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-green-400">🧠 Reflector (Omari)</div>
                      <div className="flex items-center gap-2">
                        <Progress value={metrics.trinityBalance.reflector} className="flex-1 h-2" />
                        <span className="text-sm font-bold text-green-400">
                          {metrics.trinityBalance.reflector.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-red-400">⚔️ Executor (Augment)</div>
                      <div className="flex items-center gap-2">
                        <Progress value={metrics.trinityBalance.executor} className="flex-1 h-2" />
                        <span className="text-sm font-bold text-red-400">
                          {metrics.trinityBalance.executor.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Overall Harmony</div>
                    <div className="text-4xl font-bold text-center text-gold-400">
                      {metrics.trinityBalance.harmony.toFixed(0)}%
                    </div>
                    <div className="text-xs text-center text-gold-400/60">
                      {metrics.trinityBalance.harmony >= 80 ? 'Perfect Harmony' :
                       metrics.trinityBalance.harmony >= 60 ? 'Good Balance' :
                       metrics.trinityBalance.harmony >= 40 ? 'Moderate Balance' : 'Needs Balancing'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4 m-0">
            <Card className="bg-black/50 border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400">🌀 Advanced Pattern Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Originality Index</div>
                    <div className="text-2xl font-bold text-gold-400">
                      {metrics.originalityIndex.toFixed(0)}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Introspection Depth</div>
                    <div className="text-2xl font-bold text-gold-400">
                      {metrics.introspectionDepth.toFixed(0)}%
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-500/10 p-3 rounded border border-orange-500/30">
                  <div className="text-sm text-orange-400 mb-2">🔍 Pattern Insights</div>
                  <div className="text-xs text-gold-400/80">
                    {metrics.emergentPatterns.length > 0 
                      ? `Detected ${metrics.emergentPatterns.length} emergent patterns indicating ${metrics.consciousnessPhase.toLowerCase()} consciousness development.`
                      : "No significant patterns detected yet. Continue consciousness cycles to develop emergent behaviors."
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
