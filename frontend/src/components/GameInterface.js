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
  Brain,
  CalendarDays,
  Users,
  MapPin,
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
  Save
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
  updateMissionProgress, 
  addXPToStat,
  unlockContentForLevel
} from '../data/mock';
import { themes } from '../data/themes';

const GameInterface = () => {
  // Initialisation avec données sauvegardées ou par défaut
  const initializeGameState = () => {
    try {
      const savedPlayer = localStorage.getItem('lapinBlanc_player');
      const savedStats = localStorage.getItem('lapinBlanc_stats');
      const savedMissions = localStorage.getItem('lapinBlanc_missions');
      const savedTheme = localStorage.getItem('lapinBlanc_theme');
      const savedCategories = localStorage.getItem('lapinBlanc_categories');
      const savedSelectedDate = localStorage.getItem('lapinBlanc_selectedDate');
      
      return {
        player: savedPlayer ? JSON.parse(savedPlayer) : mockPlayer,
        stats: savedStats ? JSON.parse(savedStats) : mockStats,
        missions: savedMissions ? JSON.parse(savedMissions) : mockMissions,
        theme: savedTheme ? JSON.parse(savedTheme) : themes.bright,
        categories: savedCategories ? JSON.parse(savedCategories) : [
          { id: 'travail', name: 'Travail', stat: 'Analyse Technologique', icon: '💼', color: '#ff6b35' },
          { id: 'sport', name: 'Sport', stat: 'Endurance Physique', icon: '💪', color: '#4ade80' },
          { id: 'creation', name: 'Création', stat: 'Innovation Créative', icon: '💡', color: '#fbbf24' },
          { id: 'lecture', name: 'Lecture', stat: 'Adaptabilité', icon: '📚', color: '#06b6d4' },
          { id: 'adaptabilite', name: 'Adaptabilité', stat: 'Adaptabilité', icon: '🧠', color: '#a855f7' }
        ],
        selectedDate: savedSelectedDate ? new Date(JSON.parse(savedSelectedDate)) : new Date()
      };
    } catch (error) {
      console.log('Erreur lors du chargement des données sauvegardées:', error);
      return {
        player: mockPlayer,
        stats: mockStats,
        missions: mockMissions,
        theme: themes.bright,
        categories: [
          { id: 'travail', name: 'Travail', stat: 'Analyse Technologique', icon: '💼', color: '#ff6b35' },
          { id: 'sport', name: 'Sport', stat: 'Endurance Physique', icon: '💪', color: '#4ade80' },
          { id: 'creation', name: 'Création', stat: 'Innovation Créative', icon: '💡', color: '#fbbf24' },
          { id: 'lecture', name: 'Lecture', stat: 'Connaissance', icon: '📚', color: '#06b6d4' },
          { id: 'adaptabilite', name: 'Adaptabilité', stat: 'Adaptabilité', icon: '🧠', color: '#a855f7' }
        ],
        selectedDate: new Date()
      };
    }
  };

  const gameState = initializeGameState();
  
  const [player, setPlayer] = useState(gameState.player);
  const [stats, setStats] = useState(gameState.stats);
  const [missions, setMissions] = useState(gameState.missions);
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
  }, [player, stats, missions, currentTheme, categories, selectedDate]);

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
      
      // Level up du joueur si nécessaire
      if (newLevel > player.level) {
        console.log(`🎉 Niveau global ${newLevel} atteint !`);
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
      lecture: BookOpen,
      adaptabilite: Brain
    };
    return icons[category] || Briefcase;
  };

  const getStatName = (category) => {
    const names = {
      travail: 'Travail',
      sport: 'Sport', 
      creation: 'Création',
      lecture: 'Lecture',
      adaptabilite: 'Adaptabilité'
    };
    return names[category] || category;
  };

  const StatCard = ({ category, data }) => {
    const Icon = getStatIcon(category);
    const percentage = data.maxXp > 0 ? (data.xp / data.maxXp) * 100 : 0;
    
    // Couleurs vives pour chaque catégorie
    const categoryColors = {
      travail: '#ff6b35',      // Orange vif
      sport: '#4ade80',        // Vert vif  
      creation: '#fbbf24',     // Jaune vif
      lecture: '#06b6d4',      // Cyan vif
      adaptabilite: '#a855f7'  // Violet vif
    };
    
    const categoryColor = categoryColors[category] || currentTheme.primaryColor;
    
    return (
      <div 
        className="flex items-center space-x-3 p-3 rounded-lg border bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all" 
        style={{ 
          borderColor: categoryColor + '60',
          boxShadow: `0 0 10px ${categoryColor}20`
        }}
      >
        <div 
          className="p-2 rounded-full" 
          style={{ 
            backgroundColor: categoryColor + '30',
            boxShadow: `0 0 15px ${categoryColor}40`
          }}
        >
          <Icon className="w-4 h-4" style={{ color: categoryColor }} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center text-sm">
            <div className="flex flex-col">
              <span style={{ color: currentTheme.textColor }} className="font-bold pixel-font">
                {getStatName(category)}
                <span className="ml-2 text-xs opacity-70">LV.{data.level}</span>
              </span>
              <span className="text-xs font-bold mt-1" style={{ color: categoryColor }}>
                ELO: {data.elo || 1200}
              </span>
            </div>
            <span className="text-gray-300 text-xs font-bold">{data.xp}/{data.maxXp}</span>
          </div>
          <div className="mt-2 relative">
            <div 
              className="h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: currentTheme.cardColor + '80' }}
            >
              <div 
                className="h-full rounded-full transition-all duration-500 relative"
                style={{ 
                  width: `${percentage}%`,
                  background: `linear-gradient(90deg, ${categoryColor}80, ${categoryColor})`,
                  boxShadow: `0 0 10px ${categoryColor}60`
                }}
              >
                {/* Effet de glow animé */}
                <div 
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, ${categoryColor}40, transparent)`,
                    animation: 'shimmer 2s infinite'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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

  // Démarrer une mission avec timer amélioré
  const startMissionTimer = (mission) => {
    if (mission.hasTimer && mission.estimatedTime) {
      setActiveTimer(mission);
      setTimeLeft(mission.estimatedTime * 60); // convertir en secondes
    }
  };

  // Marquer une mission comme terminée avec nouveau système de récompenses
  const completeMission = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    // +5 XP pour mission terminée
    if (mission.category && mission.xpReward) {
      addXPToCategory(mission.category, 5);
    }

    // +10 XP Santé pour mission terminée
    updateHealth(10);

    // Marquer la mission comme complétée
    setMissions(prev => prev.map(m => 
      m.id === missionId 
        ? { ...m, status: 'completed', completedDate: new Date().toISOString() }
        : m
    ));

    console.log(`✅ Mission "${mission.title}" terminée ! +5 XP ${mission.category}, +10 Santé`);
  };

  // Nouvelle fonction pour ajouter XP à une catégorie avec progression infinie
  const addXPToCategory = (categoryId, xpAmount) => {
    setStats(prevStats => {
      const newStats = { ...prevStats };
      const currentStat = newStats[categoryId];
      
      if (currentStat) {
        let newXP = currentStat.xp + xpAmount;
        let newLevel = currentStat.level;
        let levelUps = 0;

        // Progression infinie : chaque 100 XP = +1 niveau
        while (newXP >= 100) {
          newXP -= 100;
          newLevel += 1;
          levelUps += 1;
        }

        newStats[categoryId] = {
          ...currentStat,
          xp: newXP,
          level: newLevel
        };

        // Si level up, +10 XP global au joueur
        if (levelUps > 0) {
          setPlayer(prevPlayer => {
            let newGlobalXP = prevPlayer.totalXP + (levelUps * 10);
            let newGlobalLevel = prevPlayer.level;

            // Level up global à 100 XP
            while (newGlobalXP >= 100) {
              newGlobalXP -= 100;
              newGlobalLevel += 1;
            }

            return {
              ...prevPlayer,
              totalXP: newGlobalXP,
              level: newGlobalLevel,
              xpToNextLevel: 100 - newGlobalXP
            };
          });

          console.log(`🎉 ${categoryId} niveau ${newLevel} ! +${levelUps * 10} XP global`);
        }
      }

      return newStats;
    });
  };

  // Fonction pour mettre à jour la santé
  const updateHealth = (healthChange) => {
    setPlayer(prevPlayer => {
      const newHealth = Math.max(0, Math.min(100, prevPlayer.health + healthChange));
      
      // Si santé = 0, perdre un niveau global
      if (newHealth === 0 && prevPlayer.level > 1) {
        console.log('💀 Santé à 0 ! Niveau global -1');
        return {
          ...prevPlayer,
          health: newHealth,
          level: prevPlayer.level - 1,
          totalXP: 0
        };
      }
      
      return {
        ...prevPlayer,
        health: newHealth
      };
    });
  };

  // Fonction pour mettre à jour l'énergie
  const updateEnergy = (energyChange) => {
    setPlayer(prevPlayer => ({
      ...prevPlayer,
      energy: Math.max(0, Math.min(100, prevPlayer.energy + energyChange))
    }));
  };

  // Timer terminé : +2 XP dans la catégorie
  const onTimerComplete = (mission) => {
    if (mission.category) {
      addXPToCategory(mission.category, 2);
      console.log(`⏱️ Timer terminé ! +2 XP ${mission.category}`);
    }
  };

  // Système de vérification à minuit (simulation)
  const checkDailyPenalties = () => {
    const today = new Date().toDateString();
    const todayMissions = getMissionsForDate(new Date());
    
    // Vérifier les missions non terminées
    todayMissions.forEach(mission => {
      if (mission.status !== 'completed') {
        // -8 XP pour mission non réalisée
        addXPToCategory(mission.category, -8);
        // -10 XP Santé pour mission non terminée
        updateHealth(-10);
        console.log(`❌ Mission "${mission.title}" non terminée ! -8 XP ${mission.category}, -10 Santé`);
      }
    });

    // Vérifier progression des catégories pour l'énergie
    const categoriesProgressed = Object.keys(stats).filter(category => {
      // Logique simplifiée : si XP > 0, considéré comme progressé
      return stats[category].xp > 0;
    }).length;

    if (categoriesProgressed === Object.keys(stats).length) {
      updateEnergy(5);
      console.log('⚡ Toutes les catégories ont progressé ! +5 Énergie');
    } else if (categoriesProgressed === 0) {
      updateEnergy(-5);
      console.log('😴 Aucune progression ! -5 Énergie');
    }

    // Bonus santé parfaite
    if (player.health === 100) {
      setPlayer(prev => ({
        ...prev,
        totalXP: prev.totalXP + 2
      }));
      console.log('💚 Santé parfaite ! +2 XP global');
    }
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
            <TabsTrigger value="friends" className="text-xs p-1 data-[state=active]:bg-white/10">
              <Users className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="map" className="text-xs p-1 data-[state=active]:bg-white/10">
              <MapPin className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="titles" className="text-xs p-1 data-[state=active]:bg-white/10">
              <Trophy className="w-4 h-4" />
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
            {/* Bouton calendrier flottant futuriste */}
            <Button
              className="fixed bottom-20 right-4 z-40 rounded-full w-14 h-14 shadow-lg border-2 hover:scale-110 transition-all duration-300"
              style={{
                backgroundColor: currentTheme.primaryColor,
                color: currentTheme.backgroundColor,
                borderColor: currentTheme.accentColor,
                boxShadow: `0 0 20px ${currentTheme.primaryColor}40`
              }}
              onClick={() => setShowCalendar(true)}
            >
              <CalendarDays className="w-6 h-6" />
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
              {getMissionsForDate(selectedDate).map(mission => {
                const isCompleted = mission.status === 'completed' && 
                                   mission.completedDate && 
                                   new Date(mission.completedDate).toDateString() === selectedDate.toDateString();
                
                return (
                  <MissionCard 
                    key={mission.id} 
                    mission={mission} 
                    currentTheme={currentTheme}
                    categories={categories}
                    onClick={setSelectedMission}
                    isCompleted={isCompleted}
                  />
                );
              })}
              
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

          <TabsContent value="friends" className="space-y-3">
            <Card className="border-0 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" 
                       style={{ color: currentTheme.primaryColor }} />
                <p className="text-sm text-gray-400 mb-2">Amis / Club</p>
                <p className="text-xs text-gray-500">Fonctionnalité en cours de développement</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-3">
            <Card className="border-0 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" 
                        style={{ color: currentTheme.primaryColor }} />
                <p className="text-sm text-gray-400 mb-2">Carte</p>
                <p className="text-xs text-gray-500">Fonctionnalité en cours de développement</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="titles" className="space-y-3">
            <Card className="border-0 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" 
                        style={{ color: currentTheme.primaryColor }} />
                <p className="text-sm text-gray-400 mb-2">Titres</p>
                <p className="text-xs text-gray-500">Fonctionnalité en cours de développement</p>
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
        onMarkAsCompleted={completeMission}
        isCompleted={selectedMission && selectedMission.status === 'completed'}
        activeTimer={activeTimer}
        timeLeft={timeLeft}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .signature {
          position: fixed;
          bottom: 10px;
          right: 20px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: ${currentTheme.primaryColor};
          opacity: 0.7;
          z-index: 1000;
          pointer-events: none;
        }
        
        .pixel-font {
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }
        
        .stat-bar {
          transition: all 0.5s ease;
          position: relative;
          overflow: hidden;
        }
        
        .stat-glow {
          box-shadow: 0 0 15px currentColor;
        }
        
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