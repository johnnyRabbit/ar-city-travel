import { useBossStore } from '../store/bossStore';
import { useGameStore } from '../store/gameStore';

export default function BossHUD() {
  const { activeBoss, damageBoss } = useBossStore();
  const { addPoints, addNotification, player } = useGameStore();

  if (!activeBoss) return null;

  const healthPercent = (activeBoss.health / activeBoss.maxHealth) * 100;
  const distance = Math.sqrt(
    Math.pow(activeBoss.lat - player.lat, 2) + Math.pow(activeBoss.lng - player.lng, 2)
  );
  const isNear = distance < 0.001; // ~100m

  const handleAttack = () => {
    if (!isNear) {
      addNotification('📍 Aproxima-te mais para atacar o boss!', 'warning');
      return;
    }

    const result = damageBoss(50); // 50 de dano por clique
    if (result && result.killed) {
      addPoints(result.points);
      addNotification(
        `👑 ${activeBoss.name} derrotado! +${result.points} pontos!`,
        'success'
      );
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] bg-gradient-to-r from-red-900/95 to-purple-900/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 min-w-[300px] max-w-[400px] border-2 border-red-500">
      {/* Boss Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl animate-pulse">{activeBoss.emoji}</span>
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg">{activeBoss.name}</h3>
          <p className="text-xs text-red-200 italic">{activeBoss.title}</p>
        </div>
      </div>

      {/* Health Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-red-200">❤️ Vida</span>
          <span className="text-white font-bold">
            {activeBoss.health}/{activeBoss.maxHealth}
          </span>
        </div>
        <div className="w-full bg-red-950 rounded-full h-3 border border-red-700">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-300"
            style={{ width: `${healthPercent}%` }}
          />
        </div>
      </div>

      {/* Boss Info */}
      <div className="text-xs text-red-200 mb-3">
        <p>{activeBoss.description}</p>
      </div>

      {/* Attack Button */}
      {isNear ? (
        <button
          onClick={handleAttack}
          className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold hover:from-red-700 hover:to-orange-700 transition-all animate-pulse"
        >
          ⚔️ Atacar Boss (-50 HP)
        </button>
      ) : (
        <div className="text-center text-xs text-yellow-300 bg-yellow-900/50 rounded-lg p-2">
          📍 Aproxima-te para atacar!
        </div>
      )}

      {/* Abilities Warning */}
      <div className="mt-2 flex gap-1 flex-wrap">
        {activeBoss.abilities.map((ability) => {
          const timeSinceLastUse = (Date.now() - ability.lastUsed) / 1000;
          const isReady = timeSinceLastUse >= ability.cooldown;
          
          return (
            <span
              key={ability.id}
              className={`text-xs px-2 py-1 rounded ${
                isReady ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-700 text-gray-400'
              }`}
            >
              {ability.emoji} {ability.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
