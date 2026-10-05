import { getActiveSeasonalEvent } from '../data/seasonalEvents';

export default function SeasonalEventBanner() {
  const activeEvent = getActiveSeasonalEvent();

  if (!activeEvent) return null;

  return (
    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center border border-purple-500/30 relative animate-pulse">
      <span className="text-xl">{activeEvent.emoji}</span>
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-ping" />
    </div>
  );
}
