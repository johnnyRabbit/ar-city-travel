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
          // Build path from current position through remaining nodes
          const pathCoords: [number, number][] = [[zombie.lat, zombie.lng]];

          // Add all remaining nodes in the path
          for (let i = zombie.currentNodeIndex + 1; i < zombie.path.length; i++) {
            const coords = getNodeCoords(zombie.path[i]);
            if (coords) pathCoords.push([coords.lat, coords.lng]);
          }

          if (pathCoords.length < 2) return null;

          // Debug log
          console.log(`[ZombiePath] ${zombie.id}: ${pathCoords.length} points, path=[${zombie.path.join(', ')}]`);

          return (
            <Polyline
              key={`zombie-path-${zombie.id}`}
              positions={pathCoords}
              pathOptions={{
                color: '#EF4444',
                weight: 3,
                opacity: 0.6,
                dashArray: '5, 10',
              }}
            />
          );
        })}
    </>
  );
}
