import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Calendar,
  DollarSign,
  Users,
  Building2,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Zap,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  Shield,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';

interface PredictiveInsight {
  id: string;
  type: 'revenue_forecast' | 'risk_alert' | 'opportunity' | 'trend_analysis' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  data?: any;
  action_items: string[];
  created_at: Date;
}

interface ForecastData {
  period: string;
  actual?: number;
  predicted: number;
  confidence_upper: number;
  confidence_lower: number;
  factors: string[];
}

interface RiskAssessment {
  tenant_id: string;
  tenant_name: string;
  risk_score: number;
  risk_factors: Array<{
    factor: string;
    weight: number;
    description: string;
  }>;
  payment_probability: number;
  renewal_probability: number;
  recommended_actions: string[];
}

const PredictiveAnalytics: React.FC = () => {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for predictive insights
  const mockInsights: PredictiveInsight[] = [
    {
      id: '1',
      type: 'revenue_forecast',
      title: 'Revenue Growth Acceleration Expected',
      description: 'AI models predict 23% revenue increase in Q2 2024 based on current collection trends and new contract signings.',
      confidence: 87,
      impact: 'high',
      timeframe: 'Next 3 months',
      action_items: [
        'Prepare for increased cash flow management',
        'Consider expanding collection team',
        'Review pricing strategy for new contracts'
      ],
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'risk_alert',
      title: 'High Risk Tenant Identified',
      description: 'Al-Mansour Trading shows 78% probability of payment default based on recent payment patterns and market indicators.',
      confidence: 92,
      impact: 'high',
      timeframe: 'Next 30 days',
      action_items: [
        'Immediate contact with tenant',
        'Review contract terms',
        'Consider payment plan options',
        'Prepare contingency measures'
      ],
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'Optimal Renewal Window Detected',
      description: 'Market analysis suggests 15% rent increase opportunity for North Industrial Complex renewals in March 2024.',
      confidence: 79,
      impact: 'medium',
      timeframe: 'Next 2 months',
      action_items: [
        'Prepare renewal proposals',
        'Conduct market research',
        'Schedule tenant meetings',
        'Review competitor pricing'
      ],
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: '4',
      type: 'trend_analysis',
      title: 'Seasonal Collection Pattern Identified',
      description: 'Historical data reveals 34% improvement in collection rates during Ramadan period. Optimize agent schedules accordingly.',
      confidence: 95,
      impact: 'medium',
      timeframe: 'Seasonal',
      action_items: [
        'Adjust agent schedules',
        'Prepare special collection campaigns',
        'Increase communication frequency'
      ],
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000)
    }
  ];

  // Mock forecast data
  const mockForecastData: ForecastData[] = [
    { period: 'Jan 2024', actual: 2450000, predicted: 2450000, confidence_upper: 2550000, confidence_lower: 2350000, factors: ['Historical', 'Seasonal'] },
    { period: 'Feb 2024', predicted: 2580000, confidence_upper: 2720000, confidence_lower: 2440000, factors: ['Growth Trend', 'New Contracts'] },
    { period: 'Mar 2024', predicted: 2720000, confidence_upper: 2890000, confidence_lower: 2550000, factors: ['Renewal Season', 'Market Growth'] },
    { period: 'Apr 2024', predicted: 2890000, confidence_upper: 3080000, confidence_lower: 2700000, factors: ['Expansion', 'Rate Increases'] },
    { period: 'May 2024', predicted: 3020000, confidence_upper: 3250000, confidence_lower: 2790000, factors: ['Peak Season', 'New Projects'] },
    { period: 'Jun 2024', predicted: 3150000, confidence_upper: 3400000, confidence_lower: 2900000, factors: ['Summer Demand', 'Portfolio Growth'] }
  ];

  // Mock risk assessments
  const mockRiskAssessments: RiskAssessment[] = [
    {
      tenant_id: '1',
      tenant_name: 'Al-Mansour Trading',
      risk_score: 78,
      risk_factors: [
        { factor: 'Late Payment History', weight: 0.35, description: '3 late payments in last 6 months' },
        { factor: 'Industry Volatility', weight: 0.25, description: 'Trading sector showing instability' },
        { factor: 'Credit Score Decline', weight: 0.20, description: 'Credit rating dropped 15 points' },
        { factor: 'Market Conditions', weight: 0.20, description: 'Economic uncertainty in region' }
      ],
      payment_probability: 22,
      renewal_probability: 15,
      recommended_actions: [
        'Immediate payment plan discussion',
        'Require additional security deposit',
        'Monthly payment monitoring',
        'Consider early termination clause'
      ]
    },
    {
      tenant_id: '2',
      tenant_name: 'Saudi Logistics Hub',
      risk_score: 23,
      risk_factors: [
        { factor: 'Strong Payment History', weight: 0.40, description: 'Never missed a payment' },
        { factor: 'Industry Growth', weight: 0.30, description: 'Logistics sector expanding' },
        { factor: 'Long-term Contract', weight: 0.20, description: '5-year agreement in place' },
        { factor: 'Financial Stability', weight: 0.10, description: 'Strong balance sheet' }
      ],
      payment_probability: 96,
      renewal_probability: 89,
      recommended_actions: [
        'Offer early renewal incentives',
        'Discuss expansion opportunities',
        'Maintain regular relationship meetings',
        'Consider preferred tenant benefits'
      ]
    }
  ];

  useEffect(() => {
    setInsights(mockInsights);
    setForecastData(mockForecastData);
    setRiskAssessments(mockRiskAssessments);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'revenue_forecast': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'risk_alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'trend_analysis': return <BarChart3 className="w-5 h-5 text-blue-500" />;
      case 'recommendation': return <Target className="w-5 h-5 text-purple-500" />;
      default: return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'revenue_forecast': return 'border-l-green-500 bg-green-50';
      case 'risk_alert': return 'border-l-red-500 bg-red-50';
      case 'opportunity': return 'border-l-yellow-500 bg-yellow-50';
      case 'trend_analysis': return 'border-l-blue-500 bg-blue-50';
      case 'recommendation': return 'border-l-purple-500 bg-purple-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600" />
              Predictive Analytics
            </h1>
            <p className="text-gray-600">AI-powered insights for smarter decisions</p>
          </div>
          
          <div className="flex gap-3">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="2years">2 Years</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="collection_rate">Collection Rate</SelectItem>
                <SelectItem value="occupancy">Occupancy</SelectItem>
                <SelectItem value="renewals">Renewals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
            <TabsTrigger value="risk_analysis">Risk Analysis</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Prediction Accuracy</p>
                        <p className="text-2xl font-bold text-gray-900">94.2%</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={94.2} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Risk Alerts</p>
                        <p className="text-2xl font-bold text-gray-900">3</p>
                      </div>
                      <div className="p-3 bg-red-100 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <ArrowDown className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">-2 from last week</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Opportunities</p>
                        <p className="text-2xl font-bold text-gray-900">7</p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <Lightbulb className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+3 new this week</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Model Confidence</p>
                        <p className="text-2xl font-bold text-gray-900">87%</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Brain className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={87} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Latest AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {insights.slice(0, 4).map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-l-4 ${getInsightColor(insight.type)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                              <Badge className={getImpactColor(insight.impact)}>
                                {insight.impact}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{insight.timeframe}</span>
                              <span className="text-xs font-medium text-blue-600">
                                {insight.confidence}% confidence
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Forecasting Tab */}
          <TabsContent value="forecasting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Forecast Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={forecastData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                        <Area
                          dataKey="confidence_upper"
                          fill="#3b82f6"
                          fillOpacity={0.1}
                          stroke="none"
                        />
                        <Area
                          dataKey="confidence_lower"
                          fill="#ffffff"
                          fillOpacity={1}
                          stroke="none"
                        />
                        <Line
                          type="monotone"
                          dataKey="actual"
                          stroke="#22c55e"
                          strokeWidth={3}
                          dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          strokeDasharray="5 5"
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Forecast Factors */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Forecast Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { factor: 'Historical Trends', impact: 85, color: 'bg-blue-500' },
                        { factor: 'Seasonal Patterns', impact: 72, color: 'bg-green-500' },
                        { factor: 'Market Conditions', impact: 68, color: 'bg-yellow-500' },
                        { factor: 'New Contracts', impact: 91, color: 'bg-purple-500' },
                        { factor: 'Renewal Rates', impact: 79, color: 'bg-pink-500' },
                        { factor: 'Economic Indicators', impact: 56, color: 'bg-indigo-500' }
                      ].map((item, index) => (
                        <motion.div
                          key={item.factor}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-700">{item.factor}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${item.color}`}
                                style={{ width: `${item.impact}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">{item.impact}%</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Forecast Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>6-Month Forecast Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800">Expected Revenue</h3>
                      <p className="text-2xl font-bold text-green-600">SAR 17.3M</p>
                      <p className="text-sm text-green-600">+23% vs current period</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800">Confidence Range</h3>
                      <p className="text-2xl font-bold text-blue-600">±12%</p>
                      <p className="text-sm text-blue-600">SAR 15.2M - 19.4M</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800">Key Driver</h3>
                      <p className="text-2xl font-bold text-purple-600">New Contracts</p>
                      <p className="text-sm text-purple-600">Contributing 67% of growth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk_analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {riskAssessments.map((assessment, index) => (
                <motion.div
                  key={assessment.tenant_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{assessment.tenant_name}</CardTitle>
                        <Badge className={getRiskColor(assessment.risk_score)}>
                          Risk Score: {assessment.risk_score}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Risk Factors */}
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-3">Risk Factors</h4>
                          <div className="space-y-2">
                            {assessment.risk_factors.map((factor, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <span className="text-sm font-medium">{factor.factor}</span>
                                  <p className="text-xs text-gray-500">{factor.description}</p>
                                </div>
                                <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                                  <div
                                    className="h-2 rounded-full bg-red-500"
                                    style={{ width: `${factor.weight * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Probabilities */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Payment Probability</p>
                            <p className="text-lg font-bold text-gray-900">{assessment.payment_probability}%</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Renewal Probability</p>
                            <p className="text-lg font-bold text-gray-900">{assessment.renewal_probability}%</p>
                          </div>
                        </div>

                        {/* Recommended Actions */}
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Recommended Actions</h4>
                          <ul className="space-y-1">
                            {assessment.recommended_actions.map((action, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-center">
                                <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-l-4 ${getInsightColor(insight.type)}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge className={getImpactColor(insight.impact)}>
                                {insight.impact} impact
                              </Badge>
                              <Badge variant="outline">
                                {insight.confidence}% confidence
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{insight.description}</p>
                          
                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-700">Timeframe: </span>
                            <span className="text-sm text-gray-600">{insight.timeframe}</span>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Action Items:</h4>
                            <ul className="space-y-1">
                              {insight.action_items.map((action, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-center">
                                  <Target className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <span className="text-xs text-gray-500">
                              Generated {insight.created_at.toLocaleString()}
                            </span>
                            <Button size="sm" variant="outline">
                              <Activity className="w-3 h-3 mr-1" />
                              Take Action
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PredictiveAnalytics; 