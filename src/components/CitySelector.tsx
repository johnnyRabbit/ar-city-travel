import { useState } from 'react';
import { useCityStore } from '../store/cityStore';
import { useGameStore } from '../store/gameStore';
import { getAllCities } from '../data/cities';

export default function CitySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentCity, setCity } = useCityStore();
  const { reloadCityData } = useGameStore();
  const cities = getAllCities();
  const currentCityConfig = cities.find(c => c.id === currentCity);

  const handleCityChange = (cityId: string) => {
    setCity(cityId as any);
    reloadCityData();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* City Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center hover:bg-black/60 transition-all active:scale-95 border border-white/20"
        title="Escolher Cidade"
      >
        <span className="text-xl">{currentCityConfig?.emoji}</span>
      </button>

      {/* City Selection Modal */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden pointer-events-auto border-2 border-white/10">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">🏙️ Escolher Cidade</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-95 text-xl"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-white/80 text-sm mt-2">Explora diferentes cidades históricas</p>
              </div>

              {/* Cities List */}
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {cities.map((city) => {
                  const isCurrent = city.id === currentCity;
                  
                  return (
                    <button
                      key={city.id}
                      onClick={() => handleCityChange(city.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                        isCurrent
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-5xl">{city.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg">{city.name}</h3>
                          <p className="text-gray-400 text-sm">{city.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-500">
                              📜 {city.events.length} locais
                            </span>
                            <span className="text-xs text-gray-500">
                              ⏰ {new Set(city.events.map(e => e.era)).size} eras
                            </span>
                          </div>
                        </div>
                        {isCurrent && (
                          <span className="text-2xl">✅</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 bg-white/5 border-t border-white/10">
                <p className="text-xs text-gray-500 text-center">
                  💡 Dica: Cada cidade tem locais históricos únicos para descobrir!
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
