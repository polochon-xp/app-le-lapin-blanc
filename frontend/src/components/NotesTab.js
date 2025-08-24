import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Tag, 
  BookOpen,
  Palette,
  Clock,
  Star,
  Archive,
  Filter
} from 'lucide-react';

const NotesTab = ({ currentTheme }) => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'general', name: 'General', color: '#ff6b35', icon: '📝' },
    { id: 'ideas', name: 'Idées', color: '#fbbf24', icon: '💡' },
    { id: 'important', name: 'Important', color: '#ef4444', icon: '⚠️' },
    { id: 'personal', name: 'Personnel', color: '#06b6d4', icon: '👤' }
  ]);
  const [tags, setTags] = useState(['urgent', 'projet', 'inspiration', 'todo']);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: [],
    color: '',
    isPinned: false
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#ff6b35',
    icon: '📝'
  });

  // Charger les notes depuis localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedCategories = localStorage.getItem('noteCategories');
    const savedTags = localStorage.getItem('noteTags');

    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedTags) setTags(JSON.parse(savedTags));
  }, []);

  // Sauvegarder les notes dans localStorage
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('noteCategories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('noteTags', JSON.stringify(tags));
  }, [tags]);

  const handleCreateNote = () => {
    const note = {
      id: Date.now(),
      ...newNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({
      title: '',
      content: '',
      category: 'general',
      tags: [],
      color: '',
      isPinned: false
    });
    setShowCreateNote(false);
  };

  const handleEditNote = (note) => {
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags || [],
      color: note.color || '',
      isPinned: note.isPinned || false
    });
    setEditingNote(note);
    setShowCreateNote(true);
  };

  const handleUpdateNote = () => {
    setNotes(prev => prev.map(note => 
      note.id === editingNote.id 
        ? { ...note, ...newNote, updatedAt: new Date().toISOString() }
        : note
    ));
    setEditingNote(null);
    setNewNote({
      title: '',
      content: '',
      category: 'general',
      tags: [],
      color: '',
      isPinned: false
    });
    setShowCreateNote(false);
  };

  const handleDeleteNote = (noteId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  const togglePinNote = (noteId) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, isPinned: !note.isPinned }
        : note
    ));
  };

  const handleCreateCategory = () => {
    const category = {
      id: Date.now(),
      ...newCategory
    };
    setCategories(prev => [...prev, category]);
    setNewCategory({ name: '', color: '#ff6b35', icon: '📝' });
    setShowCreateCategory(false);
  };

  const addTag = (tagName) => {
    if (tagName && !tags.includes(tagName)) {
      setTags(prev => [...prev, tagName]);
    }
  };

  const toggleNoteTag = (tagName) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter(t => t !== tagName)
        : [...prev.tags, tagName]
    }));
  };

  // Filtrage des notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const matchesTag = selectedTag === 'all' || (note.tags && note.tags.includes(selectedTag));
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Trier les notes (épinglées en premier)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Aujourd'hui";
    if (diffDays === 2) return "Hier";
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const getCategoryById = (id) => categories.find(cat => cat.id === id) || categories[0];

  return (
    <div className="space-y-4">
      {/* Barre de recherche et filtres */}
      <Card className="border-0 bg-black/40 backdrop-blur-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans les notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                style={{
                  backgroundColor: currentTheme.backgroundColor + '80',
                  borderColor: currentTheme.primaryColor + '40',
                  color: currentTheme.textColor
                }}
              />
            </div>
            <Button
              onClick={() => setShowCreateNote(true)}
              style={{ 
                backgroundColor: currentTheme.primaryColor, 
                color: currentTheme.backgroundColor 
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Note
            </Button>
          </div>

          {/* Filtres */}
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              style={{
                backgroundColor: selectedCategory === 'all' ? currentTheme.primaryColor : 'transparent',
                borderColor: currentTheme.primaryColor,
                color: selectedCategory === 'all' ? 'white' : currentTheme.primaryColor
              }}
            >
              Toutes
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                  borderColor: category.color,
                  color: selectedCategory === category.id ? 'white' : category.color
                }}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateCategory(true)}
              style={{ color: currentTheme.textColor + '80' }}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grille des notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: currentTheme.primaryColor }} />
            <p className="text-lg mb-2" style={{ color: currentTheme.textColor }}>
              Aucune note
            </p>
            <p className="text-sm opacity-75" style={{ color: currentTheme.textColor }}>
              Créez votre première note pour commencer
            </p>
          </div>
        ) : (
          sortedNotes.map(note => {
            const category = getCategoryById(note.category);
            return (
              <Card 
                key={note.id}
                className={`border-0 cursor-pointer transition-all hover:scale-105 ${
                  note.isPinned ? 'ring-2' : ''
                }`}
                style={{
                  backgroundColor: note.color || currentTheme.cardColor + '80',
                  ringColor: currentTheme.primaryColor,
                  borderLeft: `4px solid ${category.color}`
                }}
                onClick={() => handleEditNote(note)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <span>{category.icon}</span>
                      <CardTitle 
                        className="text-sm line-clamp-1" 
                        style={{ color: currentTheme.textColor }}
                      >
                        {note.title || 'Note sans titre'}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      {note.isPinned && (
                        <Star className="w-3 h-3" style={{ color: currentTheme.primaryColor }} />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinNote(note.id);
                        }}
                        style={{ color: currentTheme.textColor + '60' }}
                      >
                        <Star className={`w-3 h-3 ${note.isPinned ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p 
                    className="text-sm line-clamp-4 opacity-90" 
                    style={{ color: currentTheme.textColor }}
                  >
                    {note.content || 'Aucun contenu'}
                  </p>
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs"
                          style={{ 
                            borderColor: category.color + '60',
                            color: category.color
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs opacity-60">
                    <div className="flex items-center gap-1" style={{ color: currentTheme.textColor }}>
                      <Clock className="w-3 h-3" />
                      {formatDate(note.updatedAt)}
                    </div>
                    <Badge 
                      variant="outline" 
                      style={{ borderColor: category.color, color: category.color }}
                    >
                      {category.name}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal de création/édition de note */}
      <Dialog open={showCreateNote} onOpenChange={setShowCreateNote}>
        <DialogContent 
          className="max-w-2xl border-0 bg-black/95 backdrop-blur-sm max-h-[80vh] overflow-y-auto"
          style={{ backgroundColor: currentTheme.cardColor + 'f0' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: currentTheme.primaryColor }}>
              {editingNote ? 'Modifier la note' : 'Nouvelle note'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Titre */}
            <div>
              <Label htmlFor="title" style={{ color: currentTheme.textColor }}>
                Titre
              </Label>
              <Input
                id="title"
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de la note..."
                style={{
                  backgroundColor: currentTheme.backgroundColor,
                  borderColor: currentTheme.primaryColor + '40',
                  color: currentTheme.textColor
                }}
              />
            </div>

            {/* Catégorie et couleur */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ color: currentTheme.textColor }}>Catégorie</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={newNote.category === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewNote(prev => ({ ...prev, category: category.id }))}
                      style={{
                        backgroundColor: newNote.category === category.id ? category.color : 'transparent',
                        borderColor: category.color,
                        color: newNote.category === category.id ? 'white' : category.color
                      }}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label style={{ color: currentTheme.textColor }}>Couleur (optionnelle)</Label>
                <div className="flex gap-2 mt-2">
                  {['', '#ff6b35', '#fbbf24', '#4ade80', '#06b6d4', '#8b5cf6', '#ef4444'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNewNote(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded border-2 ${newNote.color === color ? 'ring-2' : ''}`}
                      style={{ 
                        backgroundColor: color || currentTheme.backgroundColor,
                        borderColor: currentTheme.primaryColor + '40',
                        ringColor: currentTheme.primaryColor
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div>
              <Label htmlFor="content" style={{ color: currentTheme.textColor }}>
                Contenu
              </Label>
              <Textarea
                id="content"
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Écrivez votre note ici..."
                rows={8}
                style={{
                  backgroundColor: currentTheme.backgroundColor,
                  borderColor: currentTheme.primaryColor + '40',
                  color: currentTheme.textColor
                }}
              />
            </div>

            {/* Tags */}
            <div>
              <Label style={{ color: currentTheme.textColor }}>Étiquettes</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    variant={newNote.tags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleNoteTag(tag)}
                    style={{
                      backgroundColor: newNote.tags.includes(tag) ? currentTheme.primaryColor : 'transparent',
                      borderColor: currentTheme.primaryColor,
                      color: newNote.tags.includes(tag) ? 'white' : currentTheme.primaryColor
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setNewNote(prev => ({ ...prev, isPinned: !prev.isPinned }))}
                style={{ color: newNote.isPinned ? currentTheme.primaryColor : currentTheme.textColor + '80' }}
              >
                <Star className={`w-4 h-4 mr-2 ${newNote.isPinned ? 'fill-current' : ''}`} />
                {newNote.isPinned ? 'Épinglée' : 'Épingler'}
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateNote(false);
                    setEditingNote(null);
                    setNewNote({
                      title: '',
                      content: '',
                      category: 'general',
                      tags: [],
                      color: '',
                      isPinned: false
                    });
                  }}
                  style={{ borderColor: currentTheme.textColor + '40', color: currentTheme.textColor }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={editingNote ? handleUpdateNote : handleCreateNote}
                  disabled={!newNote.title.trim()}
                  style={{ 
                    backgroundColor: currentTheme.primaryColor, 
                    color: 'white',
                    opacity: newNote.title.trim() ? 1 : 0.5
                  }}
                >
                  {editingNote ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de création de catégorie */}
      <Dialog open={showCreateCategory} onOpenChange={setShowCreateCategory}>
        <DialogContent 
          className="max-w-sm border-0 bg-black/95 backdrop-blur-sm"
          style={{ backgroundColor: currentTheme.cardColor + 'f0' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: currentTheme.primaryColor }}>
              Nouvelle catégorie
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="catName" style={{ color: currentTheme.textColor }}>
                Nom
              </Label>
              <Input
                id="catName"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Projets"
                style={{
                  backgroundColor: currentTheme.backgroundColor,
                  borderColor: currentTheme.primaryColor + '40',
                  color: currentTheme.textColor
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ color: currentTheme.textColor }}>Icône</Label>
                <Input
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="📁"
                  className="text-center"
                  style={{
                    backgroundColor: currentTheme.backgroundColor,
                    borderColor: currentTheme.primaryColor + '40',
                    color: currentTheme.textColor
                  }}
                />
              </div>

              <div>
                <Label style={{ color: currentTheme.textColor }}>Couleur</Label>
                <div className="flex gap-1 mt-2">
                  {['#ff6b35', '#fbbf24', '#4ade80', '#06b6d4', '#8b5cf6', '#ef4444'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                      className={`w-6 h-6 rounded border ${newCategory.color === color ? 'ring-2' : ''}`}
                      style={{ 
                        backgroundColor: color,
                        borderColor: currentTheme.primaryColor + '40',
                        ringColor: currentTheme.primaryColor
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateCategory(false)}
                className="flex-1"
                style={{ borderColor: currentTheme.textColor + '40', color: currentTheme.textColor }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateCategory}
                disabled={!newCategory.name.trim()}
                className="flex-1"
                style={{ 
                  backgroundColor: currentTheme.primaryColor, 
                  color: 'white',
                  opacity: newCategory.name.trim() ? 1 : 0.5
                }}
              >
                Créer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesTab;