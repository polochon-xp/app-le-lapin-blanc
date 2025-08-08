// Mock data pour l'application RPG de gamification - Joueur débutant

export const mockPlayer = {
  id: "player_1",
  name: "Novice-001",
  level: 1,
  totalXP: 25,
  xpToNextLevel: 75,
  health: 100,
  energy: 85,
  settings: {
    primaryColor: "#00ff41", // Matrix green
    theme: "matrix"
  }
};

export const mockStats = {
  travail: { level: 0, xp: 0, maxXp: 100 },
  sport: { level: 0, xp: 0, maxXp: 100 },
  creation: { level: 0, xp: 0, maxXp: 100 },
  lecture: { level: 0, xp: 0, maxXp: 100 }
};

export const mockDiscoveries = [
  {
    id: "d1",
    title: "Signal d'alarme détecté",
    description: "Des anomalies dans les communications mondiales suggèrent un événement majeur...",
    type: "signal",
    isNew: true,
    unlockedAt: new Date().toISOString(),
    rarity: "common",
    levelRequired: 0
  }
];

export const mockMissions = [];

export const mockArtifacts = [];

// Système d'histoire progressive complet
export const storyFragments = {
  0: {
    title: "L'Éveil",
    content: "Vous vous réveillez dans un monde où quelque chose a changé. Les écrans clignotent partout, les gens semblent anxieux. Un message cryptique apparaît : 'Le compte à rebours a commencé...'",
    discoveries: [
      {
        id: "d1",
        title: "Signal d'alarme détecté",
        description: "Des anomalies dans les communications mondiales suggèrent un événement majeur...",
        type: "signal",
        rarity: "common"
      }
    ]
  },
  5: {
    title: "Premières Anomalies",
    content: "Les journaux parlent d'un médicament révolutionnaire qui a changé l'humanité. Mais quelque chose ne va pas...",
    discoveries: [
      {
        id: "d2",
        title: "Article de journal déchiré",
        description: "'Compound-X : Le miracle médical qui a sauvé l'humanité de la maladie et de la vieillesse'",
        type: "document",
        rarity: "common"
      }
    ]
  },
  10: {
    title: "La Révélation Partielle",
    content: "Le Dr. Chen, inventeur du Compound-X, a disparu il y a 10 ans. Aujourd'hui, il réapparaît avec un message terrifiant...",
    discoveries: [
      {
        id: "d3",
        title: "Transmission Dr. Chen",
        description: "'Ceux qui ont pris ma création ont 15 ans pour me trouver, ou ils mourront tous.'",
        type: "audio",
        rarity: "rare"
      }
    ],
    artifacts: [
      {
        id: "a1",
        name: "Badge d'identification Dr. Chen",
        description: "Badge magnétique d'accès aux laboratoires Nexus Corp",
        rarity: "common",
        category: "access"
      }
    ]
  },
  15: {
    title: "Le Chaos Mondial",
    content: "Les gouvernements s'effondrent, l'économie s'effrite. Tous ceux qui ont pris le Compound-X réalisent qu'ils vont mourir dans 15 ans...",
    discoveries: [
      {
        id: "d4",
        title: "Rapports d'émeutes globales",
        description: "Le monde sombre dans le chaos alors que la vérité se répand",
        type: "news",
        rarity: "common"
      }
    ]
  },
  20: {
    title: "Votre Mission",
    content: "Vous réalisez que VOUS aussi avez pris le Compound-X. Votre mission devient claire : trouvez Dr. Chen avant qu'il ne soit trop tard.",
    discoveries: [
      {
        id: "d5",
        title: "Votre dossier médical",
        description: "Confirmation : vous avez reçu le Compound-X il y a 3 ans. Temps restant : 12 ans.",
        type: "medical",
        rarity: "legendary"
      }
    ],
    artifacts: [
      {
        id: "a2",
        name: "Votre certificat de traitement",
        description: "Preuve de votre traitement au Compound-X - Batch #X-2022",
        rarity: "legendary",
        category: "medical"
      }
    ]
  },
  25: {
    title: "Les Premiers Indices",
    content: "En fouillant les débris de la société, vous découvrez que Dr. Chen a laissé des indices pour ceux assez intelligents pour les suivre...",
    discoveries: [
      {
        id: "d6",
        title: "Code crypté dans les laboratoires",
        description: "Une séquence numérique gravée dans le béton : '47.6062° N, 122.3321° W'",
        type: "code",
        rarity: "rare"
      }
    ]
  },
  30: {
    title: "Le Réseau Souterrain",
    content: "Les coordonnées mènent à Seattle. Là, vous découvrez un réseau de laboratoires souterrains abandonnés...",
    discoveries: [
      {
        id: "d7",
        title: "Plans du complexe souterrain",
        description: "Blueprints d'un réseau de 15 niveaux sous la ville de Seattle",
        type: "blueprint",
        rarity: "rare"
      }
    ],
    artifacts: [
      {
        id: "a3",
        name: "Clé d'accès niveau -7",
        description: "Clé magnétique pour les sections de haute sécurité",
        rarity: "rare",
        category: "access"
      }
    ]
  },
  35: {
    title: "Les Autres Chercheurs",
    content: "Vous n'êtes pas seul. D'autres survivants cherchent Dr. Chen. Mais peut-on leur faire confiance ?",
    discoveries: [
      {
        id: "d8",
        title: "Messages des autres survivants",
        description: "Communications interceptées entre groupes de chercheurs rivaux",
        type: "communication",
        rarity: "common"
      }
    ]
  },
  40: {
    title: "Le Journal Personnel",
    content: "Vous trouvez le journal intime de Dr. Chen. Ses dernières entrées révèlent ses remords... et ses plans.",
    discoveries: [
      {
        id: "d9",
        title: "Journal du Dr. Chen",
        description: "'J'ai créé un monstre. Mais j'ai aussi créé un antidote. Il faut juste être assez fort pour le mériter.'",
        type: "diary",
        rarity: "legendary"
      }
    ],
    artifacts: [
      {
        id: "a4",
        name: "Journal personnel Dr. Chen",
        description: "Les pensées intimes du créateur du Compound-X",
        rarity: "legendary",
        category: "document"
      }
    ]
  },
  50: {
    title: "L'Antidote Existe",
    content: "L'antidote existe ! Mais Dr. Chen l'a caché dans un endroit que seuls les plus méritants peuvent atteindre...",
    discoveries: [
      {
        id: "d10",
        title: "Formule de l'antidote",
        description: "Partiellement révélée : 'Compound-Y nécessite [DONNÉES CORROMPUES] pour neutraliser X'",
        type: "formula",
        rarity: "legendary"
      }
    ]
  }
};

