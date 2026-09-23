export type QuestType = 'discover' | 'kill' | 'collect' | 'survive' | 'explore';
export type QuestStatus = 'active' | 'completed' | 'claimed';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  target: number; // quantidade necessária
  progress: number; // progresso atual
  status: QuestStatus;
  reward: QuestReward;
  era?: string; // era específica (opcional)
  location?: string; // local específico (opcional)
  timeLimit?: number; // segundos (opcional)
  emoji: string;
}

export interface QuestReward {
  points: number;
  items?: string[]; // item IDs
  badge?: string; // badge ID
}

export interface QuestCategory {
  id: string;
  name: string;
  emoji: string;
  quests: Quest[];
}
