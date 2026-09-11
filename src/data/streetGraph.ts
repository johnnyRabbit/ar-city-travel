// Grafo de ruas de Évora — Rede de nós (interseções) e arestas (ruas)

export interface StreetNode {
  id: string;
  lat: number;
  lng: number;
  name?: string;
}

export interface StreetEdge {
  from: string;
  to: string;
  name?: string;
}

export const streetNodes: StreetNode[] = [
  // Centro — Praça do Giraldo
  { id: 'n01', lat: 38.5702, lng: -7.9100, name: 'Praça do Giraldo' },
  { id: 'n02', lat: 38.5705, lng: -7.9095, name: 'Giraldo Norte' },
  { id: 'n03', lat: 38.5699, lng: -7.9105, name: 'Giraldo Sul' },
  { id: 'n04', lat: 38.5702, lng: -7.9108, name: 'Giraldo Oeste' },
  { id: 'n05', lat: 38.5702, lng: -7.9092, name: 'Giraldo Este' },
  // Rua de Avis
  { id: 'n06', lat: 38.5708, lng: -7.9095, name: 'R. Avis 1' },
  { id: 'n07', lat: 38.5712, lng: -7.9092, name: 'R. Avis 2' },
  { id: 'n08', lat: 38.5716, lng: -7.9088, name: 'R. Avis 3' },
  // Rua Mouzinho da Silveira
  { id: 'n09', lat: 38.5705, lng: -7.9108, name: 'R. Mouzinho 1' },
  { id: 'n10', lat: 38.5708, lng: -7.9112, name: 'R. Mouzinho 2' },
  { id: 'n11', lat: 38.5712, lng: -7.9115, name: 'R. Mouzinho 3' },
  // Rua de São Miguel
  { id: 'n12', lat: 38.5698, lng: -7.9095, name: 'R. S. Miguel 1' },
  { id: 'n13', lat: 38.5694, lng: -7.9092, name: 'R. S. Miguel 2' },
  { id: 'n14', lat: 38.5690, lng: -7.9088, name: 'R. S. Miguel 3' },
  // Rua do Salvador
  { id: 'n15', lat: 38.5698, lng: -7.9108, name: 'R. Salvador 1' },
  { id: 'n16', lat: 38.5694, lng: -7.9112, name: 'R. Salvador 2' },
  { id: 'n17', lat: 38.5690, lng: -7.9115, name: 'R. Salvador 3' },
  // Zona da Sé
  { id: 'n18', lat: 38.5705, lng: -7.9102, name: 'Largo da Sé' },
  { id: 'n19', lat: 38.5708, lng: -7.9105, name: 'R. da Sé' },
  // Templo Romano
  { id: 'n20', lat: 38.5714, lng: -7.9073, name: 'Largo do Templo' },
  { id: 'n21', lat: 38.5712, lng: -7.9078, name: 'R. Templo 1' },
  { id: 'n22', lat: 38.5710, lng: -7.9082, name: 'R. Templo 2' },
  // São Francisco
  { id: 'n23', lat: 38.5698, lng: -7.9115, name: 'Largo S. Francisco' },
  { id: 'n24', lat: 38.5695, lng: -7.9118, name: 'R. S. Francisco 1' },
  { id: 'n25', lat: 38.5692, lng: -7.9122, name: 'R. S. Francisco 2' },
  // Rua da República
  { id: 'n26', lat: 38.5700, lng: -7.9090, name: 'R. República 1' },
  { id: 'n27', lat: 38.5696, lng: -7.9085, name: 'R. República 2' },
  { id: 'n28', lat: 38.5692, lng: -7.9080, name: 'R. República 3' },
  // Universidade
  { id: 'n29', lat: 38.5700, lng: -7.9110, name: 'Largo Universidade' },
  { id: 'n30', lat: 38.5697, lng: -7.9108, name: 'R. Universidade 1' },
  { id: 'n31', lat: 38.5694, lng: -7.9105, name: 'R. Universidade 2' },
  // Aqueduto
  { id: 'n32', lat: 38.5715, lng: -7.9050, name: 'Aqueduto 1' },
  { id: 'n33', lat: 38.5718, lng: -7.9055, name: 'Aqueduto 2' },
  { id: 'n34', lat: 38.5720, lng: -7.9060, name: 'Aqueduto 3' },
  { id: 'n35', lat: 38.5718, lng: -7.9068, name: 'R. Aqueduto 4' },
  // Portas / Muralhas
  { id: 'n36', lat: 38.5707, lng: -7.9095, name: 'Porta de Avis' },
  { id: 'n37', lat: 38.5700, lng: -7.9115, name: 'Porta S. Francisco' },
  { id: 'n38', lat: 38.5695, lng: -7.9070, name: 'Porta República' },
  { id: 'n39', lat: 38.5710, lng: -7.9120, name: 'Porta Norte' },
  // Ruas adicionais
  { id: 'n40', lat: 38.5706, lng: -7.9085, name: 'R. do Moinho' },
  { id: 'n41', lat: 38.5710, lng: -7.9085, name: 'R. das Fontes' },
  { id: 'n42', lat: 38.5698, lng: -7.9098, name: 'Trav. do Ouro' },
  { id: 'n43', lat: 38.5703, lng: -7.9105, name: 'R. dos Mercadores' },
  { id: 'n44', lat: 38.5706, lng: -7.9100, name: 'R. do Cano' },
  { id: 'n45', lat: 38.5696, lng: -7.9100, name: 'R. da Moeda' },
];

