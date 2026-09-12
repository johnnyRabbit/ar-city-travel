import { useState, useEffect } from 'react';
import GameMap from './components/GameMap';
import GameHUD from './components/GameHUD';
import TimeSelector from './components/TimeSelector';
import ARView from './components/ARView';
import PlayerMovement from './components/PlayerMovement';
import GameLoop from './components/GameLoop';
import Inventory from './components/Inventory';
import ActiveEffects from './components/ActiveEffects';
import ChatSim from './components/ChatSim';
import Leaderboard from './components/Leaderboard';
import QuestPanel from './components/QuestPanel';
import BossHUD from './components/BossHUD';
import AuthScreen from './components/AuthScreen';
import PlayerProfile from './components/PlayerProfile';
import { useGameStore } from './store/gameStore';
import { useInventoryStore } from './store/inventoryStore';
import { useAuthStore } from './store/authStore';
import { useMultiplayerStore } from './store/multiplayerStore';
import { eras } from './data/evoraHistory';

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 z-[3000] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4 animate-bounce">🏛️</div>
          <h1 className="text-4xl font-bold text-white mb-2">Évora <span className="text-purple-400">Through Time</span></h1>
          <p className="text-gray-300 text-sm">Explora a história de Évora enquanto foges de zombies temporais!</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3"><span className="text-2xl">🗺️</span><p className="text-white text-xs mt-1">Mapa de Évora</p></div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3"><span className="text-2xl">🧟</span><p className="text-white text-xs mt-1">Zombies pelas ruas</p></div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3"><span className="text-2xl">🎒</span><p className="text-white text-xs mt-1">Power-ups e itens</p></div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3"><span className="text-2xl">👥</span><p className="text-white text-xs mt-1">Multiplayer + Chat</p></div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3"><span className="text-2xl">📜</span><p className="text-white text-xs mt-1">Missões e quests</p></div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3"><span className="text-2xl">👹</span><p className="text-white text-xs mt-1">Bosses históricos</p></div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3"><span className="text-2xl">🔊</span><p className="text-white text-xs mt-1">Sons e efeitos</p></div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3"><span className="text-2xl">🏆</span><p className="text-white text-xs mt-1">Leaderboard global</p></div>
        </div>
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {eras.map((era) => (
            <span key={era.id} className="px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: era.color + '80' }}>{era.emoji} {era.name}</span>
          ))}
        </div>
        <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
          <p className="text-white text-xs font-bold mb-2">🎮 Controlos:</p>
          <ul className="text-gray-300 text-xs space-y-1">
            <li>• <strong>WASD / Setas</strong> — Mover no mapa</li>
            <li>• <strong>Clica nos markers</strong> — Descobrir história</li>
            <li>• <strong>Clica nos zombies</strong> — Eliminar</li>
            <li>• <strong>Apanha itens</strong> — Escudos, poções, armas!</li>
            <li>• <strong>🎒 Inventário</strong> — Usa os itens guardados</li>
            <li>• <strong>💬 Chat</strong> — Fala com outros jogadores</li>
          </ul>
        </div>
        <button onClick={onStart} className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-transform animate-pulse">🚀 Começar Aventura</button>
        <p className="text-gray-500 text-xs mt-4">Dados históricos reais de Évora, Portugal</p>
      </div>
      </div>
    </div>
  );
}

function MiniMap() {
  const { player, zombies, historicalEvents, selectedEra } = useGameStore();
  const filteredEvents = selectedEra === 'all' ? historicalEvents : historicalEvents.filter((e) => e.era === selectedEra);
  const centerLat = 38.5702;
  const centerLng = -7.9095;
  const scale = 3000;

  const toMiniCoord = (lat: number, lng: number) => ({ x: 50 + (lng - centerLng) * scale, y: 50 - (lat - centerLat) * scale });
  const playerPos = toMiniCoord(player.lat, player.lng);

  return (
    <div className="absolute bottom-20 right-4 z-[1000] w-32 h-32 bg-slate-800/90 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
      <div className="absolute inset-0 opacity-20"><div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }} /></div>
      {filteredEvents.map((event) => {
        const pos = toMiniCoord(event.lat, event.lng);
        const eraInfo = eras.find((e) => e.id === event.era);
        return <div key={event.id} className="absolute w-2 h-2 rounded-full" style={{ left: `${pos.x}%`, top: `${pos.y}%`, backgroundColor: event.discovered ? '#10B981' : eraInfo?.color || '#666', transform: 'translate(-50%, -50%)' }} />;
      })}
      {zombies.filter((z) => z.active).map((zombie) => {
        const pos = toMiniCoord(zombie.lat, zombie.lng);
        return <div key={zombie.id} className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }} />;
      })}
      <div className="absolute w-3 h-3 bg-blue-400 rounded-full border border-white shadow-lg" style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }} />
      <div className="absolute bottom-1 left-1 text-[8px] text-white/60">MINI MAPA</div>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const { user, loading } = useAuthStore();
  const { connect, disconnect } = useMultiplayerStore();

  // Connect to multiplayer when user logs in
  useEffect(() => {
    if (user) {
      connect(user.id);
    } else {
      disconnect();
    }
  }, [user, connect, disconnect]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="fixed inset-0 z-[3000] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏛️</div>
          <p className="text-white text-lg">A carregar...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen />;
  }

  if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />;

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <GameMap />
      <ARView />
      <TimeSelector />
      <BossHUD />
      <GameHUD />
      <ActiveEffects />
      <Inventory />
      <QuestPanel />
      <ChatSim />
      <Leaderboard />
      <PlayerProfile />
      <MiniMap />
      <PlayerMovement />
      <GameLoop />
      <EffectsLoop />
    </div>
  );
}

function EffectsLoop() {
  const { gameActive } = useGameStore();
  const { tickEffects, spawnRandomMapItems, mapItems } = useInventoryStore();
  const { player } = useGameStore();

  // Tick effects every 100ms
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      tickEffects(100);
    }, 100);
    return () => clearInterval(interval);
  }, [gameActive, tickEffects]);

  // Spawn items periodically
  useEffect(() => {
    if (!gameActive) return;

    // Initial spawn
    if (mapItems.filter((m) => !m.collected).length === 0) {
      spawnRandomMapItems(5, player.lat, player.lng);
    }

    const interval = setInterval(() => {
      const activeItems = mapItems.filter((m) => !m.collected).length;
      if (activeItems < 5) {
        spawnRandomMapItems(2, player.lat, player.lng);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [gameActive, player.lat, player.lng, mapItems, spawnRandomMapItems]);

  return null;
}
