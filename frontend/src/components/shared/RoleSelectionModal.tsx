import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoleSelectionModal = ({ isOpen, onClose }: RoleSelectionModalProps) => {
  const navigate = useNavigate();

  const handleUserLogin = () => {
    onClose();
    navigate('/user-login');
  };

  const handleAdminLogin = () => {
    onClose();
    navigate('/admin-login');
  };

  if (!isOpen) return null;

  return (
    <Fragment>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto transform transition-all duration-300 ease-out animate-modal-appear"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome to Park-Prabandh
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choose your login type to continue
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg p-2 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Login Card */}
              <button
                onClick={handleUserLogin}
                className="group relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 border-2 border-primary-200 hover:border-primary-400 transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
              >
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/0 to-primary-600/0 group-hover:from-primary-400/10 group-hover:to-primary-600/10 transition-all duration-300" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      User Login
                    </h3>
                    <p className="text-sm text-gray-600">
                      Login with mobile number and OTP
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4 text-primary-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Quick OTP Login</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4 text-primary-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Book & Manage Parking</span>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="pt-2">
                    <svg
                      className="w-6 h-6 text-primary-600 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Admin Login Card */}
              <button
                onClick={handleAdminLogin}
                className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
              >
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/10 group-hover:to-purple-600/10 transition-all duration-300" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Admin Login
                    </h3>
                    <p className="text-sm text-gray-600">
                      Login with email and password
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Manage System</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Analytics & Reports</span>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="pt-2">
                    <svg
                      className="w-6 h-6 text-purple-600 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <p className="text-xs text-center text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  navigate('/register');
                }}
                className="text-primary-600 hover:text-primary-700 font-medium underline"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-modal-appear {
          animation: modal-appear 0.3s ease-out;
        }
      `}</style>
    </Fragment>
  );
};

export default RoleSelectionModal;
