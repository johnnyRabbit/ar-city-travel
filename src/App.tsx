import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import GameLoop from './components/GameLoop';
import PlayerMovement from './components/PlayerMovement';
import GameMap from './components/GameMap';
import ARView from './components/ARView';
import NotificationSystem from './components/NotificationSystem';
import Tutorial from './components/Tutorial';
import WelcomeScreen from './components/WelcomeScreen';
import GameOverScreen from './components/GameOverScreen';
import ZombieDirectionArrows from './components/ZombieDirectionArrows';
import BossHUD from './components/BossHUD';
import ContextualTips from './components/ContextualTips';
import DamageOverlay from './components/DamageOverlay';
import MiniMap from './components/MiniMap';
import TimeSelector from './components/TimeSelector';
import Inventory from './components/Inventory';
import QuestPanel from './components/QuestPanel';
import HelpButton from './components/HelpButton';
import PlayerStats from './components/PlayerStats';
import Compass from './components/Compass';
import Leaderboard from './components/Leaderboard';
import ActiveEffects from './components/ActiveEffects';
import CitySelector from './components/CitySelector';
import SeasonalEventBanner from './components/SeasonalEventBanner';
import ParticleSystem from './components/ParticleSystem';
import ComboSystem from './components/ComboSystem';
import DifficultySystem from './components/DifficultySystem';
import DayNightCycle from './components/DayNightCycle';

export default function App() {
  const [started, setStarted] = useState(false);
  const { gameActive, player, score, startGame, stopGame, toggleAR, arMode, resetGame } = useGameStore();

  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('hasSeenTutorial');
  });

  const handleStartGame = () => {
    setStarted(true);
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  const handleRestart = () => {
    resetGame();
    setStarted(false);
  };

  if (!started) {
    return <WelcomeScreen onStart={handleStartGame} />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-gray-900">
      {/* Game Loop - Core game logic */}
      <GameLoop />

      {/* Player Movement - Keyboard + GPS */}
      <PlayerMovement />

      {/* Mapa Principal */}
      <GameMap />

      {/* AR View - Realidade Aumentada */}
      <ARView />

      {/* Setas de Direção dos Zombies */}
      <ZombieDirectionArrows />

      {/* Boss HUD */}
      <BossHUD />

      {/* Dicas Contextuais */}
      <ContextualTips />

      {/* Overlay de Dano */}
      <DamageOverlay />

      {/* ========== TOP BAR - Player Status ========== */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="p-4 flex items-center justify-between pointer-events-auto">
          {/* Player Info */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
            <div className="text-3xl">{player.avatar}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Nv. {player.level}</span>
                <span className="text-yellow-400 font-bold text-sm">⭐ {score}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white/70">❤️</span>
                <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${(player.health / player.maxHealth) * 100}%`,
                      backgroundColor: player.health > 50 ? '#10B981' : player.health > 25 ? '#F59E0B' : '#EF4444',
                    }}
                  />
                </div>
                <span className="text-xs text-white font-mono">{player.health}/{player.maxHealth}</span>
              </div>
            </div>
          </div>

          {/* Top Right Menu */}
          <div className="flex items-center gap-2">
            <HelpButton />
            <PlayerStats />
          </div>
        </div>
      </div>

      {/* ========== LEFT SIDE - Map Controls ========== */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-3">
        <TimeSelector />
      </div>

      {/* ========== BOTTOM CENTER - Action Buttons ========== */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
        {!gameActive ? (
          <button
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl font-bold text-lg hover:scale-105 transition-transform active:scale-95 border-2 border-white/30"
          >
            🎮 Iniciar Jogo
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAR}
              className={`px-6 py-3 rounded-2xl shadow-2xl font-bold text-base transition-all active:scale-95 border-2 ${
                arMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-white/30'
                  : 'bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20'
              }`}
            >
              {arMode ? '📱 AR ON' : '📱 AR'}
            </button>
            <button
              onClick={stopGame}
              className="px-6 py-3 bg-white/10 backdrop-blur-md text-red-400 rounded-2xl shadow-2xl font-bold text-base hover:bg-white/20 transition-all active:scale-95 border-2 border-white/20"
            >
              ⏹️ Parar
            </button>
            <button
              onClick={resetGame}
              className="px-4 py-3 bg-white/10 backdrop-blur-md text-white rounded-2xl shadow-2xl font-bold text-base hover:bg-white/20 transition-all active:scale-95 border-2 border-white/20"
            >
              🔄
            </button>
          </div>
        )}
      </div>

      {/* ========== BOTTOM RIGHT - Inventory & Quests ========== */}
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-3">
        <Inventory />
        <QuestPanel />
        <Leaderboard />
      </div>

      {/* ========== TOP RIGHT - Additional Controls ========== */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <CitySelector />
        <SeasonalEventBanner />
      </div>

      {/* ========== BOTTOM LEFT - Compass & Effects ========== */}
      <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-3 items-start">
        <MiniMap />
        <Compass />
        <ActiveEffects />
      </div>

      {/* ========== Sistema de Notificações ========== */}
      <NotificationSystem />

      {/* ========== NOVOS SISTEMAS ========== */}
      <ParticleSystem />
      <ComboSystem />
      <DifficultySystem />
      <DayNightCycle />

      {/* ========== Game Over Screen ========== */}
      {!gameActive && player.health <= 0 && <GameOverScreen onRestart={handleRestart} />}

      {/* ========== Tutorial ========== */}
      {showTutorial && <Tutorial />}
    </div>
  );
}
