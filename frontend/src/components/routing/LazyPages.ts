import { lazy } from 'react';

// Lazy load all page components for code splitting
// Public pages
export const Homepage = lazy(() => import('../../pages/Homepage'));
export const LoginPage = lazy(() => import('../../pages/auth/LoginPage'));
export const RegisterPage = lazy(() => import('../../pages/auth/RegisterPage'));
export const AdminLogin = lazy(() => import('../../pages/auth/AdminLogin'));

// Admin pages
export const AdminDashboard = lazy(() => import('../../pages/admin/AdminDashboard'));
export const SlotManagement = lazy(() => import('../../pages/admin/SlotManagement'));
export const AnalyticsDashboard = lazy(() => import('../../pages/admin/AnalyticsDashboard'));
export const UserManagement = lazy(() => import('../../pages/admin/UserManagement'));
export const ViolationDetection = lazy(() => import('../../pages/admin/ViolationDetection'));