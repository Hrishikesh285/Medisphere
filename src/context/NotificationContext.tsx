import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: {
    time: string;
    days: string[];
  }[];
  stock: number;
}

interface Notification {
  id: string;
  type: 'reminder' | 'stock' | 'appointment' | 'adherence';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionLink?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  triggerMedicationReminder: (medication: Medication) => void;
  triggerLowStockAlert: (medication: Medication) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Request browser notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }
    
    // Add some initial mock notifications
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'reminder',
        title: 'Medication Reminder',
        message: 'Time to take Metformin (500mg)',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
        read: false
      },
      {
        id: '2',
        type: 'stock',
        title: 'Low Medication Stock',
        message: 'Your Lisinopril stock is running low (3 pills remaining)',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
        read: true
      }
    ];
    
    setNotifications(initialNotifications);
  }, []);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast.info(notification.message, {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.svg'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const triggerMedicationReminder = (medication: Medication) => {
    addNotification({
      type: 'reminder',
      title: 'Medication Reminder',
      message: `Time to take ${medication.name} (${medication.dosage})`,
      actionLink: '/reminders'
    });
  };

  const triggerLowStockAlert = (medication: Medication) => {
    addNotification({
      type: 'stock',
      title: 'Low Medication Stock',
      message: `Your ${medication.name} stock is running low (${medication.stock} ${medication.stock === 1 ? 'pill' : 'pills'} remaining)`,
      actionLink: '/pharmacy'
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        triggerMedicationReminder,
        triggerLowStockAlert
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};