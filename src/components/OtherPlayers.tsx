import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';

interface SimulatedPlayer {
  id: string;
  name: string;
  lat: number;
  lng: number;
  avatar: string;
  level: number;
  points: number;
  direction: number;
  lastMove: number;
  message?: string;
}

const initialPlayers: SimulatedPlayer[] = [
  { id: 'bot-1', name: 'Maria_HP', lat: 38.5710, lng: -7.9090, avatar: '👩', level: 5, points: 450, direction: 0, lastMove: Date.now() },
  { id: 'bot-2', name: 'João_Evora', lat: 38.5695, lng: -7.9110, avatar: '👨', level: 3, points: 280, direction: Math.PI / 2, lastMove: Date.now() },
  { id: 'bot-3', name: 'Ana_Hist', lat: 38.5720, lng: -7.9070, avatar: '👧', level: 7, points: 620, direction: Math.PI, lastMove: Date.now() },
  { id: 'bot-4', name: 'Pedro_Rom', lat: 38.5700, lng: -7.9120, avatar: '🧑', level: 4, points: 350, direction: Math.PI * 1.5, lastMove: Date.now() },
];

const chatMessages = [
  'Cuidado com os zombies perto da Sé!',
  'Acabei de descobrir o Templo Romano!',
  'Alguém já foi ao Aqueduto?',
  'Encontrei um item lendário!',
  'Os zombies estão lentos agora!',
  'Vem para a Praça do Giraldo!',
  'Preciso de ajuda, estou cercado!',
  'Que cidade vamos explorar a seguir?',
  'Porto a seguir? 🍷',
  'Já descobri 10 locais!',
];

export function useSimulatedPlayers() {
  const [players, setPlayers] = useState<SimulatedPlayer[]>(initialPlayers);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((prev) =>
        prev.map((p) => {
          // Random direction change
          if (Math.random() < 0.1) {
            p.direction += (Math.random() - 0.5) * 1;
          }
          // Move
          const newLat = p.lat + Math.cos(p.direction) * 0.00008;
          const newLng = p.lng + Math.sin(p.direction) * 0.00008;
          // Random message
          if (Math.random() < 0.005) {
            p.message = chatMessages[Math.floor(Math.random() * chatMessages.length)];
            setTimeout(() => {
              setPlayers((curr) =>
                curr.map((pl) => (pl.id === p.id ? { ...pl, message: undefined } : pl))
              );
            }, 5000);
          }
          return { ...p, lat: newLat, lng: newLng, lastMove: Date.now() };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return players;
}

export default function OtherPlayers() {
  const players = useSimulatedPlayers();

  const createPlayerIcon = (player: SimulatedPlayer) => {
    return L.divIcon({
      html: `<div style="
        position: relative;
        font-size: 24px;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      ">
        ${player.avatar}
        <div style="
          position: absolute;
          bottom: -4px;
          right: -4px;
          background: #10B981;
          color: white;
          font-size: 8px;
          font-weight: bold;
          padding: 1px 3px;
          border-radius: 4px;
        ">${player.level}</div>
      </div>`,
      className: 'other-player-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  return (
    <>
      {players.map((player) => (
        <Marker
          key={player.id}
          position={[player.lat, player.lng]}
          icon={createPlayerIcon(player)}
        >
          <Popup>
            <div className="text-center min-w-[120px]">
              <span className="text-2xl">{player.avatar}</span>
              <p className="font-bold text-sm">{player.name}</p>
              <p className="text-xs text-gray-500">Nível {player.level}</p>
              <p className="text-xs text-purple-600 font-bold">⭐ {player.points} pts</p>
              {player.message && (
                <div className="mt-2 bg-blue-50 rounded p-1">
                  <p className="text-xs italic">"{player.message}"</p>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
