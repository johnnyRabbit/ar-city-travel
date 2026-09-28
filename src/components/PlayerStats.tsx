import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useQuestStore } from '../store/questStore';
import { useInventoryStore } from '../store/inventoryStore';

export default function PlayerStats() {
  const [isOpen, setIsOpen] = useState(false);
  const { player, score, historicalEvents } = useGameStore();
  const { quests, dailyQuests } = useQuestStore();
  const { inventory } = useInventoryStore();

  const discoveredCount = historicalEvents.filter(e => e.discovered).length;
  const totalEvents = historicalEvents.length;
  const completedQuests = [...quests, ...dailyQuests].filter(q => q.status === 'claimed').length;
  const totalQuests = quests.length + dailyQuests.length;
  const zombiesKilled = Math.floor(score / 50);

  const xpForNextLevel = player.level * 200;
  const currentXP = score % xpForNextLevel;
  const xpPercent = (currentXP / xpForNextLevel) * 100;

  const achievements = [
    { id: 'first-discovery', title: 'Primeiro Passo', emoji: '🏛️', condition: discoveredCount >= 1 },
    { id: 'explorer', title: 'Explorador', emoji: '🗺️', condition: discoveredCount >= 3 },
    { id: 'historian', title: 'Historiador', emoji: '📜', condition: discoveredCount >= 5 },
    { id: 'master', title: 'Mestre do Tempo', emoji: '⏰', condition: discoveredCount >= totalEvents },
    { id: 'hunter', title: 'Caçador', emoji: '🗡️', condition: zombiesKilled >= 10 },
    { id: 'warrior', title: 'Guerreiro', emoji: '⚔️', condition: zombiesKilled >= 50 },
    { id: 'legend', title: 'Lenda', emoji: '👑', condition: zombiesKilled >= 100 },
    { id: 'collector', title: 'Colecionador', emoji: '🎒', condition: inventory.length >= 5 },
    { id: 'quester', title: 'Aventureiro', emoji: '📋', condition: completedQuests >= 3 },
    { id: 'score-1000', title: 'Mil pontos!', emoji: '⭐', condition: score >= 1000 },
    { id: 'score-5000', title: 'Cinco mil!', emoji: '🌟', condition: score >= 5000 },
    { id: 'level-5', title: 'Nível 5', emoji: '🎖️', condition: player.level >= 5 },
  ];

  const unlockedAchievements = achievements.filter(a => a.condition);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-xl hover:bg-white/20 transition-all active:scale-95 border-2 border-white/20"
        title="Estatísticas"
      >
        📊
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Stats Panel */}
      <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto pointer-events-auto border border-white/10">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">📊 Estatísticas</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-95 text-xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Player Card */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-5 border border-purple-500/30">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{player.avatar}</span>
                <div>
                  <h3 className="font-bold text-white text-xl">{player.name}</h3>
                  <p className="text-purple-300 font-bold">Nível {player.level}</p>
                </div>
              </div>
              
              {/* XP Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-300">Experiência</span>
                  <span className="text-purple-300 font-bold">{currentXP}/{xpForNextLevel} XP</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>

              {/* Score */}
              <div className="text-center bg-white/5 rounded-xl p-3 border border-white/10">
                <span className="text-3xl font-bold text-yellow-400">⭐ {score}</span>
                <p className="text-xs text-gray-400 mt-1">Pontos Totais</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30 text-center">
                <span className="text-3xl">🏛️</span>
                <p className="text-2xl font-bold text-blue-400 mt-2">{discoveredCount}/{totalEvents}</p>
                <p className="text-xs text-gray-400 mt-1">Locais</p>
              </div>
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30 text-center">
                <span className="text-3xl">🧟</span>
                <p className="text-2xl font-bold text-red-400 mt-2">~{zombiesKilled}</p>
                <p className="text-xs text-gray-400 mt-1">Zombies</p>
              </div>
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30 text-center">
                <span className="text-3xl">📋</span>
                <p className="text-2xl font-bold text-green-400 mt-2">{completedQuests}/{totalQuests}</p>
                <p className="text-xs text-gray-400 mt-1">Missões</p>
              </div>
              <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30 text-center">
                <span className="text-3xl">🎒</span>
                <p className="text-2xl font-bold text-yellow-400 mt-2">{inventory.length}</p>
                <p className="text-xs text-gray-400 mt-1">Itens</p>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-lg">
                <span>🏆</span> Conquistas
                <span className="text-xs bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full">
                  {unlockedAchievements.length}/{achievements.length}
                </span>
              </h3>

              <div className="space-y-2">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/30"
                  >
                    <span className="text-3xl">{achievement.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{achievement.title}</p>
                    </div>
                    <span className="text-green-400 text-2xl">✅</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
