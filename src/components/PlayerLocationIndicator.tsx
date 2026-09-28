import { useGameStore } from '../store/gameStore';

export default function PlayerLocationIndicator() {
  const { player, gameActive } = useGameStore();

  if (!gameActive) return null;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 flex items-center gap-2">
      <div className="relative">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        <div className="absolute inset-0 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
      </div>
      <div className="text-xs">
        <p className="font-bold text-gray-800">📍 A tua localização</p>
        <p className="text-gray-500 text-[10px]">
          {player.lat.toFixed(5)}, {player.lng.toFixed(5)}
        </p>
      </div>
    </div>
  );
}
