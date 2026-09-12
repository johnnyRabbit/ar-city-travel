export interface Boss {
  id: string;
  name: string;
  title: string;
  description: string;
  emoji: string;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  lat: number;
  lng: number;
  active: boolean;
  spawnInterval: number; // segundos
  lastSpawn: number;
  reward: {
    points: number;
    items: string[];
  };
  abilities: BossAbility[];
}

export interface BossAbility {
  id: string;
  name: string;
  emoji: string;
  cooldown: number; // segundos
  lastUsed: number;
  effect: (boss: Boss) => BossEffect;
}

export interface BossEffect {
  type: 'damage' | 'slow' | 'summon' | 'heal';
  value: number;
  duration?: number; // segundos
  message: string;
}

export const bosses: Boss[] = [
  {
    id: 'boss-sebastiao',
    name: 'D. Sebastião',
    title: 'O Rei Fantasma',
    description: 'O rei perdido de Portugal que aparece nas brumas do tempo.',
    emoji: '👑',
    health: 500,
    maxHealth: 500,
    damage: 15,
    speed: 0.00015,
    lat: 38.5710,
    lng: -7.9085,
    active: false,
    spawnInterval: 300, // 5 minutos
    lastSpawn: 0,
    reward: {
      points: 2000,
      items: ['shield_lendario'],
    },
    abilities: [
      {
        id: 'ghost-charge',
        name: 'Investida Fantasma',
        emoji: '💨',
        cooldown: 10,
        lastUsed: 0,
        effect: () => ({
          type: 'damage',
          value: 25,
          message: '💨 D. Sebastião investiu! -25 HP',
        }),
      },
    ],
  },
  {
    id: 'boss-coca',
    name: 'Coca de Évora',
    title: 'O Dragão Lendário',
    description: 'A besta mítica que assombra as noites de Évora.',
    emoji: '🐉',
    health: 800,
    maxHealth: 800,
    damage: 20,
    speed: 0.00012,
    lat: 38.5715,
    lng: -7.9050,
    active: false,
    spawnInterval: 600, // 10 minutos
    lastSpawn: 0,
    reward: {
      points: 3500,
      items: ['sword_geraldos', 'potion_heal_grande'],
    },
    abilities: [
      {
        id: 'fire-breath',
        name: 'Sopro de Fogo',
        emoji: '🔥',
        cooldown: 15,
        lastUsed: 0,
        effect: () => ({
          type: 'damage',
          value: 35,
          message: '🔥 A Coca cuspiu fogo! -35 HP',
        }),
      },
      {
        id: 'dragon-roar',
        name: 'Rugido do Dragão',
        emoji: '📢',
        cooldown: 30,
        lastUsed: 0,
        effect: () => ({
          type: 'slow',
          value: 0.5,
          duration: 5,
          message: '📢 Rugido ensurdecedor! Lentidão por 5s',
        }),
      },
    ],
  },
  {
    id: 'boss-viriato',
    name: 'Viriato',
    title: 'O Guerreiro Lusitano',
    description: 'O lendário líder da resistência contra Roma.',
    emoji: '⚔️',
    health: 600,
    maxHealth: 600,
    damage: 18,
    speed: 0.00018,
    lat: 38.5707,
    lng: -7.9095,
    active: false,
    spawnInterval: 420, // 7 minutos
    lastSpawn: 0,
    reward: {
      points: 2800,
      items: ['shield_medieval'],
    },
    abilities: [
      {
        id: 'guerrilla-tactic',
        name: 'Tática de Guerrilha',
        emoji: '🏹',
        cooldown: 12,
        lastUsed: 0,
        effect: () => ({
          type: 'damage',
          value: 30,
          message: '🏹 Emboscada de Viriato! -30 HP',
        }),
      },
    ],
  },
  {
    id: 'boss-moura',
    name: 'Moura Encantada',
    title: 'A Feiticeira das Muralhas',
    description: 'Espírito mágico que guarda os tesouros de Évora.',
    emoji: '🧙‍♀️',
    health: 400,
    maxHealth: 400,
    damage: 12,
    speed: 0.0002,
    lat: 38.5700,
    lng: -7.9110,
    active: false,
    spawnInterval: 360, // 6 minutos
    lastSpawn: 0,
    reward: {
      points: 2200,
      items: ['relic_ossos'],
    },
    abilities: [
      {
        id: 'magic-curse',
        name: 'Maldição Mágica',
        emoji: '✨',
        cooldown: 8,
        lastUsed: 0,
        effect: () => ({
          type: 'damage',
          value: 20,
          message: '✨ Maldição da Moura! -20 HP',
        }),
      },
      {
        id: 'summon-spirits',
        name: 'Invocar Espíritos',
        emoji: '👻',
        cooldown: 25,
        lastUsed: 0,
        effect: () => ({
          type: 'summon',
          value: 3,
          message: '👻 A Moura invocou 3 espíritos!',
        }),
      },
    ],
  },
];
