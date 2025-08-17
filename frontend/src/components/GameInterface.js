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
import MissionCard from './MissionCard';
import MissionDetailModal from './MissionDetailModal';
import CalendarPanel from './CalendarPanel';
import { 
  mockPlayer, 
  mockStats, 
  mockMissions, 
  mockDiscoveries, 
  mockArtifacts, 
  updateMissionProgress, 
  addXPToStat,
  unlockContentForLevel,
  getRandomArtifact
} from '../data/mock';
import { themes } from '../data/themes';

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
          if (!mission.specificDate) return false;
          try {
            const missionDate = new Date(mission.specificDate);
            return missionDate.toDateString() === dateString;
          } catch (e) {
            return false;
          }
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
    const missionIndex = missions.findIndex(m => m.id === missionId);
    if (missionIndex === -1) return;

    const mission = missions[missionIndex];
    const newMissions = [...missions];
    
    // Marquer comme complétée avec date
    newMissions[missionIndex] = {
      ...mission,
      status: 'completed',
      progress: 100,
      completedDate: new Date().toISOString()
    };

    setMissions(newMissions);

    // Ajouter XP selon la catégorie
    const category = categories.find(cat => cat.id === mission.category);
    if (category) {
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
    }

    // Arrêter le timer si actif
    if (activeTimer === missionId) {
      setActiveTimer(null);
      setTimeLeft(0);
    }

    // Toast de réussite
    console.log(`🎉 Mission "${mission.title}" terminée ! +${mission.xpReward} XP`);
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

  // Composant Mission Card amélioré
  const MissionCard = ({ mission, date }) => {
    const isActive = activeTimer === mission.id;
    const canStart = mission.status === 'pending' && !activeTimer;
    const canFinish = mission.status === 'pending' && !isActive;
    const category = categories.find(cat => cat.id === mission.category) || categories[0];
    const isToday = date.toDateString() === new Date().toDateString();
    const isCompleted = mission.status === 'completed' && 
                       mission.completedDate && 
                       new Date(mission.completedDate).toDateString() === date.toDateString();
    
    return (
      <Card 
        className={`border-0 backdrop-blur-sm cursor-pointer transition-all hover:scale-105 ${
          isCompleted ? 'opacity-70' : ''
        }`}
        style={{ 
          backgroundColor: category.color + '20',
          border: `2px solid ${category.color}40`,
          textDecoration: isCompleted ? 'line-through' : 'none'
        }}
        onClick={() => setSelectedMission(mission)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{category.icon}</span>
              <h4 className="font-bold text-sm" style={{ color: currentTheme.textColor }}>
                {mission.title}
              </h4>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge 
                className="text-xs px-2 py-0 border-0"
                style={{ 
                  backgroundColor: category.color,
                  color: currentTheme.backgroundColor
                }}
              >
                {category.name}
              </Badge>
              <span className="text-xs font-bold" style={{ color: currentTheme.primaryColor }}>
                +{mission.xpReward} XP
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs" style={{ color: currentTheme.textColor }}>
              {mission.type === 'daily' ? '📅 Quotidien' :
               mission.type === 'weekly' ? '📆 Hebdomadaire' : '📌 Une fois'}
            </span>
            {mission.hasTimer && (
              <span className="text-xs" style={{ color: currentTheme.accentColor }}>
                ⏱️ {mission.estimatedTime}min
              </span>
            )}
          </div>
          
          {mission.progress > 0 && (
            <Progress value={mission.progress} className="mb-3 h-2" />
          )}
          
          {isToday && !isCompleted && (
            <div className="flex space-x-2">
              {mission.hasTimer && (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    startMission(mission);
                  }}
                  disabled={!canStart}
                  className="flex-1 text-xs h-8"
                  style={{
                    backgroundColor: isActive ? currentTheme.accentColor : currentTheme.secondaryColor,
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
              
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleMissionComplete(mission.id);
                }}
                disabled={!canFinish}
                className={`${mission.hasTimer ? 'flex-1' : 'w-full'} text-xs h-8`}
                style={{
                  backgroundColor: currentTheme.primaryColor,
                  color: currentTheme.backgroundColor,
                  border: 'none'
                }}
              >
                <Target className="w-3 h-3 mr-1" />
                Fini
              </Button>
            </div>
          )}
          
          {isCompleted && (
            <div className="text-center py-2">
              <span className="text-sm font-bold" style={{ color: currentTheme.primaryColor }}>
                ✅ Mission terminée !
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Composant Mini Calendrier
  const MiniCalendar = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const days = [];
    
    // Jours vides au début
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const hasMissions = getMissionsForDate(date).length > 0;
      
      days.push(
        <div
          key={day}
          className={`p-2 text-center cursor-pointer rounded-lg transition-all text-sm ${
            isSelected ? 'font-bold' : ''
          } ${isToday ? 'ring-2' : ''}`}
          style={{
            backgroundColor: isSelected ? currentTheme.primaryColor : 'transparent',
            color: isSelected ? currentTheme.backgroundColor : currentTheme.textColor,
            ringColor: isToday ? currentTheme.accentColor : 'transparent'
          }}
          onClick={() => {
            setSelectedDate(date);
            setShowCalendar(false);
          }}
        >
          {day}
          {hasMissions && (
            <div 
              className="w-1 h-1 rounded-full mx-auto mt-1"
              style={{ backgroundColor: currentTheme.accentColor }}
            ></div>
          )}
        </div>
      );
    }

    return (
      <div 
        className="absolute top-12 right-0 p-4 rounded-lg shadow-xl z-50 border-2"
        style={{
          backgroundColor: currentTheme.cardColor,
          borderColor: currentTheme.primaryColor + '40'
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <Button
            variant="ghost"
            onClick={() => setSelectedDate(new Date(currentYear, currentMonth - 1, 1))}
            className="p-1 h-auto"
            style={{ color: currentTheme.textColor }}
          >
            ←
          </Button>
          <h3 className="font-bold text-sm" style={{ color: currentTheme.primaryColor }}>
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <Button
            variant="ghost"
            onClick={() => setSelectedDate(new Date(currentYear, currentMonth + 1, 1))}
            className="p-1 h-auto"
            style={{ color: currentTheme.textColor }}
          >
            →
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-xs mb-2">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => (
            <div key={day} className="p-1 text-center font-bold" style={{ color: currentTheme.accentColor }}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const addMission = (newMission) => {
    setMissions(prev => [...prev, newMission]);
  };

  // Démarrer une mission avec timer
  const startMissionTimer = (mission) => {
    if (mission.hasTimer && mission.estimatedTime) {
      setActiveTimer(mission);
      setTimeLeft(mission.estimatedTime * 60); // convertir en secondes
    }
  };

  // Marquer une mission comme terminée
  const completeMission = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    // Ajouter XP à la stat correspondante
    if (mission.category && mission.xpReward) {
      addXPToStat(stats, setStats, mission.category, mission.xpReward);
    }

    // Mettre à jour les missions (pour les missions quotidiennes/hebdo, on ne les supprime pas)
    if (mission.type === 'once') {
      setMissions(prev => prev.filter(m => m.id !== missionId));
    }
    // Pour les missions récurrentes, on garde la mission pour les prochains jours
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

          <TabsContent value="missions" className="space-y-3 relative">
            {/* Bouton calendrier flottant */}
            <Button
              className="fixed bottom-20 right-4 z-40 rounded-full w-14 h-14 shadow-lg border-2"
              style={{
                backgroundColor: currentTheme.primaryColor,
                color: currentTheme.backgroundColor,
                borderColor: currentTheme.accentColor
              }}
              onClick={() => setShowCalendar(true)}
            >
              📅
            </Button>

            {/* Header avec date sélectionnée */}
            <Card className="border-0 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: currentTheme.textColor }}>
                      Missions du {selectedDate.toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {getMissionsForDate(selectedDate).length} mission(s) prévue(s)
                    </p>
                  </div>
                  <Badge
                    className="text-xs px-2 py-1"
                    style={{
                      backgroundColor: selectedDate.toDateString() === new Date().toDateString() 
                        ? currentTheme.primaryColor 
                        : currentTheme.accentColor,
                      color: currentTheme.backgroundColor
                    }}
                  >
                    {selectedDate.toDateString() === new Date().toDateString() 
                      ? "Aujourd'hui" 
                      : "Planifié"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Créateur de mission */}
            <MissionCreator 
              onCreateMission={addMission} 
              currentTheme={currentTheme}
              categories={categories}
              onAddCategory={addCategory}
            />

            {/* Liste des missions sous forme de cards */}
            <div className="space-y-2">
              {getMissionsForDate(selectedDate).map(mission => (
                <MissionCard 
                  key={mission.id} 
                  mission={mission} 
                  currentTheme={currentTheme}
                  categories={categories}
                  onClick={setSelectedMission}
                />
              ))}
              
              {getMissionsForDate(selectedDate).length === 0 && (
                <Card className="border-0 bg-black/40 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">🎯</div>
                    <h3 className="font-bold mb-2" style={{ color: currentTheme.textColor }}>
                      Aucune mission programmée
                    </h3>
                    <p className="text-xs text-gray-400">
                      Créez une nouvelle mission pour cette date
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
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

      {/* Calendar Panel */}
      <CalendarPanel
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        currentTheme={currentTheme}
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        missions={missions}
      />

      {/* Mission Detail Modal */}
      <MissionDetailModal
        mission={selectedMission}
        isOpen={!!selectedMission}
        onClose={() => setSelectedMission(null)}
        currentTheme={currentTheme}
        categories={categories}
        onStartMission={startMissionTimer}
        onCompleteMission={completeMission}
        isCompleted={false}
      />

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