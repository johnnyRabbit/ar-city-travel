import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export default function GameLoop() {
  const gameActive = useGameStore((state) => state.gameActive);

  useEffect(() => {
    if (!gameActive) return;

    console.log('[GameLoop] ✅ Started!');

    // Log zombie paths every 2 seconds for debugging
    const logInterval = setInterval(() => {
      const store = useGameStore.getState();
      store.zombies.forEach((z) => {
        if (z.active && z.path.length > 0) {
          console.log(`[Debug] Zombie ${z.id}: pos=(${z.lat.toFixed(5)}, ${z.lng.toFixed(5)}), path=[${z.path.join(', ')}], nodeIdx=${z.currentNodeIndex}, target=${z.targetNodeId}`);
        }
      });
    }, 2000);

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
      clearInterval(logInterval);
      clearInterval(moveInterval);
      clearInterval(spawnInterval);
    };
  }, [gameActive]);

  return null;
}
