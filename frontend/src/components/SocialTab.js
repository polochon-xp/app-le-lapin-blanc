import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Users, 
  UserPlus, 
  Search, 
  Crown, 
  Globe, 
  Calendar,
  Trophy,
  Target,
  Activity
} from 'lucide-react';

const SocialTab = ({ currentTheme }) => {
  const [friends, setFriends] = useState([]);
  const [club, setClub] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [showJoinClub, setShowJoinClub] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubDescription, setClubDescription] = useState('');
  const [clubSearchTerm, setClubSearchTerm] = useState('');
  const [clubSearchResults, setClubSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFriends();
    fetchUserClub();
  }, []);

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/friends`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des amis:', error);
    }
  };

  const fetchUserClub = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/club`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.club) {
          setClub(data);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du club:', error);
    }
  };

  const searchUser = async () => {
    if (!searchUsername.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/search/${searchUsername}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults(null);
        alert('Utilisateur non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchResults(null);
    }
    setLoading(false);
  };

  const addFriend = async (username) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/add-friend?friend_username=${username}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Ami ajouté avec succès !');
        fetchFriends();
        setSearchResults(null);
        setSearchUsername('');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.detail}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'ami:', error);
    }
  };

  const createClub = async () => {
    if (!clubName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/clubs/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: clubName,
          description: clubDescription
        })
      });

      if (response.ok) {
        alert('Club créé avec succès !');
        setShowCreateClub(false);
        setClubName('');
        setClubDescription('');
        fetchUserClub();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.detail}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création du club:', error);
    }
  };

  const searchClubs = async () => {
    if (!clubSearchTerm.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/clubs/search/${clubSearchTerm}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClubSearchResults(data);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de clubs:', error);
    }
  };

  const joinClub = async (clubId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/clubs/join/${clubId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Vous avez rejoint le club !');
        setShowJoinClub(false);
        setClubSearchTerm('');
        setClubSearchResults([]);
        fetchUserClub();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.detail}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'adhésion au club:', error);
    }
  };

  const leaveClub = async () => {
    if (!confirm('Êtes-vous sûr de vouloir quitter le club ?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/clubs/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Vous avez quitté le club');
        setClub(null);
      }
    } catch (error) {
      console.error('Erreur lors de la sortie du club:', error);
    }
  };

  const getStatTotal = (stats) => {
    return Object.values(stats).reduce((total, stat) => total + stat.level, 0);
  };

  const getEloTotal = (stats) => {
    return Object.values(stats).reduce((total, stat) => total + stat.elo, 0);
  };

  return (
    <div className="space-y-4">
      {/* Recherche d'utilisateurs */}
      <Card className="border-0 bg-black/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2" style={{ color: currentTheme.primaryColor }}>
            <Search className="w-4 h-4" />
            Rechercher des Joueurs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Nom d'utilisateur"
              className="flex-1"
              style={{
                backgroundColor: currentTheme.cardColor,
                borderColor: currentTheme.primaryColor + '40',
                color: currentTheme.textColor
              }}
              onKeyPress={(e) => e.key === 'Enter' && searchUser()}
            />
            <Button 
              onClick={searchUser}
              disabled={loading}
              style={{ 
                backgroundColor: currentTheme.primaryColor, 
                color: currentTheme.backgroundColor 
              }}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {searchResults && (
            <div 
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: currentTheme.cardColor + '60',
                borderColor: currentTheme.primaryColor + '40'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: searchResults.is_online ? '#4ade80' : '#6b7280' }}
                  ></div>
                  <span className="font-medium" style={{ color: currentTheme.textColor }}>
                    {searchResults.username}
                  </span>
                </div>
                <Button
                  onClick={() => addFriend(searchResults.username)}
                  size="sm"
                  style={{ 
                    backgroundColor: currentTheme.primaryColor, 
                    color: currentTheme.backgroundColor 
                  }}
                >
                  <UserPlus className="w-3 h-3 mr-1" />
                  Ajouter
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div style={{ color: currentTheme.primaryColor }}>Niveau</div>
                  <div style={{ color: currentTheme.textColor }}>{getStatTotal(searchResults.stats)}</div>
                </div>
                <div className="text-center">
                  <div style={{ color: currentTheme.primaryColor }}>ELO Total</div>
                  <div style={{ color: currentTheme.textColor }}>{getEloTotal(searchResults.stats)}</div>
                </div>
                <div className="text-center">
                  <div style={{ color: currentTheme.primaryColor }}>Statut</div>
                  <div style={{ color: searchResults.is_online ? '#4ade80' : '#6b7280' }}>
                    {searchResults.is_online ? 'En ligne' : 'Hors ligne'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des amis */}
      <Card className="border-0 bg-black/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2" style={{ color: currentTheme.primaryColor }}>
            <Users className="w-4 h-4" />
            Mes Amis ({friends.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              Aucun ami ajouté pour le moment
            </p>
          ) : (
            <div className="space-y-2">
              {friends.map((friend, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{
                    backgroundColor: currentTheme.cardColor + '60'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: friend.is_online ? '#4ade80' : '#6b7280' }}
                    ></div>
                    <span className="text-sm" style={{ color: currentTheme.textColor }}>
                      {friend.username}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <Badge variant="outline" style={{ borderColor: currentTheme.primaryColor, color: currentTheme.primaryColor }}>
                      Lv.{getStatTotal(friend.stats)}
                    </Badge>
                    <Badge variant="outline" style={{ borderColor: '#4a90e2', color: '#4a90e2' }}>
                      {getEloTotal(friend.stats)} ELO
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Club */}
      <Card className="border-0 bg-black/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2" style={{ color: currentTheme.primaryColor }}>
            <Crown className="w-4 h-4" />
            Mon Club
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!club ? (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 text-center">
                Vous n'êtes membre d'aucun club
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowCreateClub(true)}
                  className="flex-1"
                  style={{ 
                    backgroundColor: currentTheme.primaryColor, 
                    color: currentTheme.backgroundColor 
                  }}
                >
                  Créer un Club
                </Button>
                <Button 
                  onClick={() => setShowJoinClub(true)}
                  variant="outline"
                  className="flex-1"
                  style={{ 
                    borderColor: currentTheme.primaryColor,
                    color: currentTheme.primaryColor
                  }}
                >
                  Rejoindre
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="font-medium" style={{ color: currentTheme.textColor }}>
                  {club.club.name}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Users className="w-3 h-3" style={{ color: currentTheme.primaryColor }} />
                  <span className="text-xs" style={{ color: currentTheme.textColor }}>
                    {club.members.length}/20 membres
                  </span>
                </div>
                {club.club.description && (
                  <p className="text-xs opacity-75 mt-1" style={{ color: currentTheme.textColor }}>
                    {club.club.description}
                  </p>
                )}
              </div>

              <div className="space-y-1 max-h-32 overflow-y-auto">
                {club.members.map((member, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between text-xs p-2 rounded"
                    style={{
                      backgroundColor: currentTheme.cardColor + '40'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {member.username === club.club.owner && (
                        <Crown className="w-3 h-3" style={{ color: '#ffd700' }} />
                      )}
                      <span style={{ color: currentTheme.textColor }}>
                        {member.username}
                      </span>
                    </div>
                    <Badge variant="outline" style={{ borderColor: currentTheme.primaryColor, color: currentTheme.primaryColor }}>
                      Lv.{getStatTotal(member.stats)}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button 
                onClick={leaveClub}
                variant="outline"
                className="w-full"
                style={{ 
                  borderColor: '#ef4444',
                  color: '#ef4444'
                }}
              >
                Quitter le Club
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Créer Club */}
      <Dialog open={showCreateClub} onOpenChange={setShowCreateClub}>
        <DialogContent 
          className="max-w-sm border-0 bg-black/90 backdrop-blur-sm"
          style={{ backgroundColor: currentTheme.cardColor + 'ee' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: currentTheme.primaryColor }}>
              Créer un Club
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clubName" style={{ color: currentTheme.textColor }}>
                Nom du club
              </Label>
              <Input
                id="clubName"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="Nom unique du club"
                style={{
                  backgroundColor: currentTheme.cardColor,
                  borderColor: currentTheme.primaryColor + '40',
                  color: currentTheme.textColor
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clubDesc" style={{ color: currentTheme.textColor }}>
                Description (optionnelle)
              </Label>
              <Textarea
                id="clubDesc"
                value={clubDescription}
                onChange={(e) => setClubDescription(e.target.value)}
                placeholder="Décrivez votre club..."
                rows={3}
                style={{
                  backgroundColor: currentTheme.cardColor,
                  borderColor: currentTheme.primaryColor + '40',
                  color: currentTheme.textColor
                }}
              />
            </div>

            <Button 
              onClick={createClub}
              disabled={!clubName.trim()}
              className="w-full"
              style={{ 
                backgroundColor: currentTheme.primaryColor, 
                color: currentTheme.backgroundColor 
              }}
            >
              Créer le Club
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Rejoindre Club */}
      <Dialog open={showJoinClub} onOpenChange={setShowJoinClub}>
        <DialogContent 
          className="max-w-sm border-0 bg-black/90 backdrop-blur-sm"
          style={{ backgroundColor: currentTheme.cardColor + 'ee' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: currentTheme.primaryColor }}>
              Rejoindre un Club
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={clubSearchTerm}
                onChange={(e) => setClubSearchTerm(e.target.value)}
                placeholder="Nom du club"
                className="flex-1"
                style={{
                  backgroundColor: currentTheme.cardColor,
                  borderColor: currentTheme.primaryColor + '40',
                  color: currentTheme.textColor
                }}
                onKeyPress={(e) => e.key === 'Enter' && searchClubs()}
              />
              <Button 
                onClick={searchClubs}
                style={{ 
                  backgroundColor: currentTheme.primaryColor, 
                  color: currentTheme.backgroundColor 
                }}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {clubSearchResults.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {clubSearchResults.map((clubResult, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 rounded border"
                    style={{
                      backgroundColor: currentTheme.cardColor + '60',
                      borderColor: currentTheme.primaryColor + '40'
                    }}
                  >
                    <div>
                      <div className="font-medium text-sm" style={{ color: currentTheme.textColor }}>
                        {clubResult.name}
                      </div>
                      <div className="text-xs opacity-75" style={{ color: currentTheme.textColor }}>
                        {clubResult.members.length}/20 membres
                      </div>
                    </div>
                    <Button
                      onClick={() => joinClub(clubResult.id)}
                      size="sm"
                      style={{ 
                        backgroundColor: currentTheme.primaryColor, 
                        color: currentTheme.backgroundColor 
                      }}
                    >
                      Rejoindre
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialTab;