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
    const scale = 3000; // Escala para o mini-mapa

    const x = 50 + (lng - centerLng) * scale;
    const y = 50 - (lat - centerLat) * scale;

    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  };

  const playerPos = toMiniCoord(player.lat, player.lng);

  return (
    <div className="absolute bottom-20 left-2 z-[999] w-32 h-32 bg-slate-800/90 backdrop-blur-sm rounded-xl border-2 border-white/20 overflow-hidden shadow-2xl">
      {/* Grid de fundo */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '10px 10px',
          }}
        />
      </div>

      {/* Eventos históricos */}
      {filteredEvents.map((event) => {
        const pos = toMiniCoord(event.lat, event.lng);
        const eraColors: Record<string, string> = {
          romano: '#DC2626',
          medieval: '#D97706',
          renascimento: '#2563EB',
          moderno: '#6366F1',
        };

        return (
          <div
            key={event.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              backgroundColor: event.discovered ? '#10B981' : eraColors[event.era] || '#666',
              transform: 'translate(-50%, -50%)',
              opacity: event.discovered ? 0.6 : 1,
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
              className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}

      {/* Jogador */}
      <div
        className="absolute w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-lg"
        style={{
          left: `${playerPos.x}%`,
          top: `${playerPos.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Label */}
      <div className="absolute bottom-1 left-1 text-[8px] text-white/60 font-bold">
        MINI MAPA
      </div>
    </div>
  );
}
