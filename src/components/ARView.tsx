import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useQuestStore } from '../store/questStore';

// Avatares diferentes para zombies em AR
const zombieAvatars = ['🧟', '🧟‍♂️', '🧟‍♀️', '💀', '☠️', '👻', '🎃', '👹', '👺', '🤖'];

export default function ARView() {
  const { arMode, zombies, player, killZombie, toggleAR } = useGameStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [zombieAvatarsMap, setZombieAvatarsMap] = useState<Record<string, string>>({});

  // Atribuir avatares únicos a cada zombie
  useEffect(() => {
    const newMap: Record<string, string> = {};
    zombies.forEach((z, idx) => {
      if (!zombieAvatarsMap[z.id]) {
        newMap[z.id] = zombieAvatars[idx % zombieAvatars.length];
      } else {
        newMap[z.id] = zombieAvatarsMap[z.id];
      }
    });
    setZombieAvatarsMap(newMap);
  }, [zombies]);

  // Device orientation para AR
  useEffect(() => {
    if (!arMode) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        alpha: event.alpha || 0, // compass direction (0-360)
        beta: event.beta || 0,   // front-back tilt (-180 to 180)
        gamma: event.gamma || 0, // left-right tilt (-90 to 90)
      });
    };

    // Request permission on iOS
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission().then((permission: string) => {
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      });
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [arMode]);

  // Camera setup
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
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment', 
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          } 
        });
        if (videoRef.current) { 
          videoRef.current.srcObject = stream; 
          setStreamActive(true); 
        }
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

  // Calcular posição do zombie baseado na posição relativa ao jogador E orientação do dispositivo
  const getZombieScreenPosition = (zombieLat: number, zombieLng: number) => {
    const dLat = zombieLat - player.lat;
    const dLng = zombieLng - player.lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    
    // Calcular ângulo do zombie relativamente ao jogador
    const angleToZombie = Math.atan2(dLng, dLat) * (180 / Math.PI);
    
    // Ajustar com a orientação do dispositivo (se disponível)
    const compassAngle = deviceOrientation.alpha || 0;
    const relativeAngle = angleToZombie - compassAngle;
    
    // Mapear para coordenadas do ecrã
    // Ângulo relativo de -90 a 90 graus é visível
    const normalizedAngle = ((relativeAngle + 180) % 360) - 180;
    
    // Mapear ângulo para posição X do ecrã (-60 a 60 graus visíveis)
    const screenX = 50 + (normalizedAngle / 60) * 40;
    
    // Posição Y baseada na distância (mais longe = mais alto)
    const screenY = 60 - (dist * 2000);
    
    // Escala baseada na distância
    const scale = Math.max(0.3, Math.min(2, 2 - dist * 1500));
    
    // Verificar se está visível no ecrã
    const isVisible = screenX >= -10 && screenX <= 110 && screenY >= 0 && screenY <= 100;
    
    return { x: screenX, y: screenY, scale, isVisible, distance: dist };
  };

  const handleKillZombie = (id: string) => {
    const inventoryStore = useInventoryStore.getState();
    const questStore = useQuestStore.getState();
    
    const getDamageMultiplier = () => {
      const { activeEffects } = inventoryStore;
      return activeEffects.reduce((mult: number, e: any) => {
        if (e.effect?.damageMultiplier) return mult * e.effect.damageMultiplier;
        return mult;
      }, 1);
    };

    const onKill = () => {
      questStore.updateQuestProgress('kill-zombies-10', 1);
      questStore.updateQuestProgress('kill-zombies-50', 1);
      questStore.updateQuestProgress('daily-kill-5', 1);
    };

    killZombie(id, getDamageMultiplier, onKill);
  };

  const activeZombies = zombies.filter((z) => z.active);
  const visibleZombies = activeZombies.map(z => ({
    zombie: z,
    pos: getZombieScreenPosition(z.lat, z.lng)
  })).filter(z => z.pos.isVisible);

  return (
    <div className="absolute inset-0 z-[1500] bg-black">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* AR Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Exit AR Button - TOP RIGHT */}
        <div className="absolute top-4 right-4 pointer-events-auto">
          <button
            onClick={toggleAR}
            className="px-4 py-3 bg-red-600/90 backdrop-blur-sm text-white rounded-xl shadow-2xl font-bold text-sm hover:bg-red-700 transition-all flex items-center gap-2 border-2 border-white/30"
          >
            <span className="text-xl">✕</span>
            <span>Sair AR</span>
          </button>
        </div>

        {/* AR Info Panel - TOP LEFT */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-sm rounded-xl px-4 py-3 text-white border border-white/20">
            <p className="text-xs font-bold mb-1">📱 Modo AR Ativo</p>
            <p className="text-[10px] text-gray-300">Aponta a câmara para os zombies</p>
            <p className="text-[10px] text-gray-300 mt-1">🧟 {visibleZombies.length} visíveis</p>
            {deviceOrientation.alpha > 0 && (
              <p className="text-[10px] text-green-400 mt-1">🧭 Orientação ativa</p>
            )}
          </div>
        </div>

        {/* Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-white/40 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white/60 rounded-full" />
            </div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/40" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/40" />
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-3 h-0.5 bg-white/40" />
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-0.5 bg-white/40" />
          </div>
        </div>

        {/* Compass indicator */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-white text-xs flex items-center gap-3">
            <span>🧭</span>
            <span className="font-mono">{Math.round(deviceOrientation.alpha)}°</span>
            <div className="w-px h-4 bg-white/30" />
            <span>🧟 {activeZombies.length}</span>
          </div>
        </div>

        {/* Zombies in AR */}
        {visibleZombies.map(({ zombie, pos }) => {
          const avatar = zombieAvatarsMap[zombie.id] || zombie.emoji;
          const healthPercent = (zombie.health / zombie.maxHealth) * 100;
          const distanceMeters = Math.round(pos.distance * 111000);
          
          return (
            <div
              key={zombie.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-all duration-200"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) scale(${pos.scale})`,
              }}
              onClick={() => handleKillZombie(zombie.id)}
            >
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-pulse" />
                
                {/* Zombie avatar */}
                <div className="relative">
                  <span className="text-6xl drop-shadow-2xl animate-bounce" style={{ animationDuration: '2s' }}>
                    {avatar}
                  </span>
                  
                  {/* Shadow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/40 rounded-full blur-sm" />
                </div>

                {/* Name tag */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg whitespace-nowrap border border-red-500/50">
                  <p className="text-white text-[10px] font-bold">{zombie.name}</p>
                  <p className="text-red-300 text-[8px]">{distanceMeters}m</p>
                </div>

                {/* Health bar */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16">
                  <div className="bg-gray-900/80 rounded-full h-2 border border-gray-700">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${healthPercent}%`,
                        backgroundColor: healthPercent > 50 ? '#10B981' : healthPercent > 25 ? '#F59E0B' : '#EF4444'
                      }}
                    />
                  </div>
                  <p className="text-white text-[8px] text-center mt-0.5 font-mono">
                    {zombie.health}/{zombie.maxHealth}
                  </p>
                </div>

                {/* Attack indicator on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    ⚔️ ATACAR
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Direction indicators for off-screen zombies */}
        {activeZombies.map((zombie) => {
          const pos = getZombieScreenPosition(zombie.lat, zombie.lng);
          if (pos.isVisible) return null;
          
          // Calcular direção para zombie fora do ecrã
          const angle = Math.atan2(pos.x - 50, 50 - pos.y) * (180 / Math.PI);
          
          return (
            <div
              key={`indicator-${zombie.id}`}
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-120px)`,
              }}
            >
              <div className="bg-red-600/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <span>{zombieAvatarsMap[zombie.id] || zombie.emoji}</span>
                <span className="text-[10px]">→</span>
              </div>
            </div>
          );
        })}

        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 pointer-events-auto">
            <div className="text-center text-white p-6 max-w-sm">
              <span className="text-6xl mb-4 block">📷</span>
              <p className="text-lg font-bold mb-2">Câmara não disponível</p>
              <p className="text-sm text-gray-300 mb-4">{error}</p>
              <button
                onClick={toggleAR}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
              >
                ✕ Sair do AR
              </button>
            </div>
          </div>
        )}

        {/* Loading camera */}
        {!streamActive && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center text-white">
              <div className="text-4xl mb-4 animate-spin">📷</div>
              <p className="text-sm">A iniciar câmara...</p>
              <button
                onClick={toggleAR}
                className="mt-4 px-4 py-2 bg-red-600/80 text-white rounded-lg text-sm hover:bg-red-700 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
