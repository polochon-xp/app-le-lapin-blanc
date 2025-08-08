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
  Brain, 
  Dumbbell, 
  Lightbulb, 
  BookOpen, 
  Zap, 
  Clock, 
  Settings, 
  Play,
  Pause,
  Trophy,
  Package,
  ScrollText
} from 'lucide-react';
import { mockPlayer, mockStats, mockMissions, mockDiscoveries, mockArtifacts, themes, updateMissionProgress, addXPToStat } from '../data/mock';

const GameInterface = () => {
  const [player, setPlayer] = useState(mockPlayer);
  const [stats, setStats] = useState(mockStats);
  const [missions, setMissions] = useState(mockMissions);
  const [discoveries, setDiscoveries] = useState(mockDiscoveries);
  const [artifacts, setArtifacts] = useState(mockArtifacts);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(themes.matrix);

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
      addXPToStat(mission.category, mission.xpReward);
      // Update player level
      setPlayer(prev => ({
        ...prev,
        totalXP: prev.totalXP + mission.xpReward
      }));
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
      analyseTech: Brain,
      endurance: Dumbbell,
      innovation: Lightbulb,
      documentation: BookOpen,
      adaptabilite: Zap
    };
    return icons[category] || Brain;
  };

  const StatCard = ({ category, data }) => {
    const Icon = getStatIcon(category);
    const percentage = (data.xp / data.maxXp) * 100;
    
    return (
      <div className="flex items-center space-x-3 p-2 rounded border" 
           style={{ borderColor: currentTheme.accentColor + '40' }}>
        <Icon className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
        <div className="flex-1">
          <div className="flex justify-between text-sm">
            <span style={{ color: currentTheme.textColor }}>
              {category === 'analyseTech' ? 'Analyse Tech' :
               category === 'endurance' ? 'Endurance' :
               category === 'innovation' ? 'Innovation' :
               category === 'documentation' ? 'Documentation' : 'Adaptabilité'} 
              (Niv {data.level})
            </span>
            <span className="text-gray-400">{data.xp}/{data.maxXp}</span>
          </div>
          <Progress 
            value={percentage} 
            className="h-2 mt-1"
            style={{ 
              backgroundColor: currentTheme.cardColor,
            }}
          />
        </div>
      </div>
    );
  };

  const MissionCard = ({ mission }) => {
    const isActive = activeTimer === mission.id;
    const canStart = mission.status === 'pending' && !activeTimer;
    
    return (
      <Card className="border" style={{ 
        borderColor: currentTheme.accentColor + '40',
        backgroundColor: currentTheme.cardColor 
      }}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium" style={{ color: currentTheme.textColor }}>
              {mission.title}
            </h4>
            <Badge variant={
              mission.type === 'daily' ? 'default' :
              mission.type === 'weekly' ? 'secondary' : 'destructive'
            }>
              {mission.type === 'daily' ? 'Quotidien' :
               mission.type === 'weekly' ? 'Hebdomadaire' : 'Unique'}
            </Badge>
          </div>
          <p className="text-sm text-gray-400 mb-3">{mission.description}</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: currentTheme.primaryColor }}>
              +{mission.xpReward} XP
            </span>
            <span className="text-sm text-gray-400 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {mission.estimatedTime}min
            </span>
          </div>
          
          {mission.progress > 0 && (
            <Progress value={mission.progress} className="mb-3" />
          )}
          
          <Button 
            onClick={() => startMission(mission)}
            disabled={!canStart}
            className="w-full"
            style={{
              backgroundColor: isActive ? currentTheme.accentColor : currentTheme.primaryColor,
              color: currentTheme.backgroundColor
            }}
          >
            {isActive ? (
              <span className="flex items-center">
                <Pause className="w-4 h-4 mr-2" />
                En cours... {formatTime(timeLeft)}
              </span>
            ) : mission.status === 'completed' ? (
              'Terminé'
            ) : (
              <span className="flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Démarrer
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div 
      className="min-h-screen p-4"
      style={{ 
        backgroundColor: currentTheme.backgroundColor,
        color: currentTheme.textColor 
      }}
    >
      {/* Timer Overlay */}
      {activeTimer && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <Card className="w-96" style={{ backgroundColor: currentTheme.cardColor }}>
            <CardHeader className="text-center">
              <CardTitle style={{ color: currentTheme.primaryColor }}>
                Mission en cours
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-mono mb-4" style={{ color: currentTheme.primaryColor }}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-400 mb-6">
                Restez concentré sur votre mission...
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveTimer(null);
                  setTimeLeft(0);
                }}
                style={{ borderColor: currentTheme.accentColor, color: currentTheme.textColor }}
              >
                Abandonner la mission
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <User className="w-8 h-8" style={{ color: currentTheme.primaryColor }} />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: currentTheme.textColor }}>
                {player.name}
              </h1>
              <p className="text-sm text-gray-400">Niveau {player.level} • {player.totalXP} XP</p>
            </div>
          </div>
          
          <Button 
            variant="outline"
            onClick={() => setShowSettings(true)}
            style={{ borderColor: currentTheme.accentColor, color: currentTheme.textColor }}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Bar */}
        <Card className="mb-6" style={{ 
          borderColor: currentTheme.accentColor + '40',
          backgroundColor: currentTheme.cardColor 
        }}>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-400">Santé</Label>
                <Progress value={player.health} className="mt-1" />
              </div>
              <div>
                <Label className="text-sm text-gray-400">Énergie</Label>
                <Progress value={player.energy} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Interface */}
        <Tabs defaultValue="stats" className="space-y-4">
          <TabsList 
            className="grid w-full grid-cols-5"
            style={{ backgroundColor: currentTheme.cardColor }}
          >
            <TabsTrigger value="stats" style={{ color: currentTheme.textColor }}>
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="missions" style={{ color: currentTheme.textColor }}>
              Missions
            </TabsTrigger>
            <TabsTrigger value="discoveries" style={{ color: currentTheme.textColor }}>
              Découvertes
            </TabsTrigger>
            <TabsTrigger value="artifacts" style={{ color: currentTheme.textColor }}>
              Artefacts
            </TabsTrigger>
            <TabsTrigger value="story" style={{ color: currentTheme.textColor }}>
              Histoire
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <Card style={{ 
              borderColor: currentTheme.accentColor + '40',
              backgroundColor: currentTheme.cardColor 
            }}>
              <CardHeader>
                <CardTitle style={{ color: currentTheme.primaryColor }}>
                  Disciplines de Recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(stats).map(([category, data]) => (
                  <StatCard key={category} category={category} data={data} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missions">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {missions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discoveries">
            <div className="space-y-4">
              {discoveries.map(discovery => (
                <Card key={discovery.id} style={{ 
                  borderColor: currentTheme.accentColor + '40',
                  backgroundColor: currentTheme.cardColor 
                }}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium" style={{ color: currentTheme.textColor }}>
                        {discovery.title}
                      </h4>
                      <div className="flex space-x-2">
                        {discovery.isNew && (
                          <Badge style={{ backgroundColor: currentTheme.primaryColor }}>
                            NOUVEAU
                          </Badge>
                        )}
                        <Badge variant={
                          discovery.rarity === 'legendary' ? 'destructive' :
                          discovery.rarity === 'rare' ? 'secondary' : 'outline'
                        }>
                          {discovery.rarity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{discovery.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artifacts">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {artifacts.map(artifact => (
                <Card key={artifact.id} style={{ 
                  borderColor: currentTheme.accentColor + '40',
                  backgroundColor: currentTheme.cardColor 
                }}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium" style={{ color: currentTheme.textColor }}>
                        {artifact.name}
                      </h4>
                      <Badge variant={
                        artifact.rarity === 'legendary' ? 'destructive' :
                        artifact.rarity === 'rare' ? 'secondary' : 'outline'
                      }>
                        {artifact.rarity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{artifact.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Package className="w-3 h-3 mr-1" />
                      {artifact.category}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="story">
            <Card style={{ 
              borderColor: currentTheme.accentColor + '40',
              backgroundColor: currentTheme.cardColor 
            }}>
              <CardHeader>
                <CardTitle style={{ color: currentTheme.primaryColor }}>
                  Journal de l'Enquête
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 pl-4" style={{ borderColor: currentTheme.primaryColor }}>
                    <h3 className="font-medium mb-2" style={{ color: currentTheme.textColor }}>
                      Niveau {player.level} - L'Annonce
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      "TRANSMISSION GLOBALE DÉTECTÉE: 'Ceux qui ont pris ma création ont 15 ans pour me trouver. 
                      Le compte à rebours a commencé. Suivez les indices que j'ai laissés... 
                      ou acceptez votre destin.' - Dr. Chen"
                    </p>
                  </div>
                  
                  <div className="text-center py-8">
                    <ScrollText className="w-12 h-12 mx-auto mb-4" style={{ color: currentTheme.accentColor }} />
                    <p className="text-gray-500">
                      Continuez à progresser pour débloquer plus de fragments de l'histoire...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent style={{ backgroundColor: currentTheme.cardColor }}>
          <DialogHeader>
            <DialogTitle style={{ color: currentTheme.primaryColor }}>
              Paramètres
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="playerName" className="text-gray-400">
                Nom du chercheur
              </Label>
              <Input
                id="playerName"
                value={player.name}
                onChange={(e) => setPlayer(prev => ({ ...prev, name: e.target.value }))}
                style={{ 
                  backgroundColor: currentTheme.backgroundColor,
                  borderColor: currentTheme.accentColor,
                  color: currentTheme.textColor 
                }}
              />
            </div>
            
            <div>
              <Label className="text-gray-400">Thème</Label>
              <Select
                value={Object.keys(themes).find(key => themes[key].name === currentTheme.name)}
                onValueChange={(value) => setCurrentTheme(themes[value])}
              >
                <SelectTrigger style={{ 
                  backgroundColor: currentTheme.backgroundColor,
                  borderColor: currentTheme.accentColor,
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
              <Label htmlFor="customColor" className="text-gray-400">
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
                className="h-10"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameInterface;