import Chart from '../../components/shared/Chart';

const AnalyticsDashboard = () => {
  const hourlyData = [
    { name: '00:00', value: 45 },
    { name: '02:00', value: 30 },
    { name: '04:00', value: 25 },
    { name: '06:00', value: 120 },
    { name: '08:00', value: 280 },
    { name: '10:00', value: 350 },
    { name: '12:00', value: 400 },
    { name: '14:00', value: 380 },
    { name: '16:00', value: 420 },
    { name: '18:00', value: 450 },
    { name: '20:00', value: 320 },
    { name: '22:00', value: 180 }
  ];

  const revenueData = [
    { name: 'Jan', value: 450000 },
    { name: 'Feb', value: 520000 },
    { name: 'Mar', value: 480000 },
    { name: 'Apr', value: 590000 },
    { name: 'May', value: 620000 },
    { name: 'Jun', value: 580000 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Comprehensive analytics and insights</p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900">87%</div>
          <div className="text-sm text-gray-600">Average Occupancy</div>
          <div className="text-xs text-green-600 mt-1">+5% from last month</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900">₹58,240</div>
          <div className="text-sm text-gray-600">Monthly Revenue</div>
          <div className="text-xs text-green-600 mt-1">+12% from last month</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900">2.4h</div>
          <div className="text-sm text-gray-600">Avg. Parking Duration</div>
          <div className="text-xs text-red-600 mt-1">-8% from last month</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900">94%</div>
          <div className="text-sm text-gray-600">User Satisfaction</div>
          <div className="text-xs text-green-600 mt-1">+2% from last month</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Chart
          data={hourlyData}
          type="area"
          title="Hourly Usage Pattern"
          height={300}
          colors={['#3B82F6']}
        />
        
        <Chart
          data={revenueData}
          type="bar"
          title="Monthly Revenue Trend"
          height={300}
          colors={['#10B981']}
        />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Morning Peak (8-10 AM)</span>
              <span className="text-sm font-medium">92% occupancy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Evening Peak (6-8 PM)</span>
              <span className="text-sm font-medium">95% occupancy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Weekend Average</span>
              <span className="text-sm font-medium">78% occupancy</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Behavior</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Repeat Users</span>
              <span className="text-sm font-medium">68%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">FASTag Usage</span>
              <span className="text-sm font-medium">84%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mobile App Users</span>
              <span className="text-sm font-medium">91%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;