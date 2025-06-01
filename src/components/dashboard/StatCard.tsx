import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  trend = 'neutral',
  className = '',
}) => {
  const trendColors = {
    up: 'text-success-500',
    down: 'text-error-500',
    neutral: 'text-neutral-500',
  };
  
  const trendBgColors = {
    up: 'bg-success-50',
    down: 'bg-error-50',
    neutral: 'bg-neutral-100',
  };
  
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : null;
  
  return (
    <motion.div
      className={`bg-white rounded-xl p-4 shadow-card ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <div className={`flex items-center space-x-1 text-sm ${trendColors[trend]}`}>
                {TrendIcon && <TrendIcon size={16} />}
                <span>{Math.abs(change)}%</span>
              </div>
              <span className="text-xs text-neutral-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-lg ${trendBgColors[trend]}`}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};