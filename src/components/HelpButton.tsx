import { useState } from 'react';

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-xl hover:bg-white/20 transition-all active:scale-95 border-2 border-white/20"
        title="Ajuda"
      >
        ❓
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Help Panel */}
      <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto pointer-events-auto border border-white/10">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">📖 Como Jogar</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-95 text-xl"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Mobile Controls */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h3 className="font-bold text-base text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">📱</span> Controlos Mobile
              </h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span><strong className="text-white">Mover:</strong> Anda fisicamente (GPS)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span><strong className="text-white">Interagir:</strong> Toca nos markers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span><strong className="text-white">Atacar:</strong> Toca nos zombies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span><strong className="text-white">AR:</strong> Botão 📱 AR</span>
                </li>
              </ul>
            </div>

            {/* Desktop Controls */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h3 className="font-bold text-base text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">💻</span> Controlos PC
              </h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong className="text-white">Mover:</strong> WASD ou setas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong className="text-white">Interagir:</strong> Clica nos markers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong className="text-white">Atacar:</strong> Clica nos zombies</span>
                </li>
              </ul>
            </div>

            {/* Game Objectives */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h3 className="font-bold text-base text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Objetivos
              </h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">🏛️</span>
                  <span>Descobre locais históricos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">🧟</span>
                  <span>Elimina zombies para ganhar pontos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">🎒</span>
                  <span>Apanha power-ups e usa itens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">📜</span>
                  <span>Completa missões diárias</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400">👹</span>
                  <span>Derrota bosses históricos</span>
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-500/30">
              <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
                <span className="text-2xl">💡</span> Dicas
              </h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Usa o modo AR para uma experiência imersiva</li>
                <li>• Aproxima-te dos locais para os descobrir</li>
                <li>• Power-ups dão vantagens temporárias</li>
                <li>• Bosses aparecem periodicamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
