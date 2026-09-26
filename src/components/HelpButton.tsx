import { useState } from 'react';

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 z-[1000] w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-lg hover:bg-white transition-all active:scale-95"
      >
        ❓
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Help Panel */}
      <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto pointer-events-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">📖 Ajuda</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-95"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Mobile Controls */}
            <div className="bg-blue-50 rounded-xl p-3">
              <h3 className="font-bold text-sm text-blue-900 mb-2">📱 Controlos Mobile</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• <strong>Mover:</strong> Anda fisicamente (GPS)</li>
                <li>• <strong>Interagir:</strong> Toca nos markers</li>
                <li>• <strong>Atacar:</strong> Toca nos zombies</li>
                <li>• <strong>AR:</strong> Botão 📱 AR</li>
              </ul>
            </div>

            {/* Desktop Controls */}
            <div className="bg-green-50 rounded-xl p-3">
              <h3 className="font-bold text-sm text-green-900 mb-2">💻 Controlos PC</h3>
              <ul className="text-xs text-green-800 space-y-1">
                <li>• <strong>Mover:</strong> WASD ou setas</li>
                <li>• <strong>Interagir:</strong> Clica nos markers</li>
                <li>• <strong>Atacar:</strong> Clica nos zombies</li>
                <li>• <strong>AR:</strong> Botão 📱 AR</li>
              </ul>
            </div>

            {/* Game Elements */}
            <div className="bg-purple-50 rounded-xl p-3">
              <h3 className="font-bold text-sm text-purple-900 mb-2">🎮 Elementos do Jogo</h3>
              <div className="text-xs text-purple-800 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🗺️</span>
                  <div>
                    <strong>Mapa:</strong> Mostra a cidade de Évora com locais históricos
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">🧟</span>
                  <div>
                    <strong>Zombies:</strong> Inimigos que te perseguem. Elimina-os para ganhar pontos!
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">📜</span>
                  <div>
                    <strong>Locais Históricos:</strong> Descobre a história de Évora
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">🎒</span>
                  <div>
                    <strong>Itens:</strong> Power-ups como escudos, poções e armas
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">👹</span>
                  <div>
                    <strong>Bosses:</strong> Inimigos poderosos com recompensas especiais
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 rounded-xl p-3">
              <h3 className="font-bold text-sm text-yellow-900 mb-2">💡 Dicas</h3>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• Explora todos os locais históricos para ganhar pontos</li>
                <li>• Usa power-ups estrategicamente</li>
                <li>• Completa missões para recompensas extras</li>
                <li>• O modo AR mostra zombies e locais em realidade aumentada</li>
                <li>• Os zombies movem-se pelas ruas, não em linha reta!</li>
              </ul>
            </div>

            {/* AR Mode */}
            <div className="bg-pink-50 rounded-xl p-3">
              <h3 className="font-bold text-sm text-pink-900 mb-2">📱 Modo AR</h3>
              <ul className="text-xs text-pink-800 space-y-1">
                <li>• Permite acesso à câmara e orientação</li>
                <li>• Move o telemóvel para ver zombies e locais</li>
                <li>• Toca nos zombies para os eliminar</li>
                <li>• Aproxima-te dos locais para os descobrir</li>
                <li>• Clica em "Sair AR" para voltar ao mapa</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-3xl border-t">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95 shadow-lg"
            >
              Entendido! ✓
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
