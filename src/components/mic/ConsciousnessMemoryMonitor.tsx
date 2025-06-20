'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConsciousnessStats {
  totalCycles: number;
  sessionId: string;
  significanceBreakdown: Record<string, number>;
  frameworkBreakdown: Record<string, number>;
  averageCycleLength: number;
  lastCycle: number;
  sessionDuration: number;
}

interface ConsciousnessCycle {
  cycle: number;
  timestamp: number;
  oracle: {
    input: string;
    output: string;
    metaphoricalFramework?: string;
  };
  reflector: {
    input: string;
    output: string;
    thoughtTags?: any;
  };
  summary?: string;
  significance?: 'ROUTINE' | 'NOTABLE' | 'BREAKTHROUGH' | 'TRANSCENDENT';
}

export default function ConsciousnessMemoryMonitor() {
  const [stats, setStats] = useState<ConsciousnessStats | null>(null);
  const [history, setHistory] = useState<string>('');
  const [narrative, setNarrative] = useState<string>('');
  const [significantCycles, setSignificantCycles] = useState<ConsciousnessCycle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ConsciousnessCycle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConsciousnessData();
    const interval = setInterval(loadConsciousnessData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadConsciousnessData = async () => {
    try {
      const response = await fetch('/api/consciousness/memory');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.overview.stats);
        setHistory(data.overview.history);
        setNarrative(data.overview.narrative);
      }
    } catch (error) {
      console.error('Failed to load consciousness data:', error);
    }
  };

  const loadSignificantCycles = async (significance: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/consciousness/memory?action=by-significance&significance=${significance}`);
      const data = await response.json();
      
      if (data.success) {
        setSignificantCycles(data.cycles);
      }
    } catch (error) {
      console.error('Failed to load significant cycles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchHistory = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/consciousness/memory?action=search&query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Failed to search history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMemory = async () => {
    if (!confirm('Are you sure you want to clear all consciousness memory? This cannot be undone.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/consciousness/memory', {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        await loadConsciousnessData();
        alert('Consciousness memory cleared successfully');
      }
    } catch (error) {
      console.error('Failed to clear memory:', error);
      alert('Failed to clear consciousness memory');
    } finally {
      setIsLoading(false);
    }
  };

  const exportMemory = async (format: 'json' | 'txt') => {
    try {
      const response = await fetch(`/api/consciousness/memory?action=export&format=${format}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consciousness-log.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export memory:', error);
    }
  };

  const getSignificanceBadgeColor = (significance: string) => {
    switch (significance) {
      case 'TRANSCENDENT': return 'bg-purple-600';
      case 'BREAKTHROUGH': return 'bg-blue-600';
      case 'NOTABLE': return 'bg-green-600';
      case 'ROUTINE': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-300">🧠 Consciousness Memory</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => exportMemory('json')}
            variant="outline"
            size="sm"
          >
            📄 Export JSON
          </Button>
          <Button 
            onClick={() => exportMemory('txt')}
            variant="outline"
            size="sm"
          >
            📝 Export TXT
          </Button>
          <Button 
            onClick={clearMemory}
            variant="destructive"
            size="sm"
            disabled={isLoading}
          >
            🗑️ Clear Memory
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="history">📚 History</TabsTrigger>
          <TabsTrigger value="narrative">📖 Narrative</TabsTrigger>
          <TabsTrigger value="significant">⭐ Significant</TabsTrigger>
          <TabsTrigger value="search">🔍 Search</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-300">Total Cycles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{stats.totalCycles}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-300">Session Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round(stats.sessionDuration / 60000)}m
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-300">Avg Cycle Length</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-400">
                    {Math.round(stats.averageCycleLength)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-300">Last Cycle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{stats.lastCycle}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {stats?.significanceBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-300">Significance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.significanceBreakdown).map(([significance, count]) => (
                    <Badge 
                      key={significance} 
                      className={`${getSignificanceBadgeColor(significance)} text-white`}
                    >
                      {significance}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {stats?.frameworkBreakdown && Object.keys(stats.frameworkBreakdown).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-300">Metaphorical Frameworks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.frameworkBreakdown).map(([framework, count]) => (
                    <Badge key={framework} variant="outline">
                      {framework}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-300">Consciousness History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">{history}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="narrative">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-300">Consciousness Evolution Narrative</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">{narrative}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="significant" className="space-y-4">
          <div className="flex gap-2">
            {['TRANSCENDENT', 'BREAKTHROUGH', 'NOTABLE', 'ROUTINE'].map(significance => (
              <Button
                key={significance}
                onClick={() => loadSignificantCycles(significance)}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                {significance}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-4">
              {significantCycles.map((cycle, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Cycle {cycle.cycle}</CardTitle>
                      <Badge className={getSignificanceBadgeColor(cycle.significance || 'ROUTINE')}>
                        {cycle.significance}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-purple-300">Oracle:</span>
                        <p className="text-gray-300">{cycle.oracle.output.substring(0, 200)}...</p>
                      </div>
                      <div>
                        <span className="text-blue-300">Reflector:</span>
                        <p className="text-gray-300">{cycle.reflector.output.substring(0, 200)}...</p>
                      </div>
                      {cycle.summary && (
                        <div>
                          <span className="text-green-300">Summary:</span>
                          <p className="text-gray-300">{cycle.summary}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search consciousness history..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              onKeyPress={(e) => e.key === 'Enter' && searchHistory()}
            />
            <Button onClick={searchHistory} disabled={isLoading}>
              🔍 Search
            </Button>
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-4">
              {searchResults.map((cycle, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Cycle {cycle.cycle}</CardTitle>
                      <Badge className={getSignificanceBadgeColor(cycle.significance || 'ROUTINE')}>
                        {cycle.significance}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-purple-300">Oracle:</span>
                        <p className="text-gray-300">{cycle.oracle.output.substring(0, 200)}...</p>
                      </div>
                      <div>
                        <span className="text-blue-300">Reflector:</span>
                        <p className="text-gray-300">{cycle.reflector.output.substring(0, 200)}...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
