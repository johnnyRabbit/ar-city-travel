import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

interface ContextualTip {
  id: string;
  condition: () => boolean;
  title: string;
  message: string;
  emoji: string;
  duration: number;
}

export default function ContextualTips() {
  const [currentTip, setCurrentTip] = useState<ContextualTip | null>(null);
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());
  const { gameActive, player, zombies, historicalEvents, score } = useGameStore();

  const tips: ContextualTip[] = [
    {
      id: 'first-zombie',
      condition: () => gameActive && zombies.length > 0 && score === 0,
      title: 'Zombie à vista!',
      message: 'Clica no zombie para o eliminar e ganhar pontos!',
      emoji: '🧟',
      duration: 5000,
    },
    {
      id: 'low-health',
      condition: () => gameActive && player.health < 30 && player.health > 0,
      title: 'Vida baixa!',
      message: 'Usa uma poção de cura do inventário ou foge dos zombies!',
      emoji: '❤️',
      duration: 4000,
    },
    {
      id: 'nearby-event',
      condition: () => {
        if (!gameActive) return false;
        const nearby = historicalEvents.find(e => {
          const dist = Math.sqrt(Math.pow(e.lat - player.lat, 2) + Math.pow(e.lng - player.lng, 2));
          return dist < 0.001 && !e.discovered;
        });
        return !!nearby;
      },
      title: 'Local histórico próximo!',
      message: 'Clica no marker para descobrir a sua história!',
      emoji: '📜',
      duration: 4000,
    },
    {
      id: 'first-discovery',
      condition: () => {
        const discovered = historicalEvents.filter(e => e.discovered).length;
        return discovered === 1;
      },
      title: 'Primeira descoberta!',
      message: 'Muito bem! Continua a explorar para encontrar mais locais!',
      emoji: '🎉',
      duration: 4000,
    },
    {
      id: 'many-zombies',
      condition: () => gameActive && zombies.filter(z => z.active).length >= 5,
      title: 'Muitos zombies!',
      message: 'Usa power-ups do inventário ou foge para um local seguro!',
      emoji: '⚠️',
      duration: 4000,
    },
    {
      id: 'high-score',
      condition: () => score > 0 && score % 500 === 0,
      title: 'Excelente!',
      message: `Já tens ${score} pontos! Continua assim!`,
      emoji: '⭐',
      duration: 3000,
    },
  ];

  useEffect(() => {
    if (!gameActive) return;

    // Check for new tips every 2 seconds
    const interval = setInterval(() => {
      for (const tip of tips) {
        if (!dismissedTips.has(tip.id) && tip.condition()) {
          setCurrentTip(tip);
          
          // Auto-dismiss after duration
          setTimeout(() => {
            setDismissedTips(prev => new Set([...prev, tip.id]));
            setCurrentTip(null);
          }, tip.duration);
          
          break;
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [gameActive, dismissedTips, player, zombies, historicalEvents, score]);

  const handleDismiss = () => {
    if (currentTip) {
      setDismissedTips(prev => new Set([...prev, currentTip.id]));
      setCurrentTip(null);
    }
  };

  if (!currentTip) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[3000] w-[90%] max-w-sm animate-slide-down">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{currentTip.emoji}</div>
          <div className="flex-1">
            <h3 className="font-bold text-sm text-gray-800 mb-1">{currentTip.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{currentTip.message}</p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
