import { useGameStore } from '../store/gameStore';

export default function Compass() {
  const { player, zombies } = useGameStore();

  // Calcular ângulo para o zombie mais próximo
  const getNearestZombieAngle = () => {
    const activeZombies = zombies.filter((z) => z.active);
    if (activeZombies.length === 0) return null;

    let nearestZombie = activeZombies[0];
    let minDistance = Infinity;

    activeZombies.forEach((zombie) => {
      const distance = Math.sqrt(
        Math.pow(zombie.lat - player.lat, 2) + Math.pow(zombie.lng - player.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestZombie = zombie;
      }
    });

    // Calcular ângulo em graus
    const dx = nearestZombie.lng - player.lng;
    const dy = nearestZombie.lat - player.lat;
    let angle = Math.atan2(dx, dy) * (180 / Math.PI);
    
    // Normalizar para 0-360
    if (angle < 0) angle += 360;

    // Converter distância para metros (aproximado)
    const distanceMeters = Math.round(minDistance * 111000);

    return { angle, distance: minDistance, distanceMeters };
  };

  const nearestZombie = getNearestZombieAngle();

  return (
    <div className="relative w-12 h-12 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-lg flex items-center justify-center">
      {/* Norte */}
      <div className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white/60">
        N
      </div>

      {/* Ponteiro da bússola */}
      <div className="w-0.5 h-4 bg-gradient-to-t from-transparent to-white/80 rounded-full" />

      {/* Indicador de zombie */}
      {nearestZombie && (
        <div
          className="absolute w-2 h-2 bg-red-500 rounded-full"
          style={{
            transform: `rotate(${nearestZombie.angle}deg) translateY(-14px)`,
            boxShadow: '0 0 6px rgba(239, 68, 68, 0.8)',
          }}
        >
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
        </div>
      )}

      {/* Tooltip com distância */}
      {nearestZombie && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded px-1.5 py-0.5 whitespace-nowrap">
          <span className="text-[10px] text-white font-mono">{nearestZombie.distanceMeters}m</span>
        </div>
      )}
    </div>
  );
}
