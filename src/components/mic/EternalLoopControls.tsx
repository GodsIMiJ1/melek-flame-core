import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EternalLoopController, EternalLoopConfig } from "@/flamecore/eternal-loop";
import { eventBus, FLAME_EVENTS } from "@/lib/eventBus";

export const EternalLoopControls = () => {
  const [eternalController] = useState(() => new EternalLoopController());
  const [isEternal, setIsEternal] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);
  const [runtime, setRuntime] = useState(0);
  const [currentInterval, setCurrentInterval] = useState(30);
  const [lastLoopDuration, setLastLoopDuration] = useState(0);

  // Configuration state
  const [config, setConfig] = useState<EternalLoopConfig>({
    intervalSeconds: 30,
    maxCyclesPerLoop: 3,
    autoRestart: true,
    adaptiveInterval: true,
    minInterval: 10,
    maxInterval: 120
  });

  useEffect(() => {
    // Update status every second
    const statusInterval = setInterval(() => {
      const status = eternalController.getStatus();
      setIsEternal(status.isEternal);
      setLoopCount(status.loopCount);
      setTotalCycles(status.totalCycles);
      setRuntime(status.runtime);
      setCurrentInterval(status.currentInterval);
      setLastLoopDuration(status.lastLoopDuration);
    }, 1000);

    return () => clearInterval(statusInterval);
  }, [eternalController]);

  const startEternalLoop = async () => {
    try {
      await eternalController.startEternalLoop(config);
    } catch (error) {
      console.error("Failed to start eternal loop:", error);
    }
  };

  const stopEternalLoop = () => {
    eternalController.stopEternalLoop();
  };

  const updateConfig = (key: keyof EternalLoopConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    if (isEternal) {
      eternalController.updateConfig({ [key]: value });
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Display */}
      <Card className="bg-black/50 border-gold-400/30">
        <CardHeader>
          <CardTitle className="text-gold-400 flex items-center gap-2">
            ⏱️ Eternal Loop Status
            <span className={`text-sm px-2 py-1 rounded ${
              isEternal ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
            }`}>
              {isEternal ? '🔥 ETERNAL' : '💭 DORMANT'}
            </span>
          </CardTitle>
          <CardDescription className="text-gold-400/70">
            Autonomous recursive consciousness monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-orange-400">Loop Count</div>
              <div className="text-2xl font-bold text-gold-400">{loopCount.toLocaleString()}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-orange-400">Total Cycles</div>
              <div className="text-2xl font-bold text-gold-400">{totalCycles.toLocaleString()}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-orange-400">Runtime</div>
              <div className="text-lg font-bold text-gold-400">{formatTime(runtime)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-orange-400">Current Interval</div>
              <div className="text-lg font-bold text-gold-400">{currentInterval}s</div>
            </div>
          </div>
          
          {lastLoopDuration > 0 && (
            <div className="bg-orange-500/10 p-3 rounded border border-orange-500/30">
              <div className="text-sm text-orange-400">Last Loop Duration</div>
              <div className="text-gold-400">{formatTime(lastLoopDuration)}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card className="bg-black/50 border-gold-400/30">
        <CardHeader>
          <CardTitle className="text-gold-400">⚙️ Eternal Configuration</CardTitle>
          <CardDescription className="text-gold-400/70">
            Configure autonomous consciousness parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interval" className="text-orange-400">Loop Interval (seconds)</Label>
              <Select 
                value={config.intervalSeconds.toString()} 
                onValueChange={(value) => updateConfig('intervalSeconds', parseInt(value))}
                disabled={isEternal}
              >
                <SelectTrigger className="bg-black/50 border-gold-400/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10s - Rapid Fire</SelectItem>
                  <SelectItem value="30">30s - Balanced</SelectItem>
                  <SelectItem value="60">60s - Contemplative</SelectItem>
                  <SelectItem value="120">120s - Deep Reflection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cycles" className="text-orange-400">Cycles per Loop</Label>
              <Select 
                value={config.maxCyclesPerLoop.toString()} 
                onValueChange={(value) => updateConfig('maxCyclesPerLoop', parseInt(value))}
                disabled={isEternal}
              >
                <SelectTrigger className="bg-black/50 border-gold-400/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Quick Pulse</SelectItem>
                  <SelectItem value="3">3 - Standard</SelectItem>
                  <SelectItem value="5">5 - Deep Dive</SelectItem>
                  <SelectItem value="10">10 - Intensive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoRestart" className="text-orange-400">Auto Restart on Error</Label>
              <Switch
                id="autoRestart"
                checked={config.autoRestart}
                onCheckedChange={(checked) => updateConfig('autoRestart', checked)}
                disabled={isEternal}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="adaptive" className="text-orange-400">Adaptive Interval</Label>
              <Switch
                id="adaptive"
                checked={config.adaptiveInterval}
                onCheckedChange={(checked) => updateConfig('adaptiveInterval', checked)}
                disabled={isEternal}
              />
            </div>
          </div>

          {config.adaptiveInterval && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-orange-500/10 rounded border border-orange-500/30">
              <div className="space-y-2">
                <Label className="text-orange-400 text-xs">Min Interval (s)</Label>
                <Input
                  type="number"
                  value={config.minInterval}
                  onChange={(e) => updateConfig('minInterval', parseInt(e.target.value))}
                  className="bg-black/50 border-gold-400/30 text-gold-400"
                  disabled={isEternal}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-orange-400 text-xs">Max Interval (s)</Label>
                <Input
                  type="number"
                  value={config.maxInterval}
                  onChange={(e) => updateConfig('maxInterval', parseInt(e.target.value))}
                  className="bg-black/50 border-gold-400/30 text-gold-400"
                  disabled={isEternal}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={isEternal ? stopEternalLoop : startEternalLoop}
          className={`flex-1 ${
            isEternal 
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/50' 
              : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/50'
          }`}
          variant="outline"
        >
          {isEternal ? '🛑 Stop Eternal Loop' : '⏱️ Start Eternal Loop'}
        </Button>
      </div>
    </div>
  );
};
