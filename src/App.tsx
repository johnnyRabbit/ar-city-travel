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
import SpecialEffectsVisuals from './components/SpecialEffectsVisuals';

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

      {/* ========== TOP BAR - Player Status (Compacto) ========== */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-black/80 to-transparent pointer-events-none safe-top">
        <div className="p-3 flex items-center justify-between pointer-events-auto">
          {/* Player Info - Compacto */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
            <div className="text-2xl">{player.avatar}</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xs">Nv.{player.level}</span>
                <span className="text-yellow-400 font-bold text-xs">⭐{score}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs">❤️</span>
                <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${(player.health / player.maxHealth) * 100}%`,
                      backgroundColor: player.health > 50 ? '#10B981' : player.health > 25 ? '#F59E0B' : '#EF4444',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Right - Menu Buttons (Pequenos) */}
          <div className="flex items-center gap-1.5">
            <HelpButton />
            <PlayerStats />
          </div>
        </div>
      </div>

      {/* ========== TOP RIGHT - City & Season (Apenas Ícones) ========== */}
      <div className="absolute top-16 right-3 z-[1000] flex flex-col gap-2">
        <CitySelector />
        <SeasonalEventBanner />
      </div>

      {/* ========== LEFT SIDE - Era Selector (Apenas Ícone) ========== */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-[1000]">
        <TimeSelector />
      </div>

      {/* ========== BOTTOM LEFT - Mini Map + Compass ========== */}
      <div className="absolute bottom-3 left-3 z-[1000] flex flex-col gap-2">
        <MiniMap />
        <Compass />
      </div>

      {/* ========== BOTTOM CENTER - Action Buttons ========== */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000]">
        {!gameActive ? (
          <button
            onClick={startGame}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-2xl font-bold text-base hover:scale-105 transition-transform active:scale-95 border-2 border-white/30"
          >
            🎮 Iniciar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAR}
              className={`px-4 py-2.5 rounded-xl shadow-2xl font-bold text-sm transition-all active:scale-95 border-2 ${
                arMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-white/30'
                  : 'bg-black/40 backdrop-blur-md text-white border-white/20 hover:bg-black/60'
              }`}
            >
              {arMode ? '📱 AR' : '📱 AR'}
            </button>
            <button
              onClick={stopGame}
              className="px-4 py-2.5 bg-black/40 backdrop-blur-md text-red-400 rounded-xl shadow-2xl font-bold text-sm hover:bg-black/60 transition-all active:scale-95 border-2 border-white/20"
            >
              ⏹️
            </button>
            <button
              onClick={resetGame}
              className="px-3 py-2.5 bg-black/40 backdrop-blur-md text-white rounded-xl shadow-2xl font-bold text-sm hover:bg-black/60 transition-all active:scale-95 border-2 border-white/20"
            >
              🔄
            </button>
          </div>
        )}
      </div>

      {/* ========== BOTTOM RIGHT - Inventory, Quests, Leaderboard ========== */}
      <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-2">
        <Inventory />
        <QuestPanel />
        <Leaderboard />
      </div>

      {/* ========== Active Effects (Se houver) ========== */}
      <ActiveEffects />

      {/* ========== Sistemas de Jogo ========== */}
      <NotificationSystem />
      <ParticleSystem />
      <ComboSystem />
      <DifficultySystem />
      <DayNightCycle />
      <SpecialEffectsVisuals />

      {/* ========== Game Over Screen ========== */}
      {!gameActive && player.health <= 0 && <GameOverScreen onRestart={handleRestart} />}

      {/* ========== Tutorial ========== */}
      {showTutorial && <Tutorial />}
    </div>
  );
}
