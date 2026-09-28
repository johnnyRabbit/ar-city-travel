import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useSimulatedPlayers } from './OtherPlayers';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  level: number;
  isPlayer: boolean;
}

export default function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { player, score } = useGameStore();
  const simPlayers = useSimulatedPlayers();

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Combine player + simulated players
    const allEntries: LeaderboardEntry[] = [
      {
        rank: 0,
        name: player.name,
        avatar: player.avatar,
        points: score,
        level: player.level,
        isPlayer: true,
      },
      ...simPlayers.map((p) => ({
        rank: 0,
        name: p.name,
        avatar: p.avatar,
        points: p.points,
        level: p.level,
        isPlayer: false,
      })),
    ];

    // Sort by points and assign ranks
    allEntries.sort((a, b) => b.points - a.points);
    allEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    setEntries(allEntries);
  }, [score, player, simPlayers]);

  const playerRank = entries.find((e) => e.isPlayer)?.rank || 0;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 border-2 border-white/20"
        title="Leaderboard"
      >
        <span className="text-2xl">🏆</span>
        <span className="absolute -top-1 -right-1 bg-yellow-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white/30">
          {playerRank}
        </span>
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl w-[320px] max-h-[500px] flex flex-col border-2 border-white/20">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <span>🏆</span> Ranking
        </h3>
        <button 
          onClick={() => setIsOpen(false)} 
          className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {entries.slice(0, 10).map((entry) => {
          const getRankEmoji = (rank: number) => {
            if (rank === 1) return '🥇';
            if (rank === 2) return '🥈';
            if (rank === 3) return '🥉';
            return `#${rank}`;
          };

          return (
            <div
              key={entry.name}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                entry.isPlayer
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50'
                  : 'bg-white/5 border-2 border-white/10'
              }`}
            >
              <div className="text-2xl w-8 text-center">
                {getRankEmoji(entry.rank)}
              </div>
              <span className="text-3xl">{entry.avatar}</span>
              <div className="flex-1">
                <p className={`font-bold text-sm ${entry.isPlayer ? 'text-white' : 'text-gray-300'}`}>
                  {entry.name} {entry.isPlayer && '(Tu)'}
                </p>
                <p className="text-xs text-gray-400">Nv. {entry.level}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-yellow-400 text-sm">⭐ {entry.points}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">
          💡 Dica: Elimina zombies e descobre locais para subir no ranking!
        </p>
      </div>
    </div>
  );
}
