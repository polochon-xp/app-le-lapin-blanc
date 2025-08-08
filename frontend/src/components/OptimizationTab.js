import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Heart, 
  Brain, 
  Clock, 
  BarChart3, 
  TrendingUp,
  Lightbulb,
  Target,
  Zap,
  BookOpen,
  Filter,
  X
} from 'lucide-react';
import { learningTechniques } from '../data/mock';

const OptimizationTab = ({ currentTheme }) => {
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedNeed, setSelectedNeed] = useState('Tous');
  const [selectedSpeed, setSelectedSpeed] = useState('Tous');
  const [selectedVolume, setSelectedVolume] = useState('Tous');
  const [selectedFavorites, setSelectedFavorites] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedTechniques, setLikedTechniques] = useState(new Set());
  const [expandedTechnique, setExpandedTechnique] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Toutes', 'Mémorisation', 'Compréhension', 'Application', 'Créativité', 'Révision'];
  const needs = ['Tous', 'Rétention long terme', 'Acquisition rapide', 'Compréhension profonde', 'Application pratique', 'Synthèse créative'];
  const speeds = ['Tous', 'Ultra-rapide (< 1h)', 'Rapide (1-4h)', 'Moyen (4-8h)', 'Lent (> 8h)'];
  const volumes = ['Tous', 'Micro (<10 infos)', 'Petit (10-50 infos)', 'Moyen (50-200 infos)', 'Grand (>200 infos)'];
  const favorites = ['Tous', 'Favoris uniquement', 'Non favoris'];

  // Charger favoris depuis localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('learning_favorites');
    if (savedFavorites) {
      setLikedTechniques(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Sauvegarder favoris
  const saveFavorites = (newFavorites) => {
    localStorage.setItem('learning_favorites', JSON.stringify([...newFavorites]));
  };

  const toggleFavorite = (techniqueName) => {
    const newFavorites = new Set(likedTechniques);
    if (newFavorites.has(techniqueName)) {
      newFavorites.delete(techniqueName);
    } else {
      newFavorites.add(techniqueName);
    }
    setLikedTechniques(newFavorites);
    saveFavorites(newFavorites);
  };

  const getFilteredTechniques = () => {
    return learningTechniques.filter(technique => {
      const matchesCategory = selectedCategory === 'Toutes' || technique.category === selectedCategory;
      const matchesNeed = selectedNeed === 'Tous' || technique.need === selectedNeed;
      const matchesSpeed = selectedSpeed === 'Tous' || technique.speed === selectedSpeed;
      const matchesVolume = selectedVolume === 'Tous' || technique.volume === selectedVolume;
      const matchesSearch = searchQuery === '' || 
        technique.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        technique.description.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesFavorites = true;
      if (selectedFavorites === 'Favoris uniquement') {
        matchesFavorites = likedTechniques.has(technique.name);
      } else if (selectedFavorites === 'Non favoris') {
        matchesFavorites = !likedTechniques.has(technique.name);
      }

      return matchesCategory && matchesNeed && matchesSpeed && matchesVolume && matchesFavorites && matchesSearch;
    });
  };

  const FilterDropdown = ({ label, options, value, onChange, icon: Icon }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger 
        className="w-full h-9 text-xs border-0 bg-black/30 backdrop-blur-sm"
        style={{ color: currentTheme.textColor, backgroundColor: currentTheme.cardColor + '60' }}
      >
        <div className="flex items-center space-x-1">
          {Icon && <Icon className="w-3 h-3" />}
          <SelectValue placeholder={label} />
        </div>
      </SelectTrigger>
      <SelectContent className="border-0" style={{ backgroundColor: currentTheme.cardColor }}>
        {options.map(option => (
          <SelectItem key={option} value={option} className="text-xs">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const StatChip = ({ label, value, icon: Icon, color }) => (
    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-black/30 backdrop-blur-sm">
      <Icon className="w-4 h-4" style={{ color }} />
      <div className="text-center">
        <div className="text-sm font-bold" style={{ color }}>{value}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );

  const TechniqueCard = ({ technique }) => {
    const isLiked = likedTechniques.has(technique.name);
    const isExpanded = expandedTechnique === technique.id;

    return (
      <Card className="border-0 bg-black/40 backdrop-blur-sm mb-3">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-start space-x-3 flex-1">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: technique.color + '40' }}
              >
                <Brain className="w-4 h-4" style={{ color: technique.color }} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm mb-1" style={{ color: currentTheme.textColor }}>
                  {technique.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                  {technique.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge 
                    className="text-xs px-2 py-0 border-0"
                    style={{ backgroundColor: technique.color + '20', color: technique.color }}
                  >
                    {technique.category}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-0 border-0"
                    style={{ backgroundColor: currentTheme.accentColor + '20', color: currentTheme.accentColor }}
                  >
                    {technique.speed}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => toggleFavorite(technique.name)}
              className="p-2 h-auto ml-2"
            >
              <Heart 
                className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
                style={{ color: isLiked ? '#ff6b9d' : currentTheme.accentColor }}
              />
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => setExpandedTechnique(isExpanded ? null : technique.id)}
              className="text-xs h-7 px-3"
              style={{ color: currentTheme.primaryColor }}
            >
              {isExpanded ? 'Masquer' : 'Détails'}
            </Button>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <BarChart3 className="w-3 h-3" />
              <span>{technique.volume}</span>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 space-y-3 border-t pt-4" style={{ borderColor: currentTheme.accentColor + '20' }}>
              <div>
                <h4 className="font-medium text-xs mb-2 flex items-center" style={{ color: currentTheme.primaryColor }}>
                  <Target className="w-3 h-3 mr-1" />
                  Instructions
                </h4>
                <div className="space-y-1">
                  {technique.instructions.map((instruction, index) => (
                    <div key={index} className="text-xs p-2 rounded bg-black/30 text-gray-300">
                      {instruction}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-xs mb-2 flex items-center" style={{ color: currentTheme.accentColor }}>
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Conseils d'optimisation
                </h4>
                <div className="space-y-1">
                  {technique.tips.map((tip, index) => (
                    <div key={index} className="text-xs p-2 rounded flex items-start space-x-2" 
                         style={{ backgroundColor: currentTheme.accentColor + '10' }}>
                      <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: currentTheme.accentColor }} />
                      <span className="text-gray-300">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const filteredTechniques = getFilteredTechniques();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
          <h2 className="text-lg font-bold" style={{ color: currentTheme.primaryColor }}>
            Optimisation Cognitive
          </h2>
        </div>
        <p className="text-xs text-gray-400">
          Techniques d'apprentissage avancées pour optimiser vos performances
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Rechercher une technique..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-0 bg-black/30 backdrop-blur-sm text-sm h-10"
          style={{ 
            backgroundColor: currentTheme.cardColor + '60',
            color: currentTheme.textColor 
          }}
        />
      </div>

      {/* Filters Toggle */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          className="text-xs h-8 px-3"
          style={{ color: currentTheme.primaryColor }}
        >
          <Filter className="w-3 h-3 mr-1" />
          Filtres {showFilters ? '▲' : '▼'}
        </Button>
        
        {/* Stats */}
        <div className="flex space-x-3">
          <StatChip 
            label="Total" 
            value={learningTechniques.length} 
            icon={BookOpen} 
            color={currentTheme.primaryColor} 
          />
          <StatChip 
            label="Favoris" 
            value={likedTechniques.size} 
            icon={Heart} 
            color="#ff6b9d" 
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-3 p-3 rounded-lg bg-black/20 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-2">
            <FilterDropdown
              label="Besoin"
              options={needs}
              value={selectedNeed}
              onChange={setSelectedNeed}
              icon={Target}
            />
            <FilterDropdown
              label="Rapidité"
              options={speeds}
              value={selectedSpeed}
              onChange={setSelectedSpeed}
              icon={Clock}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <FilterDropdown
              label="Volume"
              options={volumes}
              value={selectedVolume}
              onChange={setSelectedVolume}
              icon={BarChart3}
            />
            <FilterDropdown
              label="Favoris"
              options={favorites}
              value={selectedFavorites}
              onChange={setSelectedFavorites}
              icon={Heart}
            />
          </div>
          
          <FilterDropdown
            label="Catégorie"
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            icon={Brain}
          />

          {/* Reset Filters */}
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedCategory('Toutes');
              setSelectedNeed('Tous');
              setSelectedSpeed('Tous');
              setSelectedVolume('Tous');
              setSelectedFavorites('Tous');
              setSearchQuery('');
            }}
            className="w-full text-xs h-8"
            style={{ color: currentTheme.accentColor }}
          >
            <X className="w-3 h-3 mr-1" />
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>{filteredTechniques.length} technique(s) trouvée(s)</span>
        <span>Filtrées: {filteredTechniques.length}/{learningTechniques.length}</span>
      </div>

      {/* Techniques List */}
      <div className="space-y-3">
        {filteredTechniques.length === 0 ? (
          <Card className="border-0 bg-black/40 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" style={{ color: currentTheme.primaryColor }} />
              <p className="text-sm text-gray-400 mb-2">Aucune technique trouvée</p>
              <p className="text-xs text-gray-500">Essayez de modifier vos filtres de recherche</p>
            </CardContent>
          </Card>
        ) : (
          filteredTechniques.map(technique => (
            <TechniqueCard key={technique.id} technique={technique} />
          ))
        )}
      </div>
    </div>
  );
};

export default OptimizationTab;