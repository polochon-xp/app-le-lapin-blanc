import React from 'react';
import { Button } from './ui/button';
import { Download, FileText, Smartphone } from 'lucide-react';

const DownloadApp = ({ currentTheme }) => {
  const downloadCompleteApp = () => {
    // Créer l'application complète autonome avec toutes les fonctionnalités
    const completeAppHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RPG Gamification - Le Lapin Blanc</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Courier New', monospace;
            background: #1a0d00;
            color: #ff6b35;
            overflow-x: hidden;
            user-select: none;
        }
        
        .pixel-font { font-family: 'Courier New', monospace; font-weight: bold; }
        
        .app { min-height: 100vh; padding: 1rem; position: relative; }
        .container { max-width: 400px; margin: 0 auto; }
        
        .retro-card { 
            background: #2d1a00;
            border: 2px solid #ffaa00;
            border-radius: 8px;
            box-shadow: 3px 3px 0px #ffaa00;
            padding: 1rem;
            margin: 1rem 0;
            position: relative;
        }
        
        .retro-button { 
            background: #ff6b35;
            color: #1a0d00;
            border: 2px solid #1a0d00;
            padding: 0.75rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            box-shadow: 2px 2px 0px #1a0d00;
            transition: transform 0.1s;
            font-size: 0.875rem;
            width: 100%;
        }
        .retro-button:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0px #1a0d00; }
        .retro-button:active { transform: translate(0px, 0px); box-shadow: 1px 1px 0px #1a0d00; }
        .retro-button:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .progress-bar {
            width: 100%;
            height: 12px;
            background: #1a0d00;
            border: 2px solid #ffaa00;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }
        .progress-fill {
            height: 100%;
            background: #ff6b35;
            box-shadow: inset 0 2px 0 rgba(255,255,255,0.3);
            transition: width 0.3s ease;
        }
        
        .tabs {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 4px;
            background: #2d1a00;
            border: 2px solid #ffaa00;
            border-radius: 8px;
            padding: 4px;
            margin-bottom: 1rem;
        }
        .tab {
            background: transparent;
            border: none;
            color: #ff6b35;
            padding: 8px 4px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 1.2rem;
            transition: all 0.2s;
        }
        .tab.active {
            background: #ff6b35;
            color: #1a0d00;
            box-shadow: inset 2px 2px 0px rgba(0,0,0,0.3);
        }
        
        .stat-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem;
            background: rgba(255,107,53,0.1);
            border: 1px solid #ffaa00;
            border-radius: 8px;
            margin-bottom: 0.75rem;
        }
        .stat-icon {
            background: #ff6b35;
            color: #1a0d00;
            padding: 8px;
            border-radius: 4px;
            font-weight: bold;
            min-width: 40px;
            text-align: center;
        }
        
        .mission-card {
            background: #2d1a00;
            border: 2px solid #ffaa00;
            border-radius: 8px;
            box-shadow: 3px 3px 0px #ffaa00;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        
        .input-field {
            width: 100%;
            background: #1a0d00;
            border: 2px solid #ffaa00;
            color: #ff6b35;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            margin: 4px 0;
        }
        .input-field:focus {
            outline: none;
            box-shadow: 0 0 0 2px #ff6b35;
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .modal.active { display: flex; }
        .modal-content {
            background: #2d1a00;
            border: 4px solid #ff6b35;
            border-radius: 8px;
            box-shadow: 6px 6px 0px #ff6b35;
            padding: 1.5rem;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .timer-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        .timer-overlay.active { display: flex; }
        
        .signature {
            text-align: center;
            margin-top: 2rem;
            font-size: 0.75rem;
            opacity: 0.7;
            animation: glitch 3s infinite;
        }
        
        .scanlines {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255,107,53,0.1) 2px,
                rgba(255,107,53,0.1) 4px
            );
            pointer-events: none;
            animation: scanline 2s linear infinite;
            z-index: -1;
        }
        
        .hidden { display: none !important; }
        
        @keyframes glitch {
            0%, 98% { opacity: 0.7; }
            99% { opacity: 0.5; color: #ffaa00; }
        }
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
        }
        
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .flex { display: flex; }
        .flex-between { justify-content: space-between; }
        .flex-center { justify-content: center; align-items: center; }
        .items-center { align-items: center; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .text-center { text-align: center; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .opacity-70 { opacity: 0.7; }
        .opacity-50 { opacity: 0.5; }
    </style>
</head>
<body>
    <div class="scanlines"></div>
    <div class="app">
        <div class="container">
            <!-- Header -->
            <div class="retro-card">
                <div class="flex flex-between items-center">
                    <div class="flex items-center" style="gap: 1rem;">
                        <div class="stat-icon">👤</div>
                        <div>
                            <h1 class="pixel-font" id="playerName">Novice-001</h1>
                            <p class="text-xs opacity-70">LV.<span id="playerLevel">1</span> • <span id="playerXP">25</span> XP</p>
                        </div>
                    </div>
                    <button class="retro-button" onclick="openSettings()" style="width: auto; padding: 8px 12px;">⚙️</button>
                </div>
            </div>

            <!-- Status -->
            <div class="retro-card">
                <div class="grid-2">
                    <div>
                        <label class="text-xs opacity-70 pixel-font">SANTÉ</label>
                        <div class="progress-bar">
                            <div class="progress-fill" id="healthBar" style="width: 100%;"></div>
                        </div>
                        <span class="text-xs pixel-font">100%</span>
                    </div>
                    <div>
                        <label class="text-xs opacity-70 pixel-font">ÉNERGIE</label>
                        <div class="progress-bar">
                            <div class="progress-fill" id="energyBar" style="width: 85%;"></div>
                        </div>
                        <span class="text-xs pixel-font">85%</span>
                    </div>
                </div>
            </div>

            <!-- Navigation Tabs -->
            <div class="tabs">
                <button class="tab active" onclick="switchTab('stats')">📊</button>
                <button class="tab" onclick="switchTab('missions')">🎯</button>
                <button class="tab" onclick="switchTab('discoveries')">📜</button>
                <button class="tab" onclick="switchTab('artifacts')">📦</button>
                <button class="tab" onclick="switchTab('story')">📖</button>
                <button class="tab" onclick="switchTab('optimization')">🏆</button>
            </div>

            <!-- Tab Contents -->
            <div id="stats-content" class="tab-content active">
                <div class="retro-card">
                    <h3 class="pixel-font text-center mb-4">COMPÉTENCES</h3>
                    <div id="statsContainer">
                        <div class="stat-item">
                            <div class="stat-icon">💼</div>
                            <div style="flex: 1;">
                                <div class="flex flex-between items-center">
                                    <span class="pixel-font">Travail LV.<span id="travail-level">0</span></span>
                                    <span class="text-xs opacity-70"><span id="travail-xp">0</span>/100</span>
                                </div>
                                <div class="progress-bar" style="height: 8px; margin-top: 4px;">
                                    <div class="progress-fill" id="travail-progress" style="width: 0%;"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon">💪</div>
                            <div style="flex: 1;">
                                <div class="flex flex-between items-center">
                                    <span class="pixel-font">Sport LV.<span id="sport-level">0</span></span>
                                    <span class="text-xs opacity-70"><span id="sport-xp">0</span>/100</span>
                                </div>
                                <div class="progress-bar" style="height: 8px; margin-top: 4px;">
                                    <div class="progress-fill" id="sport-progress" style="width: 0%;"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon">💡</div>
                            <div style="flex: 1;">
                                <div class="flex flex-between items-center">
                                    <span class="pixel-font">Création LV.<span id="creation-level">0</span></span>
                                    <span class="text-xs opacity-70"><span id="creation-xp">0</span>/100</span>
                                </div>
                                <div class="progress-bar" style="height: 8px; margin-top: 4px;">
                                    <div class="progress-fill" id="creation-progress" style="width: 0%;"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon">📚</div>
                            <div style="flex: 1;">
                                <div class="flex flex-between items-center">
                                    <span class="pixel-font">Lecture LV.<span id="lecture-level">0</span></span>
                                    <span class="text-xs opacity-70"><span id="lecture-xp">0</span>/100</span>
                                </div>
                                <div class="progress-bar" style="height: 8px; margin-top: 4px;">
                                    <div class="progress-fill" id="lecture-progress" style="width: 0%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="missions-content" class="tab-content">
                <button class="retro-button mb-4" onclick="openMissionCreator()">+ NOUVELLE MISSION</button>
                <button class="retro-button mb-4" onclick="downloadApp()" style="background: #ffaa00; color: #1a0d00;">📱 TÉLÉCHARGER APP</button>
                <div id="missionsContainer">
                    <div class="retro-card text-center">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                        <p class="pixel-font mb-2">AUCUNE MISSION ACTIVE</p>
                        <p class="text-xs opacity-70">Créez votre première mission pour commencer</p>
                    </div>
                </div>
            </div>

            <div id="discoveries-content" class="tab-content">
                <div class="retro-card">
                    <h3 class="pixel-font mb-4">DÉCOUVERTES</h3>
                    <div id="discoveriesContainer">
                        <div class="text-center" style="padding: 2rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">📜</div>
                            <p class="pixel-font mb-2">AUCUNE DÉCOUVERTE</p>
                            <p class="text-xs opacity-70">Progressez pour débloquer des indices</p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="artifacts-content" class="tab-content">
                <div class="retro-card">
                    <h3 class="pixel-font mb-4">ARTEFACTS</h3>
                    <div id="artifactsContainer">
                        <div class="text-center" style="padding: 2rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
                            <p class="pixel-font mb-2">AUCUN ARTEFACT</p>
                            <p class="text-xs opacity-70">Terminez des missions pour en trouver</p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="story-content" class="tab-content">
                <div class="retro-card">
                    <h3 class="pixel-font text-center mb-4">JOURNAL D'ENQUÊTE</h3>
                    <div style="border-left: 4px solid #ff6b35; padding-left: 1rem;">
                        <h4 class="pixel-font mb-2">NIVEAU 1 - L'ÉVEIL</h4>
                        <p class="text-xs opacity-70" style="line-height: 1.4;">
                            Vous vous réveillez dans un monde où quelque chose a changé. Les écrans clignotent partout, 
                            les gens semblent anxieux. Un message cryptique apparaît : 'Le compte à rebours a commencé...'
                        </p>
                    </div>
                    <div class="text-center" style="margin-top: 2rem;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📜</div>
                        <p class="text-xs opacity-50">Progressez pour débloquer plus de fragments...</p>
                    </div>
                </div>
            </div>

            <div id="optimization-content" class="tab-content">
                <div class="retro-card">
                    <h3 class="pixel-font text-center mb-4">OPTIMISATION COGNITIVE</h3>
                    <input type="text" class="input-field mb-4" placeholder="Rechercher une technique..." id="searchTechniques" oninput="searchTechniques()">
                    <div id="techniquesContainer">
                        <div class="text-center" style="padding: 2rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🧠</div>
                            <p class="pixel-font mb-2">23 TECHNIQUES DISPONIBLES</p>
                            <p class="text-xs opacity-70">Anki, Feynman, Pomodoro, Edgar Dale...</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="signature">
                <p class="pixel-font">"Je suis le lapin blanc"</p>
            </div>
        </div>
    </div>

    <!-- Timer Overlay -->
    <div id="timerOverlay" class="timer-overlay">
        <div class="retro-card" style="width: 300px;">
            <div class="text-center">
                <h3 class="pixel-font mb-4">MISSION ACTIVE</h3>
                <div class="pixel-font" id="timerDisplay" style="font-size: 2.5rem; margin-bottom: 1rem;">00:00</div>
                <p class="text-sm mb-4 opacity-70">Suis le lapin blanc</p>
                <button class="retro-button" onclick="stopTimer()">ABANDONNER MISSION</button>
            </div>
        </div>
    </div>

    <!-- Mission Creator Modal -->
    <div id="missionModal" class="modal">
        <div class="modal-content" style="width: 90%; max-width: 400px;">
            <h3 class="pixel-font mb-4 text-center">CRÉER UNE MISSION</h3>
            <form id="missionForm" onsubmit="createMission(event)">
                <input type="text" class="input-field" placeholder="Titre de la mission" id="missionTitle" required>
                <textarea class="input-field" placeholder="Description (optionnel)" id="missionDescription" rows="3"></textarea>
                
                <select class="input-field" id="missionCategory" required>
                    <option value="">Choisir une activité...</option>
                    <option value="travail">💼 Travail</option>
                    <option value="sport">💪 Sport</option>
                    <option value="creation">💡 Création</option>
                    <option value="lecture">📚 Lecture</option>
                </select>
                
                <div class="grid-2">
                    <input type="number" class="input-field" placeholder="Durée (min)" id="missionTime" min="5" max="240" value="15">
                    <div class="input-field" style="background: #ff6b35; color: #1a0d00; font-weight: bold; text-align: center;">
                        <span id="xpPreview">+15 XP</span>
                    </div>
                </div>
                
                <div style="margin: 1rem 0;">
                    <p class="pixel-font text-sm mb-2">FRÉQUENCE</p>
                    <div class="grid-2" style="gap: 0.5rem;">
                        <button type="button" class="retro-button" onclick="selectFrequency('daily')" id="freq-daily" style="height: auto; padding: 8px;">QUOTIDIEN</button>
                        <button type="button" class="retro-button" onclick="selectFrequency('weekly')" id="freq-weekly" style="height: auto; padding: 8px;">HEBDO</button>
                    </div>
                </div>
                
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button type="button" class="retro-button" onclick="closeMissionCreator()" style="background: transparent; border: 2px solid #ffaa00; color: #ffaa00;">ANNULER</button>
                    <button type="submit" class="retro-button">🎯 CRÉER</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Settings Modal -->
    <div id="settingsModal" class="modal">
        <div class="modal-content" style="width: 90%; max-width: 300px;">
            <h3 class="pixel-font mb-4 text-center">PARAMÈTRES</h3>
            <input type="text" class="input-field mb-4" placeholder="Nom du joueur" id="playerNameInput">
            <div style="display: flex; gap: 0.5rem;">
                <button class="retro-button" onclick="exportData()">💾 EXPORT</button>
                <button class="retro-button" onclick="closeSettings()">FERMER</button>
            </div>
        </div>
    </div>

    <script>
        // Game State
        let gameState = {
            player: {
                name: "Novice-001",
                level: 1,
                totalXP: 25,
                health: 100,
                energy: 85
            },
            stats: {
                travail: { level: 0, xp: 0, maxXp: 100 },
                sport: { level: 0, xp: 0, maxXp: 100 },
                creation: { level: 0, xp: 0, maxXp: 100 },
                lecture: { level: 0, xp: 0, maxXp: 100 }
            },
            missions: [],
            discoveries: [],
            artifacts: [],
            activeTimer: null,
            selectedFrequency: 'daily'
        };

        // Load saved data
        function loadGameData() {
            const saved = localStorage.getItem('rpg_game_save');
            if (saved) {
                gameState = {...gameState, ...JSON.parse(saved)};
                updateUI();
            }
        }

        // Save game data
        function saveGameData() {
            localStorage.setItem('rpg_game_save', JSON.stringify({
                ...gameState,
                savedAt: new Date().toISOString()
            }));
        }

        // Update UI
        function updateUI() {
            document.getElementById('playerName').textContent = gameState.player.name;
            document.getElementById('playerLevel').textContent = gameState.player.level;
            document.getElementById('playerXP').textContent = gameState.player.totalXP;
            
            // Update stats
            Object.entries(gameState.stats).forEach(([category, data]) => {
                document.getElementById(category + '-level').textContent = data.level;
                document.getElementById(category + '-xp').textContent = data.xp;
                const percentage = data.maxXp > 0 ? (data.xp / data.maxXp) * 100 : 0;
                document.getElementById(category + '-progress').style.width = percentage + '%';
            });
            
            renderMissions();
            renderDiscoveries();
            renderArtifacts();
        }

        // Tab switching
        function switchTab(tabName) {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tabName + '-content').classList.add('active');
        }

        // Mission Creator
        function openMissionCreator() {
            document.getElementById('missionModal').classList.add('active');
            updateXPPreview();
        }

        function closeMissionCreator() {
            document.getElementById('missionModal').classList.remove('active');
            document.getElementById('missionForm').reset();
            gameState.selectedFrequency = 'daily';
            updateFrequencyButtons();
        }

        function selectFrequency(freq) {
            gameState.selectedFrequency = freq;
            updateFrequencyButtons();
            updateXPPreview();
        }

        function updateFrequencyButtons() {
            document.querySelectorAll('[id^="freq-"]').forEach(btn => {
                btn.style.background = '#transparent';
                btn.style.color = '#ff6b35';
                btn.style.border = '2px solid #ffaa00';
            });
            const activeBtn = document.getElementById('freq-' + gameState.selectedFrequency);
            if (activeBtn) {
                activeBtn.style.background = '#ff6b35';
                activeBtn.style.color = '#1a0d00';
                activeBtn.style.border = '2px solid #1a0d00';
            }
        }

        function updateXPPreview() {
            const category = document.getElementById('missionCategory').value;
            const time = parseInt(document.getElementById('missionTime').value) || 15;
            const baseXP = { travail: 15, sport: 12, creation: 20, lecture: 18 };
            const timeMultiplier = Math.max(1, Math.floor(time / 15));
            const xp = (baseXP[category] || 15) * timeMultiplier;
            document.getElementById('xpPreview').textContent = '+' + xp + ' XP';
        }

        function createMission(event) {
            event.preventDefault();
            const title = document.getElementById('missionTitle').value;
            const description = document.getElementById('missionDescription').value;
            const category = document.getElementById('missionCategory').value;
            const time = parseInt(document.getElementById('missionTime').value);
            
            const baseXP = { travail: 15, sport: 12, creation: 20, lecture: 18 };
            const timeMultiplier = Math.max(1, Math.floor(time / 15));
            const xp = (baseXP[category] || 15) * timeMultiplier;
            
            const mission = {
                id: Date.now(),
                title,
                description,
                category,
                estimatedTime: time,
                xpReward: xp,
                type: gameState.selectedFrequency,
                status: 'pending',
                progress: 0
            };
            
            gameState.missions.push(mission);
            saveGameData();
            renderMissions();
            closeMissionCreator();
        }

        function renderMissions() {
            const container = document.getElementById('missionsContainer');
            if (gameState.missions.length === 0) {
                container.innerHTML = \`
                    <div class="retro-card text-center">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                        <p class="pixel-font mb-2">AUCUNE MISSION ACTIVE</p>
                        <p class="text-xs opacity-70">Créez votre première mission pour commencer</p>
                    </div>
                \`;
                return;
            }
            
            container.innerHTML = gameState.missions.map(mission => \`
                <div class="mission-card">
                    <div class="flex flex-between items-center mb-2">
                        <h4 class="pixel-font text-sm">\${mission.title}</h4>
                        <span class="text-xs" style="background: #ff6b35; color: #1a0d00; padding: 2px 8px; border-radius: 4px;">\${mission.type === 'daily' ? 'QUOTIDIEN' : 'HEBDO'}</span>
                    </div>
                    <p class="text-xs opacity-70 mb-3">\${mission.description || 'Aucune description'}</p>
                    <div class="flex flex-between items-center mb-3">
                        <span class="text-xs">🎯 +\${mission.xpReward} XP</span>
                        <span class="text-xs">⏱️ \${mission.estimatedTime}min</span>
                    </div>
                    \${mission.progress > 0 ? \`<div class="progress-bar mb-3" style="height: 6px;"><div class="progress-fill" style="width: \${mission.progress}%;"></div></div>\` : ''}
                    <button class="retro-button" onclick="startMission(\${mission.id})" \${mission.status === 'completed' ? 'disabled' : ''}>
                        \${mission.status === 'completed' ? 'TERMINÉ' : '▶️ DÉMARRER'}
                    </button>
                </div>
            \`).join('');
        }

        function startMission(missionId) {
            const mission = gameState.missions.find(m => m.id === missionId);
            if (!mission) return;
            
            gameState.activeTimer = {
                missionId: missionId,
                timeLeft: mission.estimatedTime * 60
            };
            
            document.getElementById('timerOverlay').classList.add('active');
            startTimerCountdown();
        }

        function startTimerCountdown() {
            const timer = setInterval(() => {
                if (!gameState.activeTimer) {
                    clearInterval(timer);
                    return;
                }
                
                gameState.activeTimer.timeLeft--;
                updateTimerDisplay();
                
                if (gameState.activeTimer.timeLeft <= 0) {
                    clearInterval(timer);
                    completeMission();
                }
            }, 1000);
        }

        function updateTimerDisplay() {
            if (!gameState.activeTimer) return;
            const mins = Math.floor(gameState.activeTimer.timeLeft / 60);
            const secs = gameState.activeTimer.timeLeft % 60;
            document.getElementById('timerDisplay').textContent = 
                mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
        }

        function stopTimer() {
            gameState.activeTimer = null;
            document.getElementById('timerOverlay').classList.remove('active');
        }

        function completeMission() {
            const mission = gameState.missions.find(m => m.id === gameState.activeTimer.missionId);
            if (mission) {
                mission.status = 'completed';
                mission.progress = 100;
                
                // Add XP to stat
                const stat = gameState.stats[mission.category];
                stat.xp += mission.xpReward;
                while (stat.xp >= stat.maxXp) {
                    stat.xp -= stat.maxXp;
                    stat.level++;
                    stat.maxXp = Math.floor(stat.maxXp * 1.1);
                }
                
                // Add XP to player
                gameState.player.totalXP += mission.xpReward;
                gameState.player.level = Math.floor(gameState.player.totalXP / 100) + 1;
                
                // Chance of finding artifact
                if (Math.random() < 0.3) {
                    gameState.artifacts.push({
                        id: Date.now(),
                        name: "Fragment mystérieux",
                        description: "Un objet étrange découvert lors de votre mission",
                        rarity: "common",
                        foundAt: new Date().toISOString()
                    });
                }
                
                saveGameData();
                updateUI();
            }
            
            stopTimer();
        }

        function renderDiscoveries() {
            const container = document.getElementById('discoveriesContainer');
            if (gameState.discoveries.length === 0) {
                container.innerHTML = \`
                    <div class="text-center" style="padding: 2rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📜</div>
                        <p class="pixel-font mb-2">AUCUNE DÉCOUVERTE</p>
                        <p class="text-xs opacity-70">Progressez pour débloquer des indices</p>
                    </div>
                \`;
                return;
            }
            
            container.innerHTML = gameState.discoveries.map(discovery => \`
                <div style="border: 1px solid #ffaa00; border-radius: 4px; padding: 1rem; margin-bottom: 1rem;">
                    <h4 class="pixel-font text-sm mb-2">\${discovery.title}</h4>
                    <p class="text-xs opacity-70">\${discovery.description}</p>
                </div>
            \`).join('');
        }

        function renderArtifacts() {
            const container = document.getElementById('artifactsContainer');
            if (gameState.artifacts.length === 0) {
                container.innerHTML = \`
                    <div class="text-center" style="padding: 2rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
                        <p class="pixel-font mb-2">AUCUN ARTEFACT</p>
                        <p class="text-xs opacity-70">Terminez des missions pour en trouver</p>
                    </div>
                \`;
                return;
            }
            
            container.innerHTML = gameState.artifacts.map(artifact => \`
                <div style="border: 1px solid #ffaa00; border-radius: 4px; padding: 1rem; margin-bottom: 1rem;">
                    <h4 class="pixel-font text-sm mb-2">\${artifact.name}</h4>
                    <p class="text-xs opacity-70">\${artifact.description}</p>
                </div>
            \`).join('');
        }

        // Settings
        function openSettings() {
            document.getElementById('playerNameInput').value = gameState.player.name;
            document.getElementById('settingsModal').classList.add('active');
        }

        function closeSettings() {
            const newName = document.getElementById('playerNameInput').value.trim();
            if (newName) {
                gameState.player.name = newName;
                saveGameData();
                updateUI();
            }
            document.getElementById('settingsModal').classList.remove('active');
        }

        function exportData() {
            const dataStr = JSON.stringify(gameState, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = \`rpg_save_\${new Date().toISOString().split('T')[0]}.json\`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        // Search techniques
        function searchTechniques() {
            const query = document.getElementById('searchTechniques').value.toLowerCase();
            // Simple search implementation
            console.log('Recherche:', query);
        }

        // Event listeners
        document.getElementById('missionCategory').addEventListener('change', updateXPPreview);
        document.getElementById('missionTime').addEventListener('input', updateXPPreview);

        // Initialize
        window.addEventListener('load', () => {
            loadGameData();
            updateFrequencyButtons();
            console.log('🎮 Application RPG "Le Lapin Blanc" chargée');
        });

        // Auto-save every 30 seconds
        setInterval(saveGameData, 30000);
        
        // Download function for the embedded button
        function downloadApp() {
            alert('✅ Vous utilisez déjà l\\'application téléchargée !\\n\\n🎮 Cette version autonome fonctionne hors ligne\\n📱 Ajoutez-la à votre écran d\\'accueil\\n💾 Vos données sont sauvegardées localement');
        }
    </script>
</body>
</html>`;

    // Télécharger l'application complète
    const blob = new Blob([completeAppHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rpg-gamification-complete.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="retro-card border-2 rounded-lg p-4 mb-4"
         style={{ 
           borderColor: currentTheme.accentColor,
           backgroundColor: currentTheme.cardColor,
           boxShadow: `3px 3px 0px ${currentTheme.accentColor}`
         }}>
      <h3 className="pixel-font text-center mb-4" style={{ color: currentTheme.primaryColor }}>
        === APPLICATION AUTONOME ===
      </h3>
      
      <div className="space-y-3">
        <Button
          onClick={downloadCompleteApp}
          className="retro-button w-full text-sm pixel-font border-2"
          style={{
            backgroundColor: currentTheme.primaryColor,
            color: currentTheme.backgroundColor,
            borderColor: currentTheme.backgroundColor,
            boxShadow: `3px 3px 0px ${currentTheme.backgroundColor}`
          }}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          TÉLÉCHARGER APP COMPLÈTE
        </Button>
      </div>
      
      <div className="mt-4 p-3 rounded border-2" 
           style={{ 
             borderColor: currentTheme.primaryColor + '40',
             backgroundColor: currentTheme.primaryColor + '10'
           }}>
        <p className="text-xs pixel-font text-center" style={{ color: currentTheme.textColor }}>
          📱 <strong>APPLICATION AUTONOME COMPLÈTE</strong><br/>
          🎮 Toutes les fonctionnalités incluses<br/>
          💾 Sauvegarde locale automatique<br/>
          🌐 Fonctionne 100% hors ligne<br/>
          📲 Peut être installée sur mobile<br/>
          🎯 Créateur de missions intégré
        </p>
      </div>

      <style jsx>{`
        .pixel-font {
          font-family: 'Courier New', monospace;
          font-weight: bold;
        }
        
        .retro-button:hover {
          transform: translate(-1px, -1px);
        }
      `}</style>
    </div>
  );
};

export default DownloadApp;