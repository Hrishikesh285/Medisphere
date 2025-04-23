import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('ravikumar@example.com');
  const [password, setPassword] = useState('Ravi@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { login, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }
    
    await login(email, password);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8 mb-4">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary-500 text-white mb-3">
              <Heart size={28} />
            </div>
            <h1 className="text-2xl font-bold text-center">Welcome to MediSphere</h1>
            <p className="text-gray-600 mt-2 text-center">
              Your personal healthcare management platform
            </p>
          </div>
          
          {(error || formError) && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-6 flex items-start">
              <AlertCircle size={18} className="flex-shrink-0 mr-2 mt-0.5" />
              <span>{error || formError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                Forgot password?
              </a>
            </div>
            
            <button
              type="submit"
              className="w-full btn btn-primary py-2.5"
            >
              Sign In
            </button>
          </form>
        </div>
        
        <div className="card p-6 flex flex-col sm:flex-row items-center">
          <div className="bg-primary-100 rounded-full p-2 mr-3 mb-3 sm:mb-0">
            <CheckCircle size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 text-center sm:text-left">
              <span className="font-semibold">Demo Account:</span> Use the pre-filled credentials to explore the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;