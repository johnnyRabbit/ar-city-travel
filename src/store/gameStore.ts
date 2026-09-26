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
  updateZombies: () => void;
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
  discoverEvent: (id: string) => void;
  addPoints: (points: number) => void;
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
  spawnZombies: (count: number) => void;
  killZombie: (id: string) => void;
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

  updateZombies: () => {
    // Simplificado - zombies movem-se em linha reta
    set((state) => ({
      zombies: state.zombies.map((z) => {
        if (!z.active) return z;
        const dLat = state.player.lat - z.lat;
        const dLng = state.player.lng - z.lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        if (dist < 0.0001) {
          get().damagePlayer(5);
          return z;
        }
        return {
          ...z,
          lat: z.lat + (dLat / dist) * z.speed,
          lng: z.lng + (dLng / dist) * z.speed,
        };
      }),
    }));
  },

  damagePlayer: (amount) =>
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
    }),

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
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 0.005 + Math.random() * 0.01;
      get().addZombie({
        id: `zombie-${Date.now()}-${i}`,
        name: 'Zombie',
        emoji: '🧟',
        lat: player.lat + Math.cos(angle) * distance,
        lng: player.lng + Math.sin(angle) * distance,
        health: 50,
        maxHealth: 50,
        speed: 0.0002,
        path: [],
        currentNodeIndex: 0,
        targetNodeId: null,
        lastRecalcTime: Date.now(),
        active: true,
      });
    }
  },

  killZombie: (id) =>
    set((state) => ({
      zombies: state.zombies.filter((z) => z.id !== id),
      score: state.score + 50,
      player: { ...state.player, points: state.player.points + 50 },
    })),

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
