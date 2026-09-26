import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useInventoryStore } from '../store/inventoryStore';

export default function PlayerMovement() {
  const { setPlayerPosition, player, gameActive } = useGameStore();
  const { activeEffects } = useInventoryStore();

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
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (position) => setPlayerPosition(position.coords.latitude, position.coords.longitude),
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [setPlayerPosition]);

  return null;
}
