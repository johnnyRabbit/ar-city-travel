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

    // Sort by points
    allEntries.sort((a, b) => b.points - a.points);
    allEntries.forEach((e, i) => (e.rank = i + 1));

    setEntries(allEntries);
  }, [player, score, simPlayers]);

  const playerEntry = entries.find((e) => e.isPlayer);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-32 left-30 z-[999] w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
      >
        <span className="text-xl">🏆</span>
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl w-[280px] max-h-[400px] flex flex-col">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-bold text-gray-800 text-sm">🏆 Leaderboard</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {entries.map((entry) => (
          <div
            key={entry.name}
            className={`flex items-center gap-2 p-2 rounded-lg mb-1 ${
              entry.isPlayer ? 'bg-blue-50 border-2 border-blue-300' : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-lg font-bold w-6 text-center">
              {entry.rank === 1 && '🥇'}
              {entry.rank === 2 && '🥈'}
              {entry.rank === 3 && '🥉'}
              {entry.rank > 3 && `#${entry.rank}`}
            </span>
            <span className="text-xl">{entry.avatar}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold truncate ${entry.isPlayer ? 'text-blue-700' : 'text-gray-800'}`}>
                {entry.name} {entry.isPlayer && '(Tu)'}
              </p>
              <p className="text-[10px] text-gray-500">Nível {entry.level}</p>
            </div>
            <span className="text-xs font-bold text-purple-600">⭐ {entry.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
