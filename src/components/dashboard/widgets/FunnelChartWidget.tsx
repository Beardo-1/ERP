import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreHorizontal, Maximize2, Users, ArrowDown } from 'lucide-react';

interface FunnelStage {
  label: string;
  value: number;
  percentage: number;
  color: string;
  conversionRate?: number;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}

interface FunnelChartData {
  title: string;
  subtitle?: string;
  stages: FunnelStage[];
  totalLeads: number;
  conversionRate: number;
}

interface FunnelChartWidgetProps {
  data?: FunnelChartData;
}

const defaultData: FunnelChartData = {
  title: 'Sales Funnel',
  subtitle: 'Lead Conversion Pipeline',
  totalLeads: 10000,
  conversionRate: 12.5,
  stages: [
    { 
      label: 'Website Visitors', 
      value: 10000, 
      percentage: 100, 
      color: '#3b82f6',
      conversionRate: 100,
      trend: 'up',
      change: 8.5
    },
    { 
      label: 'Leads Generated', 
      value: 3500, 
      percentage: 35, 
      color: '#10b981',
      conversionRate: 35,
      trend: 'up',
      change: 12.3
    },
    { 
      label: 'Qualified Leads', 
      value: 1750, 
      percentage: 17.5, 
      color: '#f59e0b',
      conversionRate: 50,
      trend: 'stable',
      change: 0.8
    },
    { 
      label: 'Opportunities', 
      value: 875, 
      percentage: 8.75, 
      color: '#ef4444',
      conversionRate: 50,
      trend: 'up',
      change: 5.2
    },
    { 
      label: 'Customers', 
      value: 250, 
      percentage: 2.5, 
      color: '#8b5cf6',
      conversionRate: 28.6,
      trend: 'up',
      change: 15.7
    }
  ]
};

