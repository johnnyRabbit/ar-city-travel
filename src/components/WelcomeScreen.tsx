import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const { historicalEvents } = useGameStore();

  const stats = {
    locations: historicalEvents.length,
    eras: new Set(historicalEvents.map((e) => e.era)).size,
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-lg w-full text-center py-8">
        {/* Logo e Título */}
        <div className="mb-8">
          <div className="text-7xl mb-4 animate-bounce">🏛️</div>
          <h1 className="text-5xl font-bold text-white mb-2">
            Évora <span className="text-purple-400">Through Time</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Explora a história enquanto foges de zombies!
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-3xl mb-2">📜</div>
            <div className="text-2xl font-bold text-white">{stats.locations}</div>
            <div className="text-sm text-gray-300">Locais Históricos</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-2xl font-bold text-white">{stats.eras}</div>
            <div className="text-sm text-gray-300">Eras para Explorar</div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 text-left border border-white/10">
          <h3 className="text-white font-bold mb-4 text-center">🎮 Como Jogar</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-2xl">🗺️</span>
              <span>Explora o mapa de Évora e descobre locais históricos reais</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🧟</span>
              <span>Elimina zombies que te perseguem pelas ruas da cidade</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <span>Filtra por eras: Romano, Medieval, Renascimento, Moderno</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⭐</span>
              <span>Ganha pontos descobrindo locais e eliminando zombies</span>
            </li>
          </ul>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={onStart}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-transform active:scale-95"
          >
            🚀 Começar Aventura
          </button>
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className="w-full px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-base border border-white/20 hover:bg-white/20 transition-all active:scale-95"
          >
            ❓ Como Jogar
          </button>
        </div>

        {/* Tutorial Expandido */}
        {showTutorial && (
          <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-6 text-left border border-white/10 animate-slide-down">
            <h3 className="text-white font-bold mb-4 text-center">📖 Tutorial Detalhado</h3>
            <div className="space-y-4 text-gray-300 text-sm">
              <div>
                <h4 className="text-purple-400 font-bold mb-1">1. Exploração</h4>
                <p>Move-te pelo mapa usando WASD ou as setas do teclado. Aproxima-te dos marcadores coloridos para descobrir locais históricos.</p>
              </div>
              <div>
                <h4 className="text-purple-400 font-bold mb-1">2. Combate</h4>
                <p>Os zombies aparecem e perseguem-te. Clica neles para os eliminar e ganhar 50 pontos cada.</p>
              </div>
              <div>
                <h4 className="text-purple-400 font-bold mb-1">3. Descobertas</h4>
                <p>Cada local histórico descoberto dá pontos bonus. Tenta descobrir todos os {stats.locations} locais!</p>
              </div>
              <div>
                <h4 className="text-purple-400 font-bold mb-1">4. Filtros</h4>
                <p>Usa o seletor de eras no topo para focar em períodos históricos específicos.</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-gray-500 text-xs">
          <p>Dados históricos reais de Évora, Portugal 🇵🇹</p>
        </div>
      </div>
    </div>
  );
}
