import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useQuestStore } from '../store/questStore';
import { useInventoryStore } from '../store/inventoryStore';

export default function PlayerStats() {
  const [isOpen, setIsOpen] = useState(false);
  const { player, score, historicalEvents, zombies } = useGameStore();
  const { quests, dailyQuests } = useQuestStore();
  const { inventory } = useInventoryStore();

  const discoveredCount = historicalEvents.filter(e => e.discovered).length;
  const totalEvents = historicalEvents.length;
  const completedQuests = [...quests, ...dailyQuests].filter(q => q.status === 'claimed').length;
  const totalQuests = quests.length + dailyQuests.length;
  const zombiesKilled = Math.floor(score / 50); // Estimativa baseada nos pontos

  // Calcular nível e XP
  const xpForNextLevel = player.level * 200;
  const currentXP = score % xpForNextLevel;
  const xpPercent = (currentXP / xpForNextLevel) * 100;

  // Conquistas
  const achievements = [
    { id: 'first-discovery', title: 'Primeiro Passo', emoji: '🏛️', condition: discoveredCount >= 1, description: 'Descobre o teu primeiro local histórico' },
    { id: 'explorer', title: 'Explorador', emoji: '🗺️', condition: discoveredCount >= 3, description: 'Descobre 3 locais históricos' },
    { id: 'historian', title: 'Historiador', emoji: '📜', condition: discoveredCount >= 5, description: 'Descobre 5 locais históricos' },
    { id: 'master', title: 'Mestre do Tempo', emoji: '⏰', condition: discoveredCount >= totalEvents, description: 'Descobre todos os locais' },
    { id: 'hunter', title: 'Caçador', emoji: '🗡️', condition: zombiesKilled >= 10, description: 'Elimina 10 zombies' },
    { id: 'warrior', title: 'Guerreiro', emoji: '⚔️', condition: zombiesKilled >= 50, description: 'Elimina 50 zombies' },
    { id: 'legend', title: 'Lenda', emoji: '👑', condition: zombiesKilled >= 100, description: 'Elimina 100 zombies' },
    { id: 'collector', title: 'Colecionador', emoji: '🎒', condition: inventory.length >= 5, description: 'Tem 5 itens no inventário' },
    { id: 'quester', title: 'Aventureiro', emoji: '📋', condition: completedQuests >= 3, description: 'Completa 3 missões' },
    { id: 'score-1000', title: 'Mil pontos!', emoji: '⭐', condition: score >= 1000, description: 'Alcança 1000 pontos' },
    { id: 'score-5000', title: 'Cinco mil!', emoji: '🌟', condition: score >= 5000, description: 'Alcança 5000 pontos' },
    { id: 'level-5', title: 'Nível 5', emoji: '🎖️', condition: player.level >= 5, description: 'Alcança o nível 5' },
  ];

  const unlockedAchievements = achievements.filter(a => a.condition);
  const lockedAchievements = achievements.filter(a => !a.condition);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-14 right-2 z-[999] w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
      >
        <span className="text-lg">📊</span>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Stats Panel */}
      <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto pointer-events-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">📊 Estatísticas</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-95"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Player Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{player.avatar}</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{player.name}</h3>
                  <p className="text-sm text-purple-600 font-bold">Nível {player.level}</p>
                </div>
              </div>
              
              {/* XP Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Experiência</span>
                  <span className="text-purple-600 font-bold">{currentXP}/{xpForNextLevel} XP</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all animate-xp-fill"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>

              {/* Score */}
              <div className="text-center bg-white rounded-lg p-2">
                <span className="text-2xl font-bold text-purple-600">⭐ {score}</span>
                <p className="text-xs text-gray-500">Pontos Totais</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 text-center">
                <span className="text-2xl">🏛️</span>
                <p className="text-xl font-bold text-blue-800">{discoveredCount}/{totalEvents}</p>
                <p className="text-xs text-blue-600">Locais Descobertos</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 border border-red-200 text-center">
                <span className="text-2xl">🧟</span>
                <p className="text-xl font-bold text-red-800">~{zombiesKilled}</p>
                <p className="text-xs text-red-600">Zombies Eliminados</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 border border-green-200 text-center">
                <span className="text-2xl">📋</span>
                <p className="text-xl font-bold text-green-800">{completedQuests}/{totalQuests}</p>
                <p className="text-xs text-green-600">Missões Completas</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200 text-center">
                <span className="text-2xl">🎒</span>
                <p className="text-xl font-bold text-yellow-800">{inventory.length}</p>
                <p className="text-xs text-yellow-600">Itens no Inventário</p>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>🏆</span> Conquistas
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  {unlockedAchievements.length}/{achievements.length}
                </span>
              </h3>

              <div className="space-y-2">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                  >
                    <span className="text-2xl">{achievement.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{achievement.title}</p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                    <span className="text-green-500 text-lg">✅</span>
                  </div>
                ))}

                {lockedAchievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200 opacity-60"
                  >
                    <span className="text-2xl grayscale">🔒</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-600">{achievement.title}</p>
                      <p className="text-xs text-gray-400">{achievement.description}</p>
                    </div>
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