export const FunnelChartWidget: React.FC<FunnelChartWidgetProps> = ({ data = defaultData }) => {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const maxWidth = 300;
  const stageHeight = 60;
  const spacing = 8;

  const getStageWidth = (percentage: number) => {
    return (percentage / 100) * maxWidth;
  };

  const getDropoffRate = (currentIndex: number) => {
    if (currentIndex === 0) return 0;
    const current = data.stages[currentIndex];
    const previous = data.stages[currentIndex - 1];
    return ((previous.value - current.value) / previous.value) * 100;
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* 3D Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 30% 20%, #3b82f6 0%, transparent 50%)',
              'radial-gradient(circle at 70% 80%, #8b5cf6 0%, transparent 50%)',
              'radial-gradient(circle at 30% 20%, #3b82f6 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-6 relative z-10"
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
        <div className="flex items-center space-x-3">
          <motion.div
            className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200"
            whileHover={{ scale: 1.02 }}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <div className="text-right">
              <p className="text-xs text-blue-600 font-medium">Total Conversion</p>
              <p className="text-sm font-bold text-blue-800">{data.conversionRate}%</p>
            </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-neutral-600" />
          </motion.button>
        </div>
      </motion.div>

      {/* Funnel Chart */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 space-y-2">
        {data.stages.map((stage, index) => {
          const stageWidth = getStageWidth(stage.percentage);
          const isHovered = hoveredStage === index;
          const isSelected = selectedStage === index;
          const dropoffRate = getDropoffRate(index);

          return (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                delay: index * 0.15 + 0.2 
              }}
            >
              {/* Dropoff Indicator */}
              {index > 0 && (
                <motion.div
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 + 0.5 }}
                >
                  <ArrowDown className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-600 font-medium">
                    -{dropoffRate.toFixed(1)}%
                  </span>
                </motion.div>
              )}

              {/* Funnel Stage */}
              <motion.div
                className={`relative cursor-pointer transition-all duration-300 ${
                  isHovered || isSelected ? 'z-10' : 'z-0'
                }`}
                style={{
                  width: `${stageWidth}px`,
                  height: `${stageHeight}px`,
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
                onMouseEnter={() => setHoveredStage(index)}
                onMouseLeave={() => setHoveredStage(null)}
                onClick={() => setSelectedStage(selectedStage === index ? null : index)}
                whileHover={{ 
                  scale: 1.05, 
                  y: -4,
                  rotateX: 5,
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Main Stage Rectangle */}
                <motion.div
                  className="w-full h-full rounded-xl shadow-lg relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${stage.color}, ${stage.color}dd)`,
                    boxShadow: isHovered || isSelected 
                      ? `0 12px 24px ${stage.color}40, 0 0 0 2px ${stage.color}60`
                      : `0 6px 12px ${stage.color}30`,
                  }}
                  animate={isHovered || isSelected ? {
                    boxShadow: `0 16px 32px ${stage.color}50, 0 0 0 3px ${stage.color}80`,
                    filter: 'brightness(1.1)',
                  } : {}}
                >
                  {/* Animated Background Pattern */}
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        `radial-gradient(circle at 0% 0%, white 0%, transparent 50%)`,
                        `radial-gradient(circle at 100% 100%, white 0%, transparent 50%)`,
                        `radial-gradient(circle at 0% 0%, white 0%, transparent 50%)`,
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Content */}
                  <div className="relative z-10 h-full flex items-center justify-between px-4">
                    <div className="flex-1">
                      <motion.p 
                        className="text-white font-semibold text-sm"
                        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                      >
                        {stage.label}
                      </motion.p>
                      <motion.p 
                        className="text-white/90 text-xs"
                        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                      >
                        {stage.value.toLocaleString()} leads
                      </motion.p>
                    </div>
                    <div className="text-right">
                      <motion.p 
                        className="text-white font-bold text-lg"
                        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                      >
                        {stage.percentage}%
                      </motion.p>
                      {stage.conversionRate && index > 0 && (
                        <motion.p 
                          className="text-white/80 text-xs"
                          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                        >
                          {stage.conversionRate}% conv.
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                      ease: "easeInOut",
                    }}
                    style={{
                      transform: 'skewX(-20deg)',
                    }}
                  />
                </motion.div>

                {/* 3D Depth Effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${stage.color}aa, ${stage.color}88)`,
                    transform: 'translateZ(-4px) translateY(2px)',
                    filter: 'blur(1px)',
                  }}
                  animate={isHovered || isSelected ? {
                    transform: 'translateZ(-6px) translateY(3px)',
                  } : {}}
                />
              </motion.div>

              {/* Hover/Selected Details */}
              <AnimatePresence>
                {(isHovered || isSelected) && (
                  <motion.div
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 translate-x-full bg-white rounded-lg shadow-xl border border-neutral-200 p-3 min-w-[200px] z-20"
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="space-y-2">
                      <h4 className="font-semibold text-neutral-800">{stage.label}</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-neutral-600">Volume</p>
                          <p className="font-bold text-neutral-800">{stage.value.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Percentage</p>
                          <p className="font-bold text-neutral-800">{stage.percentage}%</p>
                        </div>
                        {stage.conversionRate && index > 0 && (
                          <>
                            <div>
                              <p className="text-neutral-600">Conversion</p>
                              <p className="font-bold text-neutral-800">{stage.conversionRate}%</p>
                            </div>
                            <div>
                              <p className="text-neutral-600">Drop-off</p>
                              <p className="font-bold text-red-600">{dropoffRate.toFixed(1)}%</p>
                            </div>
                          </>
                        )}
                      </div>
                      {stage.trend && stage.change !== undefined && (
                        <div className="flex items-center space-x-2 pt-2 border-t border-neutral-200">
                          <div className={`flex items-center space-x-1 text-xs ${
                            stage.trend === 'up' ? 'text-green-600' : 
                            stage.trend === 'down' ? 'text-red-600' : 'text-neutral-600'
                          }`}>
                            {stage.trend === 'up' ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : stage.trend === 'down' ? (
                              <TrendingDown className="w-3 h-3" />
                            ) : (
                              <div className="w-3 h-0.5 bg-neutral-400 rounded" />
                            )}
                            <span className="font-medium">
                              {stage.change > 0 ? '+' : ''}{stage.change}% vs last period
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Arrow pointing to stage */}
                    <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
                      <div className="w-2 h-2 bg-white border-l border-b border-neutral-200 transform rotate-45"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <motion.div 
        className="mt-6 grid grid-cols-3 gap-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="bg-white rounded-lg p-3 border border-neutral-200 shadow-sm"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <p className="text-xs text-neutral-600 mb-1">Total Leads</p>
          <p className="text-lg font-bold text-neutral-800">{data.totalLeads.toLocaleString()}</p>
        </motion.div>
        <motion.div
          className="bg-white rounded-lg p-3 border border-neutral-200 shadow-sm"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <p className="text-xs text-neutral-600 mb-1">Customers</p>
          <p className="text-lg font-bold text-neutral-800">{data.stages[data.stages.length - 1].value}</p>
        </motion.div>
        <motion.div
          className="bg-white rounded-lg p-3 border border-neutral-200 shadow-sm"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <p className="text-xs text-neutral-600 mb-1">Conversion Rate</p>
          <p className="text-lg font-bold text-green-600">{data.conversionRate}%</p>
        </motion.div>
      </motion.div>

      {/* Floating Particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}

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