export const streetEdges: StreetEdge[] = [
  // Praça do Giraldo
  { from: 'n01', to: 'n02' }, { from: 'n01', to: 'n03' },
  { from: 'n01', to: 'n04' }, { from: 'n01', to: 'n05' },
  { from: 'n02', to: 'n05' }, { from: 'n03', to: 'n04' },
  { from: 'n02', to: 'n44' }, { from: 'n44', to: 'n04' },
  { from: 'n44', to: 'n05' }, { from: 'n03', to: 'n42' },
  { from: 'n42', to: 'n04' }, { from: 'n42', to: 'n45' },
  { from: 'n45', to: 'n03' },
  // Rua de Avis
  { from: 'n02', to: 'n06' }, { from: 'n06', to: 'n07' },
  { from: 'n07', to: 'n08' }, { from: 'n08', to: 'n36' },
  { from: 'n36', to: 'n40' }, { from: 'n40', to: 'n41' },
  { from: 'n41', to: 'n22' },
  // R. Mouzinho
  { from: 'n04', to: 'n09' }, { from: 'n09', to: 'n10' },
  { from: 'n10', to: 'n11' }, { from: 'n11', to: 'n39' },
  // R. São Miguel
  { from: 'n03', to: 'n12' }, { from: 'n12', to: 'n13' },
  { from: 'n13', to: 'n14' },
  // R. Salvador
  { from: 'n04', to: 'n15' }, { from: 'n15', to: 'n16' },
  { from: 'n16', to: 'n17' },
  // Zona da Sé
  { from: 'n02', to: 'n18' }, { from: 'n18', to: 'n19' },
  { from: 'n19', to: 'n10' }, { from: 'n18', to: 'n44' },
  // Templo
  { from: 'n05', to: 'n21' }, { from: 'n21', to: 'n22' },
  { from: 'n22', to: 'n20' }, { from: 'n20', to: 'n41' },
  // São Francisco
  { from: 'n04', to: 'n23' }, { from: 'n23', to: 'n24' },
  { from: 'n24', to: 'n25' }, { from: 'n17', to: 'n23' },
  { from: 'n37', to: 'n23' },
  // R. República
  { from: 'n05', to: 'n26' }, { from: 'n26', to: 'n27' },
  { from: 'n27', to: 'n28' }, { from: 'n28', to: 'n38' },
  { from: 'n14', to: 'n27' },
  // Universidade
  { from: 'n04', to: 'n29' }, { from: 'n29', to: 'n30' },
  { from: 'n30', to: 'n31' }, { from: 'n31', to: 'n45' },
  { from: 'n15', to: 'n29' },
  // Aqueduto
  { from: 'n20', to: 'n32' }, { from: 'n32', to: 'n33' },
  { from: 'n33', to: 'n34' }, { from: 'n34', to: 'n35' },
  { from: 'n35', to: 'n08' }, { from: 'n36', to: 'n35' },
  // Conexões transversais
  { from: 'n06', to: 'n44' }, { from: 'n07', to: 'n41' },
  { from: 'n12', to: 'n42' }, { from: 'n13', to: 'n45' },
  { from: 'n16', to: 'n31' }, { from: 'n10', to: 'n19' },
  { from: 'n26', to: 'n40' }, { from: 'n08', to: 'n20' },
  { from: 'n11', to: 'n39' }, { from: 'n37', to: 'n17' },
  { from: 'n38', to: 'n14' }, { from: 'n09', to: 'n18' },
  { from: 'n21', to: 'n40' },
];

