export type Era = 'romano' | 'visigodo' | 'mouro' | 'medieval' | 'renascimento' | 'moderno';

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

export interface Zombie {
  id: string;
  name: string;
  emoji: string;
  lat: number;
  lng: number;
  health: number;
  maxHealth: number;
  speed: number;
  path: string[];
  currentNodeIndex: number;
  targetNodeId: string | null;
  lastRecalcTime: number;
  active: boolean;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  lat: number;
  lng: number;
  health: number;
  maxHealth: number;
  points: number;
  level: number;
}

export interface GameState {
  player: Player;
  zombies: Zombie[];
  historicalEvents: HistoricalEvent[];
  selectedEra: Era | 'all';
  gameActive: boolean;
  arMode: boolean;
  score: number;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

export interface StreetNode {
  id: string;
  lat: number;
  lng: number;
  name?: string;
}

export interface StreetEdge {
  from: string;
  to: string;
}
