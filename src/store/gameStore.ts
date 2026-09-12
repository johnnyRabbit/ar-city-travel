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
import { soundSystem } from '../utils/sounds';

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
  updateZombies: (getActiveEffects?: () => any[]) => void;
  damagePlayer: (amount: number, applyShield?: (amount: number) => number) => void;
  healPlayer: (amount: number) => void;
  discoverEvent: (id: string) => void;
  addPoints: (points: number) => void;
  addNotification: (message: string, type: GameNotification['type']) => void;
  removeNotification: (id: string) => void;
  spawnZombies: (count: number) => void;
  killZombie: (id: string, getDamageMultiplier?: () => number, onKill?: () => void) => void;
  resetGame: (onReset?: () => void) => void;
}

function calculatePathForZombie(zombie: Zombie, playerLat: number, playerLng: number): Zombie {
  const zombieNodeId = findNearestNode(zombie.lat, zombie.lng);
  const playerNodeId = findNearestNode(playerLat, player.lng);
  const path = findPath(streetGraph, zombieNodeId, playerNodeId);

  if (path.length < 2) {
    return zombie;
  }

  let startIndex = path.indexOf(zombieNodeId);
  if (startIndex === -1) startIndex = 0;

  return {
    ...zombie,
    path,
    currentNodeIndex: startIndex,
    targetNodeId: path[startIndex + 1] || path[path.length - 1],
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

  if (dist < 0.00008) {
    const nextIndex = zombie.currentNodeIndex + 1;

    if (nextIndex < zombie.path.length) {
      const newTargetId = zombie.path[nextIndex];
      return {
        ...zombie,
        currentNodeIndex: nextIndex,
        targetNodeId: newTargetId,
      };
    }
    return zombie;
  }

  const stepLat = (dLat / dist) * moveSpeed;
  const stepLng = (dLng / dist) * moveSpeed;

  const newLat = Math.abs(stepLat) > Math.abs(dLat) ? targetCoords.lat : zombie.lat + stepLat;
  const newLng = Math.abs(stepLng) > Math.abs(dLng) ? targetCoords.lng : zombie.lng + stepLng;

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

  updateZombies: (getActiveEffects) => {
    const { player, zombies } = get();

    if (zombies.length === 0) return;

    // Get active effects from callback (avoids circular deps)
    let zombieSlowdown = 1;
    if (getActiveEffects) {
      const activeEffects = getActiveEffects();
      zombieSlowdown = activeEffects.reduce((slow: number, e: any) => {
        if (e.effect?.zombieSlowdown) return slow * (1 - e.effect.zombieSlowdown);
        return slow;
      }, 1);
    }

    const updatedZombies = zombies.map((z) => {
      if (!z.active) return z;

      const distToPlayer = calculateDistance(z.lat, z.lng, player.lat, player.lng);

      if (distToPlayer < 10) {
        get().damagePlayer(1);
      }

      let updatedZombie = z;
      const effectiveSpeed = z.speed * zombieSlowdown;

      if (distToPlayer < 30) {
        const dLat = player.lat - z.lat;
        const dLng = player.lng - z.lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        
        if (dist > 0.00001) {
          const stepLat = (dLat / dist) * effectiveSpeed;
          const stepLng = (dLng / dist) * effectiveSpeed;
          
          updatedZombie = {
            ...z,
            lat: z.lat + stepLat,
            lng: z.lng + stepLng,
          };
        }
        
        return updatedZombie;
      }

      const needsRecalc = !z.path || z.path.length < 2 || 
                          z.currentNodeIndex >= z.path.length - 1 ||
                          distToPlayer < 50;

      if (needsRecalc) {
        updatedZombie = calculatePathForZombie(z, player.lat, player.lng);
      }

      updatedZombie = moveZombieAlongPath(updatedZombie);

      return updatedZombie;
    });

    set({ zombies: updatedZombies });
  },

  damagePlayer: (amount, applyShield) => {
    let actualDamage = amount;
    if (applyShield) {
      actualDamage = applyShield(amount);
    }
    
    if (actualDamage === 0) return;

    soundSystem.playDamage();

    set((state) => {
      const newHealth = Math.max(0, state.player.health - actualDamage);
      if (newHealth <= 0) {
        soundSystem.playGameOver();
        
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
      const newEvents = state.historicalEvents.map((e) =>
        e.id === id ? { ...e, discovered: true } : e
      );
      
      soundSystem.playDiscover();
      
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

    for (let i = 0; i < count; i++) {
      const template = zombieTemplates[Math.floor(Math.random() * zombieTemplates.length)];

      let spawnNodeId: string | null = null;
      let attempts = 0;
      while (!spawnNodeId && attempts < 30) {
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

      if (zombie.path.length >= 2) {
        const firstNodeCoords = getNodeCoords(zombie.path[0]);
        if (firstNodeCoords) {
          zombie.lat = firstNodeCoords.lat;
          zombie.lng = firstNodeCoords.lng;
        }
      }

      get().addZombie(zombie);
    }
  },

  killZombie: (id, getDamageMultiplier, onKill) => {
    let damageMultiplier = 1;
    if (getDamageMultiplier) {
      damageMultiplier = getDamageMultiplier();
    }

    const points = Math.round(50 * damageMultiplier);

    soundSystem.playKillZombie();

    if (onKill) {
      onKill();
    }

    set((state) => ({
      zombies: state.zombies.filter((z) => z.id !== id),
      score: state.score + points,
      player: { ...state.player, points: state.player.points + points },
      notifications: [
        ...state.notifications,
        {
          id: Date.now().toString(),
          message: `🗡️ Zombie eliminado! (+${points} pts)`,
          type: 'success' as const,
          timestamp: Date.now(),
        },
      ],
    }));
  },

  resetGame: (onReset) => {
    if (onReset) {
      onReset();
    }
    
    set({
      player: initialPlayer,
      zombies: [],
      historicalEvents: historicalEvents,
      selectedEra: 'all',
      gameActive: false,
      arMode: false,
      score: 0,
      notifications: [],
    });
  },
}));
