import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PricingFactor {
  name: string;
  impact: number;
  active: boolean;
}

interface PricingData {
  time: string;
  basePrice: number;
  actualPrice: number;
  occupancy: number;
}

const DynamicPricing = () => {
  const [basePricePerHour, setBasePricePerHour] = useState(50);
  const [currentPrice, setCurrentPrice] = useState(50);
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [overridePrice, setOverridePrice] = useState(50);
  const [factors, setFactors] = useState<PricingFactor[]>([
    { name: 'Peak Hour (9 AM - 6 PM)', impact: 1.3, active: true },
    { name: 'Weekend', impact: 1.2, active: false },
    { name: 'Festive Season', impact: 1.5, active: false },
    { name: 'High Occupancy (>80%)', impact: 1.4, active: true },
    { name: 'Low Occupancy (<30%)', impact: 0.8, active: false },
  ]);

  const [pricingHistory, setPricingHistory] = useState<PricingData[]>([
    { time: '6 AM', basePrice: 50, actualPrice: 40, occupancy: 20 },
    { time: '8 AM', basePrice: 50, actualPrice: 55, occupancy: 45 },
    { time: '10 AM', basePrice: 50, actualPrice: 75, occupancy: 75 },
    { time: '12 PM', basePrice: 50, actualPrice: 85, occupancy: 85 },
    { time: '2 PM', basePrice: 50, actualPrice: 90, occupancy: 90 },
    { time: '4 PM', basePrice: 50, actualPrice: 80, occupancy: 80 },
    { time: '6 PM', basePrice: 50, actualPrice: 65, occupancy: 65 },
    { time: '8 PM', basePrice: 50, actualPrice: 45, occupancy: 40 },
  ]);

  // Calculate dynamic price based on active factors
  useEffect(() => {
    if (!isOverrideMode) {
      let multiplier = 1.0;
      factors.forEach(factor => {
        if (factor.active) {
          multiplier *= factor.impact;
        }
      });
      const calculatedPrice = Math.round(basePricePerHour * multiplier);
      setCurrentPrice(calculatedPrice);
    } else {
      setCurrentPrice(overridePrice);
    }
  }, [factors, basePricePerHour, isOverrideMode, overridePrice]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const currentHour = new Date().getHours();
      
      // Update factors based on time
      setFactors(prev => prev.map(factor => {
        if (factor.name.includes('Peak Hour')) {
          return { ...factor, active: currentHour >= 9 && currentHour <= 18 };
        }
        if (factor.name.includes('Weekend')) {
          const day = new Date().getDay();
          return { ...factor, active: day === 0 || day === 6 };
        }
        return factor;
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleFactor = (index: number) => {
    setFactors(prev => prev.map((factor, i) => 
      i === index ? { ...factor, active: !factor.active } : factor
    ));
  };

  const handleOverrideToggle = () => {
    setIsOverrideMode(!isOverrideMode);
    if (!isOverrideMode) {
      setOverridePrice(currentPrice);
    }
  };

  const applyOverride = () => {
    setCurrentPrice(overridePrice);
  };

  const resetToBase = () => {
    setIsOverrideMode(false);
    setOverridePrice(basePricePerHour);
  };

  const priceChangePercent = ((currentPrice - basePricePerHour) / basePricePerHour * 100).toFixed(0);
  const isIncrease = currentPrice > basePricePerHour;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dynamic Pricing Engine</h2>
          <p className="text-sm text-gray-600 mt-1">AI-powered intelligent pricing based on demand</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleOverrideToggle}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isOverrideMode 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isOverrideMode ? '🔓 Override Active' : '🔒 Auto Mode'}
          </button>
          {isOverrideMode && (
            <button
              onClick={resetToBase}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Current Price Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <p className="text-sm text-blue-700 font-medium mb-2">Base Price</p>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-blue-900">₹{basePricePerHour}</span>
            <span className="text-lg text-blue-600 ml-2">/hour</span>
          </div>
          <div className="mt-4">
            <input
              type="range"
              min="30"
              max="100"
              value={basePricePerHour}
              onChange={(e) => setBasePricePerHour(Number(e.target.value))}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              disabled={isOverrideMode}
            />
            <div className="flex justify-between text-xs text-blue-600 mt-1">
              <span>₹30</span>
              <span>₹100</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <p className="text-sm text-green-700 font-medium mb-2">Current Price</p>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-green-900">₹{currentPrice}</span>
            <span className="text-lg text-green-600 ml-2">/hour</span>
          </div>
          <div className={`flex items-center mt-3 ${isIncrease ? 'text-green-700' : 'text-red-700'}`}>
            <svg 
              className={`w-5 h-5 mr-1 ${isIncrease ? 'rotate-0' : 'rotate-180'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="font-semibold">{Math.abs(Number(priceChangePercent))}%</span>
            <span className="text-sm ml-1">vs base</span>
          </div>
        </div>

        {isOverrideMode && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
            <p className="text-sm text-orange-700 font-medium mb-2">Override Price</p>
            <div className="flex items-baseline mb-4">
              <input
                type="number"
                value={overridePrice}
                onChange={(e) => setOverridePrice(Number(e.target.value))}
                className="text-4xl font-bold text-orange-900 bg-transparent border-b-2 border-orange-300 focus:border-orange-500 outline-none w-24"
              />
              <span className="text-lg text-orange-600 ml-2">/hour</span>
            </div>
            <button
              onClick={applyOverride}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Apply Override
            </button>
          </div>
        )}
      </div>

      {/* Pricing Factors */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factors.map((factor, index) => (
            <div
              key={index}
              onClick={() => !isOverrideMode && toggleFactor(index)}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                factor.active
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              } ${isOverrideMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{factor.name}</span>
                <div className={`w-10 h-6 rounded-full transition-colors ${
                  factor.active ? 'bg-primary-600' : 'bg-gray-300'
                } relative`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    factor.active ? 'translate-x-5' : 'translate-x-1'
                  }`}></div>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`text-2xl font-bold ${
                  factor.impact > 1 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {factor.impact > 1 ? '+' : ''}{((factor.impact - 1) * 100).toFixed(0)}%
                </span>
                <span className="text-xs text-gray-600 ml-2">impact</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Trends Chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Trends & Occupancy</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={pricingHistory}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              formatter={(value: any, name: string) => {
                if (name === 'occupancy') return `${value}%`;
                return `₹${value}`;
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area 
              type="monotone" 
              dataKey="basePrice" 
              stroke="#6b7280" 
              fillOpacity={1}
              fill="url(#colorBase)"
              name="Base Price"
            />
            <Area 
              type="monotone" 
              dataKey="actualPrice" 
              stroke="#10b981" 
              fillOpacity={1}
              fill="url(#colorActual)"
              name="Actual Price"
            />
            <Area 
              type="monotone" 
              dataKey="occupancy" 
              stroke="#3b82f6" 
              fill="none"
              strokeWidth={2}
              name="Occupancy %"
              dot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-900">Peak Hour Strategy</p>
              <p className="text-xs text-blue-700 mt-1">Increase prices during 9 AM - 6 PM for optimal revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-900">Occupancy-Based</p>
              <p className="text-xs text-green-700 mt-1">Currently at 85% occupancy - premium pricing active</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-purple-900">Revenue Forecast</p>
              <p className="text-xs text-purple-700 mt-1">Projected ₹45K revenue today with current pricing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPricing;
