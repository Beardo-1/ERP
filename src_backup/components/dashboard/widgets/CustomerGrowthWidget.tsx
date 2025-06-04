import React from 'react';
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

interface CustomerData {
  newCustomers: number;
  totalCustomers: number;
  growth: number;
  monthlyData: Array<{
    month: string;
    value: number;
  }>;
}

interface CustomerGrowthWidgetProps {
  data: CustomerData;
}

export const CustomerGrowthWidget: React.FC<CustomerGrowthWidgetProps> = ({ data }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-700" />
          </div>
          <div>
            <div className="text-sm text-neutral-500">Total Customers</div>
            <div className="text-xl font-bold text-neutral-800">
              {data.totalCustomers.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm">
          <div className="text-neutral-500">New This Month</div>
          <div className="font-medium">{data.newCustomers}</div>
        </div>
        
        <div className="flex items-center">
          <TrendingUp className="w-3 h-3 text-success-600 mr-1" />
          <span className="text-sm font-medium text-success-600">+{data.growth}%</span>
        </div>
      </div>
      
      <div className="flex-1 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.monthlyData}>
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10 }}
              padding={{ left: 10, right: 10 }} 
            />
            <Tooltip 
              formatter={(value) => [value, 'Customers']}
              contentStyle={{ 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4f46e5" 
              strokeWidth={2}
              dot={false} 
              activeDot={{ r: 6, fill: '#4f46e5', strokeWidth: 0 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 