import { useGameStore } from '../store/gameStore';

interface GameOverScreenProps {
  onRestart: () => void;
}

export default function GameOverScreen({ onRestart }: GameOverScreenProps) {
  const { score, historicalEvents, zombies } = useGameStore();

  const discoveredLocations = historicalEvents.filter((e) => e.discovered).length;
  const totalLocations = historicalEvents.length;
  const zombiesKilled = zombies.filter((z) => !z.active).length;

  return (
    <div className="absolute inset-0 z-[2000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-2xl animate-scale-in">
        {/* Ícone */}
        <div className="text-6xl mb-4">💀</div>

        {/* Título */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
        <p className="text-gray-600 mb-6">Os zombies apanharam-te...</p>

        {/* Estatísticas */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
          <div className="text-4xl font-bold text-purple-600 mb-4">⭐ {score}</div>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl mb-1">📜</div>
              <div className="text-lg font-bold text-gray-800">
                {discoveredLocations}/{totalLocations}
              </div>
              <div className="text-xs text-gray-600">Locais Descobertos</div>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl mb-1">🧟</div>
              <div className="text-lg font-bold text-gray-800">{zombiesKilled}</div>
              <div className="text-xs text-gray-600">Zombies Eliminados</div>
            </div>
          </div>
        </div>

        {/* Conquistas */}
        {discoveredLocations === totalLocations && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-sm font-bold text-yellow-800">
              Conquista Desbloqueada!
            </div>
            <div className="text-xs text-yellow-700">Historiador Supremo</div>
          </div>
        )}

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform active:scale-95 shadow-lg"
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
}
