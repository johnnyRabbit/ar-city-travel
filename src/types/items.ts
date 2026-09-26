import { Era } from './index';

export type ItemType = 'shield' | 'sword' | 'potion_speed' | 'potion_heal' | 'relic' | 'armor' | 'scroll';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ItemDef {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: Rarity;
  emoji: string;
  era: Era;
  duration: number; // seconds, 0 = instant
  effect: ItemEffect;
}

export interface ItemEffect {
  healthRestore?: number;
  damageMultiplier?: number;
  speedMultiplier?: number;
  shieldHP?: number;
  zombieSlowdown?: number; // 0-1, percentage slow
  invincibility?: boolean;
  magnetRange?: number; // attract nearby items
}

export interface InventoryItem {
  id: string; // unique instance id
  defId: string; // reference to ItemDef
  acquiredAt: number;
}

export interface ActiveEffect {
  id: string;
  itemId: string;
  defId: string;
  name: string;
  emoji: string;
  remainingMs: number;
  totalMs: number;
  effect: ItemEffect;
}

export interface MapItem {
  id: string;
  defId: string;
  lat: number;
  lng: number;
  spawnedAt: number;
  collected: boolean;
}
