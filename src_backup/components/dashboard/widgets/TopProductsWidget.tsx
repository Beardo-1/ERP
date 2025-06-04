import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  value: number;
  sales: number;
  change: number;
}

interface TopProductsWidgetProps {
  data: Product[];
}

export const TopProductsWidget: React.FC<TopProductsWidgetProps> = ({ data }) => {
  const chartData = data.slice(0, 5).map(product => ({
    name: product.name,
    value: product.value,
  }));

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <Package className="w-4 h-4 text-primary-700" />
        </div>
        <span className="text-sm text-neutral-600">Top Selling Products</span>
      </div>
      
      <div className="h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" hide />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              labelStyle={{ color: '#333' }}
              contentStyle={{ 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#4f46e5" 
              radius={[0, 4, 4, 0]} 
              barSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {data.map((product) => (
          <div 
            key={product.id} 
            className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
          >
            <span className="text-sm font-medium text-neutral-800 truncate pr-2">
              {product.name}
            </span>
            <div className="flex items-baseline">
              <span className="text-sm font-semibold">${product.value.toLocaleString()}</span>
              <span 
                className={`ml-2 text-xs ${
                  product.change > 0 ? 'text-success-600' : 'text-error-600'
                }`}
              >
                {product.change > 0 ? '+' : ''}{product.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 