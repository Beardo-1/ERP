import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, Eye, EyeOff, Target, Users, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SalesData {
  currentMonth: number;
  previousMonth: number;
  growth: number;
  byMonth: Array<{
    month: string;
    value: number;
  }>;
  target: number;
  deals: number;
  customers: number;
  conversion: number;
}

interface SalesOverviewWidgetProps {
  data: SalesData;
}

export const SalesOverviewWidget: React.FC<SalesOverviewWidgetProps> = ({ data }) => {
  const [animatedCurrentMonth, setAnimatedCurrentMonth] = useState(0);
  const [animatedPreviousMonth, setAnimatedPreviousMonth] = useState(0);
  const [animatedGrowth, setAnimatedGrowth] = useState(0);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [viewMode, setViewMode] = useState<'chart' | 'comparison'>('chart');

  if (!data) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex items-center justify-center text-neutral-400"
      >
        <div className="text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
          <p>No sales data available</p>
        </div>
      </motion.div>
    );
  }

  const {
    currentMonth = 0,
    previousMonth = 0,
    growth = 0,
    byMonth = [],
    target = 0,
    deals = 0,
    customers = 0,
    conversion = 0
  } = data;

  // Animate numbers on mount
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedCurrentMonth(Math.floor(currentMonth * easeOutQuart));
      setAnimatedPreviousMonth(Math.floor(previousMonth * easeOutQuart));
      setAnimatedGrowth(Number((growth * easeOutQuart).toFixed(1)));
      
      currentStep++;
      if (currentStep > steps) {
        clearInterval(interval);
        setAnimatedCurrentMonth(currentMonth);
        setAnimatedPreviousMonth(previousMonth);
        setAnimatedGrowth(growth);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [currentMonth, previousMonth, growth]);

  // Enhanced chart data with colors based on performance
  const enhancedChartData = byMonth.map((item, index) => ({
    ...item,
    isHighlighted: hoveredBar === index,
    color: hoveredBar === index ? '#3b82f6' : '#4f46e5',
    performance: index > 0 ? 
      ((item.value - byMonth[index - 1].value) / byMonth[index - 1].value * 100).toFixed(1) : 0
  }));

  const maxValue = Math.max(...byMonth.map(item => item.value));
  const minValue = Math.min(...byMonth.map(item => item.value));

  const targetProgress = target > 0 ? (currentMonth / target) * 100 : 0;
  const isPositiveGrowth = growth >= 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200"
        >
          <p className="font-semibold text-neutral-800">{label}</p>
          <p className="text-primary-600">
            Revenue: <span className="font-bold">${payload[0].value.toLocaleString()}</span>
          </p>
          {data.performance !== 0 && (
            <p className={`text-sm ${data.performance > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.performance > 0 ? '+' : ''}{data.performance}% vs prev month
            </p>
          )}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col relative"
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* 3D Background Layer */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/30 pointer-events-none"
        style={{ transform: 'translateZ(-5px)' }}
        animate={{
          background: [
            'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.03) 100%)',
            'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.05) 100%)',
            'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.03) 100%)',
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header with toggle buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center"
          >
            <DollarSign className="w-4 h-4 text-white" />
          </motion.div>
          <span className="text-sm font-medium text-neutral-700">Sales Overview</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDetails(!showDetails)}
            className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
          >
            {showDetails ? <Eye className="w-4 h-4 text-neutral-500" /> : <EyeOff className="w-4 h-4 text-neutral-500" />}
          </motion.button>
          
          <div className="flex bg-neutral-100 rounded-lg p-0.5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('chart')}
              className={`px-2 py-1 text-xs rounded-md transition-all ${
                viewMode === 'chart' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Chart
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('comparison')}
              className={`px-2 py-1 text-xs rounded-md transition-all ${
                viewMode === 'comparison' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Compare
            </motion.button>
          </div>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 overflow-hidden"
          >
            {viewMode === 'chart' ? (
              <div className="grid grid-cols-2 gap-3">
                {/* Current Month Card */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gradient-to-br from-primary-50 to-primary-100 p-3 rounded-lg border border-primary-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-primary-600 font-medium">This Month</span>
                    <Calendar className="w-3 h-3 text-primary-500" />
                  </div>
                  <div className="text-lg font-bold text-primary-700">
                    {formatCurrency(currentMonth)}
                  </div>
                  <div className="text-xs text-primary-600">
                    {((currentMonth / maxValue) * 100).toFixed(0)}% of peak
                  </div>
                </motion.div>

                {/* Growth Card */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`p-3 rounded-lg border ${
                    growth >= 0 
                      ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                      : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-neutral-600">Growth</span>
                    {growth >= 0 ? 
                      <TrendingUp className="w-3 h-3 text-green-500" /> : 
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    }
                  </div>
                  <div className={`text-lg font-bold ${growth >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {growth >= 0 ? '+' : ''}{formatPercentage(growth)}
                  </div>
                  <div className="text-xs text-neutral-600">
                    vs {formatCurrency(previousMonth)}
                  </div>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-neutral-50 p-3 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-neutral-600">Month-over-Month</div>
                    <div className="text-2xl font-bold text-neutral-800">
                      {formatCurrency(currentMonth - previousMonth)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neutral-600">Average</div>
                    <div className="text-lg font-semibold text-neutral-700">
                      {formatCurrency(Math.floor(byMonth.reduce((sum, item) => sum + item.value, 0) / byMonth.length))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="h-32 mt-2"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={enhancedChartData}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              fontSize={10}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis hide={true} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              onMouseEnter={(_, index) => setHoveredBar(index)}
            >
              {enhancedChartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    filter: hoveredBar === index ? 'brightness(1.1)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Performance Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mt-3 flex justify-between text-xs text-neutral-500"
      >
        <span>Peak: {formatCurrency(maxValue)}</span>
        <span>Low: {formatCurrency(minValue)}</span>
        <span>Range: {formatCurrency(maxValue - minValue)}</span>
      </motion.div>

      {/* Target Progress */}
      <motion.div 
        className="mb-4 relative"
        style={{ transform: 'translateZ(8px)' }}
        whileHover={{ transform: 'translateZ(12px) rotateY(2deg)' }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-between mb-2">
          <motion.span 
            className="text-sm font-medium text-neutral-600 flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Target className="w-4 h-4 mr-1 text-orange-500" />
            Target Progress
          </motion.span>
          <motion.span 
            className="text-sm text-neutral-800 font-semibold"
            whileHover={{ scale: 1.1, color: '#059669' }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {targetProgress.toFixed(1)}%
          </motion.span>
      </div>
        <div className="w-full bg-neutral-200 rounded-full h-2 relative overflow-hidden">
          {/* Animated background shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full relative"
            style={{ width: `${Math.min(targetProgress, 100)}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(targetProgress, 100)}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            whileHover={{ 
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
              scale: 1.02,
            }}
          >
            {/* Progress glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0"
              whileHover={{ opacity: 0.6 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
    </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 gap-3 flex-1"
        style={{ transform: 'translateZ(5px)' }}
      >
        <motion.div 
          className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-xl p-3 relative overflow-hidden border border-neutral-200/50"
          whileHover={{ 
            scale: 1.05, 
            y: -4,
            rotateY: 5,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Floating icon */}
          <motion.div
            className="absolute top-2 right-2 text-green-400 opacity-0"
            whileHover={{ opacity: 0.8, scale: 1.2, rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.div>
          
          <motion.div 
            className="text-xs text-neutral-500 mb-1"
            whileHover={{ color: '#6b7280' }}
          >
            Deals
          </motion.div>
          <motion.div 
            className="text-lg font-semibold text-neutral-800"
            whileHover={{ 
              scale: 1.1, 
              color: '#059669',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {deals}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-xl p-3 relative overflow-hidden border border-neutral-200/50"
          whileHover={{ 
            scale: 1.05, 
            y: -4,
            rotateY: -5,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Floating icon */}
          <motion.div
            className="absolute top-2 right-2 text-blue-400 opacity-0"
            whileHover={{ opacity: 0.8, scale: 1.2, rotate: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Users className="w-4 h-4" />
          </motion.div>
          
          <motion.div 
            className="text-xs text-neutral-500 mb-1"
            whileHover={{ color: '#6b7280' }}
          >
            Customers
          </motion.div>
          <motion.div 
            className="text-lg font-semibold text-neutral-800"
            whileHover={{ 
              scale: 1.1, 
              color: '#2563eb',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {customers}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}; 