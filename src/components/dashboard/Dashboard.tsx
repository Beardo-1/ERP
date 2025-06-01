import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Settings, 
  Download, 
  Share2, 
  Filter,
  Search,
  Bell,
  Palette,
  Layout,
  RefreshCw,
  Eye,
  Grid,
  Maximize,
  MoreHorizontal,
  Minimize,
  Upload
} from 'lucide-react';
import { DashboardWidget as DashboardWidgetType, WidgetType } from '../../types';
import { DashboardWidget } from './DashboardWidget';
import { AddWidgetModal } from './AddWidgetModal';
import { KPIOptionsModal } from './KPIOptionsModal';
import { useDashboardStore } from '../../store/dashboardStore';
import {
  salesStatistics,
  aiInsightsData,
  goalTrackerData,
  heatmapCalendarData,
  teamPerformanceData,
  mockAlerts
} from '../../store/dashboardStore';
import { UploadDataModal } from './UploadDataModal';

export const Dashboard: React.FC = () => {
  const {
    widgets,
    layouts,
    currentLayout,
    currentTheme,
    themes,
    isLoading,
    error,
    isCustomizing,
    expandedWidget,
    notifications,
    alerts,
    insights,
    isRealTimeEnabled,
    lastUpdate,
    searchQuery,
    globalFilters,
    
    // Actions
    loadDashboard,
    expandWidget,
    collapseWidget,
    removeWidget,
    updateWidget,
    addWidget,
    startCustomizing,
    stopCustomizing,
    switchLayout,
    switchTheme,
    setSearchQuery,
    addGlobalFilter,
    toggleRealTime,
    markNotificationRead,
    dismissAlert,
    addDataset
  } = useDashboardStore();

  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const [showKPIModal, setShowKPIModal] = useState(false);
  const [selectedWidgetForKPI, setSelectedWidgetForKPI] = useState<string | null>(null);
  const [showAllWidgets, setShowAllWidgets] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showUploadDataModal, setShowUploadDataModal] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Auto-refresh when real-time is enabled
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      loadDashboard();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, loadDashboard]);

  const currentLayoutData = layouts.find(l => l.id === currentLayout);
  const currentThemeData = themes.find(t => t.id === currentTheme);
  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const criticalAlerts = alerts.filter(a => a.priority === 'critical').length;

  const handleWidgetExpand = (widgetId: string) => {
    expandWidget(widgetId);
  };

  const handleWidgetCollapse = () => {
    collapseWidget();
  };

  const handleWidgetRemove = (widgetId: string) => {
    removeWidget(widgetId);
  };

  const handleWidgetEdit = (widgetId: string) => {
    setSelectedWidgetForKPI(widgetId);
    setShowKPIModal(true);
  };

  const getDefaultWidgetData = (type: WidgetType) => {
    switch (type) {
      case WidgetType.SALES_OVERVIEW:
        return salesStatistics;
      case WidgetType.AI_INSIGHTS:
        return aiInsightsData;
      case WidgetType.GOAL_TRACKER:
        return goalTrackerData;
      case WidgetType.HEATMAP_CALENDAR:
        return heatmapCalendarData;
      case WidgetType.TEAM_PERFORMANCE:
        return teamPerformanceData;
      case WidgetType.REAL_TIME_ALERTS:
        return { alerts: mockAlerts };
      case WidgetType.PIE_CHART:
        return {
          title: 'Revenue by Product',
          subtitle: 'Q4 2024 Distribution',
          total: 2450000,
          segments: [
            { label: 'Software Licenses', value: 980000, color: '#3b82f6', percentage: 40, trend: 'up', change: 12.5 },
            { label: 'Professional Services', value: 735000, color: '#10b981', percentage: 30, trend: 'up', change: 8.3 },
            { label: 'Support & Maintenance', value: 490000, color: '#f59e0b', percentage: 20, trend: 'stable', change: 0.2 },
            { label: 'Training', value: 245000, color: '#ef4444', percentage: 10, trend: 'down', change: -3.1 },
          ]
        };
      case WidgetType.LINE_CHART:
        return {
          title: 'Revenue Trends',
          subtitle: 'Monthly Performance',
          datasets: [
            {
              label: 'Current Year',
              color: '#3b82f6',
              trend: 'up',
              change: 15.3,
              data: [
                { x: 'Jan', y: 320 }, { x: 'Feb', y: 340 }, { x: 'Mar', y: 380 },
                { x: 'Apr', y: 420 }, { x: 'May', y: 450 }, { x: 'Jun', y: 480 },
                { x: 'Jul', y: 520 }, { x: 'Aug', y: 490 }, { x: 'Sep', y: 540 },
                { x: 'Oct', y: 580 }, { x: 'Nov', y: 620 }, { x: 'Dec', y: 650 }
              ]
            },
            {
              label: 'Previous Year',
              color: '#10b981',
              trend: 'up',
              change: 8.7,
              data: [
                { x: 'Jan', y: 280 }, { x: 'Feb', y: 290 }, { x: 'Mar', y: 310 },
                { x: 'Apr', y: 330 }, { x: 'May', y: 350 }, { x: 'Jun', y: 370 },
                { x: 'Jul', y: 390 }, { x: 'Aug', y: 410 }, { x: 'Sep', y: 430 },
                { x: 'Oct', y: 450 }, { x: 'Nov', y: 470 }, { x: 'Dec', y: 490 }
              ]
            }
          ]
        };
      case WidgetType.FUNNEL_CHART:
        return {
          title: 'Sales Funnel',
          subtitle: 'Lead Conversion Pipeline',
          totalLeads: 10000,
          conversionRate: 12.5,
          stages: [
            { label: 'Website Visitors', value: 10000, percentage: 100, color: '#3b82f6', conversionRate: 100, trend: 'up', change: 8.5 },
            { label: 'Leads Generated', value: 3500, percentage: 35, color: '#10b981', conversionRate: 35, trend: 'up', change: 12.3 },
            { label: 'Qualified Leads', value: 1750, percentage: 17.5, color: '#f59e0b', conversionRate: 50, trend: 'stable', change: 0.8 },
            { label: 'Opportunities', value: 875, percentage: 8.75, color: '#ef4444', conversionRate: 50, trend: 'up', change: 5.2 },
            { label: 'Customers', value: 250, percentage: 2.5, color: '#8b5cf6', conversionRate: 28.6, trend: 'up', change: 15.7 }
          ]
        };
      // Add more widget types as needed
      default:
        return {};
    }
  };

  const handleAddWidget = (type: any, config: any) => {
    const newWidget: DashboardWidgetType = {
      id: `widget-${Date.now()}`,
      type: type as WidgetType,
      title: config.title,
      width: config.width as 'small' | 'medium' | 'large' | 'full',
      height: config.height as 'small' | 'medium' | 'large' | 'xl',
      position: widgets.length,
      data: getDefaultWidgetData(type),
      refreshInterval: 300,
      lastUpdated: new Date().toISOString()
    };
    addWidget(newWidget);
  };

  const handleKPISave = (config: any) => {
    if (selectedWidgetForKPI) {
      updateWidget(selectedWidgetForKPI, { customConfig: config });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create and download a mock export file
      const exportData = {
        dashboard: {
          widgets: widgets.map(w => ({ id: w.id, type: w.type, title: w.title })),
          layout: currentLayoutData?.name,
          theme: currentThemeData?.name,
          exportedAt: new Date().toISOString()
        }
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Dashboard',
          text: `Check out my dashboard with ${widgets.length} widgets`,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Dashboard link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleNotificationClick = () => {
    // Mark all notifications as read
    notifications.forEach(notification => {
      if (!notification.isRead) {
        markNotificationRead(notification.id);
      }
    });
  };

  const handleViewAllWidgets = () => {
    setShowAllWidgets(!showAllWidgets);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, #1d4ed8 0%, transparent 50%)',
                'radial-gradient(circle at 40% 80%, #2563eb 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              background: 'conic-gradient(from 0deg, #60a5fa, #3b82f6, #1d4ed8, #1e40af, #60a5fa)',
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-6 shadow-2xl"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
            }}
          />
          <motion.p 
            className="text-white text-xl font-semibold tracking-wide"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            Loading dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-pink-900 flex items-center justify-center relative overflow-hidden">
        {/* Error Background Animation */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 30% 40%, #ef4444 0%, transparent 50%)',
              'radial-gradient(circle at 70% 60%, #dc2626 0%, transparent 50%)',
              'radial-gradient(circle at 30% 40%, #ef4444 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 relative z-10"
          style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          }}
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <motion.span 
              className="text-4xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ⚠️
            </motion.span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Dashboard Error</h2>
          <p className="text-white/80 mb-6 text-lg">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadDashboard}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden" style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Animated Blue Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 80%, #1d4ed8 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #2563eb 0%, transparent 50%), radial-gradient(circle at 20% 80%, #1e40af 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 0% 100%, #1d4ed8 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 80%, #1d4ed8 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Scrolling Wave Effect */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 opacity-20"
          animate={{
            background: [
              'linear-gradient(90deg, transparent, #60a5fa, transparent)',
              'linear-gradient(90deg, transparent, #3b82f6, transparent)',
              'linear-gradient(90deg, transparent, #1d4ed8, transparent)',
              'linear-gradient(90deg, transparent, #60a5fa, transparent)',
            ],
            x: ['-100%', '100%'],
          }}
          transition={{
            background: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 4, repeat: Infinity, ease: "linear" },
          }}
        />
        </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4 sticky top-0 z-40 shadow-2xl relative"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <motion.h1 
                className="text-3xl font-bold text-white tracking-tight"
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'linear-gradient(135deg, #ffffff, #e0e7ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                }}
              >
                Dashboard
              </motion.h1>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <span>{currentLayoutData?.name || 'Default Layout'}</span>
                <span>•</span>
                <span>{widgets.length} widgets</span>
                {lastUpdate && (
                  <>
                    <span>•</span>
                    <span>Updated {new Date(lastUpdate).toLocaleTimeString()}</span>
                  </>
          )}
        </div>
      </div>
            
            {/* Real-time indicator */}
            <div className="flex items-center space-x-2">
                <motion.div
                className={`w-3 h-3 rounded-full ${isRealTimeEnabled ? 'bg-green-400' : 'bg-gray-400'} shadow-lg`}
                animate={isRealTimeEnabled ? { 
                  boxShadow: [
                    '0 0 5px rgba(34, 197, 94, 0.5)',
                    '0 0 20px rgba(34, 197, 94, 0.8)',
                    '0 0 5px rgba(34, 197, 94, 0.5)',
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-xs text-white/70 font-medium">
                {isRealTimeEnabled ? 'Live' : 'Paused'}
                        </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search widgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                }}
              />
            </div>

            {/* Notifications */}
                <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNotificationClick}
              className="relative p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
              style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              }}
            >
              <Bell className="w-5 h-5 text-white" />
              {(unreadNotifications > 0 || criticalAlerts > 0) && (
                <motion.span 
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {unreadNotifications + criticalAlerts}
                </motion.span>
              )}
            </motion.button>

            {/* Filters */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl backdrop-blur-sm transition-all duration-300 border border-white/20 ${
                showFilters ? 'bg-blue-500/30 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              style={{
                background: showFilters 
                  ? 'linear-gradient(145deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.2))'
                  : 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              }}
            >
              <Filter className="w-5 h-5" />
            </motion.button>

            {/* Layout Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLayoutSelector(!showLayoutSelector)}
                className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                }}
              >
                <Layout className="w-5 h-5 text-white" />
              </motion.button>
              
              <AnimatePresence>
                {showLayoutSelector && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-3 z-50"
                    style={{
                      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                    }}
                  >
                    <div className="text-sm font-semibold text-white mb-3 px-2">Layouts</div>
                    {layouts.map((layout) => (
                      <motion.button
                        key={layout.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          switchLayout(layout.id);
                          setShowLayoutSelector(false);
                        }}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                          currentLayout === layout.id 
                            ? 'bg-blue-500/30 text-white border border-blue-400/50' 
                            : 'hover:bg-white/10 text-white/80 hover:text-white'
                        }`}
                      >
                        <div className="font-semibold">{layout.name}</div>
                        <div className="text-xs text-white/60">{layout.description}</div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
                  </div>

            {/* Theme Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                }}
              >
                <Palette className="w-5 h-5 text-white" />
              </motion.button>
              
              <AnimatePresence>
                {showThemeSelector && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-3 z-50"
                    style={{
                      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                    }}
                  >
                    <div className="text-sm font-semibold text-white mb-3 px-2">Themes</div>
                    {themes.map((theme) => (
                      <motion.button
                        key={theme.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          switchTheme(theme.id);
                          setShowThemeSelector(false);
                        }}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                          currentTheme === theme.id 
                            ? 'bg-blue-500/30 text-white border border-blue-400/50' 
                            : 'hover:bg-white/10 text-white/80 hover:text-white'
                        }`}
                      >
                        <div 
                          className="w-4 h-4 rounded-full border border-white/30 shadow-lg"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <span className="font-medium">{theme.name}</span>
                </motion.button>
              ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Real-time toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleRealTime}
              className={`p-3 rounded-xl backdrop-blur-sm transition-all duration-300 border border-white/20 ${
                isRealTimeEnabled 
                  ? 'bg-green-500/30 text-white' 
                  : 'bg-white/10 text-white/70'
              }`}
              style={{
                background: isRealTimeEnabled 
                  ? 'linear-gradient(145deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.2))'
                  : 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              }}
            >
              <motion.div
                animate={isRealTimeEnabled ? { rotate: 360 } : { rotate: 0 }}
                transition={isRealTimeEnabled ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.div>
            </motion.button>

            {/* Actions */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              disabled={isExporting}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 disabled:opacity-50"
              style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              }}
            >
              <motion.div
                animate={isExporting ? { y: [0, -2, 0] } : {}}
                transition={isExporting ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : {}}
              >
                <Download className="w-5 h-5 text-white" />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              disabled={isSharing}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 disabled:opacity-50"
              style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              }}
            >
              <motion.div
                animate={isSharing ? { scale: [1, 1.1, 1] } : {}}
                transition={isSharing ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : {}}
              >
                <Share2 className="w-5 h-5 text-white" />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadDataModal(true)}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
              style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              }}
            >
              <Upload className="w-5 h-5 text-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isCustomizing ? stopCustomizing : startCustomizing}
              className={`px-6 py-3 rounded-xl backdrop-blur-sm transition-all duration-300 border border-white/20 font-semibold ${
                isCustomizing 
                  ? 'bg-blue-500/40 text-white shadow-lg' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              style={{
                background: isCustomizing 
                  ? 'linear-gradient(145deg, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.3))'
                  : 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              }}
            >
              {isCustomizing ? 'Done' : 'Customize'}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4 relative z-30"
            style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            }}
          >
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-white">Filters:</span>
              <div className="flex items-center space-x-2">
                {globalFilters.map((filter) => (
                  <motion.span
                    key={filter.id}
                    className="px-3 py-1 bg-blue-500/30 text-white text-xs rounded-full border border-blue-400/50 font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    {filter.label}
                  </motion.span>
                ))}
                {globalFilters.length === 0 && (
                  <span className="text-sm text-white/60">No active filters</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="p-8 max-w-[1600px] mx-auto relative z-10">
        {/* Insights Banner */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
            }}
          >
            {/* Animated Background */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                background: [
                  'radial-gradient(circle at 0% 0%, #8b5cf6 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 100%, #3b82f6 0%, transparent 50%)',
                  'radial-gradient(circle at 0% 0%, #8b5cf6 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-12 h-12 bg-purple-500/30 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-purple-400/50"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.span 
                    className="text-white text-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🧠
                  </motion.span>
                </motion.div>
                <div>
                  <h3 className="font-bold text-white text-lg">AI Insights Available</h3>
                  <p className="text-sm text-white/70">
                    {insights.length} new insights detected
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-purple-500/40 backdrop-blur-sm text-white rounded-xl hover:bg-purple-500/60 transition-all duration-300 font-semibold border border-purple-400/50 shadow-lg"
              >
                View Insights
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Widgets Grid */}
        <motion.div
          layout
          className="grid grid-cols-12 gap-12 auto-rows-[200px] lg:auto-rows-[220px]"
          style={{ 
            minHeight: '800px',
            gridTemplateRows: 'repeat(auto-fit, minmax(200px, auto))',
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
        >
          <AnimatePresence>
            {(showAllWidgets ? widgets : widgets.slice(0, 3)).map((widget, index) => (
              <DashboardWidget
                key={widget.id}
                widget={widget}
                isExpanded={expandedWidget === widget.id}
                onExpand={() => handleWidgetExpand(widget.id)}
                onCollapse={handleWidgetCollapse}
                onRemove={() => handleWidgetRemove(widget.id)}
                onEdit={() => handleWidgetEdit(widget.id)}
              />
            ))}
            
            {/* Show More Button */}
            {widgets.length > 3 && !isCustomizing && !showAllWidgets && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  scale: 1.03, 
                  y: -8,
                  rotateX: -5,
                  rotateY: 5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="col-span-4 row-span-1"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleViewAllWidgets}
                  className="w-full h-full border-2 border-dashed border-white/30 rounded-3xl flex flex-col items-center justify-center text-white/70 hover:border-blue-400 hover:text-white hover:bg-blue-500/20 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    transform: 'translateZ(10px)',
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotateY: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Eye className="w-10 h-10 mb-3" />
                  </motion.div>
                  <span className="text-base font-bold">View All ({widgets.length})</span>
                </motion.button>
              </motion.div>
            )}
            
            {/* Show Less Button */}
            {showAllWidgets && !isCustomizing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  scale: 1.03, 
                  y: -8,
                  rotateX: -5,
                  rotateY: 5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="col-span-4 row-span-1"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleViewAllWidgets}
                  className="w-full h-full border-2 border-dashed border-white/30 rounded-3xl flex flex-col items-center justify-center text-white/70 hover:border-orange-400 hover:text-white hover:bg-orange-500/20 transition-all duration-300 shadow-2xl hover:shadow-orange-500/20 backdrop-blur-sm"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    transform: 'translateZ(10px)',
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotateY: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Minimize className="w-10 h-10 mb-3" />
                  </motion.div>
                  <span className="text-base font-bold">Show Less</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Widget Button */}
          {isCustomizing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ 
                scale: 1.03, 
                y: -8,
                rotateX: -5,
                rotateY: 5,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="col-span-4 row-span-1"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddWidgetModal(true)}
                className="w-full h-full border-2 border-dashed border-white/30 rounded-3xl flex flex-col items-center justify-center text-white/70 hover:border-green-400 hover:text-white hover:bg-green-500/20 transition-all duration-300 shadow-2xl hover:shadow-green-500/20 backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  transform: 'translateZ(10px)',
                }}
              >
                <motion.div
                  whileHover={{ rotate: 180, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Plus className="w-12 h-12 mb-3" />
                </motion.div>
                <span className="text-lg font-bold">Add Widget</span>
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Empty State */}
        {widgets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 relative"
          >
            <motion.div 
              className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Grid className="w-12 h-12 text-white/70" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-3">No widgets configured</h3>
            <p className="text-white/70 mb-8 text-lg">
              Start building your dashboard by adding some widgets
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddWidgetModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-2xl"
            >
              Add Your First Widget
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* Expanded Widget Modal */}
      <AnimatePresence>
        {expandedWidget && (
          <DashboardWidget
            widget={widgets.find(w => w.id === expandedWidget)!}
            isExpanded={true}
            onCollapse={handleWidgetCollapse}
            onEdit={() => handleWidgetEdit(expandedWidget)}
          />
        )}
            </AnimatePresence>

      {/* Add Widget Modal */}
      <AddWidgetModal
        isOpen={showAddWidgetModal}
        onClose={() => setShowAddWidgetModal(false)}
        onAddWidget={handleAddWidget}
      />

      {/* KPI Options Modal */}
      {selectedWidgetForKPI && (
        <KPIOptionsModal
          isOpen={showKPIModal}
          onClose={() => {
            setShowKPIModal(false);
            setSelectedWidgetForKPI(null);
          }}
          widget={widgets.find(w => w.id === selectedWidgetForKPI)!}
          onSave={handleKPISave}
        />
      )}

      {/* Upload Data Modal */}
      <UploadDataModal
        isOpen={showUploadDataModal}
        onClose={() => setShowUploadDataModal(false)}
        onUpload={(data: any[], name: string) => {
          addDataset({
            id: `dataset-${Date.now()}`,
            name,
            data,
            uploadedAt: new Date().toISOString()
          });
        }}
      />
    </div>
  );
};

export default Dashboard; 