import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Timer,
  Clock,
  Zap
} from 'lucide-react';

const TimerInterface = ({ currentTheme, onComplete }) => {
  const [time, setTime] = useState(25 * 60); // 25 minutes par défaut (Pomodoro)
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const intervalRef = useRef(null);

  const modes = {
    work: { duration: 25 * 60, label: 'Focus', color: '#ff6b35', icon: Zap },
    shortBreak: { duration: 5 * 60, label: 'Pause', color: '#4ade80', icon: Clock },
    longBreak: { duration: 15 * 60, label: 'Repos', color: '#06b6d4', icon: Timer }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime(time => {
          if (time <= 1) {
            setIsActive(false);
            setIsPaused(false);
            if (onComplete) onComplete(mode);
            // Son de notification (optionnel)
            if (typeof Audio !== 'undefined') {
              try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmceAS2Nyfi4bSEEJJDU8Mu+aSUIKXjE796NPwsTVK3n7aVTFAlBCLoRAH0nAQAA');
                audio.play();
              } catch (e) {
                console.log('Audio notification not available');
              }
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, onComplete, mode]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(initialTime);
  };

  const handleReset = () => {
    setTime(initialTime);
    setIsActive(false);
    setIsPaused(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    const newTime = modes[newMode].duration;
    setTime(newTime);
    setInitialTime(newTime);
    setIsActive(false);
    setIsPaused(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - time) / initialTime) * 100;
  const currentMode = modes[mode];

  // Calcul des coordonnées du cercle
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="border-0 bg-black/40 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="text-center space-y-6">
          {/* Sélecteur de mode */}
          <div className="flex justify-center gap-2">
            {Object.entries(modes).map(([key, modeData]) => {
              const Icon = modeData.icon;
              return (
                <Button
                  key={key}
                  variant={mode === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchMode(key)}
                  className="text-xs"
                  style={{
                    backgroundColor: mode === key ? modeData.color : 'transparent',
                    borderColor: modeData.color,
                    color: mode === key ? 'white' : modeData.color
                  }}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {modeData.label}
                </Button>
              );
            })}
          </div>

          {/* Timer circulaire */}
          <div className="relative flex items-center justify-center">
            <svg 
              width="200" 
              height="200" 
              className="transform -rotate-90"
              style={{ filter: `drop-shadow(0 0 10px ${currentMode.color}40)` }}
            >
              {/* Cercle de fond */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke={currentTheme.backgroundColor}
                strokeWidth="8"
                fill="none"
                opacity="0.3"
              />
              
              {/* Cercle de progression */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke={currentMode.color}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: `drop-shadow(0 0 5px ${currentMode.color})`,
                }}
              />

              {/* Points de progression */}
              {[0, 25, 50, 75].map(percent => {
                const angle = (percent / 100) * 2 * Math.PI - Math.PI / 2;
                const x = 100 + radius * Math.cos(angle);
                const y = 100 + radius * Math.sin(angle);
                return (
                  <circle
                    key={percent}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={progress >= percent ? currentMode.color : currentTheme.backgroundColor}
                    opacity="0.8"
                  />
                );
              })}
            </svg>

            {/* Contenu central */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div 
                className="text-4xl font-bold mb-2"
                style={{ 
                  color: currentMode.color,
                  textShadow: `0 0 10px ${currentMode.color}40`
                }}
              >
                {formatTime(time)}
              </div>
              <div 
                className="text-sm opacity-75"
                style={{ color: currentTheme.textColor }}
              >
                {currentMode.label}
              </div>
              
              {/* Indicateur d'état */}
              <div className="flex items-center gap-1 mt-2">
                {isActive && !isPaused && (
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: currentMode.color }}
                  />
                )}
                <span 
                  className="text-xs"
                  style={{ color: currentTheme.textColor + '80' }}
                >
                  {isActive 
                    ? (isPaused ? 'En pause' : 'En cours')
                    : (time === initialTime ? 'Prêt' : 'Arrêté')
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex justify-center gap-3">
            {!isActive ? (
              <Button
                onClick={handleStart}
                className="px-6"
                style={{ 
                  backgroundColor: currentMode.color, 
                  color: 'white',
                  boxShadow: `0 0 15px ${currentMode.color}40`
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Démarrer
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                variant="outline"
                className="px-6"
                style={{ 
                  borderColor: currentMode.color,
                  color: currentMode.color
                }}
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Reprendre
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>
            )}

            <Button
              onClick={handleStop}
              variant="outline"
              style={{ 
                borderColor: '#ef4444',
                color: '#ef4444'
              }}
            >
              <Square className="w-4 h-4 mr-2" />
              Arrêter
            </Button>

            <Button
              onClick={handleReset}
              variant="ghost"
              style={{ color: currentTheme.textColor + '80' }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            <div className="text-center">
              <div 
                className="text-lg font-bold"
                style={{ color: currentMode.color }}
              >
                {Math.round(progress)}%
              </div>
              <div className="text-xs opacity-75" style={{ color: currentTheme.textColor }}>
                Progression
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-lg font-bold"
                style={{ color: currentMode.color }}
              >
                {Math.floor(initialTime / 60)}min
              </div>
              <div className="text-xs opacity-75" style={{ color: currentTheme.textColor }}>
                Durée totale
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-lg font-bold"
                style={{ color: currentMode.color }}
              >
                {Math.floor((initialTime - time) / 60)}min
              </div>
              <div className="text-xs opacity-75" style={{ color: currentTheme.textColor }}>
                Temps écoulé
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerInterface;