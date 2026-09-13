import { useInventoryStore } from '../store/inventoryStore';
import { useState } from 'react';

export default function ActiveEffects() {
  const { activeEffects, shieldHP } = useInventoryStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasEffects = activeEffects.length > 0 || shieldHP > 0;
  if (!hasEffects) return null;

  const totalEffects = activeEffects.length + (shieldHP > 0 ? 1 : 0);

  return (
    <>
      {/* Compact Effects Indicator */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute bottom-44 right-28 z-[999] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-2 py-1.5 flex items-center gap-1"
      >
        <span className="text-sm">✨</span>
        <span className="text-xs font-bold text-purple-600">{totalEffects}</span>
        <span className="text-xs text-gray-500">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded Effects Panel */}
      {isExpanded && (
        <>
          <div 
            className="fixed inset-0 z-[998]" 
            onClick={() => setIsExpanded(false)}
          />
          <div className="absolute top-32 right-2 z-[999] bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl p-3 max-w-[250px] max-h-[300px] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs text-gray-800">Efeitos Ativos</h3>
              <button onClick={() => setIsExpanded(false)} className="text-gray-500 hover:text-gray-700 text-lg">✕</button>
            </div>
            
            <div className="space-y-2">
              {/* Shield */}
              {shieldHP > 0 && (
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🛡️</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-blue-800">Escudo</p>
                      <div className="w-full bg-blue-200 rounded-full h-1.5 mt-0.5">
                        <div
                          className="h-1.5 rounded-full bg-blue-500 transition-all"
                          style={{ width: `${Math.min(100, (shieldHP / 100) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-800">{Math.round(shieldHP)}</span>
                  </div>
                </div>
              )}

              {/* Active Effects */}
              {activeEffects.map((effect) => {
                const progress = (effect.remainingMs / effect.totalMs) * 100;
                const seconds = Math.ceil(effect.remainingMs / 1000);

                return (
                  <div
                    key={effect.id}
                    className="bg-purple-50 rounded-lg p-2 border border-purple-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{effect.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-purple-800 truncate">{effect.name}</p>
                        <div className="w-full bg-purple-200 rounded-full h-1.5 mt-0.5">
                          <div
                            className="h-1.5 rounded-full bg-purple-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-purple-800">{seconds}s</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
