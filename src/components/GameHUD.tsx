import { useGameStore } from '../store/gameStore';
import { useEffect } from 'react';

export default function GameHUD() {
  const { player, score, zombies, historicalEvents, gameActive, startGame, stopGame, toggleAR, arMode, notifications, removeNotification, resetGame } = useGameStore();
  const discoveredCount = historicalEvents.filter((e) => e.discovered).length;
  const totalEvents = historicalEvents.length;

  useEffect(() => {
    const timer = setInterval(() => {
      notifications.forEach((n) => { if (Date.now() - n.timestamp > 4000) removeNotification(n.id); });
    }, 1000);
    return () => clearInterval(timer);
  }, [notifications, removeNotification]);

  return (
    <>
      <div className="absolute top-16 left-4 z-[1000] flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 min-w-[180px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{player.avatar}</span>
            <div><p className="font-bold text-sm text-gray-800">{player.name}</p><p className="text-xs text-gray-500">Nível {player.level}</p></div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-0.5"><span>❤️ Vida</span><span>{player.health}/{player.maxHealth}</span></div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="h-2.5 rounded-full transition-all duration-300" style={{ width: `${(player.health / player.maxHealth) * 100}%`, backgroundColor: player.health > 50 ? '#10B981' : player.health > 25 ? '#F59E0B' : '#EF4444' }} />
            </div>
          </div>
          <div className="flex justify-between text-xs"><span>⭐ Pontos</span><span className="font-bold text-purple-600">{score}</span></div>
          <div className="flex justify-between text-xs mt-1"><span>📜 Descobertas</span><span className="font-bold text-blue-600">{discoveredCount}/{totalEvents}</span></div>
        </div>
        {gameActive && (
          <div className="bg-red-500/95 backdrop-blur-sm rounded-xl shadow-lg p-3 text-white">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧟</span>
              <div><p className="text-xs font-medium">Zombies ativos</p><p className="font-bold text-lg">{zombies.filter((z) => z.active).length}</p></div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex gap-3">
        {!gameActive ? (
          <button onClick={startGame} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg font-bold text-sm hover:scale-105 transition-transform">🎮 Iniciar Jogo</button>
        ) : (
          <>
            <button onClick={toggleAR} className={`px-4 py-3 rounded-xl shadow-lg font-bold text-sm transition-all ${arMode ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' : 'bg-white/95 text-gray-700 hover:bg-gray-100'}`}>{arMode ? '📱 AR ON' : '📱 AR'}</button>
            <button onClick={stopGame} className="px-4 py-3 bg-white/95 text-red-600 rounded-xl shadow-lg font-bold text-sm hover:bg-red-50 transition-all">⏹️ Parar</button>
          </>
        )}
        <button onClick={resetGame} className="px-4 py-3 bg-white/95 text-gray-600 rounded-xl shadow-lg font-bold text-sm hover:bg-gray-100 transition-all">🔄 Reset</button>
      </div>

      <div className="absolute top-16 right-4 z-[1000] flex flex-col gap-2 max-w-[250px]">
        {notifications.map((n) => (
          <div key={n.id} className={`px-3 py-2 rounded-lg shadow-md text-xs font-medium animate-slide-in ${n.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : n.type === 'danger' ? 'bg-red-100 text-red-800 border border-red-200' : n.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>{n.message}</div>
        ))}
      </div>

      {!gameActive && player.health <= 0 && (
        <div className="absolute inset-0 z-[2000] bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Game Over!</h2>
            <p className="text-gray-600 mb-4">Os zombies apanharam-te! Mas descobriste {discoveredCount} locais históricos.</p>
            <div className="bg-purple-50 rounded-lg p-3 mb-4"><p className="text-sm text-purple-800">Pontuação final: <span className="font-bold text-lg">{score}</span></p></div>
            <button onClick={resetGame} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-transform">🔄 Tentar Novamente</button>
          </div>
        </div>
      )}
    </>
  );
}
