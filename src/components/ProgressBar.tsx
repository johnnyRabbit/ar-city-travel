import { useGameStore } from '../store/gameStore';

export default function ProgressBar() {
  const { historicalEvents } = useGameStore();

  const totalLocations = historicalEvents.length;
  const discoveredLocations = historicalEvents.filter((e) => e.discovered).length;
  const progress = (discoveredLocations / totalLocations) * 100;

  return (
    <div className="absolute top-14 left-2 right-2 z-[999] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-gray-700">
          📜 {discoveredLocations}/{totalLocations} locais descobertos
        </span>
        <span className="text-xs font-bold text-purple-600">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
