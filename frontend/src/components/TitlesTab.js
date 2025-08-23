import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Trophy, 
  Crown, 
  Star, 
  Target, 
  BookOpen, 
  Zap, 
  Shield,
  CheckCircle,
  Lock
} from 'lucide-react';

const TitlesTab = ({ currentTheme }) => {
  const [userTitles, setUserTitles] = useState(null);
  const [allTitles, setAllTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserTitles();
    fetchAllTitles();
  }, []);

  const fetchUserTitles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/titles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserTitles(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des titres utilisateur:', error);
    }
  };

  const fetchAllTitles = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/titles`);
      if (response.ok) {
        const data = await response.json();
        setAllTitles(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les titres:', error);
    }
  };

  const selectTitle = async (titleName) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/select-title?title_name=${titleName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Titre sélectionné avec succès !');
        fetchUserTitles(); // Refresh
        setShowTitleModal(false);
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.detail}`);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du titre:', error);
    }
    setLoading(false);
  };

  const getTitleIcon = (titleName) => {
    const iconMap = {
      'Novice': <Target className="w-6 h-6" />,
      'Initié': <BookOpen className="w-6 h-6" />,
      'Disciple': <Star className="w-6 h-6" />,
      'Combattant': <Shield className="w-6 h-6" />,
      'Érudit': <BookOpen className="w-6 h-6" />,
      'Stratège': <Zap className="w-6 h-6" />,
      'Maître': <Crown className="w-6 h-6" />,
      'Champion': <Trophy className="w-6 h-6" />,
      'Légende': <Crown className="w-6 h-6" />
    };
    return iconMap[titleName] || <Trophy className="w-6 h-6" />;
  };

  const getTitleColor = (titleName, unlocked) => {
    if (!unlocked) return '#6b7280';
    
    const colorMap = {
      'Novice': '#94a3b8',
      'Initié': '#84cc16',
      'Disciple': '#3b82f6',
      'Combattant': '#ef4444',
      'Érudit': '#8b5cf6',
      'Stratège': '#06b6d4',
      'Maître': '#f59e0b',
      'Champion': '#10b981',
      'Légende': '#fbbf24'
    };
    return colorMap[titleName] || currentTheme.primaryColor;
  };

  const getBonusDescription = (bonusType, bonusValue) => {
    switch (bonusType) {
      case 'none':
        return 'Gains normaux';
      case 'all_missions':
        return `+${bonusValue}% sur toutes les missions`;
      case 'attack_storage':
        return `Peut stocker ${bonusValue} cartes d'attaque`;
      case 'sport_travail':
        return `+${bonusValue}% gains en sport et travail`;
      case 'lecture_creation':
        return `+${bonusValue}% gains en lecture et création`;
      case 'stat_block':
        return `Peut bloquer une stat ennemie ${bonusValue} fois/semaine`;
      case 'attack_immunity':
        return `Annule ${bonusValue} attaque aléatoire par jour`;
      case 'legend':
        return `+${bonusValue}% sur toutes missions + immunité 1 fois/semaine`;
      default:
        return 'Bonus spécial';
    }
  };

  if (!userTitles) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center" style={{ color: currentTheme.textColor }}>
          <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Chargement des titres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progression actuelle */}
      <Card className="border-0 bg-black/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2" style={{ color: currentTheme.primaryColor }}>
            <Crown className="w-4 h-4" />
            Progression Actuelle
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getTitleIcon(userTitles.current_title)}
            <div>
              <h3 className="font-bold" style={{ color: getTitleColor(userTitles.current_title, true) }}>
                {userTitles.current_title}
              </h3>
              <p className="text-xs opacity-75" style={{ color: currentTheme.textColor }}>
                Niveau Total: {userTitles.total_level}
              </p>
            </div>
          </div>
          
          {/* Progression vers le prochain titre */}
          {(() => {
            const currentIndex = userTitles.titles.findIndex(t => t.current);
            const nextTitle = userTitles.titles[currentIndex + 1];
            
            if (nextTitle && !nextTitle.unlocked) {
              const progress = (userTitles.total_level / nextTitle.level_required) * 100;
              const remaining = nextTitle.level_required - userTitles.total_level;
              
              return (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1" style={{ color: currentTheme.textColor }}>
                    <span>Prochain: {nextTitle.name}</span>
                    <span>{remaining} niveaux restants</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: currentTheme.cardColor }}>
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: currentTheme.primaryColor
                      }}
                    ></div>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </CardContent>
      </Card>

      {/* Grille des titres */}
      <Card className="border-0 bg-black/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2" style={{ color: currentTheme.primaryColor }}>
            <Trophy className="w-4 h-4" />
            Collection de Titres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {userTitles.titles.map((title, index) => (
              <div
                key={index}
                onClick={() => {
                  if (title.unlocked) {
                    setSelectedTitle(title);
                    setShowTitleModal(true);
                  }
                }}
                className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                  title.unlocked ? 'cursor-pointer hover:scale-105' : 'opacity-60'
                }`}
                style={{
                  backgroundColor: title.current 
                    ? getTitleColor(title.name, title.unlocked) + '20'
                    : currentTheme.cardColor + '60',
                  borderColor: title.current 
                    ? getTitleColor(title.name, title.unlocked)
                    : title.unlocked 
                      ? getTitleColor(title.name, title.unlocked) + '40'
                      : '#6b7280'
                }}
              >
                {/* Badge actuel */}
                {title.current && (
                  <div className="absolute -top-1 -right-1">
                    <CheckCircle 
                      className="w-4 h-4" 
                      style={{ color: getTitleColor(title.name, title.unlocked) }}
                    />
                  </div>
                )}

                {/* Verrou pour les titres non débloqués */}
                {!title.unlocked && (
                  <div className="absolute -top-1 -right-1">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                )}

                <div className="text-center">
                  <div 
                    className="flex justify-center mb-2"
                    style={{ color: getTitleColor(title.name, title.unlocked) }}
                  >
                    {getTitleIcon(title.name)}
                  </div>
                  
                  <h4 
                    className="font-bold text-sm mb-1"
                    style={{ color: title.unlocked ? currentTheme.textColor : '#6b7280' }}
                  >
                    {title.name}
                  </h4>
                  
                  <Badge 
                    variant="outline" 
                    className="text-xs mb-2"
                    style={{ 
                      borderColor: getTitleColor(title.name, title.unlocked),
                      color: getTitleColor(title.name, title.unlocked)
                    }}
                  >
                    Niveau {title.level_required}
                  </Badge>
                  
                  <p 
                    className="text-xs line-clamp-2"
                    style={{ color: title.unlocked ? currentTheme.textColor : '#6b7280' }}
                  >
                    {getBonusDescription(title.bonus_type, title.bonus_value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de détail du titre */}
      <Dialog open={showTitleModal} onOpenChange={setShowTitleModal}>
        <DialogContent 
          className="max-w-sm border-0 bg-black/90 backdrop-blur-sm"
          style={{ backgroundColor: currentTheme.cardColor + 'ee' }}
        >
          <DialogHeader>
            <DialogTitle 
              className="flex items-center gap-2"
              style={{ color: getTitleColor(selectedTitle?.name, selectedTitle?.unlocked) }}
            >
              {selectedTitle && getTitleIcon(selectedTitle.name)}
              {selectedTitle?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTitle && (
            <div className="space-y-4">
              <div className="text-center">
                <div 
                  className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full"
                  style={{ 
                    backgroundColor: getTitleColor(selectedTitle.name, selectedTitle.unlocked) + '20',
                    color: getTitleColor(selectedTitle.name, selectedTitle.unlocked)
                  }}
                >
                  {getTitleIcon(selectedTitle.name)}
                </div>
                
                <Badge 
                  variant="outline"
                  style={{ 
                    borderColor: getTitleColor(selectedTitle.name, selectedTitle.unlocked),
                    color: getTitleColor(selectedTitle.name, selectedTitle.unlocked)
                  }}
                >
                  Niveau {selectedTitle.level_required} requis
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm" style={{ color: currentTheme.textColor }}>
                  <strong>Description:</strong>
                  <p className="mt-1 opacity-75">{selectedTitle.description}</p>
                </div>
                
                <div className="text-sm" style={{ color: currentTheme.textColor }}>
                  <strong>Bonus:</strong>
                  <p className="mt-1 opacity-75">
                    {getBonusDescription(selectedTitle.bonus_type, selectedTitle.bonus_value)}
                  </p>
                </div>
              </div>

              {selectedTitle.unlocked && !selectedTitle.current && (
                <Button 
                  onClick={() => selectTitle(selectedTitle.name)}
                  disabled={loading}
                  className="w-full"
                  style={{ 
                    backgroundColor: currentTheme.primaryColor, 
                    color: currentTheme.backgroundColor 
                  }}
                >
                  {loading ? 'Sélection...' : 'Activer ce Titre'}
                </Button>
              )}

              {selectedTitle.current && (
                <div 
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: currentTheme.primaryColor + '20' }}
                >
                  <CheckCircle 
                    className="w-6 h-6 mx-auto mb-1" 
                    style={{ color: currentTheme.primaryColor }}
                  />
                  <p className="text-sm" style={{ color: currentTheme.primaryColor }}>
                    Titre Actuel
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TitlesTab;