import { create } from 'zustand';
import { InventoryItem, ActiveEffect, MapItem } from '../types/items';
import { getItemDef, getRandomItemDef } from '../data/items';

interface InventoryStore {
  inventory: InventoryItem[];
  activeEffects: ActiveEffect[];
  mapItems: MapItem[];
  shieldHP: number;
  maxShieldHP: number;

  // Actions
  collectMapItem: (mapItemId: string) => { type: string; amount?: number; def?: any } | null;
  useItem: (inventoryItemId: string) => { type: string; amount?: number } | void;
  tickEffects: (deltaMs: number) => void;
  spawnMapItem: (lat: number, lng: number, defId?: string) => void;
  spawnRandomMapItems: (count: number, centerLat: number, centerLng: number) => void;
  removeMapItem: (id: string) => void;
  resetInventory: () => void;
  applyDamage: (amount: number) => number; // returns actual damage after shield
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventory: [],
  activeEffects: [],
  mapItems: [],
  shieldHP: 0,
  maxShieldHP: 0,

  collectMapItem: (mapItemId) => {
    const { mapItems } = get();
    const mapItem = mapItems.find((m) => m.id === mapItemId);
    if (!mapItem || mapItem.collected) return null;

    const def = getItemDef(mapItem.defId);
    if (!def) return null;

    // Instant effects
    if (def.duration === 0) {
      // Mark as collected first
      set((state) => ({
        mapItems: state.mapItems.map((m) =>
          m.id === mapItemId ? { ...m, collected: true } : m
        ),
      }));

      if (def.effect.healthRestore) {
        return { type: 'heal', amount: def.effect.healthRestore, def };
      }
      if (def.type === 'scroll') {
        return { type: 'points', amount: 100, def };
      }
    }

    // Add to inventory
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}-${Math.random()}`,
      defId: mapItem.defId,
      acquiredAt: Date.now(),
    };

    set((state) => ({
      inventory: [...state.inventory, newItem],
      mapItems: state.mapItems.map((m) =>
        m.id === mapItemId ? { ...m, collected: true } : m
      ),
    }));

    return { type: 'inventory', def };
  },

  useItem: (inventoryItemId) => {
    const { inventory, activeEffects } = get();
    const invItem = inventory.find((i) => i.id === inventoryItemId);
    if (!invItem) return;

    const def = getItemDef(invItem.defId);
    if (!def) return;

    // Remove from inventory
    set((state) => ({
      inventory: state.inventory.filter((i) => i.id !== inventoryItemId),
    }));

    // Apply effect
    if (def.duration > 0) {
      const effect: ActiveEffect = {
        id: `effect-${Date.now()}`,
        itemId: inventoryItemId,
        defId: def.id,
        name: def.name,
        emoji: def.emoji,
        remainingMs: def.duration * 1000,
        totalMs: def.duration * 1000,
        effect: def.effect,
      };

      // Shield effect
      if (def.effect.shieldHP) {
        set((state) => ({
          activeEffects: [...state.activeEffects, effect],
          shieldHP: state.shieldHP + def.effect.shieldHP!,
          maxShieldHP: Math.max(state.maxShieldHP, state.shieldHP + def.effect.shieldHP!),
        }));
      } else {
        set((state) => ({
          activeEffects: [...state.activeEffects, effect],
        }));
      }
    } else {
      // Instant effects handled by caller
      if (def.effect.healthRestore) {
        return { type: 'heal', amount: def.effect.healthRestore };
      }
    }
  },

  tickEffects: (deltaMs) => {
    set((state) => {
      const updatedEffects = state.activeEffects
        .map((e) => ({ ...e, remainingMs: e.remainingMs - deltaMs }))
        .filter((e) => e.remainingMs > 0);

      // Recalculate shield
      let newShieldHP = 0;
      updatedEffects.forEach((e) => {
        if (e.effect.shieldHP) {
          const ratio = e.remainingMs / e.totalMs;
          newShieldHP += e.effect.shieldHP! * ratio;
        }
      });

      return {
        activeEffects: updatedEffects,
        shieldHP: newShieldHP,
      };
    });
  },

  spawnMapItem: (lat, lng, defId) => {
    const def = defId ? getItemDef(defId) : getRandomItemDef();
    if (!def) return;

    const newItem: MapItem = {
      id: `map-${Date.now()}-${Math.random()}`,
      defId: def.id,
      lat,
      lng,
      spawnedAt: Date.now(),
      collected: false,
    };

    set((state) => ({
      mapItems: [...state.mapItems.filter((m) => !m.collected), newItem],
    }));
  },

  spawnRandomMapItems: (count, centerLat, centerLng) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 0.001 + Math.random() * 0.003;
      const lat = centerLat + Math.cos(angle) * distance;
      const lng = centerLng + Math.sin(angle) * distance;
      get().spawnMapItem(lat, lng);
    }
  },

  removeMapItem: (id) => {
    set((state) => ({
      mapItems: state.mapItems.filter((m) => m.id !== id),
    }));
  },

  resetInventory: () => {
    set({
      inventory: [],
      activeEffects: [],
      mapItems: [],
      shieldHP: 0,
      maxShieldHP: 0,
    });
  },

  applyDamage: (amount) => {
    const { shieldHP } = get();
    if (shieldHP > 0) {
      // Check invincibility
      const hasInvincibility = get().activeEffects.some((e) => e.effect.invincibility);
      if (hasInvincibility) return 0;

      if (shieldHP >= amount) {
        set((state) => ({ shieldHP: state.shieldHP - amount }));
        return 0;
      } else {
        const remaining = amount - shieldHP;
        set({ shieldHP: 0 });
        return remaining;
      }
    }
    return amount;
  },
}));