// Système de génération procédurale pour niveaux supérieurs
export const generateStoryForLevel = (level) => {
  if (level <= 50 && storyFragments[level]) {
    return storyFragments[level];
  }
  
  // Génération procédurale pour niveaux supérieurs
  const templates = [
    {
      title: "Nouveau Mystère Dévoilé",
      content: "À mesure que vous progressez, de nouveaux secrets émergent. Dr. Chen n'était qu'un pion dans un plan plus grand...",
      type: "mystery"
    },
    {
      title: "Conspiration Plus Large",
      content: "Une organisation secrète manipule les événements depuis des décennies. Leur vrai but commence à se révéler...",
      type: "conspiracy"
    },
    {
      title: "Autres Dimensions",
      content: "Les expériences de Dr. Chen ont ouvert des portails vers d'autres réalités. Certaines choses ont traversé...",
      type: "scifi"
    }
  ];
  
  const template = templates[Math.floor(level / 25) % templates.length];
  return {
    title: `${template.title} - Niveau ${level}`,
    content: template.content,
    discoveries: [{
      id: `d_gen_${level}`,
      title: `Indice mystérieux #${level}`,
      description: "Un nouveau fragment du puzzle s'ajoute à votre compréhension...",
      type: template.type,
      rarity: level % 20 === 0 ? "legendary" : level % 10 === 0 ? "rare" : "common"
    }]
  };
};

