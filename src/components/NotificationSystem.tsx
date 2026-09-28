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
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[2000] flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {notifications.slice(-3).map((notification) => {
        const colors: Record<string, string> = {
          success: 'from-green-500/90 to-emerald-600/90 border-green-400',
          error: 'from-red-500/90 to-red-600/90 border-red-400',
          warning: 'from-yellow-500/90 to-orange-600/90 border-yellow-400',
          info: 'from-blue-500/90 to-blue-600/90 border-blue-400',
          danger: 'from-red-600/90 to-red-700/90 border-red-500',
        };

        const colorClass = colors[notification.type] || colors.info;

        return (
          <div
            key={notification.id}
            className={`bg-gradient-to-r ${colorClass} backdrop-blur-md border-2 rounded-2xl shadow-2xl px-5 py-3 text-white font-medium text-sm animate-slide-down pointer-events-auto`}
          >
            {notification.message}
          </div>
        );
      })}
    </div>
  );
}
