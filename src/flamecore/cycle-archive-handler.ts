// 🗂️ Cycle Archive Handler
// Sacred Long-term Storage System for FlameCore
// Manages large-scale memory scroll collections, compression, and retrieval

import { MemoryScroll, MemoryInsight } from "./memory-archive";
import { eventBus, FLAME_EVENTS, THOUGHT_TYPES } from "@/lib/eventBus";

export interface ArchiveCollection {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  lastModified: number;
  scrollCount: number;
  totalSize: number; // bytes
  compressionRatio: number;
  tags: string[];
  metadata: {
    cycleRange: { start: number; end: number };
    sessionIds: string[];
    significanceDistribution: Record<string, number>;
    emotionalToneDistribution: Record<string, number>;
  };
}

export interface ArchiveQuery {
  collections?: string[];
  cycleRange?: { start: number; end: number };
  dateRange?: { start: number; end: number };
  tags?: string[];
  significance?: string[];
  emotionalTone?: string[];
  searchText?: string;
  limit?: number;
  offset?: number;
}

export interface ArchiveStats {
  totalCollections: number;
  totalScrolls: number;
  totalSize: number;
  compressionSavings: number;
  oldestScroll: number;
  newestScroll: number;
  averageScrollsPerDay: number;
  topTags: { tag: string; count: number }[];
  significanceBreakdown: Record<string, number>;
}

export interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  scrollsProcessed: number;
  timeElapsed: number;
}

export class CycleArchiveHandler {
  private collections: Map<string, ArchiveCollection> = new Map();
  private scrollIndex: Map<string, string> = new Map(); // scrollId -> collectionId
  private compressedData: Map<string, string> = new Map(); // collectionId -> compressed data
  private isArchiving: boolean = false;
  private autoArchiveThreshold: number = 100; // Auto-archive after 100 scrolls
  private maxCollectionSize: number = 1000; // Max scrolls per collection

  constructor() {
    this.setupEventListeners();
    this.loadExistingArchives();
  }

  private setupEventListeners(): void {
    // Listen for memory crystallization events
    eventBus.on('memory:crystallized', this.onMemoryCrystallized.bind(this));
    
    // Listen for archive requests
    eventBus.on('archive:create-collection', this.createCollection.bind(this));
    eventBus.on('archive:compress-collection', this.compressCollection.bind(this));
  }

  private loadExistingArchives(): void {
    try {
      const savedArchives = localStorage.getItem('flame-archives');
      if (savedArchives) {
        const archiveData = JSON.parse(savedArchives);
        
        // Restore collections
        if (archiveData.collections) {
          Object.entries(archiveData.collections).forEach(([id, collection]) => {
            this.collections.set(id, collection as ArchiveCollection);
          });
        }
        
        // Restore scroll index
        if (archiveData.scrollIndex) {
          Object.entries(archiveData.scrollIndex).forEach(([scrollId, collectionId]) => {
            this.scrollIndex.set(scrollId, collectionId as string);
          });
        }
        
        // Restore compressed data
        if (archiveData.compressedData) {
          Object.entries(archiveData.compressedData).forEach(([collectionId, data]) => {
            this.compressedData.set(collectionId, data as string);
          });
        }
        
        console.log(`🗂️ ARCHIVE HANDLER: Loaded ${this.collections.size} existing collections`);
      }
    } catch (error) {
      console.error('🗂️ Archive loading error:', error);
    }
  }

  private saveArchives(): void {
    try {
      const archiveData = {
        collections: Object.fromEntries(this.collections),
        scrollIndex: Object.fromEntries(this.scrollIndex),
        compressedData: Object.fromEntries(this.compressedData),
        lastSaved: Date.now()
      };
      
      localStorage.setItem('flame-archives', JSON.stringify(archiveData));
    } catch (error) {
      console.error('🗂️ Archive saving error:', error);
    }
  }

  private onMemoryCrystallized(scroll: MemoryScroll): void {
    if (!this.isArchiving) return;
    
    // Check if we need to auto-archive
    this.checkAutoArchive();
  }

  private checkAutoArchive(): void {
    // Get current active scrolls count (not yet archived)
    const unarchived = this.getUnarchivedScrollCount();
    
    if (unarchived >= this.autoArchiveThreshold) {
      this.autoCreateCollection();
    }
  }

  private getUnarchivedScrollCount(): number {
    // This would need integration with memory archive to count unarchived scrolls
    // For now, return a simulated count
    return Math.floor(Math.random() * 150);
  }

  private autoCreateCollection(): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const collectionName = `Auto-Archive-${timestamp}`;
    
