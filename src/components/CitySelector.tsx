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
    <>
      {/* City Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-20 left-2 z-[999] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 flex items-center gap-2 hover:scale-105 transition-transform active:scale-95"
      >
        <span className="text-xl">{currentCityConfig?.emoji}</span>
        <span className="text-xs font-medium text-gray-700">{currentCityConfig?.name}</span>
        <span className="text-xs text-gray-500">▼</span>
      </button>

      {/* City Selection Modal */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">🏙️ Escolher Cidade</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-95"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Cities List */}
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCityChange(city.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all active:scale-95 ${
                      city.id === currentCity
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-4xl">{city.emoji}</span>
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-gray-800">{city.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">{city.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>📜 {city.events.length} locais</span>
                          <span>•</span>
                          <span>🗺️ {city.streetNodes.length} ruas</span>
                        </div>
                      </div>
                      {city.id === currentCity && (
                        <span className="text-purple-600 text-xl">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 p-4 border-t">
                <p className="text-xs text-gray-500 text-center">
                  Mais cidades em breve: Coimbra, Braga, Faro...
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
