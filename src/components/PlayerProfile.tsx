import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';

export default function PlayerProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLocalMode, signOut } = useAuthStore();
  const { player } = useGameStore();

  // Em modo local, mostrar info básica do jogador
  if (isLocalMode) {
    if (!isOpen) {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-2 hover:scale-105 transition-transform flex items-center gap-2"
        >
          <span className="text-2xl">{player.avatar}</span>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-800">{player.name}</p>
            <p className="text-[10px] text-gray-500">Modo Local</p>
          </div>
        </button>
      );
    }

    return (
      <div className="absolute top-4 right-4 z-[1000] bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl w-[280px]">
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-xl">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{player.avatar}</span>
            <div className="flex-1">
              <h3 className="font-bold text-white">{player.name}</h3>
              <p className="text-xs text-blue-200">Nível {player.level} · Modo Local</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white text-xl">✕</button>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-purple-600">{player.points}</p>
              <p className="text-xs text-gray-600">⭐ Pontos</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-green-600">{player.level}</p>
              <p className="text-xs text-gray-600">📊 Nível</p>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2 text-center">
            <p className="text-xs text-yellow-700">
              💡 Configura o Supabase para guardar o teu progresso e competir com outros jogadores!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Com Supabase configurado
  if (!user) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-2 hover:scale-105 transition-transform flex items-center gap-2"
      >
        <span className="text-2xl">{player.avatar}</span>
        <div className="text-left">
          <p className="text-xs font-bold text-gray-800">{user.email?.split('@')[0] || 'Jogador'}</p>
          <p className="text-[10px] text-green-600">🟢 Online</p>
        </div>
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl w-[280px]">
      <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-xl">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{player.avatar}</span>
          <div className="flex-1">
            <h3 className="font-bold text-white">{user.email?.split('@')[0] || 'Jogador'}</h3>
            <p className="text-xs text-purple-200">Nível {player.level}</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white text-xl">✕</button>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-purple-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-purple-600">{player.points}</p>
            <p className="text-xs text-gray-600">⭐ Pontos</p>
          </div>
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-green-600">{player.level}</p>
            <p className="text-xs text-gray-600">📊 Nível</p>
          </div>
        </div>
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
