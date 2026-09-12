import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMultiplayerStore } from '../store/multiplayerStore';

export default function PlayerProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const { player, signOut } = useAuthStore();
  const { onlinePlayers } = useMultiplayerStore();

  if (!player) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-2 hover:scale-105 transition-transform flex items-center gap-2"
      >
        <span className="text-2xl">{player.avatar}</span>
        <div className="text-left">
          <p className="text-xs font-bold text-gray-800">{player.username}</p>
          <p className="text-[10px] text-green-600">🟢 {onlinePlayers.length} online</p>
        </div>
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl w-[300px]">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-xl">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{player.avatar}</span>
          <div className="flex-1">
            <h3 className="font-bold text-white">{player.username}</h3>
            <p className="text-xs text-purple-200">Nível {player.level}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-purple-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-purple-600">{player.points}</p>
            <p className="text-xs text-gray-600">⭐ Pontos</p>
          </div>
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-green-600">{player.zombies_killed}</p>
            <p className="text-xs text-gray-600">🧟 Zombies</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-blue-600">{player.locations_discovered}</p>
            <p className="text-xs text-gray-600">📜 Locais</p>
          </div>
          <div className="bg-red-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-red-600">{player.bosses_defeated}</p>
            <p className="text-xs text-gray-600">👹 Bosses</p>
          </div>
        </div>

        {/* Distance */}
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">🗺️ Distância total</span>
            <span className="text-sm font-bold text-gray-800">
              {(player.total_distance / 1000).toFixed(2)} km
            </span>
          </div>
        </div>

        {/* Online Players */}
        <div>
          <p className="text-xs font-bold text-gray-600 mb-2">
            🟢 {onlinePlayers.length} jogadores online
          </p>
          <div className="max-h-[100px] overflow-y-auto space-y-1">
            {onlinePlayers.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-xs">
                <span>{p.avatar}</span>
                <span className="text-gray-700">{p.username}</span>
                <span className="text-purple-600 ml-auto">⭐ {p.points}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={signOut}
          className="w-full py-2 px-4 bg-red-100 text-red-600 rounded-lg font-medium text-sm hover:bg-red-200 transition-colors"
        >
          🚪 Terminar Sessão
        </button>
      </div>
    </div>
  );
}
