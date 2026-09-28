import { useState } from 'react';
import { useQuestStore } from '../store/questStore';
import { useGameStore } from '../store/gameStore';

export default function QuestPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { quests, dailyQuests, claimQuestReward } = useQuestStore();
  const { addPoints, addNotification } = useGameStore();

  const allQuests = [...dailyQuests, ...quests];
  const activeQuests = allQuests.filter(q => q.status === 'active' || q.status === 'completed');
  const completedCount = activeQuests.filter(q => q.status === 'completed').length;

  const handleClaim = (questId: string) => {
    const reward = claimQuestReward(questId);
    if (reward) {
      addPoints(reward.points);
      addNotification(`🎁 Recompensa: +${reward.points} pontos!`, 'success');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'legendary': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 border-2 border-white/20"
        title="Missões"
      >
        <span className="text-2xl">📜</span>
        {completedCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white/30">
            {completedCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl w-[320px] max-h-[500px] flex flex-col border-2 border-white/20">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <span>📜</span> Missões
        </h3>
        <button 
          onClick={() => setIsOpen(false)} 
          className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeQuests.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Nenhuma missão ativa</p>
        ) : (
          activeQuests.map((quest) => {
            const progress = (quest.progress / quest.target) * 100;
            const isCompleted = quest.status === 'completed';

            return (
              <div
                key={quest.id}
                className={`p-4 rounded-xl border-2 ${
                  isCompleted 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{quest.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-white">{quest.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty === 'easy' && 'Fácil'}
                        {quest.difficulty === 'medium' && 'Médio'}
                        {quest.difficulty === 'hard' && 'Difícil'}
                        {quest.difficulty === 'legendary' && 'Lendário'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{quest.description}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Progresso</span>
                    <span className="text-white font-bold">{quest.progress}/{quest.target}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Reward & Action */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-yellow-400 font-bold">🎁 {quest.reward.points} pts</span>
                  {isCompleted && (
                    <button
                      onClick={() => handleClaim(quest.id)}
                      className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all active:scale-95 animate-pulse"
                    >
                      Reclamar
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