export function buildStreetGraph(): Map<string, { nodeId: string; distance: number }[]> {
  const graph = new Map<string, { nodeId: string; distance: number }[]>();
  const nodeMap = new Map(streetNodes.map((n) => [n.id, n]));

  streetNodes.forEach((node) => graph.set(node.id, []));

  streetEdges.forEach((edge) => {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (!fromNode || !toNode) return;
    const distance = calculateDistance(fromNode.lat, fromNode.lng, toNode.lat, toNode.lng);
    graph.get(edge.from)?.push({ nodeId: edge.to, distance });
    graph.get(edge.to)?.push({ nodeId: edge.from, distance });
  });

  return graph;
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function heuristic(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return calculateDistance(lat1, lng1, lat2, lng2);
}

export function findPath(
  graph: Map<string, { nodeId: string; distance: number }[]>,
  startId: string,
  endId: string
): string[] {
  const nodeMap = new Map(streetNodes.map((n) => [n.id, n]));
  const startNode = nodeMap.get(startId);
  const endNode = nodeMap.get(endId);
  if (!startNode || !endNode) return [startId];

  const openSet = new Set<string>([startId]);
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  streetNodes.forEach((n) => {
    gScore.set(n.id, Infinity);
    fScore.set(n.id, Infinity);
  });

  gScore.set(startId, 0);
  fScore.set(startId, heuristic(startNode.lat, startNode.lng, endNode.lat, endNode.lng));

  while (openSet.size > 0) {
    let current: string | null = null;
    let lowestF = Infinity;
    for (const nodeId of openSet) {
      const f = fScore.get(nodeId) || Infinity;
      if (f < lowestF) { lowestF = f; current = nodeId; }
    }
    if (current === null || current === endId) break;
    openSet.delete(current);

    const neighbors = graph.get(current) || [];
    for (const neighbor of neighbors) {
      const tentativeG = (gScore.get(current) || Infinity) + neighbor.distance;
      if (tentativeG < (gScore.get(neighbor.nodeId) || Infinity)) {
        cameFrom.set(neighbor.nodeId, current);
        gScore.set(neighbor.nodeId, tentativeG);
        const neighborNode = nodeMap.get(neighbor.nodeId);
        if (neighborNode) {
          fScore.set(neighbor.nodeId, tentativeG + heuristic(neighborNode.lat, neighborNode.lng, endNode.lat, endNode.lng));
        }
        openSet.add(neighbor.nodeId);
      }
    }
  }

  const path: string[] = [];
  let current: string | undefined = endId;
  while (current) { path.unshift(current); current = cameFrom.get(current); }
  return path[0] === startId ? path : [startId];
}

export function findNearestNode(lat: number, lng: number): string {
  let nearestId = streetNodes[0].id;
  let nearestDist = Infinity;
  for (const node of streetNodes) {
    const dist = calculateDistance(lat, lng, node.lat, node.lng);
    if (dist < nearestDist) { nearestDist = dist; nearestId = node.id; }
  }
  return nearestId;
}

export function getNodeCoords(nodeId: string): { lat: number; lng: number } | null {
  const node = streetNodes.find((n) => n.id === nodeId);
  return node ? { lat: node.lat, lng: node.lng } : null;
}
