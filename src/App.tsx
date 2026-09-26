import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGameStore } from './store/gameStore';
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

// Ícone do jogador
const playerIcon = L.divIcon({
  html: '<div style="font-size: 24px;">🧑‍🚀</div>',
  className: 'player-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Ícone dos zombies
const createZombieIcon = (emoji: string) =>
  L.divIcon({
    html: `<div style="font-size: 20px;">${emoji}</div>`,
    className: 'zombie-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

// Ícone dos eventos
const createEventIcon = (icon: string, discovered: boolean) =>
  L.divIcon({
    html: `<div style="font-size: 20px; background: ${discovered ? '#10B981' : '#6366F1'}; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 2px solid white;">${icon}</div>`,
    className: 'event-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });



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

function GameMap() {
  const { player, zombies, historicalEvents, selectedEra, discoverEvent, killZombie } = useGameStore();

  const filteredEvents =
    selectedEra === 'all'
      ? historicalEvents
      : historicalEvents.filter((e) => e.era === selectedEra);

  return (
    <MapContainer
      center={[player.lat, player.lng]}
      zoom={17}
      className="w-full h-full z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Player */}
      <Marker position={[player.lat, player.lng]} icon={playerIcon}>
        <Popup>
          <div className="text-center">
            <strong>{player.name}</strong>
            <br />
            ❤️ {player.health}/{player.maxHealth}
          </div>
        </Popup>
      </Marker>

      {/* Zombies */}
      {zombies
        .filter((z) => z.active)
        .map((zombie) => (
          <Marker
            key={zombie.id}
            position={[zombie.lat, zombie.lng]}
            icon={createZombieIcon(zombie.emoji)}
            eventHandlers={{ click: () => killZombie(zombie.id) }}
          >
            <Popup>
              <div className="text-center">
                <strong>{zombie.name}</strong>
                <br />
                ❤️ {zombie.health}/{zombie.maxHealth}
                <br />
                <button
                  onClick={() => killZombie(zombie.id)}
                  className="mt-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                >
                  ⚔️ Atacar
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Historical Events */}
      {filteredEvents.map((event) => {
        const dist = Math.sqrt(
          Math.pow(event.lat - player.lat, 2) + Math.pow(event.lng - player.lng, 2)
        );
        const isNear = dist < 0.001;

        return (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={createEventIcon(event.icon, event.discovered)}
            eventHandlers={{
              click: () => {
                if (isNear && !event.discovered) {
                  discoverEvent(event.id);
                }
              },
            }}
          >
            <Popup>
              <div className="max-w-[200px]">
                <h3 className="font-bold text-sm">
                  {event.icon} {event.title}
                </h3>
                <p className="text-xs text-gray-600">
                  Ano: {event.year > 0 ? `${event.year} d.C.` : `${Math.abs(event.year)} a.C.`}
                </p>
                <p className="text-xs mt-1">{event.description}</p>
                {event.discovered ? (
                  <span className="text-green-600 text-xs font-bold">
                    ✅ Descoberto (+{event.points} pts)
                  </span>
                ) : isNear ? (
                  <button
                    onClick={() => discoverEvent(event.id)}
                    className="mt-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                  >
                    🔍 Descobrir (+{event.points} pts)
                  </button>
                ) : (
                  <span className="text-orange-600 text-xs">📍 Aproxima-te!</span>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
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
      {/* Mapa Principal */}
      <GameMap />

      {/* Indicadores de Proximidade */}
      <ProximityIndicator />

      {/* Setas de Direção dos Zombies */}
      <ZombieDirectionArrows />

      {/* HUD */}
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

      {/* Game Over Screen */}
      {!gameActive && player.health <= 0 && <GameOverScreen onRestart={handleRestart} />}

      {/* Tutorial */}
      {showTutorial && <Tutorial />}
    </div>
  );
}
