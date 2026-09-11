import { useInventoryStore } from '../store/inventoryStore';

export default function ActiveEffects() {
  const { activeEffects, shieldHP } = useInventoryStore();

  if (activeEffects.length === 0 && shieldHP === 0) return null;

  return (
    <div className="absolute top-40 left-4 z-[1000] flex flex-col gap-1 max-w-[200px]">
      {/* Shield */}
      {shieldHP > 0 && (
        <div className="bg-blue-500/90 backdrop-blur-sm rounded-lg px-3 py-2 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛡️</span>
            <div className="flex-1">
              <p className="text-xs font-bold">Escudo</p>
              <div className="w-full bg-blue-700 rounded-full h-1.5 mt-0.5">
                <div
                  className="h-1.5 rounded-full bg-blue-200 transition-all"
                  style={{ width: `${Math.min(100, (shieldHP / 100) * 100)}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-bold">{Math.round(shieldHP)}</span>
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
            className="bg-purple-500/90 backdrop-blur-sm rounded-lg px-3 py-2 text-white shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{effect.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{effect.name}</p>
                <div className="w-full bg-purple-700 rounded-full h-1 mt-0.5">
                  <div
                    className="h-1 rounded-full bg-purple-200 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold">{seconds}s</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
