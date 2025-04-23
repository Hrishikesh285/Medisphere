import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/constants';

interface User {
  _id: string;
  name: string;
  email: string;
  healthConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // For demo purposes, create mock user data
          const mockUser = {
            _id: '1',
            name: 'Ravi Kumar',
            email: 'ravikumar@example.com',
            healthConditions: ['Hypertension', 'Type 2 Diabetes'],
            emergencyContact: {
              name: 'Priya Kumar',
              phone: '+91 98765 43210',
              relationship: 'Spouse'
            }
          };
          setUser(mockUser);
          setToken(storedToken);
        } catch (err) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // For demo purposes, hardcode the credentials check
      if (email === 'ravikumar@example.com' && password === 'Ravi@123') {
        const mockUser = {
          _id: '1',
          name: 'Ravi Kumar',
          email: 'ravikumar@example.com',
          healthConditions: ['Hypertension', 'Type 2 Diabetes'],
          emergencyContact: {
            name: 'Priya Kumar',
            phone: '+91 98765 43210',
            relationship: 'Spouse'
          }
        };

        const mockToken = 'demo-token-xyz';
        localStorage.setItem('token', mockToken);
        setToken(mockToken);
        setUser(mockUser);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};