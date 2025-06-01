import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Deal {
  id: string;
  propertyName: string;
  value: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  change: number;
}

interface RecentDealsWidgetProps {
  data: Deal[];
}

export const RecentDealsWidget: React.FC<RecentDealsWidgetProps> = ({ data }) => {
  const deals = data || [];
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {deals.map((deal) => (
          <div 
            key={deal.id} 
            className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
          >
            <div className="flex-1">
              <p className="font-medium text-sm text-neutral-800">{deal.propertyName}</p>
              <p className="text-xs text-neutral-500">{new Date(deal.date).toLocaleDateString()}</p>
            </div>
            
            <div className="flex flex-col items-end">
              <p className="font-semibold text-sm">${deal.value.toLocaleString()}</p>
              <div className="flex items-center">
                {deal.change > 0 ? (
                  <ArrowUpRight className="w-3 h-3 text-success-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-error-500 mr-1" />
                )}
                <span 
                  className={`text-xs ${
                    deal.change > 0 ? 'text-success-500' : 'text-error-500'
                  }`}
                >
                  {Math.abs(deal.change)}%
                </span>
              </div>
            </div>
            
            <div className="ml-4">
              <span 
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  deal.status === 'completed' 
                    ? 'bg-success-100 text-success-700' 
                    : deal.status === 'pending' 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-error-100 text-error-700'
                }`}
              >
                {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-neutral-100">
        <button className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors">
          View all deals
        </button>
      </div>
    </div>
  );
}; 