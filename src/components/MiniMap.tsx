import { useGameStore } from '../store/gameStore';

export default function MiniMap() {
  const { player, zombies, historicalEvents, selectedEra } = useGameStore();

  const filteredEvents =
    selectedEra === 'all'
      ? historicalEvents
      : historicalEvents.filter((e) => e.era === selectedEra);

  // Converter coordenadas GPS para posições no mini-mapa
  const toMiniCoord = (lat: number, lng: number) => {
    const centerLat = 38.5702;
    const centerLng = -7.9100;
    const scale = 3000;

    const x = 50 + (lng - centerLng) * scale;
    const y = 50 - (lat - centerLat) * scale;

    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  };

  const playerPos = toMiniCoord(player.lat, player.lng);

  return (
    <div className="relative w-36 h-36 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black/40 backdrop-blur-sm px-2 py-1 z-10">
        <p className="text-[10px] text-white/70 font-bold text-center">MAPA</p>
      </div>

      {/* Grid de fundo */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />
      </div>

      {/* Eventos históricos */}
      {filteredEvents.map((event) => {
        const pos = toMiniCoord(event.lat, event.lng);
        const eraColors: Record<string, string> = {
          romano: '#DC2626',
          visigodo: '#7C3AED',
          mouro: '#059669',
          medieval: '#D97706',
          renascimento: '#2563EB',
          moderno: '#6366F1',
        };

        return (
          <div
            key={event.id}
            className="absolute w-2.5 h-2.5 rounded-full border border-white/50"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              backgroundColor: event.discovered ? '#10B981' : eraColors[event.era] || '#666',
              transform: 'translate(-50%, -50%)',
              opacity: event.discovered ? 0.6 : 1,
              boxShadow: event.discovered ? 'none' : `0 0 6px ${eraColors[event.era] || '#666'}`,
            }}
          />
        );
      })}

      {/* Zombies */}
      {zombies
        .filter((z) => z.active)
        .map((zombie) => {
          const pos = toMiniCoord(zombie.lat, zombie.lng);
          return (
            <div
              key={zombie.id}
              className="absolute w-2 h-2 bg-red-500 rounded-full"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
              }}
            >
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
            </div>
          );
        })}

      {/* Jogador */}
      <div
        className="absolute w-4 h-4"
        style={{
          left: `${playerPos.x}%`,
          top: `${playerPos.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50" />
        <div className="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
      </div>

      {/* Bússola */}
      <div className="absolute top-6 right-2 text-white/50 text-xs font-bold">N</div>
    </div>
  );
}
