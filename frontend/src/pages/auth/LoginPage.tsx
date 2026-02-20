import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';
import Button from '../../components/shared/Button';

type LoginRole = 'user' | 'admin';

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState<LoginRole>('user');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(result)) {
        // Logic to branch navigation based on which tab was selected
        if (activeTab === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user-home');
        }
      }
    }
    catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <div className="flex justify-center">
            <img 
              src="/images/image.png" 
              alt="Prabandh Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {activeTab === 'admin' ? 'Admin Portal' : 'User Login'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Smart parking made simple
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => { setActiveTab('user'); setErrors({}); setFormData({email: '', password: '', rememberMe: false}); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            User
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setErrors({}); setFormData({email: '', password: '', rememberMe: false}); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Administrator
          </button>
        </div>
        
        {/* Test Credentials Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
            Quick Fill {activeTab === 'admin' ? 'Admin' : 'User'}:
          </h3>
          {activeTab === 'admin' ? (
            <button
              type="button"
              onClick={() => setFormData({...formData, email: 'teaminfra06@gmail.com', password: 'teaminfra'})}
              className="w-full text-left text-xs bg-blue-100 hover:bg-blue-200 p-2 rounded border border-blue-300 transition-colors"
            >
              <strong>👨‍💼 Admin:</strong> teaminfra06@gmail.com / teaminfra
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setFormData({...formData, email: 'tester@gmail.com', password: 'user@1234'})}
              className="w-full text-left text-xs bg-blue-100 hover:bg-blue-200 p-2 rounded border border-blue-300 transition-colors"
            >
              <strong>👤 User:</strong> tester@gmail.com / user@1234
            </button>
          )}
        </div>

        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Sign in as {activeTab === 'admin' ? 'Admin' : 'User'}
          </Button>

          {/* Conditional Sign-up Footer */}
          {activeTab === 'user' && (
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;