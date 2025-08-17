import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, Target, Briefcase, Dumbbell, Lightbulb, BookOpen } from 'lucide-react';

const MissionCard = ({ mission, currentTheme, categories, onClick }) => {
  const category = categories.find(cat => cat.id === mission.category);
  
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case 'travail': return <Briefcase className="w-3 h-3" />;
      case 'sport': return <Dumbbell className="w-3 h-3" />;
      case 'creation': return <Lightbulb className="w-3 h-3" />;
      case 'lecture': return <BookOpen className="w-3 h-3" />;
      default: return <Target className="w-3 h-3" />;
    }
  };

  const getRecurrenceText = (mission) => {
    switch (mission.type) {
      case 'daily': return 'Quotidien';
      case 'weekly': return `Hebdo (${mission.weekDay || 'Non défini'})`;
      case 'once': 
        if (mission.specificDate) {
          try {
            return new Date(mission.specificDate).toLocaleDateString('fr-FR');
          } catch (e) {
            return 'Une fois';
          }
        }
        return 'Une fois';
      default: return 'Une fois';
    }
  };

  return (
    <Card 
      className="border-0 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all cursor-pointer transform hover:scale-[1.02]"
      style={{ borderColor: currentTheme.accentColor + '40' }}
      onClick={() => onClick(mission)}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-full" style={{ backgroundColor: category?.color + '20' }}>
              {getCategoryIcon(mission.category)}
            </div>
            <h4 className="font-medium text-sm truncate max-w-[120px]" style={{ color: currentTheme.textColor }}>
              {mission.title}
            </h4>
          </div>
          <Badge 
            variant="outline" 
            className="text-xs border-0 px-2 py-1"
            style={{ 
              backgroundColor: currentTheme.primaryColor + '20',
              color: currentTheme.primaryColor
            }}
          >
            +{mission.xpReward} XP
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs">
          <Badge 
            variant="outline" 
            className="border-0 px-2 py-1"
            style={{ 
              backgroundColor: category?.color + '20',
              color: category?.color
            }}
          >
            {category?.name || mission.category}
          </Badge>
          
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{getRecurrenceText(mission)}</span>
          </div>
        </div>

        {mission.hasTimer && mission.estimatedTime && (
          <div className="mt-2 flex items-center space-x-1 text-xs text-gray-400">
            <Target className="w-3 h-3" />
            <span>⏱️ {mission.estimatedTime} min</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MissionCard;