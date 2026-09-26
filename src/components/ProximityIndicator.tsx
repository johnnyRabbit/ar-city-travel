import { useGameStore } from '../store/gameStore';

export default function ProximityIndicator() {
  const { player, zombies, historicalEvents } = useGameStore();

  // Calcular distâncias
  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3; // metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Verificar locais históricos próximos
  const nearbyLocations = historicalEvents.filter((event) => {
    if (event.discovered) return false;
    const distance = getDistance(player.lat, player.lng, event.lat, event.lng);
    return distance < 50; // 50 metros
  });

  // Verificar zombies próximos
  const nearbyZombies = zombies.filter((zombie) => {
    if (!zombie.active) return false;
    const distance = getDistance(player.lat, player.lng, zombie.lat, zombie.lng);
    return distance < 100; // 100 metros
  });

  const hasNearbyLocation = nearbyLocations.length > 0;
  const hasNearbyZombie = nearbyZombies.length > 0;
  const hasDangerousZombie = nearbyZombies.some((z) => {
    const distance = getDistance(player.lat, player.lng, z.lat, z.lng);
    return distance < 30; // 30 metros
  });

  if (!hasNearbyLocation && !hasNearbyZombie) return null;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[500]">
      {/* Círculo verde - Local histórico próximo */}
      {hasNearbyLocation && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 border-4 border-green-400/50 rounded-full animate-pulse" />
          <div className="absolute w-60 h-60 border-2 border-green-400/30 rounded-full animate-ping" />
        </div>
      )}

      {/* Círculo amarelo - Zombie a aproximar-se */}
      {hasNearbyZombie && !hasDangerousZombie && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 border-4 border-yellow-400/50 rounded-full animate-pulse" />
        </div>
      )}

      {/* Círculo vermelho - Zombie muito perto */}
      {hasDangerousZombie && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-red-500/70 rounded-full animate-pulse" />
          <div className="absolute w-48 h-48 border-2 border-red-500/40 rounded-full animate-ping" />
        </div>
      )}
    </div>
  );
}
