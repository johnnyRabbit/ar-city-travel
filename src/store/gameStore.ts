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

  const distToPlayer = calculateDistance(zombie.lat, zombie.lng, playerLat, playerLng);
  console.log(`[Zombie ${zombie.id}] Dist: ${distToPlayer.toFixed(0)}m, Path: ${zombieNodeId} -> ${playerNodeId} = [${path.join(', ')}] (length: ${path.length})`);

  // If path is too short or invalid, return zombie unchanged
  if (path.length < 2) {
    console.warn(`[Zombie ${zombie.id}] Invalid path: ${path.join(', ')}`);
    return zombie;
  }

  // Find where the zombie currently is in the new path
  let startIndex = path.indexOf(zombieNodeId);
  if (startIndex === -1) startIndex = 0;

  return {
    ...zombie,
    // Keep current position - don't snap to node
    path,
    currentNodeIndex: startIndex,
    targetNodeId: path[startIndex + 1] || path[path.length - 1],
    lastRecalcTime: Date.now(),
  };
}

function moveZombieAlongPath(zombie: Zombie): Zombie {
  if (!zombie.path || zombie.path.length === 0) return zombie;

  // Get current target node coordinates
  const targetCoords = getNodeCoords(zombie.targetNodeId || zombie.path[zombie.path.length - 1]);
  if (!targetCoords) return zombie;

  // Calculate direction to target
  const dLat = targetCoords.lat - zombie.lat;
  const dLng = targetCoords.lng - zombie.lng;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);
  const moveSpeed = zombie.speed;

  // Check if zombie reached the current target node
  if (dist < 0.00008) {
    // Advance to next node in path
    const nextIndex = zombie.currentNodeIndex + 1;

    if (nextIndex < zombie.path.length) {
      // Set new target but DON'T teleport - keep current position
      const newTargetId = zombie.path[nextIndex];
      return {
        ...zombie,
        currentNodeIndex: nextIndex,
        targetNodeId: newTargetId,
        // Keep current lat/lng - will move smoothly next tick
      };
    }
    // Reached end of path - stay here
    return zombie;
  }

  // Move smoothly towards target (don't overshoot)
  const stepLat = (dLat / dist) * moveSpeed;
  const stepLng = (dLng / dist) * moveSpeed;

  // Don't move past the target
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

  updateZombies: () => {
    const { player, zombies } = get();

    if (zombies.length === 0) return;

    const updatedZombies = zombies.map((z) => {
      if (!z.active) return z;

      const distToPlayer = calculateDistance(z.lat, z.lng, player.lat, player.lng);

      // Damage player if very close
      if (distToPlayer < 10) {
        get().damagePlayer(1);
      }

      let updatedZombie = z;

      // If zombie is very close to player (less than 30m), move directly to player
      if (distToPlayer < 30) {
        // Move directly towards player (no pathfinding needed)
        const dLat = player.lat - z.lat;
        const dLng = player.lng - z.lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        
        if (dist > 0.00001) {
          const stepLat = (dLat / dist) * z.speed;
          const stepLng = (dLng / dist) * z.speed;
          
          updatedZombie = {
            ...z,
            lat: z.lat + stepLat,
            lng: z.lng + stepLng,
          };
        }
        
        return updatedZombie;
      }

      // Recalculate path if:
      // - No path exists
      // - Path is too short
      // - Reached end of path
      // - Close to player (less than 50m) - recalculate every time to follow player
      const needsRecalc = !z.path || z.path.length < 2 || 
                          z.currentNodeIndex >= z.path.length - 1 ||
                          distToPlayer < 50;

      if (needsRecalc) {
        updatedZombie = calculatePathForZombie(z, player.lat, player.lng);
      }

      // Move along path smoothly
      updatedZombie = moveZombieAlongPath(updatedZombie);

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

    for (let i = 0; i < count; i++) {
      const template = zombieTemplates[Math.floor(Math.random() * zombieTemplates.length)];

      // Pick a spawn node far from the player
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

      if (!spawnNodeId) spawnNodeId = 'n32'; // Aqueduto

      const spawnCoords = getNodeCoords(spawnNodeId);
      if (!spawnCoords) continue;

      // Create zombie EXACTLY at spawn node coordinates
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

      // Calculate initial path
      zombie = calculatePathForZombie(zombie, player.lat, player.lng);

      // Ensure zombie starts at the first node of the path
      if (zombie.path.length >= 2) {
        const firstNodeCoords = getNodeCoords(zombie.path[0]);
        if (firstNodeCoords) {
          zombie.lat = firstNodeCoords.lat;
          zombie.lng = firstNodeCoords.lng;
        }
      }

      console.log(`[Spawn] Zombie ${zombie.id} at ${spawnNodeId}, path: [${zombie.path.join(', ')}]`);

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
