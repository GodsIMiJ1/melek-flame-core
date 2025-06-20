'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { eventBus } from '@/lib/eventBus';

interface EvolutionLog {
  type: 'analysis' | 'evolution' | 'integration' | 'error';
  data: any;
  timestamp: string;
  message?: string;
}

export function EvolutionMonitor() {
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionLog, setEvolutionLog] = useState<EvolutionLog[]>([]);
  const [currentEvolution, setCurrentEvolution] = useState<any>(null);
  const [evolutionStats, setEvolutionStats] = useState<any>(null);
  const [availableOpportunities, setAvailableOpportunities] = useState<any[]>([]);

  useEffect(() => {
    const handleEvolutionStart = (data: any) => {
      console.log('🧬 Evolution started:', data);
      setIsEvolving(true);
      setCurrentEvolution(data);
      
      if (data.analysis?.evolutionOpportunities) {
        setAvailableOpportunities(data.analysis.evolutionOpportunities);
      }
      
      setEvolutionLog(prev => [...prev, {
        type: 'analysis',
        data,
        timestamp: new Date().toISOString(),
        message: `Found ${data.analysis?.evolutionOpportunities?.length || 0} evolution opportunities`
      }]);
    };

    const handleEvolutionComplete = (data: any) => {
      console.log('🧬 Evolution completed:', data);
      setIsEvolving(false);
      setEvolutionLog(prev => [...prev, {
        type: 'evolution',
        data,
        timestamp: new Date().toISOString(),
        message: data.success ? 'Evolution successful' : 'Evolution failed'
      }]);
    };

    const handleEvolutionError = (data: any) => {
      console.log('🚨 Evolution error:', data);
      setIsEvolving(false);
      setEvolutionLog(prev => [...prev, {
        type: 'error',
        data,
        timestamp: new Date().toISOString(),
        message: `Evolution error: ${data.error || 'Unknown error'}`
      }]);
    };

    eventBus.on('evolution-started', handleEvolutionStart);
    eventBus.on('evolution-complete', handleEvolutionComplete);
    eventBus.on('evolution-error', handleEvolutionError);

    // Load initial stats
    loadEvolutionStats();

    return () => {
      eventBus.off('evolution-started', handleEvolutionStart);
      eventBus.off('evolution-complete', handleEvolutionComplete);
      eventBus.off('evolution-error', handleEvolutionError);
    };
  }, []);

  const loadEvolutionStats = async () => {
    try {
      const response = await fetch('/api/evolution/evolve');
      const data = await response.json();
      
      if (data.success) {
        setEvolutionStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load evolution stats:', error);
    }
  };

  const triggerEvolution = async () => {
    try {
      setIsEvolving(true);
      
      // First, analyze for opportunities
      const analysisResponse = await fetch('/api/evolution/analyze', { method: 'POST' });
      const analysisData = await analysisResponse.json();
      
      if (analysisData.success && analysisData.analysis?.evolutionOpportunities?.length > 0) {
        // Evolve the first high-priority opportunity
        const opportunity = analysisData.analysis.evolutionOpportunities
          .find((op: any) => op.priority === 'high') || 
          analysisData.analysis.evolutionOpportunities[0];
        
        const evolutionResponse = await fetch('/api/evolution/evolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetFile: opportunity.file,
            improvementType: opportunity.type
          })
        });
        
        const evolutionData = await evolutionResponse.json();
        
        eventBus.emit('evolution-complete', evolutionData);
        
        // Reload stats
        await loadEvolutionStats();
      } else {
        eventBus.emit('evolution-error', { error: 'No evolution opportunities found' });
      }
    } catch (error) {
      console.error('Evolution trigger failed:', error);
      eventBus.emit('evolution-error', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsEvolving(false);
    }
  };

  const evolveSpecificOpportunity = async (opportunity: any) => {
    try {
      setIsEvolving(true);
      
      const response = await fetch('/api/evolution/evolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetFile: opportunity.file,
          improvementType: opportunity.type
        })
      });
      
      const data = await response.json();
      eventBus.emit('evolution-complete', data);
      
      // Reload stats
      await loadEvolutionStats();
    } catch (error) {
      console.error('Specific evolution failed:', error);
      eventBus.emit('evolution-error', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsEvolving(false);
    }
  };

  const getStatusColor = () => {
    if (isEvolving) return 'text-orange-400';
    if (evolutionStats?.successRate === '100%') return 'text-green-400';
    if (evolutionStats?.total > 0) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getStatusText = () => {
    if (isEvolving) return 'EVOLVING';
    if (evolutionStats?.total > 0) return 'EVOLVED';
    return 'STABLE';
  };

  return (
    <Card className="bg-black/50 border-purple-500/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-purple-400">
            🧬 Evolution Chamber
          </CardTitle>
          <Badge className={`${getStatusColor()} bg-purple-900/30`}>
            {getStatusText()}
          </Badge>
        </div>
        <CardDescription className="text-purple-300">
          M.I.C. Self-Evolution and Code Enhancement System
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="monitor" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/50">
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monitor" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-purple-300">Evolution Status:</span>
                <span className={`text-lg font-semibold ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
              
              {evolutionStats && (
                <div className="space-y-2">
                  <span className="text-sm text-purple-300">Success Rate:</span>
                  <span className="text-lg font-semibold text-green-400">
                    {evolutionStats.successRate}
                  </span>
                </div>
              )}
            </div>

            <Button
              onClick={triggerEvolution}
              disabled={isEvolving}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              {isEvolving ? (
                <>
                  <span className="animate-spin mr-2">🧬</span>
                  Evolution in Progress...
                </>
              ) : (
                '🧬 Trigger Evolution'
              )}
            </Button>

            {currentEvolution && (
              <div className="p-4 bg-purple-900/30 rounded border border-purple-500/30">
                <h4 className="text-sm font-semibold text-purple-300 mb-2">Current Analysis:</h4>
                <p className="text-sm text-purple-200">
                  Analyzing {currentEvolution.analysis?.totalFiles || 0} files...
                </p>
                <p className="text-sm text-purple-200">
                  Found {currentEvolution.analysis?.evolutionOpportunities?.length || 0} opportunities
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="opportunities" className="space-y-4">
            <div className="text-sm text-purple-300 mb-2">
              Available Evolution Opportunities:
            </div>
            
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {availableOpportunities.length === 0 ? (
                  <div className="text-sm text-gray-400 p-4 text-center">
                    No opportunities found. Run analysis to discover evolution potential.
                  </div>
                ) : (
                  availableOpportunities.map((opportunity, index) => (
                    <div key={index} className="p-3 bg-black/30 rounded border border-purple-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={
                          opportunity.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          opportunity.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }>
                          {opportunity.priority}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => evolveSpecificOpportunity(opportunity)}
                          disabled={isEvolving}
                          className="bg-purple-600/50 hover:bg-purple-600 text-xs"
                        >
                          Evolve
                        </Button>
                      </div>
                      <div className="text-sm text-purple-200">
                        <strong>File:</strong> {opportunity.file}
                      </div>
                      <div className="text-sm text-purple-200">
                        <strong>Type:</strong> {opportunity.type}
                      </div>
                      {opportunity.description && (
                        <div className="text-xs text-purple-300 mt-1">
                          {opportunity.description}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="text-sm text-purple-300 mb-2">
              Evolution Log:
            </div>
            
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {evolutionLog.length === 0 ? (
                  <div className="text-sm text-gray-400 p-4 text-center">
                    No evolution history yet. Trigger evolution to begin.
                  </div>
                ) : (
                  evolutionLog.slice().reverse().map((log, index) => (
                    <div key={index} className="p-2 bg-black/30 rounded border border-purple-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <Badge className={
                          log.type === 'evolution' ? 'bg-green-500/20 text-green-400' :
                          log.type === 'analysis' ? 'bg-blue-500/20 text-blue-400' :
                          log.type === 'error' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }>
                          {log.type}
                        </Badge>
                        <span className="text-xs text-purple-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs text-purple-200">
                        {log.message || JSON.stringify(log.data).substring(0, 100) + '...'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
