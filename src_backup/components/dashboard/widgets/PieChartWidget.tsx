import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreHorizontal, Maximize2 } from 'lucide-react';

interface PieChartData {
  segments: Array<{
    label: string;
    value: number;
    color: string;
    percentage: number;
    trend?: 'up' | 'down' | 'stable';
    change?: number;
  }>;
  total: number;
  title: string;
  subtitle?: string;
}

interface PieChartWidgetProps {
  data?: PieChartData;
}

const defaultData: PieChartData = {
  title: 'Revenue by Product',
  subtitle: 'Q4 2024 Distribution',
  total: 2450000,
  segments: [
    { label: 'Software Licenses', value: 980000, color: '#3b82f6', percentage: 40, trend: 'up', change: 12.5 },
    { label: 'Professional Services', value: 735000, color: '#10b981', percentage: 30, trend: 'up', change: 8.3 },
    { label: 'Support & Maintenance', value: 490000, color: '#f59e0b', percentage: 20, trend: 'stable', change: 0.2 },
    { label: 'Training', value: 245000, color: '#ef4444', percentage: 10, trend: 'down', change: -3.1 },
  ]
};

export const PieChartWidget: React.FC<PieChartWidgetProps> = ({ data = defaultData }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);

  const radius = 80;
  const centerX = 120;
  const centerY = 120;
  const strokeWidth = 20;

  const createPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const start = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const end = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle);
    const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", start.x, start.y, 
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  let cumulativeAngle = 0;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* 3D Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 30% 30%, #3b82f6 0%, transparent 50%)',
              'radial-gradient(circle at 70% 70%, #10b981 0%, transparent 50%)',
              'radial-gradient(circle at 30% 30%, #3b82f6 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-between relative z-10">
        {/* Pie Chart */}
        <div className="relative">
          <motion.svg
            width="240"
            height="240"
            className="drop-shadow-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            style={{
              filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
            }}
          >
            {/* Background Circle */}
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius + 5}
              fill="none"
              stroke="rgba(0, 0, 0, 0.05)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {/* Pie Segments */}
            {data.segments.map((segment, index) => {
              const startAngle = cumulativeAngle;
              const endAngle = cumulativeAngle + (segment.percentage / 100) * 360;
              const isHovered = hoveredSegment === index;
              const isSelected = selectedSegment === index;
              
              const path = createPath(
                startAngle, 
                endAngle, 
                radius - strokeWidth, 
                radius + (isHovered || isSelected ? 10 : 0)
              );

              cumulativeAngle = endAngle;

              return (
                <motion.g key={index}>
                  <motion.path
                    d={path}
                    fill={segment.color}
                    stroke="white"
                    strokeWidth="3"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() => setSelectedSegment(selectedSegment === index ? null : index)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      filter: isHovered || isSelected 
                        ? `drop-shadow(0 8px 16px ${segment.color}40) brightness(1.1)` 
                        : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 25,
                      delay: index * 0.1 + 0.3 
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      filter: `drop-shadow(0 12px 24px ${segment.color}60) brightness(1.2)`,
                    }}
                    style={{
                      transformOrigin: `${centerX}px ${centerY}px`,
                    }}
                  />
                  
                  {/* Segment Labels */}
                  {(isHovered || isSelected) && (
                    <motion.g
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <motion.text
                        x={centerX}
                        y={centerY - 10}
                        textAnchor="middle"
                        className="text-sm font-bold fill-neutral-800"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        {segment.percentage}%
                      </motion.text>
                      <motion.text
                        x={centerX}
                        y={centerY + 8}
                        textAnchor="middle"
                        className="text-xs fill-neutral-600"
                      >
                        ${(segment.value / 1000).toFixed(0)}K
                      </motion.text>
                    </motion.g>
                  )}
                </motion.g>
              );
            })}

            {/* Center Circle with Total */}
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius - strokeWidth - 5}
              fill="white"
              stroke="rgba(0, 0, 0, 0.1)"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.8 }}
              style={{
                filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))',
              }}
            />
            
            <motion.text
              x={centerX}
              y={centerY - 8}
              textAnchor="middle"
              className="text-xs font-medium fill-neutral-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Total Revenue
            </motion.text>
            <motion.text
              x={centerX}
              y={centerY + 8}
              textAnchor="middle"
              className="text-lg font-bold fill-neutral-800"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 1.2 }}
            >
              ${(data.total / 1000000).toFixed(1)}M
            </motion.text>
          </motion.svg>

          {/* Floating Particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 240}px`,
                top: `${Math.random() * 240}px`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Legend */}
        <motion.div 
          className="flex-1 ml-6 space-y-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {data.segments.map((segment, index) => (
            <motion.div
              key={index}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                hoveredSegment === index || selectedSegment === index
                  ? 'border-blue-300 bg-blue-50 shadow-lg'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md'
              }`}
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => setSelectedSegment(selectedSegment === index ? null : index)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              style={{
                background: hoveredSegment === index || selectedSegment === index
                  ? `linear-gradient(135deg, ${segment.color}10, white)`
                  : 'white',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-4 h-4 rounded-full shadow-lg"
                    style={{ backgroundColor: segment.color }}
                    whileHover={{ scale: 1.2 }}
                    animate={hoveredSegment === index ? { 
                      boxShadow: `0 0 20px ${segment.color}60`,
                      scale: 1.1 
                    } : {}}
                  />
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{segment.label}</p>
                    <p className="text-xs text-neutral-600">${(segment.value / 1000).toFixed(0)}K</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-neutral-800">{segment.percentage}%</p>
                  {segment.trend && segment.change !== undefined && (
                    <motion.div 
                      className={`flex items-center space-x-1 text-xs ${
                        segment.trend === 'up' ? 'text-green-600' : 
                        segment.trend === 'down' ? 'text-red-600' : 'text-neutral-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {segment.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : segment.trend === 'down' ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : (
                        <div className="w-3 h-0.5 bg-neutral-400 rounded" />
                      )}
                      <span className="font-medium">
                        {segment.change > 0 ? '+' : ''}{segment.change}%
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        className="absolute bottom-4 right-4 w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 1.5 }}
      >
        <Maximize2 className="w-4 h-4" />
      </motion.button>
    </div>
  );
}; 