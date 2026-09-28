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
    <div className="fixed inset-0 z-[3000] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 overflow-y-auto">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-lg w-full text-center py-8">
        {/* Logo e Título */}
        <div className="mb-10">
          <div className="text-8xl mb-6 animate-float">🏛️</div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
            Évora <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Through Time</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Explora a história enquanto enfrentas zombies!
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-4xl mb-2">📜</div>
            <div className="text-3xl font-bold text-white">{stats.locations}</div>
            <div className="text-sm text-gray-400 mt-1">Locais Históricos</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-4xl mb-2">⏰</div>
            <div className="text-3xl font-bold text-white">{stats.eras}</div>
            <div className="text-sm text-gray-400 mt-1">Eras para Explorar</div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 mb-10 text-left border border-white/10">
          <h3 className="text-white font-bold mb-5 text-center text-xl">🎮 Como Jogar</h3>
          <ul className="space-y-4 text-gray-300 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-3xl">🗺️</span>
              <div>
                <p className="font-bold text-white">Explora a Cidade</p>
                <p className="text-gray-400">Descobre locais históricos reais de Évora</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-3xl">🧟</span>
              <div>
                <p className="font-bold text-white">Combate Zombies</p>
                <p className="text-gray-400">Elimina zombies que te perseguem</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-3xl">📱</span>
              <div>
                <p className="font-bold text-white">Realidade Aumentada</p>
                <p className="text-gray-400">Ativa o AR para uma experiência imersiva</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-3xl">👹</span>
              <div>
                <p className="font-bold text-white">Derrota Bosses</p>
                <p className="text-gray-400">Enfrenta bosses históricos com habilidades especiais</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={onStart}
            className="w-full px-8 py-5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 transition-transform active:scale-95 border-2 border-white/20"
          >
            🚀 Começar Aventura
          </button>
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className="w-full px-8 py-4 bg-white/5 backdrop-blur-md text-white rounded-2xl font-bold text-base border-2 border-white/10 hover:bg-white/10 transition-all active:scale-95"
          >
            ❓ Ver Tutorial
          </button>
        </div>

        {/* Tutorial Expandido */}
        {showTutorial && (
          <div className="mt-8 bg-white/5 backdrop-blur-md rounded-2xl p-6 text-left border border-white/10 animate-scale-in">
            <h3 className="text-white font-bold mb-5 text-center text-xl">📖 Tutorial Detalhado</h3>
            <div className="space-y-5 text-gray-300 text-sm">
              <div>
                <h4 className="text-purple-400 font-bold mb-2 text-base">1. Exploração</h4>
                <p>Move-te pelo mapa usando WASD ou as setas do teclado. Aproxima-te dos marcadores coloridos para descobrir locais históricos.</p>
              </div>
              <div>
                <h4 className="text-purple-400 font-bold mb-2 text-base">2. Combate</h4>
                <p>Os zombies aparecem e perseguem-te. Clica neles para os eliminar e ganhar 50 pontos cada.</p>
              </div>
              <div>
                <h4 className="text-purple-400 font-bold mb-2 text-base">3. Power-ups</h4>
                <p>Apanha itens espalhados pelo mapa: escudos, espadas, poções e pergaminhos.</p>
              </div>
              <div>
                <h4 className="text-purple-400 font-bold mb-2 text-base">4. Missões</h4>
                <p>Completa missões diárias e principais para ganhar recompensas especiais.</p>
              </div>
              <div>
                <h4 className="text-purple-400 font-bold mb-2 text-base">5. Bosses</h4>
                <p>Bosses históricos aparecem periodicamente. Derrota-os para ganhar pontos e itens lendários!</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            Feito com ❤️ em Évora, Portugal 🇵🇹
          </p>
        </div>
      </div>
    </div>
  );
}
