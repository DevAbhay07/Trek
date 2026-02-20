import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Chart from '../../components/shared/Chart';
import AgentActivityGraph from '../../components/admin/AgentActivityGraph';
import DynamicPricing from '../../components/admin/DynamicPricing';
import LiveCCTVFootage from '../../components/admin/LiveCCTVFootage';
import Parking3DMap from '../../components/admin/Parking3DMap';
import AnalyticsOverview from '../../components/admin/AnalyticsOverview';
import AlertsPanel from '../../components/admin/AlertsPanel';
import {
  fetchSlotStats,
  fetchSystemMetrics,
  DEFAULT_SLOT_STATS,
  DEFAULT_SYSTEM_METRICS,
} from '../../services/backendService';

type TabType = 'overview' | 'agents' | 'pricing' | 'live-map' |  '3d-map' | 'analytics';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // ── Live data from Flask backend (falls back to defaults when offline) ──
  const {
    data: slotStats,
    isLoading: slotsLoading,
    isError: slotsError,
  } = useQuery({
    queryKey: ['slotStats'],
    queryFn: fetchSlotStats,
    refetchInterval: 15_000,        // re-fetch every 15 s
    placeholderData: DEFAULT_SLOT_STATS,
    retry: 2,
  });

  const {
    data: sysMetrics,
    isLoading: metricsLoading,
  } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: fetchSystemMetrics,
    refetchInterval: 15_000,
    placeholderData: DEFAULT_SYSTEM_METRICS,
    retry: 2,
  });

  // Resolved values — always defined because of placeholderData
  const stats = {
    totalSlots:    slotStats?.totalSlots    ?? DEFAULT_SLOT_STATS.totalSlots,
    occupiedSlots: slotStats?.occupiedSlots ?? DEFAULT_SLOT_STATS.occupiedSlots,
    dailyRevenue:  sysMetrics?.dailyRevenue ?? DEFAULT_SYSTEM_METRICS.dailyRevenue,
    totalUsers:    2840, // no backend endpoint yet — stays as known value
  };

  const isBackendLive = !slotsError;

  const occupancyData = [
    { name: 'Available', value: stats.totalSlots - stats.occupiedSlots },
    { name: 'Occupied',  value: stats.occupiedSlots },
  ];

  const revenueData = [
    { name: 'Mon', value: 18200 },
    { name: 'Tue', value: 20100 },
    { name: 'Wed', value: 19800 },
    { name: 'Thu', value: 23500 },
    { name: 'Fri', value: 26800 },
    { name: 'Sat', value: 21600 },
    { name: 'Sun', value: 22400 }  // Matches daily revenue
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'agents', label: 'Agent Activity', icon: '👥' },
    { id: 'pricing', label: 'Dynamic Pricing', icon: '💰' },
    { id: 'live-map', label: 'Live CCTV Footage', icon: '📹'},
    { id: '3d-map', label: '3D Parking Map', icon: '🗺️' },
    { id: 'analytics', label: 'Advanced Analytics', icon: '📈' }
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Global Alerts Panel */}
      <AlertsPanel />
      
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time intelligent control panel with enhanced data visualizations</p>
        </div>
        {/* Backend connectivity badge */}
        <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border
          ${isBackendLive
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isBackendLive ? 'bg-green-500 animate-pulse' : 'bg-yellow-400'}`} />
          {isBackendLive ? 'AI Backend Connected' : 'Using Cached Data'}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`
                whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l-8 12-4-4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Slots</p>
                  {slotsLoading
                    ? <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1" />
                    : <p className="text-2xl font-bold text-gray-900">{stats.totalSlots}</p>
                  }
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8V9m0 2h8m-8 0h8" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Occupied</p>
                  {slotsLoading
                    ? <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1" />
                    : <p className="text-2xl font-bold text-gray-900">{stats.occupiedSlots}</p>
                  }
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Daily Revenue</p>
                  {metricsLoading
                    ? <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mt-1" />
                    : <p className="text-2xl font-bold text-gray-900">₹{stats.dailyRevenue.toLocaleString()}</p>
                  }
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Chart
              data={occupancyData}
              type="pie"
              title="Current Occupancy"
              height={300}
              colors={['#10B981', '#EF4444']}
            />
            
            <Chart
              data={revenueData}
              type="line"
              title="Weekly Revenue Trend"
              height={300}
              colors={['#3B82F6']}
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'New user registered', user: 'john.doe@example.com', time: '2 minutes ago' },
                { action: 'Slot A-12 occupied', user: 'Vehicle: MH01AB1234', time: '5 minutes ago' },
                { action: 'Payment received', user: '₹150 via FASTag', time: '10 minutes ago' },
                { action: 'Violation detected', user: 'Slot B-08 unauthorized parking', time: '15 minutes ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'agents' && <AgentActivityGraph />}
      {activeTab === 'pricing' && <DynamicPricing />}
      {activeTab === 'live-map' && <LiveCCTVFootage />}
      {activeTab === '3d-map' && <Parking3DMap />}
      {activeTab === 'analytics' && <AnalyticsOverview />}
    </div>
  );
};

export default AdminDashboard;