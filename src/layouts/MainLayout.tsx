import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

const MainLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-500 text-white">
                <span className="text-xl font-bold">M</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">MediSphere</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-medium">{user?.name}</p>
            </div>
          </div>
        </header>

        <Navigation />
        
        <main>
          <Outlet />
        </main>
        
      
      </div>
    </div>
  );
};

export default MainLayout;