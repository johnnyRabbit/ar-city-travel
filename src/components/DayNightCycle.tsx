import { useEffect, useState } from 'react';

export default function DayNightCycle() {
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'day' | 'dusk' | 'night'>('day');
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Update time based on real time (accelerated for demo - 1 hour = 1 minute)
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      
      // Determine time of day
      if (totalMinutes >= 300 && totalMinutes < 480) { // 5:00 - 8:00
        setTimeOfDay('dawn');
        setOpacity(0.2);
      } else if (totalMinutes >= 480 && totalMinutes < 1080) { // 8:00 - 18:00
        setTimeOfDay('day');
        setOpacity(0);
      } else if (totalMinutes >= 1080 && totalMinutes < 1200) { // 18:00 - 20:00
        setTimeOfDay('dusk');
        setOpacity(0.3);
      } else { // 20:00 - 5:00
        setTimeOfDay('night');
        setOpacity(0.5);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getOverlayColor = () => {
    switch (timeOfDay) {
      case 'dawn':
        return 'rgba(255, 140, 0, 0.15)';
      case 'day':
        return 'transparent';
      case 'dusk':
        return 'rgba(255, 69, 0, 0.2)';
      case 'night':
        return 'rgba(0, 0, 50, 0.4)';
    }
  };

  const getTimeEmoji = () => {
    switch (timeOfDay) {
      case 'dawn': return '🌅';
      case 'day': return '☀️';
      case 'dusk': return '🌆';
      case 'night': return '🌙';
    }
  };

  const getTimeText = () => {
    switch (timeOfDay) {
      case 'dawn': return 'Amanhecer';
      case 'day': return 'Dia';
      case 'dusk': return 'Crepúsculo';
      case 'night': return 'Noite';
    }
  };

  return (
    <>
      {/* Overlay de cor baseado no tempo */}
      <div 
        className="fixed inset-0 pointer-events-none z-[500] transition-all duration-1000"
        style={{ 
          backgroundColor: getOverlayColor(),
          opacity: opacity
        }}
      />

      {/* Indicador de tempo (canto superior esquerdo) */}
      <div className="fixed top-24 left-4 z-[1100] pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
          <p className="text-xs text-white/80 flex items-center gap-2">
            <span className="text-lg">{getTimeEmoji()}</span>
            <span className="font-bold">{getTimeText()}</span>
          </p>
        </div>
      </div>
    </>
  );
}
