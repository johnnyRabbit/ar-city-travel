import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export default function GameLoop() {
  const gameActive = useGameStore((state) => state.gameActive);

  useEffect(() => {
    if (!gameActive) return;

    console.log('[GameLoop] ✅ Started!');

    // Move zombies every 100ms
    const moveInterval = setInterval(() => {
      const store = useGameStore.getState();
      store.updateZombies();
    }, 100);

    // Spawn new zombie every 15 seconds
    const spawnInterval = setInterval(() => {
      const store = useGameStore.getState();
      const activeZombies = store.zombies.filter((z) => z.active).length;
      if (activeZombies < 8) {
        store.spawnZombies(1);
      }
    }, 15000);

    return () => {
      console.log('[GameLoop] ❌ Stopped!');
      clearInterval(moveInterval);
      clearInterval(spawnInterval);
    };
  }, [gameActive]); // Only depend on gameActive

  return null;
}
