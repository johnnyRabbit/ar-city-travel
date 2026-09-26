import { getActiveSeasonalEvent } from '../data/seasonalEvents';

export default function SeasonalEventBanner() {
  const activeEvent = getActiveSeasonalEvent();

  if (!activeEvent) return null;

  return (
    <div className="absolute top-32 left-1/2 -translate-x-1/2 z-[999] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-pulse">
      <span className="text-xl">{activeEvent.emoji}</span>
      <span className="text-xs font-bold">{activeEvent.name}</span>
      <span className="text-xs opacity-80">Ativo!</span>
    </div>
  );
}
