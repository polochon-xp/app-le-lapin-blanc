import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Clock, Target, Briefcase, Dumbbell, Lightbulb, BookOpen, CheckCircle, Play } from 'lucide-react';

const MissionDetailModal = ({ 
  mission, 
  isOpen, 
  onClose, 
  currentTheme, 
  categories, 
  onStartMission, 
  onCompleteMission,
  isCompleted 
}) => {
  if (!mission) return null;

  const category = categories.find(cat => cat.id === mission.category);
  
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case 'travail': return <Briefcase className="w-5 h-5" />;
      case 'sport': return <Dumbbell className="w-5 h-5" />;
      case 'creation': return <Lightbulb className="w-5 h-5" />;
      case 'lecture': return <BookOpen className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getRecurrenceText = (mission) => {
    switch (mission.type) {
      case 'daily': return 'Quotidien';
      case 'weekly': return `Hebdomadaire (${mission.weekDay || 'Non défini'})`;
      case 'once': 
        if (mission.specificDate) {
          try {
            return `Date spécifique: ${new Date(mission.specificDate).toLocaleDateString('fr-FR')}`;
          } catch (e) {
            return 'Une seule fois';
          }
        }
        return 'Une seule fois';
      default: return 'Une fois';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md mx-auto border-0 bg-black/95 backdrop-blur-sm"
        style={{ backgroundColor: currentTheme.cardColor + 'E6' }}
      >
        <DialogHeader>
          <DialogTitle 
            className="text-lg font-bold text-center"
            style={{ color: currentTheme.primaryColor }}
          >
            DÉTAILS DE LA MISSION
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* En-tête de la mission */}
          <Card className="border-0 bg-black/40 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-2 rounded-full"
                    style={{ backgroundColor: category?.color + '20' }}
                  >
                    {getCategoryIcon(mission.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base" style={{ color: currentTheme.textColor }}>
                      {mission.title}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className="text-xs border-0 mt-1"
                      style={{ 
                        backgroundColor: category?.color + '20',
                        color: category?.color
                      }}
                    >
                      {category?.name || mission.category}
                    </Badge>
                  </div>
                </div>
                
                <Badge 
                  variant="outline" 
                  className="text-sm border-0 px-3 py-1"
                  style={{ 
                    backgroundColor: currentTheme.primaryColor + '20',
                    color: currentTheme.primaryColor
                  }}
                >
                  +{mission.xpReward} XP
                </Badge>
              </div>

              {/* Description */}
              {mission.description && (
                <div className="mb-3">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {mission.description}
                  </p>
                </div>
              )}

              {/* Informations de récurrence et timer */}
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{getRecurrenceText(mission)}</span>
                </div>
                
                {mission.hasTimer && mission.estimatedTime && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Target className="w-4 h-4" />
                    <span>Durée estimée: {mission.estimatedTime} minutes</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex space-x-3">
            {!isCompleted ? (
              <>
                {mission.hasTimer ? (
                  <Button
                    onClick={() => {
                      onStartMission(mission);
                      onClose();
                    }}
                    className="flex-1 border-0"
                    style={{
                      backgroundColor: currentTheme.primaryColor,
                      color: currentTheme.backgroundColor
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Démarrer Timer
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      onCompleteMission(mission.id);
                      onClose();
                    }}
                    className="flex-1 border-0"
                    style={{
                      backgroundColor: currentTheme.primaryColor,
                      color: currentTheme.backgroundColor
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marquer comme fini
                  </Button>
                )}
              </>
            ) : (
              <div className="flex-1 text-center p-3 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-400" />
                <span className="text-sm text-green-400">Mission terminée ✓</span>
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={onClose}
              className="border-0"
              style={{
                backgroundColor: 'transparent',
                color: currentTheme.textColor,
                borderColor: currentTheme.accentColor
              }}
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionDetailModal;