import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  DollarSign, 
  FileText, 
  Settings,
  Building,
  TrendingUp,
  Calendar,
  HelpCircle,
  Menu,
  X,
  Building2,
  BarChart3,
  Smartphone,
  Eye,
  MessageSquare,
  Brain,
  Sparkles,
  Activity,
  Search,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BreadcrumbNav, BreadcrumbProvider } from '@/components/ui/breadcrumb-nav';
import { LoadingSpinner, PageLoading, SkeletonDashboard } from '@/components/ui/loading';
import { EnhancedSearch } from '@/components/ui/enhanced-search';
import { MobileNav } from '@/components/ui/mobile-nav';
import { AuthProvider, PermissionGate, UserRole, Permission } from '@/components/ui/role-based-ui';
import SimpleLanguageSwitcher, { LanguageProvider, useLanguage } from '@/components/SimpleLanguageSwitcher';
import NotificationCenter from '@/components/NotificationCenter';

// Import components
import BoardroomDashboard from './components/dashboard/BoardroomDashboard';
import ProjectManagement from './pages/PropertyManagement';
import CustomerPage from './pages/CustomerPage';
import SalesPage from './pages/SalesPage';
import FinancePage from './pages/FinancePage';
import SettingsPage from './pages/SettingsPage';
import AgentDashboard from './pages/AgentDashboard';
import OwnerCommandCenter from './pages/OwnerCommandCenter';
import AutomatedCommunications from './pages/AutomatedCommunications';
import PredictiveAnalytics from './pages/PredictiveAnalytics';
import AdvancedFeatures from './components/AdvancedFeatures';
import SystemStatus from './components/SystemStatus';
import SmartBuildingDashboard from './components/SmartBuildingDashboard';
// import BlockchainTokenization from './components/BlockchainTokenization';

// AI Analytics Dashboard Component
const AIAnalyticsDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [revenue, setRevenue] = useState(2847000);
  const [occupancy, setOccupancy] = useState(87.5);
  const [predictions, setPredictions] = useState(94);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue(prev => prev + Math.floor(Math.random() * 10000) - 5000);
      setOccupancy(prev => Math.max(80, Math.min(95, prev + (Math.random() - 0.5) * 2)));
      setPredictions(prev => Math.max(85, Math.min(99, prev + (Math.random() - 0.5) * 2)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </h1>
          <p className="text-xl text-gray-300">
            Real-time AI-powered insights and predictions for your portfolio
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-green-500 text-white">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full mr-2"
              />
              AI ACTIVE
            </Badge>
            <Badge variant="secondary" className="bg-blue-500 text-white">
              Real-time Data
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-100">Live Revenue</p>
                    <p className="text-3xl font-bold">
                      {(revenue / 1000000).toFixed(2)}M SAR
                    </p>
                    <p className="text-xs text-green-200 mt-1">
                      +{((revenue - 2800000) / 1000).toFixed(0)}K from target
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <DollarSign className="w-12 h-12 text-green-200" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-100">Occupancy Rate</p>
                    <p className="text-3xl font-bold">{occupancy.toFixed(1)}%</p>
                    <div className="mt-2">
                      <Progress value={occupancy} className="h-2" />
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Users className="w-12 h-12 text-purple-200" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100">AI Accuracy</p>
                    <p className="text-3xl font-bold">{predictions.toFixed(1)}%</p>
                    <p className="text-xs text-blue-200 mt-1">
                      Prediction confidence
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Brain className="w-12 h-12 text-blue-200" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-yellow-900 to-orange-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Market Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium">Next Month Forecast</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">+12.5% Growth</p>
                  <p className="text-sm text-yellow-200 mt-1">
                    Based on seasonal trends and market analysis
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-yellow-200">Risk Properties</p>
                    <p className="text-xl font-bold text-red-400">23</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-yellow-200">Opportunities</p>
                    <p className="text-xl font-bold text-green-400">47</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-900 to-red-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Active Users</span>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-3 h-3 bg-green-400 rounded-full"
                    />
                    <span className="font-bold">47</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>System Load</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>AI Processing</span>
                    <span>156 ops/min</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>

                <div className="flex justify-between items-center">
                  <span>Alerts</span>
                  <Badge variant="secondary" className="bg-yellow-500 text-black">
                    3 Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for missing pages
const LeasePage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('navigation.tenants')}</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Building className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('navigation.tenants')}</h2>
          <p className="text-gray-600">This module is under development. Coming soon!</p>
        </div>
      </div>
    </div>
  );
};

const DocumentsPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('navigation.contracts')}</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('navigation.contracts')}</h2>
          <p className="text-gray-600">This module is under development. Coming soon!</p>
        </div>
      </div>
    </div>
  );
};

const CalendarPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('navigation.renewals')}</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('navigation.renewals')}</h2>
          <p className="text-gray-600">This module is under development. Coming soon!</p>
        </div>
      </div>
    </div>
  );
};

const HelpPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('navigation.help')}</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <HelpCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('navigation.help')}</h2>
          <p className="text-gray-600">This module is under development. Coming soon!</p>
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
  badge?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, path, isActive, onClick, badge }) => (
  <motion.button
    whileHover={{ x: 4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
      isActive 
        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25' 
        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900'
    }`}
  >
    <div className={`transition-colors duration-200 ${
      isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
    }`}>
      {icon}
    </div>
    <span className="font-medium text-sm truncate flex-1">{label}</span>
    {badge && (
      <Badge 
        variant="secondary" 
        className={`text-xs px-2 py-0.5 ${
          isActive 
            ? 'bg-white/20 text-white border-white/30' 
            : badge === 'NEW' 
              ? 'bg-green-100 text-green-700 border-green-200'
              : badge === 'LIVE'
                ? 'bg-red-100 text-red-700 border-red-200'
                : 'bg-blue-100 text-blue-700 border-blue-200'
        }`}
      >
        {badge}
      </Badge>
    )}
  </motion.button>
);

const AppContent: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Mock user for role-based UI
  const mockUser = {
    id: '1',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed@company.com',
    role: UserRole.ADMIN,
    avatar: '/avatars/ahmed.jpg'
  };

  // Core Navigation Items
  const coreNavigationItems = [
    { 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      label: t('navigation.dashboard'), 
      path: '/dashboard',
      category: 'main'
    },
    { 
      icon: <Building2 className="w-5 h-5" />, 
      label: t('navigation.projects'), 
      path: '/properties',
      badge: '70',
      category: 'main'
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: t('navigation.agents'), 
      path: '/customers',
      badge: '7',
      category: 'main'
    },
    { 
      icon: <TrendingUp className="w-5 h-5" />, 
      label: t('navigation.collections'), 
      path: '/sales',
      badge: '85%',
      category: 'main'
    },
    { 
      icon: <DollarSign className="w-5 h-5" />, 
      label: t('navigation.finance'), 
      path: '/finance',
      category: 'main'
    }
  ];

  // Advanced Features
  const advancedNavigationItems = [
    { 
      icon: <Brain className="w-5 h-5" />, 
      label: 'Advanced Features', 
      path: '/advanced',
      badge: 'NEW',
      category: 'advanced'
    },
    { 
      icon: <Activity className="w-5 h-5" />, 
      label: 'AI Analytics', 
      path: '/ai-analytics',
      badge: 'LIVE',
      category: 'advanced'
    },
    { 
      icon: <Building className="w-5 h-5" />, 
      label: 'Smart Building IoT', 
      path: '/smart-building',
      badge: 'IoT',
      category: 'advanced'
    },
    { 
      icon: <Sparkles className="w-5 h-5" />, 
      label: 'Blockchain Tokens', 
      path: '/blockchain',
      badge: 'Web3',
      category: 'advanced'
    }
  ];

  // Secondary Navigation Items
  const secondaryNavigationItems = [
    { 
      icon: <Building className="w-5 h-5" />, 
      label: t('navigation.tenants'), 
      path: '/leases',
      badge: '1,247',
      category: 'secondary'
    },
    { 
      icon: <FileText className="w-5 h-5" />, 
      label: t('navigation.contracts'), 
      path: '/documents',
      category: 'secondary'
    },
    { 
      icon: <Calendar className="w-5 h-5" />, 
      label: t('navigation.renewals'), 
      path: '/calendar',
      category: 'secondary'
    },
    { 
      icon: <Settings className="w-5 h-5" />, 
      label: t('navigation.settings'), 
      path: '/settings',
      category: 'secondary'
    }
  ];

  const navigationItems = [...coreNavigationItems, ...advancedNavigationItems, ...secondaryNavigationItems];

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setSidebarOpen(false);
    // Simulate loading time for better UX
    setTimeout(() => {
      setCurrentPath(path);
      setIsLoading(false);
    }, 300);
  };

  // Breadcrumb generation
  const getBreadcrumbs = () => {
    const pathMap: Record<string, { label: string; icon?: React.ReactNode }> = {
      '/dashboard': { label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      '/properties': { label: 'Property Management', icon: <Building className="w-4 h-4" /> },
      '/customers': { label: 'Customer Management', icon: <Users className="w-4 h-4" /> },
      '/sales': { label: 'Sales', icon: <DollarSign className="w-4 h-4" /> },
      '/finance': { label: 'Finance', icon: <DollarSign className="w-4 h-4" /> },
      '/settings': { label: 'Settings', icon: <Settings className="w-4 h-4" /> },
      '/ai-analytics': { label: 'AI Analytics', icon: <Brain className="w-4 h-4" /> },
      '/smart-building': { label: 'Smart Building', icon: <Building2 className="w-4 h-4" /> },
      '/blockchain': { label: 'Blockchain', icon: <Sparkles className="w-4 h-4" /> }
    };

    const current = pathMap[currentPath];
    if (!current) return [];

    return [{ label: current.label, icon: current.icon, isActive: true }];
  };

  // Mobile navigation items
  const mobileNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, href: '/dashboard', isActive: currentPath === '/dashboard' },
    { id: 'properties', label: 'Properties', icon: <Building className="w-5 h-5" />, href: '/properties', isActive: currentPath === '/properties' },
    { id: 'customers', label: 'Customers', icon: <Users className="w-5 h-5" />, href: '/customers', isActive: currentPath === '/customers' },
    { id: 'sales', label: 'Sales', icon: <DollarSign className="w-5 h-5" />, href: '/sales', isActive: currentPath === '/sales' },
    { id: 'more', label: 'More', icon: <Menu className="w-5 h-5" />, href: '#', badge: '12' }
  ];

  // Search functionality
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search logic here
  };

  const handleSearchResultSelect = (result: any) => {
    console.log('Selected result:', result);
    if (result.url) {
      handleNavigation(result.url);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <BoardroomDashboard />;
      case '/properties':
        return <ProjectManagement />;
      case '/customers':
        return <CustomerPage />;
      case '/sales':
        return <SalesPage />;
      case '/leases':
        return <LeasePage />;
      case '/finance':
        return <FinancePage />;
      case '/documents':
        return <DocumentsPage />;
      case '/calendar':
        return <CalendarPage />;
      case '/settings':
        return <SettingsPage />;
      case '/help':
        return <HelpPage />;
      case '/advanced':
        return <AdvancedFeatures />;
      case '/ai-analytics':
        return <AIAnalyticsDashboard />;
      case '/smart-building':
        return <SmartBuildingDashboard />;
      case '/blockchain':
        return <div className="p-6"><h2 className="text-2xl font-bold">Blockchain Tokenization</h2><p className="text-muted-foreground">Feature temporarily unavailable</p></div>;
      case '/agent-dashboard':
        return <AgentDashboard />;
      case '/command-center':
        return <OwnerCommandCenter />;
      case '/communications':
        return <AutomatedCommunications />;
      case '/analytics':
        return <PredictiveAnalytics />;
      default:
        return <BoardroomDashboard />;
    }
  };

  // Special handling for dashboard - full screen without sidebar
  if (currentPath === '/dashboard') {
    return (
      <div className="relative">
        {/* Floating Navigation Button for Dashboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`fixed top-6 z-50 ${isRTL ? 'right-6' : 'left-6'}`}
        >
          <Button
            onClick={() => setSidebarOpen(true)}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-2xl"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Language Switcher and Notifications for Dashboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`fixed top-6 z-50 ${isRTL ? 'left-6' : 'right-6'} flex items-center gap-3`}
        >
          <NotificationCenter />
          <SimpleLanguageSwitcher />
        </motion.div>

        {/* Overlay Sidebar for Dashboard */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: isRTL ? 320 : -320 }}
                animate={{ x: 0 }}
                exit={{ x: isRTL ? 320 : -320 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`fixed ${isRTL ? 'right-0' : 'left-0'} top-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 border-${isRTL ? 'l' : 'r'} border-gray-200/50`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Real Estate ERP</h2>
                      <p className="text-sm text-gray-600">Executive Suite</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <nav className="space-y-6">
                    {/* Core Features */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                        Core Features
                      </h3>
                      <div className="space-y-1">
                        {coreNavigationItems.map((item) => (
                          <SidebarItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            isActive={currentPath === item.path}
                            onClick={() => {
                              handleNavigation(item.path);
                              setSidebarOpen(false);
                            }}
                            badge={item.badge}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Advanced Features */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                        AI & Advanced
                      </h3>
                      <div className="space-y-1">
                        {advancedNavigationItems.map((item) => (
                          <SidebarItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            isActive={currentPath === item.path}
                            onClick={() => {
                              handleNavigation(item.path);
                              setSidebarOpen(false);
                            }}
                            badge={item.badge}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Secondary Features */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                        Management
                      </h3>
                      <div className="space-y-1">
                        {secondaryNavigationItems.map((item) => (
                          <SidebarItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            isActive={currentPath === item.path}
                            onClick={() => {
                              handleNavigation(item.path);
                              setSidebarOpen(false);
                            }}
                            badge={item.badge}
                          />
                        ))}
                      </div>
                    </div>
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <BoardroomDashboard />
      </div>
    );
  }

  // Standard layout for other pages
  return (
    <AuthProvider user={mockUser}>
      <BreadcrumbProvider>
        <div className={`flex h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
          {/* Mobile Navigation */}
          <MobileNav
            items={navigationItems.map(item => ({
              id: item.path,
              label: item.label,
              icon: item.icon,
              href: item.path,
              isActive: currentPath === item.path,
              badge: item.badge
            }))}
            onNavigate={handleNavigation}
            onSearch={() => setSearchOpen(true)}
            onNotifications={() => setNotificationCount(0)}
            onProfile={() => handleNavigation('/profile')}
            user={mockUser}
            notificationCount={notificationCount}
          />

          {/* Desktop Sidebar */}
          <motion.div
            initial={{ x: isRTL ? 280 : -280 }}
            animate={{ x: 0 }}
            className={`w-72 bg-card shadow-xl border-${isRTL ? 'l' : 'r'} border-border flex flex-col hidden lg:flex`}
          >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Real Estate ERP</h1>
                <p className="text-sm text-gray-600">Management Suite</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <SimpleLanguageSwitcher />
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Core Features */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Core Features
            </h3>
            <div className="space-y-1">
              {coreNavigationItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isActive={currentPath === item.path}
                  onClick={() => handleNavigation(item.path)}
                  badge={item.badge}
                />
              ))}
            </div>
          </div>

          {/* Advanced Features */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              AI & Advanced
            </h3>
            <div className="space-y-1">
              {advancedNavigationItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isActive={currentPath === item.path}
                  onClick={() => handleNavigation(item.path)}
                  badge={item.badge}
                />
              ))}
            </div>
          </div>

          {/* Secondary Features */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Management
            </h3>
            <div className="space-y-1">
              {secondaryNavigationItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isActive={currentPath === item.path}
                  onClick={() => handleNavigation(item.path)}
                  badge={item.badge}
                />
              ))}
            </div>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-600">Administrator</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(true)}
          className="bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: isRTL ? 288 : -288 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? 288 : -288 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`lg:hidden fixed ${isRTL ? 'right-0' : 'left-0'} top-0 h-full w-72 bg-white shadow-2xl z-50 border-${isRTL ? 'l' : 'r'} border-gray-200`}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Real Estate ERP</h1>
                      <p className="text-sm text-gray-600">Management Suite</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Core Features */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Core Features
                  </h3>
                  <div className="space-y-1">
                    {coreNavigationItems.map((item) => (
                      <SidebarItem
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        path={item.path}
                        isActive={currentPath === item.path}
                        onClick={() => {
                          handleNavigation(item.path);
                          setSidebarOpen(false);
                        }}
                        badge={item.badge}
                      />
                    ))}
                  </div>
                </div>

                {/* Advanced Features */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    AI & Advanced
                  </h3>
                  <div className="space-y-1">
                    {advancedNavigationItems.map((item) => (
                      <SidebarItem
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        path={item.path}
                        isActive={currentPath === item.path}
                        onClick={() => {
                          handleNavigation(item.path);
                          setSidebarOpen(false);
                        }}
                        badge={item.badge}
                      />
                    ))}
                  </div>
                </div>

                {/* Secondary Features */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Management
                  </h3>
                  <div className="space-y-1">
                    {secondaryNavigationItems.map((item) => (
                      <SidebarItem
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        path={item.path}
                        isActive={currentPath === item.path}
                        onClick={() => {
                          handleNavigation(item.path);
                          setSidebarOpen(false);
                        }}
                        badge={item.badge}
                      />
                    ))}
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden lg:ml-0 flex flex-col">
        {/* Desktop Header */}
        <div className="hidden lg:flex bg-card border-b border-border p-4 items-center justify-between">
          <div className="flex-1">
            <BreadcrumbNav 
              items={getBreadcrumbs()} 
              onNavigate={handleNavigation}
              className="mb-2"
            />
            <h1 className="text-2xl font-bold text-foreground">
              {getBreadcrumbs()[0]?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Global Search */}
            <div className="w-96">
              <EnhancedSearch
                placeholder="Search across all modules..."
                onSearch={handleSearch}
                onResultSelect={handleSearchResultSelect}
                size="sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <SimpleLanguageSwitcher />
            </div>
          </div>
        </div>
        
        {/* Page Loading Overlay */}
        <PageLoading isLoading={isLoading} message="Loading page..." />
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {isLoading ? (
                <div className="p-6">
                  <SkeletonDashboard />
                </div>
              ) : (
                renderCurrentPage()
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
      </BreadcrumbProvider>
    </AuthProvider>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
      <SystemStatus />
    </LanguageProvider>
  );
};

export default App;
