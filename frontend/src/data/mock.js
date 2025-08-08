// Mock data pour l'application RPG de gamification

export const mockPlayer = {
  id: "player_1",
  name: "Chercheur X-42",
  level: 42,
  totalXP: 15750,
  xpToNextLevel: 250,
  health: 85,
  energy: 70,
  settings: {
    primaryColor: "#00ff41", // Matrix green
    theme: "matrix"
  }
};

export const mockStats = {
  analyseTech: { level: 35, xp: 8750, maxXp: 10000 },
  endurance: { level: 28, xp: 6200, maxXp: 7000 },
  innovation: { level: 41, xp: 9850, maxXp: 10250 },
  documentation: { level: 37, xp: 8100, maxXp: 9250 },
  adaptabilite: { level: 29, xp: 6800, maxXp: 7250 }
};

export const mockDiscoveries = [
  {
    id: "d1",
    title: "Enregistrement Lab-7",
    description: "Un message cryptique du savant avant sa disparition...",
    type: "audio",
    isNew: true,
    unlockedAt: "2025-01-15T10:30:00Z",
    rarity: "rare"
  },
  {
    id: "d2", 
    title: "Photo floue - Bunker",
    description: "Installation souterraine non répertoriée. Coordonnées: [CRYPTÉ]",
    type: "image",
    isNew: false,
    unlockedAt: "2025-01-14T15:45:00Z",
    rarity: "common"
  },
  {
    id: "d3",
    title: "Connexion avec Projet X",
    description: "Les recherches sur l'immortalité liées à d'autres expériences...",
    type: "theory",
    isNew: true,
    unlockedAt: "2025-01-15T14:20:00Z",
    rarity: "legendary"
  }
];

export const mockMissions = [
  {
    id: "m1",
    title: "Analyser les données du serveur",
    description: "Examiner les logs du serveur principal pour des anomalies",
    category: "analyseTech",
    xpReward: 50,
    type: "daily",
    status: "active",
    progress: 80,
    deadline: "2025-01-15T23:59:59Z",
    estimatedTime: 45 // minutes
  },
  {
    id: "m2",
    title: "Session d'entraînement physique",
    description: "Maintenir la forme physique pour les explorations",
    category: "endurance",
    xpReward: 35,
    type: "daily",
    status: "pending",
    progress: 0,
    deadline: "2025-01-15T23:59:59Z",
    estimatedTime: 30
  },
  {
    id: "m3",
    title: "Développer nouveau prototype",
    description: "Créer un dispositif de détection des anomalies",
    category: "innovation",
    xpReward: 75,
    type: "weekly",
    weekDay: "tuesday",
    status: "pending",
    progress: 0,
    deadline: "2025-01-21T23:59:59Z",
    estimatedTime: 90
  },
  {
    id: "m4",
    title: "Inspection laboratoire abandonné",
    description: "Mission spéciale : explorer le site de recherche désaffecté",
    category: "adaptabilite",
    xpReward: 120,
    type: "once",
    specificDate: "2025-01-18",
    status: "pending",
    progress: 0,
    deadline: "2025-01-18T23:59:59Z",
    estimatedTime: 180
  }
];

export const mockArtifacts = [
  {
    id: "a1",
    name: "Clé USB cryptée",
    description: "Données corrompues récupérées du laboratoire principal",
    rarity: "rare",
    foundAt: "2025-01-12T09:15:00Z",
    category: "data"
  },
  {
    id: "a2",
    name: "Badge d'accès Niveau 7",
    description: "Autorisation d'accès aux secteurs de haute sécurité",
    rarity: "common",
    foundAt: "2025-01-10T16:30:00Z",
    category: "access"
  },
  {
    id: "a3",
    name: "Échantillon Compound-X",
    description: "Fragment du médicament original. Analyse en cours...",
    rarity: "legendary",
    foundAt: "2025-01-14T20:45:00Z",
    category: "sample"
  },
  {
    id: "a4",
    name: "Journal personnel - Dr. Evelyn",
    description: "Notes personnelles de l'assistante du savant",
    rarity: "rare",
    foundAt: "2025-01-13T12:00:00Z", 
    category: "document"
  }
];

export const mockStoryFragments = [
  {
    level: 1,
    title: "Le Commencement",
    content: "Vous vous réveillez dans un monde étrange. Les journaux parlent de disparitions mystérieuses..."
  },
  {
    level: 10,
    title: "Première Révélation",
    content: "Les indices pointent vers un laboratoire pharmaceutique. Le Dr. Chen semble être au cœur du mystère..."
  },
  {
    level: 25,
    title: "La Découverte",
    content: "Le Compound-X n'était pas seulement un médicament. C'était une expérience à l'échelle mondiale..."
  },
  {
    level: 42,
    title: "L'Annonce",
    content: "TRANSMISSION GLOBALE DÉTECTÉE: 'Ceux qui ont pris ma création ont 15 ans pour me trouver...'"
  }
];

export const themes = {
  matrix: {
    name: "Matrix",
    primaryColor: "#00ff41",
    backgroundColor: "#0d1117",
    cardColor: "#161b22",
    textColor: "#00ff41",
    accentColor: "#238636"
  },
  laboratory: {
    name: "Laboratoire",
    primaryColor: "#3b82f6",
    backgroundColor: "#111827",
    cardColor: "#1f2937",
    textColor: "#3b82f6",
    accentColor: "#60a5fa"
  },
  danger: {
    name: "Zone de Danger",
    primaryColor: "#ef4444",
    backgroundColor: "#1c1917",
    cardColor: "#292524",
    textColor: "#ef4444",
    accentColor: "#f87171"
  }
};

// Fonctions utilitaires pour simuler le comportement
export const updateMissionProgress = (missionId, progress) => {
  const mission = mockMissions.find(m => m.id === missionId);
  if (mission) {
    mission.progress = Math.min(100, progress);
    mission.status = progress >= 100 ? "completed" : "active";
  }
  return mission;
};

export const addXPToStat = (category, xp) => {
  const stat = mockStats[category];
  if (stat) {
    stat.xp += xp;
    while (stat.xp >= stat.maxXp) {
      stat.xp -= stat.maxXp;
      stat.level++;
      stat.maxXp = Math.floor(stat.maxXp * 1.1); // 10% increase per level
    }
  }
  return stat;
};

export const getRandomArtifact = () => {
  const rarityChances = { common: 0.6, rare: 0.3, legendary: 0.1 };
  const rand = Math.random();
  let rarity = "common";
  
  if (rand > 0.9) rarity = "legendary";
  else if (rand > 0.6) rarity = "rare";
  
  return {
    id: `a_${Date.now()}`,
    name: "Nouvel Artefact",
    description: "Un objet mystérieux découvert lors de votre mission",
    rarity,
    foundAt: new Date().toISOString(),
    category: "mystery"
  };
};