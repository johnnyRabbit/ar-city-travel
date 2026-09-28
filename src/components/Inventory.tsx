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
        className="relative w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 border-2 border-white/20"
        title="Inventário"
      >
        <span className="text-2xl">🎒</span>
        {inventory.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white/30">
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
