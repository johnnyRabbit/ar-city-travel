import { create } from 'zustand';
import { Quest, QuestStatus } from '../types/quests';
import { quests, dailyQuests } from '../data/quests';

interface QuestStore {
  quests: Quest[];
  dailyQuests: Quest[];
  
  // Actions
  updateQuestProgress: (questId: string, amount: number) => void;
  claimQuestReward: (questId: string) => { points: number; items: string[] } | null;
  resetDailyQuests: () => void;
  getActiveQuests: () => Quest[];
  getCompletedQuests: () => Quest[];
}

export const useQuestStore = create<QuestStore>((set, get) => ({
  quests: quests,
  dailyQuests: dailyQuests,

  updateQuestProgress: (questId: string, amount: number) => {
    set((state) => {
      const updateQuest = (quest: Quest): Quest => {
        if (quest.id === questId && quest.status === 'active') {
          const newProgress = Math.min(quest.progress + amount, quest.target);
          const newStatus: QuestStatus = newProgress >= quest.target ? 'completed' : 'active';
          return { ...quest, progress: newProgress, status: newStatus };
        }
        return quest;
      };

      return {
        quests: state.quests.map(updateQuest),
        dailyQuests: state.dailyQuests.map(updateQuest),
      };
    });
  },

  claimQuestReward: (questId: string) => {
    const allQuests = [...get().quests, ...get().dailyQuests];
    const quest = allQuests.find(q => q.id === questId);
    
    if (!quest || quest.status !== 'completed') {
      return null;
    }

    set((state) => {
      const claimQuest = (q: Quest): Quest => {
        if (q.id === questId) {
          return { ...q, status: 'claimed' as QuestStatus };
        }
        return q;
      };

      return {
        quests: state.quests.map(claimQuest),
        dailyQuests: state.dailyQuests.map(claimQuest),
      };
    });

    return {
      points: quest.reward.points,
      items: quest.reward.items || [],
    };
  },

  resetDailyQuests: () => {
    set({ dailyQuests: dailyQuests.map(q => ({ ...q, progress: 0, status: 'active' as QuestStatus })) });
  },

  getActiveQuests: () => {
    const allQuests = [...get().quests, ...get().dailyQuests];
    return allQuests.filter(q => q.status === 'active' || q.status === 'completed');
  },

  getCompletedQuests: () => {
    const allQuests = [...get().quests, ...get().dailyQuests];
    return allQuests.filter(q => q.status === 'completed');
  },
}));
