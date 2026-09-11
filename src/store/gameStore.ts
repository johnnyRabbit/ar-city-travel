import { create } from 'zustand';
import { GameState, Zombie, Era, GameNotification, Player } from '../types';
import { historicalEvents, zombieTemplates } from '../data/evoraHistory';
import {
  buildStreetGraph,
  findPath,
  findNearestNode,
  getNodeCoords,
  calculateDistance,
} from '../data/streetGraph';

const streetGraph = buildStreetGraph();

const initialPlayer: Player = {
  id: 'player-1',
  name: 'Explorador',
  lat: 38.5702,
  lng: -7.9095,
  health: 100,
  maxHealth: 100,
  points: 0,
  level: 1,
  avatar: '🧑‍🚀',
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
  addNotification: (message: string, type: GameNotification['type']) => void;
  removeNotification: (id: string) => void;
  spawnZombies: (count: number) => void;
  killZombie: (id: string) => void;
  resetGame: () => void;
}

function calculatePathForZombie(zombie: Zombie, playerLat: number, playerLng: number): Zombie {
  const zombieNodeId = findNearestNode(zombie.lat, zombie.lng);
  const playerNodeId = findNearestNode(playerLat, playerLng);
  const path = findPath(streetGraph, zombieNodeId, playerNodeId);

  return {
    ...zombie,
    path,
    currentNodeIndex: 0,
    targetNodeId: path.length > 1 ? path[1] : path[0],
    lastRecalcTime: Date.now(),
  };
}

function moveZombieAlongPath(zombie: Zombie): Zombie {
  if (!zombie.path || zombie.path.length === 0) return zombie;

  const targetCoords = getNodeCoords(zombie.targetNodeId || zombie.path[zombie.path.length - 1]);
  if (!targetCoords) return zombie;

  const dLat = targetCoords.lat - zombie.lat;
  const dLng = targetCoords.lng - zombie.lng;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);
  const moveSpeed = zombie.speed;

  if (dist < 0.00005) {
    const nextIndex = zombie.currentNodeIndex + 1;
    if (nextIndex < zombie.path.length) {
      const nextNodeCoords = getNodeCoords(zombie.path[nextIndex]);
      if (nextNodeCoords) {
        return {
          ...zombie,
          lat: nextNodeCoords.lat,
          lng: nextNodeCoords.lng,
          currentNodeIndex: nextIndex,
          targetNodeId: nextIndex + 1 < zombie.path.length ? zombie.path[nextIndex + 1] : null,
        };
      }
    }
    return { ...zombie, lat: targetCoords.lat, lng: targetCoords.lng };
  }

  const newLat = zombie.lat + (dLat / dist) * moveSpeed;
  const newLng = zombie.lng + (dLng / dist) * moveSpeed;

  return { ...zombie, lat: newLat, lng: newLng };
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
    get().addNotification('🎮 Jogo iniciado! Os zombies vêm pelas ruas!', 'info');
  },

  stopGame: () => set({ gameActive: false, zombies: [] }),

  toggleAR: () => set((state) => ({ arMode: !state.arMode })),

  addZombie: (zombie) =>
    set((state) => ({ zombies: [...state.zombies, zombie] })),

  updateZombies: () => {
    const { player, zombies } = get();
    const now = Date.now();

    const updatedZombies = zombies.map((z) => {
      if (!z.active) return z;

      const distToPlayer = calculateDistance(z.lat, z.lng, player.lat, player.lng);

      if (distToPlayer < 15) {
        get().damagePlayer(2);
        return z;
      }

      let updatedZombie = z;
      if (now - z.lastRecalcTime > 5000) {
        updatedZombie = calculatePathForZombie(z, player.lat, player.lng);
      }

      updatedZombie = moveZombieAlongPath(updatedZombie);

      if (updatedZombie.currentNodeIndex >= updatedZombie.path.length - 1 && distToPlayer > 20) {
        updatedZombie = calculatePathForZombie(updatedZombie, player.lat, player.lng);
      }

      return updatedZombie;
    });

    set({ zombies: updatedZombies });
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
              message: '💀 Foste apanhado! Game Over!',
              type: 'danger' as const,
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
      const newEvents = state.historicalEvents.map((e) =>
        e.id === id ? { ...e, discovered: true } : e
      );
      return {
        historicalEvents: newEvents,
        score: state.score + event.points,
        player: {
          ...state.player,
          points: state.player.points + event.points,
          level: Math.floor((state.player.points + event.points) / 200) + 1,
        },
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            message: `📜 Descoberto: ${event.title} (+${event.points} pts)`,
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
    set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),

  spawnZombies: (count) => {
    const { player } = get();
    const playerNodeId = findNearestNode(player.lat, player.lng);

    for (let i = 0; i < count; i++) {
      const template = zombieTemplates[Math.floor(Math.random() * zombieTemplates.length)];

      let spawnNodeId: string | null = null;
      let attempts = 0;
      while (!spawnNodeId && attempts < 20) {
        const randomNodeIdx = Math.floor(Math.random() * 45) + 1;
        const nodeId = `n${String(randomNodeIdx).padStart(2, '0')}`;
        const nodeCoords = getNodeCoords(nodeId);
        if (nodeCoords) {
          const dist = calculateDistance(player.lat, player.lng, nodeCoords.lat, nodeCoords.lng);
          if (dist > 80) spawnNodeId = nodeId;
        }
        attempts++;
      }

      if (!spawnNodeId) spawnNodeId = 'n32';

      const spawnCoords = getNodeCoords(spawnNodeId);
      if (!spawnCoords) continue;

      let zombie: Zombie = {
        id: `zombie-${Date.now()}-${i}`,
        name: template.name,
        lat: spawnCoords.lat,
        lng: spawnCoords.lng,
        speed: template.speed,
        health: 30 + Math.floor(Math.random() * 20),
        maxHealth: 50,
        era: template.era,
        emoji: template.emoji,
        active: true,
        path: [],
        currentNodeIndex: 0,
        targetNodeId: null,
        lastRecalcTime: 0,
      };

      zombie = calculatePathForZombie(zombie, player.lat, player.lng);
      get().addZombie(zombie);
    }
  },

  killZombie: (id) =>
    set((state) => ({
      zombies: state.zombies.filter((z) => z.id !== id),
      score: state.score + 50,
      player: { ...state.player, points: state.player.points + 50 },
      notifications: [
        ...state.notifications,
        {
          id: Date.now().toString(),
          message: '🗡️ Zombie eliminado! (+50 pts)',
          type: 'success' as const,
          timestamp: Date.now(),
        },
      ],
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
