import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function ARView() {
  const { arMode, zombies, player, killZombie } = useGameStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!arMode) {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        setStreamActive(false);
      }
      return;
    }

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } });
        if (videoRef.current) { videoRef.current.srcObject = stream; setStreamActive(true); }
      } catch (err) {
        setError('Não foi possível aceder à câmara. Verifica as permissões.');
        console.error('Camera error:', err);
      }
    }
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [arMode]);

  if (!arMode) return null;

  const getZombieScreenPosition = (zombieLat: number, zombieLng: number) => {
    const dLat = zombieLat - player.lat;
    const dLng = zombieLng - player.lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    const screenX = 50 + (dLng / 0.01) * 30;
    const screenY = 50 - (dLat / 0.01) * 30;
    const scale = Math.max(0.5, 2 - dist * 100);
    return { x: screenX, y: screenY, scale };
  };

  return (
    <div className="absolute inset-0 z-[1500] bg-black">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      <div className="absolute inset-0 pointer-events-none">
        {zombies.filter((z) => z.active).map((zombie) => {
          const pos = getZombieScreenPosition(zombie.lat, zombie.lng);
          return (
            <div key={zombie.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%, -50%) scale(${pos.scale})` }} onClick={() => killZombie(zombie.id)}>
              <div className="relative">
                <span className="text-5xl animate-bounce drop-shadow-lg">{zombie.emoji}</span>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 bg-gray-800/70 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-red-500" style={{ width: `${(zombie.health / zombie.maxHealth) * 100}%` }} /></div>
                <p className="absolute -top-5 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold whitespace-nowrap bg-black/50 px-1 rounded">{zombie.name}</p>
              </div>
            </div>
          );
        })}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center"><div className="w-1 h-1 bg-white/70 rounded-full" /></div></div>
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white"><p className="text-xs font-medium">📱 Modo AR Ativo</p><p className="text-[10px] text-gray-300">Toca nos zombies para eliminar</p></div>
        {error && <div className="absolute inset-0 flex items-center justify-center bg-black/80"><div className="text-center text-white p-6"><span className="text-4xl mb-4 block">📷</span><p className="text-sm">{error}</p></div></div>}
        {!streamActive && !error && <div className="absolute inset-0 flex items-center justify-center"><p className="text-white text-sm bg-black/60 px-4 py-2 rounded-lg">A carregar câmara...</p></div>}
      </div>
    </div>
  );
}
