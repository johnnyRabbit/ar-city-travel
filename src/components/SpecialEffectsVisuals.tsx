import { useState, useEffect } from 'react';

interface VisualEffect {
  id: string;
  type: 'explosion' | 'teleport' | 'freeze' | 'invisibility';
  x: number;
  y: number;
  timestamp: number;
}

export default function SpecialEffectsVisuals() {
  const [effects, setEffects] = useState<VisualEffect[]>([]);

  // Limpar efeitos antigos
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setEffects(prev => prev.filter(e => now - e.timestamp < 2000));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Expor função para criar efeitos
  useEffect(() => {
    (window as any).createSpecialEffect = (type: VisualEffect['type'], x: number, y: number) => {
      const newEffect: VisualEffect = {
        id: `${Date.now()}-${Math.random()}`,
        type,
        x,
        y,
        timestamp: Date.now(),
      };
      setEffects(prev => [...prev, newEffect]);
    };

    return () => {
      delete (window as any).createSpecialEffect;
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1500] overflow-hidden">
      {effects.map((effect) => {
        switch (effect.type) {
          case 'explosion':
            return (
              <div
                key={effect.id}
                className="absolute animate-explosion"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative">
                  <div className="text-8xl animate-ping">💥</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-orange-500/30 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            );

          case 'teleport':
            return (
              <div
                key={effect.id}
                className="absolute animate-teleport"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="text-8xl animate-spin">✨</div>
              </div>
            );

          case 'freeze':
            return (
              <div
                key={effect.id}
                className="absolute animate-freeze"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="text-6xl">❄️</div>
              </div>
            );

          case 'invisibility':
            return (
              <div
                key={effect.id}
                className="absolute animate-fade-in-out"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="text-6xl">👻</div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
