import React from 'react';
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TimelinePoint {
  month: string;
  actual?: number;
  forecast: number;
}

interface RevenueForecastData {
  current: number;
  projected: number;
  growth: number;
  timeline: TimelinePoint[];
}

interface RevenueForecastWidgetProps {
  data: RevenueForecastData;
}

export const RevenueForecastWidget: React.FC<RevenueForecastWidgetProps> = ({ data }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-500">Current Revenue</div>
          <div className="text-xl font-bold text-neutral-800">${data.current.toLocaleString()}</div>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-success-600" />
          <span className="text-lg font-bold text-success-600">+{data.growth}%</span>
        </div>
        <div>
          <div className="text-sm text-neutral-500">Projected</div>
          <div className="text-xl font-bold text-primary-700">${data.projected.toLocaleString()}</div>
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10} />
            <YAxis hide={true} />
            <Tooltip 
              formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === 'actual' ? 'Actual' : 'Forecast']}
              labelStyle={{ color: '#333' }}
              contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="forecast" stroke="#818cf8" fill="#818cf8" fillOpacity={0.15} name="Forecast" />
            <Line type="monotone" dataKey="actual" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Actual" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 