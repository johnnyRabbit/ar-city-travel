import { create } from 'zustand';
import { GameState, Zombie, Era, Notification, Player } from '../types';
import { historicalEvents } from '../data/evoraHistory';

const initialPlayer: Player = {
  id: 'player-1',
  name: 'Explorador',
  avatar: '🧑‍🚀',
  lat: 38.5702,
  lng: -7.9100,
  health: 100,
  maxHealth: 100,
  points: 0,
  level: 1,
};

interface GameStore extends GameState {
  setSelectedEra: (era: Era | 'all') => void;
  setPlayerPosition: (lat: number, lng: number) => void;
  startGame: () => void;
  stopGame: () => void;
  toggleAR: () => void;
  addZombie: (zombie: Zombie) => void;
  updateZombies: (getActiveEffects?: () => any[]) => void;
  damagePlayer: (amount: number, onDamage?: (amount: number) => void) => void;
  healPlayer: (amount: number) => void;
  discoverEvent: (id: string) => void;
  addPoints: (points: number) => void;
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
  spawnZombies: (count: number) => void;
  killZombie: (id: string, damageMultiplier?: () => number, onKill?: () => void) => void;
  reloadCityData: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  player: initialPlayer,
  zombies: [],
  historicalEvents: historicalEvents,
  selectedEra: 'all',
  gameActive: false,
  arMode: false,
  score: 0,
  notifications: [],

  setSelectedEra: (era) => set({ selectedEra: era }),

  setPlayerPosition: (lat, lng) =>
    set((state) => ({ player: { ...state.player, lat, lng } })),

  startGame: () => {
    set({ gameActive: true });
    get().spawnZombies(3);
    get().addNotification('🎮 Jogo iniciado!', 'info');
  },

  stopGame: () => set({ gameActive: false, zombies: [] }),

  toggleAR: () => set((state) => ({ arMode: !state.arMode })),

  addZombie: (zombie) =>
    set((state) => ({ zombies: [...state.zombies, zombie] })),

  updateZombies: (getActiveEffects) => {
    const activeEffects = getActiveEffects ? getActiveEffects() : [];
    
    // Verificar se há efeito de invisibilidade ou congelamento temporal
    const isInvisible = activeEffects.some(e => e.effect.invisibility);
    const isTimeFrozen = activeEffects.some(e => e.effect.timeFreeze);
    
    // Se estiver invisível ou tempo congelado, zombies não se movem
    if (isInvisible || isTimeFrozen) {
      return;
    }
    
    // Calcular dano primeiro (fora do set)
    let totalDamage = 0;
    
    // Movimento realista com zigzag e variação de velocidade
    const updatedZombies = get().zombies.map((z) => {
      if (!z.active) return z;
      
      const player = get().player;
      const dLat = player.lat - z.lat;
      const dLng = player.lng - z.lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      
      if (dist < 0.0001) {
        totalDamage += 5;
        return z;
      }
      
      // Direção base para o jogador
      const baseDirLat = dLat / dist;
      const baseDirLng = dLng / dist;
      
      // Adicionar movimento errático (zigzag) - desvio aleatório
      const wobbleAngle = (Math.random() - 0.5) * 0.8; // -0.4 a +0.4 radianos
      const cosW = Math.cos(wobbleAngle);
      const sinW = Math.sin(wobbleAngle);
      
      // Rotação da direção base pelo ângulo de wobble
      const dirLat = baseDirLat * cosW - baseDirLng * sinW;
      const dirLng = baseDirLat * sinW + baseDirLng * cosW;
      
      // Variação de velocidade (zombies não são perfeitamente consistentes)
      const speedVariation = 0.8 + Math.random() * 0.4; // 80% a 120% da velocidade base
      const currentSpeed = z.speed * speedVariation;
      
      return {
        ...z,
        lat: z.lat + dirLat * currentSpeed,
        lng: z.lng + dirLng * currentSpeed,
      };
    });
    
    // Aplicar atualizações
    set({ zombies: updatedZombies });
    
    // Aplicar dano DEPOIS do set (fora do set)
    if (totalDamage > 0) {
      get().damagePlayer(totalDamage);
    }
  },

