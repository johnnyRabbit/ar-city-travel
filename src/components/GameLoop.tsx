import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useQuestStore } from '../store/questStore';
import { useBossStore } from '../store/bossStore';

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

    // Check boss spawns every 10 seconds
    const bossCheckInterval = setInterval(() => {
      const bossStore = useBossStore.getState();
      const bossToSpawn = bossStore.checkBossSpawns();
      if (bossToSpawn) {
        bossStore.spawnBoss(bossToSpawn);
        const gameStore = useGameStore.getState();
        gameStore.addNotification('👹 Um boss histórico apareceu!', 'danger');
      }
    }, 10000);

    // Update boss abilities every 500ms
    const bossUpdateInterval = setInterval(() => {
      const bossStore = useBossStore.getState();
      const effect = bossStore.updateBosses();
      if (effect) {
        const gameStore = useGameStore.getState();
        gameStore.addNotification(effect.message, 'danger');
        if (effect.type === 'damage') {
          gameStore.damagePlayer(effect.value);
        }
      }
    }, 500);

    // Update survival quest progress every second
    const questInterval = setInterval(() => {
      const questStore = useQuestStore.getState();
      questStore.updateQuestProgress('survive-5min', 1);
      questStore.updateQuestProgress('survive-10min', 1);
    }, 1000);

    return () => {
      console.log('[GameLoop] ❌ Stopped!');
      clearInterval(moveInterval);
      clearInterval(spawnInterval);
      clearInterval(bossCheckInterval);
      clearInterval(bossUpdateInterval);
      clearInterval(questInterval);
    };
  }, [gameActive]);

  return null;
}
