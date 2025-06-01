import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  ChevronRight,
  Sparkles,
  BarChart3,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { DashboardInsight } from '../../../types';

interface AIInsightsData {
  insights: DashboardInsight[];
  trends: Array<{
    metric: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
    confidence: number;
  }>;
  predictions: Array<{
    metric: string;
    value: number;
    confidence: number;
  }>;
}

interface AIInsightsWidgetProps {
  data: AIInsightsData;
}

export const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'trends' | 'predictions'>('insights');
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-400">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
          <p>No AI insights available</p>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-4 h-4" />;
      case 'anomaly':
        return <AlertTriangle className="w-4 h-4" />;
      case 'recommendation':
        return <Lightbulb className="w-4 h-4" />;
      case 'forecast':
        return <Target className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'anomaly':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'recommendation':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'forecast':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div 
      className="h-full flex flex-col relative"
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
    >
      {/* 3D Background Layer */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/60 to-blue-50/40 pointer-events-none"
        style={{ transform: 'translateZ(-8px)' }}
        animate={{
          background: [
            'linear-gradient(135deg, rgba(147, 51, 234, 0.06) 0%, rgba(59, 130, 246, 0.04) 100%)',
            'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.06) 100%)',
            'linear-gradient(135deg, rgba(147, 51, 234, 0.06) 0%, rgba(59, 130, 246, 0.04) 100%)',
          ]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating AI Brain Icon */}
      <motion.div
        className="absolute top-2 right-2 text-purple-400 opacity-20 pointer-events-none"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: 'translateZ(5px)' }}
      >
        🧠
      </motion.div>

      {/* Tabs */}
      <motion.div 
        className="flex space-x-1 mb-4 bg-gradient-to-r from-neutral-100 to-neutral-50 rounded-xl p-1 relative"
        style={{ transform: 'translateZ(10px)' }}
        whileHover={{ transform: 'translateZ(15px) rotateX(2deg)' }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Tab background glow */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-100/50 to-blue-100/50 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        {(['insights', 'trends', 'predictions'] as const).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
              activeTab === tab 
                ? 'bg-white text-purple-600 shadow-lg' 
                : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/50'
            }`}
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              boxShadow: activeTab === tab 
                ? '0 8px 25px rgba(147, 51, 234, 0.2)' 
                : '0 4px 15px rgba(0,0,0,0.1)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Active tab indicator */}
            {activeTab === tab && (
              <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            {tab}
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div 
        className="flex-1 overflow-hidden relative"
        style={{ transform: 'translateZ(5px)' }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 30, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -30, rotateY: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 h-full overflow-y-auto"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {data.insights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  className="p-3 bg-gradient-to-br from-white to-neutral-50/50 rounded-xl border border-neutral-200/60 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20, rotateX: 10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -4,
                    rotateY: 2,
                    boxShadow: '0 15px 35px rgba(147, 51, 234, 0.15)',
                    borderColor: 'rgba(147, 51, 234, 0.3)',
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Insight glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-100/30 to-blue-100/20 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Floating confidence indicator */}
                  <motion.div
                    className="absolute top-2 right-2 opacity-0"
                    whileHover={{ opacity: 1, scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      insight.confidence > 0.8 ? 'bg-green-400' :
                      insight.confidence > 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                  </motion.div>

                  <div className="flex items-start justify-between mb-2">
                    <motion.h4 
                      className="font-medium text-neutral-800 text-sm relative"
                      whileHover={{ scale: 1.05, x: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {insight.title}
                    </motion.h4>
                    <motion.span 
                      className={`text-xs px-2 py-1 rounded-full ${
                        insight.confidence > 0.8 ? 'bg-green-100 text-green-700' :
                        insight.confidence > 0.6 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                      whileHover={{ scale: 1.1, y: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {Math.round(insight.confidence * 100)}%
                    </motion.span>
                  </div>
                  <motion.p 
                    className="text-xs text-neutral-600 mb-2 relative"
                    whileHover={{ color: '#4b5563' }}
                    transition={{ duration: 0.2 }}
                  >
                    {insight.description}
                  </motion.p>
                  <motion.div 
                    className="flex items-center justify-between mt-2"
                    style={{ transform: 'translateZ(2px)' }}
                  >
                    <span className="text-xs text-neutral-500">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                      insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {insight.impact} impact
                    </span>
                  </motion.div>
                  <motion.div 
                    className="flex space-x-2"
                    style={{ transform: 'translateZ(2px)' }}
                  >
                    {insight.actions?.map((action, actionIndex) => (
                      <motion.button
                        key={actionIndex}
                        className="text-xs px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-blue-200 transition-all duration-200"
                        whileHover={{ 
                          scale: 1.05, 
                          y: -1,
                          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.2)',
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {action.label}
                      </motion.button>
                    ))}
                  </motion.div>
                  <motion.div 
                    className="flex items-center justify-between mt-2"
                    style={{ transform: 'translateZ(2px)' }}
                  >
                    <span className="text-xs text-neutral-500">
                      {new Date(insight.timestamp).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 rounded-full hover:bg-white hover:bg-opacity-50"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 rounded-full hover:bg-white hover:bg-opacity-50"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, x: 30, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -30, rotateY: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 h-full overflow-y-auto"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {data.trends.map((trend, index) => (
                <motion.div
                  key={index}
                  className="p-3 bg-gradient-to-br from-white to-neutral-50/50 rounded-xl border border-neutral-200/60 relative"
                  initial={{ opacity: 0, y: 20, rotateX: 10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -4,
                    rotateY: -2,
                    boxShadow: '0 15px 35px rgba(59, 130, 246, 0.15)',
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Trend direction indicator */}
                  <motion.div
                    className={`absolute top-2 right-2 opacity-0 ${
                      trend.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}
                    whileHover={{ opacity: 1, scale: 1.3, rotate: trend.trend === 'up' ? 10 : -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {trend.trend === 'up' ? '📈' : '📉'}
                  </motion.div>

                  <div className="flex items-center justify-between mb-2">
                    <motion.h4 
                      className="font-medium text-neutral-800 text-sm"
                      whileHover={{ scale: 1.05, x: 2 }}
                    >
                      {trend.metric}
                    </motion.h4>
                    <motion.div 
                      className={`flex items-center text-sm ${
                        trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                      whileHover={{ scale: 1.1, y: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {trend.trend === 'up' ? '↗' : '↘'} {trend.change}%
                    </motion.div>
                  </div>
                  <motion.p 
                    className="text-xs text-neutral-600"
                    whileHover={{ color: '#4b5563' }}
                  >
                    {trend.trend === 'up' ? 'Positive trend detected' : 'Negative trend detected'}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'predictions' && (
            <motion.div
              key="predictions"
              initial={{ opacity: 0, x: 30, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -30, rotateY: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 h-full overflow-y-auto"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {data.predictions.map((prediction, index) => (
                <motion.div
                  key={index}
                  className="p-3 bg-gradient-to-br from-white to-neutral-50/50 rounded-xl border border-neutral-200/60 relative"
                  initial={{ opacity: 0, y: 20, rotateX: 10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -4,
                    rotateY: 2,
                    boxShadow: '0 15px 35px rgba(168, 85, 247, 0.15)',
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Crystal ball icon */}
                  <motion.div
                    className="absolute top-2 right-2 opacity-0 text-purple-400"
                    whileHover={{ opacity: 1, scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    🔮
                  </motion.div>

                  <div className="flex items-start justify-between mb-2">
                    <motion.h4 
                      className="font-medium text-neutral-800 text-sm"
                      whileHover={{ scale: 1.05, x: 2 }}
                    >
                      {prediction.metric}
                    </motion.h4>
                  </div>
                  <motion.p 
                    className="text-xs text-neutral-600 mb-2"
                    whileHover={{ color: '#4b5563' }}
                  >
                    Predicted value: {formatCurrency(prediction.value)}
                  </motion.p>
                  <motion.div 
                    className="flex items-center space-x-2"
                    style={{ transform: 'translateZ(2px)' }}
                  >
                    <span className="text-xs text-neutral-500">Confidence:</span>
                    <div className="flex-1 bg-neutral-200 rounded-full h-1 relative overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full"
                        style={{ width: `${prediction.confidence * 100}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                        whileHover={{ 
                          boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
                          scale: 1.02,
                        }}
                      />
                    </div>
                    <motion.span 
                      className="text-xs text-neutral-700 font-medium"
                      whileHover={{ scale: 1.1, color: '#374151' }}
                    >
                      {Math.round(prediction.confidence * 100)}%
                    </motion.span>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}; 