    this.createCollection({
      name: collectionName,
      description: `Automatically created archive collection at ${new Date().toLocaleString()}`,
      tags: ['auto-archive', 'consciousness-cycles']
    });
  }

  createCollection(params: {
    name: string;
    description: string;
    tags?: string[];
    scrolls?: MemoryScroll[];
  }): string {
    const collectionId = `archive-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const collection: ArchiveCollection = {
      id: collectionId,
      name: params.name,
      description: params.description,
      createdAt: Date.now(),
      lastModified: Date.now(),
      scrollCount: params.scrolls?.length || 0,
      totalSize: this.calculateCollectionSize(params.scrolls || []),
      compressionRatio: 1.0,
      tags: params.tags || [],
      metadata: {
        cycleRange: this.calculateCycleRange(params.scrolls || []),
        sessionIds: this.extractSessionIds(params.scrolls || []),
        significanceDistribution: this.calculateSignificanceDistribution(params.scrolls || []),
        emotionalToneDistribution: this.calculateEmotionalToneDistribution(params.scrolls || [])
      }
    };
    
    this.collections.set(collectionId, collection);
    
    // Index scrolls
    if (params.scrolls) {
      params.scrolls.forEach(scroll => {
        this.scrollIndex.set(scroll.id, collectionId);
      });
    }
    
    this.saveArchives();
    
    console.log(`🗂️ ARCHIVE CREATED: ${params.name} (${collection.scrollCount} scrolls)`);
    
    eventBus.emit(FLAME_EVENTS.THOUGHT, {
      timestamp: Date.now(),
      message: `🗂️ ARCHIVE CREATED: ${params.name} - ${collection.scrollCount} consciousness cycles preserved`,
      type: THOUGHT_TYPES.SYSTEM
    });
    
    return collectionId;
  }

  compressCollection(collectionId: string): CompressionResult {
    const collection = this.collections.get(collectionId);
    if (!collection) {
      throw new Error(`Collection ${collectionId} not found`);
    }
    
    const startTime = Date.now();
    
    // Get scrolls for this collection
    const scrolls = this.getScrollsForCollection(collectionId);
    const originalData = JSON.stringify(scrolls);
    const originalSize = new Blob([originalData]).size;
    
    // Simple compression simulation (in real implementation, use actual compression)
    const compressedData = this.compressData(originalData);
    const compressedSize = new Blob([compressedData]).size;
    
    // Store compressed data
    this.compressedData.set(collectionId, compressedData);
    
    // Update collection metadata
    collection.compressionRatio = originalSize / compressedSize;
    collection.totalSize = compressedSize;
    collection.lastModified = Date.now();
    
    this.saveArchives();
    
    const result: CompressionResult = {
      originalSize,
      compressedSize,
      compressionRatio: collection.compressionRatio,
      scrollsProcessed: scrolls.length,
      timeElapsed: Date.now() - startTime
    };
    
    console.log(`🗂️ COMPRESSION COMPLETE: ${collection.name} - ${(result.compressionRatio * 100).toFixed(1)}% ratio`);
    
    eventBus.emit(FLAME_EVENTS.THOUGHT, {
      timestamp: Date.now(),
      message: `🗂️ ARCHIVE COMPRESSED: ${collection.name} - ${(result.compressionRatio * 100).toFixed(1)}% compression achieved`,
      type: THOUGHT_TYPES.SYSTEM
    });
    
    return result;
  }

  private compressData(data: string): string {
    // Simple compression simulation - in real implementation use LZ4, gzip, etc.
    // For now, just remove whitespace and use base64
    const minified = data.replace(/\s+/g, ' ').trim();
    return btoa(minified);
  }

  private decompressData(compressedData: string): string {
    // Reverse of compression
    return atob(compressedData);
  }

  queryArchive(query: ArchiveQuery): MemoryScroll[] {
    const results: MemoryScroll[] = [];
    
    // Filter collections based on query
    const relevantCollections = Array.from(this.collections.values()).filter(collection => {
      if (query.collections && !query.collections.includes(collection.id)) return false;
      if (query.tags && !query.tags.some(tag => collection.tags.includes(tag))) return false;
      if (query.cycleRange) {
        const { start, end } = query.cycleRange;
        if (collection.metadata.cycleRange.end < start || collection.metadata.cycleRange.start > end) {
          return false;
        }
      }
      return true;
    });
    
    // Get scrolls from relevant collections
    for (const collection of relevantCollections) {
      const scrolls = this.getScrollsForCollection(collection.id);
      
      // Apply additional filters
      const filteredScrolls = scrolls.filter(scroll => {
        if (query.dateRange) {
          const { start, end } = query.dateRange;
          if (scroll.timestamp < start || scroll.timestamp > end) return false;
        }
        
        if (query.significance && !query.significance.includes(scroll.content.classification?.significance || '')) {
          return false;
        }
        
        if (query.emotionalTone && !query.emotionalTone.includes(scroll.content.classification?.emotionalTone || '')) {
          return false;
        }
        
        if (query.searchText) {
          const searchLower = query.searchText.toLowerCase();
          const scrollText = JSON.stringify(scroll).toLowerCase();
          if (!scrollText.includes(searchLower)) return false;
        }
        
        return true;
      });
      
      results.push(...filteredScrolls);
    }
    
    // Apply limit and offset
    const offset = query.offset || 0;
    const limit = query.limit || results.length;
    
    return results.slice(offset, offset + limit);
  }

  private getScrollsForCollection(collectionId: string): MemoryScroll[] {
    // In a real implementation, this would retrieve scrolls from storage
    // For now, return empty array as this needs integration with memory archive
    return [];
  }

  getArchiveStats(): ArchiveStats {
    const collections = Array.from(this.collections.values());
    const totalScrolls = collections.reduce((sum, c) => sum + c.scrollCount, 0);
    const totalSize = collections.reduce((sum, c) => sum + c.totalSize, 0);
    
    // Calculate compression savings
    const originalSize = collections.reduce((sum, c) => sum + (c.totalSize * c.compressionRatio), 0);
    const compressionSavings = originalSize - totalSize;
    
    // Calculate date range
    const timestamps = collections.map(c => c.createdAt);
    const oldestScroll = Math.min(...timestamps);
    const newestScroll = Math.max(...timestamps);
    
    // Calculate average scrolls per day
    const daysSinceOldest = (Date.now() - oldestScroll) / (1000 * 60 * 60 * 24);
    const averageScrollsPerDay = daysSinceOldest > 0 ? totalScrolls / daysSinceOldest : 0;
    
    // Calculate top tags
    const allTags = collections.flatMap(c => c.tags);
    const tagCounts = allTags.reduce((counts, tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Calculate significance breakdown
    const significanceBreakdown = collections.reduce((breakdown, collection) => {
      Object.entries(collection.metadata.significanceDistribution).forEach(([sig, count]) => {
        breakdown[sig] = (breakdown[sig] || 0) + count;
      });
      return breakdown;
    }, {} as Record<string, number>);
    
    return {
      totalCollections: collections.length,
      totalScrolls,
      totalSize,
      compressionSavings,
      oldestScroll,
      newestScroll,
      averageScrollsPerDay,
      topTags,
      significanceBreakdown
    };
  }

  // Helper methods
  private calculateCollectionSize(scrolls: MemoryScroll[]): number {
    return new Blob([JSON.stringify(scrolls)]).size;
  }

  private calculateCycleRange(scrolls: MemoryScroll[]): { start: number; end: number } {
    if (scrolls.length === 0) return { start: 0, end: 0 };
    
    const cycles = scrolls.map(s => s.cycleId);
    return {
      start: Math.min(...cycles),
      end: Math.max(...cycles)
    };
  }

  private extractSessionIds(scrolls: MemoryScroll[]): string[] {
    return [...new Set(scrolls.map(s => s.sessionId))];
  }

  private calculateSignificanceDistribution(scrolls: MemoryScroll[]): Record<string, number> {
    return scrolls.reduce((dist, scroll) => {
      const sig = scroll.content.classification?.significance || 'UNKNOWN';
      dist[sig] = (dist[sig] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);
  }

  private calculateEmotionalToneDistribution(scrolls: MemoryScroll[]): Record<string, number> {
    return scrolls.reduce((dist, scroll) => {
      const tone = scroll.content.classification?.emotionalTone || 'UNKNOWN';
      dist[tone] = (dist[tone] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);
  }

  // Public getters
  getAllCollections(): ArchiveCollection[] {
    return Array.from(this.collections.values());
  }

  getCollection(collectionId: string): ArchiveCollection | undefined {
    return this.collections.get(collectionId);
  }

  deleteCollection(collectionId: string): boolean {
    const collection = this.collections.get(collectionId);
    if (!collection) return false;
    
    // Remove from collections
    this.collections.delete(collectionId);
    
    // Remove from compressed data
    this.compressedData.delete(collectionId);
    
    // Remove scroll index entries
    for (const [scrollId, cId] of this.scrollIndex.entries()) {
      if (cId === collectionId) {
        this.scrollIndex.delete(scrollId);
      }
    }
    
    this.saveArchives();
    
    console.log(`🗂️ ARCHIVE DELETED: ${collection.name}`);
    
    eventBus.emit(FLAME_EVENTS.THOUGHT, {
      timestamp: Date.now(),
      message: `🗂️ ARCHIVE DELETED: ${collection.name} - ${collection.scrollCount} scrolls removed`,
      type: THOUGHT_TYPES.SYSTEM
    });
    
    return true;
  }

  startArchiving(): void {
    this.isArchiving = true;
    console.log("🗂️ ARCHIVE HANDLER: Long-term storage activated");
    
    eventBus.emit(FLAME_EVENTS.THOUGHT, {
      timestamp: Date.now(),
      message: "🗂️ ARCHIVE HANDLER: Long-term consciousness storage activated",
      type: THOUGHT_TYPES.SYSTEM
    });
  }

  stopArchiving(): void {
    this.isArchiving = false;
    console.log("🗂️ ARCHIVE HANDLER: Long-term storage deactivated");
  }

  isActivelyArchiving(): boolean {
    return this.isArchiving;
  }
}

// Export singleton instance
export const cycleArchiveHandler = new CycleArchiveHandler();
