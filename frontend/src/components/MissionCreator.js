import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Calendar, CalendarDays, Clock, Plus } from 'lucide-react';

const MissionCreator = ({ onCreateMission, currentTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mission, setMission] = useState({
    title: '',
    description: '',
    category: '',
    xpReward: 50,
    estimatedTime: 30,
    type: 'daily',
    weekDay: '',
    specificDate: ''
  });

  const categories = [
    { value: 'analyseTech', label: 'Analyse Technologique', icon: '🧠' },
    { value: 'endurance', label: 'Endurance Physique', icon: '💪' },
    { value: 'innovation', label: 'Innovation Créative', icon: '💡' },
    { value: 'documentation', label: 'Recherche Documentaire', icon: '📚' },
    { value: 'adaptabilite', label: 'Adaptabilité', icon: '⚡' }
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
      xpReward: 50,
      estimatedTime: 30,
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
          className="mb-4"
          style={{
            backgroundColor: currentTheme.primaryColor,
            color: currentTheme.backgroundColor
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Mission
        </Button>
      </DialogTrigger>
      
      <DialogContent 
        className="max-w-2xl"
        style={{ backgroundColor: currentTheme.cardColor }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: currentTheme.primaryColor }}>
            Créer une Nouvelle Mission
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <div>
            <Label htmlFor="title" style={{ color: currentTheme.textColor }}>
              Titre de la mission
            </Label>
            <Input
              id="title"
              value={mission.title}
              onChange={(e) => setMission(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Analyser les données du serveur"
              required
              style={{
                backgroundColor: currentTheme.backgroundColor,
                borderColor: currentTheme.accentColor,
                color: currentTheme.textColor
              }}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" style={{ color: currentTheme.textColor }}>
              Description
            </Label>
            <Textarea
              id="description"
              value={mission.description}
              onChange={(e) => setMission(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez la mission en détail..."
              style={{
                backgroundColor: currentTheme.backgroundColor,
                borderColor: currentTheme.accentColor,
                color: currentTheme.textColor
              }}
            />
          </div>

          {/* Catégorie */}
          <div>
            <Label style={{ color: currentTheme.textColor }}>
              Discipline de recherche
            </Label>
            <Select 
              value={mission.category} 
              onValueChange={(value) => setMission(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger style={{
                backgroundColor: currentTheme.backgroundColor,
                borderColor: currentTheme.accentColor,
                color: currentTheme.textColor
              }}>
                <SelectValue placeholder="Choisir une discipline" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Récompenses et durée */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="xpReward" style={{ color: currentTheme.textColor }}>
                Récompense XP
              </Label>
              <Input
                id="xpReward"
                type="number"
                value={mission.xpReward}
                onChange={(e) => setMission(prev => ({ ...prev, xpReward: parseInt(e.target.value) }))}
                min="1"
                max="500"
                style={{
                  backgroundColor: currentTheme.backgroundColor,
                  borderColor: currentTheme.accentColor,
                  color: currentTheme.textColor
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="estimatedTime" style={{ color: currentTheme.textColor }}>
                Durée estimée (min)
              </Label>
              <Input
                id="estimatedTime"
                type="number"
                value={mission.estimatedTime}
                onChange={(e) => setMission(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) }))}
                min="5"
                max="480"
                style={{
                  backgroundColor: currentTheme.backgroundColor,
                  borderColor: currentTheme.accentColor,
                  color: currentTheme.textColor
                }}
              />
            </div>
          </div>

          {/* Type de récurrence */}
          <div>
            <Label style={{ color: currentTheme.textColor }}>
              Fréquence
            </Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { value: 'daily', label: 'Quotidien', icon: Clock },
                { value: 'weekly', label: 'Hebdomadaire', icon: CalendarDays },
                { value: 'once', label: 'Une fois', icon: Calendar }
              ].map(({ value, label, icon: Icon }) => (
                <Card 
                  key={value}
                  className={`cursor-pointer transition-all ${
                    mission.type === value ? 'ring-2' : ''
                  }`}
                  style={{ 
                    backgroundColor: mission.type === value ? currentTheme.accentColor + '20' : currentTheme.backgroundColor,
                    borderColor: mission.type === value ? currentTheme.primaryColor : currentTheme.accentColor + '40',
                    ringColor: currentTheme.primaryColor
                  }}
                  onClick={() => setMission(prev => ({ ...prev, type: value }))}
                >
                  <CardContent className="p-3 text-center">
                    <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: currentTheme.primaryColor }} />
                    <p className="text-sm" style={{ color: currentTheme.textColor }}>
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
              <Label style={{ color: currentTheme.textColor }}>
                Jour de la semaine
              </Label>
              <Select 
                value={mission.weekDay} 
                onValueChange={(value) => setMission(prev => ({ ...prev, weekDay: value }))}
                required
              >
                <SelectTrigger style={{
                  backgroundColor: currentTheme.backgroundColor,
                  borderColor: currentTheme.accentColor,
                  color: currentTheme.textColor
                }}>
                  <SelectValue placeholder="Choisir un jour" />
                </SelectTrigger>
                <SelectContent>
                  {weekDays.map(day => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {mission.type === 'once' && (
            <div>
              <Label htmlFor="specificDate" style={{ color: currentTheme.textColor }}>
                Date spécifique
              </Label>
              <Input
                id="specificDate"
                type="date"
                value={mission.specificDate}
                onChange={(e) => setMission(prev => ({ ...prev, specificDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
                style={{
                  backgroundColor: currentTheme.backgroundColor,
                  borderColor: currentTheme.accentColor,
                  color: currentTheme.textColor
                }}
              />
            </div>
          )}

          {/* Boutons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              style={{
                borderColor: currentTheme.accentColor,
                color: currentTheme.textColor
              }}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              style={{
                backgroundColor: currentTheme.primaryColor,
                color: currentTheme.backgroundColor
              }}
            >
              Créer la Mission
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MissionCreator;