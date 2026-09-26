import { Polyline } from 'react-leaflet';
import { streetNodes, streetEdges } from '../data/streetGraph';

export default function StreetOverlay() {
  const nodeMap = new Map(streetNodes.map((n) => [n.id, n]));

  return (
    <>
      {streetEdges.map((edge, idx) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;

        return (
          <Polyline
            key={`street-${idx}`}
            positions={[
              [from.lat, from.lng],
              [to.lat, to.lng],
            ]}
            pathOptions={{
              color: '#6B7280',
              weight: 4,
              opacity: 0.5,
            }}
          />
        );
      })}
    </>
  );
}
