import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreHorizontal, Activity } from 'lucide-react';

interface AreaChartData {
  title: string;
  subtitle?: string;
  data: Array<{
    label: string;
    value: number;
    date?: string;
  }>;
  color: string;
  gradientColor: string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  maxValue?: number;
}

interface AreaChartWidgetProps {
  data?: AreaChartData;
}

const defaultData: AreaChartData = {
  title: 'Website Traffic',
  subtitle: 'Visitors over time',
  unit: 'K',
  color: '#3b82f6',
  gradientColor: '#93c5fd',
  trend: 'up',
  change: 15.3,
  data: [
    { label: 'Jan', value: 45, date: '2024-01' },
    { label: 'Feb', value: 52, date: '2024-02' },
    { label: 'Mar', value: 48, date: '2024-03' },
    { label: 'Apr', value: 61, date: '2024-04' },
    { label: 'May', value: 55, date: '2024-05' },
    { label: 'Jun', value: 67, date: '2024-06' },
    { label: 'Jul', value: 73, date: '2024-07' },
    { label: 'Aug', value: 69, date: '2024-08' },
    { label: 'Sep', value: 78, date: '2024-09' },
    { label: 'Oct', value: 82, date: '2024-10' },
    { label: 'Nov', value: 89, date: '2024-11' },
    { label: 'Dec', value: 95, date: '2024-12' },
  ]
};

export const AreaChartWidget: React.FC<AreaChartWidgetProps> = ({ data = defaultData }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  const chartWidth = 300;
  const chartHeight = 150;
  const padding = 20;
  
  const maxValue = data.maxValue || Math.max(...data.data.map(d => d.value));
  const minValue = Math.min(...data.data.map(d => d.value));
  
  // Create SVG path for the area
  const createAreaPath = () => {
    const points = data.data.map((point, index) => {
      const x = padding + (index / (data.data.length - 1)) * (chartWidth - 2 * padding);
      const y = padding + ((maxValue - point.value) / (maxValue - minValue)) * (chartHeight - 2 * padding);
      return { x, y, value: point.value, label: point.label };
    });

    const pathData = points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${path} L ${point.x} ${point.y}`;
    }, '');

    const areaPath = `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;
    
    return { pathData, areaPath, points };
  };

  const { pathData, areaPath, points } = createAreaPath();

  React.useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* 3D Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(circle at 20% 20%, ${data.color}40 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 80%, ${data.gradientColor}60 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 20%, ${data.color}40 0%, transparent 50%)`,
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Activity Icon */}
        <motion.div
          className="absolute top-4 right-4 text-blue-200"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Activity className="w-6 h-6" />
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
        <div className="flex items-center space-x-2">
          {data.trend && data.change && (
            <motion.div
              className={`flex items-center text-sm font-semibold ${
                data.trend === 'up' ? 'text-green-500' : 
                data.trend === 'down' ? 'text-red-500' : 'text-yellow-500'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {data.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : data.trend === 'down' ? (
                <TrendingDown className="w-4 h-4 mr-1" />
              ) : (
                <span className="w-4 h-4 mr-1 flex items-center justify-center">→</span>
              )}
              {data.change > 0 ? '+' : ''}{data.change}%
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-neutral-600" />
          </motion.button>
        </div>
      </motion.div>

      {/* Chart Container */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <motion.svg
          width={chartWidth}
          height={chartHeight}
          className="overflow-visible"
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={data.color} stopOpacity="0.8" />
              <stop offset="50%" stopColor={data.gradientColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={data.color} stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={data.color} />
              <stop offset="50%" stopColor={data.gradientColor} />
              <stop offset="100%" stopColor={data.color} />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map((percentage) => {
            const y = padding + (percentage / 100) * (chartHeight - 2 * padding);
            return (
              <motion.line
                key={percentage}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth="1"
                strokeDasharray="2 2"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ delay: 0.3 + percentage * 0.01, duration: 0.5 }}
              />
            );
          })}

          {/* Area Fill */}
          <motion.path
            d={areaPath}
            fill="url(#areaGradient)"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ 
              opacity: isAnimated ? 1 : 0,
              pathLength: isAnimated ? 1 : 0,
            }}
            transition={{ 
              delay: 0.5, 
              duration: 2,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          />

          {/* Line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isAnimated ? 1 : 0 }}
            transition={{ 
              delay: 0.8, 
              duration: 2,
              type: "spring",
              stiffness: 150,
              damping: 20
            }}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
            }}
          />

          {/* Data Points */}
          {points.map((point, index) => (
            <motion.g key={index}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === index ? 6 : 4}
                fill={data.color}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  boxShadow: hoveredPoint === index 
                    ? `0 0 20px ${data.color}60`
                    : 'none',
                }}
                transition={{ 
                  delay: 1 + index * 0.1,
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}
                whileHover={{
                  scale: 1.5,
                  filter: `drop-shadow(0 0 15px ${data.color}80)`,
                }}
                style={{
                  filter: hoveredPoint === index 
                    ? `drop-shadow(0 0 10px ${data.color}60)`
                    : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                }}
              />
              
              {/* Ripple Effect on Hover */}
              {hoveredPoint === index && (
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  fill="none"
                  stroke={data.color}
                  strokeWidth="2"
                  opacity={0}
                  animate={{
                    r: [4, 20],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
            </motion.g>
          ))}

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredPoint !== null && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <motion.rect
                  x={points[hoveredPoint].x - 25}
                  y={points[hoveredPoint].y - 35}
                  width="50"
                  height="25"
                  rx="4"
                  fill="rgba(0, 0, 0, 0.8)"
                  stroke="white"
                  strokeWidth="1"
                />
                <motion.text
                  x={points[hoveredPoint].x}
                  y={points[hoveredPoint].y - 20}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="600"
                >
                  {points[hoveredPoint].value}{data.unit}
                </motion.text>
                <motion.text
                  x={points[hoveredPoint].x}
                  y={points[hoveredPoint].y - 8}
                  textAnchor="middle"
                  fill="rgba(255, 255, 255, 0.7)"
                  fontSize="10"
                >
                  {data.data[hoveredPoint].label}
                </motion.text>
              </motion.g>
            )}
          </AnimatePresence>
        </motion.svg>
      </div>

      {/* Stats Summary */}
      <motion.div 
        className="mt-4 grid grid-cols-3 gap-4 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-sm font-semibold text-neutral-800">
            {Math.max(...data.data.map(d => d.value))}{data.unit}
          </div>
          <div className="text-xs text-neutral-500">Peak</div>
        </motion.div>
        
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-sm font-semibold text-neutral-800">
            {Math.round(data.data.reduce((sum, d) => sum + d.value, 0) / data.data.length)}{data.unit}
          </div>
          <div className="text-xs text-neutral-500">Average</div>
        </motion.div>
        
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-sm font-semibold text-neutral-800">
            {data.data[data.data.length - 1].value}{data.unit}
          </div>
          <div className="text-xs text-neutral-500">Current</div>
        </motion.div>
      </motion.div>
    </div>
  );
}; 