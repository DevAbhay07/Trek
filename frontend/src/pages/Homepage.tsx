import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Homepage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  const handleLearnMore = () => {
    // Scroll to features section
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-primary-900">
        <div className="absolute inset-x-0 bottom-0">
          <svg viewBox="0 0 224 12" fill="currentColor" className="w-full -mb-1 text-white">
            <path d="m0,6 C40,4 80,2 120,6 C160,10 200,10 224,6 L224 12 L0,12 Z"></path>
          </svg>
        </div>
        <div className="relative px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div className="mb-10 lg:max-w-lg lg:pr-8 lg:mb-0">
              <div className="max-w-xl mb-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
                  Smart Parking Made{' '}
                  <span className="text-primary-400">Simple</span>
                </h2>
                <p className="text-base text-gray-300 md:text-lg">
                  Find, book, and pay for parking spots in real-time with AI-powered slot detection and seamless FASTag integration.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleGetStarted}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  {isAuthenticated ? 'Go to Admin Dashboard' : 'Get Started'}
                </button>
                <button 
                  onClick={handleLearnMore}
                  className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center lg:w-1/2">
              <div className="w-full max-w-md">
                {/* Live Stats Card */}
                <div className="bg-white rounded-lg shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Live System Status
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">1,247</div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">453</div>
                      <div className="text-sm text-gray-600">Occupied</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">73%</div>
                      <div className="text-sm text-gray-600">Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">25</div>
                      <div className="text-sm text-gray-600">Locations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose Park-Prabandh?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Advanced technology meets user-friendly design
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 hover:bg-gray-50">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Detection
              </h3>
              <p className="text-gray-600">
                Real-time OpenCV slot detection with 99.5% accuracy
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 hover:bg-gray-50">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                FASTag Integration
              </h3>
              <p className="text-gray-600">
                Seamless payments with automatic toll deduction
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 hover:bg-gray-50">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600">
                Live slot availability and instant booking confirmation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Park Smarter?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who have made parking effortless
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleGetStarted}
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {isAuthenticated ? 'Go to Admin Dashboard' : 'Get Started Today'}
            </button>
            {!isAuthenticated && (
              <Link 
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium text-lg underline"
              >
                Already have an account? Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;