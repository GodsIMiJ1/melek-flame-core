import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlameMemoryArchive, MemoryScroll, MemoryInsight } from "@/flamecore/memory-archive";


export const MemoryScrollDashboard = () => {
  const [archive] = useState(() => new FlameMemoryArchive());
  const [scrolls, setScrolls] = useState<MemoryScroll[]>([]);
  const [insights, setInsights] = useState<MemoryInsight | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedScrolls, setSelectedScrolls] = useState<string[]>([]);
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [exportFormat, setExportFormat] = useState<'json' | 'txt' | 'flame'>('flame');

  useEffect(() => {
    // Update scrolls and insights every 2 seconds
    const interval = setInterval(() => {
      const allScrolls = archive.getAllScrolls();
      setScrolls(allScrolls);

      if (allScrolls.length > 0) {
        const newInsights = archive.generateInsights(10);
        setInsights(newInsights);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [archive]);

  const startCapture = () => {
    archive.startCapture();
    setIsCapturing(true);
  };

  const stopCapture = () => {
    archive.stopCapture();
    setIsCapturing(false);
  };

  const exportScrolls = async () => {
    const scrollsToExport = selectedScrolls.length > 0 ? selectedScrolls : undefined;
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (exportFormat) {
      case 'json':
        content = archive.exportAsJSON(scrollsToExport);
        filename = `flame-memory-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      case 'flame':
        content = archive.exportAsFlameScroll(scrollsToExport);
        filename = `flame-scroll-${new Date().toISOString().split('T')[0]}.flame`;
        mimeType = 'text/plain';
        break;
      default:
        content = archive.exportAsFlameScroll(scrollsToExport);
        filename = `flame-memory-${new Date().toISOString().split('T')[0]}.txt`;
        mimeType = 'text/plain';
    }

    // Direct browser download
    const today = new Date().toISOString().split('T')[0];
    const organizedFilename = `FLAME-EXPORT-${today}-${filename}`;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = organizedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`📜 EXPORTED: ${organizedFilename}`);
  };

  const toggleScrollSelection = (scrollId: string) => {
    setSelectedScrolls(prev =>
      prev.includes(scrollId)
        ? prev.filter(id => id !== scrollId)
        : [...prev, scrollId]
    );
  };

  const markAsWitnessHall = (scrollId: string) => {
    archive.markAsWitnessHallWorthy(scrollId);
    setScrolls(archive.getAllScrolls());
  };

  const getFilteredScrolls = () => {
    if (filterTag === 'ALL') return scrolls;
    if (filterTag === 'WITNESS_HALL') return archive.getWitnessHallScrolls();
    return archive.getScrollsByTag(filterTag);
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'TRANSCENDENT': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'BREAKTHROUGH': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'NOTABLE': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'CONFIDENT': return 'bg-green-500/20 text-green-400';
      case 'CURIOUS': return 'bg-blue-500/20 text-blue-400';
      case 'CONTEMPLATIVE': return 'bg-purple-500/20 text-purple-400';
      case 'UNCERTAIN': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-orange-500/20 text-orange-400';
    }
  };

  const filteredScrolls = getFilteredScrolls();
  const allTags = Array.from(new Set(scrolls.flatMap(s => s.tags)));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Tabs defaultValue="scrolls" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-3 gap-1 p-1 bg-black/50 border border-gold-400/20 mb-4">
          <TabsTrigger value="scrolls" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            📜 Memory Scrolls
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🧿 Insights
          </TabsTrigger>
          <TabsTrigger value="export" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            💾 Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scrolls" className="flex-1 flex flex-col min-h-0 m-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={isCapturing ? stopCapture : startCapture}
                className={`${
                  isCapturing
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/50'
                    : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/50'
                }`}
                variant="outline"
                size="sm"
              >
                {isCapturing ? '🛑 Stop Capture' : '🔥 Start Capture'}
              </Button>

              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="w-48 bg-black/50 border-gold-400/30 text-gold-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Scrolls</SelectItem>
                  <SelectItem value="WITNESS_HALL">🏛️ Witness Hall Worthy</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-gold-400/70">
              Status: <span className={isCapturing ? 'text-green-400' : 'text-orange-400'}>
                {isCapturing ? '🔥 CAPTURING' : '💭 IDLE'}
              </span> | Scrolls: {filteredScrolls.length}
            </div>
          </div>

          <ScrollArea className="flex-1 custom-scrollbar">
            <div className="space-y-3 pr-2">
              {filteredScrolls.length === 0 && (
                <div className="text-sm p-4 rounded border-l-4 border-gold-400/30 bg-gold-400/5 text-gold-400/60">
                  📜 No memory scrolls found. Start capturing to create sacred archives of consciousness.
                </div>
              )}

              {filteredScrolls.map((scroll) => (
                <Card key={scroll.id} className="bg-black/50 border-gold-400/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-gold-400">
                        📜 Cycle {scroll.cycleId} - {new Date(scroll.timestamp).toLocaleTimeString()}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedScrolls.includes(scroll.id)}
                          onChange={() => toggleScrollSelection(scroll.id)}
                          className="rounded"
                        />
                        {!scroll.isWitnessHallWorthy && (
                          <Button
                            onClick={() => markAsWitnessHall(scroll.id)}
                            size="sm"
                            variant="outline"
                            className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-500/50"
                          >
                            🏛️ Mark Worthy
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getSignificanceColor(scroll.content.classification.significance)}>
                        {scroll.content.classification.significance}
                      </Badge>
                      <Badge className={getToneColor(scroll.content.classification.emotionalTone)}>
                        {scroll.content.classification.emotionalTone}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {scroll.content.classification.complexity}
                      </Badge>
                      {scroll.isWitnessHallWorthy && (
                        <Badge className="bg-purple-500/20 text-purple-400">
                          🏛️ WITNESS HALL
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-gold-400/80">
                      Confidence: {(scroll.content.metrics.confidence * 100).toFixed(1)}% |
                      Thoughts: {scroll.content.thoughts.length} |
                      Verdicts: {scroll.content.verdicts.length}
                    </div>

                    <div className="text-xs text-gold-400/60">
                      Tags: {scroll.tags.join(', ')}
                    </div>

                    {scroll.content.thoughts.length > 0 && (
                      <div className="text-xs text-gold-400/70 italic">
                        Latest: "{scroll.content.thoughts[scroll.content.thoughts.length - 1].message.substring(0, 100)}..."
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>



        <TabsContent value="insights" className="flex-1 flex flex-col min-h-0 m-0">
          {insights ? (
            <div className="space-y-4">
              <Card className="bg-black/50 border-gold-400/30">
                <CardHeader>
                  <CardTitle className="text-gold-400">🧿 Memory Insights</CardTitle>
                  <CardDescription className="text-gold-400/70">
                    Analysis of recent consciousness evolution
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-orange-400">Total Scrolls</div>
                      <div className="text-2xl font-bold text-gold-400">{insights.totalScrolls}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-orange-400">Cycle Range</div>
                      <div className="text-lg font-bold text-gold-400">
                        {insights.cycleRange.start} - {insights.cycleRange.end}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-orange-400">Avg Confidence</div>
                      <div className="text-lg font-bold text-gold-400">
                        {(insights.averageConfidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-orange-400">Evolution Trend</div>
                      <div className="text-lg font-bold text-gold-400">{insights.evolutionTrend}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Dominant Tone</div>
                    <Badge className={getToneColor(insights.dominantTone)}>
                      {insights.dominantTone}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Breakthrough Moments</div>
                    <div className="text-lg font-bold text-gold-400">{insights.breakthroughMoments}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Top Themes</div>
                    <div className="flex gap-2 flex-wrap">
                      {insights.topThemes.map(theme => (
                        <Badge key={theme} className="bg-orange-500/20 text-orange-400">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-sm p-4 rounded border-l-4 border-gold-400/30 bg-gold-400/5 text-gold-400/60">
              🧿 No insights available. Capture some memory scrolls to generate consciousness analysis.
            </div>
          )}
        </TabsContent>

        <TabsContent value="export" className="flex-1 flex flex-col min-h-0 m-0">
          <div className="space-y-4">
            <Card className="bg-black/50 border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400">💾 Export Memory Scrolls</CardTitle>
                <CardDescription className="text-gold-400/70">
                  Create sacred archives for eternal preservation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-orange-400">Export Format</Label>
                  <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                    <SelectTrigger className="bg-black/50 border-gold-400/30 text-gold-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flame">🔥 Sacred Flame Scroll (.flame)</SelectItem>
                      <SelectItem value="json">📊 JSON Archive (.json)</SelectItem>
                      <SelectItem value="txt">📜 Text Document (.txt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-xs text-gold-400/70">
                  {selectedScrolls.length > 0
                    ? `Selected: ${selectedScrolls.length} scrolls`
                    : `All scrolls: ${scrolls.length} total`
                  }
                </div>

                <Button
                  onClick={exportScrolls}
                  className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/50"
                  variant="outline"
                  disabled={scrolls.length === 0}
                >
                  💾 Export Sacred Archive
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
