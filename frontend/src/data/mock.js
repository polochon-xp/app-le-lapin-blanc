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

export const mockMissions = [
  {
    id: "test_1",
    title: "Mission simple",
    description: "Seulement bouton Fini",
    category: "travail",
    hasTimer: false,
    xpReward: 35,
    status: "pending",
    progress: 0,
    type: "daily",
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "test_2", 
    title: "Mission avec timer",
    description: "Timer + bouton Fini",
    category: "sport",
    hasTimer: true,
    estimatedTime: 20,
    xpReward: 40,
    status: "pending", 
    progress: 0,
    type: "daily",
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
];

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

// Techniques d'apprentissage complètes - Toutes les méthodes intégrées
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
  },
  {
    id: "mindmap",
    name: "MIND MAPPING DIGITAL",
    description: "Cartographie mentale pour structurer et connecter les connaissances",
    category: "Compréhension",
    need: "Compréhension profonde",
    speed: "Rapide (1-4h)",
    volume: "Moyen (50-200 infos)",
    color: "#b19cd9",
    instructions: [
      "Placer le sujet principal au centre",
      "Créer des branches pour les concepts majeurs",
      "Ajouter des sous-branches pour les détails",
      "Utiliser couleurs et icônes pour catégoriser",
      "Connecter les concepts liés par des flèches"
    ],
    tips: [
      "Utiliser des mots-clés plutôt que des phrases",
      "Intégrer des images et symboles visuels",
      "Réviser et réorganiser régulièrement",
      "Créer des mind maps collaboratives pour projets groupe"
    ]
  },
  {
    id: "activerecall",
    name: "ACTIVE RECALL MATRIX",
    description: "Tests auto-générés pour renforcer la récupération active",
    category: "Révision",
    need: "Rétention long terme",
    speed: "Moyen (4-8h)",
    volume: "Grand (>200 infos)",
    color: "#ffcc5c",
    instructions: [
      "Créer questions après chaque section étudiée",
      "Fermer les notes et répondre de mémoire",
      "Vérifier et corriger les réponses",
      "Marquer les questions échouées pour révision",
      "Répéter le processus avec intervalles croissants"
    ],
    tips: [
      "Varier les types de questions (QCM, ouvertes, schémas)",
      "Créer des questions prédictives sur les examens",
      "Utiliser des outils comme Quizlet ou Anki",
      "Pratiquer la récupération dans différents contextes"
    ]
  },
  {
    id: "chunking",
    name: "CHUNKING ALGORITHM",
    description: "Découpage intelligent de l'information en unités mémorisables",
    category: "Mémorisation",
    need: "Acquisition rapide",
    speed: "Rapide (1-4h)",
    volume: "Moyen (50-200 infos)",
    color: "#96ceb4",
    instructions: [
      "Identifier les unités naturelles d'information",
      "Regrouper 5-9 éléments maximum par chunk",
      "Créer des liens logiques entre les chunks",
      "Pratiquer la récupération chunk par chunk",
      "Assembler progressivement les chunks ensemble"
    ],
    tips: [
      "Utiliser des acronymes pour mémoriser les chunks",
      "Créer des histoires reliant les différents chunks",
      "Visualiser les chunks sous forme de blocs colorés",
      "Pratiquer l'ordre et le désordre des chunks"
    ]
  },
  {
    id: "interleaving",
    name: "INTERLEAVING PRACTICE",
    description: "Alternance de sujets pour améliorer la discrimination et transfert",
    category: "Application",
    need: "Application pratique",
    speed: "Lent (> 8h)",
    volume: "Grand (>200 infos)",
    color: "#85a3e0",
    instructions: [
      "Identifier 3-4 sujets/compétences liés",
      "Étudier chaque sujet 15-20 minutes",
      "Changer de sujet sans finir complètement",
      "Revenir au premier sujet après rotation",
      "Mélanger l'ordre des sujets à chaque session"
    ],
    tips: [
      "Choisir des sujets avec des similarités et différences",
      "Noter les confusions pour les clarifier",
      "Varier les types d'exercices pour chaque sujet",
      "Utiliser des minuteurs pour forcer les transitions"
    ]
  },
  {
    id: "dualcoding",
    name: "DUAL CODING THEORY",
    description: "Combinaison visuel-verbal pour optimiser l'encodage mnésique",
    category: "Mémorisation",
    need: "Rétention long terme",
    speed: "Rapide (1-4h)",
    volume: "Petit (10-50 infos)",
    color: "#ff9a9e",
    instructions: [
      "Lire l'information textuelle à voix haute",
      "Créer une représentation visuelle (schéma, image)",
      "Associer chaque élément visuel à sa description verbale",
      "Pratiquer la récupération par les deux canaux",
      "Créer des liens entre représentations visuelles et verbales"
    ],
    tips: [
      "Utiliser des couleurs différentes pour chaque concept",
      "Créer des symboles personnels récurrents",
      "Associer des gestes aux concepts abstraits",
      "Utiliser la méthode des loci pour spatialiser"
    ]
  },
  {
    id: "metacognitive",
    name: "METACOGNITIVE MONITORING",
    description: "Surveillance et ajustement des stratégies d'apprentissage",
    category: "Révision",
    need: "Compréhension profonde",
    speed: "Moyen (4-8h)",
    volume: "Moyen (50-200 infos)",
    color: "#8fcaca",
    instructions: [
      "Évaluer sa compréhension avant, pendant et après",
      "Identifier les stratégies qui fonctionnent le mieux",
      "Ajuster les méthodes selon les résultats obtenus",
      "Tenir un journal d'apprentissage détaillé",
      "Planifier les prochaines sessions basées sur l'analyse"
    ],
    tips: [
      "Utiliser des échelles de confiance (1-10) pour s'auto-évaluer",
      "Programmer des auto-tests surprises",
      "Analyser les erreurs pour identifier les patterns",
      "Expérimenter avec différentes techniques chaque semaine"
    ]
  },
  {
    id: "elaborative",
    name: "ELABORATIVE INTERROGATION",
    description: "Questionnement approfondi pour créer des liens causaux",
    category: "Compréhension",
    need: "Compréhension profonde",
    speed: "Moyen (4-8h)",
    volume: "Petit (10-50 infos)",
    color: "#ffecd2",
    instructions: [
      "Lire une information factuelle",
      "Se demander 'Pourquoi cela est-il vrai ?'",
      "Générer des explications causales détaillées",
      "Rechercher des preuves supportant l'explication",
      "Connecter avec des connaissances préexistantes"
    ],
    tips: [
      "Utiliser des questions ouvertes plutôt que fermées",
      "Chercher des contre-exemples pour tester la compréhension",
      "Créer des chaînes causales complexes",
      "Discuter les explications avec d'autres personnes"
    ]
  },
  {
    id: "sketchnoting",
    name: "SKETCHNOTING VISUAL",
    description: "Prise de notes visuelles combinant texte, dessins et symboles",
    category: "Créativité",
    need: "Synthèse créative",
    speed: "Rapide (1-4h)",
    volume: "Moyen (50-200 infos)",
    color: "#ff9a9e",
    instructions: [
      "Utiliser 50% texte, 30% dessins, 20% symboles/flèches",
      "Créer une hiérarchie visuelle avec tailles et couleurs",
      "Dessiner en temps réel pendant l'écoute/lecture",
      "Utiliser des conteneurs (bulles, cadres) pour grouper",
      "Ajouter des connecteurs visuels entre les concepts"
    ],
    tips: [
      "Développer son propre vocabulaire de symboles récurrents",
      "Utiliser maximum 3-4 couleurs pour éviter la surcharge",
      "S'entraîner à dessiner vite sans chercher la perfection",
      "Prendre photos des sketchnotes pour révision digitale"
    ]
  },
  {
    id: "tchart",
    name: "FICHE T-CHART",
    description: "Fiches comparative à deux colonnes pour opposition/comparaison",
    category: "Mémorisation",
    need: "Compréhension profonde",
    speed: "Rapide (1-4h)",
    volume: "Petit (10-50 infos)",
    color: "#96ceb4",
    instructions: [
      "Tracer une ligne verticale au centre de la fiche",
      "Titre/sujet en haut, deux aspects à comparer en colonnes",
      "Lister points similaires à la même hauteur",
      "Marquer les différences majeures en couleur",
      "Synthèse au bas : conclusion comparative"
    ],
    tips: [
      "Utiliser pour avantages/inconvénients, avant/après, théorie/pratique",
      "Ajouter des flèches pour montrer les relations cause-effet",
      "Créer des sous-T charts pour approfondir certains points",
      "Réviser en cachant une colonne pour tester l'autre"
    ]
  },
  {
    id: "loci",
    name: "METHODE LOCI MODERNE",
    description: "Palais de mémoire adapté aux environnements numériques familiers",
    category: "Mémorisation",
    need: "Rétention long terme",
    speed: "Moyen (4-8h)",
    volume: "Grand (>200 infos)",
    color: "#ffd93d",
    instructions: [
      "Choisir un lieu très familier (maison, trajet quotidien)",
      "Définir un parcours logique avec 10-20 points fixes",
      "Associer chaque information à un point spécifique",
      "Créer des images mentales absurdes/mémorables",
      "Parcourir mentalement le trajet pour réviser"
    ],
    tips: [
      "Utiliser des lieux virtuels (jeux vidéo, films) si plus mémorables",
      "Créer plusieurs palais pour différentes matières",
      "Dessiner le plan du palais pour référence visuelle",
      "Pratiquer le parcours à l'envers pour renforcer"
    ]
  },
  {
    id: "rubberduck",
    name: "RUBBER DUCK DEBUGGING",
    description: "Explication à voix haute à un objet pour clarifier sa pensée",
    category: "Compréhension",
    need: "Compréhension profonde",
    speed: "Ultra-rapide (< 1h)",
    volume: "Micro (<10 infos)",
    color: "#fffa65",
    instructions: [
      "Choisir un objet inanimé comme 'auditeur'",
      "Expliquer le problème/concept du début à la fin",
      "Détailler chaque étape comme à un débutant",
      "Identifier les moments d'hésitation ou confusion",
      "Reformuler jusqu'à explication fluide et claire"
    ],
    tips: [
      "Utiliser un vrai canard en plastique pour l'aspect ludique",
      "Enregistrer ses explications pour les réécouter",
      "Changer d'objet selon l'humeur pour maintenir l'engagement",
      "Utiliser cette méthode avant de demander de l'aide"
    ]
  },
  {
    id: "dale_reading",
    name: "DALE: READING + AUDIOBOOKS",
    description: "Lecture passive optimisée (10% rétention selon Edgar Dale)",
    category: "Edgar Dale",
    need: "Acquisition rapide",
    speed: "Moyen (4-8h)",
    volume: "Grand (>200 infos)",
    color: "#ff9999",
    instructions: [
      "Combiner lecture visuelle + écoute audio simultanée",
      "Ajuster vitesse audio à 1.2x pour maintenir attention",
      "Prendre notes des concepts-clés uniquement",
      "Faire pauses toutes les 20 minutes pour intégration",
      "Réviser notes dans les 2h suivant la lecture"
    ],
    tips: [
      "Alterner entre lecture pure et écoute pure",
      "Utiliser surligneur digital pour traçabilité",
      "Créer playlist de chapitres pour révision ciblée",
      "Combiner avec marche lente pour améliorer rétention"
    ]
  },
  {
    id: "dale_seeing",
    name: "DALE: SEEING + HEARING",
    description: "Démonstrations visuelles et auditives (20% rétention)",
    category: "Edgar Dale",
    need: "Compréhension profonde",
    speed: "Rapide (1-4h)",
    volume: "Moyen (50-200 infos)",
    color: "#ffcc99",
    instructions: [
      "Rechercher vidéos de qualité sur le sujet (YouTube, Coursera)",
      "Visionner une fois en mode 'découverte' sans notes",
      "Deuxième visionnage avec prise de notes active",
      "Reproduire les schémas/démonstrations montrés",
      "Créer sa propre présentation basée sur la démonstration"
    ],
    tips: [
      "Privilégier vidéos avec sous-titres pour double encodage",
      "Utiliser fonction ralenti pour détails complexes",
      "Chercher multiple perspectives sur même concept",
      "Pratiquer pause-résumé toutes les 5 minutes"
    ]
  },
  {
    id: "dale_discussion",
    name: "DALE: PARTICIPATING IN DISCUSSION",
    description: "Apprentissage par échange et débat (50% rétention)",
    category: "Edgar Dale",
    need: "Compréhension profonde",
    speed: "Moyen (4-8h)",
    volume: "Moyen (50-200 infos)",
    color: "#ffff99",
    instructions: [
      "Rejoindre forums/Discord spécialisés dans la matière",
      "Poser questions ouvertes pour stimuler discussion",
      "Partager ses propres perspectives et expériences",
      "Débattre respectueusement sur points controversés",
      "Synthétiser apprentissages de chaque session"
    ],
    tips: [
      "Préparer 3-5 questions avant chaque discussion",
      "Utiliser technique Socratique pour approfondir",
      "Noter les perspectives différentes des siennes",
      "Organiser groupes d'étude réguliers avec pairs"
    ]
  },
  {
    id: "dale_talk",
    name: "DALE: GIVING A TALK",
    description: "Présentation orale pour consolidation (70% rétention)",
    category: "Edgar Dale",
    need: "Application pratique",
    speed: "Lent (> 8h)",
    volume: "Moyen (50-200 infos)",
    color: "#ccff99",
    instructions: [
      "Structurer présentation : intro, 3 points principaux, conclusion",
      "Créer supports visuels simples et impactants",
      "Répéter à voix haute minimum 5 fois avant présentation",
      "Présenter à audience réelle (amis, famille, collègues)",
      "Collecter feedback et ajuster pour futures présentations"
    ],
    tips: [
      "Commencer par présentations courtes (5-10 min)",
      "Utiliser storytelling pour rendre mémorable",
      "Anticiper questions difficiles et préparer réponses",
      "Filmer ses présentations pour auto-amélioration"
    ]
  },
  {
    id: "dale_dramatic",
    name: "DALE: DOING A DRAMATIC PRESENTATION",
    description: "Performance théâtrale pour ancrage émotionnel (70% rétention)",
    category: "Edgar Dale",
    need: "Synthèse créative",
    speed: "Lent (> 8h)",
    volume: "Petit (10-50 infos)",
    color: "#cc99ff",
    instructions: [
      "Transformer le contenu en scénario avec personnages",
      "Incarner différents rôles pour explorer multiples perspectives",
      "Utiliser costumes/accessoires pour immersion totale",
      "Jouer devant audience pour feedback émotionnel",
      "Enregistrer la performance pour révision ludique"
    ],
    tips: [
      "Exagérer émotions et gestes pour ancrage mémoriel",
      "Utiliser conflits dramatiques pour concepts opposés",
      "Intégrer humour pour détendre et mémoriser",
      "Créer versions courtes (sketch 3-5 min) pour révision"
    ]
  },
  {
    id: "dale_simulating",
    name: "DALE: SIMULATING THE REAL EXPERIENCE",
    description: "Simulation pratique en conditions réelles (90% rétention)",
    category: "Edgar Dale",
    need: "Application pratique",
    speed: "Lent (> 8h)",
    volume: "Petit (10-50 infos)",
    color: "#99ff99",
    instructions: [
      "Identifier contexte d'application réel du savoir",
      "Recréer conditions les plus proches possible du réel",
      "Pratiquer avec contraintes temporelles et matérielles réelles",
      "Introduire éléments perturbateurs/stress comme en réalité",
      "Débriefing après chaque simulation pour amélioration"
    ],
    tips: [
      "Utiliser réalité virtuelle/augmentée si disponible",
      "Créer check-lists de performance comme professionnels",
      "Varier les scénarios pour robustesse de l'apprentissage",
      "Mesurer progression avec métriques objectives"
    ]
  },
  {
    id: "dale_real",
    name: "DALE: DOING THE REAL THING",
    description: "Application directe en situation authentique (90% rétention)",
    category: "Edgar Dale",
    need: "Application pratique",
    speed: "Lent (> 8h)",
    volume: "Micro (<10 infos)",
    color: "#66ff66",
    instructions: [
      "Trouver opportunités réelles d'appliquer le savoir",
      "Commencer par tâches simples avec supervision",
      "Progresser vers autonomie complète par étapes",
      "Documenter succès et échecs pour apprentissage continu",
      "Chercher feedback de professionnels expérimentés"
    ],
    tips: [
      "Accepter échecs comme partie normale de l'apprentissage",
      "Tenir journal de pratique avec réflexions quotidiennes",
      "Chercher mentorship pour accélération apprentissage",
      "Célébrer petites victoires pour maintenir motivation"
    ]
  },
  {
    id: "spacing_advanced",
    name: "SPACING EFFECT ADVANCED",
    description: "Algorithme d'espacement personnalisé basé sur performance",
    category: "Révision",
    need: "Rétention long terme",
    speed: "Lent (> 8h)",
    volume: "Grand (>200 infos)",
    color: "#99ccff",
    instructions: [
      "Évaluer difficulté initiale de chaque élément (1-5)",
      "Programmer première révision selon difficulté (1j-1sem)",
      "Ajuster intervalle selon performance : succès = +50%, échec = -70%",
      "Maintenir ratio 80% succès pour optimisation",
      "Analyser patterns personnels pour affiner algorithme"
    ],
    tips: [
      "Utiliser apps comme Anki avec algorithmes SM-15/17",
      "Garder sessions courtes (15-20 min) pour éviter fatigue",
      "Réviser même cartes 'faciles' pour maintenance",
      "Exporter statistiques pour analyse performance long terme"
    ]
  },
  {
    id: "elaborative_integration",
    name: "ELABORATIVE INTEGRATION",
    description: "Connexion systématique entre nouveaux et anciens savoirs",
    category: "Compréhension",
    need: "Compréhension profonde",
    speed: "Moyen (4-8h)",
    volume: "Moyen (50-200 infos)",
    color: "#ff9966",
    instructions: [
      "Pour chaque nouveau concept, identifier 3 liens avec acquis",
      "Créer carte mentale montrant ces connexions",
      "Chercher contradictions/tensions entre ancien et nouveau",
      "Résoudre conflits par recherche approfondie",
      "Créer synthèse intégrée du savoir élargi"
    ],
    tips: [
      "Utiliser technique 'Prior Knowledge Activation' avant apprentissage",
      "Créer analogies ponts entre domaines différents",
      "Tenir 'journal de connexions' pour tracer liens découverts",
      "Utiliser diagrammes Venn pour visualiser recoupements"
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

export const getRandomArtifact = () => {
  const rarityChances = { common: 0.6, rare: 0.3, legendary: 0.1 };
  const rand = Math.random();
  let rarity = "common";
  
  if (rand > 0.9) rarity = "legendary";
  else if (rand > 0.6) rarity = "rare";
  
  return {
    id: `a_${Date.now()}`,
    name: "Fragment mystérieux",
    description: "Un objet étrange découvert lors de votre progression",
    rarity,
    foundAt: new Date().toISOString(),
    category: "mystery"
  };
};

// Système de sauvegarde locale
export const saveGameData = (gameData) => {
  try {
    localStorage.setItem('rpg_game_save', JSON.stringify({
      ...gameData,
      savedAt: new Date().toISOString()
    }));
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
    return false;
  }
};

export const loadGameData = () => {
  try {
    const saved = localStorage.getItem('rpg_game_save');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Erreur chargement:', error);
    return null;
  }
};

export const exportGameData = () => {
  const gameData = loadGameData();
  if (!gameData) return null;
  
  const dataStr = JSON.stringify(gameData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `rpg_save_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importGameData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const gameData = JSON.parse(e.target.result);
        localStorage.setItem('rpg_game_save', JSON.stringify(gameData));
        resolve(gameData);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};