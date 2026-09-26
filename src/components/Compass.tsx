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

    return { angle, distance: minDistance };
  };

  const nearestZombie = getNearestZombieAngle();

  return (
    <div className="absolute bottom-20 right-2 z-[999] w-16 h-16 bg-slate-800/90 backdrop-blur-sm rounded-full border-2 border-white/20 shadow-2xl flex items-center justify-center">
      {/* Norte */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/60">
        N
      </div>

      {/* Ponteiro da bússola */}
      <div className="w-1 h-6 bg-gradient-to-t from-transparent to-white/80 rounded-full" />

      {/* Indicador de zombie */}
      {nearestZombie && (
        <div
          className="absolute w-2 h-2 bg-red-500 rounded-full"
          style={{
            transform: `rotate(${nearestZombie.angle}deg) translateY(-20px)`,
          }}
        />
      )}

      {/* Centro */}
      <div className="absolute w-2 h-2 bg-blue-400 rounded-full border border-white" />
    </div>
  );
}
