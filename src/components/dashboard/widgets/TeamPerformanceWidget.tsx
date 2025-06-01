import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Award,
  Target,
  BarChart3,
  Star,
  ChevronRight
} from 'lucide-react';

interface Team {
  name: string;
  performance: number;
  target: number;
  members: number;
  trend: 'up' | 'down' | 'stable';
}

interface TopPerformer {
  name: string;
  team: string;
  score: number;
}

interface TeamPerformanceData {
  teams: Team[];
  topPerformers: TopPerformer[];
}

interface TeamPerformanceWidgetProps {
  data: TeamPerformanceData;
}

export const TeamPerformanceWidget: React.FC<TeamPerformanceWidgetProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'teams' | 'performers'>('teams');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-400">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
          <p>No team data available</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPerformanceColor = (performance: number, target: number) => {
    const ratio = performance / target;
    if (ratio >= 1) return 'text-green-600 bg-green-50 border-green-200';
    if (ratio >= 0.8) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const calculateProgress = (performance: number, target: number) => {
    return Math.min((performance / target) * 100, 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-50';
    if (score >= 85) return 'text-blue-600 bg-blue-50';
    if (score >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const overallPerformance = data.teams.reduce((sum, team) => sum + team.performance, 0) / data.teams.length;
  const overallTarget = data.teams.reduce((sum, team) => sum + team.target, 0) / data.teams.length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center"
          >
            <Users className="w-4 h-4 text-white" />
          </motion.div>
          <span className="text-sm font-medium text-neutral-700">Team Performance</span>
        </div>
        
        <div className="flex items-center space-x-1 bg-neutral-100 rounded-lg p-0.5">
          {(['teams', 'performers'] as const).map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1 text-xs rounded-md transition-all capitalize ${
                activeTab === tab 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Overall Performance Summary */}
      <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">Overall Performance</span>
          <div className="flex items-center space-x-1">
            <BarChart3 className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-bold text-neutral-800">
              {overallPerformance.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${calculateProgress(overallPerformance, overallTarget)}%` }}
            transition={{ duration: 1 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
          />
        </div>
        <div className="flex items-center justify-between mt-1 text-xs text-neutral-500">
          <span>Target: {overallTarget.toFixed(1)}%</span>
          <span>{data.teams.length} teams</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'teams' && (
            <motion.div
              key="teams"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto space-y-3"
            >
              {data.teams.map((team) => {
                const progress = calculateProgress(team.performance, team.target);
                
                return (
                  <motion.div
                    key={team.name}
                    whileHover={{ scale: 1.01 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${getPerformanceColor(team.performance, team.target)}`}
                    onClick={() => setSelectedTeam(selectedTeam === team.name ? null : team.name)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-2 flex-1">
                        <div className="mt-0.5">
                          {getTrendIcon(team.trend)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-neutral-800">
                            {team.name}
                          </h4>
                          <p className="text-xs text-neutral-600 mt-1">
                            {team.members} team members
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">
                          {team.performance}%
                        </div>
                        <div className="text-xs text-neutral-600">
                          Target: {team.target}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="w-full bg-white bg-opacity-50 rounded-full h-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-current h-1.5 rounded-full"
                        />
                      </div>
                    </div>
                    
                    {/* Performance Indicator */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Target className="w-3 h-3" />
                        <span>
                          {team.performance >= team.target ? 'Above target' : 
                           team.performance >= team.target * 0.8 ? 'Near target' : 'Below target'}
                        </span>
                      </div>
                      <ChevronRight className={`w-3 h-3 transition-transform ${
                        selectedTeam === team.name ? 'rotate-90' : ''
                      }`} />
                    </div>
                    
                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedTeam === team.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-current border-opacity-20"
                        >
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-neutral-600">Performance:</span>
                              <div className="font-medium">{team.performance}%</div>
                            </div>
                            <div>
                              <span className="text-neutral-600">Target:</span>
                              <div className="font-medium">{team.target}%</div>
                            </div>
                            <div>
                              <span className="text-neutral-600">Members:</span>
                              <div className="font-medium">{team.members}</div>
                            </div>
                            <div>
                              <span className="text-neutral-600">Trend:</span>
                              <div className="flex items-center space-x-1">
                                {getTrendIcon(team.trend)}
                                <span className="font-medium capitalize">{team.trend}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'performers' && (
            <motion.div
              key="performers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full space-y-3"
            >
              <div className="text-sm font-medium text-neutral-700 mb-3 flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>Top Performers</span>
              </div>
              
              {data.topPerformers.map((performer, index) => (
                <motion.div
                  key={performer.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg border ${getScoreColor(performer.score)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-current bg-opacity-20">
                        {index === 0 && <Star className="w-4 h-4 text-yellow-500" />}
                        {index === 1 && <Award className="w-4 h-4 text-gray-500" />}
                        {index === 2 && <Award className="w-4 h-4 text-orange-500" />}
                        {index > 2 && <span className="text-sm font-bold">{index + 1}</span>}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-800">
                          {performer.name}
                        </div>
                        <div className="text-xs text-neutral-600">
                          {performer.team} Team
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {performer.score}
                      </div>
                      <div className="text-xs text-neutral-600">
                        Score
                      </div>
                    </div>
                  </div>
                  
                  {/* Score Bar */}
                  <div className="mt-2">
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${performer.score}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-current h-1 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 