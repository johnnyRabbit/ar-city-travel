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
      className="absolute bottom-36 right-2 z-[999] w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95 border-2 border-blue-500"
      title="Centrar no jogador"
    >
      <span className="text-xl">📍</span>
    </button>
  );
}
