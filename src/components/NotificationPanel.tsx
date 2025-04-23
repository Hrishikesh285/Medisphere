import React from 'react';
import { X, AlertCircle, Clock, ShoppingBag, Video, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead,
    removeNotification 
  } = useNotification();
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Clock size={18} className="text-primary-500" />;
      case 'stock':
        return <ShoppingBag size={18} className="text-warning-500" />;
      case 'appointment':
        return <Video size={18} className="text-secondary-500" />;
      case 'adherence':
        return <BarChart2 size={18} className="text-accent-500" />;
      default:
        return <AlertCircle size={18} className="text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.actionLink) {
      navigate(notification.actionLink);
      onClose();
    }
  };

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {notifications.filter(n => !n.read).length} unread notifications
          </span>
          <button 
            onClick={markAllAsRead}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-gray-500">
            <AlertCircle size={48} className="mb-2 opacity-50" />
            <p className="text-center">No notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map(notification => (
              <li 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                  !notification.read ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow" onClick={() => handleNotificationClick(notification)}>
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-primary-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500">
                        {format(new Date(notification.timestamp), 'h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(notification.timestamp), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;