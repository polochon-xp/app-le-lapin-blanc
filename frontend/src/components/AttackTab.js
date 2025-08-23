import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sword, Target, Zap, Shield, Users, AlertTriangle } from 'lucide-react';

const AttackTab = ({ currentTheme }) => {
  const [userAttacks, setUserAttacks] = useState([]);
  const [allAttacks, setAllAttacks] = useState([]);
  const [showAttackModal, setShowAttackModal] = useState(false);
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [targetUsername, setTargetUsername] = useState('');
  const [targetStat, setTargetStat] = useState('');
  const [effectTarget, setEffectTarget] = useState('elo');
  const [loading, setLoading] = useState(false);
  const [pendingAttacks, setPendingAttacks] = useState([]);

  // Récupérer les attaques disponibles
  useEffect(() => {
    fetchUserAttacks();
    fetchAllAttacks();
    fetchPendingAttacks();
  }, []);

  const fetchUserAttacks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/attacks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserAttacks(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des attaques:', error);
    }
  };

  const fetchAllAttacks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/attacks`);
      if (response.ok) {
        const data = await response.json();
        setAllAttacks(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les attaques:', error);
    }
  };

  const fetchPendingAttacks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/pending-attacks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingAttacks(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des attaques en attente:', error);
    }
  };

  const useAttack = async () => {
    if (!selectedAttack || !targetUsername || !effectTarget) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/attack`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          target_username: targetUsername,
          attack_id: selectedAttack.id,
          target_stat: targetStat,
          effect_target: effectTarget
        })
      });

      if (response.ok) {
        setShowAttackModal(false);
        setSelectedAttack(null);
        setTargetUsername('');
        setTargetStat('');
        fetchUserAttacks(); // Refresh la liste
        alert('Attaque envoyée avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.detail}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'attaque:', error);
      alert('Erreur lors de l\'envoi de l\'attaque');
    }
    setLoading(false);
  };

  const applyPendingAttacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/apply-pending-attacks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${data.total_attacks} attaques appliquées !`);
        fetchPendingAttacks(); // Refresh
      }
    } catch (error) {
      console.error('Erreur lors de l\'application des attaques:', error);
    }
  };

  const getEffectIcon = (effectType) => {
    switch (effectType) {
      case 'elo_loss':
      case 'elo_steal':
        return <Target className="w-4 h-4" />;
      case 'energy_drain':
      case 'energy_reset':
        return <Zap className="w-4 h-4" />;
      case 'health_loss':
      case 'health_percentage':
        return <Shield className="w-4 h-4" />;
      default:
        return <Sword className="w-4 h-4" />;
    }
  };

  const getEffectColor = (effectType) => {
    switch (effectType) {
      case 'elo_loss':
      case 'elo_steal':
        return '#ff6b35';
      case 'energy_drain':
      case 'energy_reset':
        return '#4a90e2';
      case 'health_loss':
      case 'health_percentage':
        return '#e74c3c';
      default:
        return currentTheme.primaryColor;
    }
  };

  return (
    <div className="space-y-4">
      {/* Attaques en attente */}
      {pendingAttacks.length > 0 && (
        <Card className="border-0 bg-red-900/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2" style={{ color: '#ff6b35' }}>
              <AlertTriangle className="w-4 h-4" />
              Attaques Reçues ({pendingAttacks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingAttacks.slice(0, 3).map((attack, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span style={{ color: currentTheme.textColor }}>
                  {attack.attacker}: {attack.attack.name}
                </span>
                <Badge variant="outline" style={{ borderColor: '#ff6b35', color: '#ff6b35' }}>
                  {attack.effect_target === 'elo' ? 'ELO' : 'Niveau'}
                </Badge>
              </div>
            ))}
            <Button 
              onClick={applyPendingAttacks}
              className="w-full mt-2"
              style={{ 
                backgroundColor: '#ff6b35', 
                color: 'white' 
              }}
            >
              Appliquer les Effets
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mes attaques disponibles */}
      <Card className="border-0 bg-black/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm" style={{ color: currentTheme.primaryColor }}>
            Mes Cartes d'Attaque ({userAttacks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userAttacks.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              Aucune attaque disponible. Montez de niveau pour en gagner !
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {userAttacks.map((attack, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedAttack(attack);
                    setShowAttackModal(true);
                  }}
                  className="cursor-pointer p-2 rounded-lg border hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: currentTheme.cardColor + '60',
                    borderColor: getEffectColor(attack.effect_type) + '40'
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getEffectIcon(attack.effect_type)}
                    <span className="text-xs font-medium" style={{ color: currentTheme.textColor }}>
                      {attack.name}
                    </span>
                  </div>
                  <p className="text-xs opacity-75 line-clamp-2" style={{ color: currentTheme.textColor }}>
                    {attack.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        borderColor: getEffectColor(attack.effect_type),
                        color: getEffectColor(attack.effect_type)
                      }}
                    >
                      {attack.effect_value}
                    </Badge>
                    {attack.duration_hours > 0 && (
                      <span className="text-xs opacity-60" style={{ color: currentTheme.textColor }}>
                        {attack.duration_hours}h
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'attaque */}
      <Dialog open={showAttackModal} onOpenChange={setShowAttackModal}>
        <DialogContent 
          className="max-w-sm border-0 bg-black/90 backdrop-blur-sm"
          style={{ backgroundColor: currentTheme.cardColor + 'ee' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: currentTheme.primaryColor }}>
              Utiliser: {selectedAttack?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-xs opacity-75" style={{ color: currentTheme.textColor }}>
              {selectedAttack?.description}
            </div>

            <div className="space-y-2">
              <Label htmlFor="target" style={{ color: currentTheme.textColor }}>
                Cible (nom d'utilisateur)
              </Label>
              <Input
                id="target"
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value)}
                placeholder="Nom de l'adversaire"
                style={{
                  backgroundColor: currentTheme.cardColor,
                  borderColor: currentTheme.primaryColor + '40',
                  color: currentTheme.textColor
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stat" style={{ color: currentTheme.textColor }}>
                Stat ciblée (optionnel)
              </Label>
              <Select value={targetStat} onValueChange={setTargetStat}>
                <SelectTrigger style={{
                  backgroundColor: currentTheme.cardColor,
                  borderColor: currentTheme.primaryColor + '40',
                  color: currentTheme.textColor
                }}>
                  <SelectValue placeholder="Choisir une stat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les stats</SelectItem>
                  <SelectItem value="travail">Travail</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="creation">Création</SelectItem>
                  <SelectItem value="lecture">Lecture</SelectItem>
                  <SelectItem value="adaptabilite">Adaptabilité</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="effect" style={{ color: currentTheme.textColor }}>
                Cible de l'effet
              </Label>
              <Select value={effectTarget} onValueChange={setEffectTarget}>
                <SelectTrigger style={{
                  backgroundColor: currentTheme.cardColor,
                  borderColor: currentTheme.primaryColor + '40',
                  color: currentTheme.textColor
                }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elo">ELO</SelectItem>
                  <SelectItem value="level">Niveau</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={useAttack}
              disabled={loading || !targetUsername}
              className="w-full"
              style={{ 
                backgroundColor: currentTheme.primaryColor, 
                color: currentTheme.backgroundColor 
              }}
            >
              {loading ? 'Envoi...' : 'Lancer l\'Attaque'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttackTab;