import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface SidebarItem {
  name: string;
  href: string;
  icon: JSX.Element;
  badge?: number;
  children?: SidebarItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const adminNavigation: SidebarItem[] = [
    {
      name: 'Admin Dashboard',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Slot Management',
      href: '/admin/slots',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l-8 12-4-4" />
        </svg>
      ),
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
    },
    {
      name: 'Violation Detection',
      href: '/admin/violations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const navigation = adminNavigation;

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isCurrentPath = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const renderNavItem = (item: SidebarItem, depth = 0) => {
    const isActive = isCurrentPath(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);

    return (
      <div key={item.name}>
        <Link
          to={item.href}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.name);
            } else {
              onClose();
            }
          }}
          className={`
            flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
            ${depth > 0 ? 'ml-6' : ''}
            ${isActive 
              ? 'bg-primary-100 text-primary-700 border-r-4 border-primary-500' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
        >
          <div className="flex items-center">
            <span className={`${isActive ? 'text-primary-500' : 'text-gray-400'} mr-3`}>
              {item.icon}
            </span>
            <span>{item.name}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {item.badge && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? 'transform rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </Link>
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <img 
                src="/images/image.png" 
                alt="Prabandh Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-semibold text-gray-900">Park Prabandh</span>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map(item => renderNavItem(item))}
          </nav>

          {/* Notification Button */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex justify-center mb-3">
              <button className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">2</span>
                <span className="absolute -top-1 -right-1 flex h-6 w-6 animate-ping rounded-full bg-red-400 opacity-75"></span>
              </button>
            </div>
          </div>

          {/* Sidebar footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Park-Prabandh v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;