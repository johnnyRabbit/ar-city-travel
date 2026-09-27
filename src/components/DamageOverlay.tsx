import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export default function DamageOverlay() {
  const { player } = useGameStore();
  const [showDamage, setShowDamage] = useState(false);
  const [showHeal, setShowHeal] = useState(false);
  const prevHealth = useRef(player.health);

  useEffect(() => {
    if (player.health < prevHealth.current) {
      // Player took damage
      setShowDamage(true);
      setTimeout(() => setShowDamage(false), 400);
    } else if (player.health > prevHealth.current) {
      // Player healed
      setShowHeal(true);
      setTimeout(() => setShowHeal(false), 600);
    }
    prevHealth.current = player.health;
  }, [player.health]);

  return (
    <>
      {/* Damage Flash */}
      {showDamage && (
        <div className="fixed inset-0 z-[1200] pointer-events-none animate-damage">
          <div className="absolute inset-0 bg-red-500/20" />
          {/* Vignette effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, transparent 40%, rgba(239, 68, 68, 0.4) 100%)',
            }}
          />
        </div>
      )}

      {/* Heal Flash */}
      {showHeal && (
        <div className="fixed inset-0 z-[1200] pointer-events-none">
          <div 
            className="absolute inset-0 animate-fade-in"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 60%)',
              animation: 'fade-in 0.3s ease-out, fade-out 0.3s ease-in 0.3s forwards',
            }}
          />
        </div>
      )}

      {/* Low Health Warning */}
      {player.health <= 25 && player.health > 0 && (
        <div className="fixed inset-0 z-[1100] pointer-events-none">
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'radial-gradient(circle, transparent 50%, rgba(239, 68, 68, 0.15) 100%)',
              animationDuration: '1.5s',
            }}
          />
        </div>
      )}
    </>
  );
}
