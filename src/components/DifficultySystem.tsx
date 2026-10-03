import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function DifficultySystem() {
  const { gameActive, score, spawnZombies } = useGameStore();
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [spawnRate, setSpawnRate] = useState(15000); // 15 seconds

  useEffect(() => {
    if (!gameActive) {
      setDifficultyLevel(1);
      setSpawnRate(15000);
      return;
    }

    // Calculate difficulty based on score
    const newLevel = Math.floor(score / 500) + 1;
    if (newLevel !== difficultyLevel) {
      setDifficultyLevel(newLevel);
      
      // Increase spawn rate (faster spawns) - minimum 5 seconds
      const newSpawnRate = Math.max(5000, 15000 - (newLevel - 1) * 1000);
      setSpawnRate(newSpawnRate);
      
      console.log(`[Difficulty] Level ${newLevel}, Spawn rate: ${newSpawnRate}ms`);
    }
  }, [score, gameActive, difficultyLevel]);

  // Dynamic zombie spawning based on difficulty
  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      const store = useGameStore.getState();
      const activeZombies = store.zombies.filter(z => z.active).length;
      
      // Max zombies increases with difficulty
      const maxZombies = Math.min(15, 8 + difficultyLevel);
      
      if (activeZombies < maxZombies) {
        // Spawn more zombies at higher difficulty
        const spawnCount = Math.min(3, Math.ceil(difficultyLevel / 3));
        spawnZombies(spawnCount);
      }
    }, spawnRate);

    return () => clearInterval(interval);
  }, [gameActive, spawnRate, difficultyLevel, spawnZombies]);

  // Show difficulty indicator
  if (!gameActive) return null;

  const getDifficultyColor = () => {
    if (difficultyLevel >= 10) return 'text-red-500';
    if (difficultyLevel >= 5) return 'text-orange-500';
    if (difficultyLevel >= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getDifficultyText = () => {
    if (difficultyLevel >= 10) return '💀 EXTREMO';
    if (difficultyLevel >= 7) return '🔥 MUITO DIFÍCIL';
    if (difficultyLevel >= 5) return '⚠️ DIFÍCIL';
    if (difficultyLevel >= 3) return '⚡ MÉDIO';
    return '🟢 FÁCIL';
  };

  return (
    <div className="fixed top-24 right-4 z-[1100] pointer-events-none">
      <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
        <p className={`text-xs font-bold ${getDifficultyColor()}`}>
          {getDifficultyText()}
        </p>
        <p className="text-xs text-white/60">
          Nível {difficultyLevel}
        </p>
      </div>
    </div>
  );
}
