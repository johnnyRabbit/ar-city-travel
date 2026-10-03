import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export default function ComboSystem() {
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [lastKillTime, setLastKillTime] = useState(0);
  const { zombies, addPoints } = useGameStore();
  const [prevZombieCount, setPrevZombieCount] = useState(0);

  useEffect(() => {
    const activeZombies = zombies.filter(z => z.active).length;
    
    if (activeZombies < prevZombieCount && prevZombieCount > 0) {
      // Zombie killed - increase combo
      const now = Date.now();
      const timeSinceLastKill = now - lastKillTime;
      
      if (timeSinceLastKill < 3000) {
        // Within 3 seconds - combo continues
        const newCombo = combo + 1;
        setCombo(newCombo);
        setShowCombo(true);
        
        // Bonus points for combo
        const bonusPoints = newCombo * 10;
        addPoints(bonusPoints);
        
        // Hide combo after 2 seconds of no kills
        setTimeout(() => {
          setShowCombo(false);
        }, 2000);
      } else {
        // Too slow - reset combo
        setCombo(1);
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 2000);
      }
      
      setLastKillTime(now);
    }
    
    setPrevZombieCount(activeZombies);
  }, [zombies]);

  // Reset combo after 5 seconds of inactivity
  useEffect(() => {
    if (combo === 0) return;
    
    const timer = setTimeout(() => {
      setCombo(0);
      setShowCombo(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [lastKillTime, combo]);

  if (!showCombo || combo < 2) return null;

  const getComboColor = () => {
    if (combo >= 10) return 'from-purple-500 to-pink-500';
    if (combo >= 5) return 'from-orange-500 to-red-500';
    if (combo >= 3) return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-cyan-500';
  };

  const getComboText = () => {
    if (combo >= 10) return '🔥 INSANO!';
    if (combo >= 5) return '⚡ INCRÍVEL!';
    if (combo >= 3) return '✨ COMBO!';
    return '💥 COMBO!';
  };

  return (
    <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1600] pointer-events-none">
      <div className={`bg-gradient-to-r ${getComboColor()} px-8 py-4 rounded-2xl shadow-2xl animate-combo-pulse`}>
        <div className="text-center">
          <p className="text-4xl font-bold text-white drop-shadow-lg">
            {getComboText()}
          </p>
          <p className="text-2xl font-bold text-white mt-2">
            x{combo}
          </p>
          <p className="text-sm text-white/80 mt-1">
            +{combo * 10} pontos bónus
          </p>
        </div>
      </div>
    </div>
  );
}