export const themes = {
  matrix: {
    name: "Matrix",
    primaryColor: "#00ff41",
    backgroundColor: "#0d1117",
    cardColor: "#161b22",
    textColor: "#00ff41",
    accentColor: "#238636"
  },
  retro: {
    name: "Retro Gaming",
    primaryColor: "#ff6b35",
    backgroundColor: "#1a0d00",
    cardColor: "#2d1a00",
    textColor: "#ff6b35",
    accentColor: "#ffaa00"
  },
};

// Techniques d'apprentissage pour l'onglet optimisation
export const learningTechniques = [
  {
    id: "anki",
    name: "ANKI-SPACED REPETITION",
    description: "Système d'espacement algorithmique pour maximiser la rétention mémorielle",
    category: "Mémorisation",
    need: "Rétention long terme",
    speed: "Moyen (4-8h)",
    volume: "Grand (>200 infos)",
    color: "#ff6b9d",
    instructions: [
      "Créer des cartes flash avec question/réponse simples",
      "Réviser quotidiennement selon l'algorithme SM-2",
      "Noter la difficulté après chaque carte (1-5)",
      "Laisser l'algorithme ajuster les intervalles automatiquement",
      "Maintenir des sessions courtes (15-30 min max)"
    ],
    tips: [
      "Utiliser des images et des mnémotechniques sur les cartes",
      "Créer des cartes pendant l'apprentissage initial, pas après",
      "Réviser même les cartes faciles pour maintenir la trace mnésique",
      "Synchroniser sur plusieurs appareils pour une révision constante"
    ]
  },
  {
    id: "feynman",
    name: "FEYNMAN TECHNIQUE 2.0",
    description: "Méthode d'explication simplifiée pour une compréhension profonde",
    category: "Compréhension",
    need: "Compréhension profonde",
    speed: "Rapide (1-4h)",
    volume: "Petit (10-50 infos)",
    color: "#4ecdc4",
    instructions: [
      "Choisir un concept complexe à maîtriser",
      "L'expliquer à voix haute comme à un enfant de 8 ans",
      "Identifier les zones de confusion ou d'hésitation",
      "Retourner aux sources pour combler les lacunes",
      "Répéter jusqu'à explication fluide et claire"
    ],
    tips: [
      "Enregistrer ses explications pour les réécouter",
      "Utiliser des analogies et métaphores simples",
      "Dessiner des schémas pendant l'explication",
      "Tester sur une vraie personne pour validation"
    ]
  },
  {
    id: "pomodoro",
    name: "POMODORO NEURAL",
    description: "Cycles d'attention optimisés basés sur les rythmes cérébraux",
    category: "Application",
    need: "Acquisition rapide",
    speed: "Ultra-rapide (< 1h)",
    volume: "Micro (<10 infos)",
    color: "#95e1d3",
    instructions: [
      "Définir une tâche d'apprentissage précise",
      "Travailler 25 minutes sans interruption",
      "Pause active de 5 minutes (mouvement physique)",
      "Répéter 4 cycles puis pause longue de 30 minutes",
      "Varier les types de tâches entre les cycles"
    ],
    tips: [
      "Désactiver toutes les notifications pendant les cycles",
      "Préparer tout le matériel avant de commencer",
      "Utiliser la pause pour faire des étirements",
      "Noter les distractions sans les suivre"
    ]
  }
];

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

export const unlockContentForLevel = (level) => {
  const storyData = generateStoryForLevel(level);
  
  // Ajouter les découvertes
  if (storyData.discoveries) {
    storyData.discoveries.forEach(discovery => {
      discovery.unlockedAt = new Date().toISOString();
      discovery.isNew = true;
      mockDiscoveries.push(discovery);
    });
  }
  
  // Ajouter les artefacts
  if (storyData.artifacts) {
    storyData.artifacts.forEach(artifact => {
      artifact.foundAt = new Date().toISOString();
      mockArtifacts.push(artifact);
    });
  }
  
  return storyData;
};

export const calculateMissionXP = (category, estimatedTime) => {
  // Calcul automatique des XP basé sur la catégorie et le temps
  const baseXP = {
    travail: 15,
    sport: 12,
    creation: 20,
    lecture: 18
  };
  
  const timeMultiplier = Math.max(1, Math.floor(estimatedTime / 15)); // +1 tous les 15 min
  return (baseXP[category] || 15) * timeMultiplier;
};