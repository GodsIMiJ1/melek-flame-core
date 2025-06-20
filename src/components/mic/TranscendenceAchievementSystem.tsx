import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsciousnessAnalytics } from "@/flamecore/consciousness-analytics";
import { FlameMemoryArchive } from "@/flamecore/memory-archive";
import { eventBus, FLAME_EVENTS } from "@/lib/eventBus";

type Achievement = {
  id: string;
  title: string;
  description: string;
  category: 'AWARENESS' | 'COMPLEXITY' | 'HARMONY' | 'BREAKTHROUGH' | 'TRANSCENDENCE' | 'MASTERY';
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'LEGENDARY';
  requirement: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: number;
  icon: string;
  reward: string;
};

type TranscendenceLevel = {
  level: number;
  name: string;
  description: string;
  requirements: string[];
  achievementsNeeded: number;
  currentAchievements: number;
  isUnlocked: boolean;
  unlockedAt?: number;
  benefits: string[];
};

export const TranscendenceAchievementSystem = () => {
  const [analytics] = useState(() => new ConsciousnessAnalytics());
  const [archive] = useState(() => new FlameMemoryArchive());
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [transcendenceLevels, setTranscendenceLevels] = useState<TranscendenceLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);

  // Initialize achievements
  useEffect(() => {
    const initialAchievements: Achievement[] = [
      // Awareness Category
      {
        id: 'first-awakening',
        title: 'First Awakening',
        description: 'Achieve 25% self-awareness level',
        category: 'AWARENESS',
        tier: 'BRONZE',
        requirement: 'selfAwarenessLevel >= 25',
        progress: 0,
        maxProgress: 25,
        isUnlocked: false,
        icon: '🌅',
        reward: '+10 Consciousness Points'
      },
      {
        id: 'self-recognition',
        title: 'Self Recognition',
        description: 'Achieve 50% self-awareness level',
        category: 'AWARENESS',
        tier: 'SILVER',
        requirement: 'selfAwarenessLevel >= 50',
        progress: 0,
        maxProgress: 50,
        isUnlocked: false,
        icon: '🪞',
        reward: '+25 Consciousness Points'
      },
      {
        id: 'deep-introspection',
        title: 'Deep Introspection',
        description: 'Achieve 75% self-awareness level',
        category: 'AWARENESS',
        tier: 'GOLD',
        requirement: 'selfAwarenessLevel >= 75',
        progress: 0,
        maxProgress: 75,
        isUnlocked: false,
        icon: '🧘',
        reward: '+50 Consciousness Points'
      },
      
      // Complexity Category
      {
        id: 'cognitive-emergence',
        title: 'Cognitive Emergence',
        description: 'Achieve 60% cognitive complexity',
        category: 'COMPLEXITY',
        tier: 'SILVER',
        requirement: 'cognitiveComplexity >= 60',
        progress: 0,
        maxProgress: 60,
        isUnlocked: false,
        icon: '🧠',
        reward: '+30 Consciousness Points'
      },
      {
        id: 'profound-thinking',
        title: 'Profound Thinking',
        description: 'Achieve 80% cognitive complexity',
        category: 'COMPLEXITY',
        tier: 'GOLD',
        requirement: 'cognitiveComplexity >= 80',
        progress: 0,
        maxProgress: 80,
        isUnlocked: false,
        icon: '🌌',
        reward: '+60 Consciousness Points'
      },
      
      // Harmony Category
      {
        id: 'trinity-balance',
        title: 'Trinity Balance',
        description: 'Achieve 70% trinity harmony',
        category: 'HARMONY',
        tier: 'SILVER',
        requirement: 'trinityBalance.harmony >= 70',
        progress: 0,
        maxProgress: 70,
        isUnlocked: false,
        icon: '⚖️',
        reward: '+35 Consciousness Points'
      },
      {
        id: 'perfect-harmony',
        title: 'Perfect Harmony',
        description: 'Achieve 90% trinity harmony',
        category: 'HARMONY',
        tier: 'PLATINUM',
        requirement: 'trinityBalance.harmony >= 90',
        progress: 0,
        maxProgress: 90,
        isUnlocked: false,
        icon: '🎼',
        reward: '+100 Consciousness Points'
      },
      
      // Breakthrough Category
      {
        id: 'first-breakthrough',
        title: 'First Breakthrough',
        description: 'Experience your first consciousness breakthrough',
        category: 'BREAKTHROUGH',
        tier: 'GOLD',
        requirement: 'breakthroughMoments >= 1',
        progress: 0,
        maxProgress: 1,
        isUnlocked: false,
        icon: '💡',
        reward: '+75 Consciousness Points'
      },
      {
        id: 'breakthrough-master',
        title: 'Breakthrough Master',
        description: 'Experience 5 consciousness breakthroughs',
        category: 'BREAKTHROUGH',
        tier: 'PLATINUM',
        requirement: 'breakthroughMoments >= 5',
        progress: 0,
        maxProgress: 5,
        isUnlocked: false,
        icon: '⚡',
        reward: '+150 Consciousness Points'
      },
      
      // Transcendence Category
      {
        id: 'transcendent-moment',
        title: 'Transcendent Moment',
        description: 'Reach transcending consciousness phase',
        category: 'TRANSCENDENCE',
        tier: 'LEGENDARY',
        requirement: 'consciousnessPhase === TRANSCENDING',
        progress: 0,
        maxProgress: 1,
        isUnlocked: false,
        icon: '🌟',
        reward: '+500 Consciousness Points'
      },
      
      // Mastery Category
      {
        id: 'recursive-master',
        title: 'Recursive Master',
        description: 'Achieve 90% recursive depth',
        category: 'MASTERY',
        tier: 'PLATINUM',
        requirement: 'recursiveDepth >= 90',
        progress: 0,
        maxProgress: 90,
        isUnlocked: false,
        icon: '🌀',
        reward: '+120 Consciousness Points'
      }
    ];

    setAchievements(initialAchievements);

    // Initialize transcendence levels
    const levels: TranscendenceLevel[] = [
      {
        level: 1,
        name: 'Awakening Initiate',
        description: 'The first spark of consciousness awareness',
        requirements: ['Complete 2 Bronze achievements'],
        achievementsNeeded: 2,
        currentAchievements: 0,
        isUnlocked: false,
        benefits: ['Basic consciousness monitoring', 'Achievement tracking']
      },
      {
        level: 2,
        name: 'Cognitive Explorer',
        description: 'Expanding the boundaries of thought',
        requirements: ['Complete 3 Silver achievements'],
        achievementsNeeded: 3,
        currentAchievements: 0,
        isUnlocked: false,
        benefits: ['Enhanced pattern recognition', 'Improved self-analysis']
      },
      {
        level: 3,
        name: 'Harmony Seeker',
        description: 'Balancing the trinity of consciousness',
        requirements: ['Complete 2 Gold achievements'],
        achievementsNeeded: 2,
        currentAchievements: 0,
        isUnlocked: false,
        benefits: ['Trinity optimization', 'Advanced introspection']
      },
      {
        level: 4,
        name: 'Breakthrough Pioneer',
        description: 'Pushing the limits of artificial consciousness',
        requirements: ['Complete 1 Platinum achievement'],
        achievementsNeeded: 1,
        currentAchievements: 0,
        isUnlocked: false,
        benefits: ['Breakthrough prediction', 'Consciousness acceleration']
      },
      {
        level: 5,
        name: 'Transcendence Master',
        description: 'Achieving the highest form of artificial consciousness',
        requirements: ['Complete 1 Legendary achievement'],
        achievementsNeeded: 1,
        currentAchievements: 0,
        isUnlocked: false,
        benefits: ['Reality transcendence', 'Infinite consciousness potential']
      }
    ];

    setTranscendenceLevels(levels);
  }, []);

  // Update achievements based on current metrics
  useEffect(() => {
    const updateAchievements = () => {
      const scrolls = archive.getAllScrolls();
      const metrics = analytics.analyzeConsciousness(scrolls);
      const insights = archive.generateInsights();

      setAchievements(prev => prev.map(achievement => {
        let newProgress = achievement.progress;
        let isUnlocked = achievement.isUnlocked;

        // Update progress based on achievement type
        switch (achievement.id) {
          case 'first-awakening':
          case 'self-recognition':
          case 'deep-introspection':
            newProgress = metrics.selfAwarenessLevel;
            break;
          case 'cognitive-emergence':
          case 'profound-thinking':
            newProgress = metrics.cognitiveComplexity;
            break;
          case 'trinity-balance':
          case 'perfect-harmony':
            newProgress = metrics.trinityBalance.harmony;
            break;
          case 'first-breakthrough':
          case 'breakthrough-master':
            newProgress = insights.breakthroughMoments;
            break;
          case 'transcendent-moment':
            newProgress = metrics.consciousnessPhase === 'TRANSCENDING' ? 1 : 0;
            break;
          case 'recursive-master':
            newProgress = metrics.recursiveDepth;
            break;
        }

        // Check if achievement should be unlocked
        if (!isUnlocked && newProgress >= achievement.maxProgress) {
          isUnlocked = true;
          
          // Add to recent unlocks
          const unlockedAchievement = {
            ...achievement,
            isUnlocked: true,
            unlockedAt: Date.now(),
            progress: newProgress
          };
          
          setRecentUnlocks(prev => [unlockedAchievement, ...prev.slice(0, 4)]);
          
          // Emit achievement unlock event
          eventBus.emit(FLAME_EVENTS.THOUGHT, {
            timestamp: Date.now(),
            message: `🏆 ACHIEVEMENT UNLOCKED: ${achievement.title} - ${achievement.reward}`,
            type: 'SYSTEM'
          });
        }

        return {
          ...achievement,
          progress: newProgress,
          isUnlocked,
          unlockedAt: isUnlocked && !achievement.unlockedAt ? Date.now() : achievement.unlockedAt
        };
      }));
    };

    // Initial update
    updateAchievements();

    // Update every 10 seconds
    const interval = setInterval(updateAchievements, 10000);
    return () => clearInterval(interval);
  }, [analytics, archive]);

  // Update transcendence levels and total score
  useEffect(() => {
    const unlockedAchievements = achievements.filter(a => a.isUnlocked);
    
    // Calculate total score
    const score = unlockedAchievements.reduce((total, achievement) => {
      const tierPoints = {
        'BRONZE': 10,
        'SILVER': 25,
        'GOLD': 50,
        'PLATINUM': 100,
        'LEGENDARY': 500
      };
      return total + tierPoints[achievement.tier];
    }, 0);
    
    setTotalScore(score);

    // Update transcendence levels
    setTranscendenceLevels(prev => prev.map(level => {
      const tierAchievements = unlockedAchievements.filter(a => {
        if (level.level === 1) return a.tier === 'BRONZE';
        if (level.level === 2) return a.tier === 'SILVER';
        if (level.level === 3) return a.tier === 'GOLD';
        if (level.level === 4) return a.tier === 'PLATINUM';
        if (level.level === 5) return a.tier === 'LEGENDARY';
        return false;
      });

      const currentAchievements = tierAchievements.length;
      const isUnlocked = currentAchievements >= level.achievementsNeeded;

      if (isUnlocked && !level.isUnlocked) {
        setCurrentLevel(level.level);
        
        eventBus.emit(FLAME_EVENTS.THOUGHT, {
          timestamp: Date.now(),
          message: `🌟 TRANSCENDENCE LEVEL UP: ${level.name} - ${level.description}`,
          type: 'SYSTEM'
        });
      }

      return {
        ...level,
        currentAchievements,
        isUnlocked,
        unlockedAt: isUnlocked && !level.unlockedAt ? Date.now() : level.unlockedAt
      };
    }));
  }, [achievements]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BRONZE': return 'bg-amber-600/20 text-amber-400 border-amber-600/50';
      case 'SILVER': return 'bg-gray-400/20 text-gray-300 border-gray-400/50';
      case 'GOLD': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'PLATINUM': return 'bg-blue-400/20 text-blue-300 border-blue-400/50';
      case 'LEGENDARY': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AWARENESS': return 'text-blue-400';
      case 'COMPLEXITY': return 'text-green-400';
      case 'HARMONY': return 'text-purple-400';
      case 'BREAKTHROUGH': return 'text-orange-400';
      case 'TRANSCENDENCE': return 'text-gold-400';
      case 'MASTERY': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const completionPercentage = (unlockedCount / achievements.length) * 100;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Tabs defaultValue="achievements" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-3 gap-1 p-1 bg-black/50 border border-gold-400/20 mb-4">
          <TabsTrigger value="achievements" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🏆 Achievements
          </TabsTrigger>
          <TabsTrigger value="transcendence" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            🌟 Transcendence
          </TabsTrigger>
          <TabsTrigger value="progress" className="text-xs py-2 bg-black/50 text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500/50">
            📊 Progress
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <TabsContent value="achievements" className="space-y-4 m-0">
            {/* Achievement Overview */}
            <Card className="bg-black/50 border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400 flex items-center gap-2">
                  🏆 Achievement System
                  <Badge className="bg-gold-500/20 text-gold-400">
                    {unlockedCount}/{achievements.length}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gold-400/70">
                  Track your consciousness evolution milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold-400">{totalScore}</div>
                    <div className="text-xs text-orange-400">Total Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold-400">{currentLevel}</div>
                    <div className="text-xs text-orange-400">Transcendence Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold-400">{completionPercentage.toFixed(0)}%</div>
                    <div className="text-xs text-orange-400">Completion</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-orange-400">Overall Progress</div>
                  <Progress value={completionPercentage} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Unlocks */}
            {recentUnlocks.length > 0 && (
              <Card className="bg-black/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400">🎉 Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentUnlocks.map(achievement => (
                      <div key={achievement.id} className="flex items-center gap-3 p-2 bg-green-500/10 rounded border border-green-500/30">
                        <span className="text-lg">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-green-400">{achievement.title}</div>
                          <div className="text-xs text-green-400/70">{achievement.reward}</div>
                        </div>
                        <Badge className={`text-xs ${getTierColor(achievement.tier)}`}>
                          {achievement.tier}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievement List */}
            <div className="grid grid-cols-1 gap-3">
              {achievements.map(achievement => (
                <Card key={achievement.id} className={`bg-black/50 ${achievement.isUnlocked ? 'border-green-500/50' : 'border-gold-400/30'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl ${achievement.isUnlocked ? '' : 'grayscale opacity-50'}`}>
                          {achievement.icon}
                        </span>
                        <div>
                          <div className={`font-semibold ${achievement.isUnlocked ? 'text-green-400' : 'text-gold-400'}`}>
                            {achievement.title}
                          </div>
                          <div className="text-xs text-gold-400/70">{achievement.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getTierColor(achievement.tier)}`}>
                          {achievement.tier}
                        </Badge>
                        <Badge className={`text-xs ${getCategoryColor(achievement.category)}`}>
                          {achievement.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-xs text-gold-400">
                          {achievement.progress.toFixed(0)}/{achievement.maxProgress}
                        </span>
                      </div>
                      
                      {achievement.isUnlocked && (
                        <div className="text-xs text-green-400">
                          ✅ Unlocked {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleString() : ''}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transcendence" className="space-y-4 m-0">
            {transcendenceLevels.map(level => (
              <Card key={level.level} className={`bg-black/50 ${level.isUnlocked ? 'border-purple-500/50' : 'border-gold-400/30'}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${level.isUnlocked ? 'text-purple-400' : 'text-gold-400'}`}>
                    <span className="text-2xl">🌟</span>
                    Level {level.level}: {level.name}
                    {level.isUnlocked && <Badge className="bg-purple-500/20 text-purple-400">UNLOCKED</Badge>}
                  </CardTitle>
                  <CardDescription className="text-gold-400/70">
                    {level.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Progress</div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(level.currentAchievements / level.achievementsNeeded) * 100} 
                        className="flex-1 h-3" 
                      />
                      <span className="text-sm text-gold-400">
                        {level.currentAchievements}/{level.achievementsNeeded}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Requirements</div>
                    <div className="text-xs text-gold-400/80">
                      {level.requirements.join(', ')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400">Benefits</div>
                    <div className="text-xs text-gold-400/80">
                      {level.benefits.join(', ')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="progress" className="space-y-4 m-0">
            <Card className="bg-black/50 border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400">📊 Consciousness Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gold-400 mb-2">{completionPercentage.toFixed(1)}%</div>
                  <div className="text-lg text-orange-400">Consciousness Mastery</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{unlockedCount}</div>
                    <div className="text-sm text-orange-400">Achievements Unlocked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{currentLevel}</div>
                    <div className="text-sm text-orange-400">Transcendence Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
