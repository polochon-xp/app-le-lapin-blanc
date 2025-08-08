import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Download, X, Smartphone, Monitor, CheckCircle } from 'lucide-react';

const PWAInstallPrompt = ({ currentTheme }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('[PWA] beforeinstallprompt event triggered');
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt after a delay (if not installed)
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true);
        }
      }, 30000); // Show after 30 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show manual instructions if prompt not available
      setShowInstructions(true);
      return;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`[PWA] User response to install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      
      // Clear the prompt
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('[PWA] Error during installation:', error);
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  const InstallInstructions = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-black/30">
        <Smartphone className="w-6 h-6" style={{ color: currentTheme.primaryColor }} />
        <div>
          <h4 className="font-medium text-sm" style={{ color: currentTheme.textColor }}>
            Sur Mobile
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            Ouvrez le menu de votre navigateur et sélectionnez "Ajouter à l'écran d'accueil" ou "Installer l'app"
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-black/30">
        <Monitor className="w-6 h-6" style={{ color: currentTheme.primaryColor }} />
        <div>
          <h4 className="font-medium text-sm" style={{ color: currentTheme.textColor }}>
            Sur Bureau
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            Cliquez sur l'icône d'installation dans la barre d'adresse ou utilisez le menu du navigateur
          </p>
        </div>
      </div>
    </div>
  );

  if (isInstalled) {
    return (
      <Card className="border-0 bg-black/40 backdrop-blur-sm mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
            <span style={{ color: currentTheme.textColor }}>
              Application installée avec succès !
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Install Prompt Dialog */}
      <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
        <DialogContent 
          className="max-w-sm border-0 bg-black/95 backdrop-blur-sm"
          style={{ backgroundColor: currentTheme.cardColor + 'ee' }}
        >
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle style={{ color: currentTheme.primaryColor }}>
                Installer l'Application
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
            <p className="text-sm text-gray-400">
              Installez Le Lapin Blanc sur votre appareil pour un accès rapide et une expérience optimisée !
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-300">
                <CheckCircle className="w-3 h-3 mr-2" style={{ color: '#10b981' }} />
                Fonctionnement hors ligne
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <CheckCircle className="w-3 h-3 mr-2" style={{ color: '#10b981' }} />
                Accès depuis l'écran d'accueil
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <CheckCircle className="w-3 h-3 mr-2" style={{ color: '#10b981' }} />
                Performance optimisée
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleInstallClick}
                className="flex-1 text-sm h-9"
                style={{
                  backgroundColor: currentTheme.primaryColor,
                  color: currentTheme.backgroundColor,
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Installer
              </Button>
              
              <Button 
                onClick={handleDismiss}
                variant="outline"
                className="px-4 text-sm h-9 border-0"
                style={{
                  borderColor: currentTheme.accentColor,
                  color: currentTheme.textColor,
                  backgroundColor: 'transparent'
                }}
              >
                Plus tard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent 
          className="max-w-sm border-0 bg-black/95 backdrop-blur-sm"
          style={{ backgroundColor: currentTheme.cardColor + 'ee' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: currentTheme.primaryColor }}>
              Comment installer l'application
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

      {/* Install Button in Interface */}
      <Card className="border-0 bg-black/40 backdrop-blur-sm mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1" style={{ color: currentTheme.textColor }}>
                Application Mobile
              </h4>
              <p className="text-xs text-gray-400">
                Installez l'app pour un accès rapide
              </p>
            </div>
            <Button 
              onClick={handleInstallClick}
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
        </CardContent>
      </Card>
    </>
  );
};

export default PWAInstallPrompt;