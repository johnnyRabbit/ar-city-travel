import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export default function GameLoop() {
  const { gameActive, updateZombies, spawnZombies, zombies } = useGameStore();

  useEffect(() => {
    if (!gameActive) return;
    const moveInterval = setInterval(() => updateZombies(), 100);
    const spawnInterval = setInterval(() => {
      if (zombies.filter((z) => z.active).length < 8) spawnZombies(1);
    }, 15000);
    return () => { clearInterval(moveInterval); clearInterval(spawnInterval); };
  }, [gameActive, updateZombies, spawnZombies, zombies]);

  return null;
}
