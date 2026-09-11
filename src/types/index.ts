export interface HistoricalEvent {
  id: string;
  title: string;
  description: string;
  year: number;
  era: Era;
  lat: number;
  lng: number;
  icon: string;
  discovered: boolean;
  points: number;
}

export type Era = 'romano' | 'visigodo' | 'mouro' | 'medieval' | 'renascimento' | 'moderno';

export interface EraInfo {
  id: Era;
  name: string;
  yearRange: [number, number];
  color: string;
  emoji: string;
}

export interface Zombie {
  id: string;
  name: string;
  lat: number;
  lng: number;
  speed: number;
  health: number;
  maxHealth: number;
  era: Era;
  emoji: string;
  active: boolean;
  path: string[];
  currentNodeIndex: number;
  targetNodeId: string | null;
  lastRecalcTime: number;
}

export interface Player {
  id: string;
  name: string;
  lat: number;
  lng: number;
  health: number;
  maxHealth: number;
  points: number;
  level: number;
  avatar: string;
}

export interface GameState {
  player: Player;
  zombies: Zombie[];
  historicalEvents: HistoricalEvent[];
  selectedEra: Era | 'all';
  gameActive: boolean;
  arMode: boolean;
  score: number;
  notifications: GameNotification[];
}

export interface GameNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  timestamp: number;
}
