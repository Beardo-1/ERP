import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Channel {
  name: string;
  spent: number;
  revenue: number;
  roi: number;
}

interface MarketingROIData {
  channels: Channel[];
  totalSpent: number;
  totalRevenue: number;
  overallROI: number;
}

interface MarketingROIWidgetProps {
  data: MarketingROIData;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e42', '#8b5cf6', '#f43f5e'];

export const MarketingROIWidget: React.FC<MarketingROIWidgetProps> = ({ data }) => {
  if (!data || !Array.isArray(data.channels)) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-400">
        No marketing ROI data available.
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-500">Total Spent</div>
          <div className="text-lg font-bold text-neutral-800">${data.totalSpent.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-neutral-500">Total Revenue</div>
          <div className="text-lg font-bold text-success-700">${data.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-primary-600" />
          <span className="text-lg font-bold text-primary-600">{data.overallROI}% ROI</span>
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.channels} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} />
            <YAxis hide={true} />
            <Tooltip 
              formatter={(value: number, name: string) => [name === 'roi' ? `${value}%` : `$${value.toLocaleString()}`, name === 'roi' ? 'ROI' : name.charAt(0).toUpperCase() + name.slice(1)]}
              labelStyle={{ color: '#333' }}
              contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="spent" fill="#818cf8" name="Spent" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="roi" fill="#f59e42" name="ROI (%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 