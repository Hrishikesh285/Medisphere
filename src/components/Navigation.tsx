import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Home, 
  Clock, 
  ShoppingBag, 
  Video, 
  BarChart2, 
  User,
  Menu,
  X
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import NotificationPanel from './NotificationPanel';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { unreadCount } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/reminders', icon: <Clock size={20} />, label: 'Reminders' },
    { path: '/pharmacy', icon: <ShoppingBag size={20} />, label: 'Pharmacy' },
    { path: '/telemedicine', icon: <Video size={20} />, label: 'Telemedicine' },
    { path: '/ai-analysis', icon: <BarChart2 size={20} />, label: 'AI Analysis' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Desktop navigation */}
      <nav className="hidden lg:flex bg-white shadow-sm p-4 mb-6 rounded-xl">
        <div className="flex items-center space-x-6">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-tab flex items-center space-x-2 ${isActive ? 'nav-tab-active' : 'nav-tab-inactive'}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="ml-auto">
          <button 
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={toggleNotifications}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-white shadow-sm p-4 mb-6 rounded-xl">
          <button 
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <h1 className="text-xl font-semibold">
            {navItems.find(item => item.path === location.pathname)?.label || 'MediSphere'}
          </h1>
          
          <button 
            className="relative p-2 rounded-full hover:bg-gray-100"
            onClick={toggleNotifications}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="bg-white shadow-md rounded-xl mb-6 overflow-hidden slide-in">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center space-x-3 p-4 ${isActive ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Notification panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setShowNotifications(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg p-4 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;