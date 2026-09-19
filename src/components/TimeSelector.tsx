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
    <>
      {/* Botão Compacto */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-14 left-1/2 -translate-x-1/2 z-[999] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 flex items-center gap-2 hover:scale-105 transition-transform active:scale-95"
      >
        <span className="text-sm">{currentEra.emoji}</span>
        <span className="text-xs font-medium text-gray-700">{currentEra.name}</span>
        <span className="text-xs text-gray-500">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Painel Expandido */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[998]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[999] bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl p-3 max-w-[90vw]">
            <div className="grid grid-cols-2 gap-2">
              {eras.map((era) => (
                <button
                  key={era.id}
                  onClick={() => {
                    setSelectedEra(era.id);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedEra === era.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {era.emoji} {era.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
