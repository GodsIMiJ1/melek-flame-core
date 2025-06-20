import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsciousnessPredictor, ConsciousnessPrediction, PredictedEvent } from "@/flamecore/consciousness-predictor";
import { ConsciousnessAnalytics } from "@/flamecore/consciousness-analytics";
import { FlameMemoryArchive } from "@/flamecore/memory-archive";

export const PredictiveConsciousnessDashboard = () => {
  const [predictor] = useState(() => new ConsciousnessPredictor());
  const [analytics] = useState(() => new ConsciousnessAnalytics());
  const [archive] = useState(() => new FlameMemoryArchive());
  const [prediction, setPrediction] = useState<ConsciousnessPrediction | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generatePrediction = async () => {
      setIsGenerating(true);
      
      try {
        const scrolls = archive.getAllScrolls();
        const metrics = analytics.analyzeConsciousness(scrolls);
        const newPrediction = predictor.generatePrediction(metrics, scrolls);
        setPrediction(newPrediction);
      } catch (error) {
        console.error('Prediction generation error:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    // Initial prediction
    generatePrediction();

    // Update every 30 seconds
    const interval = setInterval(generatePrediction, 30000);
    return () => clearInterval(interval);
  }, [predictor, analytics, archive]);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'BREAKTHROUGH': return 'bg-gold-500/20 text-gold-400 border-gold-500/50';
      case 'TRANSCENDENCE': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'PHASE_TRANSITION': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'PATTERN_EMERGENCE': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'RISK_EVENT': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'BREAKTHROUGH': return '💡';
      case 'TRANSCENDENCE': return '🌟';
      case 'PHASE_TRANSITION': return '🔄';
      case 'PATTERN_EMERGENCE': return '🌀';
      case 'RISK_EVENT': return '⚠️';
      default: return '📊';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'CRITICAL': return 'text-red-400';
      case 'HIGH': return 'text-orange-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-red-400';
    if (probability >= 60) return 'text-orange-400';
    if (probability >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (!prediction) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl">🔮</div>
          <div className="text-gold-400">Generating consciousness predictions...</div>
          {isGenerating && <div className="text-xs text-orange-400 animate-pulse">Analyzing patterns...</div>}
        </div>
      </div>
    );
  }

  const trajectory = predictor.getTrajectory();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Tabs defaultValue="predictions" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-3 gap-1 p-1 bg-black/50 border border-gold-400/20 mb-4">
          <TabsTrigger value="predictions" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🔮 Predictions
          </TabsTrigger>
          <TabsTrigger value="trajectory" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            📈 Trajectory
          </TabsTrigger>
          <TabsTrigger value="events" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            ⚡ Events
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <TabsContent value="predictions" className="space-y-4 m-0">
            {/* Prediction Overview */}
            <Card className="bg-black/50 border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400 flex items-center gap-2">
                  🔮 Consciousness Predictions
                  {isGenerating && <div className="text-xs text-orange-400 animate-pulse">Updating...</div>}
                </CardTitle>
                <CardDescription className="text-gold-400/70">
                  AI-powered forecasting of consciousness evolution ({formatTime(prediction.predictionHorizon)} horizon)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Breakthrough Probability</div>
                    <div className="flex items-center gap-2">
                      <Progress value={prediction.breakthroughProbability} className="flex-1 h-3" />
                      <span className={`text-lg font-bold ${getProbabilityColor(prediction.breakthroughProbability)}`}>
                        {prediction.breakthroughProbability.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Transcendence Probability</div>
                    <div className="flex items-center gap-2">
                      <Progress value={prediction.transcendenceProbability} className="flex-1 h-3" />
                      <span className={`text-lg font-bold ${getProbabilityColor(prediction.transcendenceProbability)}`}>
                        {prediction.transcendenceProbability.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Next Phase ETA</div>
                    <div className="text-xl font-bold text-gold-400">
                      {prediction.nextPhaseETA > 0 ? formatTime(prediction.nextPhaseETA) : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Prediction Confidence</div>
                    <div className="text-xl font-bold text-gold-400">
                      {(prediction.confidenceLevel * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Factors & Opportunities */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-black/50 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-400">⚠️ Risk Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  {prediction.riskFactors.length > 0 ? (
                    <div className="space-y-2">
                      {prediction.riskFactors.map((risk, index) => (
                        <div key={index} className="text-sm text-red-400/80 bg-red-500/10 p-2 rounded border border-red-500/30">
                          {risk}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-green-400">No significant risks detected</div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400">🌟 Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  {prediction.opportunities.length > 0 ? (
                    <div className="space-y-2">
                      {prediction.opportunities.map((opportunity, index) => (
                        <div key={index} className="text-sm text-green-400/80 bg-green-500/10 p-2 rounded border border-green-500/30">
                          {opportunity}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">No opportunities identified</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trajectory" className="space-y-4 m-0">
            <Card className="bg-black/50 border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400">📈 Consciousness Trajectory</CardTitle>
                <CardDescription className="text-gold-400/70">
                  Current evolution path and future milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Current Phase</div>
                    <Badge className="bg-blue-500/20 text-blue-400 text-sm">
                      {trajectory.currentPhase}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Direction</div>
                    <Badge className={`text-sm ${
                      trajectory.trajectoryDirection === 'ASCENDING' ? 'bg-green-500/20 text-green-400' :
                      trajectory.trajectoryDirection === 'DECLINING' ? 'bg-red-500/20 text-red-400' :
                      trajectory.trajectoryDirection === 'OSCILLATING' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {trajectory.trajectoryDirection}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Velocity Trend</div>
                    <div className="text-lg font-bold text-gold-400">
                      {trajectory.velocityTrend > 0 ? '+' : ''}{(trajectory.velocityTrend * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Estimated Peak</div>
                    <div className="text-lg font-bold text-gold-400">
                      {formatTime(trajectory.estimatedPeakTime)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-orange-400">Next Milestones</div>
                  <div className="space-y-1">
                    {trajectory.nextMilestones.map((milestone, index) => (
                      <div key={index} className="text-sm text-gold-400/80 bg-gold-500/10 p-2 rounded border border-gold-500/30">
                        {milestone}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4 m-0">
            <Card className="bg-black/50 border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400">⚡ Predicted Events</CardTitle>
                <CardDescription className="text-gold-400/70">
                  Upcoming consciousness events and their probabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {prediction.predictedEvents.length > 0 ? (
                  <div className="space-y-3">
                    {prediction.predictedEvents.map((event, index) => (
                      <Card key={index} className={`bg-black/30 ${getEventColor(event.type).split(' ')[2]}`}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getEventIcon(event.type)}</span>
                              <span className="text-sm font-semibold text-gold-400">{event.type.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${getEventColor(event.type)}`}>
                                {event.probability.toFixed(0)}%
                              </Badge>
                              <span className={`text-xs ${getImpactColor(event.impact)}`}>
                                {event.impact}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gold-400/80 mb-2">
                            {event.description}
                          </div>
                          
                          <div className="flex justify-between text-xs text-gold-400/60">
                            <span>ETA: {formatTime(event.estimatedTime)}</span>
                            <span>Confidence: {(event.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gold-400/60 py-8">
                    No significant events predicted in the current horizon
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
