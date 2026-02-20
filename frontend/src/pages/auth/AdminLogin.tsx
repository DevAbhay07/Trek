import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';
import Button from '../../components/shared/Button';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(loginUser({
        email: formData.email,
        password: formData.password
      }));

      if (loginUser.fulfilled.match(result)) {
        const user = result.payload.user;
        
        // Check if user is actually an admin
        if (user.role !== 'admin') {
          toast.error('Access denied. Admin credentials required.');
          return;
        }
        
        toast.success('Admin login successful!');
        navigate('/admin');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/images/image.png" 
                alt="Prabandh Logo" 
                className="h-16 w-auto"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Access admin dashboard and system controls
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Test Credentials */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-800 mb-3">Test Admin Credentials:</h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData, 
                  email: 'teaminfra06@gmail.com', 
                  password: 'teaminfra'
                })}
                className="w-full text-left text-xs bg-purple-100 hover:bg-purple-200 p-2 rounded transition-colors"
              >
                <strong>👨‍💼 Admin:</strong> teaminfra06@gmail.com / teaminfra
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-purple-600 hover:text-purple-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
            >
              Sign in as Admin
            </Button>
          </form>

          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-amber-800">
                <strong>Security Notice:</strong> This is a restricted area. Unauthorized access attempts will be logged.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Not an admin?{' '}
          <button
            onClick={() => navigate('/user-login')}
            className="text-purple-600 hover:text-purple-700 font-medium underline"
          >
            User login
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
