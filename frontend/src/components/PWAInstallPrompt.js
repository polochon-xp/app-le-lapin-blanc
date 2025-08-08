import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Download, X, Smartphone, Monitor, CheckCircle, Wifi, WifiOff, Zap } from 'lucide-react';

const PWAInstallPrompt = ({ currentTheme }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [appSize, setAppSize] = useState('~2MB');

  useEffect(() => {
    // Détecter si l'app est déjà installée (mode standalone)
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isInWebView = window.navigator.standalone; // iOS Safari
    
    if (isStandalone || isInWebView) {
      setIsInstalled(true);
      return;
    }

    // Écouter les événements de connexion
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Gérer l'événement d'installation PWA
    const handleBeforeInstallPrompt = (e) => {
      console.log('[PWA] 🎯 Event beforeinstallprompt déclenché');
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Attendre avant d'afficher le prompt (meilleure UX)
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('pwa-install-dismissed')) {
          setShowInstallPrompt(true);
        }
      }, 45000); // 45 secondes après le chargement
    };

    // Écouter l'installation réussie
    const handleAppInstalled = () => {
      console.log('[PWA] 🎉 Application installée avec succès!');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowInstructions(true);
      return;
    }

    try {
      console.log('[PWA] 🚀 Lancement du processus d\'installation...');
      
      // Déclencher le prompt d'installation natif
      deferredPrompt.prompt();
      
      // Attendre la réponse de l'utilisateur
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`[PWA] 📊 Réponse utilisateur: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('[PWA] ✅ Installation acceptée par l\'utilisateur');
        setShowInstallPrompt(false);
      } else {
        console.log('[PWA] ❌ Installation refusée par l\'utilisateur');
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
      
      setDeferredPrompt(null);
      
    } catch (error) {
      console.error('[PWA] ⚠️ Erreur lors de l\'installation:', error);
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const forceShowInstall = () => {
    localStorage.removeItem('pwa-install-dismissed');
    setShowInstallPrompt(true);
  };

  const InstallInstructions = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <Smartphone className="w-12 h-12 mx-auto mb-2" style={{ color: currentTheme.primaryColor }} />
        <h3 className="font-bold text-lg mb-2" style={{ color: currentTheme.textColor }}>
          Installation Manuelle
        </h3>
        <p className="text-xs text-gray-400">
          Votre navigateur ne supporte pas l'installation automatique
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-3 p-3 rounded-lg bg-black/30">
          <div className="p-2 rounded-full bg-blue-500/20">
            <Monitor className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-white">Desktop (Chrome/Edge)</h4>
            <p className="text-xs text-gray-400 mt-1">
              Cliquez sur l'icône d'installation dans la barre d'adresse (à droite)
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-3 rounded-lg bg-black/30">
          <div className="p-2 rounded-full bg-green-500/20">
            <Smartphone className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-white">Mobile (Chrome)</h4>
            <p className="text-xs text-gray-400 mt-1">
              Menu (⋮) → "Ajouter à l'écran d'accueil" ou "Installer l'app"
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 rounded-lg bg-black/30">
          <div className="p-2 rounded-full bg-gray-500/20">
            <Smartphone className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-white">iOS Safari</h4>
            <p className="text-xs text-gray-400 mt-1">
              Bouton Partager → "Sur l'écran d'accueil"
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Affichage si l'app est déjà installée
  if (isInstalled) {
    return (
      <Card className="border-0 bg-black/40 backdrop-blur-sm mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-sm" style={{ color: currentTheme.textColor }}>
                  Application Installée
                </h4>
                <p className="text-xs text-gray-400">
                  Fonctionne maintenant hors ligne
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-orange-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Installation Prompt Dialog */}
      <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
        <DialogContent 
          className="max-w-sm border-0 bg-black/95 backdrop-blur-sm"
          style={{ backgroundColor: currentTheme.cardColor + 'ee' }}
        >
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle style={{ color: currentTheme.primaryColor }}>
                📱 Installer l'Application
              </DialogTitle>
              <Button
                variant="ghost"
                onClick={handleDismiss}
                className="p-1 h-auto"
                style={{ color: currentTheme.textColor }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
                   style={{ backgroundColor: currentTheme.primaryColor + '20' }}>
                <Download className="w-8 h-8" style={{ color: currentTheme.primaryColor }} />
              </div>
              <p className="text-sm text-gray-300 mb-2">
                Transformez <strong>Le Lapin Blanc</strong> en application mobile !
              </p>
              <p className="text-xs text-gray-400">
                Taille: {appSize} • Installation rapide
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2">
                <div className="w-6 h-6 rounded-full bg-green-500/20 mx-auto mb-1 flex items-center justify-center">
                  <WifiOff className="w-3 h-3 text-green-400" />
                </div>
                <p className="text-xs text-gray-300">Mode Offline</p>
              </div>
              <div className="p-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 mx-auto mb-1 flex items-center justify-center">
                  <Zap className="w-3 h-3 text-blue-400" />
                </div>
                <p className="text-xs text-gray-300">Plus Rapide</p>
              </div>
              <div className="p-2">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 mx-auto mb-1 flex items-center justify-center">
                  <Smartphone className="w-3 h-3 text-purple-400" />
                </div>
                <p className="text-xs text-gray-300">App Native</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleDismiss}
                variant="outline"
                className="flex-1 text-xs h-9 border-0"
                style={{
                  borderColor: currentTheme.accentColor,
                  color: currentTheme.textColor,
                  backgroundColor: 'transparent'
                }}
              >
                Plus tard
              </Button>
              
              <Button 
                onClick={handleInstallClick}
                className="flex-1 text-xs h-9"
                style={{
                  backgroundColor: currentTheme.primaryColor,
                  color: currentTheme.backgroundColor,
                }}
              >
                <Download className="w-3 h-3 mr-1" />
                Installer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent 
          className="max-w-md border-0 bg-black/95 backdrop-blur-sm"
          style={{ backgroundColor: currentTheme.cardColor + 'ee' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: currentTheme.primaryColor }}>
              Installation de l'Application
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <InstallInstructions />
            
            <Button 
              onClick={() => setShowInstructions(false)}
              className="w-full text-sm h-9"
              style={{
                backgroundColor: currentTheme.primaryColor,
                color: currentTheme.backgroundColor,
              }}
            >
              Compris
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Install Card in Interface */}
      <Card className="border-0 bg-black/40 backdrop-blur-sm mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: currentTheme.primaryColor + '20' }}>
                <Smartphone className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1" style={{ color: currentTheme.textColor }}>
                  Version Mobile
                </h4>
                <p className="text-xs text-gray-400">
                  Installez pour un accès rapide
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isOnline && (
                <WifiOff className="w-4 h-4 text-orange-400" title="Mode hors ligne" />
              )}
              
              <Button 
                onClick={deferredPrompt ? handleInstallClick : forceShowInstall}
                className="text-xs h-8 px-3"
                style={{
                  backgroundColor: currentTheme.primaryColor,
                  color: currentTheme.backgroundColor,
                }}
              >
                <Download className="w-3 h-3 mr-1" />
                Installer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PWAInstallPrompt;