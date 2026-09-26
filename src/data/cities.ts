import { HistoricalEvent } from '../types';
import { StreetNode, StreetEdge } from './streetGraph';
import { historicalEvents as evoraEvents } from './evoraHistory';
import { streetNodes as evoraNodes, streetEdges as evoraEdges } from './streetGraph';
import { lisboaEvents, lisboaStreetNodes, lisboaStreetEdges } from './lisboa';
import { portoEvents, portoStreetNodes, portoStreetEdges } from './porto';

export type CityId = 'evora' | 'lisboa' | 'porto';

export interface CityConfig {
  id: CityId;
  name: string;
  description: string;
  emoji: string;
  centerLat: number;
  centerLng: number;
  defaultZoom: number;
  events: HistoricalEvent[];
  streetNodes: StreetNode[];
  streetEdges: StreetEdge[];
}

export const cities: Record<CityId, CityConfig> = {
  evora: {
    id: 'evora',
    name: 'Évora',
    description: 'Cidade museu do Alentejo, património mundial da UNESCO',
    emoji: '🏛️',
    centerLat: 38.5702,
    centerLng: -7.9095,
    defaultZoom: 17,
    events: evoraEvents,
    streetNodes: evoraNodes,
    streetEdges: evoraEdges,
  },
  lisboa: {
    id: 'lisboa',
    name: 'Lisboa',
    description: 'Capital de Portugal, cidade dos sete colinas',
    emoji: '🚢',
    centerLat: 38.7110,
    centerLng: -9.1380,
    defaultZoom: 16,
    events: lisboaEvents,
    streetNodes: lisboaStreetNodes,
    streetEdges: lisboaStreetEdges,
  },
  porto: {
    id: 'porto',
    name: 'Porto',
    description: 'Cidade invicta, capital do Vinho do Porto',
    emoji: '🍷',
    centerLat: 41.1430,
    centerLng: -8.6130,
    defaultZoom: 16,
    events: portoEvents,
    streetNodes: portoStreetNodes,
    streetEdges: portoStreetEdges,
  },
};

export function getCity(id: CityId): CityConfig {
  return cities[id];
}

export function getAllCities(): CityConfig[] {
  return Object.values(cities);
}
