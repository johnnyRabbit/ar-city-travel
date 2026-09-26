import { useGameStore } from '../store/gameStore';

export default function ZombieDirectionArrows() {
  const { player, zombies } = useGameStore();

  const activeZombies = zombies.filter((z) => z.active);

  // Calcular ângulo e distância para cada zombie
  const zombieData = activeZombies.map((zombie) => {
    const dx = zombie.lng - player.lng;
    const dy = zombie.lat - player.lat;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dx, dy) * (180 / Math.PI);

    return { id: zombie.id, angle, distance, emoji: zombie.emoji };
  });

  // Filtrar zombies que estão fora do viewport (mais de 0.005 graus de distância)
  const offscreenZombies = zombieData.filter((z) => z.distance > 0.005);

  if (offscreenZombies.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[600]">
      {offscreenZombies.map((zombie) => {
        // Calcular posição na borda do ecrã
        const radius = 45; // Distância do centro em percentagem
        const angleRad = (zombie.angle * Math.PI) / 180;
        const x = 50 + Math.sin(angleRad) * radius;
        const y = 50 - Math.cos(angleRad) * radius;

        // Tamanho baseado na distância (mais perto = maior)
        const size = Math.max(20, Math.min(40, 100 - zombie.distance * 10000));

        return (
          <div
            key={zombie.id}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${zombie.angle}deg)`,
            }}
          >
            <div
              className="bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg animate-pulse"
              style={{ width: `${size}px`, height: `${size}px` }}
            >
              <span style={{ fontSize: `${size * 0.6}px` }}>{zombie.emoji}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
