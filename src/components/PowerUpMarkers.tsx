import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useInventoryStore } from '../store/inventoryStore';
import { useGameStore } from '../store/gameStore';
import { getItemDef, rarityColors } from '../data/items';

export default function PowerUpMarkers() {
  const { mapItems, collectMapItem } = useInventoryStore();
  const { player, addPoints, healPlayer, addNotification } = useGameStore();

  const activeItems = mapItems.filter((m) => !m.collected);

  const createItemIcon = (defId: string) => {
    const def = getItemDef(defId);
    if (!def) return L.divIcon({ html: '❓', className: 'item-marker' });

    const color = rarityColors[def.rarity] || '#9CA3AF';
    return L.divIcon({
      html: `<div style="
        font-size: 22px;
        background: radial-gradient(circle, ${color}40, ${color}20);
        border: 2px solid ${color};
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 12px ${color}80;
        animation: pulse 2s infinite;
      ">${def.emoji}</div>`,
      className: 'item-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  };

  const handleCollect = (mapItemId: string) => {
    const mapItem = mapItems.find((m) => m.id === mapItemId);
    if (!mapItem) return;

    const def = getItemDef(mapItem.defId);
    if (!def) return;

    // Check distance
    const dist = Math.sqrt(
      Math.pow(mapItem.lat - player.lat, 2) + Math.pow(mapItem.lng - player.lng, 2)
    );
    if (dist > 0.0008) {
      addNotification('📍 Aproxima-te mais para apanhar!', 'warning');
      return;
    }

    // Collect the item and get the result
    const result = collectMapItem(mapItemId);
    
    // Handle instant effects based on result
    if (result && 'type' in result) {
      if (result.type === 'heal' && result.amount) {
        healPlayer(result.amount);
        addNotification(`${def.emoji} ${def.name}: +${result.amount} vida!`, 'success');
      } else if (result.type === 'points' && result.amount) {
        addPoints(result.amount);
        addNotification(`${def.emoji} ${def.name}: +${result.amount} pontos!`, 'success');
      }
    } else if (def.duration > 0) {
      // Item added to inventory
      addNotification(`${def.emoji} ${def.name} adicionado ao inventário!`, 'success');
    }
  };

  return (
    <>
      {activeItems.map((item) => {
        const def = getItemDef(item.defId);
        if (!def) return null;

        const dist = Math.sqrt(
          Math.pow(item.lat - player.lat, 2) + Math.pow(item.lng - player.lng, 2)
        );
        const isNear = dist < 0.0008;

        return (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={createItemIcon(item.defId)}
            eventHandlers={{
              click: () => handleCollect(item.id),
            }}
          >
            <Popup>
              <div className="max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{def.emoji}</span>
                  <div>
                    <h3 className="font-bold text-sm">{def.name}</h3>
                    <span
                      className="text-xs font-medium px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: rarityColors[def.rarity] + '30',
                        color: rarityColors[def.rarity],
                      }}
                    >
                      {def.rarity === 'common' && 'Comum'}
                      {def.rarity === 'rare' && 'Raro'}
                      {def.rarity === 'epic' && 'Épico'}
                      {def.rarity === 'legendary' && 'Lendário'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">{def.description}</p>
                {def.duration > 0 && (
                  <p className="text-xs text-blue-600 mt-1">⏱️ Duração: {def.duration}s</p>
                )}
                {isNear ? (
                  <button
                    onClick={() => handleCollect(item.id)}
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-xs font-bold hover:bg-green-600"
                  >
                    ✅ Apanhar
                  </button>
                ) : (
                  <p className="text-xs text-orange-600 mt-2">📍 Aproxima-te mais!</p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
