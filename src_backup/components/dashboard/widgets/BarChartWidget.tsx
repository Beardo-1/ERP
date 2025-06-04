import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreHorizontal, BarChart3 } from 'lucide-react';

interface BarChartData {
  categories: Array<{
    label: string;
    value: number;
    color: string;
    trend?: 'up' | 'down' | 'stable';
    change?: number;
    target?: number;
  }>;
  title: string;
  subtitle?: string;
  maxValue: number;
  unit?: string;
}

interface BarChartWidgetProps {
  data?: BarChartData;
}

const defaultData: BarChartData = {
  title: 'Monthly Sales Performance',
  subtitle: 'Revenue by Month (2024)',
  unit: 'K',
  maxValue: 500,
  categories: [
    { label: 'Jan', value: 420, color: '#3b82f6', trend: 'up', change: 12.5, target: 400 },
    { label: 'Feb', value: 380, color: '#10b981', trend: 'down', change: -9.5, target: 400 },
    { label: 'Mar', value: 450, color: '#f59e0b', trend: 'up', change: 18.4, target: 400 },
    { label: 'Apr', value: 320, color: '#ef4444', trend: 'down', change: -28.9, target: 400 },
    { label: 'May', value: 480, color: '#8b5cf6', trend: 'up', change: 50.0, target: 400 },
    { label: 'Jun', value: 390, color: '#06b6d4', trend: 'down', change: -18.8, target: 400 },
  ]
};

export const BarChartWidget: React.FC<BarChartWidgetProps> = ({ data = defaultData }) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  const chartHeight = 200;
  const barWidth = 40;
  const barSpacing = 20;
  const chartWidth = data.categories.length * (barWidth + barSpacing);

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* 3D Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, #10b981 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Chart Icon */}
        <motion.div
          className="absolute top-4 right-4 text-blue-200"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <BarChart3 className="w-8 h-8" />
        </motion.div>
      </div>

      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-4 relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h3 className="text-lg font-bold text-neutral-800 tracking-tight">{data.title}</h3>
          {data.subtitle && (
            <p className="text-sm text-neutral-600">{data.subtitle}</p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-neutral-600" />
        </motion.button>
      </motion.div>

      {/* Chart Container */}
      <div className="flex-1 flex items-end justify-center relative z-10 px-4">
        <div className="relative" style={{ width: chartWidth, height: chartHeight }}>
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map((percentage) => (
            <motion.div
              key={percentage}
              className="absolute left-0 right-0 border-t border-neutral-200/50"
              style={{ bottom: `${percentage}%` }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.3 + percentage * 0.01, duration: 0.5 }}
            />
          ))}

          {/* Bars */}
          {data.categories.map((category, index) => {
            const barHeight = (category.value / data.maxValue) * chartHeight;
            const targetHeight = category.target ? (category.target / data.maxValue) * chartHeight : 0;
            const isHovered = hoveredBar === index;
            const isSelected = selectedBar === index;
            
            return (
              <motion.div
                key={index}
                className="absolute bottom-0 cursor-pointer"
                style={{
                  left: index * (barWidth + barSpacing),
                  width: barWidth,
                }}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
                onClick={() => setSelectedBar(selectedBar === index ? null : index)}
              >
                {/* Target Line */}
                {category.target && (
                  <motion.div
                    className="absolute left-0 right-0 border-t-2 border-dashed border-neutral-400"
                    style={{ bottom: targetHeight }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 0.7, scaleX: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  />
                )}

                {/* Bar */}
                <motion.div
                  className="relative rounded-t-lg shadow-lg"
                  style={{
                    backgroundColor: category.color,
                    height: barHeight,
                  }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: barHeight, 
                    opacity: 1,
                    scale: isHovered || isSelected ? 1.05 : 1,
                    rotateX: isHovered ? -5 : 0,
                    boxShadow: isHovered || isSelected 
                      ? `0 15px 30px ${category.color}40, 0 5px 15px rgba(0,0,0,0.1)`
                      : '0 5px 15px rgba(0,0,0,0.1)',
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    delay: 0.4 + index * 0.1 
                  }}
                  whileHover={{
                    scale: 1.08,
                    rotateX: -8,
                    y: -5,
                    boxShadow: `0 20px 40px ${category.color}50, 0 10px 20px rgba(0,0,0,0.15)`,
                  }}
                >
                  {/* 3D Effect Layer */}
                  <div 
                    className="absolute inset-0 rounded-t-lg opacity-30"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)`,
                    }}
                  />

                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-t-lg opacity-0"
                    animate={{
                      opacity: isHovered ? [0, 0.3, 0] : 0,
                      background: [
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                      ],
                      x: isHovered ? [-50, 50] : 0,
                    }}
                    transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
                  />

                  {/* Value Label */}
                  <AnimatePresence>
                    {(isHovered || isSelected) && (
                      <motion.div
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {category.value}{data.unit}
                        {category.trend && (
                          <span className={`ml-1 ${category.trend === 'up' ? 'text-green-400' : category.trend === 'down' ? 'text-red-400' : 'text-yellow-400'}`}>
                            {category.trend === 'up' ? '↗' : category.trend === 'down' ? '↘' : '→'}
                            {category.change && `${category.change > 0 ? '+' : ''}${category.change}%`}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Category Label */}
                <motion.div
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-neutral-600 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {category.label}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <motion.div 
        className="mt-6 flex flex-wrap gap-3 justify-center relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {data.categories.slice(0, 3).map((category, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedBar(selectedBar === index ? null : index)}
          >
            <motion.div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: category.color }}
              animate={{
                scale: selectedBar === index ? 1.3 : 1,
                boxShadow: selectedBar === index 
                  ? `0 0 10px ${category.color}60` 
                  : '0 2px 4px rgba(0,0,0,0.1)',
              }}
            />
            <span className="text-xs font-medium text-neutral-700">{category.label}</span>
            {category.trend && (
              <span className={`text-xs ${category.trend === 'up' ? 'text-green-500' : category.trend === 'down' ? 'text-red-500' : 'text-yellow-500'}`}>
                {category.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                 category.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : 
                 <span className="w-3 h-3 flex items-center justify-center">→</span>}
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}; 