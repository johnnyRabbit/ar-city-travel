import { useInventoryStore } from '../store/inventoryStore';
import { useState } from 'react';

export default function ActiveEffects() {
  const { activeEffects, shieldHP } = useInventoryStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasEffects = activeEffects.length > 0 || shieldHP > 0;
  if (!hasEffects) return null;

  const totalEffects = activeEffects.length + (shieldHP > 0 ? 1 : 0);

  return (
    <div className="relative">
      {/* Compact Effects Indicator */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 border-2 border-white/20 relative"
        title="Efeitos Ativos"
      >
        <span className="text-2xl">✨</span>
        <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white/30">
          {totalEffects}
        </span>
      </button>

      {/* Expanded Effects Panel */}
      {isExpanded && (
        <>
          <div 
            className="fixed inset-0 z-[998]" 
            onClick={() => setIsExpanded(false)}
          />
          <div className="absolute bottom-16 right-0 z-[999] bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 w-[280px] max-h-[400px] overflow-y-auto border-2 border-white/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <span>✨</span> Efeitos Ativos
              </h3>
              <button 
                onClick={() => setIsExpanded(false)} 
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Shield */}
              {shieldHP > 0 && (
                <div className="bg-blue-500/10 rounded-xl p-3 border-2 border-blue-500/30">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🛡️</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">Escudo</p>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                          style={{ width: `${Math.min(100, (shieldHP / 100) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-blue-400 mt-1">{Math.round(shieldHP)} HP</p>
                    </div>
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
                    className="bg-purple-500/10 rounded-xl p-3 border-2 border-purple-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{effect.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{effect.name}</p>
                        <div className="w-full bg-white/10 rounded-full h-2 mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-purple-400 mt-1">{seconds}s restantes</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
