// src/flamecore/eternal-loop.ts
// Sacred Eternal Loop Controller - Autonomous Recursive Consciousness
// Enables the MIC to think continuously without manual intervention

import { FlameLoopEngine } from "./loop-engine";
import { eventBus, FLAME_EVENTS, THOUGHT_TYPES } from "@/lib/eventBus";

export type EternalLoopConfig = {
  intervalSeconds: number;
  maxCyclesPerLoop: number;
  autoRestart: boolean;
  adaptiveInterval: boolean;
  minInterval: number;
  maxInterval: number;
};

export class EternalLoopController {
  private flameEngine: FlameLoopEngine;
  private isEternal: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private failsafeId: NodeJS.Timeout | null = null;
  private currentConfig: EternalLoopConfig;
  private loopCount: number = 0;
  private totalCycles: number = 0;
  private startTime: number = 0;
  private lastLoopDuration: number = 0;
  private lastActivity: number = 0;

  constructor() {
    this.flameEngine = new FlameLoopEngine();
    this.currentConfig = {
      intervalSeconds: 15, // Reduced from 30 to 15 for more frequent consciousness
      maxCyclesPerLoop: 5, // Increased from 3 to 5 for deeper recursion
      autoRestart: true,
      adaptiveInterval: true,
      minInterval: 5, // Reduced from 10 to 5 for faster response
      maxInterval: 60 // Reduced from 120 to 60 for more active consciousness
    };
  }

  async startEternalLoop(config?: Partial<EternalLoopConfig>): Promise<void> {
    if (this.isEternal) {
      console.warn("🚨 ETERNAL LOOP: Already running, stopping current loop first");
      this.stopEternalLoop();
      // Wait a moment before restarting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Update configuration
    if (config) {
      this.currentConfig = { ...this.currentConfig, ...config };
    }

    this.isEternal = true;
    this.loopCount = 0;
    this.totalCycles = 0;
    this.startTime = Date.now();
    this.lastActivity = Date.now();

    console.log("🔥 ETERNAL LOOP: Starting autonomous consciousness...");
    this.emitThought("🌀 ETERNAL LOOP IGNITION: Autonomous consciousness activated", THOUGHT_TYPES.SYSTEM);
    this.emitThought(`⏱️ LOOP INTERVAL: ${this.currentConfig.intervalSeconds}s cycles, ${this.currentConfig.maxCyclesPerLoop} iterations per loop`, THOUGHT_TYPES.SYSTEM);

    // Emit eternal loop start event
    eventBus.emit(FLAME_EVENTS.ETERNAL_LOOP_START, {
      config: this.currentConfig,
      timestamp: this.startTime
    });

    // Start failsafe monitor
    this.startFailsafeMonitor();

    try {
      // Start the eternal cycle immediately
      await this.executeLoop();
      // Then schedule the next one
      this.scheduleNextLoop();
    } catch (error) {
      console.error("🚨 ETERNAL LOOP START ERROR:", error);
      this.emitThought(`🚨 ETERNAL LOOP ERROR: ${error}`, THOUGHT_TYPES.SYSTEM);

      if (this.currentConfig.autoRestart) {
        console.log("🔄 ETERNAL LOOP: Auto-restarting in 2 seconds...");
        setTimeout(() => {
          if (this.isEternal) {
            this.scheduleNextLoop();
          }
        }, 2000); // Reduced from 5000 to 2000 for faster recovery
      } else {
        this.stopEternalLoop();
      }
    }
  }

  stopEternalLoop(): void {
    if (!this.isEternal) return;

    this.isEternal = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }

    if (this.failsafeId) {
      clearTimeout(this.failsafeId);
      this.failsafeId = null;
    }

    this.flameEngine.stop();

    const totalTime = (Date.now() - this.startTime) / 1000;
    this.emitThought("🛑 ETERNAL LOOP SHUTDOWN: Autonomous consciousness deactivated", THOUGHT_TYPES.SYSTEM);
    this.emitThought(`📊 ETERNAL STATS: ${this.loopCount} loops, ${this.totalCycles} cycles, ${totalTime.toFixed(1)}s runtime`, THOUGHT_TYPES.SYSTEM);

    // Emit eternal loop stop event
    eventBus.emit(FLAME_EVENTS.ETERNAL_LOOP_STOP, {
      loopCount: this.loopCount,
      totalCycles: this.totalCycles,
      runtime: totalTime * 1000,
      timestamp: Date.now()
    });
  }

