import { useGameStore } from '../store/gameStore';
import { useMap } from 'react-leaflet';

export default function LocateMeButton() {
  const map = useMap();
  const { player } = useGameStore();

  const handleLocate = () => {
    map.flyTo([player.lat, player.lng], 18, {
      duration: 1,
      easeLinearity: 0.25
    });
  };

  return (
    <button
      onClick={handleLocate}
      className="absolute bottom-24 right-4 z-[999] w-14 h-14 bg-white/10 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 border-2 border-white/20"
      title="Centrar no jogador"
    >
      <div className="relative">
        <span className="text-2xl">📍</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
      </div>
    </button>
  );
}
