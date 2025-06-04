import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MapPin } from 'lucide-react';

interface Region {
  name: string;
  value: number;
  percentage: number;
}

interface SalesByRegionData {
  regions: Region[];
  topPerforming: string;
  lowestPerforming: string;
}

interface SalesByRegionWidgetProps {
  data: SalesByRegionData;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e42', '#8b5cf6', '#f43f5e'];

export const SalesByRegionWidget: React.FC<SalesByRegionWidgetProps> = ({ data }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-primary-700" />
        </div>
        <span className="text-sm text-neutral-600">Sales by Region</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie
              data={data.regions}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={48}
              paddingAngle={4}
              label={false}
            >
              {data.regions.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-2 w-full">
          {data.regions.map((region, idx) => (
            <div key={region.name} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ background: COLORS[idx % COLORS.length] }}></div>
              <span className="text-xs text-neutral-600">{region.name} ({region.percentage}%)</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between w-full text-xs text-neutral-500">
          <span>Top: <span className="text-success-600 font-medium">{data.topPerforming}</span></span>
          <span>Lowest: <span className="text-error-600 font-medium">{data.lowestPerforming}</span></span>
        </div>
      </div>
    </div>
  );
}; 