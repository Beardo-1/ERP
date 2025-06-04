import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';

interface ChartProps {
  data: any[];
  type: 'area' | 'line' | 'bar' | 'pie';
  dataKey: string;
  xAxisKey: string;
  colors?: string[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showAxis?: boolean;
  className?: string;
}

export const DashboardChart: React.FC<ChartProps> = ({
  data,
  type,
  dataKey,
  xAxisKey,
  colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'],
  height = 250,
  showGrid = true,
  showTooltip = true,
  showAxis = true,
  className = '',
}) => {
  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            {showAxis && <XAxis dataKey={xAxisKey} />}
            {showAxis && <YAxis />}
            {showTooltip && <Tooltip />}
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={colors[0]} 
              fill={colors[0]} 
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      
      case 'line':
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            {showAxis && <XAxis dataKey={xAxisKey} />}
            {showAxis && <YAxis />}
            {showTooltip && <Tooltip />}
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={colors[0]} 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            {showAxis && <XAxis dataKey={xAxisKey} />}
            {showAxis && <YAxis />}
            {showTooltip && <Tooltip />}
            <Bar 
              dataKey={dataKey} 
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={30}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={xAxisKey}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip />}
          </PieChart>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};