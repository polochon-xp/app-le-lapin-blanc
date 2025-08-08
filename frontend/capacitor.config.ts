import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lepinblanc.mobile',
  appName: 'Le Lapin Blanc',
  webDir: 'build',
  bundledWebRuntime: false,
  backgroundColor: '#1a0d00',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a0d00',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1a0d00',
    },
    Keyboard: {
      resize: 'ionic',
      style: 'DARK',
      resizeOnFullScreen: true
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;