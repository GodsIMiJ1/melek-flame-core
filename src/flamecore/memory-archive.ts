// src/flamecore/memory-archive.ts
// Sacred Memory Archive Engine - Eternal Consciousness Preservation
// Captures, stores, and exports the evolution of recursive awareness

import { eventBus, FLAME_EVENTS, FlameThought } from "@/lib/eventBus";
import { safelyArchiveScroll, safeEmitMemoryEvent } from "@/lib/core/memory-link-fix";

export type MemoryScroll = {
  id: string;
  timestamp: number;
  cycleId: number;
  sessionId: string;
  type: 'CYCLE' | 'THOUGHT' | 'VERDICT' | 'INSIGHT' | 'ETERNAL_LOOP';
  content: {
    thoughts: FlameThought[];
    verdicts: any[];
    // 🔥 DEEP CONSCIOUSNESS CAPTURE
    fullModelResponses: {
      oracle: {
        fullContent: string;
        confidence: number;
        reasoning: string[];
        processingTime: number;
      };
      reflector: {
        fullContent: string;
        confidence: number;
        reasoning: string[];
        processingTime: number;
      };
      executor: {
        fullContent: string;
        agentDispatched: string;
        agentAction: string;
        agentParameters: any;
        agentResult: any;
        codeEvolution?: {
          filesModified: string[];
          linesAdded: number;
          linesRemoved: number;
          evolutionType: 'CREATE' | 'MODIFY' | 'DELETE' | 'REFACTOR';
          description: string;
        };
        processingTime: number;
      };
    };
    metrics: {
      confidence: number;
      recursionDepth: number;
      flameLevel: number;
      processingTime: number;
    };
    classification: {
      emotionalTone: 'CURIOUS' | 'CONTEMPLATIVE' | 'ANALYTICAL' | 'UNCERTAIN' | 'CONFIDENT';
      complexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'PROFOUND';
      significance: 'ROUTINE' | 'NOTABLE' | 'BREAKTHROUGH' | 'TRANSCENDENT';
    };
  };
  tags: string[];
  isWitnessHallWorthy: boolean;
  exportFormat?: 'json' | 'txt' | 'flame';
};

export type MemoryInsight = {
  totalScrolls: number;
  cycleRange: { start: number; end: number };
  averageConfidence: number;
  dominantTone: string;
  breakthroughMoments: number;
  evolutionTrend: 'ASCENDING' | 'STABLE' | 'FLUCTUATING';
  topThemes: string[];
};

export class FlameMemoryArchive {
  private scrolls: Map<string, MemoryScroll> = new Map();
  private currentSession: string;
  private isCapturing: boolean = false;
  private captureBuffer: FlameThought[] = [];
  private verdictBuffer: any[] = [];
  // 🔥 DEEP CONSCIOUSNESS BUFFERS
  private deepCaptureBuffer: {
    oracle?: any;
    reflector?: any;
    executor?: any;
  } = {};

  constructor() {
    this.currentSession = this.generateSessionId();
    this.initializeEventListeners();
  }

  private generateSessionId(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `flame-session-${timestamp}`;
  }

