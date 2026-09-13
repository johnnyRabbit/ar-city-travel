import { useGameStore } from '../store/gameStore';
import { useEffect, useState } from 'react';

export default function GameHUD() {
  const { player, score, zombies, historicalEvents, gameActive, startGame, stopGame, toggleAR, arMode, notifications, removeNotification, resetGame } = useGameStore();
  const discoveredCount = historicalEvents.filter((e) => e.discovered).length;
  const totalEvents = historicalEvents.length;
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      notifications.forEach((n) => { if (Date.now() - n.timestamp > 4000) removeNotification(n.id); });
    }, 1000);
    return () => clearInterval(timer);
  }, [notifications, removeNotification]);

  return (
    <>
      {/* Compact Top Bar - Mobile Friendly */}
      <div className="absolute top-2 left-2 right-2 z-[1000] flex items-center justify-between gap-2">
        {/* Player Info - Compact */}
        <button 
          onClick={() => setShowStats(!showStats)}
          className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 flex items-center gap-2 flex-shrink-0"
        >
          <span className="text-xl">{player.avatar}</span>
          <div className="text-left">
            <p className="font-bold text-xs text-gray-800">Nv.{player.level}</p>
            <p className="text-xs text-purple-600 font-bold">⭐{score}</p>
          </div>
        </button>

        {/* Health Bar - Compact */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 flex-1 max-w-[150px]">
          <div className="flex items-center gap-2">
            <span className="text-sm">❤️</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${(player.health / player.maxHealth) * 100}%`, 
                  backgroundColor: player.health > 50 ? '#10B981' : player.health > 25 ? '#F59E0B' : '#EF4444' 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Zombie Counter - Only when game active */}
        {gameActive && (
          <div className="bg-red-500/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 text-white flex items-center gap-1 flex-shrink-0">
            <span className="text-sm">🧟</span>
            <span className="font-bold text-sm">{zombies.filter((z) => z.active).length}</span>
          </div>
        )}
      </div>

      {/* Expanded Stats Panel */}
      {showStats && (
        <div className="absolute top-14 left-2 z-[1001] bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl p-4 min-w-[200px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-gray-800">Estatísticas</h3>
            <button onClick={() => setShowStats(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span>👤 Nome</span><span className="font-bold">{player.name}</span></div>
            <div className="flex justify-between"><span>📊 Nível</span><span className="font-bold">{player.level}</span></div>
            <div className="flex justify-between"><span>⭐ Pontos</span><span className="font-bold text-purple-600">{score}</span></div>
            <div className="flex justify-between"><span>❤️ Vida</span><span className="font-bold">{player.health}/{player.maxHealth}</span></div>
            <div className="flex justify-between"><span>📜 Descobertas</span><span className="font-bold text-blue-600">{discoveredCount}/{totalEvents}</span></div>
          </div>
        </div>
      )}

      {/* Main Action Buttons - Large and Accessible */}
      <div className="absolute bottom-4 left-2 right-2 z-[1000] flex gap-2 justify-center">
        {!gameActive ? (
          <button 
            onClick={startGame} 
            className="flex-1 max-w-[200px] py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl font-bold text-base hover:scale-105 transition-transform active:scale-95"
          >
            🎮 Iniciar Jogo
          </button>
        ) : (
          <>
            <button 
              onClick={toggleAR} 
              className={`flex-1 py-4 rounded-2xl shadow-2xl font-bold text-base transition-all active:scale-95 ${
                arMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' 
                  : 'bg-white/95 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {arMode ? '📱 AR ON' : '📱 AR'}
            </button>
            <button 
              onClick={stopGame} 
              className="flex-1 py-4 bg-white/95 text-red-600 rounded-2xl shadow-2xl font-bold text-base hover:bg-red-50 transition-all active:scale-95"
            >
              ⏹️ Parar
            </button>
          </>
        )}
      </div>

      {/* Reset Button - Smaller, Bottom Right */}
      <button 
        onClick={() => resetGame()} 
        className="absolute bottom-20 right-2 z-[1000] w-12 h-12 bg-white/95 text-gray-600 rounded-full shadow-lg font-bold text-lg hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center"
      >
        🔄
      </button>

      {/* Notifications - Compact */}
      <div className="absolute top-14 right-2 z-[1000] flex flex-col gap-1 max-w-[200px]">
        {notifications.slice(-2).map((n) => (
          <div key={n.id} className={`px-2 py-1.5 rounded-lg shadow-md text-xs font-medium animate-slide-in ${
            n.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
            n.type === 'danger' ? 'bg-red-100 text-red-800 border border-red-200' : 
            n.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {n.message}
          </div>
        ))}
      </div>

      {/* Game Over Overlay */}
      {!gameActive && player.health <= 0 && (
        <div className="absolute inset-0 z-[2000] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 text-center max-w-sm w-full shadow-2xl">
            <div className="text-5xl mb-3">💀</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Game Over!</h2>
            <p className="text-gray-600 text-sm mb-3">Os zombies apanharam-te! Mas descobriste {discoveredCount} locais históricos.</p>
            <div className="bg-purple-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-purple-800">Pontuação final: <span className="font-bold text-lg">{score}</span></p>
            </div>
            <button 
              onClick={() => resetGame()} 
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-transform active:scale-95"
            >
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      )}
    </>
  );
}
