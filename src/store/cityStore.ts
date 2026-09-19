import { create } from 'zustand';
import { CityId, CityConfig, cities } from '../data/cities';

interface CityStore {
  currentCity: CityId;
  setCity: (cityId: CityId) => void;
  getCurrentCity: () => CityConfig;
}

export const useCityStore = create<CityStore>((set, get) => ({
  currentCity: 'evora',
  
  setCity: (cityId: CityId) => {
    set({ currentCity: cityId });
  },
  
  getCurrentCity: () => {
    return cities[get().currentCity];
  },
}));