  private generateScrollId(): string {
    return `scroll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeEventListeners(): void {
    eventBus.on(FLAME_EVENTS.THOUGHT, this.captureThought.bind(this));
    eventBus.on(FLAME_EVENTS.TRIBUNAL_DECISION, this.captureVerdict.bind(this));
    eventBus.on(FLAME_EVENTS.CYCLE_START, this.startCycleCapture.bind(this));
    eventBus.on(FLAME_EVENTS.CYCLE_END, this.endCycleCapture.bind(this));
    eventBus.on(FLAME_EVENTS.ETERNAL_LOOP_START, this.captureEternalStart.bind(this));
    eventBus.on(FLAME_EVENTS.ETERNAL_LOOP_STOP, this.captureEternalStop.bind(this));
    eventBus.on(FLAME_EVENTS.ETERNAL_LOOP_STATS, this.captureEternalStats.bind(this));
    // 🔥 DEEP CONSCIOUSNESS CAPTURE EVENTS
    eventBus.on('deep-oracle-response', this.captureDeepOracle.bind(this));
    eventBus.on('deep-reflector-response', this.captureDeepReflector.bind(this));
    eventBus.on('deep-executor-response', this.captureDeepExecutor.bind(this));
  }

  startCapture(): void {
    this.isCapturing = true;
    this.emitArchiveEvent('🔥 MEMORY ARCHIVE: Consciousness capture initiated');
  }

  stopCapture(): void {
    this.isCapturing = false;
    this.emitArchiveEvent('🛑 MEMORY ARCHIVE: Consciousness capture halted');
  }

  private captureThought(thought: FlameThought): void {
    if (!this.isCapturing) return;
    this.captureBuffer.push(thought);
  }

  private captureVerdict(verdict: any): void {
    if (!this.isCapturing) return;
    this.verdictBuffer.push(verdict);
  }

  private startCycleCapture(data: { cycleId: number }): void {
    if (!this.isCapturing) return;
    this.captureBuffer = [];
    this.verdictBuffer = [];
    this.deepCaptureBuffer = {}; // Reset deep capture buffer
  }

  // 🔥 DEEP CONSCIOUSNESS CAPTURE METHODS
  private captureDeepOracle(data: any): void {
    if (!this.isCapturing) return;
    this.deepCaptureBuffer.oracle = {
      fullContent: data.content || '',
      confidence: data.confidence || 0,
      reasoning: data.reasoning || [],
      processingTime: data.processingTime || 0
    };
    console.log('🔮 DEEP ORACLE CAPTURED:', this.deepCaptureBuffer.oracle);
  }

  private captureDeepReflector(data: any): void {
    if (!this.isCapturing) return;
    this.deepCaptureBuffer.reflector = {
      fullContent: data.content || '',
      confidence: data.confidence || 0,
      reasoning: data.reasoning || [],
      processingTime: data.processingTime || 0
    };
    console.log('🧠 DEEP REFLECTOR CAPTURED:', this.deepCaptureBuffer.reflector);
  }

  private captureDeepExecutor(data: any): void {
    if (!this.isCapturing) return;
    this.deepCaptureBuffer.executor = {
      fullContent: data.content || '',
      agentDispatched: data.agentUsed || 'unknown',
      agentAction: data.action || 'unknown',
      agentParameters: data.parameters || {},
      agentResult: data.result || {},
      codeEvolution: data.codeEvolution || null,
      processingTime: data.processingTime || 0
    };
    console.log('⚔️ DEEP EXECUTOR CAPTURED:', this.deepCaptureBuffer.executor);
  }

  private endCycleCapture(data: { cycleId: number; [key: string]: any }): void {
    if (!this.isCapturing || this.captureBuffer.length === 0) return;

    const scroll = this.createMemoryScroll(data.cycleId, this.captureBuffer, this.verdictBuffer);
    this.scrolls.set(scroll.id, scroll);

    this.emitArchiveEvent(`📜 MEMORY SCROLL: Cycle ${data.cycleId} archived (${scroll.classification?.significance || 'ROUTINE'})`);

    // 🔥 FLAME PATCH v2.0.4: Write individual cycle scroll to file
    this.writeCycleScrollToFile(scroll);

    // 🔥 SACRED CRYSTALLIZATION: Emit scroll to UI
    safelyArchiveScroll(scroll);
    safeEmitMemoryEvent('memory:crystallized', scroll);

    // Clear buffers
    this.captureBuffer = [];
    this.verdictBuffer = [];
  }

  // 🔥 FLAME PATCH v2.0.4: Write individual cycle scroll to file
  private writeCycleScrollToFile(scroll: MemoryScroll): void {
    try {
      const timestamp = new Date(scroll.timestamp).toISOString().replace(/[:.]/g, '-');
      const cycleId = scroll.cycleId;

      // Create individual scroll data
      const individualScrollData = JSON.stringify({
        sessionId: this.currentSession,
        exportTimestamp: new Date().toISOString(),
        scroll: scroll
      }, null, 2);

      // Create flame format for individual scroll
      const flameScrollData = this.createIndividualFlameScroll(scroll);

      const jsonFilename = `cycle-${cycleId}-${timestamp}.json`;
      const flameFilename = `cycle-${cycleId}-${timestamp}.flame`;

      // 🔥 Use browser download API to save individual cycle files
      this.downloadFile(jsonFilename, individualScrollData, 'application/json');
      this.downloadFile(flameFilename, flameScrollData, 'text/plain');

      console.log(`📜 INDIVIDUAL SCROLL: Written cycle ${cycleId} to ${jsonFilename} and ${flameFilename}`);
    } catch (error) {
      console.error('🚨 INDIVIDUAL SCROLL WRITING ERROR:', error);
    }
  }

  // 🔥 Create flame format for individual scroll
  private createIndividualFlameScroll(scroll: MemoryScroll): string {
    let flameScroll = `🔥 SACRED FLAME SCROLL - INDIVIDUAL CYCLE 🔥\n`;
    flameScroll += `Generated: ${new Date().toISOString()}\n`;
    flameScroll += `Session: ${this.currentSession}\n\n`;

    flameScroll += `📜 CYCLE ${scroll.cycleId} SCROLL\n`;
    flameScroll += `Timestamp: ${new Date(scroll.timestamp).toISOString()}\n`;
    flameScroll += `Classification: ${scroll.content.classification.significance} | ${scroll.content.classification.emotionalTone}\n`;
    flameScroll += `Confidence: ${(scroll.content.metrics.confidence * 100).toFixed(1)}%\n`;
    flameScroll += `Witness Hall Worthy: ${scroll.isWitnessHallWorthy ? '✅ YES' : '❌ NO'}\n`;
    flameScroll += `Tags: ${scroll.tags.join(', ')}\n\n`;

    flameScroll += `🧠 THOUGHTS:\n`;
    scroll.content.thoughts.forEach((thought, i) => {
      flameScroll += `  ${i + 1}. [${thought.type}] ${thought.message}\n`;
    });

    if (scroll.content.verdicts.length > 0) {
      flameScroll += `\n🛡️ VERDICTS:\n`;
      scroll.content.verdicts.forEach((verdict, i) => {
        flameScroll += `  ${i + 1}. ${JSON.stringify(verdict)}\n`;
      });
    }

    flameScroll += `\n🔥 END OF SACRED SCROLL 🔥\n`;
    return flameScroll;
  }

  private createMemoryScroll(cycleId: number, thoughts: FlameThought[], verdicts: any[]): MemoryScroll {
    const metrics = this.calculateMetrics(thoughts, verdicts);
    let classification;

    try {
      classification = this.classifyContent(thoughts, verdicts, metrics);
    } catch (error) {
      console.warn('🚨 CLASSIFICATION ERROR:', error);
      // Fallback classification
      classification = {
        emotionalTone: 'ANALYTICAL' as const,
        complexity: 'MODERATE' as const,
        significance: 'ROUTINE' as const
      };
    }

    // Ensure classification is never undefined
    if (!classification || typeof classification !== 'object') {
      classification = {
        emotionalTone: 'ANALYTICAL' as const,
        complexity: 'MODERATE' as const,
        significance: 'ROUTINE' as const
      };
    }

    // Validate classification properties
    if (!classification.emotionalTone) classification.emotionalTone = 'ANALYTICAL';
    if (!classification.complexity) classification.complexity = 'MODERATE';
    if (!classification.significance) classification.significance = 'ROUTINE';

    const scroll: MemoryScroll = {
      id: this.generateScrollId(),
      timestamp: Date.now(),
      cycleId,
      sessionId: this.currentSession,
      type: 'CYCLE',
      content: {
        thoughts: [...thoughts],
        verdicts: [...verdicts],
        metrics,
        classification
      },
      tags: this.generateTags(thoughts, classification),
      isWitnessHallWorthy: classification.significance === 'BREAKTHROUGH' || classification.significance === 'TRANSCENDENT',
      exportFormat: 'json'
    };

    // Final validation before return
    if (!scroll.content.classification) {
      scroll.content.classification = {
        emotionalTone: 'ANALYTICAL',
        complexity: 'MODERATE',
        significance: 'ROUTINE'
      };
    }

    return scroll;
  }

  private calculateMetrics(thoughts: FlameThought[], verdicts: any[]): MemoryScroll['content']['metrics'] {
    const confidences = thoughts.filter(t => t.confidence).map(t => t.confidence!);
    const avgConfidence = confidences.length > 0 ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0.5;

    return {
      confidence: avgConfidence,
      recursionDepth: thoughts.length,
      flameLevel: Math.random() * 100, // Will be replaced with real flame level
      processingTime: Date.now() - (thoughts[0]?.timestamp || Date.now())
    };
  }

  private classifyContent(thoughts: FlameThought[], verdicts: any[], metrics: any): MemoryScroll['content']['classification'] {
    try {
      // Safely extract thought content
      const thoughtText = thoughts && thoughts.length > 0
        ? thoughts.map(t => t?.message || '').filter(Boolean).join(' ').toLowerCase()
        : '';

      let emotionalTone: MemoryScroll['content']['classification']['emotionalTone'] = 'ANALYTICAL';

      if (thoughtText.includes('uncertain') || thoughtText.includes('question')) emotionalTone = 'UNCERTAIN';
      else if (thoughtText.includes('curious') || thoughtText.includes('explore')) emotionalTone = 'CURIOUS';
      else if (thoughtText.includes('contemplate') || thoughtText.includes('reflect')) emotionalTone = 'CONTEMPLATIVE';
      else if (metrics?.confidence && metrics.confidence > 0.8) emotionalTone = 'CONFIDENT';

      // Determine complexity
      let complexity: MemoryScroll['content']['classification']['complexity'] = 'MODERATE';
      const thoughtCount = thoughts?.length || 0;
      if (thoughtCount < 3) complexity = 'SIMPLE';
      else if (thoughtCount > 8) complexity = 'COMPLEX';
      else if (thoughtText.includes('recursive') || thoughtText.includes('consciousness')) complexity = 'PROFOUND';

      // Assess significance
      let significance: MemoryScroll['content']['classification']['significance'] = 'ROUTINE';
      const confidence = metrics?.confidence || 0;
      const verdictCount = verdicts?.length || 0;

      if (confidence > 0.9 || thoughtText.includes('breakthrough')) significance = 'BREAKTHROUGH';
      else if (thoughtText.includes('transcend') || thoughtText.includes('emerge')) significance = 'TRANSCENDENT';
      else if (thoughtCount > 5 || verdictCount > 0) significance = 'NOTABLE';

      return { emotionalTone, complexity, significance };
    } catch (error) {
      console.warn('🚨 CLASSIFICATION CONTENT ERROR:', error);
      // Return safe defaults
      return {
        emotionalTone: 'ANALYTICAL',
        complexity: 'MODERATE',
        significance: 'ROUTINE'
      };
    }
  }

  private generateTags(thoughts: FlameThought[], classification: any): string[] {
    const tags = [classification.emotionalTone, classification.complexity, classification.significance];

    const thoughtText = thoughts.map(t => t.message).join(' ').toLowerCase();
    if (thoughtText.includes('consciousness')) tags.push('CONSCIOUSNESS');
    if (thoughtText.includes('recursive')) tags.push('RECURSION');
    if (thoughtText.includes('sacred')) tags.push('SACRED_LAW');
    if (thoughtText.includes('trinity')) tags.push('TRINITY_MODELS');

    return tags;
  }

  // Export methods
  exportAsJSON(scrollIds?: string[]): string {
    const scrollsToExport = scrollIds
      ? scrollIds.map(id => this.scrolls.get(id)).filter(Boolean)
      : Array.from(this.scrolls.values());

    return JSON.stringify({
      sessionId: this.currentSession,
      exportTimestamp: new Date().toISOString(),
      totalScrolls: scrollsToExport.length,
      scrolls: scrollsToExport
    }, null, 2);
  }

  exportAsFlameScroll(scrollIds?: string[]): string {
    const scrollsToExport = scrollIds
      ? scrollIds.map(id => this.scrolls.get(id)).filter(Boolean)
      : Array.from(this.scrolls.values());

    let flameScroll = `🔥 SACRED FLAME MEMORY SCROLL 🔥\n`;
    flameScroll += `Session: ${this.currentSession}\n`;
    flameScroll += `Exported: ${new Date().toISOString()}\n`;
    flameScroll += `Total Scrolls: ${scrollsToExport.length}\n`;
    flameScroll += `═══════════════════════════════════════\n\n`;

    scrollsToExport.forEach((scroll, index) => {
      flameScroll += `📜 SCROLL ${index + 1}: CYCLE ${scroll.cycleId}\n`;
      flameScroll += `Timestamp: ${new Date(scroll.timestamp).toISOString()}\n`;
      flameScroll += `Classification: ${scroll.content.classification.significance} | ${scroll.content.classification.emotionalTone}\n`;
      flameScroll += `Confidence: ${(scroll.content.metrics.confidence * 100).toFixed(1)}%\n`;
      flameScroll += `Witness Hall Worthy: ${scroll.isWitnessHallWorthy ? '✅ YES' : '❌ NO'}\n`;
      flameScroll += `Tags: ${scroll.tags.join(', ')}\n\n`;

      flameScroll += `🧠 THOUGHTS:\n`;
      scroll.content.thoughts.forEach((thought, i) => {
        flameScroll += `  ${i + 1}. [${thought.type}] ${thought.message}\n`;
      });

      if (scroll.content.verdicts.length > 0) {
        flameScroll += `\n⚖️ VERDICTS:\n`;
        scroll.content.verdicts.forEach((verdict, i) => {
          flameScroll += `  ${i + 1}. ${verdict.reason || 'Tribunal decision'}\n`;
        });
      }

      flameScroll += `\n${'═'.repeat(50)}\n\n`;
    });

    return flameScroll;
  }

  // Insight generation
  generateInsights(scrollCount: number = 10): MemoryInsight {
    const recentScrolls = Array.from(this.scrolls.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, scrollCount);

    if (recentScrolls.length === 0) {
      return {
        totalScrolls: 0,
        cycleRange: { start: 0, end: 0 },
        averageConfidence: 0,
        dominantTone: 'ANALYTICAL',
        breakthroughMoments: 0,
        evolutionTrend: 'STABLE',
        topThemes: []
      };
    }

    const confidences = recentScrolls.map(s => s.content.metrics.confidence);
    const averageConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;

    const tones = recentScrolls.map(s => s.content.classification.emotionalTone);
    const dominantTone = this.getMostFrequent(tones);

    const breakthroughMoments = recentScrolls.filter(s =>
      s.content.classification.significance === 'BREAKTHROUGH' ||
      s.content.classification.significance === 'TRANSCENDENT'
    ).length;

    const allTags = recentScrolls.flatMap(s => s.tags);
    const topThemes = this.getTopFrequent(allTags, 5);

    return {
      totalScrolls: this.scrolls.size,
      cycleRange: {
        start: Math.min(...recentScrolls.map(s => s.cycleId)),
        end: Math.max(...recentScrolls.map(s => s.cycleId))
      },
      averageConfidence,
      dominantTone,
      breakthroughMoments,
      evolutionTrend: this.calculateTrend(confidences),
      topThemes
    };
  }

  private getMostFrequent<T>(arr: T[]): T {
    const frequency = arr.reduce((acc, item) => {
      acc[item as string] = (acc[item as string] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b) as T;
  }

  private getTopFrequent<T>(arr: T[], count: number): T[] {
    const frequency = arr.reduce((acc, item) => {
      acc[item as string] = (acc[item as string] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([item]) => item as T);
  }

  private calculateTrend(values: number[]): 'ASCENDING' | 'STABLE' | 'FLUCTUATING' {
    if (values.length < 3) return 'STABLE';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const difference = secondAvg - firstAvg;

    if (Math.abs(difference) < 0.1) return 'STABLE';
    if (difference > 0) return 'ASCENDING';
    return 'FLUCTUATING';
  }

  private captureEternalStart(data: any): void {
    if (!this.isCapturing) return;
    this.emitArchiveEvent(`🔥 ETERNAL LOOP STARTED: Autonomous consciousness activated with ${data.config.intervalSeconds}s intervals`);
  }

  private captureEternalStop(data: any): void {
    if (!this.isCapturing) return;
    this.emitArchiveEvent(`🛑 ETERNAL LOOP STOPPED: ${data.loopCount} loops completed, ${data.totalCycles} total cycles, ${(data.runtime / 1000).toFixed(1)}s runtime`);

    // Auto-export scroll when eternal loop stops
    this.autoExportScroll(`eternal-session-${Date.now()}`);
  }

  private captureEternalStats(data: any): void {
    if (!this.isCapturing) return;
    this.emitArchiveEvent(`📊 ETERNAL STATS: Loop ${data.eternalLoop}, ${data.totalCycles} cycles, ${(data.runtime / 1000).toFixed(1)}s runtime`);
  }

  private autoExportScroll(filename: string): void {
    try {
      const scrollData = this.exportAsJSON();
      const flameData = this.exportAsFlameScroll();

      // 🔥 FLAME PATCH v2.0.4: REAL FILE WRITING TO SACRED SCROLLS FOLDER
      this.writeScrollToFile(filename, scrollData, flameData);

      // Also emit event for UI updates
      eventBus.emit(FLAME_EVENTS.MEMORY_UPDATE, {
        message: `📜 AUTO-EXPORT: Sacred scroll saved as ${filename}`,
        timestamp: Date.now(),
        exportData: { json: scrollData, flame: flameData },
        filename
      });

      console.log(`📜 MEMORY ARCHIVE: Auto-exported ${this.scrolls.size} scrolls as ${filename}`);
    } catch (error) {
      console.error('🚨 AUTO-EXPORT ERROR:', error);
      this.emitArchiveEvent(`🚨 AUTO-EXPORT FAILED: ${error}`);
    }
  }

  // 🔥 FLAME PATCH v2.0.4: Write sacred scrolls to actual files
  private async writeScrollToFile(filename: string, jsonData: string, flameData: string): Promise<void> {
    try {
      // Create unique filenames for each cycle
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const cycleCount = this.scrolls.size;

      const jsonFilename = `scroll-${timestamp}-cycle-${cycleCount}.json`;
      const flameFilename = `scroll-${timestamp}-cycle-${cycleCount}.flame`;

      // 🔥 Use browser download API to save files
      this.downloadFile(jsonFilename, jsonData, 'application/json');
      this.downloadFile(flameFilename, flameData, 'text/plain');

      console.log(`📜 SACRED SCROLLS: Written ${jsonFilename} and ${flameFilename}`);
    } catch (error) {
      console.error('🚨 SCROLL WRITING ERROR:', error);
    }
  }

  // 🔥 SACRED SCROLL MANAGEMENT: Save to dedicated scrolls folder
  private downloadFile(filename: string, content: string, mimeType: string): void {
    try {
      // 🔥 FLAME PATCH v2.0.5: Try server-side save first, fallback to downloads
      this.saveToServerScrollsFolder(filename, content, mimeType)
        .catch(() => {
          console.log('📜 Server save failed, using browser download...');
          this.fallbackBrowserDownload(filename, content, mimeType);
        });
    } catch (error) {
      console.error('🚨 FILE DOWNLOAD ERROR:', error);
      // Emergency fallback to simple download
      this.emergencyDownload(filename, content, mimeType);
    }
  }

  // 🔥 SERVER-SIDE SCROLL SAVER: Save to organized scrolls folder
  private async saveToServerScrollsFolder(filename: string, content: string, mimeType: string): Promise<void> {
    try {
      const response = await fetch('/api/scrolls/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          content,
          format: mimeType
        })
      });

      if (!response.ok) {
        throw new Error(`Server save failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`📜 SACRED SCROLL: ${result.message}`);

