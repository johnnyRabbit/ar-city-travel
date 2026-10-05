import { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { useGameStore } from '../store/gameStore';
import { getItemDef, rarityColors } from '../data/items';

export default function Inventory() {
  const [isOpen, setIsOpen] = useState(false);
  const { inventory, useItem } = useInventoryStore();
  const { healPlayer, addPoints, addNotification } = useGameStore();

  const handleUseItem = (itemId: string) => {
    const invItem = inventory.find((i) => i.id === itemId);
    if (!invItem) return;

    const def = getItemDef(invItem.defId);
    if (!def) return;

    // Power-ups especiais
    if (def.type === 'special') {
      handleSpecialPowerUp(def);
      useItem(itemId);
      return;
    }

    // Itens normais
    if (def.duration === 0) {
      if (def.effect.healthRestore) {
        healPlayer(def.effect.healthRestore);
        addNotification(`💚 +${def.effect.healthRestore} vida!`, 'success');
      } else if (def.type === 'scroll') {
        addPoints(100);
        addNotification(`📜 +100 pontos!`, 'success');
      }
    } else {
      addNotification(`${def.emoji} ${def.name} ativado!`, 'success');
    }

    useItem(itemId);
  };

  const handleSpecialPowerUp = (def: any) => {
    const gameStore = useGameStore.getState();
    const inventoryStore = useInventoryStore.getState();

    // 💥 Explosão Templária (AOE)
    if (def.effect.aoeRadius) {
      const player = gameStore.player;
      const radiusInDegrees = def.effect.aoeRadius / 111000; // Converter metros para graus
      
      const zombiesInRange = gameStore.zombies.filter(z => {
        if (!z.active) return false;
        const dist = Math.sqrt(
          Math.pow(z.lat - player.lat, 2) + Math.pow(z.lng - player.lng, 2)
        );
        return dist <= radiusInDegrees;
      });

      // Eliminar todos os zombies no raio
      zombiesInRange.forEach(zombie => {
        gameStore.killZombie(zombie.id);
      });

      const pointsGained = zombiesInRange.length * 50;
      addNotification(`💥 Explosão! ${zombiesInRange.length} zombies eliminados! +${pointsGained} pts`, 'success');
      
      // Criar efeito visual de explosão
      createExplosionEffect(player.lat, player.lng);
    }

    // 👻 Capa de Invisibilidade
    if (def.effect.invisibility) {
      addNotification(`👻 Invisível por ${def.duration}s! Zombies não te veem!`, 'success');
      // O efeito é aplicado automaticamente pelo inventoryStore
    }

    // ✨ Teletransporte Mágico
    if (def.effect.teleport) {
      const historicalEvents = gameStore.historicalEvents;
      if (historicalEvents.length > 0) {
        const randomEvent = historicalEvents[Math.floor(Math.random() * historicalEvents.length)];
        gameStore.setPlayerPosition(randomEvent.lat, randomEvent.lng);
        addNotification(`✨ Teleportado para ${randomEvent.title}!`, 'success');
        
        // Criar efeito visual de teletransporte
        createTeleportEffect(randomEvent.lat, randomEvent.lng);
      }
    }

    // ⏸️ Congelamento Temporal
    if (def.effect.timeFreeze) {
      addNotification(`⏸️ Zombies congelados por ${def.duration}s!`, 'success');
      // O efeito é aplicado automaticamente pelo inventoryStore
      // Precisa de modificar o updateZombies para respeitar este efeito
    }

    // 🧲 Íman de Itens
    if (def.effect.magnetRange) {
      addNotification(`🧲 Atrair itens por ${def.duration}s!`, 'success');
      // O efeito é aplicado automaticamente pelo inventoryStore
      // Precisa de implementar a lógica de atração de itens
    }
  };

  const createExplosionEffect = (lat: number, lng: number) => {
    // Criar efeito visual de explosão
    if ((window as any).createSpecialEffect) {
      (window as any).createSpecialEffect('explosion', 50, 50);
    }
  };

  const createTeleportEffect = (lat: number, lng: number) => {
    // Criar efeito visual de teletransporte
    if ((window as any).createSpecialEffect) {
      (window as any).createSpecialEffect('teleport', 50, 50);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-11 h-11 bg-black/40 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center hover:bg-black/60 transition-all active:scale-95 border border-white/20"
        title="Inventário"
      >
        <span className="text-xl">🎒</span>
        {inventory.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white/30">
            {inventory.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 min-w-[280px] max-w-[320px] max-h-[400px] overflow-y-auto border-2 border-white/20">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <span>🎒</span> Inventário
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
        >
          ✕
        </button>
      </div>

      {inventory.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          Nenhum item. Explora o mapa para encontrar itens!
        </p>
      ) : (
        <div className="space-y-2">
          {inventory.map((invItem) => {
            const def = getItemDef(invItem.defId);
            if (!def) return null;

            return (
              <div
                key={invItem.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border-2"
                style={{ borderColor: rarityColors[def.rarity] }}
              >
                <span className="text-3xl">{def.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{def.name}</p>
                  <p className="text-xs text-gray-400">{def.description}</p>
                </div>
                <button
                  onClick={() => handleUseItem(invItem.id)}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all active:scale-95"
                >
                  Usar
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
