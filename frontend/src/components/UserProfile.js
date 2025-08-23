import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  User, 
  LogOut, 
  Settings, 
  Trophy, 
  Target, 
  Activity,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = ({ currentTheme, showProfile, setShowProfile }) => {
  const { user, logout, refreshUserData } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await logout();
      setShowProfile(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
  };

  const getTotalLevel = () => {
    if (!user?.stats) return 0;
    return Object.values(user.stats).reduce((total, stat) => total + stat.level, 0);
  };

  const getTotalElo = () => {
    if (!user?.stats) return 0;
    return Object.values(user.stats).reduce((total, stat) => total + stat.elo, 0);
  };

  const getAverageElo = () => {
    if (!user?.stats) return 0;
    const stats = Object.values(user.stats);
    const totalElo = stats.reduce((total, stat) => total + stat.elo, 0);
    return Math.round(totalElo / stats.length);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <Dialog open={showProfile} onOpenChange={setShowProfile}>
      <DialogContent 
        className="max-w-md border-0 bg-black/95 backdrop-blur-sm"
        style={{ backgroundColor: currentTheme.cardColor + 'f0' }}
      >
        <DialogHeader>
          <DialogTitle 
            className="flex items-center gap-2"
            style={{ color: currentTheme.primaryColor }}
          >
            <User className="w-5 h-5" />
            Profil Utilisateur
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Informations de base */}
          <Card 
            className="border-0"
            style={{ backgroundColor: currentTheme.backgroundColor + '40' }}
          >
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <div 
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: currentTheme.primaryColor + '20' }}
                >
                  <User 
                    className="w-8 h-8" 
                    style={{ color: currentTheme.primaryColor }} 
                  />
                </div>
                <h3 
                  className="text-lg font-bold"
                  style={{ color: currentTheme.textColor }}
                >
                  {user.username}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: user.is_online ? '#4ade80' : '#6b7280' }}
                  ></div>
                  <span 
                    className="text-sm"
                    style={{ color: user.is_online ? '#4ade80' : '#6b7280' }}
                  >
                    {user.is_online ? 'En ligne' : 'Hors ligne'}
                  </span>
                </div>
              </div>

              {/* Statistiques générales */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div 
                    className="text-lg font-bold"
                    style={{ color: currentTheme.primaryColor }}
                  >
                    {getTotalLevel()}
                  </div>
                  <div className="text-xs opacity-75" style={{ color: currentTheme.textColor }}>
                    Niveau Total
                  </div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-lg font-bold"
                    style={{ color: currentTheme.primaryColor }}
                  >
                    {getAverageElo()}
                  </div>
                  <div className="text-xs opacity-75" style={{ color: currentTheme.textColor }}>
                    ELO Moyen
                  </div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-lg font-bold"
                    style={{ color: currentTheme.primaryColor }}
                  >
                    {getTotalElo()}
                  </div>
                  <div className="text-xs opacity-75" style={{ color: currentTheme.textColor }}>
                    ELO Total
                  </div>
                </div>
              </div>

              {/* Dernière connexion */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xs opacity-75" style={{ color: currentTheme.textColor }}>
                  <Clock className="w-3 h-3" />
                  Dernière connexion: {formatDate(user.last_login)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques détaillées */}
          <Card 
            className="border-0"
            style={{ backgroundColor: currentTheme.backgroundColor + '40' }}
          >
            <CardContent className="p-4">
              <h4 
                className="text-sm font-bold mb-3 flex items-center gap-2"
                style={{ color: currentTheme.primaryColor }}
              >
                <Target className="w-4 h-4" />
                Statistiques Détaillées
              </h4>
              
              <div className="space-y-2">
                {user.stats && Object.entries(user.stats).map(([statName, statData]) => (
                  <div key={statName} className="flex items-center justify-between">
                    <span 
                      className="text-sm capitalize"
                      style={{ color: currentTheme.textColor }}
                    >
                      {statName}
                    </span>
                    <div className="flex gap-2">
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: currentTheme.primaryColor,
                          color: currentTheme.primaryColor
                        }}
                      >
                        Lv.{statData.level}
                      </Badge>
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: '#4a90e2',
                          color: '#4a90e2'
                        }}
                      >
                        {statData.elo} ELO
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="flex-1"
              style={{ 
                borderColor: currentTheme.primaryColor,
                color: currentTheme.primaryColor
              }}
            >
              {refreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2"></div>
                  Actualisation...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </>
              )}
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex-1"
              style={{ 
                borderColor: '#ef4444',
                color: '#ef4444'
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          {/* Note sur la synchronisation */}
          <div 
            className="text-center p-3 rounded-lg"
            style={{ backgroundColor: currentTheme.primaryColor + '10' }}
          >
            <p className="text-xs" style={{ color: currentTheme.textColor + 'aa' }}>
              💡 Vos données sont automatiquement synchronisées avec le serveur
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;