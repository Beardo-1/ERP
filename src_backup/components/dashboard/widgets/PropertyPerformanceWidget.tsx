import React from 'react';
import { Home, Star } from 'lucide-react';

interface Property {
  name: string;
  revenue: number;
  occupancy: number;
  rating: number;
}

interface PropertyPerformanceData {
  properties: Property[];
  averageOccupancy: number;
  totalRevenue: number;
  averageRating: number;
}

interface PropertyPerformanceWidgetProps {
  data: PropertyPerformanceData;
}

export const PropertyPerformanceWidget: React.FC<PropertyPerformanceWidgetProps> = ({ data }) => {
  if (!data || !Array.isArray(data.properties)) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-400">
        No property performance data available.
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <Home className="w-4 h-4 text-primary-700" />
        </div>
        <span className="text-sm text-neutral-600">Property Performance</span>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-neutral-500">Avg. Occupancy</div>
          <div className="text-lg font-bold text-blue-700">{data.averageOccupancy}%</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500">Total Revenue</div>
          <div className="text-lg font-bold text-success-700">${data.totalRevenue.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500">Avg. Rating</div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold text-amber-600 mr-1">{data.averageRating}</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-neutral-500">
              <th className="text-left py-1 px-2">Property</th>
              <th className="text-right py-1 px-2">Revenue</th>
              <th className="text-center py-1 px-2">Occupancy</th>
              <th className="text-center py-1 px-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.properties.map((property) => (
              <tr key={property.name} className="border-b border-neutral-100 last:border-0">
                <td className="py-1 px-2 font-medium text-neutral-800 truncate">{property.name}</td>
                <td className="py-1 px-2 text-right text-success-700">${property.revenue.toLocaleString()}</td>
                <td className="py-1 px-2 text-center text-blue-700">{property.occupancy}%</td>
                <td className="py-1 px-2 text-center text-amber-600 flex items-center justify-center">
                  {property.rating} <Star className="w-3 h-3 text-amber-400 ml-1" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 