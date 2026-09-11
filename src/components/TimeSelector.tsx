import { useGameStore } from '../store/gameStore';
import { eras } from '../data/evoraHistory';

export default function TimeSelector() {
  const { selectedEra, setSelectedEra } = useGameStore();
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-2 flex gap-1 overflow-x-auto max-w-[90vw]">
      <button onClick={() => setSelectedEra('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedEra === 'all' ? 'bg-gray-800 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>🌍 Todas</button>
      {eras.map((era) => (
        <button key={era.id} onClick={() => setSelectedEra(era.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedEra === era.id ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} style={selectedEra === era.id ? { backgroundColor: era.color } : {}}>
          {era.emoji} {era.name}
        </button>
      ))}
    </div>
  );
}