  damagePlayer: (amount, onDamage) => {
    if (onDamage) onDamage(amount);
    set((state) => {
      const newHealth = Math.max(0, state.player.health - amount);
      if (newHealth <= 0) {
        return {
          player: { ...state.player, health: 0 },
          gameActive: false,
          notifications: [
            ...state.notifications,
            {
              id: Date.now().toString(),
              message: '💀 Game Over!',
              type: 'error' as const,
              timestamp: Date.now(),
            },
          ],
        };
      }
      return { player: { ...state.player, health: newHealth } };
    });
  },

  healPlayer: (amount) =>
    set((state) => ({
      player: {
        ...state.player,
        health: Math.min(state.player.maxHealth, state.player.health + amount),
      },
    })),

  discoverEvent: (id) =>
    set((state) => {
      const event = state.historicalEvents.find((e) => e.id === id);
      if (!event || event.discovered) return state;
      return {
        historicalEvents: state.historicalEvents.map((e) =>
          e.id === id ? { ...e, discovered: true } : e
        ),
        score: state.score + event.points,
        player: {
          ...state.player,
          points: state.player.points + event.points,
        },
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            message: `📜 ${event.title} (+${event.points} pts)`,
            type: 'success' as const,
            timestamp: Date.now(),
          },
        ],
      };
    }),

  addPoints: (points) =>
    set((state) => ({
      score: state.score + points,
      player: { ...state.player, points: state.player.points + points },
    })),

  addNotification: (message, type) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: Date.now().toString(), message, type, timestamp: Date.now() },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  spawnZombies: (count) => {
    const { player } = get();
    
    // Tipos de zombies com diferentes características
    const zombieTypes = [
      { name: 'Zombie', emoji: '🧟', speed: 0.0001, health: 50 }, // Normal - mais lento
      { name: 'Zombie Rápido', emoji: '🏃', speed: 0.00015, health: 30 }, // Rápido mas fraco
      { name: 'Zombie Lento', emoji: '🐌', speed: 0.00007, health: 80 }, // Lento mas resistente
      { name: 'Zombie Forte', emoji: '💪', speed: 0.00012, health: 100 }, // Forte
    ];
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 0.008 + Math.random() * 0.012; // Spawn mais longe (80-200m)
      
      // Escolher tipo aleatório (mais normais, menos especiais)
      const typeIndex = Math.random() < 0.6 ? 0 : // 60% normal
                       Math.random() < 0.5 ? 1 : // 20% rápido
                       Math.random() < 0.5 ? 2 : // 10% lento
                       3; // 10% forte
      
      const zombieType = zombieTypes[typeIndex];
      
      // Variação de velocidade individual (±20%)
      const speedVariation = 0.8 + Math.random() * 0.4;
      const finalSpeed = zombieType.speed * speedVariation;
      
      get().addZombie({
        id: `zombie-${Date.now()}-${i}`,
        name: zombieType.name,
        emoji: zombieType.emoji,
        lat: player.lat + Math.cos(angle) * distance,
        lng: player.lng + Math.sin(angle) * distance,
        health: zombieType.health,
        maxHealth: zombieType.health,
        speed: finalSpeed,
        path: [],
        currentNodeIndex: 0,
        targetNodeId: null,
        lastRecalcTime: Date.now(),
        active: true,
      });
    }
  },

  killZombie: (id, damageMultiplier, onKill) => {
    const multiplier = damageMultiplier ? damageMultiplier() : 1;
    const points = Math.round(50 * multiplier);
    set((state) => ({
      zombies: state.zombies.filter((z) => z.id !== id),
      score: state.score + points,
      player: { ...state.player, points: state.player.points + points },
    }));
    if (onKill) onKill();
  },

  reloadCityData: () => {
    // Reload historical events for the current city
    const { historicalEvents: allEvents } = get();
    set({
      historicalEvents: allEvents.map(e => ({ ...e, discovered: false })),
      zombies: [],
    });
    get().addNotification('🏙️ Dados da cidade recarregados!', 'info');
  },

  resetGame: () =>
    set({
      player: initialPlayer,
      zombies: [],
      historicalEvents: historicalEvents,
      selectedEra: 'all',
      gameActive: false,
      arMode: false,
      score: 0,
      notifications: [],
    }),
}));
