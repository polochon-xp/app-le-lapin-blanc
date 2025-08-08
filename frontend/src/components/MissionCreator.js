import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Calendar, CalendarDays, Clock, Plus, Target, Brain, Dumbbell, Lightbulb, BookOpen, Zap } from 'lucide-react';

const MissionCreator = ({ onCreateMission, currentTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mission, setMission] = useState({
    title: '',
    description: '',
    category: '',
    xpReward: 25,
    estimatedTime: 15,
    type: 'daily',
    weekDay: '',
    specificDate: ''
  });

  const categories = [
    { value: 'analyseTech', label: 'Analyse Technologique', icon: Brain, color: currentTheme.primaryColor },
    { value: 'endurance', label: 'Endurance Physique', icon: Dumbbell, color: '#4ade80' },
    { value: 'innovation', label: 'Innovation Créative', icon: Lightbulb, color: '#fbbf24' },
    { value: 'documentation', label: 'Recherche Documentaire', icon: BookOpen, color: '#06b6d4' },
    { value: 'adaptabilite', label: 'Adaptabilité', icon: Zap, color: '#a855f7' }
  ];

  const weekDays = [
    { value: 'monday', label: 'Lundi' },
    { value: 'tuesday', label: 'Mardi' },
    { value: 'wednesday', label: 'Mercredi' },
    { value: 'thursday', label: 'Jeudi' },
    { value: 'friday', label: 'Vendredi' },
    { value: 'saturday', label: 'Samedi' },
    { value: 'sunday', label: 'Dimanche' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mission.title || !mission.category) return;

    const newMission = {
      id: `m_${Date.now()}`,
      ...mission,
      status: 'pending',
      progress: 0,
      deadline: getDeadline()
    };

    onCreateMission(newMission);
    setIsOpen(false);
    setMission({
      title: '',
      description: '',
      category: '',
      xpReward: 25,
      estimatedTime: 15,
      type: 'daily',
      weekDay: '',
      specificDate: ''
    });
  };

  const getDeadline = () => {
    const now = new Date();
    switch (mission.type) {
      case 'daily':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59).toISOString();
      case 'weekly':
        const daysUntilTarget = (weekDays.findIndex(d => d.value === mission.weekDay) + 1 - now.getDay() + 7) % 7;
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilTarget, 23, 59, 59).toISOString();
      case 'once':
        return new Date(mission.specificDate + 'T23:59:59').toISOString();
      default:
        return now.toISOString();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full mb-3 border-0 h-10"
          style={{
            backgroundColor: currentTheme.primaryColor + '20',
            color: currentTheme.primaryColor,
            border: `1px solid ${currentTheme.primaryColor}40`
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Mission
        </Button>
      </DialogTrigger>
      
      <DialogContent 
        className="max-w-sm border-0 bg-black/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: currentTheme.cardColor + 'ee' }}
      >
        <DialogHeader>
          <DialogTitle className="text-base" style={{ color: currentTheme.primaryColor }}>
            Créer une Mission
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <div>
            <Label htmlFor="title" className="text-xs text-gray-400">
              Titre de la mission
            </Label>
            <Input
              id="title"
              value={mission.title}
              onChange={(e) => setMission(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Analyser les données"
              required
              className="mt-1 border-0 bg-black/50 text-sm h-9"
              style={{
                backgroundColor: currentTheme.backgroundColor + '80',
                color: currentTheme.textColor
              }}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-xs text-gray-400">
              Description (optionnel)
            </Label>
            <Textarea
              id="description"
              value={mission.description}
              onChange={(e) => setMission(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez brièvement..."
              className="mt-1 border-0 bg-black/50 text-sm h-16 resize-none"
              style={{
                backgroundColor: currentTheme.backgroundColor + '80',
                color: currentTheme.textColor
              }}
            />
          </div>

          {/* Catégorie */}
          <div>
            <Label className="text-xs text-gray-400">
              Discipline de recherche
            </Label>
            <Select 
              value={mission.category} 
              onValueChange={(value) => setMission(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger className="mt-1 border-0 bg-black/50 text-sm h-9"
                             style={{
                               backgroundColor: currentTheme.backgroundColor + '80',
                               color: currentTheme.textColor
                             }}>
                <SelectValue placeholder="Choisir..." />
              </SelectTrigger>
              <SelectContent className="border-0" style={{ backgroundColor: currentTheme.cardColor }}>
                {categories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value} className="text-sm">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-3 h-3" style={{ color: cat.color }} />
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Récompenses et durée */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="xpReward" className="text-xs text-gray-400">
                XP
              </Label>
              <Input
                id="xpReward"
                type="number"
                value={mission.xpReward}
                onChange={(e) => setMission(prev => ({ ...prev, xpReward: parseInt(e.target.value) }))}
                min="5"
                max="200"
                className="mt-1 border-0 bg-black/50 text-sm h-9"
                style={{
                  backgroundColor: currentTheme.backgroundColor + '80',
                  color: currentTheme.textColor
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="estimatedTime" className="text-xs text-gray-400">
                Temps (min)
              </Label>
              <Input
                id="estimatedTime"
                type="number"
                value={mission.estimatedTime}
                onChange={(e) => setMission(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) }))}
                min="5"
                max="240"
                className="mt-1 border-0 bg-black/50 text-sm h-9"
                style={{
                  backgroundColor: currentTheme.backgroundColor + '80',
                  color: currentTheme.textColor
                }}
              />
            </div>
          </div>

          {/* Type de récurrence */}
          <div>
            <Label className="text-xs text-gray-400">
              Fréquence
            </Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { value: 'daily', label: 'Quotidien', icon: Clock },
                { value: 'weekly', label: 'Hebdo', icon: CalendarDays },
                { value: 'once', label: 'Une fois', icon: Calendar }
              ].map(({ value, label, icon: Icon }) => (
                <Card 
                  key={value}
                  className={`cursor-pointer transition-all border-0 ${
                    mission.type === value ? 'ring-1' : ''
                  }`}
                  style={{ 
                    backgroundColor: mission.type === value ? currentTheme.primaryColor + '30' : currentTheme.backgroundColor + '80',
                    ringColor: currentTheme.primaryColor
                  }}
                  onClick={() => setMission(prev => ({ ...prev, type: value }))}
                >
                  <CardContent className="p-2 text-center">
                    <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: currentTheme.primaryColor }} />
                    <p className="text-xs" style={{ color: currentTheme.textColor }}>
                      {label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Options spécifiques selon le type */}
          {mission.type === 'weekly' && (
            <div>
              <Label className="text-xs text-gray-400">
                Jour de la semaine
              </Label>
              <Select 
                value={mission.weekDay} 
                onValueChange={(value) => setMission(prev => ({ ...prev, weekDay: value }))}
                required
              >
                <SelectTrigger className="mt-1 border-0 bg-black/50 text-sm h-9"
                               style={{
                                 backgroundColor: currentTheme.backgroundColor + '80',
                                 color: currentTheme.textColor
                               }}>
                  <SelectValue placeholder="Choisir un jour" />
                </SelectTrigger>
                <SelectContent className="border-0" style={{ backgroundColor: currentTheme.cardColor }}>
                  {weekDays.map(day => (
                    <SelectItem key={day.value} value={day.value} className="text-sm">
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {mission.type === 'once' && (
            <div>
              <Label htmlFor="specificDate" className="text-xs text-gray-400">
                Date spécifique
              </Label>
              <Input
                id="specificDate"
                type="date"
                value={mission.specificDate}
                onChange={(e) => setMission(prev => ({ ...prev, specificDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
                className="mt-1 border-0 bg-black/50 text-sm h-9"
                style={{
                  backgroundColor: currentTheme.backgroundColor + '80',
                  color: currentTheme.textColor
                }}
              />
            </div>
          )}

          {/* Boutons */}
          <div className="flex space-x-2 pt-2">
            <Button 
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="flex-1 h-9 text-xs border-0"
              style={{
                color: currentTheme.accentColor,
                backgroundColor: 'transparent'
              }}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="flex-1 h-9 text-xs border-0"
              style={{
                backgroundColor: currentTheme.primaryColor,
                color: currentTheme.backgroundColor
              }}
            >
              <Target className="w-3 h-3 mr-1" />
              Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MissionCreator;