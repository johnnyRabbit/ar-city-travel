import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Era } from '../types';

const eras: { id: Era | 'all'; name: string; emoji: string }[] = [
  { id: 'all', name: 'Todas', emoji: '🌍' },
  { id: 'romano', name: 'Romano', emoji: '🏛️' },
  { id: 'medieval', name: 'Medieval', emoji: '🏰' },
  { id: 'renascimento', name: 'Renascimento', emoji: '🎨' },
  { id: 'moderno', name: 'Moderno', emoji: '🏭' },
];

export default function TimeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedEra, setSelectedEra } = useGameStore();

  const currentEra = eras.find(e => e.id === selectedEra) || eras[0];

  return (
    <div className="relative">
      {/* Botão Compacto */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 bg-black/40 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center hover:bg-black/60 transition-all active:scale-95 border border-white/20"
        title="Selecionar Era"
      >
        <span className="text-xl">{currentEra.emoji}</span>
      </button>

      {/* Painel Expandido */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[998]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-16 top-0 z-[999] bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 border-2 border-white/20">
            <div className="flex flex-col gap-2">
              {eras.map((era) => (
                <button
                  key={era.id}
                  onClick={() => {
                    setSelectedEra(era.id);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedEra === era.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl">{era.emoji}</span>
                  <span>{era.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
