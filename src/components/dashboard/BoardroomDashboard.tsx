import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/SimpleLanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building2, 
  Users, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  MapPin,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { apiService } from '@/lib/api';

interface DashboardStats {
  total_projects: number;
  active_leases: number;
  total_agents: number;
  monthly_target: number;
  monthly_collected: number;
  collection_rate: number;
  pending_renewals: number;
  overdue_payments: number;
  projects_by_region: Record<string, number>;
  agent_performance: Array<{ name: string; collected: number; target: number; projects: number }>;
  collection_trends: Array<{ month: string; collected: number; target: number }>;
  recent_collections: Array<{ id: string; tenant: string; amount: number; agent: string; date: string }>;
  top_performing_projects: Array<{ name: string; collection_rate: number; revenue: number }>;
}

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  delay: number;
  subtitle?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, trend, delay, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border-slate-700/50 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-16 translate-x-16" />
        
        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
              {icon}
            </div>
            <Badge 
              variant={trend === 'up' ? 'default' : 'destructive'}
              className={`${
                trend === 'up' 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              } backdrop-blur-sm`}
            >
              {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {Math.abs(change)}%
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const BoardroomDashboard: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDashboardStats();
        
        if (response.error) {
          setError(response.error);
        } else {
          setDashboardData(response.data);
        }
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Real-time data simulation
  const [liveData, setLiveData] = useState({
    total_properties: 70,
    available_properties: 45,
    sold_properties: 15,
    leased_properties: 10,
    total_customers: 1247,
    monthly_revenue: 13750000,
    monthly_expenses: 2100000,
    net_profit: 11650000,
    properties_by_type: {
      commercial: 35,
      residential: 20,
      industrial: 10,
      land: 5
    },
    live_metrics: {
      active_users: 47,
      system_load: 23,
      recent_activity: 156,
      alerts: 3
    }
  });

  // Update live data every 3 seconds
  useEffect(() => {
    const liveInterval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        monthly_revenue: prev.monthly_revenue + Math.floor(Math.random() * 50000) - 25000,
        total_customers: prev.total_customers + Math.floor(Math.random() * 3) - 1,
        live_metrics: {
          active_users: Math.max(20, Math.min(80, prev.live_metrics.active_users + Math.floor(Math.random() * 6) - 3)),
          system_load: Math.max(10, Math.min(90, prev.live_metrics.system_load + Math.floor(Math.random() * 10) - 5)),
          recent_activity: Math.max(50, Math.min(300, prev.live_metrics.recent_activity + Math.floor(Math.random() * 20) - 10)),
          alerts: Math.max(0, Math.min(10, prev.live_metrics.alerts + Math.floor(Math.random() * 3) - 1))
        }
      }));
    }, 3000);

    return () => clearInterval(liveInterval);
  }, []);

  const data = dashboardData || liveData;

  // Calculate collection rate
  const collectionRate = data.leased_properties > 0 
    ? Math.round((data.monthly_revenue / (data.monthly_revenue + data.monthly_expenses)) * 100)
    : 85;

  // KPI Cards Data
  const kpiCards = [
    {
      title: t('dashboard.monthlyTarget'),
      value: isRTL ? `${(data.monthly_revenue / 1000000).toFixed(1)} مليون ريال` : `${(data.monthly_revenue / 1000000).toFixed(1)}M SAR`,
      change: '+7.8%',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: t('dashboard.activeProjects'),
      value: data.total_properties.toString(),
      change: '+5.2%',
      trend: 'up',
      icon: <Building2 className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: t('dashboard.collectionRate'),
      value: `${collectionRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      title: t('dashboard.overduePayments'),
      value: '31',
      change: '-12.5%',
      trend: 'down',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-red-500'
    }
  ];

  // Collection Performance Data (6 months)
  const collectionData = [
    { month: isRTL ? 'يناير' : 'Jan', amount: 12500000, target: 13000000 },
    { month: isRTL ? 'فبراير' : 'Feb', amount: 13200000, target: 13000000 },
    { month: isRTL ? 'مارس' : 'Mar', amount: 12800000, target: 13000000 },
    { month: isRTL ? 'أبريل' : 'Apr', amount: 13500000, target: 13000000 },
    { month: isRTL ? 'مايو' : 'May', amount: 12900000, target: 13000000 },
    { month: isRTL ? 'يونيو' : 'Jun', amount: data.monthly_revenue, target: 13000000 }
  ];

  // Projects by Region Data
  const regionData = [
    { name: t('dashboard.northRiyadh'), value: 18, color: '#3B82F6' },
    { name: t('dashboard.southRiyadh'), value: 15, color: '#10B981' },
    { name: t('dashboard.eastRiyadh'), value: 12, color: '#F59E0B' },
    { name: t('dashboard.westRiyadh'), value: 14, color: '#EF4444' },
    { name: t('dashboard.centralRiyadh'), value: 11, color: '#8B5CF6' }
  ];

  // Agent Performance Data
  const agentData = [
    { name: 'Ahmed Al-Rashid', projects: 16, collection: 2650000, rate: '94%' },
    { name: 'Fatima Al-Zahra', projects: 14, collection: 2300000, rate: '91%' },
    { name: 'Mohammed Al-Saud', projects: 12, collection: 1980000, rate: '88%' },
    { name: 'Aisha Al-Mansouri', projects: 11, collection: 1850000, rate: '87%' },
    { name: 'Omar Al-Khalil', projects: 9, collection: 1650000, rate: '85%' }
  ];

  // Recent Collections Data
  const recentCollections = [
    { company: 'Al-Rajhi Logistics', agent: 'Ahmed Al-Rashid', amount: 850000, date: '2024-01-15' },
    { company: 'Saudi Warehousing Co.', agent: 'Fatima Al-Zahra', amount: 620000, date: '2024-01-15' },
    { company: 'Aramco Storage', agent: 'Mohammed Al-Saud', amount: 950000, date: '2024-01-14' },
    { company: 'SABIC Industrial', agent: 'Aisha Al-Mansouri', amount: 780000, date: '2024-01-14' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t('dashboard.title')}
            </h1>
            <p className="text-slate-300 mt-1">{t('dashboard.subtitle')}</p>
          </div>
          {error && (
            <Badge variant="destructive" className="ml-4">
              Backend Offline - Using Demo Data
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">{kpi.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                      <div className="flex items-center mt-2">
                        <span className={`text-sm font-medium ${
                          kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {kpi.change}
                        </span>
                        <span className="text-slate-400 text-sm ml-1">{t('dashboard.thisMonth')}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${kpi.color}`}>
                      {kpi.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection Performance Trends */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5" />
                {t('dashboard.collectionTrends')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={collectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value: any) => [`${(value / 1000000).toFixed(1)}M SAR`, isRTL ? 'التحصيل' : 'Collection']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3B82F6" 
                    fill="url(#colorAmount)"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#10B981" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Projects by Region */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <PieChart className="w-5 h-5" />
                {t('dashboard.projectDistribution')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value: any) => [`${value} ${t('projects')}`, '']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {regionData.map((region, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="text-sm text-slate-300">{region.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Metrics Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="w-5 h-5" />
                Live System Metrics
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full mr-2"
                  />
                  LIVE
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{data.live_metrics?.active_users || 47}</div>
                  <div className="text-sm text-blue-200">Active Users</div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-green-400 rounded-full mx-auto mt-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">System Load</span>
                    <span className="text-white">{data.live_metrics?.system_load || 23}%</span>
                  </div>
                  <Progress value={data.live_metrics?.system_load || 23} className="h-2" />
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{data.live_metrics?.recent_activity || 156}</div>
                  <div className="text-sm text-blue-200">Operations/min</div>
                  <div className="text-xs text-blue-300 mt-1">Real-time processing</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{data.live_metrics?.alerts || 3}</div>
                  <div className="text-sm text-blue-200">Active Alerts</div>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 text-xs mt-1">
                    Monitoring
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection Agent Performance */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5" />
                {t('dashboard.agentPerformance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentData.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-medium">{agent.name}</p>
                        <p className="text-slate-400 text-sm">{agent.projects} {t('projects')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        {isRTL ? `${(agent.collection / 1000000).toFixed(1)} مليون ريال` : `${(agent.collection / 1000000).toFixed(1)}M SAR`}
                      </p>
                      <p className="text-green-400 text-sm">{agent.rate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Collections */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="w-5 h-5" />
                {t('recentCollections')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCollections.map((collection, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{collection.company}</p>
                      <p className="text-slate-400 text-sm">{t('by')} {collection.agent}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        {isRTL ? `${(collection.amount / 1000).toFixed(0)} ألف ريال` : `${(collection.amount / 1000).toFixed(0)}K SAR`}
                      </p>
                      <p className="text-slate-400 text-sm">{collection.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BoardroomDashboard; 