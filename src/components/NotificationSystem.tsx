import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export default function NotificationSystem() {
  const { notifications, removeNotification } = useGameStore();

  // Auto-dismiss após 3 segundos
  useEffect(() => {
    const timers = notifications.map((notification) =>
      setTimeout(() => {
        removeNotification(notification.id);
      }, 3000)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[2000] flex flex-col gap-2 max-w-md w-full px-4">
      {notifications.slice(-3).map((notification) => {
        const colors: Record<string, string> = {
          success: 'bg-green-500/95 border-green-400',
          error: 'bg-red-500/95 border-red-400',
          warning: 'bg-yellow-500/95 border-yellow-400',
          info: 'bg-blue-500/95 border-blue-400',
          danger: 'bg-red-600/95 border-red-500',
        };

        return (
          <div
            key={notification.id}
            className={`${colors[notification.type]} backdrop-blur-sm border-2 rounded-xl shadow-2xl px-4 py-3 text-white font-medium text-sm animate-slide-down`}
          >
            {notification.message}
          </div>
        );
      })}
    </div>
  );
}
