import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import AppRoutes from './components/routing/AppRoutes';
import ErrorBoundary from './components/shared/ErrorBoundary';
import LoadingSpinner from './components/shared/LoadingSpinner';
import { loadUser } from './store/slices/authSlice';
import { AppDispatch } from './store';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Load user from token if exists
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            <AppRoutes />
          </Suspense>
          
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;