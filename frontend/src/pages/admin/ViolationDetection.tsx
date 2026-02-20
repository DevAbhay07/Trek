import { useState } from 'react';

const ViolationDetection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const violations = [
    { 
      id: 1, 
      timestamp: '2024-01-22 14:30:25', 
      slot: 'A-15', 
      type: 'Overstay', 
      vehicle: 'MH 12 AB 1234', 
      severity: 'high',
      status: 'pending',
      evidence: '/api/evidence/violation_001.jpg'
    },
    { 
      id: 2, 
      timestamp: '2024-01-22 13:45:12', 
      slot: 'B-08', 
      type: 'Wrong Vehicle', 
      vehicle: 'MH 12 CD 5678', 
      severity: 'medium',
      status: 'resolved',
      evidence: '/api/evidence/violation_002.jpg'
    },
    { 
      id: 3, 
      timestamp: '2024-01-22 12:15:33', 
      slot: 'C-22', 
      type: 'Unauthorized Parking', 
      vehicle: 'MH 12 EF 9012', 
      severity: 'high',
      status: 'investigating',
      evidence: '/api/evidence/violation_003.jpg'
    },
  ];

  const filteredViolations = violations.filter(violation => 
    activeFilter === 'all' || violation.status === activeFilter
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Violation Detection</h1>
        <p className="text-gray-600 mt-2">AI-powered parking violation monitoring and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-md">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Violations</p>
              <p className="text-2xl font-semibold text-gray-900">248</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-md">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">15</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-md">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Detection Rate</p>
              <p className="text-2xl font-semibold text-gray-900">94.2%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue Recovery</p>
              <p className="text-2xl font-semibold text-gray-900">₹45,680</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['all', 'pending', 'investigating', 'resolved'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeFilter === filter
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {filter === 'all' ? 'All Violations' : filter}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Violations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Violation Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredViolations.map((violation) => (
                <tr key={violation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{violation.type}</div>
                      <div className="text-sm text-gray-500">Slot: {violation.slot}</div>
                      <div className="text-sm text-gray-500">{violation.timestamp}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{violation.vehicle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(violation.severity)}`}>
                      {violation.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(violation.status)}`}>
                      {violation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">View Evidence</button>
                    <button className="text-green-600 hover:text-green-900">Resolve</button>
                    <button className="text-red-600 hover:text-red-900">Flag</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Detection Feed */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Detection Feed</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Camera Feed - Section A</h3>
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">Live Camera Feed</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Detection Log</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <div className="flex items-center space-x-3 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-gray-600">14:32:15</span>
                  <span className="text-gray-900">Overstay detected at A-15</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="text-gray-600">14:28:42</span>
                  <span className="text-gray-900">Vehicle mismatch at B-08</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600">14:25:18</span>
                  <span className="text-gray-900">Normal parking at C-12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationDetection;