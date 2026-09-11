import { Polyline } from 'react-leaflet';
import { useGameStore } from '../store/gameStore';
import { getNodeCoords } from '../data/streetGraph';

export default function ZombiePaths() {
  const { zombies } = useGameStore();

  return (
    <>
      {zombies
        .filter((z) => z.active && z.path.length > 1)
        .map((zombie) => {
          const pathCoords: [number, number][] = [[zombie.lat, zombie.lng]];

          for (let i = zombie.currentNodeIndex + 1; i < zombie.path.length; i++) {
            const coords = getNodeCoords(zombie.path[i]);
            if (coords) pathCoords.push([coords.lat, coords.lng]);
          }

          if (pathCoords.length < 2) return null;

          return (
            <Polyline
              key={`zombie-path-${zombie.id}`}
              positions={pathCoords}
              pathOptions={{
                color: '#EF4444',
                weight: 2,
                opacity: 0.4,
                dashArray: '4, 8',
              }}
            />
          );
        })}
    </>
  );
}
