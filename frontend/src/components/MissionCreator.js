import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Calendar, CalendarDays, Clock, Plus, Target, Briefcase, Dumbbell, Lightbulb, BookOpen, Timer, CheckCircle } from 'lucide-react';

const MissionCreator = ({ onCreateMission, currentTheme, categories, onAddCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ name: '', icon: '📋', color: '#ff6b35' });
  const [mission, setMission] = useState({
    title: '',
    description: '',
    category: '',
    hasTimer: false,
    estimatedTime: 15,
    type: 'daily',
    weekDay: '',
    specificDate: ''
  });

  const weekDays = [
    { value: 'monday', label: 'Lundi' },
    { value: 'tuesday', label: 'Mardi' },
    { value: 'wednesday', label: 'Mercredi' },
    { value: 'thursday', label: 'Jeudi' },
    { value: 'friday', label: 'Vendredi' },
    { value: 'saturday', label: 'Samedi' },
    { value: 'sunday', label: 'Dimanche' }
  ];

  // Fonction pour créer une nouvelle catégorie
  const handleCreateCategory = () => {
    if (!newCategoryData.name) return;
    
    const newCategory = onAddCategory(
      newCategoryData.name,
      newCategoryData.icon,
      newCategoryData.color
    );
    
    setMission(prev => ({ ...prev, category: newCategory.id }));
    setShowNewCategory(false);
    setNewCategoryData({ name: '', icon: '📋', color: '#ff6b35' });
  };

  // Fonction pour calculer automatiquement l'XP selon la catégorie et le temps
  const calculateXP = (category, estimatedTime, hasTimer) => {
    // Chaque mission rapporte maintenant 15 XP
    return 15;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mission.title || !mission.category) return;

    const xpReward = calculateXP(mission.category, mission.estimatedTime, mission.hasTimer);

    const newMission = {
      id: `m_${Date.now()}`,
      ...mission,
      xpReward,
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
      hasTimer: false,
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
            <div className="flex justify-between items-center mb-2">
              <Label className="text-xs text-gray-400">Catégorie</Label>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowNewCategory(true)}
                className="text-xs h-auto p-1"
                style={{ color: currentTheme.accentColor }}
              >
                + Nouvelle
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => {
                const isSelected = mission.category === cat.id;
                return (
                  <Card 
                    key={cat.id}
                    className={`cursor-pointer transition-all border-0 ${
                      isSelected ? 'ring-2' : ''
                    }`}
                    style={{ 
                      backgroundColor: isSelected ? cat.color + '30' : currentTheme.backgroundColor + '80',
                      ringColor: cat.color
                    }}
                    onClick={() => setMission(prev => ({ ...prev, category: cat.id }))}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-xs font-medium" style={{ color: currentTheme.textColor }}>
                          {cat.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {cat.stat}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Dialog pour créer nouvelle catégorie */}
            {showNewCategory && (
              <Dialog open={showNewCategory} onOpenChange={setShowNewCategory}>
                <DialogContent 
                  className="max-w-xs border-0 bg-black/95 backdrop-blur-sm"
                  style={{ backgroundColor: currentTheme.cardColor + 'ee' }}
                >
                  <DialogHeader>
                    <DialogTitle style={{ color: currentTheme.primaryColor }}>
                      Nouvelle Catégorie
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-400">Nom</Label>
                      <Input
                        value={newCategoryData.name}
                        onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Cuisine"
                        className="mt-1 border-0 bg-black/50 text-sm h-9"
                        style={{
                          backgroundColor: currentTheme.backgroundColor + '80',
                          color: currentTheme.textColor
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-400">Icône</Label>
                      <Input
                        value={newCategoryData.icon}
                        onChange={(e) => setNewCategoryData(prev => ({ ...prev, icon: e.target.value }))}
                        placeholder="🍳"
                        className="mt-1 border-0 bg-black/50 text-sm h-9"
                        style={{
                          backgroundColor: currentTheme.backgroundColor + '80',
                          color: currentTheme.textColor
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-400">Couleur</Label>
                      <div className="flex space-x-2 mt-1">
                        {['#ff6b35', '#4ade80', '#fbbf24', '#06b6d4', '#a855f7', '#ef4444'].map(color => (
                          <div
                            key={color}
                            className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                              newCategoryData.color === color ? 'ring-2 ring-white' : ''
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setNewCategoryData(prev => ({ ...prev, color }))}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        type="button"
                        variant="ghost"
                        onClick={() => setShowNewCategory(false)}
                        className="flex-1 h-9 text-xs"
                        style={{ color: currentTheme.textColor }}
                      >
                        Annuler
                      </Button>
                      <Button 
                        type="button"
                        onClick={handleCreateCategory}
                        className="flex-1 h-9 text-xs"
                        style={{
                          backgroundColor: currentTheme.primaryColor,
                          color: currentTheme.backgroundColor
                        }}
                      >
                        Créer
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Timer optionnel */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
            <div className="flex items-center space-x-3">
              <Timer className="w-4 h-4" style={{ color: currentTheme.primaryColor }} />
              <div>
                <p className="text-sm" style={{ color: currentTheme.textColor }}>
                  Utiliser un timer
                </p>
                <p className="text-xs text-gray-400">
                  Mode focus avec minuteur
                </p>
              </div>
            </div>
            <Checkbox
              checked={mission.hasTimer}
              onCheckedChange={(checked) => setMission(prev => ({ ...prev, hasTimer: checked }))}
              className="border-2"
              style={{ borderColor: currentTheme.primaryColor }}
            />
          </div>

          {/* Temps estimé (affiché seulement si timer activé) */}
          {mission.hasTimer && (
            <div>
              <Label htmlFor="estimatedTime" className="text-xs text-gray-400">
                Temps estimé (minutes)
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
          )}

          {/* XP Calculé automatiquement */}
          {mission.category && (
            <div className="p-3 rounded-lg bg-black/30">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">XP Automatique</span>
                <div className="flex items-center space-x-2">
                  <Target className="w-3 h-3" style={{ color: currentTheme.primaryColor }} />
                  <span className="text-sm font-bold" style={{ color: currentTheme.primaryColor }}>
                    +{calculateXP(mission.category, mission.estimatedTime, mission.hasTimer)} XP
                  </span>
                </div>
              </div>
            </div>
          )}

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