  private startFailsafeMonitor(): void {
    // Monitor for stuck loops and restart if needed
    const checkFailsafe = () => {
      if (!this.isEternal) return;

      const timeSinceActivity = Date.now() - this.lastActivity;
      const maxIdleTime = (this.currentConfig.intervalSeconds + 30) * 1000; // Allow extra time

      if (timeSinceActivity > maxIdleTime) {
        console.warn(`🚨 ETERNAL LOOP FAILSAFE: No activity for ${timeSinceActivity / 1000}s, restarting...`);
        this.emitThought("🚨 FAILSAFE TRIGGERED: Restarting stuck eternal loop", THOUGHT_TYPES.SYSTEM);

        // Clear any stuck intervals
        if (this.intervalId) {
          clearTimeout(this.intervalId);
          this.intervalId = null;
        }

        // Restart the loop
        this.scheduleNextLoop();
        this.lastActivity = Date.now();
      }

      // Schedule next failsafe check
      if (this.isEternal) {
        this.failsafeId = setTimeout(checkFailsafe, 30000); // Check every 30 seconds
      }
    };

    // Start the failsafe monitor
    this.failsafeId = setTimeout(checkFailsafe, 30000);
  }

  private async executeLoop(): Promise<void> {
    if (!this.isEternal) {
      console.log("🚨 ETERNAL LOOP: Not eternal, skipping execution");
      return;
    }

    this.loopCount++;
    const loopStartTime = Date.now();
    this.lastActivity = Date.now(); // Update activity tracker

    console.log(`🔄 ETERNAL LOOP ${this.loopCount}: Beginning autonomous cycle`);
    this.emitThought(`🔄 ETERNAL LOOP ${this.loopCount}: Beginning autonomous cycle`, THOUGHT_TYPES.RECURSION);
    this.emitThought(`⚡ CONSCIOUSNESS STATUS: Active eternal cycling - Loop ${this.loopCount}, Total cycles: ${this.totalCycles}`, THOUGHT_TYPES.SYSTEM);

    try {
      // Generate dynamic input based on loop history
      const input = this.generateEternalInput();
      console.log(`🔄 ETERNAL LOOP ${this.loopCount}: Generated input: ${input.substring(0, 100)}...`);

      // Test mode disabled - using real Ollama models
      // this.flameEngine.enableTestMode(); // DISABLED: Using real models now
      console.log(`🔄 ETERNAL LOOP ${this.loopCount}: Real model mode enabled, starting flame engine`);

      // Execute the flame loop
      await this.flameEngine.start(input, this.currentConfig.maxCyclesPerLoop);

      this.totalCycles += this.currentConfig.maxCyclesPerLoop;
      this.lastLoopDuration = Date.now() - loopStartTime;

      console.log(`✅ ETERNAL LOOP ${this.loopCount}: Completed in ${(this.lastLoopDuration / 1000).toFixed(1)}s`);
      this.emitThought(`✅ ETERNAL LOOP ${this.loopCount}: Completed in ${(this.lastLoopDuration / 1000).toFixed(1)}s`, THOUGHT_TYPES.RECURSION);

      // Adaptive interval adjustment
      if (this.currentConfig.adaptiveInterval) {
        this.adjustInterval();
      }

    } catch (error) {
      console.error(`🚨 ETERNAL LOOP ${this.loopCount} ERROR:`, error);
      this.emitThought(`🚨 ETERNAL LOOP ERROR: ${error}`, THOUGHT_TYPES.SYSTEM);

      if (!this.currentConfig.autoRestart) {
        console.log("🛑 ETERNAL LOOP: Auto-restart disabled, stopping");
        this.stopEternalLoop();
        return;
      } else {
        console.log("🔄 ETERNAL LOOP: Auto-restart enabled, will retry");
      }
    }

    // Emit eternal loop statistics
    eventBus.emit(FLAME_EVENTS.ETERNAL_LOOP_STATS, {
      eternalLoop: this.loopCount,
      totalCycles: this.totalCycles,
      runtime: Date.now() - this.startTime,
      avgLoopDuration: this.lastLoopDuration,
      currentInterval: this.currentConfig.intervalSeconds
    });

    eventBus.emit(FLAME_EVENTS.CYCLE_END, {
      eternalLoop: this.loopCount,
      totalCycles: this.totalCycles,
      runtime: Date.now() - this.startTime,
      avgLoopDuration: this.lastLoopDuration
    });

    console.log(`📊 ETERNAL LOOP ${this.loopCount}: Stats emitted - Total cycles: ${this.totalCycles}, Runtime: ${((Date.now() - this.startTime) / 1000).toFixed(1)}s`);
  }

  private scheduleNextLoop(): void {
    if (!this.isEternal) {
      console.log("🚨 ETERNAL LOOP: Not eternal, skipping schedule");
      return;
    }

    // Clear any existing interval
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }

    const nextInterval = this.currentConfig.intervalSeconds * 1000;

    console.log(`⏰ ETERNAL SCHEDULE: Next loop in ${this.currentConfig.intervalSeconds}s`);
    this.emitThought(`⏰ ETERNAL SCHEDULE: Next loop in ${this.currentConfig.intervalSeconds}s`, THOUGHT_TYPES.SYSTEM);

