import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';

interface GaugeData {
  title: string;
  subtitle?: string;
  value: number;
  maxValue: number;
  unit?: string;
  target?: number;
  thresholds?: {
    low: { value: number; color: string; label: string };
    medium: { value: number; color: string; label: string };
    high: { value: number; color: string; label: string };
  };
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}

interface GaugeWidgetProps {
  data?: GaugeData;
}

const defaultData: GaugeData = {
  title: 'Customer Satisfaction',
  subtitle: 'Current Score',
  value: 87,
  maxValue: 100,
  unit: '%',
  target: 90,
  thresholds: {
    low: { value: 60, color: '#ef4444', label: 'Needs Improvement' },
    medium: { value: 80, color: '#f59e0b', label: 'Good' },
    high: { value: 90, color: '#10b981', label: 'Excellent' },
  },
  trend: 'up',
  change: 5.2,
};

export const GaugeWidget: React.FC<GaugeWidgetProps> = ({ data = defaultData }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(data.value);
    }, 500);
    return () => clearTimeout(timer);
  }, [data.value]);

  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  
  // Calculate progress
  const progress = (animatedValue / data.maxValue) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Calculate target position
  const targetProgress = data.target ? (data.target / data.maxValue) * 100 : 0;
  const targetOffset = circumference - (targetProgress / 100) * circumference;

  // Determine current threshold
  const getCurrentThreshold = () => {
    if (!data.thresholds) return { color: '#3b82f6', label: 'Normal' };
    
    if (data.value >= data.thresholds.high.value) return data.thresholds.high;
    if (data.value >= data.thresholds.medium.value) return data.thresholds.medium;
    return data.thresholds.low;
  };

  const currentThreshold = getCurrentThreshold();

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* 3D Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(circle at 30% 30%, ${currentThreshold.color}40 0%, transparent 50%)`,
              `radial-gradient(circle at 70% 70%, ${currentThreshold.color}60 0%, transparent 50%)`,
              `radial-gradient(circle at 30% 30%, ${currentThreshold.color}40 0%, transparent 50%)`,
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Target Icon */}
        <motion.div
          className="absolute top-4 right-4 text-blue-200"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Target className="w-6 h-6" />
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

      {/* Gauge Container */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <motion.div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
            style={{
              filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
            }}
          >
            {/* Background Circle */}
            <motion.circle
              stroke="rgba(0, 0, 0, 0.1)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />

            {/* Target Indicator */}
            {data.target && (
              <motion.circle
                stroke="#6b7280"
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="4 4"
                strokeDashoffset={targetOffset}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: targetProgress / 100 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            )}

            {/* Progress Circle */}
            <motion.circle
              stroke={currentThreshold.color}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ 
                strokeDashoffset: strokeDashoffset,
                stroke: currentThreshold.color,
                filter: isHovered 
                  ? `drop-shadow(0 0 20px ${currentThreshold.color}60) brightness(1.2)`
                  : 'none',
              }}
              transition={{ 
                duration: 2, 
                delay: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              style={{
                transformOrigin: `${radius}px ${radius}px`,
              }}
            />

            {/* Glow Effect */}
            <motion.circle
              stroke={currentThreshold.color}
              fill="transparent"
              strokeWidth={strokeWidth + 4}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeLinecap="round"
              opacity={0}
              animate={{
                opacity: isHovered ? 0.3 : 0,
                strokeDashoffset: strokeDashoffset,
              }}
              transition={{ duration: 0.3 }}
            />
          </svg>

          {/* Center Content */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.div
              className="text-3xl font-bold text-neutral-800"
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                color: isHovered ? currentThreshold.color : '#1f2937',
              }}
              transition={{ duration: 0.3 }}
            >
              {Math.round(animatedValue)}{data.unit}
            </motion.div>
            
            <motion.div
              className="text-xs text-neutral-500 font-medium mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              of {data.maxValue}{data.unit}
            </motion.div>

            {/* Trend Indicator */}
            {data.trend && data.change && (
              <motion.div
                className={`flex items-center mt-2 text-xs font-semibold ${
                  data.trend === 'up' ? 'text-green-500' : 
                  data.trend === 'down' ? 'text-red-500' : 'text-yellow-500'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
              >
                {data.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : data.trend === 'down' ? (
                  <TrendingDown className="w-3 h-3 mr-1" />
                ) : (
                  <span className="w-3 h-3 mr-1 flex items-center justify-center">→</span>
                )}
                {data.change > 0 ? '+' : ''}{data.change}%
              </motion.div>
            )}
          </motion.div>

          {/* Floating Particles */}
          {isHovered && Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: currentThreshold.color,
                left: `${50 + Math.cos(i * Math.PI / 4) * 60}%`,
                top: `${50 + Math.sin(i * Math.PI / 4) * 60}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Status and Target Info */}
      <motion.div 
        className="mt-4 space-y-2 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-600">Status:</span>
          <motion.span
            className="text-sm font-semibold px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${currentThreshold.color}20`,
              color: currentThreshold.color,
            }}
            whileHover={{ scale: 1.05 }}
          >
            {currentThreshold.label}
          </motion.span>
        </div>

        {/* Target Info */}
        {data.target && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600">Target:</span>
            <span className="text-sm font-semibold text-neutral-800">
              {data.target}{data.unit}
            </span>
          </div>
        )}

        {/* Progress to Target */}
        {data.target && (
          <motion.div 
            className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: currentThreshold.color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((data.value / data.target) * 100, 100)}%` }}
              transition={{ delay: 2, duration: 1, type: "spring", stiffness: 100 }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}; 