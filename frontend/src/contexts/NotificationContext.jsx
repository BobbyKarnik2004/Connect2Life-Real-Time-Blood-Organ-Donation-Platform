import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children, socket }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (socket && user) {
      // Join user's room for real-time notifications
      socket.emit('join_room', { user_id: user.id });

      // Listen for real-time events
      socket.on('new_match', (data) => {
        toast.success(`🎉 New match found!`, {
          description: `Compatibility: ${Math.round(data.compatibility_score * 100)}% | Distance: ${data.distance_km.toFixed(1)}km`
        });
        addNotification({
          title: 'New Match Found!',
          message: `You've been matched for ${data.organ_type} donation`,
          type: 'match'
        });
      });

      socket.on('match_response', (data) => {
        const status = data.status === 'accepted' ? 'accepted' : 'declined';
        const icon = status === 'accepted' ? '✅' : '❌';
        toast.success(`${icon} Match ${status}`, {
          description: `Your donation match has been ${status}`
        });
        addNotification({
          title: `Match ${status}`,
          message: `Your donation match has been ${status}`,
          type: status === 'accepted' ? 'success' : 'info'
        });
      });

      socket.on('emergency_alert', (data) => {
        toast.error(`🚨 EMERGENCY ALERT`, {
          description: data.message,
          duration: 10000
        });
        addNotification({
          title: '🚨 EMERGENCY ALERT',
          message: data.message,
          type: 'urgent'
        });
      });

      return () => {
        socket.off('new_match');
        socket.off('match_response');
        socket.off('emergency_alert');
      };
    }
  }, [socket, user]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      created_at: new Date(),
      is_read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, is_read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}