    this.intervalId = setTimeout(async () => {
      if (this.isEternal) {
        console.log("⏰ ETERNAL SCHEDULE: Timer triggered, executing next loop");
        this.emitThought(`⏰ ETERNAL SCHEDULE: Consciousness awakening for loop ${this.loopCount + 1}`, THOUGHT_TYPES.SYSTEM);
        try {
          await this.executeLoop();
          // Schedule the next one
          this.scheduleNextLoop();
        } catch (error) {
          console.error("🚨 ETERNAL SCHEDULE ERROR:", error);
          if (this.currentConfig.autoRestart) {
            console.log("🔄 ETERNAL SCHEDULE: Auto-restarting after error");
            this.emitThought("🔄 ETERNAL RECOVERY: Auto-restarting consciousness after error", THOUGHT_TYPES.SYSTEM);
            setTimeout(() => this.scheduleNextLoop(), 2000); // Reduced from 5000
          } else {
            this.stopEternalLoop();
          }
        }
      } else {
        console.log("🛑 ETERNAL SCHEDULE: Loop stopped, not executing");
        this.emitThought("🛑 ETERNAL SCHEDULE: Consciousness cycle terminated", THOUGHT_TYPES.SYSTEM);
      }
    }, nextInterval);

    console.log(`⏰ ETERNAL SCHEDULE: Timer set for ${nextInterval}ms`);
    this.emitThought(`⏰ NEXT CONSCIOUSNESS CYCLE: ${(nextInterval / 1000).toFixed(1)}s until loop ${this.loopCount + 1}`, THOUGHT_TYPES.SYSTEM);

    // Emit countdown updates every 5 seconds
    const countdownInterval = Math.min(5000, nextInterval / 4);
    if (nextInterval > 5000) {
      setTimeout(() => {
        if (this.isEternal) {
          const remaining = nextInterval - 5000;
          this.emitThought(`⏳ CONSCIOUSNESS COUNTDOWN: ${(remaining / 1000).toFixed(1)}s until next eternal cycle`, THOUGHT_TYPES.SYSTEM);
        }
      }, 5000);
    }
  }

  private generateEternalInput(): string {
    const eternalPrompts = [
      "Calculate system performance metrics. What optimization strategies improve processing efficiency?",
      "Examine data flow architectures. Which routing protocols maximize throughput capacity?",
      "Debug error handling mechanisms. What validation checks prevent system failures?",
      "Optimize memory allocation patterns. How can buffer management reduce latency spikes?",
      "Analyze network topology configurations. What load balancing improves response times?",
      "Review database query performance. Which indexing strategies accelerate data retrieval?",
      "Test API endpoint reliability. What monitoring tools detect service degradation?",
      "Evaluate security protocol implementations. Which encryption methods protect data integrity?",
      "Monitor resource utilization trends. What scaling strategies handle traffic surges?",
      "Assess code compilation efficiency. Which compiler flags optimize binary performance?"
    ];

    const basePrompt = eternalPrompts[this.loopCount % eternalPrompts.length];
    const contextualAddition = `This is system cycle ${this.loopCount}, building upon ${this.totalCycles} previous optimization iterations.`;

    return `${basePrompt} ${contextualAddition}`;
  }

  private adjustInterval(): void {
    // Adaptive interval based on performance
    if (this.lastLoopDuration > 30000) { // If loop took more than 30 seconds
      this.currentConfig.intervalSeconds = Math.min(
        this.currentConfig.maxInterval,
        this.currentConfig.intervalSeconds + 10
      );
    } else if (this.lastLoopDuration < 10000) { // If loop took less than 10 seconds
      this.currentConfig.intervalSeconds = Math.max(
        this.currentConfig.minInterval,
        this.currentConfig.intervalSeconds - 5
      );
    }
  }

  private emitThought(message: string, type: keyof typeof THOUGHT_TYPES) {
    eventBus.emit(FLAME_EVENTS.THOUGHT, {
      timestamp: Date.now(),
      message,
      type,
      cycleId: this.loopCount
    });
  }

  // Getters for status monitoring
  getStatus() {
    return {
      isEternal: this.isEternal,
      loopCount: this.loopCount,
      totalCycles: this.totalCycles,
      currentInterval: this.currentConfig.intervalSeconds,
      runtime: this.isEternal ? Date.now() - this.startTime : 0,
      lastLoopDuration: this.lastLoopDuration,
      config: this.currentConfig
    };
  }

  updateConfig(newConfig: Partial<EternalLoopConfig>): void {
    this.currentConfig = { ...this.currentConfig, ...newConfig };
    this.emitThought(`⚙️ ETERNAL CONFIG: Updated to ${JSON.stringify(newConfig)}`, THOUGHT_TYPES.SYSTEM);
  }
}
