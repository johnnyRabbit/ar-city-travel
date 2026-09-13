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
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      case 'legendary': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-32 left-2 z-[999] w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
      >
        <div className="relative">
          <span className="text-xl">📜</span>
          {completedCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {completedCount}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="absolute top-40 left-4 z-[1000] bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl w-[320px] max-h-[500px] flex flex-col">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-bold text-gray-800 text-sm">📜 Missões</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeQuests.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Nenhuma missão ativa</p>
        ) : (
          activeQuests.map((quest) => {
            const progress = (quest.progress / quest.target) * 100;
            const isCompleted = quest.status === 'completed';

            return (
              <div
                key={quest.id}
                className={`p-3 rounded-lg border-2 ${
                  isCompleted ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-2xl">{quest.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-gray-800">{quest.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty === 'easy' && 'Fácil'}
                        {quest.difficulty === 'medium' && 'Médio'}
                        {quest.difficulty === 'hard' && 'Difícil'}
                        {quest.difficulty === 'legendary' && 'Lendário'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{quest.description}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-bold text-gray-800">
                      {quest.progress}/{quest.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Reward */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    <span className="font-bold text-purple-600">⭐ {quest.reward.points} pts</span>
                    {quest.reward.items && quest.reward.items.length > 0 && (
                      <span className="ml-2">🎁 {quest.reward.items.length} item(ns)</span>
                    )}
                  </div>

                  {isCompleted && (
                    <button
                      onClick={() => handleClaim(quest.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors"
                    >
                      🎁 Reclamar
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
