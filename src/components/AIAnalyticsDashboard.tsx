import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Building, 
  Target,
  Brain,
  Zap,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/components/SimpleLanguageSwitcher';

// Real-time data simulation
const useRealTimeData = () => {
  const [data, setData] = useState({
    revenue: 2847000,
    properties: 1247,
    occupancy: 87.5,
    collections: 94.2,
    aiPredictions: {
      nextMonthRevenue: 3100000,
      riskProperties: 23,
      opportunityScore: 8.7
    },
    marketTrends: [
      { month: 'Jan', value: 2400000 },
      { month: 'Feb', value: 2600000 },
      { month: 'Mar', value: 2847000 },
      { month: 'Apr', value: 3100000 }, // Predicted
    ],
    liveMetrics: {
      activeUsers: 47,
      systemLoad: 23,
      aiProcessing: 156,
      alerts: 3
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        revenue: prev.revenue + Math.floor(Math.random() * 10000) - 5000,
        occupancy: Math.max(80, Math.min(95, prev.occupancy + (Math.random() - 0.5) * 2)),
        collections: Math.max(85, Math.min(98, prev.collections + (Math.random() - 0.5) * 1)),
        liveMetrics: {
          activeUsers: Math.max(20, Math.min(80, prev.liveMetrics.activeUsers + Math.floor(Math.random() * 6) - 3)),
          systemLoad: Math.max(10, Math.min(90, prev.liveMetrics.systemLoad + Math.floor(Math.random() * 10) - 5)),
          aiProcessing: Math.max(50, Math.min(300, prev.liveMetrics.aiProcessing + Math.floor(Math.random() * 20) - 10)),
          alerts: Math.max(0, Math.min(10, prev.liveMetrics.alerts + Math.floor(Math.random() * 3) - 1))
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return data;
};

// AI Prediction Card
const AIPredictionCard: React.FC<{ title: string; value: string; trend: 'up' | 'down'; confidence: number; icon: React.ReactNode }> = ({
  title, value, trend, confidence, icon
}) => {
  return (
    <Card className="bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium">{title}</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {confidence}% AI
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {trend === 'up' ? (
            <TrendingUp className="w-5 h-5 text-green-400" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-400" />
          )}
        </div>
        <Progress value={confidence} className="mt-2 h-1" />
      </CardContent>
    </Card>
  );
};

// Live Metrics Widget
const LiveMetricsWidget: React.FC<{ data: any }> = ({ data }) => {
  return (
    <Card className="bg-gradient-to-br from-green-900 to-teal-900 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Live System Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Active Users</span>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
              <span className="font-bold">{data.activeUsers}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>System Load</span>
              <span>{data.systemLoad}%</span>
            </div>
            <Progress value={data.systemLoad} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>AI Processing</span>
              <span>{data.aiProcessing} ops/min</span>
            </div>
            <Progress value={(data.aiProcessing / 300) * 100} className="h-2" />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Active Alerts</span>
            <Badge variant={data.alerts > 5 ? "destructive" : "secondary"} className="bg-yellow-500 text-black">
              {data.alerts}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Market Intelligence Widget
const MarketIntelligenceWidget: React.FC = () => {
  const [insights, setInsights] = useState([
    { id: 1, text: "Riyadh commercial market showing 12% growth", confidence: 94, type: 'opportunity' },
    { id: 2, text: "Jeddah retail spaces experiencing high demand", confidence: 87, type: 'trend' },
    { id: 3, text: "Office spaces in NEOM project gaining traction", confidence: 91, type: 'opportunity' },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewInsight = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newInsights = [
        "AI predicts 15% increase in luxury residential demand",
        "Smart building technology adoption rising by 23%",
        "Sustainable construction materials trending upward",
        "Co-working spaces showing resilience in current market",
        "Mixed-use developments gaining investor interest"
      ];
      
      const newInsight = {
        id: Date.now(),
        text: newInsights[Math.floor(Math.random() * newInsights.length)],
        confidence: 85 + Math.floor(Math.random() * 15),
        type: Math.random() > 0.5 ? 'opportunity' : 'trend'
      };
      
      setInsights(prev => [newInsight, ...prev.slice(0, 2)]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900 to-pink-900 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Market Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 rounded-lg p-3"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm">{insight.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-white/20">
                      {insight.confidence}% confidence
                    </Badge>
                    <Badge variant="secondary" className={`text-xs ${
                      insight.type === 'opportunity' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {insight.type}
                    </Badge>
                  </div>
                </div>
                {insight.type === 'opportunity' ? (
                  <Target className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
                )}
              </div>
            </motion.div>
          ))}
          
          <Button 
            onClick={generateNewInsight}
            disabled={isGenerating}
            className="w-full bg-white text-purple-900 hover:bg-gray-100"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Brain className="w-4 h-4 mr-2" />
              </motion.div>
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? 'AI Analyzing...' : 'Generate New Insight'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Predictive Revenue Chart
const PredictiveRevenueChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <Card className="bg-gradient-to-br from-yellow-900 to-orange-900 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Revenue Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {data.marketTrends.map((item: any, index: number) => (
              <div key={item.month} className="text-center">
                <div className="text-xs text-yellow-200 mb-1">{item.month}</div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.value / 3500000) * 100}px` }}
                  transition={{ delay: index * 0.2 }}
                  className={`w-full rounded-t-lg ${
                    index === 3 ? 'bg-gradient-to-t from-green-400 to-green-300' : 'bg-gradient-to-t from-yellow-400 to-yellow-300'
                  }`}
                  style={{ minHeight: '20px' }}
                />
                <div className="text-xs mt-1">
                  {(item.value / 1000000).toFixed(1)}M
                </div>
                {index === 3 && (
                  <Badge variant="secondary" className="text-xs bg-green-500 text-white mt-1">
                    Predicted
                  </Badge>
                )}
              </div>
            ))}
          </div>
          
          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">AI Forecast</span>
            </div>
            <p className="text-xs text-yellow-200">
              Based on current trends and market analysis, revenue is projected to increase by 8.9% next month.
              Key factors: seasonal demand, new property launches, and improved collection rates.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main AI Analytics Dashboard
const AIAnalyticsDashboard: React.FC = () => {
  const { t } = useLanguage();
  const data = useRealTimeData();
  const [isAIActive, setIsAIActive] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-blue-400" />
            AI Analytics Dashboard
            <Zap className="w-8 h-8 text-yellow-400" />
          </h1>
          <p className="text-xl text-gray-300">
            Real-time AI-powered insights and predictions for your real estate portfolio
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className={`${isAIActive ? 'bg-green-500' : 'bg-red-500'} text-white`}>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full mr-2"
              />
              AI {isAIActive ? 'ACTIVE' : 'OFFLINE'}
            </Badge>
            <Badge variant="secondary" className="bg-blue-500 text-white">
              Real-time Data
            </Badge>
            <Badge variant="secondary" className="bg-purple-500 text-white">
              Predictive Analytics
            </Badge>
          </div>
        </motion.div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-100">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      {(data.revenue / 1000000).toFixed(2)}M SAR
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100">Properties</p>
                    <p className="text-2xl font-bold">{data.properties}</p>
                  </div>
                  <Building className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-100">Occupancy Rate</p>
                    <p className="text-2xl font-bold">{data.occupancy.toFixed(1)}%</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-100">Collections</p>
                    <p className="text-2xl font-bold">{data.collections.toFixed(1)}%</p>
                  </div>
                  <Target className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Predictions Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AIPredictionCard
              title="Next Month Revenue"
              value={`${(data.aiPredictions.nextMonthRevenue / 1000000).toFixed(1)}M SAR`}
              trend="up"
              confidence={94}
              icon={<TrendingUp className="w-4 h-4" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <AIPredictionCard
              title="Risk Properties"
              value={`${data.aiPredictions.riskProperties}`}
              trend="down"
              confidence={87}
              icon={<AlertTriangle className="w-4 h-4" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <AIPredictionCard
              title="Opportunity Score"
              value={`${data.aiPredictions.opportunityScore}/10`}
              trend="up"
              confidence={91}
              icon={<Target className="w-4 h-4" />}
            />
          </motion.div>
        </div>

        {/* Advanced Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <PredictiveRevenueChart data={data} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <LiveMetricsWidget data={data.liveMetrics} />
          </motion.div>
        </div>

        {/* Market Intelligence */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
        >
          <MarketIntelligenceWidget />
        </motion.div>
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard; 