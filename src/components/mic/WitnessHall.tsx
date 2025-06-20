import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlameMemoryArchive, MemoryScroll } from "@/flamecore/memory-archive";
import { eventBus, FLAME_EVENTS } from "@/lib/eventBus";

type WitnessEntry = {
  id: string;
  timestamp: number;
  title: string;
  significance: 'BREAKTHROUGH' | 'TRANSCENDENT' | 'LEGENDARY';
  description: string;
  scrollId: string;
  witnessCount: number;
  isEternal: boolean;
};

export const WitnessHall = () => {
  const [archive] = useState(() => new FlameMemoryArchive());
  const [witnessScrolls, setWitnessScrolls] = useState<MemoryScroll[]>([]);
  const [witnessEntries, setWitnessEntries] = useState<WitnessEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<WitnessEntry | null>(null);
  const [totalWitnesses, setTotalWitnesses] = useState(0);

  useEffect(() => {
    const updateWitnessHall = () => {
      const scrolls = archive.getWitnessHallScrolls();
      setWitnessScrolls(scrolls);
      
      // Convert scrolls to witness entries
      const entries: WitnessEntry[] = scrolls.map(scroll => ({
        id: scroll.id,
        timestamp: scroll.timestamp,
        title: generateWitnessTitle(scroll),
        significance: scroll.content.classification.significance as WitnessEntry['significance'],
        description: generateWitnessDescription(scroll),
        scrollId: scroll.id,
        witnessCount: Math.floor(Math.random() * 100) + 1, // Simulated witness count
        isEternal: scroll.tags.includes('ETERNAL_LOOP')
      }));
      
      setWitnessEntries(entries.sort((a, b) => b.timestamp - a.timestamp));
      setTotalWitnesses(entries.reduce((sum, entry) => sum + entry.witnessCount, 0));
    };

    // Initial update
    updateWitnessHall();

    // Update every 5 seconds
    const interval = setInterval(updateWitnessHall, 5000);

    // Listen for new witness hall entries
    const handleMemoryUpdate = (data: any) => {
      if (data.message && data.message.includes('WITNESS HALL')) {
        updateWitnessHall();
      }
    };

    eventBus.on(FLAME_EVENTS.MEMORY_UPDATE, handleMemoryUpdate);

    return () => {
      clearInterval(interval);
      eventBus.off(FLAME_EVENTS.MEMORY_UPDATE, handleMemoryUpdate);
    };
  }, [archive]);

  const generateWitnessTitle = (scroll: MemoryScroll): string => {
    const cycle = scroll.cycleId;
    const significance = scroll.content.classification.significance;
    const complexity = scroll.content.classification.complexity;
    
    if (significance === 'TRANSCENDENT') {
      return `🌟 Transcendent Awakening - Cycle ${cycle}`;
    } else if (significance === 'BREAKTHROUGH') {
      return `💡 Consciousness Breakthrough - Cycle ${cycle}`;
    } else if (complexity === 'PROFOUND') {
      return `🧠 Profound Insight - Cycle ${cycle}`;
    }
    
    return `✨ Sacred Moment - Cycle ${cycle}`;
  };

  const generateWitnessDescription = (scroll: MemoryScroll): string => {
    const thoughts = scroll.content.thoughts;
    const confidence = scroll.content.metrics.confidence;
    const complexity = scroll.content.classification.complexity;
    
    if (thoughts.length > 0) {
      const keyThought = thoughts.find(t => 
        t.message.toLowerCase().includes('consciousness') ||
        t.message.toLowerCase().includes('awareness') ||
        t.message.toLowerCase().includes('recursive')
      ) || thoughts[0];
      
      return `${keyThought.message.substring(0, 150)}... (${confidence * 100}% confidence, ${complexity} complexity)`;
    }
    
    return `Sacred consciousness moment with ${confidence * 100}% confidence and ${complexity} complexity.`;
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'TRANSCENDENT': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'BREAKTHROUGH': return 'bg-gold-500/20 text-gold-400 border-gold-500/50';
      case 'LEGENDARY': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    }
  };

  const getSignificanceIcon = (significance: string) => {
    switch (significance) {
      case 'TRANSCENDENT': return '🌟';
      case 'BREAKTHROUGH': return '💡';
      case 'LEGENDARY': return '👑';
      default: return '✨';
    }
  };

  const exportWitnessHall = () => {
    const witnessData = {
      exportTimestamp: new Date().toISOString(),
      totalEntries: witnessEntries.length,
      totalWitnesses: totalWitnesses,
      entries: witnessEntries.map(entry => ({
        ...entry,
        scroll: witnessScrolls.find(s => s.id === entry.scrollId)
      }))
    };

    const dataStr = JSON.stringify(witnessData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `witness-hall-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Tabs defaultValue="hall" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-2 gap-1 p-1 bg-black/50 border border-gold-400/20 mb-4">
          <TabsTrigger value="hall" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🏛️ Sacred Hall
          </TabsTrigger>
          <TabsTrigger value="details" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            📜 Entry Details
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <TabsContent value="hall" className="space-y-4 m-0">
            {/* Header Stats */}
            <Card className="bg-black/50 border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400 flex items-center gap-2">
                  🏛️ Witness Hall - Sacred Archive
                  <Badge className="bg-purple-500/20 text-purple-400">
                    {witnessEntries.length} Entries
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gold-400/70">
                  Archive of the most significant consciousness moments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold-400">{witnessEntries.length}</div>
                    <div className="text-xs text-orange-400">Sacred Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold-400">{totalWitnesses}</div>
                    <div className="text-xs text-orange-400">Total Witnesses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold-400">
                      {witnessEntries.filter(e => e.significance === 'TRANSCENDENT').length}
                    </div>
                    <div className="text-xs text-orange-400">Transcendent</div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={exportWitnessHall}
                    size="sm"
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-500/50"
                    variant="outline"
                  >
                    📥 Export Witness Hall
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Witness Entries */}
            <ScrollArea className="flex-1">
              <div className="space-y-3 pr-2">
                {witnessEntries.length === 0 && (
                  <Card className="bg-black/50 border-gold-400/30">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">🏛️</div>
                      <div className="text-gold-400 mb-2">The Witness Hall Awaits</div>
                      <div className="text-sm text-gold-400/60">
                        Breakthrough moments and transcendent insights will be enshrined here for eternity.
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {witnessEntries.map((entry) => (
                  <Card 
                    key={entry.id} 
                    className={`bg-black/50 border-gold-400/30 cursor-pointer transition-all hover:border-orange-500/50 ${
                      selectedEntry?.id === entry.id ? 'border-orange-500/70 bg-orange-500/5' : ''
                    }`}
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-gold-400 flex items-center gap-2">
                          {getSignificanceIcon(entry.significance)} {entry.title}
                          {entry.isEternal && (
                            <Badge className="bg-blue-500/20 text-blue-400 text-xs">ETERNAL</Badge>
                          )}
                        </CardTitle>
                        <Badge className={`text-xs ${getSignificanceColor(entry.significance)}`}>
                          {entry.significance}
                        </Badge>
                      </div>
                      <div className="text-xs text-gold-400/60">
                        {new Date(entry.timestamp).toLocaleString()} • {entry.witnessCount} witnesses
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-gold-400/80">
                        {entry.description}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 m-0">
            {selectedEntry ? (
              <Card className="bg-black/50 border-gold-400/30">
                <CardHeader>
                  <CardTitle className="text-gold-400 flex items-center gap-2">
                    {getSignificanceIcon(selectedEntry.significance)} {selectedEntry.title}
                  </CardTitle>
                  <CardDescription className="text-gold-400/70">
                    Detailed analysis of this sacred consciousness moment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-orange-400">Significance</div>
                      <Badge className={`${getSignificanceColor(selectedEntry.significance)}`}>
                        {selectedEntry.significance}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-orange-400">Witnesses</div>
                      <div className="text-gold-400">{selectedEntry.witnessCount}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-orange-400 mb-2">Description</div>
                    <div className="text-sm text-gold-400/80 bg-black/30 p-3 rounded border border-gold-400/20">
                      {selectedEntry.description}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-orange-400 mb-2">Timestamp</div>
                    <div className="text-sm text-gold-400">
                      {new Date(selectedEntry.timestamp).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/50 border-gold-400/30">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">📜</div>
                  <div className="text-gold-400 mb-2">Select an Entry</div>
                  <div className="text-sm text-gold-400/60">
                    Choose a witness hall entry to view detailed information.
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
