import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

interface Particle {
  id: string;
  x: number;
  y: number;
  emoji: string;
  color: string;
  type: 'kill' | 'discover' | 'levelup' | 'combo';
}

export default function ParticleSystem() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const { zombies, score } = useGameStore();
  const [prevZombieCount, setPrevZombieCount] = useState(0);
  const [prevScore, setPrevScore] = useState(0);

  useEffect(() => {
    // Detect zombie kills
    const activeZombies = zombies.filter(z => z.active).length;
    if (activeZombies < prevZombieCount && prevZombieCount > 0) {
      // Zombie was killed - spawn particles
      spawnParticles('kill', 5);
    }
    setPrevZombieCount(activeZombies);

    // Detect score changes (discoveries, combos)
    if (score > prevScore) {
      const diff = score - prevScore;
      if (diff >= 100) {
        spawnParticles('discover', 8);
      } else if (diff >= 50) {
        spawnParticles('combo', 3);
      }
    }
    setPrevScore(score);
  }, [zombies, score, prevZombieCount, prevScore]);

  const spawnParticles = (type: Particle['type'], count: number) => {
    const emojis = {
      kill: ['💥', '✨', '⭐', '🔥', '💫'],
      discover: ['🎉', '✨', '🌟', '💎', '🏆'],
      levelup: ['🎊', '⭐', '🌟', '✨', '💫'],
      combo: ['⚡', '💥', '✨', '🔥', '💢'],
    };

    const colors = {
      kill: '#EF4444',
      discover: '#10B981',
      levelup: '#F59E0B',
      combo: '#8B5CF6',
    };

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `${Date.now()}-${Math.random()}`,
        x: 50 + (Math.random() - 0.5) * 40,
        y: 50 + (Math.random() - 0.5) * 40,
        emoji: emojis[type][Math.floor(Math.random() * emojis[type].length)],
        color: colors[type],
        type,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 1500);
  };

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1500] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `particle-${particle.type} 1.5s ease-out forwards`,
          }}
        >
          <span className="text-4xl" style={{ filter: `drop-shadow(0 0 8px ${particle.color})` }}>
            {particle.emoji}
          </span>
        </div>
      ))}
    </div>
  );
}
