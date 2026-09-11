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

    // Handle instant effects
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-20 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 hover:scale-105 transition-transform"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎒</span>
          <div>
            <p className="text-xs font-bold text-gray-800">Inventário</p>
            <p className="text-xs text-gray-500">{inventory.length} itens</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="absolute bottom-20 left-4 z-[1000] bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl p-4 min-w-[280px] max-w-[320px] max-h-[400px] overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">🎒 Inventário</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      {inventory.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
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
                className="flex items-center gap-2 p-2 rounded-lg border-2 hover:bg-gray-50 transition-colors"
                style={{ borderColor: rarityColors[def.rarity] }}
              >
                <span className="text-2xl">{def.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800 truncate">{def.name}</p>
                  <p className="text-xs text-gray-500 truncate">{def.description}</p>
                  {def.duration > 0 && (
                    <p className="text-xs text-blue-600">⏱️ {def.duration}s</p>
                  )}
                </div>
                <button
                  onClick={() => handleUseItem(invItem.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded text-xs font-bold hover:bg-green-600 whitespace-nowrap"
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
