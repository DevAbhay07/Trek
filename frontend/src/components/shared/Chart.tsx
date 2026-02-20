import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  [key: string]: any;
}

interface ChartProps {
  data: ChartData[];
  type: 'line' | 'area' | 'bar' | 'pie';
  width?: number | string;
  height?: number;
  colors?: string[];
  title?: string;
  xAxisKey?: string;
  yAxisKey?: string;
  className?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  loading?: boolean;
}

const Chart = ({
  data,
  type,
  width = '100%',
  height = 300,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  title,
  xAxisKey = 'name',
  yAxisKey = 'value',
  className = '',
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  loading = false
}: ChartProps) => {

  const defaultTooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
            <XAxis dataKey={xAxisKey} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            {showTooltip && <Tooltip contentStyle={defaultTooltipStyle} />}
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey={yAxisKey}
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
            <XAxis dataKey={xAxisKey} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            {showTooltip && <Tooltip contentStyle={defaultTooltipStyle} />}
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey={yAxisKey}
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
            <XAxis dataKey={xAxisKey} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            {showTooltip && <Tooltip contentStyle={defaultTooltipStyle} />}
            {showLegend && <Legend />}
            <Bar dataKey={yAxisKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {showTooltip && <Tooltip contentStyle={defaultTooltipStyle} />}
            {showLegend && <Legend />}
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={yAxisKey}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width={width} height={height}>
        {renderChart() || <div>No chart available</div>}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

// Utility function to format data for charts
export const formatChartData = (
  data: any[],
  xKey: string,
  yKey: string,
  nameKey?: string
): ChartData[] => {
  return data.map(item => ({
    name: nameKey ? item[nameKey] : item[xKey],
    value: item[yKey],
    ...item
  }));
};

// Common chart configurations
export const chartConfigs = {
  occupancy: {
    colors: ['#10B981', '#EF4444', '#F59E0B'],
    title: 'Parking Occupancy',
    type: 'pie' as const
  },
  hourlyStats: {
    colors: ['#3B82F6'],
    title: 'Hourly Usage',
    type: 'bar' as const
  },
  dailyRevenue: {
    colors: ['#10B981'],
    title: 'Daily Revenue',
    type: 'line' as const
  },
  weeklyTrends: {
    colors: ['#8B5CF6'],
    title: 'Weekly Trends',
    type: 'area' as const
  }
};