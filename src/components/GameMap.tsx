import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { useGameStore } from '../store/gameStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useQuestStore } from '../store/questStore';
import { eras } from '../data/evoraHistory';
import StreetOverlay from './StreetOverlay';
import ZombiePaths from './ZombiePaths';
import PowerUpMarkers from './PowerUpMarkers';
import OtherPlayers from './OtherPlayers';

const playerIcon = L.divIcon({
  html: '<div style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">🧑‍🚀</div>',
  className: 'player-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const createZombieIcon = (emoji: string) =>
  L.divIcon({
    html: `<div style="font-size: 24px; animation: pulse 1s infinite; filter: drop-shadow(0 2px 4px rgba(255,0,0,0.5));">${emoji}</div>`,
    className: 'zombie-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

function MapUpdater() {
  const map = useMap();
  const { player } = useGameStore();
  useEffect(() => { map.setView([player.lat, player.lng], map.getZoom()); }, [player.lat, player.lng, map]);
  return null;
}

function PlayerMarker() {
  const { player } = useGameStore();
  return (
    <>
      <Marker position={[player.lat, player.lng]} icon={playerIcon}>
        <Popup><div className="text-center"><strong>{player.name}</strong><br/>Nível {player.level} | ❤️ {player.health}/{player.maxHealth}</div></Popup>
      </Marker>
      <CircleMarker center={[player.lat, player.lng]} radius={30} pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.1 }} />
    </>
  );
}

function ZombieMarkers() {
  const { zombies, killZombie } = useGameStore();

  const handleKillZombie = (id: string) => {
    const inventoryStore = useInventoryStore.getState();
    const questStore = useQuestStore.getState();
    
    const getDamageMultiplier = () => {
      const { activeEffects } = inventoryStore;
      return activeEffects.reduce((mult: number, e: any) => {
        if (e.effect?.damageMultiplier) return mult * e.effect.damageMultiplier;
        return mult;
      }, 1);
    };

    const onKill = () => {
      questStore.updateQuestProgress('kill-zombies-10', 1);
      questStore.updateQuestProgress('kill-zombies-50', 1);
      questStore.updateQuestProgress('daily-kill-5', 1);
    };

    killZombie(id, getDamageMultiplier, onKill);
  };

  return (
    <>
      {zombies.filter((z) => z.active).map((zombie) => (
        <Marker
          key={zombie.id}
          position={[zombie.lat, zombie.lng]}
          icon={createZombieIcon(zombie.emoji)}
          eventHandlers={{ click: () => handleKillZombie(zombie.id) }}
        >
          <Popup>
            <div className="text-center">
              <strong>{zombie.name}</strong><br/>❤️ {zombie.health}/{zombie.maxHealth}
              <br/><button onClick={() => handleKillZombie(zombie.id)} className="mt-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">⚔️ Atacar</button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

function HistoricalMarkers() {
  const { historicalEvents, selectedEra, discoverEvent, player } = useGameStore();
  const filteredEvents = selectedEra === 'all' ? historicalEvents : historicalEvents.filter((e) => e.era === selectedEra);

  const createEventIcon = (event: typeof historicalEvents[0]) => {
    const eraInfo = eras.find((e) => e.id === event.era);
    const color = eraInfo?.color || '#666';
    const isDiscovered = event.discovered;
    return L.divIcon({
      html: `<div style="font-size: 20px; background: ${isDiscovered ? '#10B981' : color}; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); ${isDiscovered ? 'opacity: 0.6;' : 'animation: bounce 2s infinite;'}">${event.icon}</div>`,
      className: 'event-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <>
      {filteredEvents.map((event) => {
        const dist = Math.sqrt(Math.pow(event.lat - player.lat, 2) + Math.pow(event.lng - player.lng, 2));
        const isNear = dist < 0.001;
        return (
          <Marker key={event.id} position={[event.lat, event.lng]} icon={createEventIcon(event)} eventHandlers={{ click: () => { if (isNear && !event.discovered) discoverEvent(event.id); } }}>
            <Popup>
              <div className="max-w-[200px]">
                <h3 className="font-bold text-sm">{event.icon} {event.title}</h3>
                <p className="text-xs text-gray-600">Ano: {event.year > 0 ? `${event.year} d.C.` : `${Math.abs(event.year)} a.C.`}</p>
                <p className="text-xs mt-1">{event.description}</p>
                {event.discovered ? (
                  <span className="text-green-600 text-xs font-bold">✅ Descoberto (+{event.points} pts)</span>
                ) : isNear ? (
                  <button onClick={() => discoverEvent(event.id)} className="mt-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">🔍 Descobrir (+{event.points} pts)</button>
                ) : (
                  <span className="text-orange-600 text-xs">📍 Aproxima-te para descobrir!</span>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default function GameMap() {
  const { player } = useGameStore();
  return (
    <div className="w-full h-full relative">
      <MapContainer center={[player.lat, player.lng]} zoom={17} className="w-full h-full z-0" zoomControl={false}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater />
        <StreetOverlay />
        <ZombiePaths />
        <PlayerMarker />
        <ZombieMarkers />
        <HistoricalMarkers />
        <PowerUpMarkers />
        <OtherPlayers />
      </MapContainer>
    </div>
  );
}
