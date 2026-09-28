import { getActiveSeasonalEvent } from '../data/seasonalEvents';

export default function SeasonalEventBanner() {
  const activeEvent = getActiveSeasonalEvent();

  if (!activeEvent) return null;

  return (
    <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center border-2 border-purple-500/30 relative animate-pulse">
      <span className="text-2xl">{activeEvent.emoji}</span>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
    </div>
  );
}
