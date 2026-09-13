import { useGameStore } from '../store/gameStore';
import { eras } from '../data/evoraHistory';
import { useState } from 'react';

export default function TimeSelector() {
  const { selectedEra, setSelectedEra } = useGameStore();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Compact Era Selector */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-14 left-1/2 -translate-x-1/2 z-[999] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 flex items-center gap-2"
      >
        <span className="text-sm">
          {selectedEra === 'all' ? '🌍' : eras.find(e => e.id === selectedEra)?.emoji}
        </span>
        <span className="text-xs font-medium text-gray-700">
          {selectedEra === 'all' ? 'Todas as Eras' : eras.find(e => e.id === selectedEra)?.name}
        </span>
        <span className="text-xs text-gray-500">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded Era Panel */}
      {isExpanded && (
        <>
          <div 
            className="fixed inset-0 z-[998]" 
            onClick={() => setIsExpanded(false)}
          />
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[999] bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl p-3 max-w-[90vw]">
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => { setSelectedEra('all'); setIsExpanded(false); }}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedEra === 'all' 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🌍 Todas
              </button>
              {eras.map((era) => (
                <button 
                  key={era.id} 
                  onClick={() => { setSelectedEra(era.id); setIsExpanded(false); }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedEra === era.id 
                      ? 'text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={selectedEra === era.id ? { backgroundColor: era.color } : {}}
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
