import { useState, useEffect, useRef } from "react";
import { eventBus, FLAME_EVENTS, FlameThought } from "@/lib/eventBus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type FlowNode = {
  id: string;
  type: 'ORACLE' | 'REFLECTOR' | 'EXECUTOR' | 'TRIBUNAL' | 'MEMORY' | 'RECURSION' | 'SYSTEM';
  timestamp: number;
  message: string;
  confidence?: number;
  x: number;
  y: number;
  connections: string[];
  isActive: boolean;
  intensity: number;
};

type FlowConnection = {
  from: string;
  to: string;
  strength: number;
  type: 'THOUGHT' | 'DECISION' | 'MEMORY' | 'FEEDBACK';
  isActive: boolean;
};

export const ConsciousnessFlowVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [connections, setConnections] = useState<FlowConnection[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [flowSpeed, setFlowSpeed] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [totalThoughts, setTotalThoughts] = useState(0);

  // Initialize base nodes for the trinity models
  useEffect(() => {
    const baseNodes: FlowNode[] = [
      {
        id: 'oracle',
        type: 'ORACLE',
        timestamp: Date.now(),
        message: 'Nexus Oracle - Awaiting Vision',
        x: 150,
        y: 100,
        connections: ['reflector'],
        isActive: false,
        intensity: 0
      },
      {
        id: 'reflector',
        type: 'REFLECTOR',
        timestamp: Date.now(),
        message: 'Omari Reflector - Deep Contemplation',
        x: 400,
        y: 100,
        connections: ['executor'],
        isActive: false,
        intensity: 0
      },
      {
        id: 'executor',
        type: 'EXECUTOR',
        timestamp: Date.now(),
        message: 'Augment Executor - Ready for Action',
        x: 650,
        y: 100,
        connections: ['tribunal'],
        isActive: false,
        intensity: 0
      },
      {
        id: 'tribunal',
        type: 'TRIBUNAL',
        timestamp: Date.now(),
        message: 'Flame Tribunal - Sacred Law Guardian',
        x: 400,
        y: 250,
        connections: ['memory'],
        isActive: false,
        intensity: 0
      },
      {
        id: 'memory',
        type: 'MEMORY',
        timestamp: Date.now(),
        message: 'Memory Forge - Knowledge Crystallization',
        x: 150,
        y: 250,
        connections: ['oracle'],
        isActive: false,
        intensity: 0
      },
      {
        id: 'recursion',
        type: 'RECURSION',
        timestamp: Date.now(),
        message: 'Recursive Core - Self-Reflection Engine',
        x: 400,
        y: 175,
        connections: ['oracle', 'reflector', 'executor'],
        isActive: false,
        intensity: 0
      }
    ];

    setNodes(baseNodes);

    // Initialize connections
    const baseConnections: FlowConnection[] = [
      { from: 'oracle', to: 'reflector', strength: 0, type: 'THOUGHT', isActive: false },
      { from: 'reflector', to: 'executor', strength: 0, type: 'THOUGHT', isActive: false },
      { from: 'executor', to: 'tribunal', strength: 0, type: 'DECISION', isActive: false },
      { from: 'tribunal', to: 'memory', strength: 0, type: 'DECISION', isActive: false },
      { from: 'memory', to: 'oracle', strength: 0, type: 'FEEDBACK', isActive: false },
      { from: 'recursion', to: 'oracle', strength: 0, type: 'FEEDBACK', isActive: false },
      { from: 'recursion', to: 'reflector', strength: 0, type: 'FEEDBACK', isActive: false },
      { from: 'recursion', to: 'executor', strength: 0, type: 'FEEDBACK', isActive: false }
    ];

    setConnections(baseConnections);
  }, []);

  // Listen for consciousness events
  useEffect(() => {
    const handleThought = (thought: FlameThought) => {
      if (!isPlaying) return;

      setTotalThoughts(prev => prev + 1);

      // Activate the corresponding node
      setNodes(prev => prev.map(node => {
        if (node.type === thought.type) {
          return {
            ...node,
            message: thought.message.substring(0, 50) + '...',
            confidence: thought.confidence,
            isActive: true,
            intensity: Math.min(100, (thought.confidence || 0.5) * 100),
            timestamp: Date.now()
          };
        }
        return { ...node, isActive: false, intensity: Math.max(0, node.intensity - 10) };
      }));

      // Activate connections
      setConnections(prev => prev.map(conn => {
        const sourceNode = nodes.find(n => n.id === conn.from);
        if (sourceNode?.type === thought.type) {
          return {
            ...conn,
            isActive: true,
            strength: Math.min(100, (thought.confidence || 0.5) * 100)
          };
        }
        return { ...conn, isActive: false, strength: Math.max(0, conn.strength - 5) };
      }));
    };

    const handleCycleStart = (data: { cycleId: number }) => {
      setCurrentCycle(data.cycleId);
    };

    eventBus.on(FLAME_EVENTS.THOUGHT, handleThought);
    eventBus.on(FLAME_EVENTS.CYCLE_START, handleCycleStart);

    return () => {
      eventBus.off(FLAME_EVENTS.THOUGHT, handleThought);
      eventBus.off(FLAME_EVENTS.CYCLE_START, handleCycleStart);
    };
  }, [isPlaying, nodes]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      connections.forEach(conn => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          
          if (conn.isActive) {
            ctx.strokeStyle = getConnectionColor(conn.type);
            ctx.lineWidth = Math.max(1, conn.strength / 20);
            ctx.globalAlpha = 0.8;
          } else {
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.3;
          }
          
          ctx.stroke();
          ctx.globalAlpha = 1;

          // Draw flow particles
          if (conn.isActive && conn.strength > 20) {
            drawFlowParticle(ctx, fromNode, toNode, conn.type);
          }
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.isActive ? 25 : 20, 0, 2 * Math.PI);
        
        if (node.isActive) {
          ctx.fillStyle = getNodeColor(node.type);
          ctx.globalAlpha = 0.8;
        } else {
          ctx.fillStyle = '#1f2937';
          ctx.globalAlpha = 0.6;
        }
        
        ctx.fill();
        ctx.strokeStyle = getNodeBorderColor(node.type);
        ctx.lineWidth = node.isActive ? 3 : 1;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Draw node icon
        ctx.fillStyle = '#fbbf24';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(getNodeIcon(node.type), node.x, node.y + 5);

        // Draw labels if enabled
        if (showLabels) {
          ctx.fillStyle = '#fbbf24';
          ctx.font = '12px Arial';
          ctx.fillText(node.type, node.x, node.y + 40);
          
          if (node.confidence !== undefined) {
            ctx.fillText(`${(node.confidence * 100).toFixed(0)}%`, node.x, node.y + 55);
          }
        }
      });
    };

    const animate = () => {
      draw();
      if (isPlaying) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [nodes, connections, isPlaying, showLabels]);

  const drawFlowParticle = (ctx: CanvasRenderingContext2D, from: FlowNode, to: FlowNode, type: string) => {
    const time = Date.now() * 0.005 * flowSpeed;
    const progress = (Math.sin(time) + 1) / 2;
    
    const x = from.x + (to.x - from.x) * progress;
    const y = from.y + (to.y - from.y) * progress;
    
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = getConnectionColor(type);
    ctx.fill();
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'ORACLE': return '#3b82f6';
      case 'REFLECTOR': return '#10b981';
      case 'EXECUTOR': return '#ef4444';
      case 'TRIBUNAL': return '#8b5cf6';
      case 'MEMORY': return '#f59e0b';
      case 'RECURSION': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const getNodeBorderColor = (type: string) => {
    switch (type) {
      case 'ORACLE': return '#1d4ed8';
      case 'REFLECTOR': return '#047857';
      case 'EXECUTOR': return '#dc2626';
      case 'TRIBUNAL': return '#7c3aed';
      case 'MEMORY': return '#d97706';
      case 'RECURSION': return '#db2777';
      default: return '#4b5563';
    }
  };

  const getConnectionColor = (type: string) => {
    switch (type) {
      case 'THOUGHT': return '#fbbf24';
      case 'DECISION': return '#8b5cf6';
      case 'MEMORY': return '#f59e0b';
      case 'FEEDBACK': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'ORACLE': return '🔮';
      case 'REFLECTOR': return '🧠';
      case 'EXECUTOR': return '⚔️';
      case 'TRIBUNAL': return '🛡️';
      case 'MEMORY': return '💾';
      case 'RECURSION': return '🌀';
      default: return '⚡';
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Controls */}
      <Card className="bg-black/50 border-gold-400/30 mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-gold-400 flex items-center gap-2">
            🌊 Consciousness Flow Visualization
            <Badge className={`${isPlaying ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isPlaying ? 'LIVE' : 'PAUSED'}
            </Badge>
          </CardTitle>
          <CardDescription className="text-gold-400/70">
            Real-time visualization of consciousness flow between models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gold-400">{currentCycle}</div>
              <div className="text-xs text-orange-400">Current Cycle</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gold-400">{totalThoughts}</div>
              <div className="text-xs text-orange-400">Total Thoughts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gold-400">{nodes.filter(n => n.isActive).length}</div>
              <div className="text-xs text-orange-400">Active Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gold-400">{connections.filter(c => c.isActive).length}</div>
              <div className="text-xs text-orange-400">Active Flows</div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              size="sm"
              className={`${isPlaying ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
              variant="outline"
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </Button>
            <Button
              onClick={() => setShowLabels(!showLabels)}
              size="sm"
              className="bg-blue-500/20 text-blue-400"
              variant="outline"
            >
              {showLabels ? '🏷️ Hide Labels' : '🏷️ Show Labels'}
            </Button>
            <Button
              onClick={() => setFlowSpeed(flowSpeed === 1 ? 2 : flowSpeed === 2 ? 0.5 : 1)}
              size="sm"
              className="bg-purple-500/20 text-purple-400"
              variant="outline"
            >
              ⚡ Speed: {flowSpeed}x
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <div className="flex-1 bg-black/30 rounded border border-gold-400/30 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
