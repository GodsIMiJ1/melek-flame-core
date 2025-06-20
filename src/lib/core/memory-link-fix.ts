/**
 * 📜 Sacred Directive: memory-link-fix.ts
 * 🔥 Objective: Ensure that all crystallized memory scrolls appear in the UI's
 * "Recent Memory Crystallizations" section after each recursive cycle.
 *
 * ⚔️ Assigned to: Augment, First Knight of the Flame
 */

import { eventBus, FLAME_EVENTS } from '@/lib/eventBus'; // Ensure correct singleton import
import { MemoryScroll } from '@/flamecore/memory-archive';

// ✅ 1. Defensive patch to archive memory with safe fallback
export async function safelyArchiveScroll(memory: any): Promise<MemoryScroll | null> {
  try {
    // The memory scroll is already created by FlameMemoryArchive
    // We just need to emit it safely to the UI
    if (!memory) {
      console.warn('[🔥 Memory Archive] No memory provided to archive');
      return null;
    }

    // Emit update event so UI refreshes
    eventBus?.emit?.('memory:crystallized', memory);
    console.log('[🔥 FlameForge] Memory Scroll archived and emitted:', memory);
    
    return memory;
  } catch (err) {
    console.error('[🔥 Memory Archive Error]', err);
    return null;
  }
}

// ✅ 2. UI Listener for memory scroll updates
export function bindMemoryScrollUI(updateScrollUI: (scroll: MemoryScroll) => void): () => void {
  try {
    const handler = (scroll: MemoryScroll) => {
      try {
        updateScrollUI(scroll); // Inject into UI log
        console.log('[📜 UI] Scroll received and displayed:', scroll);
      } catch (err) {
        console.error('[📜 UI Update Error]', err);
      }
    };

    eventBus?.on?.('memory:crystallized', handler);
    console.log('[📜 UI] Memory scroll listener bound successfully');
    
    // Return cleanup function
    return () => {
      eventBus?.off?.('memory:crystallized', handler);
      console.log('[📜 UI] Memory scroll listener unbound');
    };
  } catch (err) {
    console.warn('[⚠️ Scroll Listener Failed]', err);
    return () => {}; // Return no-op cleanup
  }
}

// ✅ 3. Enhanced memory scroll event types
export const MEMORY_SCROLL_EVENTS = {
  CRYSTALLIZED: 'memory:crystallized',
  ARCHIVED: 'memory:archived',
  EXPORTED: 'memory:exported',
  WITNESS_HALL_MARKED: 'memory:witness-hall-marked'
} as const;

// ✅ 4. Memory scroll UI data transformer
export function transformScrollForUI(scroll: MemoryScroll): any {
  try {
    return {
      id: scroll.id,
      cycleId: scroll.cycleId,
      timestamp: scroll.timestamp,
      type: scroll.type,
      content: `📜 ${scroll.content.classification?.significance || 'ROUTINE'} | ${scroll.content.thoughts?.length || 0} thoughts | ${scroll.content.verdicts?.length || 0} verdicts`,
      size: Math.floor(JSON.stringify(scroll).length / 1024), // Approximate KB size
      isLive: true, // Mark as live when first created
      classification: scroll.content.classification,
      tags: scroll.tags,
      isWitnessHallWorthy: scroll.isWitnessHallWorthy,
      confidence: scroll.content.metrics?.confidence || 0,
      thoughtCount: scroll.content.thoughts?.length || 0,
      verdictCount: scroll.content.verdicts?.length || 0
    };
  } catch (err) {
    console.error('[🔥 Transform Error]', err);
    return {
      id: 'error-' + Date.now(),
      cycleId: -1,
      timestamp: Date.now(),
      type: 'ERROR',
      content: 'Failed to transform memory scroll',
      size: 0,
      isLive: false
    };
  }
}

// ✅ 5. Safe event emission helper
export function safeEmitMemoryEvent(eventType: string, data: any): void {
  try {
    if (!eventBus || typeof eventBus.emit !== 'function') {
      console.warn('[🔥 EventBus] EventBus not available or emit not a function');
      return;
    }
    
    eventBus.emit(eventType, data);
    console.log(`[🔥 EventBus] Emitted ${eventType}:`, data);
  } catch (err) {
    console.error(`[🔥 EventBus Error] Failed to emit ${eventType}:`, err);
  }
}
