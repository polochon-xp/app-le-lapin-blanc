import React from 'react';
import { Button } from './ui/button';
import { Download, FileText, Smartphone } from 'lucide-react';

const DownloadApp = ({ currentTheme }) => {
  const downloadApp = () => {
    // Créer le contenu HTML complet de l'application
    const htmlContent = `<!DOCTYPE html>
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
        }
        .app { min-height: 100vh; padding: 1rem; }
        .container { max-width: 400px; margin: 0 auto; }
        .retro-card { 
            background: #2d1a00;
            border: 2px solid #ffaa00;
            border-radius: 8px;
            box-shadow: 3px 3px 0px #ffaa00;
            padding: 1rem;
            margin: 1rem 0;
        }
        .pixel-font { font-family: 'Courier New', monospace; font-weight: bold; }
        .btn { 
            background: #ff6b35;
            color: #1a0d00;
            border: 2px solid #1a0d00;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            box-shadow: 2px 2px 0px #1a0d00;
        }
        .btn:hover { transform: translate(-1px, -1px); }
        .progress-bar {
            width: 100%;
            height: 12px;
            background: #1a0d00;
            border: 2px solid #ffaa00;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #ff6b35;
            box-shadow: inset 0 2px 0 rgba(255,255,255,0.3);
        }
        .stats-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .stat-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem;
            background: rgba(255,107,53,0.1);
            border: 1px solid #ffaa00;
            border-radius: 8px;
        }
        .signature {
            text-align: center;
            margin-top: 2rem;
            font-size: 0.75rem;
            opacity: 0.7;
            animation: glitch 3s infinite;
        }
        @keyframes glitch {
            0%, 98% { opacity: 0.7; }
            99% { opacity: 0.5; color: #ffaa00; }
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
        }
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
        }
    </style>
</head>
<body>
    <div class="scanlines"></div>
    <div class="app">
        <div class="container">
            <div class="retro-card">
                <h1 class="pixel-font" style="color: #ff6b35; text-align: center; margin-bottom: 1rem;">
                    === RPG GAMIFICATION ===
                </h1>
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h2 class="pixel-font">Novice-001</h2>
                    <p style="font-size: 0.75rem; color: #666;">LV.1 • 25 XP</p>
                </div>
            </div>

            <div class="retro-card">
                <h3 class="pixel-font" style="margin-bottom: 1rem; color: #ff6b35;">STATUS</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <label style="font-size: 0.75rem; color: #666;">HEALTH</label>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 100%;"></div>
                        </div>
                        <span style="font-size: 0.75rem;">100%</span>
                    </div>
                    <div>
                        <label style="font-size: 0.75rem; color: #666;">ENERGY</label>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 85%;"></div>
                        </div>
                        <span style="font-size: 0.75rem;">85%</span>
                    </div>
                </div>
            </div>

            <div class="retro-card">
                <h3 class="pixel-font" style="margin-bottom: 1rem; color: #ff6b35;">SKILL TREE</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div style="background: #ff6b35; color: #1a0d00; padding: 0.5rem; border-radius: 4px; font-weight: bold;">💼</div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: between; align-items: center;">
                                <span class="pixel-font">Travail LV.0</span>
                                <span style="font-size: 0.75rem; color: #666;">0/100</span>
                            </div>
                            <div class="progress-bar" style="height: 8px; margin-top: 0.25rem;">
                                <div class="progress-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div style="background: #4ade80; color: #1a0d00; padding: 0.5rem; border-radius: 4px; font-weight: bold;">💪</div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: between; align-items: center;">
                                <span class="pixel-font">Sport LV.0</span>
                                <span style="font-size: 0.75rem; color: #666;">0/100</span>
                            </div>
                            <div class="progress-bar" style="height: 8px; margin-top: 0.25rem;">
                                <div class="progress-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div style="background: #fbbf24; color: #1a0d00; padding: 0.5rem; border-radius: 4px; font-weight: bold;">💡</div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: between; align-items: center;">
                                <span class="pixel-font">Création LV.0</span>
                                <span style="font-size: 0.75rem; color: #666;">0/100</span>
                            </div>
                            <div class="progress-bar" style="height: 8px; margin-top: 0.25rem;">
                                <div class="progress-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div style="background: #06b6d4; color: #1a0d00; padding: 0.5rem; border-radius: 4px; font-weight: bold;">📚</div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: between; align-items: center;">
                                <span class="pixel-font">Lecture LV.0</span>
                                <span style="font-size: 0.75rem; color: #666;">0/100</span>
                            </div>
                            <div class="progress-bar" style="height: 8px; margin-top: 0.25rem;">
                                <div class="progress-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="retro-card">
                <h3 class="pixel-font" style="margin-bottom: 1rem; color: #ff6b35;">MISSIONS</h3>
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                    <p class="pixel-font" style="margin-bottom: 0.5rem;">NO ACTIVE MISSIONS</p>
                    <p style="font-size: 0.75rem;">Create your first quest to begin</p>
                </div>
            </div>

            <div class="retro-card">
                <h3 class="pixel-font" style="margin-bottom: 1rem; color: #ff6b35;">INVESTIGATION LOG</h3>
                <div style="border-left: 4px solid #ff6b35; padding-left: 1rem;">
                    <h4 class="pixel-font" style="margin-bottom: 0.5rem;">LEVEL 1 - THE AWAKENING</h4>
                    <p style="font-size: 0.75rem; color: #999; line-height: 1.4;">
                        You wake up in a world where something has changed. Screens flicker everywhere, 
                        people seem anxious. A cryptic message appears: 'The countdown has begun...'
                    </p>
                </div>
                <div style="text-align: center; margin-top: 2rem; color: #666;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📜</div>
                    <p style="font-size: 0.75rem;">Progress to unlock more fragments...</p>
                </div>
            </div>

            <div class="signature">
                <p class="pixel-font">"Je suis le lapin blanc"</p>
            </div>

            <div style="text-align: center; margin-top: 2rem; padding: 1rem; border: 2px solid #ffaa00; border-radius: 8px; background: rgba(255,107,53,0.05);">
                <h4 class="pixel-font" style="color: #ff6b35; margin-bottom: 0.5rem;">APPLICATION TÉLÉCHARGÉE</h4>
                <p style="font-size: 0.75rem; color: #999;">
                    Cette version statique contient l'interface de base.<br>
                    Pour une version complète avec sauvegarde locale,<br>
                    utilisez l'application web originale.
                </p>
            </div>
        </div>
    </div>

    <script>
        // Simple interaction pour les démos
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🎮 RPG Gamification - Le Lapin Blanc');
            console.log('Version téléchargée - Interface statique');
        });
    </script>
</body>
</html>`;

    // Créer le blob et télécharger
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rpg-gamification-le-lapin-blanc.html';
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
        === TÉLÉCHARGER L'APP ===
      </h3>
      
      <div className="space-y-3">
        <Button
          onClick={downloadApp}
          className="retro-button w-full text-sm pixel-font border-2"
          style={{
            backgroundColor: currentTheme.primaryColor,
            color: currentTheme.backgroundColor,
            borderColor: currentTheme.backgroundColor,
            boxShadow: `3px 3px 0px ${currentTheme.backgroundColor}`
          }}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Télécharger App HTML
        </Button>
      </div>
      
      <div className="mt-4 p-3 rounded border-2" 
           style={{ 
             borderColor: currentTheme.primaryColor + '40',
             backgroundColor: currentTheme.primaryColor + '10'
           }}>
        <p className="text-xs pixel-font text-center" style={{ color: currentTheme.textColor }}>
          📱 Version HTML portable<br/>
          🎮 Prêt à utiliser hors ligne
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