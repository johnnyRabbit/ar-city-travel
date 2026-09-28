import { useEffect, useCallback, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useInventoryStore } from '../store/inventoryStore';

export default function PlayerMovement() {
  const { setPlayerPosition, player, gameActive } = useGameStore();
  const { activeEffects } = useInventoryStore();
  const [gpsStatus, setGpsStatus] = useState<'loading' | 'active' | 'error'>('loading');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!gameActive) return;
    
    // Apply speed multiplier
    const speedMultiplier = activeEffects.reduce((mult, effect) => {
      if (effect.effect.speedMultiplier) return mult * effect.effect.speedMultiplier;
      return mult;
    }, 1);
    
    const step = 0.0003 * speedMultiplier;
    
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': setPlayerPosition(player.lat + step, player.lng); break;
      case 'ArrowDown': case 's': case 'S': setPlayerPosition(player.lat - step, player.lng); break;
      case 'ArrowLeft': case 'a': case 'A': setPlayerPosition(player.lat, player.lng - step); break;
      case 'ArrowRight': case 'd': case 'D': setPlayerPosition(player.lat, player.lng + step); break;
    }
  }, [player.lat, player.lng, setPlayerPosition, gameActive, activeEffects]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }

    setGpsStatus('loading');
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setPlayerPosition(position.coords.latitude, position.coords.longitude);
        setGpsStatus('active');
      },
      (error) => {
        console.warn('GPS error:', error.message);
        setGpsStatus('error');
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 5000,
        timeout: 10000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setPlayerPosition]);

  // Indicador de status GPS (apenas no desktop para debug)
  if (typeof window !== 'undefined' && window.innerWidth > 768) {
    return (
      <div className="fixed bottom-2 left-2 z-[999] bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs flex items-center gap-1 shadow">
        <div className={`w-2 h-2 rounded-full ${
          gpsStatus === 'active' ? 'bg-green-500 animate-pulse' :
          gpsStatus === 'loading' ? 'bg-yellow-500 animate-pulse' :
          'bg-red-500'
        }`} />
        <span className="text-gray-600">
          {gpsStatus === 'active' ? 'GPS' : gpsStatus === 'loading' ? 'A procurar...' : 'Sem GPS'}
        </span>
      </div>
    );
  }

  return null;
}
