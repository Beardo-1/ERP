import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Calendar,
  Plus,
  MoreHorizontal,
  Flag
} from 'lucide-react';
import { DashboardGoal } from '../../../types';

interface GoalTrackerData {
  goals: DashboardGoal[];
  summary: {
    total: number;
    onTrack: number;
    atRisk: number;
    behind: number;
    completed: number;
  };
}

interface GoalTrackerWidgetProps {
  data: GoalTrackerData;
}

export const GoalTrackerWidget: React.FC<GoalTrackerWidgetProps> = ({ data }) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'summary'>('list');

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-400">
        <div className="text-center">
          <Target className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
          <p>No goals available</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'at-risk':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'behind':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <TrendingUp className="w-4 h-4" />;
      case 'at-risk':
        return <AlertTriangle className="w-4 h-4" />;
      case 'behind':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
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

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-50/60 to-emerald-50/40 pointer-events-none"
        style={{ transform: 'translateZ(-8px)' }}
        animate={{
          background: [
            'linear-gradient(135deg, rgba(34, 197, 94, 0.06) 0%, rgba(16, 185, 129, 0.04) 100%)',
            'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.06) 100%)',
            'linear-gradient(135deg, rgba(34, 197, 94, 0.06) 0%, rgba(16, 185, 129, 0.04) 100%)',
          ]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Target Icon */}
      <motion.div
        className="absolute top-2 right-2 text-green-400 opacity-20 pointer-events-none"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: 'translateZ(5px)' }}
      >
        🎯
      </motion.div>

      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-4 relative"
        style={{ transform: 'translateZ(10px)' }}
        whileHover={{ transform: 'translateZ(15px) rotateX(2deg)' }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.h3 
          className="text-lg font-semibold text-neutral-800"
          whileHover={{ scale: 1.05, x: 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          Goals
        </motion.h3>
        <motion.div 
          className="flex space-x-2"
          style={{ transform: 'translateZ(2px)' }}
        >
          {(['list', 'summary'] as const).map((mode) => (
            <motion.button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 relative ${
                viewMode === mode
                  ? 'bg-green-100 text-green-700 shadow-md'
                  : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
              }`}
              whileHover={{ 
                scale: 1.05, 
                y: -1,
                boxShadow: viewMode === mode 
                  ? '0 6px 20px rgba(34, 197, 94, 0.2)' 
                  : '0 4px 15px rgba(0,0,0,0.1)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Active mode indicator */}
              {viewMode === mode && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                  layoutId="activeMode"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              {mode === 'list' ? 'List' : 'Summary'}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div 
        className="flex-1 overflow-hidden relative"
        style={{ transform: 'translateZ(5px)' }}
      >
        <AnimatePresence mode="wait">
          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -30, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: 30, rotateY: 15 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 h-full overflow-y-auto"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {data.goals.map((goal, index) => {
                const progress = calculateProgress(goal.current, goal.target);
                const daysRemaining = getDaysRemaining(goal.deadline);
                
                return (
                  <motion.div
                    key={goal.id}
                    className="p-3 bg-gradient-to-br from-white to-neutral-50/50 rounded-xl border border-neutral-200/60 relative overflow-hidden"
                    initial={{ opacity: 0, y: 20, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -4,
                      rotateY: 2,
                      boxShadow: '0 15px 35px rgba(34, 197, 94, 0.15)',
                      borderColor: 'rgba(34, 197, 94, 0.3)',
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Goal glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-100/30 to-emerald-100/20 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Floating priority indicator */}
                    <motion.div
                      className="absolute top-2 right-2 opacity-0"
                      whileHover={{ opacity: 1, scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        goal.priority === 'high' ? 'bg-red-400' :
                        goal.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                    </motion.div>

                    <div className="flex items-start justify-between mb-2">
                      <motion.h4 
                        className="font-medium text-neutral-800 text-sm relative"
                        whileHover={{ scale: 1.05, x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {goal.title}
                      </motion.h4>
                      <motion.span 
                        className={`text-xs px-2 py-1 rounded-full ${
                        goal.priority === 'high' ? 'bg-red-100 text-red-700' :
                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                        }`}
                        whileHover={{ scale: 1.1, y: -1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {goal.priority}
                      </motion.span>
                    </div>
                    
                    <motion.div 
                      className="mb-2"
                      style={{ transform: 'translateZ(2px)' }}
                    >
                      <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
                        <span>Progress</span>
                        <motion.span
                          whileHover={{ scale: 1.1, color: '#059669' }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          {progress.toFixed(1)}%
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
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full relative"
                          style={{ width: `${progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                          whileHover={{ 
                            boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
                            scale: 1.02,
                          }}
                        >
                          {/* Progress glow effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-0"
                            whileHover={{ opacity: 0.6 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center justify-between text-xs text-neutral-500"
                      style={{ transform: 'translateZ(1px)' }}
                    >
                      <motion.span
                        whileHover={{ color: '#6b7280' }}
                        transition={{ duration: 0.2 }}
                      >
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </motion.span>
                      <motion.span
                        whileHover={{ color: '#6b7280', scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {goal.milestones?.filter(m => m.completed).length || 0}/{goal.milestones?.length || 0} milestones
                      </motion.span>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {viewMode === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 30, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -30, rotateY: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Summary Stats */}
              <motion.div 
                className="grid grid-cols-2 gap-3 mb-4"
                style={{ transform: 'translateZ(8px)' }}
              >
                <motion.div 
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200/60 relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -4,
                    rotateY: 5,
                    boxShadow: '0 10px 25px rgba(34, 197, 94, 0.15)',
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Floating checkmark */}
                  <motion.div
                    className="absolute top-2 right-2 text-green-400 opacity-0"
                    whileHover={{ opacity: 0.8, scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    ✅
                  </motion.div>
                  
                  <motion.div 
                    className="text-xs text-green-600 mb-1"
                    whileHover={{ color: '#059669' }}
                  >
                    Completed
                  </motion.div>
                  <motion.div 
                    className="text-lg font-semibold text-green-700"
                    whileHover={{ 
                      scale: 1.1, 
                      color: '#047857',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {data.summary.completed}
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-3 border border-blue-200/60 relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -4,
                    rotateY: -5,
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)',
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Floating progress icon */}
                  <motion.div
                    className="absolute top-2 right-2 text-blue-400 opacity-0"
                    whileHover={{ opacity: 0.8, scale: 1.2, rotate: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    🔄
                  </motion.div>
                  
                  <motion.div 
                    className="text-xs text-blue-600 mb-1"
                    whileHover={{ color: '#2563eb' }}
                  >
                    In Progress
                  </motion.div>
                  <motion.div 
                    className="text-lg font-semibold text-blue-700"
                    whileHover={{ 
                      scale: 1.1, 
                      color: '#1d4ed8',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {data.summary.onTrack}
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Overall Progress */}
              <motion.div 
                className="bg-gradient-to-br from-white to-neutral-50/50 rounded-xl p-3 border border-neutral-200/60 mb-4 relative"
                style={{ transform: 'translateZ(6px)' }}
                whileHover={{ 
                  transform: 'translateZ(10px) rotateX(2deg)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <motion.span 
                    className="text-sm font-medium text-neutral-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    Overall Progress
                  </motion.span>
                  <motion.span 
                    className="text-sm text-neutral-600 font-semibold"
                    whileHover={{ scale: 1.1, color: '#374151' }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {calculateProgress(data.summary.completed, data.summary.total).toFixed(1)}%
                  </motion.span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3 relative overflow-hidden">
                  {/* Animated background shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 h-3 rounded-full relative"
                    style={{ width: `${calculateProgress(data.summary.completed, data.summary.total)}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress(data.summary.completed, data.summary.total)}%` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    whileHover={{ 
                      boxShadow: '0 0 25px rgba(34, 197, 94, 0.6)',
                      scale: 1.02,
                    }}
                  >
                    {/* Progress glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-blue-400 rounded-full opacity-0"
                      whileHover={{ opacity: 0.7 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Recent Milestones */}
              <motion.div 
                className="bg-gradient-to-br from-white to-neutral-50/50 rounded-xl p-3 border border-neutral-200/60 relative"
                style={{ transform: 'translateZ(4px)' }}
                whileHover={{ 
                  transform: 'translateZ(8px) rotateY(1deg)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <motion.h4 
                  className="text-sm font-medium text-neutral-700 mb-2"
                  whileHover={{ scale: 1.05, x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  Recent Milestones
                </motion.h4>
                <motion.div 
                  className="space-y-2"
                  style={{ transform: 'translateZ(2px)' }}
                >
                  {data.goals.slice(0, 3).map((milestone, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center space-x-2 text-xs"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                    >
                      <motion.div 
                        className={`w-2 h-2 rounded-full ${
                          milestone.milestones?.[0]?.completed ? 'bg-green-500' : 'bg-neutral-300'
                        }`}
                        whileHover={{ scale: 1.3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      />
                      <motion.span 
                        className={milestone.milestones?.[0]?.completed ? 'text-green-700' : 'text-neutral-600'}
                        whileHover={{ color: milestone.milestones?.[0]?.completed ? '#047857' : '#4b5563' }}
                      >
                        {milestone.milestones?.[0]?.title || milestone.title}
                      </motion.span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}; 