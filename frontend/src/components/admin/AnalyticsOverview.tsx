import { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface DateRange {
  start: Date;
  end: Date;
}

const AnalyticsOverview = () => {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'occupancy' | 'agents' | 'vehicles'>('revenue');

  // Revenue breakdown data - Updated to match daily revenue of ₹22,400
  const revenueData = [
    { time: '00:00', hourly: 450, daily: 900, weekly: 6300 },
    { time: '04:00', hourly: 280, daily: 560, weekly: 3920 },
    { time: '08:00', hourly: 1850, daily: 3700, weekly: 25900 },
    { time: '12:00', hourly: 3200, daily: 6400, weekly: 44800 },
    { time: '16:00', hourly: 2950, daily: 5900, weekly: 41300 },
    { time: '20:00', hourly: 2270, daily: 4540, weekly: 31780 },
  ];

  // Agent performance data - Updated to match Agent Activity Graph
  const agentPerformance = [
    { name: 'Perception Agent', tasks: 1248, avgTime: 0.8, satisfaction: 97 },
    { name: 'Allocation Agent', tasks: 856, avgTime: 1.2, satisfaction: 94 },
    { name: 'Navigation Agent', tasks: 892, avgTime: 2.1, satisfaction: 96 },
    { name: 'Payment Agent', tasks: 834, avgTime: 1.5, satisfaction: 98 },
  ];

  // Vehicle type distribution - Updated to match 396 total slots with ~68% occupancy (271 occupied)
  const vehicleTypes = [
    { name: 'Cars', value: 162, color: '#3b82f6' },      // 60% of occupied (162/271)
    { name: 'SUVs', value: 54, color: '#10b981' },       // 20% of occupied
    { name: 'Bikes', value: 41, color: '#f59e0b' },      // 15% of occupied
    { name: 'Trucks', value: 14, color: '#8b5cf6' },     // 5% of occupied
  ];

  // Occupancy prediction - Updated to match current 68% occupancy
  const occupancyPrediction = [
    { time: 'Mon', actual: 62, predicted: 65 },
    { time: 'Tue', actual: 68, predicted: 67 },
    { time: 'Wed', actual: 72, predicted: 70 },
    { time: 'Thu', actual: 75, predicted: 76 },
    { time: 'Fri', actual: 82, predicted: 80 },
    { time: 'Sat', actual: 58, predicted: 60 },
    { time: 'Sun', actual: 48, predicted: 52 },
  ];

  // Revenue summary - Consistent with overview dashboard
  const revenueSummary = {
    today: { total: 22400, target: 25000, growth: 15 },      // Daily: ₹22.4K
    week: { total: 152400, target: 175000, growth: 12 },     // Weekly: ₹152.4K (22.4K × 7 avg, some variation)
    month: { total: 672000, target: 700000, growth: 18 },    // Monthly: ₹672K
  };

  const getCurrentRevenue = () => {
    switch(dateRange) {
      case 'week': return revenueSummary.week;
      case 'month': return revenueSummary.month;
      default: return revenueSummary.today;
    }
  };

  const currentRevenue = getCurrentRevenue();
  const progressPercent = (currentRevenue.total / currentRevenue.target * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">Comprehensive insights and predictions</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="revenue">Revenue</option>
              <option value="occupancy">Occupancy</option>
              <option value="agents">Agent Performance</option>
              <option value="vehicles">Vehicle Types</option>
            </select>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm">
              📊 Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => `₹${value}`}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="hourly" fill="#3b82f6" name="Hourly" radius={[8, 8, 0, 0]} />
              <Bar dataKey="daily" fill="#10b981" name="Daily Avg" radius={[8, 8, 0, 0]} />
              <Bar dataKey="weekly" fill="#f59e0b" name="Weekly Avg" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Target</h3>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Current Revenue</p>
            <p className="text-4xl font-bold text-green-900">₹{(currentRevenue.total / 1000).toFixed(1)}K</p>
            <p className="text-sm text-gray-600 mt-1">Target: ₹{(currentRevenue.target / 1000).toFixed(0)}K</p>
          </div>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(parseFloat(progressPercent), 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Growth Rate</span>
              <span className="text-sm font-bold text-green-600">+{currentRevenue.growth}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className="text-sm font-bold text-gray-900">₹{((currentRevenue.target - currentRevenue.total) / 1000).toFixed(1)}K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Performance & Vehicle Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance Analytics</h3>
          <div className="space-y-3 mb-4">
            {agentPerformance.map((agent, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{agent.name}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {agent.satisfaction}% satisfaction
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Tasks Completed</p>
                    <p className="text-2xl font-bold text-primary-600">{agent.tasks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Avg. Handling Time</p>
                    <p className="text-2xl font-bold text-blue-600">{agent.avgTime} min</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(agent.tasks / 450 * 30)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Type Distribution</h3>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vehicleTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${value} vehicles`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {vehicleTypes.map((type, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: type.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{type.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{type.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Occupancy Prediction */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Occupancy Prediction (ML-Based)</h3>
            <p className="text-sm text-gray-600 mt-1">Historical data vs predicted trends</p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-lg">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-medium text-purple-700">AI Powered</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={occupancyPrediction}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any) => `${value}%`}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Actual Occupancy"
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              strokeDasharray="5 5"
              name="Predicted Occupancy"
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Prediction accuracy */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900">Prediction Accuracy</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">96.8%</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-900">Avg. Error Margin</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">±2.3%</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-900">Model Confidence</p>
            <p className="text-2xl font-bold text-green-600 mt-1">High</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
