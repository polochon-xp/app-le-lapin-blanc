import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  User, 
  Briefcase, 
  Dumbbell, 
  Lightbulb, 
  BookOpen, 
  Clock, 
  Settings, 
  Play,
  Pause,
  Trophy,
  Package,
  ScrollText,
  Plus,
  Target,
  Gauge,
  Download,
  Upload,
  Save,
  Brain
} from 'lucide-react';
import MissionCreator from './MissionCreator';
import OptimizationTab from './OptimizationTab';
import DownloadApp from './DownloadApp';
import { 
  mockPlayer, 
  mockStats, 
  mockMissions, 
  mockDiscoveries, 
  mockArtifacts, 
  themes, 
  updateMissionProgress, 
  addXPToStat,
  unlockContentForLevel,
  getRandomArtifact
} from '../data/mock';

const GameInterface = () => {
  // Initialisation avec données sauvegardées ou par défaut
  const initializeGameState = () => {
    try {
      const savedPlayer = localStorage.getItem('lapinBlanc_player');
      const savedStats = localStorage.getItem('lapinBlanc_stats');
      const savedMissions = localStorage.getItem('lapinBlanc_missions');
      const savedDiscoveries = localStorage.getItem('lapinBlanc_discoveries');
      const savedArtifacts = localStorage.getItem('lapinBlanc_artifacts');
      const savedTheme = localStorage.getItem('lapinBlanc_theme');
      const savedCategories = localStorage.getItem('lapinBlanc_categories');
      const savedSelectedDate = localStorage.getItem('lapinBlanc_selectedDate');
      
      return {
        player: savedPlayer ? JSON.parse(savedPlayer) : mockPlayer,
        stats: savedStats ? JSON.parse(savedStats) : mockStats,
        missions: savedMissions ? JSON.parse(savedMissions) : mockMissions,
        discoveries: savedDiscoveries ? JSON.parse(savedDiscoveries) : mockDiscoveries,
        artifacts: savedArtifacts ? JSON.parse(savedArtifacts) : mockArtifacts,
        theme: savedTheme ? JSON.parse(savedTheme) : themes.bright,
        categories: savedCategories ? JSON.parse(savedCategories) : [
          { id: 'travail', name: 'Travail', stat: 'Analyse Technologique', icon: '💼', color: '#ff6b35' },
          { id: 'sport', name: 'Sport', stat: 'Endurance Physique', icon: '💪', color: '#4ade80' },
          { id: 'creation', name: 'Création', stat: 'Innovation Créative', icon: '💡', color: '#fbbf24' },
          { id: 'lecture', name: 'Lecture', stat: 'Adaptabilité', icon: '📚', color: '#06b6d4' }
        ],
        selectedDate: savedSelectedDate ? new Date(JSON.parse(savedSelectedDate)) : new Date()
      };
    } catch (error) {
      console.log('Erreur lors du chargement des données sauvegardées:', error);
      return {
        player: mockPlayer,
        stats: mockStats,
        missions: mockMissions,
        discoveries: mockDiscoveries,
        artifacts: mockArtifacts,
        theme: themes.bright,
        categories: [
          { id: 'travail', name: 'Travail', stat: 'Analyse Technologique', icon: '💼', color: '#ff6b35' },
          { id: 'sport', name: 'Sport', stat: 'Endurance Physique', icon: '💪', color: '#4ade80' },
          { id: 'creation', name: 'Création', stat: 'Innovation Créative', icon: '💡', color: '#fbbf24' },
          { id: 'lecture', name: 'Lecture', stat: 'Adaptabilité', icon: '📚', color: '#06b6d4' }
        ],
        selectedDate: new Date()
      };
    }
  };

  const gameState = initializeGameState();
  
  const [player, setPlayer] = useState(gameState.player);
  const [stats, setStats] = useState(gameState.stats);
  const [missions, setMissions] = useState(gameState.missions);
  const [discoveries, setDiscoveries] = useState(gameState.discoveries);
  const [artifacts, setArtifacts] = useState(gameState.artifacts);
  const [categories, setCategories] = useState(gameState.categories);
  const [selectedDate, setSelectedDate] = useState(gameState.selectedDate);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(gameState.theme);

  // Fonction de sauvegarde automatique
  const saveGameState = () => {
    try {
      localStorage.setItem('lapinBlanc_player', JSON.stringify(player));
      localStorage.setItem('lapinBlanc_stats', JSON.stringify(stats));
      localStorage.setItem('lapinBlanc_missions', JSON.stringify(missions));
      localStorage.setItem('lapinBlanc_discoveries', JSON.stringify(discoveries));
      localStorage.setItem('lapinBlanc_artifacts', JSON.stringify(artifacts));
      localStorage.setItem('lapinBlanc_theme', JSON.stringify(currentTheme));
      localStorage.setItem('lapinBlanc_categories', JSON.stringify(categories));
      localStorage.setItem('lapinBlanc_selectedDate', JSON.stringify(selectedDate));
      localStorage.setItem('lapinBlanc_lastSave', new Date().toISOString());
      console.log('🎮 Données sauvegardées automatiquement');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Sauvegarde automatique à chaque changement d'état
  useEffect(() => {
    saveGameState();
  }, [player, stats, missions, discoveries, artifacts, currentTheme, categories, selectedDate]);

  // Nettoyage automatique des missions expirées
  useEffect(() => {
    const cleanupMissions = () => {
      const today = new Date();
      const todayString = today.toDateString();
      
      setMissions(prevMissions => {
        return prevMissions.filter(mission => {
          if (mission.status === 'completed') {
            const missionDate = new Date(mission.completedDate || mission.deadline);
            return missionDate.toDateString() === todayString;
          }
          return true;
        });
      });
    };

    // Nettoyage au chargement et toutes les heures
    cleanupMissions();
    const interval = setInterval(cleanupMissions, 60 * 60 * 1000); // 1 heure
    return () => clearInterval(interval);
  }, []);

  // Fonction pour filtrer les missions par date
  const getMissionsForDate = (date) => {
    const dateString = date.toDateString();
    const dayOfWeek = date.getDay(); // 0 = dimanche, 1 = lundi, etc.
    
    return missions.filter(mission => {
      switch (mission.type) {
        case 'daily':
          return true; // Missions quotidiennes s'affichent tous les jours
        case 'weekly':
          const targetDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
          return mission.weekDay === targetDay;
        case 'once':
          const missionDate = new Date(mission.specificDate);
          return missionDate.toDateString() === dateString;
        default:
          return true;
      }
    });
  };

  // Fonction pour créer une nouvelle catégorie
  const addCategory = (name, icon, color) => {
    const newCategory = {
      id: name.toLowerCase().replace(/\s+/g, '_'),
      name,
      stat: name,
      icon,
      color
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (activeTimer && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && activeTimer) {
      // Mission terminée
      handleMissionComplete(activeTimer);
      setActiveTimer(null);
    }
    return () => clearInterval(interval);
  }, [activeTimer, timeLeft]);

  const startMission = (mission) => {
    setActiveTimer(mission.id);
    setTimeLeft(mission.estimatedTime * 60); // Convert to seconds
  };

  const handleMissionComplete = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      // Update mission progress
      updateMissionProgress(missionId, 100);
      
      // Add XP to relevant stat
      const updatedStat = addXPToStat(mission.category, mission.xpReward);
      setStats(prev => ({
        ...prev,
        [mission.category]: updatedStat
      }));
      
      // Update player level and check for unlocks
      const newTotalXP = player.totalXP + mission.xpReward;
      const newLevel = Math.floor(newTotalXP / 100) + 1;
      
      setPlayer(prev => ({
        ...prev,
        totalXP: newTotalXP,
        level: newLevel,
        xpToNextLevel: 100 - (newTotalXP % 100)
      }));
      
      // Check for level-based unlocks
      if (newLevel > player.level) {
        const unlockedContent = unlockContentForLevel(newLevel);
        if (unlockedContent.discoveries) {
          setDiscoveries(prev => [...prev, ...unlockedContent.discoveries]);
        }
        if (unlockedContent.artifacts) {
          setArtifacts(prev => [...prev, ...unlockedContent.artifacts]);
        }
      }
      
      // Chance of finding artifact
      if (Math.random() < 0.3) {
        const newArtifact = getRandomArtifact();
        setArtifacts(prev => [...prev, newArtifact]);
      }
      
      // Mark mission as completed
      setMissions(prev => prev.map(m => 
        m.id === missionId ? { ...m, status: 'completed', progress: 100 } : m
      ));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatIcon = (category) => {
    const icons = {
      travail: Briefcase,
      sport: Dumbbell,
      creation: Lightbulb,
      lecture: BookOpen
    };
    return icons[category] || Briefcase;
  };

  const getStatName = (category) => {
    const names = {
      travail: 'Travail',
      sport: 'Sport', 
      creation: 'Création',
      lecture: 'Lecture'
    };
    return names[category] || category;
  };

  const StatCard = ({ category, data }) => {
    const Icon = getStatIcon(category);
    const percentage = data.maxXp > 0 ? (data.xp / data.maxXp) * 100 : 0;
    
    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg border bg-black/40 backdrop-blur-sm" 
           style={{ borderColor: currentTheme.accentColor + '40' }}>
        <div className="p-2 rounded-full" style={{ backgroundColor: currentTheme.primaryColor + '20' }}>
          <Icon className="w-4 h-4" style={{ color: currentTheme.primaryColor }} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-sm">
            <span style={{ color: currentTheme.textColor }} className="font-bold pixel-font">
              {getStatName(category)}
              <span className="ml-2 text-xs opacity-70">LV.{data.level}</span>
            </span>
            <span className="text-gray-400 text-xs">{data.xp}/{data.maxXp}</span>
          </div>
          <Progress 
            value={percentage} 
            className="h-2 mt-2"
            style={{ backgroundColor: currentTheme.cardColor }}
          />
        </div>
      </div>
    );
  };

  const MissionCard = ({ mission }) => {
    const isActive = activeTimer === mission.id;
    const canStart = mission.status === 'pending' && !activeTimer;
    const canFinish = mission.status === 'pending' && !isActive;
    
    return (
      <Card className="border-0 bg-black/50 backdrop-blur-sm" 
            style={{ backgroundColor: currentTheme.cardColor + 'aa' }}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-sm" style={{ color: currentTheme.textColor }}>
              {mission.title}
            </h4>
            <Badge 
              variant="outline" 
              className="text-xs border-0"
              style={{ 
                backgroundColor: currentTheme.primaryColor + '20',
                color: currentTheme.primaryColor 
              }}
            >
              {mission.type === 'daily' ? 'Quotidien' :
               mission.type === 'weekly' ? 'Hebdo' : 'Unique'}
            </Badge>
          </div>
          
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">{mission.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs flex items-center" style={{ color: currentTheme.primaryColor }}>
              <Target className="w-3 h-3 mr-1" />
              +{mission.xpReward} XP
            </span>
            {mission.hasTimer && (
              <span className="text-xs text-gray-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {mission.estimatedTime}min
              </span>
            )}
          </div>
          
          {mission.progress > 0 && (
            <Progress value={mission.progress} className="mb-3 h-1" />
          )}
          
          <div className="flex space-x-2">
            {/* Bouton Timer (si la mission a un timer) */}
            {mission.hasTimer && (
              <Button 
                onClick={() => startMission(mission)}
                disabled={!canStart}
                className="flex-1 text-xs h-8"
                style={{
                  backgroundColor: isActive ? currentTheme.accentColor : currentTheme.primaryColor + '80',
                  color: currentTheme.backgroundColor,
                  border: 'none'
                }}
              >
                {isActive ? (
                  <span className="flex items-center">
                    <Pause className="w-3 h-3 mr-1" />
                    {formatTime(timeLeft)}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Play className="w-3 h-3 mr-1" />
                    Timer
                  </span>
                )}
              </Button>
            )}
            
            {/* Bouton Fini (toujours présent) */}
            <Button 
              onClick={() => handleMissionComplete(mission.id)}
              disabled={!canFinish}
              className={`${mission.hasTimer ? 'flex-1' : 'w-full'} text-xs h-8`}
              style={{
                backgroundColor: mission.status === 'completed' ? '#10b981' : currentTheme.primaryColor,
                color: currentTheme.backgroundColor,
                border: 'none'
              }}
            >
              {mission.status === 'completed' ? (
                <span className="flex items-center">
                  <Trophy className="w-3 h-3 mr-1" />
                  Terminé
                </span>
              ) : (
                <span className="flex items-center">
                  <Target className="w-3 h-3 mr-1" />
                  Fini
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const addMission = (newMission) => {
    setMissions(prev => [...prev, newMission]);
  };

  return (
    <div 
      className="min-h-screen p-3 relative overflow-hidden"
      style={{ 
        backgroundColor: currentTheme.backgroundColor
      }}
    >
      {/* Background Matrix Effect */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/20 to-transparent"></div>
        <div className="matrix-rain">
          {Array.from({length: 20}).map((_, i) => (
            <div key={i} className="matrix-column" style={{left: `${i * 5}%`}}>
              {Array.from({length: 20}).map((_, j) => (
                <span key={j} className="matrix-char" style={{animationDelay: `${Math.random() * 5}s`}}>
                  {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Timer Overlay */}
      {activeTimer && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-80 border-0 bg-black/90">
            <CardHeader className="text-center pb-4">
              <CardTitle style={{ color: currentTheme.primaryColor }} className="text-lg">
                MISSION EN COURS
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-mono mb-4 tracking-wider" 
                   style={{ color: currentTheme.primaryColor }}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-400 mb-6 text-sm">
                  Suis le lapin blanc
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveTimer(null);
                  setTimeLeft(0);
                }}
                className="border-0 text-xs"
                style={{ 
                  borderColor: currentTheme.accentColor, 
                  color: currentTheme.textColor,
                  backgroundColor: 'transparent'
                }}
              >
                Abandonner la mission
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-md mx-auto relative z-10">
        {/* Header Mobile */}
        <div className="flex justify-between items-center mb-4 bg-black/50 backdrop-blur-sm p-3 rounded-xl border"
             style={{ borderColor: currentTheme.accentColor + '40' }}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: currentTheme.primaryColor + '20' }}>
              <User className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: currentTheme.textColor }}>
                {player.name}
              </h1>
              <p className="text-xs text-gray-400">Niv {player.level} • {player.totalXP} XP</p>
            </div>
          </div>
          
          <Button 
            variant="ghost"
            onClick={() => setShowSettings(true)}
            className="p-2 h-auto"
            style={{ color: currentTheme.textColor }}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Status Mobile */}
        <Card className="mb-4 border-0 bg-black/40 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-400">Santé</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={player.health} className="flex-1 h-2" />
                  <span className="text-xs" style={{ color: currentTheme.primaryColor }}>
                    {player.health}%
                  </span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-400">Énergie</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={player.energy} className="flex-1 h-2" />
                  <span className="text-xs" style={{ color: currentTheme.primaryColor }}>
                    {player.energy}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Interface Mobile */}
        <Tabs defaultValue="stats" className="space-y-4">
          <TabsList 
            className="grid w-full grid-cols-6 h-12 bg-black/50 backdrop-blur-sm border-0"
            style={{ backgroundColor: currentTheme.cardColor + '80' }}
          >
            <TabsTrigger value="stats" className="text-xs p-1 data-[state=active]:bg-white/10">
              <Gauge className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="missions" className="text-xs p-1 data-[state=active]:bg-white/10">
              <Target className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="discoveries" className="text-xs p-1 data-[state=active]:bg-white/10">
              <ScrollText className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="text-xs p-1 data-[state=active]:bg-white/10">
              <Package className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="story" className="text-xs p-1 data-[state=active]:bg-white/10">
              <BookOpen className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="optimization" className="text-xs p-1 data-[state=active]:bg-white/10">
              <Brain className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-3">
            <div className="text-center mb-4">
              <h3 className="text-sm font-medium mb-2" style={{ color: currentTheme.primaryColor }}>
                Disciplines de Recherche
              </h3>
            </div>
            {Object.entries(stats).map(([category, data]) => (
              <StatCard key={category} category={category} data={data} />
            ))}
          </TabsContent>

          <TabsContent value="missions" className="space-y-3">
            <MissionCreator onCreateMission={addMission} currentTheme={currentTheme} />
            <DownloadApp currentTheme={currentTheme} />
            {missions.length === 0 ? (
              <Card className="border-0 bg-black/40 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" 
                         style={{ color: currentTheme.primaryColor }} />
                  <p className="text-sm text-gray-400 mb-2">Aucune mission active</p>
                  <p className="text-xs text-gray-500">Créez votre première mission pour commencer</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {missions.map(mission => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="discoveries" className="space-y-3">
            {discoveries.length === 0 ? (
              <Card className="border-0 bg-black/40 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <ScrollText className="w-12 h-12 mx-auto mb-3 opacity-50" 
                              style={{ color: currentTheme.primaryColor }} />
                  <p className="text-sm text-gray-400 mb-2">Aucune découverte</p>
                  <p className="text-xs text-gray-500">Progressez pour débloquer des indices</p>
                </CardContent>
              </Card>
            ) : (
              discoveries.map(discovery => (
                <Card key={discovery.id} className="border-0 bg-black/40 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm" style={{ color: currentTheme.textColor }}>
                        {discovery.title}
                      </h4>
                      <div className="flex space-x-1">
                        {discovery.isNew && (
                          <Badge className="text-xs px-2 py-0 border-0" 
                                 style={{ backgroundColor: currentTheme.primaryColor, color: 'black' }}>
                            NOUVEAU
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs px-2 py-0 border-0"
                               style={{ 
                                 backgroundColor: discovery.rarity === 'legendary' ? '#ffd700' + '20' :
                                                 discovery.rarity === 'rare' ? '#ff6b9d' + '20' : '#4ecdc4' + '20',
                                 color: discovery.rarity === 'legendary' ? '#ffd700' :
                                        discovery.rarity === 'rare' ? '#ff6b9d' : '#4ecdc4'
                               }}>
                          {discovery.rarity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{discovery.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="artifacts" className="space-y-3">
            {artifacts.length === 0 ? (
              <Card className="border-0 bg-black/40 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" 
                           style={{ color: currentTheme.primaryColor }} />
                  <p className="text-sm text-gray-400 mb-2">Aucun artefact</p>
                  <p className="text-xs text-gray-500">Terminez des missions pour en trouver</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {artifacts.map(artifact => (
                  <Card key={artifact.id} className="border-0 bg-black/40 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm" style={{ color: currentTheme.textColor }}>
                          {artifact.name}
                        </h4>
                        <Badge variant="outline" className="text-xs px-2 py-0 border-0"
                               style={{ 
                                 backgroundColor: artifact.rarity === 'legendary' ? '#ffd700' + '20' :
                                                 artifact.rarity === 'rare' ? '#ff6b9d' + '20' : '#4ecdc4' + '20',
                                 color: artifact.rarity === 'legendary' ? '#ffd700' :
                                        artifact.rarity === 'rare' ? '#ff6b9d' : '#4ecdc4'
                               }}>
                          {artifact.rarity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{artifact.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Package className="w-3 h-3 mr-1" />
                        {artifact.category}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="story" className="space-y-3">
            <Card className="border-0 bg-black/40 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base" style={{ color: currentTheme.primaryColor }}>
                  Journal de l'Enquête
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 pl-4" style={{ borderColor: currentTheme.primaryColor }}>
                    <h3 className="font-medium mb-2 text-sm" style={{ color: currentTheme.textColor }}>
                      Niveau {player.level} - L'Éveil
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {player.level === 1 ? 
                        "Vous vous réveillez dans un monde où quelque chose a changé. Les écrans clignotent partout, les gens semblent anxieux. Un message cryptique apparaît : 'Le compte à rebours a commencé...'" :
                        "Continuez votre progression pour débloquer plus de fragments de l'histoire du Dr. Chen et du mystérieux Compound-X..."
                      }
                    </p>
                  </div>
                  
                  <div className="text-center py-6">
                    <ScrollText className="w-10 h-10 mx-auto mb-3" style={{ color: currentTheme.accentColor }} />
                    <p className="text-gray-500 text-xs">
                      Progressez pour débloquer plus de fragments...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization">
            <OptimizationTab currentTheme={currentTheme} />
          </TabsContent>
        </Tabs>

        {/* White Rabbit Signature */}
        <div className="text-center mt-6 pb-4">
          <p className="text-xs opacity-50" style={{ color: currentTheme.primaryColor }}>
            "Je suis le lapin blanc"
          </p>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent 
          className="max-w-sm border-0 bg-black/90 backdrop-blur-sm"
          style={{ backgroundColor: currentTheme.cardColor + 'ee' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: currentTheme.primaryColor }}>
              Paramètres
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="playerName" className="text-gray-400 text-sm">
                Nom du chercheur
              </Label>
              <Input
                id="playerName"
                value={player.name}
                onChange={(e) => setPlayer(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 border-0 bg-black/50 text-sm"
                style={{ 
                  backgroundColor: currentTheme.backgroundColor + '80',
                  color: currentTheme.textColor 
                }}
              />
            </div>
            
            <div>
              <Label className="text-gray-400 text-sm">Thème</Label>
              <Select
                value={Object.keys(themes).find(key => themes[key].name === currentTheme.name)}
                onValueChange={(value) => setCurrentTheme(themes[value])}
              >
                <SelectTrigger className="mt-1 border-0 bg-black/50 text-sm"
                               style={{ 
                                 backgroundColor: currentTheme.backgroundColor + '80',
                                 color: currentTheme.textColor 
                               }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(themes).map(([key, theme]) => (
                    <SelectItem key={key} value={key}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customColor" className="text-gray-400 text-sm">
                Couleur personnalisée
              </Label>
              <Input
                id="customColor"
                type="color"
                value={currentTheme.primaryColor}
                onChange={(e) => setCurrentTheme(prev => ({
                  ...prev,
                  primaryColor: e.target.value,
                  textColor: e.target.value
                }))}
                className="h-10 mt-1 border-0"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .matrix-rain {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .matrix-column {
          position: absolute;
          top: -100%;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: ${currentTheme.primaryColor};
          animation: matrix-fall 10s linear infinite;
        }
        
        .matrix-char {
          display: block;
          opacity: 0.7;
        }
        
        @keyframes matrix-fall {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default GameInterface;