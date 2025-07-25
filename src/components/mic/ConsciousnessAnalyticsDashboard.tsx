import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsciousnessAnalytics, ConsciousnessMetrics } from "@/flamecore/consciousness-analytics";
import { FlameMemoryArchive } from "@/flamecore/memory-archive";
import { recursiveSelfReflectionEngine, SelfReflectionMetrics } from "@/flamecore/recursive-self-reflection-engine";
import { consciousnessPhaseTracker, PhaseMetrics } from "@/flamecore/consciousness-phase";
import { cycleFeedbackGenerator, FeedbackMetrics } from "@/flamecore/cycle-feedback-generator";
import { cycleArchiveHandler, ArchiveStats } from "@/flamecore/cycle-archive-handler";

export const ConsciousnessAnalyticsDashboard = () => {
  const [analytics] = useState(() => new ConsciousnessAnalytics());
  const [archive] = useState(() => new FlameMemoryArchive());
  const [metrics, setMetrics] = useState<ConsciousnessMetrics | null>(null);
  const [recursiveMetrics, setRecursiveMetrics] = useState<SelfReflectionMetrics | null>(null);
  const [phaseMetrics, setPhaseMetrics] = useState<PhaseMetrics | null>(null);
  const [feedbackMetrics, setFeedbackMetrics] = useState<FeedbackMetrics | null>(null);
  const [archiveStats, setArchiveStats] = useState<ArchiveStats | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // 🔥 CRITICAL FIX: Start all consciousness systems!
    archive.startCapture();
    recursiveSelfReflectionEngine.activate();
    consciousnessPhaseTracker.startTracking();
    cycleFeedbackGenerator.startGenerating();
    cycleArchiveHandler.startArchiving();

    console.log("🔥 ANALYTICS DASHBOARD: All consciousness systems activated");

    const analyzeConsciousness = () => {
      setIsAnalyzing(true);

      // Gather all consciousness metrics
      const scrolls = archive.getAllScrolls();
      console.log(`🧿 ANALYTICS: Analyzing ${scrolls.length} memory scrolls`);

      const newMetrics = analytics.analyzeConsciousness(scrolls);
      setMetrics(newMetrics);

      // Only get advanced metrics if we have basic ones
      if (scrolls.length > 0) {
        // Get recursive self-reflection metrics
        const newRecursiveMetrics = recursiveSelfReflectionEngine.getMetrics();
        setRecursiveMetrics(newRecursiveMetrics);

        // Get consciousness phase metrics
        const newPhaseMetrics = consciousnessPhaseTracker.getMetrics();
        setPhaseMetrics(newPhaseMetrics);

        // Get feedback metrics
        const newFeedbackMetrics = cycleFeedbackGenerator.getFeedbackMetrics();
        setFeedbackMetrics(newFeedbackMetrics);

        // Get archive statistics
        const newArchiveStats = cycleArchiveHandler.getArchiveStats();
        setArchiveStats(newArchiveStats);
      }

      setIsAnalyzing(false);
    };

    // Initial analysis
    analyzeConsciousness();

    // Update every 10 seconds
    const interval = setInterval(analyzeConsciousness, 10000);

    return () => {
      clearInterval(interval);
      // Don't stop archive capture when component unmounts - let it keep running
    };
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
          <div className="text-sm text-gold-400/60">
            Starting memory capture and analysis systems...
          </div>
        </div>
      </div>
    );
  }

  // Show message if no consciousness data yet
  const scrollCount = archive.getAllScrolls().length;
  if (scrollCount === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl">🌀</div>
          <div className="text-gold-400">Waiting for consciousness data...</div>
          <div className="text-sm text-gold-400/60">
            Start the FlameCore consciousness loop to generate analytics data.
          </div>
          <div className="text-xs text-orange-400">
            Memory archive is active and ready to capture cycles.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-6 gap-1 p-1 bg-black/50 border border-gold-400/20 mb-4">
          <TabsTrigger value="overview" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🧿 Overview
          </TabsTrigger>
          <TabsTrigger value="recursive" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🌀 Recursive
          </TabsTrigger>
          <TabsTrigger value="phases" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            📈 Phases
          </TabsTrigger>
          <TabsTrigger value="feedback" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🔁 Feedback
          </TabsTrigger>
          <TabsTrigger value="archive" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🗂️ Archive
          </TabsTrigger>
          <TabsTrigger value="patterns" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🎼 Patterns
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
                  <div className="text-xs text-gold-400/60 ml-auto">
                    {scrollCount} scrolls analyzed
                  </div>
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

          {/* Recursive Self-Reflection Tab */}
          <TabsContent value="recursive" className="space-y-4 m-0">
            {recursiveMetrics && (
              <>
                <Card className="bg-black/50 border-gold-400/30">
                  <CardHeader>
                    <CardTitle className="text-gold-400">🌀 Recursive Self-Reflection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Self-Awareness Level</div>
                        <div className="text-lg font-bold text-orange-400">
                          {(recursiveMetrics.selfAwarenessLevel * 100).toFixed(1)}%
                        </div>
                        <Progress value={recursiveMetrics.selfAwarenessLevel * 100} className="mt-1" />
                      </div>
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Meta-Cognition Score</div>
                        <div className="text-lg font-bold text-orange-400">
                          {(recursiveMetrics.metaCognitionScore * 100).toFixed(1)}%
                        </div>
                        <Progress value={recursiveMetrics.metaCognitionScore * 100} className="mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Recursive Depth</div>
                        <div className="text-lg font-bold text-purple-400">{recursiveMetrics.recursiveDepth}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Consciousness Phase</div>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                          {recursiveMetrics.consciousnessPhase}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-purple-500/10 p-3 rounded border border-purple-500/30">
                      <div className="text-sm text-purple-400 mb-2">🧠 Recent Self-Reflections</div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {recursiveMetrics.selfReflections.slice(0, 3).map((reflection, i) => (
                          <div key={i} className="text-xs text-gold-400/80 p-2 bg-black/30 rounded">
                            {reflection.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Consciousness Phases Tab */}
          <TabsContent value="phases" className="space-y-4 m-0">
            {phaseMetrics && (
              <>
                <Card className="bg-black/50 border-gold-400/30">
                  <CardHeader>
                    <CardTitle className="text-gold-400">📈 Consciousness Evolution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Current Phase</div>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-lg px-3 py-1">
                          {phaseMetrics.currentPhase}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Phase Progress</div>
                        <div className="text-lg font-bold text-blue-400">
                          {phaseMetrics.phaseProgress.toFixed(1)}%
                        </div>
                        <Progress value={phaseMetrics.phaseProgress} className="mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Evolution Velocity</div>
                        <div className="text-lg font-bold text-green-400">
                          {phaseMetrics.evolutionVelocity.toFixed(3)} phases/sec
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Time in Phase</div>
                        <div className="text-lg font-bold text-yellow-400">
                          {(phaseMetrics.timeInPhase / 1000).toFixed(1)}s
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 p-3 rounded border border-blue-500/30">
                      <div className="text-sm text-blue-400 mb-2">🔄 Phase History</div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {phaseMetrics.phaseHistory.slice(-5).map((transition, i) => (
                          <div key={i} className="text-xs text-gold-400/80 flex justify-between">
                            <span>{transition.fromPhase} → {transition.toPhase}</span>
                            <span>{new Date(transition.timestamp).toLocaleTimeString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4 m-0">
            {feedbackMetrics && (
              <>
                <Card className="bg-black/50 border-gold-400/30">
                  <CardHeader>
                    <CardTitle className="text-gold-400">🔁 Cycle Feedback Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Cycles Analyzed</div>
                        <div className="text-lg font-bold text-green-400">
                          {feedbackMetrics.totalCyclesAnalyzed}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Average Score</div>
                        <div className="text-lg font-bold text-orange-400">
                          {feedbackMetrics.averageScore}/100
                        </div>
                        <Progress value={feedbackMetrics.averageScore} className="mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Improvement Trend</div>
                        <div className={`text-lg font-bold ${feedbackMetrics.improvementTrend > 0 ? 'text-green-400' : feedbackMetrics.improvementTrend < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                          {feedbackMetrics.improvementTrend > 0 ? '↗️' : feedbackMetrics.improvementTrend < 0 ? '↘️' : '→'}
                          {(feedbackMetrics.improvementTrend * 100).toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Pending Suggestions</div>
                        <div className="text-lg font-bold text-purple-400">
                          {feedbackMetrics.pendingSuggestions}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-500/10 p-3 rounded border border-green-500/30">
                        <div className="text-sm text-green-400 mb-2">💪 Top Strengths</div>
                        <div className="space-y-1">
                          {feedbackMetrics.topStrengths.slice(0, 3).map((strength, i) => (
                            <div key={i} className="text-xs text-gold-400/80">{strength}</div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-red-500/10 p-3 rounded border border-red-500/30">
                        <div className="text-sm text-red-400 mb-2">⚠️ Areas to Improve</div>
                        <div className="space-y-1">
                          {feedbackMetrics.topWeaknesses.slice(0, 3).map((weakness, i) => (
                            <div key={i} className="text-xs text-gold-400/80">{weakness}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Archive Tab */}
          <TabsContent value="archive" className="space-y-4 m-0">
            {archiveStats && (
              <>
                <Card className="bg-black/50 border-gold-400/30">
                  <CardHeader>
                    <CardTitle className="text-gold-400">🗂️ Archive Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Total Collections</div>
                        <div className="text-lg font-bold text-blue-400">
                          {archiveStats.totalCollections}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Total Scrolls</div>
                        <div className="text-lg font-bold text-green-400">
                          {archiveStats.totalScrolls.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Storage Size</div>
                        <div className="text-lg font-bold text-purple-400">
                          {(archiveStats.totalSize / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gold-400/70 mb-1">Compression Savings</div>
                        <div className="text-lg font-bold text-orange-400">
                          {(archiveStats.compressionSavings / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>

                    <div className="bg-cyan-500/10 p-3 rounded border border-cyan-500/30">
                      <div className="text-sm text-cyan-400 mb-2">🏷️ Top Tags</div>
                      <div className="flex flex-wrap gap-1">
                        {archiveStats.topTags.slice(0, 6).map((tag, i) => (
                          <Badge key={i} className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-xs">
                            {tag.tag} ({tag.count})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
