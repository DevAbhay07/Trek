const SlotManagement = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Slot Management</h1>
        <p className="text-gray-600 mt-2">Manage parking slots and monitor real-time status</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Parking Grid</h2>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({length: 100}, (_, i) => (
            <div key={i} className={`aspect-square rounded border-2 text-xs font-medium flex items-center justify-center cursor-pointer transition-colors ${
              i % 4 === 0 ? 'border-red-300 bg-red-100 text-red-800' :
              i % 4 === 1 ? 'border-green-300 bg-green-100 text-green-800' :
              i % 4 === 2 ? 'border-yellow-300 bg-yellow-100 text-yellow-800' :
              'border-gray-300 bg-gray-100 text-gray-800'
            }`}>
              {String.fromCharCode(65 + Math.floor(i / 10))}-{(i % 10) + 1}
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-sm text-gray-600">Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-sm text-gray-600">Reserved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-sm text-gray-600">Out of Order</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotManagement;