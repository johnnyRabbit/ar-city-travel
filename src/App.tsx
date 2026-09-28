import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import GameLoop from './components/GameLoop';
import PlayerMovement from './components/PlayerMovement';
import GameMap from './components/GameMap';
import ARView from './components/ARView';
import TimeSelector from './components/TimeSelector';
import MiniMap from './components/MiniMap';
import Compass from './components/Compass';
import NotificationSystem from './components/NotificationSystem';
import ProximityIndicator from './components/ProximityIndicator';
import ProgressBar from './components/ProgressBar';
import Tutorial from './components/Tutorial';
import WelcomeScreen from './components/WelcomeScreen';
import GameOverScreen from './components/GameOverScreen';
import ZombieDirectionArrows from './components/ZombieDirectionArrows';
import Inventory from './components/Inventory';
import QuestPanel from './components/QuestPanel';
import BossHUD from './components/BossHUD';
import HelpButton from './components/HelpButton';
import ContextualTips from './components/ContextualTips';
import ActiveEffects from './components/ActiveEffects';
import CitySelector from './components/CitySelector';
import SeasonalEventBanner from './components/SeasonalEventBanner';
import PlayerStats from './components/PlayerStats';
import DamageOverlay from './components/DamageOverlay';
import PlayerLocationIndicator from './components/PlayerLocationIndicator';

function GameHUD() {
  const { player, score, gameActive, startGame, stopGame, toggleAR, arMode, resetGame } = useGameStore();

  return (
    <>
      {/* Player Info - Topo */}
      <div className="absolute top-2 left-2 right-2 z-[1000] flex items-center justify-between gap-2">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 flex items-center gap-2">
          <span className="text-xl">{player.avatar}</span>
          <div>
            <p className="font-bold text-xs text-gray-800">Nv.{player.level}</p>
            <p className="text-xs text-purple-600 font-bold">⭐{score}</p>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 flex-1 max-w-[150px]">
          <div className="flex items-center gap-2">
            <span className="text-sm">❤️</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${(player.health / player.maxHealth) * 100}%`,
                  backgroundColor: player.health > 50 ? '#10B981' : player.health > 25 ? '#F59E0B' : '#EF4444',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fundo */}
      <div className="absolute bottom-20 left-2 right-2 z-[1000] flex gap-2 justify-center">
        {!gameActive ? (
          <button
            onClick={startGame}
            className="flex-1 max-w-[220px] py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl font-bold text-base hover:scale-105 transition-transform active:scale-95"
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

      {/* Reset Button */}
      <button
        onClick={resetGame}
        className="absolute bottom-4 right-2 z-[1000] w-12 h-12 bg-white/95 text-gray-600 rounded-full shadow-lg font-bold text-lg hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center"
      >
        🔄
      </button>
    </>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const { gameActive, player, resetGame } = useGameStore();

  // Tutorial só aparece na primeira vez
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
    <div className="w-screen h-screen overflow-hidden relative">
      {/* Game Loop - Core game logic */}
      <GameLoop />

      {/* Player Movement - Keyboard + GPS */}
      <PlayerMovement />

      {/* Mapa Principal (completo com power-ups, streets, etc.) */}
      <GameMap />

      {/* AR View - Realidade Aumentada */}
      <ARView />

      {/* Indicadores de Proximidade */}
      <ProximityIndicator />

      {/* Setas de Direção dos Zombies */}
      <ZombieDirectionArrows />

      {/* HUD Principal */}
      <GameHUD />

      {/* Mini-Mapa */}
      <MiniMap />

      {/* Bússola */}
      <Compass />

      {/* Seletor de Eras */}
      <TimeSelector />

      {/* Barra de Progresso */}
      <ProgressBar />

      {/* Sistema de Notificações */}
      <NotificationSystem />

      {/* Boss HUD */}
      <BossHUD />

      {/* Inventário */}
      <Inventory />

      {/* Painel de Missões */}
      <QuestPanel />

      {/* Efeitos Ativos */}
      <ActiveEffects />

      {/* Seletor de Cidade */}
      <CitySelector />

      {/* Banner de Evento Sazonal */}
      <SeasonalEventBanner />

      {/* Dicas Contextuais */}
      <ContextualTips />

      {/* Botão de Ajuda */}
      <HelpButton />

      {/* Estatísticas do Jogador */}
      <PlayerStats />

      {/* Overlay de Dano */}
      <DamageOverlay />

      {/* Indicador de Localização do Jogador */}
      <PlayerLocationIndicator />

      {/* Game Over Screen */}
      {!gameActive && player.health <= 0 && <GameOverScreen onRestart={handleRestart} />}

      {/* Tutorial */}
      {showTutorial && <Tutorial />}
    </div>
  );
}
