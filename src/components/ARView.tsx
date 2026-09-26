import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useQuestStore } from '../store/questStore';
import { eras } from '../data/evoraHistory';

// Avatares diferentes para zombies em AR
const zombieAvatars = ['🧟', '🧟‍♂️', '🧟‍♀️', '💀', '☠️', '👻', '🎃', '👹', '👺', '🤖'];

export default function ARView() {
  const { arMode, zombies, player, killZombie, toggleAR, historicalEvents } = useGameStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [zombieAvatarsMap, setZombieAvatarsMap] = useState<Record<string, string>>({});
  const [heading, setHeading] = useState(0); // Direção que o utilizador está a olhar (0-360)

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
      const alpha = event.alpha || 0; // compass direction (0-360)
      const beta = event.beta || 0;   // front-back tilt
      const gamma = event.gamma || 0; // left-right tilt
      
      setDeviceOrientation({ alpha, beta, gamma });
      
      // Calcular heading (direção que o utilizador está a olhar)
      // Em iOS, alpha é relativo ao início, precisamos de webkitCompassHeading
      const webkitEvent = event as any;
      if (webkitEvent.webkitCompassHeading) {
        setHeading(webkitEvent.webkitCompassHeading);
      } else {
        // Android e outros: alpha é o heading
        setHeading(360 - alpha);
      }
    };

    // Request permission on iOS
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission().then((permission: string) => {
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      }).catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
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

  // Calcular bearing (ângulo) entre duas coordenadas GPS
  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
              Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;
    return bearing;
  };

  // Calcular distância entre duas coordenadas GPS (em metros)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000; // Raio da Terra em metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calcular posição do zombie/ponto de interesse no ecrã
  const getScreenPosition = (targetLat: number, targetLng: number) => {
    const distance = calculateDistance(player.lat, player.lng, targetLat, targetLng);
    const bearing = calculateBearing(player.lat, player.lng, targetLat, targetLng);
    
    // Ângulo relativo ao heading do utilizador
    let relativeAngle = bearing - heading;
    
    // Normalizar para -180 a 180
    if (relativeAngle > 180) relativeAngle -= 360;
    if (relativeAngle < -180) relativeAngle += 360;
    
    // Campo de visão horizontal (aproximadamente 60 graus para câmara normal)
    const fovHorizontal = 60;
    
    // Mapear ângulo relativo para posição X do ecrã
    const screenX = 50 + (relativeAngle / fovHorizontal) * 50;
    
    // Posição Y baseada na distância e inclinação do dispositivo
    // Mais longe = mais alto no ecrã
    const baseY = 60; // Linha do horizonte
    const distanceFactor = Math.min(distance / 500, 1); // Normalizar até 500m
    const screenY = baseY - (distanceFactor * 20) + (deviceOrientation.beta - 45) * 0.3;
    
    // Escala baseada na distância
    const scale = Math.max(0.3, Math.min(2.5, 100 / Math.max(distance, 10)));
    
    // Verificar se está visível no ecrã (campo de visão)
    const isVisible = Math.abs(relativeAngle) < fovHorizontal / 2 && screenY > 0 && screenY < 100;
    
    return { x: screenX, y: screenY, scale, isVisible, distance, bearing, relativeAngle };
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

  const handleDiscoverEvent = (id: string) => {
    const { discoverEvent } = useGameStore.getState();
    discoverEvent(id);
  };

  const activeZombies = zombies.filter((z) => z.active);
  const nearbyEvents = historicalEvents.filter(e => {
    const dist = calculateDistance(player.lat, player.lng, e.lat, e.lng);
    return dist < 200; // Mostrar eventos num raio de 200m
  });

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
            <p className="text-[10px] text-gray-300">Aponta a câmara para explorar</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-[10px] text-green-400">🧟 {activeZombies.length} zombies</p>
              <p className="text-[10px] text-blue-400">📜 {nearbyEvents.length} locais próximos</p>
              <p className="text-[10px] text-yellow-400">🧭 {Math.round(heading)}°</p>
            </div>
          </div>
        </div>

        {/* Compass - BOTTOM CENTER */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-sm rounded-full px-6 py-3 text-white border border-white/20">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-[10px] text-gray-400">Direção</p>
                <p className="text-sm font-bold font-mono">{Math.round(heading)}°</p>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <p className="text-[10px] text-gray-400">Zombies</p>
                <p className="text-sm font-bold text-red-400">{activeZombies.length}</p>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <p className="text-[10px] text-gray-400">Locais</p>
                <p className="text-sm font-bold text-blue-400">{nearbyEvents.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white/50 rounded-full" />
            </div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/30" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/30" />
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-3 h-0.5 bg-white/30" />
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-0.5 bg-white/30" />
          </div>
        </div>

        {/* Historical Events (Points of Interest) */}
        {nearbyEvents.map((event) => {
          const pos = getScreenPosition(event.lat, event.lng);
          if (!pos.isVisible) return null;

          const eraInfo = eras.find(e => e.id === event.era);
          const distanceMeters = Math.round(pos.distance);

          return (
            <div
              key={event.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-all duration-300"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) scale(${pos.scale})`,
              }}
              onClick={() => {
                if (pos.distance < 20) {
                  handleDiscoverEvent(event.id);
                }
              }}
            >
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
                
                {/* Event marker */}
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-4 shadow-2xl"
                    style={{ 
                      backgroundColor: event.discovered ? '#10B981' : eraInfo?.color || '#666',
                      borderColor: event.discovered ? '#059669' : '#fff'
                    }}
                  >
                    {event.icon}
                  </div>
                  
                  {/* Shadow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/40 rounded-full blur-sm" />
                </div>

                {/* Info tag */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-sm px-3 py-2 rounded-lg whitespace-nowrap border border-blue-500/50 min-w-[120px]">
                  <p className="text-white text-xs font-bold text-center">{event.title}</p>
                  <p className="text-blue-300 text-[10px] text-center">{distanceMeters}m</p>
                  {event.discovered && (
                    <p className="text-green-400 text-[10px] text-center">✅ Descoberto</p>
                  )}
                </div>

                {/* Discover indicator */}
                {pos.distance < 20 && !event.discovered && (
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-green-600/90 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    🔍 Clica para descobrir!
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Zombies in AR */}
        {activeZombies.map((zombie) => {
          const pos = getScreenPosition(zombie.lat, zombie.lng);
          if (!pos.isVisible) return null;

          const avatar = zombieAvatarsMap[zombie.id] || zombie.emoji;
          const healthPercent = (zombie.health / zombie.maxHealth) * 100;
          const distanceMeters = Math.round(pos.distance);
          
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
                <div className="absolute inset-0 bg-red-500/40 rounded-full blur-xl animate-pulse" />
                
                {/* Zombie avatar */}
                <div className="relative">
                  <span className="text-7xl drop-shadow-2xl" style={{ 
                    animation: 'bounce 2s infinite',
                    filter: 'drop-shadow(0 0 10px rgba(255,0,0,0.5))'
                  }}>
                    {avatar}
                  </span>
                  
                  {/* Shadow */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/50 rounded-full blur-md" />
                </div>

                {/* Name tag */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg whitespace-nowrap border-2 border-red-500">
                  <p className="text-white text-xs font-bold">{zombie.name}</p>
                  <p className="text-red-300 text-[10px] text-center">{distanceMeters}m</p>
                </div>

                {/* Health bar */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20">
                  <div className="bg-gray-900/90 rounded-full h-2.5 border border-gray-700">
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{ 
                        width: `${healthPercent}%`,
                        backgroundColor: healthPercent > 50 ? '#10B981' : healthPercent > 25 ? '#F59E0B' : '#EF4444'
                      }}
                    />
                  </div>
                  <p className="text-white text-[9px] text-center mt-0.5 font-mono font-bold">
                    {zombie.health}/{zombie.maxHealth}
                  </p>
                </div>

                {/* Attack indicator on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-red-600/95 text-white text-sm font-bold px-4 py-2 rounded-full animate-pulse shadow-2xl">
                    ⚔️ ATACAR
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Direction indicators for off-screen objects */}
        {[...activeZombies.map(z => ({ ...z, type: 'zombie' as const })), 
          ...nearbyEvents.map(e => ({ ...e, type: 'event' as const }))]
          .map((obj) => {
            const pos = getScreenPosition(obj.lat, obj.lng);
            if (pos.isVisible) return null;
            
            // Calcular posição do indicador na borda do ecrã
            const angle = Math.atan2(pos.x - 50, 50 - pos.y);
            const radius = 40; // Distância do centro
            const indicatorX = 50 + Math.sin(angle) * radius;
            const indicatorY = 50 - Math.cos(angle) * radius;
            
            const isZombie = obj.type === 'zombie';
            const icon = isZombie ? (zombieAvatarsMap[obj.id] || obj.emoji) : obj.icon;
            const color = isZombie ? 'red' : 'blue';
            
            return (
              <div
                key={`indicator-${obj.id}`}
                className="absolute pointer-events-none"
                style={{
                  left: `${indicatorX}%`,
                  top: `${indicatorY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className={`bg-${color}-600/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 border-2 border-${color}-400`}>
                  <span className="text-sm">{icon}</span>
                  <span className="text-[10px] font-bold">{Math.round(pos.distance)}m</span>
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
