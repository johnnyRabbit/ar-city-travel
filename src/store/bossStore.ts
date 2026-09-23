import { create } from 'zustand';
import { Boss, BossEffect } from '../data/bosses';
import { bosses } from '../data/bosses';

interface BossStore {
  bosses: Boss[];
  activeBoss: Boss | null;
  
  // Actions
  spawnBoss: (bossId: string) => void;
  damageBoss: (amount: number) => { killed: boolean; points: number; items: string[] } | null;
  updateBosses: () => BossEffect | null;
  checkBossSpawns: () => string | null;
  resetBosses: () => void;
}

export const useBossStore = create<BossStore>((set, get) => ({
  bosses: bosses,
  activeBoss: null,

  spawnBoss: (bossId: string) => {
    const boss = get().bosses.find(b => b.id === bossId);
    if (!boss) return;

    set((state) => ({
      activeBoss: { ...boss, active: true, health: boss.maxHealth, lastSpawn: Date.now() },
      bosses: state.bosses.map(b => 
        b.id === bossId ? { ...b, active: true, lastSpawn: Date.now() } : b
      ),
    }));
  },

  damageBoss: (amount: number) => {
    const { activeBoss } = get();
    if (!activeBoss) return null;

    const newHealth = activeBoss.health - amount;
    
    if (newHealth <= 0) {
      // Boss defeated!
      set({ activeBoss: null });
      return {
        killed: true,
        points: activeBoss.reward.points,
        items: activeBoss.reward.items,
      };
    }

    set((state) => ({
      activeBoss: state.activeBoss ? { ...state.activeBoss, health: newHealth } : null,
    }));

    return null;
  },

  updateBosses: () => {
    const { activeBoss } = get();
    if (!activeBoss) return null;

    const now = Date.now();

    // Check abilities
    for (const ability of activeBoss.abilities) {
      const timeSinceLastUse = (now - ability.lastUsed) / 1000;
      if (timeSinceLastUse >= ability.cooldown) {
        // Use ability
        const effect = ability.effect(activeBoss);
        
        set((state) => ({
          activeBoss: state.activeBoss ? {
            ...state.activeBoss,
            abilities: state.activeBoss.abilities.map(a =>
              a.id === ability.id ? { ...a, lastUsed: now } : a
            ),
          } : null,
        }));

        return effect;
      }
    }

    return null;
  },

  checkBossSpawns: () => {
    const now = Date.now();
    const { bosses } = get();

    for (const boss of bosses) {
      if (boss.active) continue;

      const timeSinceLastSpawn = (now - boss.lastSpawn) / 1000;
      if (timeSinceLastSpawn >= boss.spawnInterval) {
        return boss.id;
      }
    }

    return null;
  },

  resetBosses: () => {
    set({
      bosses: bosses.map(b => ({ ...b, active: false, lastSpawn: 0 })),
      activeBoss: null,
    });
  },
}));
