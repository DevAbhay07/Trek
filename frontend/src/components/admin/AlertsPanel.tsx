import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Alert {
  id: string;
  type: 'double-booking' | 'payment-delay' | 'system-error' | 'security' | 'maintenance';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  affectedSlot?: string;
  affectedUser?: string;
  actionRequired: boolean;
}

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'critical'>('unresolved');
  const [isOpen, setIsOpen] = useState(false);

  // Initialize with mock alerts
  useEffect(() => {
    const initialAlerts: Alert[] = [
      {
        id: '1',
        type: 'double-booking',
        severity: 'critical',
        title: 'Slot Double Booking Detected',
        description: 'Slot A-12 has been booked twice for the same time period. Immediate action required.',
        timestamp: new Date(Date.now() - 300000),
        resolved: false,
        affectedSlot: 'A-12',
        affectedUser: 'User #12345',
        actionRequired: true
      },
      {
        id: '2',
        type: 'payment-delay',
        severity: 'high',
        title: 'Payment Processing Delayed',
        description: 'Payment gateway response time exceeded 30 seconds. Multiple transactions affected.',
        timestamp: new Date(Date.now() - 600000),
        resolved: false,
        actionRequired: true
      },
      {
        id: '3',
        type: 'system-error',
        severity: 'medium',
        title: 'Database Connection Timeout',
        description: 'Brief connection timeout to primary database. Automatically switched to backup.',
        timestamp: new Date(Date.now() - 900000),
        resolved: false,
        actionRequired: false
      },
      {
        id: '4',
        type: 'security',
        severity: 'high',
        title: 'Multiple Failed Login Attempts',
        description: '5 failed login attempts detected from IP 192.168.1.100 in the last 5 minutes.',
        timestamp: new Date(Date.now() - 120000),
        resolved: false,
        actionRequired: true
      }
    ];

    setAlerts(initialAlerts);

    // Simulate real-time alerts
    const interval = setInterval(() => {
      const alertTypes: Alert['type'][] = ['double-booking', 'payment-delay', 'system-error', 'security', 'maintenance'];
      const severities: Alert['severity'][] = ['critical', 'high', 'medium', 'low'];
      
      if (Math.random() > 0.7) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          title: getRandomTitle(),
          description: getRandomDescription(),
          timestamp: new Date(),
          resolved: false,
          actionRequired: Math.random() > 0.5
        };

        setAlerts(prev => [newAlert, ...prev]);
        
        // Show toast notification
        if (newAlert.severity === 'critical' || newAlert.severity === 'high') {
          toast.error(`🚨 ${newAlert.title}`, {
            duration: 5000,
            position: 'top-right'
          });
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getRandomTitle = () => {
    const titles = [
      'New Double Booking Conflict',
      'Payment Gateway Timeout',
      'System Health Check Failed',
      'Unauthorized Access Attempt',
      'Maintenance Required'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const getRandomDescription = () => {
    const descriptions = [
      'A conflict has been detected in the booking system.',
      'Payment processing is experiencing delays.',
      'System monitoring detected an anomaly.',
      'Security alert requires immediate attention.',
      'Scheduled maintenance window approaching.'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const handleResolve = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
    toast.success('Alert marked as resolved');
  };

  const handleDismiss = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast.success('Alert dismissed');
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unresolved') return !alert.resolved;
    if (filter === 'critical') return alert.severity === 'critical';
    return true;
  });

  const unresolvedCount = alerts.filter(a => !a.resolved).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-300';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'double-booking':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'payment-delay':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'system-error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'security':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'maintenance':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unresolvedCount > 0 && (
            <>
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {unresolvedCount}
              </span>
              <span className="absolute -top-1 -right-1 flex h-6 w-6 animate-ping rounded-full bg-red-400 opacity-75"></span>
            </>
          )}
        </button>
      </div>

      {/* Alerts Panel Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Alerts & Notifications</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs opacity-90">Unresolved</p>
                <p className="text-2xl font-bold">{unresolvedCount}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs opacity-90">Critical</p>
                <p className="text-2xl font-bold">{criticalCount}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                onClick={() => setFilter('unresolved')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'unresolved' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Unresolved ({unresolvedCount})
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'critical' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Critical ({criticalCount})
              </button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 font-medium">No alerts to display</p>
                <p className="text-sm text-gray-500 mt-1">All systems operating normally</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    alert.resolved ? 'opacity-60 bg-gray-50' : 'bg-white hover:shadow-md'
                  } ${getSeverityColor(alert.severity).replace('text-', 'border-').split(' ')[2]}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{alert.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {alert.resolved && (
                      <span className="text-green-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{alert.description}</p>

                  {(alert.affectedSlot || alert.affectedUser) && (
                    <div className="mb-3 space-y-1">
                      {alert.affectedSlot && (
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Slot:</span> {alert.affectedSlot}
                        </p>
                      )}
                      {alert.affectedUser && (
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">User:</span> {alert.affectedUser}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{alert.timestamp.toLocaleTimeString()}</span>
                    {alert.actionRequired && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                        Action Required
                      </span>
                    )}
                  </div>

                  {!alert.resolved && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        ✓ Resolve
                      </button>
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AlertsPanel;