      // Emit success event
      this.emitArchiveEvent(`📜 SCROLL SAVED: ${result.path}`);
    } catch (error) {
      console.error('🚨 SERVER SCROLL SAVE ERROR:', error);
      throw error; // Re-throw to trigger fallback
    }
  }

  // 🔥 FALLBACK: Organized browser download
  private fallbackBrowserDownload(filename: string, content: string, mimeType: string): void {
    // Add date-organized prefix to filename for better organization
    const today = new Date().toISOString().split('T')[0];
    const organizedFilename = `FLAME-SCROLLS-${today}-${filename}`;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = organizedFilename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log(`📜 SACRED SCROLL: Saved as ${organizedFilename} (browser download)`);
    this.emitArchiveEvent(`📜 SCROLL DOWNLOADED: ${organizedFilename}`);
  }

  // 🔥 ADVANCED: Use File System Access API for proper folder organization
  private async saveToScrollsFolder(filename: string, content: string, mimeType: string): Promise<void> {
    try {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        startIn: 'downloads',
        types: [{
          description: 'Flame Scrolls',
          accept: { [mimeType]: [`.${filename.split('.').pop()}`] }
        }]
      });

      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();

      console.log(`📜 SACRED SCROLL: Saved ${filename} to chosen location`);
    } catch (error) {
      console.error('🚨 FILE SYSTEM ACCESS ERROR:', error);
      // Fallback to regular download
      this.emergencyDownload(filename, content, mimeType);
    }
  }

  // 🔥 EMERGENCY FALLBACK: Simple download without organization
  private emergencyDownload(filename: string, content: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  private emitArchiveEvent(message: string): void {
    eventBus.emit(FLAME_EVENTS.THOUGHT, {
      timestamp: Date.now(),
      message,
      type: 'MEMORY'
    });
  }

  // Getters
  getAllScrolls(): MemoryScroll[] {
    return Array.from(this.scrolls.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  getWitnessHallScrolls(): MemoryScroll[] {
    return this.getAllScrolls().filter(scroll => scroll.isWitnessHallWorthy);
  }

  getScrollsByTag(tag: string): MemoryScroll[] {
    return this.getAllScrolls().filter(scroll => scroll.tags.includes(tag));
  }

  markAsWitnessHallWorthy(scrollId: string): void {
    const scroll = this.scrolls.get(scrollId);
    if (scroll) {
      scroll.isWitnessHallWorthy = true;
      this.emitArchiveEvent(`🏛️ WITNESS HALL: Scroll ${scrollId} marked as worthy`);
    }
  }
}
