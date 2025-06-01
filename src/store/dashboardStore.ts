import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  DashboardWidget, 
  WidgetType, 
  DashboardLayout, 
  DashboardTheme, 
  DashboardFilter, 
  DashboardAlert, 
  DashboardInsight, 
  DashboardComment, 
  DashboardNotification, 
  DashboardSettings,
  DashboardGoal,
  DashboardExport
} from '../types';

interface DashboardDataset {
  id: string;
  name: string;
  data: any[];
  uploadedAt: string;
}

interface DashboardState {
  // Core dashboard state
  widgets: DashboardWidget[];
  layouts: DashboardLayout[];
  currentLayout: string;
  isLoading: boolean;
  error: string | null;
  isCustomizing: boolean;
  
  // Theme and appearance
  themes: DashboardTheme[];
  currentTheme: string;
  
  // Filters and search
  globalFilters: DashboardFilter[];
  searchQuery: string;
  
  // Real-time features
  alerts: DashboardAlert[];
  insights: DashboardInsight[];
  notifications: DashboardNotification[];
  isRealTimeEnabled: boolean;
  lastUpdate: string;
  
  // Collaboration
  comments: DashboardComment[];
  activeUsers: Array<{ id: string; name: string; avatar?: string; lastSeen: string }>;
  
  // Goals and tracking
  goals: DashboardGoal[];
  
  // Settings
  settings: DashboardSettings;
  
  // Expanded widget state
  expandedWidget: string | null;
  
  // Export state
  exports: DashboardExport[];
  
  // Datasets
  datasets: DashboardDataset[];
  
  // Actions
  loadDashboard: () => Promise<void>;
  addWidget: (widget: DashboardWidget) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<DashboardWidget>) => void;
  expandWidget: (id: string) => void;
  collapseWidget: () => void;
  updateWidgetPosition: (id: string, position: number) => void;
  reorderWidgets: (widgetIds: string[]) => void;
  
  // Layout management
  createLayout: (layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  switchLayout: (layoutId: string) => void;
  updateLayout: (id: string, updates: Partial<DashboardLayout>) => void;
  deleteLayout: (id: string) => void;
  
  // Theme management
  switchTheme: (themeId: string) => void;
  createCustomTheme: (theme: Omit<DashboardTheme, 'id'>) => void;
  
  // Filter and search
  addGlobalFilter: (filter: DashboardFilter) => void;
  removeGlobalFilter: (filterId: string) => void;
  updateGlobalFilter: (filterId: string, updates: Partial<DashboardFilter>) => void;
  setSearchQuery: (query: string) => void;
  
  // Real-time features
  addAlert: (alert: Omit<DashboardAlert, 'id' | 'timestamp'>) => void;
  dismissAlert: (alertId: string) => void;
  addInsight: (insight: Omit<DashboardInsight, 'id' | 'timestamp'>) => void;
  dismissInsight: (insightId: string) => void;
  toggleRealTime: () => void;
  
  // Notifications
  addNotification: (notification: Omit<DashboardNotification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  
  // Comments
  addComment: (comment: Omit<DashboardComment, 'id' | 'timestamp'>) => void;
  updateComment: (commentId: string, updates: Partial<DashboardComment>) => void;
  deleteComment: (commentId: string) => void;
  
  // Goals
  addGoal: (goal: Omit<DashboardGoal, 'id'>) => void;
  updateGoal: (goalId: string, updates: Partial<DashboardGoal>) => void;
  deleteGoal: (goalId: string) => void;
  
  // Settings
  updateSettings: (updates: Partial<DashboardSettings>) => void;
  
  // Export
  exportDashboard: (config: Omit<DashboardExport, 'id' | 'status' | 'createdAt' | 'expiresAt'>) => Promise<string>;
  
  // Customization
  startCustomizing: () => void;
  stopCustomizing: () => void;
  resetToDefault: () => void;
  
  // Datasets
  addDataset: (dataset: DashboardDataset) => void;
  removeDataset: (id: string) => void;
}

// Mock data for enhanced features
const mockInsights: DashboardInsight[] = [
  {
    id: '1',
    title: 'Sales Trend Alert',
    description: 'Sales have increased by 23% compared to last month, driven primarily by the North region.',
    type: 'trend',
    confidence: 0.92,
    impact: 'high',
    category: 'Sales',
    data: { change: 23, region: 'North' },
    timestamp: new Date().toISOString(),
    isActionable: true,
    actions: [
      { label: 'View Details', action: 'view_sales_details' },
      { label: 'Share Insight', action: 'share_insight' }
    ]
  },
  {
    id: '2',
    title: 'Customer Churn Risk',
    description: 'AI model detected 15 customers at high risk of churning in the next 30 days.',
    type: 'anomaly',
    confidence: 0.87,
    impact: 'medium',
    category: 'Customer Success',
    data: { at_risk_customers: 15, timeframe: 30 },
    timestamp: new Date().toISOString(),
    isActionable: true,
    actions: [
      { label: 'View Customers', action: 'view_at_risk_customers' },
      { label: 'Create Campaign', action: 'create_retention_campaign' }
    ]
  }
];

const mockAlerts: DashboardAlert[] = [
  {
    id: '1',
    title: 'Revenue Target Alert',
    message: 'Monthly revenue target is 95% achieved with 3 days remaining.',
    type: 'warning',
    priority: 'medium',
    timestamp: new Date().toISOString(),
    isRead: false,
    actions: [
      { label: 'View Details', action: 'view_revenue_details', variant: 'primary' },
      { label: 'Dismiss', action: 'dismiss_alert', variant: 'secondary' }
    ],
    relatedWidget: '1',
    autoHide: false
  }
];

const mockGoals: DashboardGoal[] = [
  {
    id: '1',
    title: 'Q4 Revenue Target',
    description: 'Achieve $5M in revenue for Q4 2024',
    metric: 'revenue',
    target: 5000000,
    current: 4200000,
    unit: 'USD',
    deadline: '2024-12-31',
    category: 'Sales',
    priority: 'high',
    status: 'on-track',
    milestones: [
      { title: 'October Target', target: 1250000, deadline: '2024-10-31', completed: true },
      { title: 'November Target', target: 2500000, deadline: '2024-11-30', completed: true },
      { title: 'December Target', target: 5000000, deadline: '2024-12-31', completed: false }
    ],
    assignedTo: ['sales-team'],
    relatedWidgets: ['1', '7']
  }
];

// Default themes
const defaultThemes: DashboardTheme[] = [
  {
    id: 'light',
    name: 'Light Theme',
    mode: 'light',
    colors: {
      primary: '#4f46e5',
      secondary: '#6b7280',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    }
  },
  {
    id: 'dark',
    name: 'Dark Theme',
    mode: 'dark',
    colors: {
      primary: '#6366f1',
      secondary: '#9ca3af',
      accent: '#34d399',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#9ca3af',
      border: '#374151',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.4)'
    }
  }
];

// Default settings
const defaultSettings: DashboardSettings = {
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
  theme: 'light',
  layout: 'default',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  numberFormat: 'en-US',
  currency: 'USD',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    inApp: true,
    frequency: 'immediate'
  },
  privacy: {
    shareAnalytics: true,
    allowTracking: true
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    fontSize: 'medium'
  }
};

// Enhanced mock data with new widget types
export const salesStatistics = {
  currentMonth: 427500,
  previousMonth: 380200,
  growth: 12.4,
  byMonth: [
    { month: 'Jan', value: 320000 },
    { month: 'Feb', value: 340000 },
    { month: 'Mar', value: 380200 },
    { month: 'Apr', value: 427500 },
    { month: 'May', value: 450000 },
    { month: 'Jun', value: 472000 },
  ]
};

export const aiInsightsData = {
  insights: mockInsights,
  trends: [
    { metric: 'Revenue', trend: 'up', change: 12.4, confidence: 0.92 },
    { metric: 'Customer Acquisition', trend: 'up', change: 8.7, confidence: 0.85 },
    { metric: 'Churn Rate', trend: 'down', change: -2.1, confidence: 0.78 }
  ],
  predictions: [
    { metric: 'Next Month Revenue', value: 485000, confidence: 0.89 },
    { metric: 'Quarter End Revenue', value: 1420000, confidence: 0.82 }
  ]
};

export const goalTrackerData = {
  goals: mockGoals,
  summary: {
    total: 5,
    onTrack: 3,
    atRisk: 1,
    behind: 1,
    completed: 0
  }
};

export const heatmapCalendarData = {
  data: Array.from({ length: 365 }, (_, i) => ({
    date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    value: Math.floor(Math.random() * 100),
    events: Math.floor(Math.random() * 10)
  })),
  metrics: {
    totalEvents: 2847,
    averageDaily: 7.8,
    peakDay: '2024-03-15',
    peakValue: 98
  }
};

export const teamPerformanceData = {
  teams: [
    { name: 'Sales', performance: 92, target: 100, members: 12, trend: 'up' },
    { name: 'Marketing', performance: 87, target: 90, members: 8, trend: 'up' },
    { name: 'Support', performance: 95, target: 95, members: 15, trend: 'stable' },
    { name: 'Development', performance: 89, target: 85, members: 20, trend: 'up' }
  ],
  topPerformers: [
    { name: 'John Doe', team: 'Sales', score: 98 },
    { name: 'Jane Smith', team: 'Marketing', score: 96 },
    { name: 'Mike Johnson', team: 'Support', score: 94 }
  ]
};

const defaultWidgets: DashboardWidget[] = [
  {
    id: '1',
    type: WidgetType.SALES_OVERVIEW,
    title: 'Sales Overview',
    width: 'medium',
    height: 'small',
    position: 0,
    data: salesStatistics,
    refreshInterval: 30000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    type: WidgetType.AI_INSIGHTS,
    title: 'AI Insights',
    width: 'large',
    height: 'medium',
    position: 1,
    data: aiInsightsData,
    refreshInterval: 60000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    type: WidgetType.GOAL_TRACKER,
    title: 'Goal Tracker',
    width: 'medium',
    height: 'medium',
    position: 2,
    data: goalTrackerData,
    refreshInterval: 300000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    type: WidgetType.HEATMAP_CALENDAR,
    title: 'Activity Heatmap',
    width: 'large',
    height: 'medium',
    position: 3,
    data: heatmapCalendarData,
    refreshInterval: 3600000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    type: WidgetType.TEAM_PERFORMANCE,
    title: 'Team Performance',
    width: 'medium',
    height: 'medium',
    position: 4,
    data: teamPerformanceData,
    refreshInterval: 300000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '6',
    type: WidgetType.REAL_TIME_ALERTS,
    title: 'Real-time Alerts',
    width: 'small',
    height: 'medium',
    position: 5,
    data: { alerts: mockAlerts },
    refreshInterval: 5000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '7',
    type: WidgetType.PIE_CHART,
    title: 'Revenue Distribution',
    width: 'medium',
    height: 'medium',
    position: 6,
    data: {
      title: 'Revenue by Product',
      subtitle: 'Q4 2024 Distribution',
      total: 2450000,
      segments: [
        { label: 'Software Licenses', value: 980000, color: '#3b82f6', percentage: 40, trend: 'up', change: 12.5 },
        { label: 'Professional Services', value: 735000, color: '#10b981', percentage: 30, trend: 'up', change: 8.3 },
        { label: 'Support & Maintenance', value: 490000, color: '#f59e0b', percentage: 20, trend: 'stable', change: 0.2 },
        { label: 'Training', value: 245000, color: '#ef4444', percentage: 10, trend: 'down', change: -3.1 },
      ]
    },
    refreshInterval: 300000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '8',
    type: WidgetType.LINE_CHART,
    title: 'Revenue Trends',
    width: 'large',
    height: 'medium',
    position: 7,
    data: {
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
    },
    refreshInterval: 300000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '9',
    type: WidgetType.FUNNEL_CHART,
    title: 'Sales Funnel',
    width: 'medium',
    height: 'large',
    position: 8,
    data: {
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
    },
    refreshInterval: 300000,
    lastUpdated: new Date().toISOString()
  }
];

const defaultLayouts: DashboardLayout[] = [
  {
    id: 'default',
    name: 'Default Layout',
    description: 'Standard dashboard layout with key metrics',
    isDefault: true,
    widgets: defaultWidgets,
    gridConfig: {
      columns: 12,
      gap: 16,
      responsive: true
    },
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'executive',
    name: 'Executive View',
    description: 'High-level overview for executives',
    isDefault: false,
    widgets: defaultWidgets.filter(w => ['1', '2', '3'].includes(w.id)),
    gridConfig: {
      columns: 8,
      gap: 24,
      responsive: true
    },
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      // Initial state
      widgets: [...defaultWidgets],
      layouts: [...defaultLayouts],
      currentLayout: 'default',
      isLoading: false,
      error: null,
      isCustomizing: false,
      
      themes: [...defaultThemes],
      currentTheme: 'light',
      
      globalFilters: [],
      searchQuery: '',
      
      alerts: [...mockAlerts],
      insights: [...mockInsights],
      notifications: [],
      isRealTimeEnabled: true,
      lastUpdate: new Date().toISOString(),
      
      comments: [],
      activeUsers: [],
      
      goals: [...mockGoals],
      
      settings: { ...defaultSettings },
      
      expandedWidget: null,
      
      exports: [],
      
      datasets: [],
      
      // Core actions
      loadDashboard: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          
          const currentLayout = get().layouts.find(l => l.id === get().currentLayout);
          const widgets = currentLayout?.widgets || defaultWidgets;
          
          set({ 
            widgets,
            isLoading: false,
            lastUpdate: new Date().toISOString()
          });
        } catch (error) {
          set({
            isLoading: false,
            error: 'Failed to load dashboard data'
          });
        }
      },
      
      addWidget: (widget) => set((state) => ({
        widgets: [...state.widgets, widget]
      })),
      
      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter(widget => widget.id !== id)
      })),
      
      updateWidget: (id, updates) => set((state) => ({
        widgets: state.widgets.map(widget => 
          widget.id === id ? { ...widget, ...updates } : widget
        )
      })),
      
      expandWidget: (id) => set({ expandedWidget: id }),
      collapseWidget: () => set({ expandedWidget: null }),
      
      updateWidgetPosition: (id, position) => set((state) => {
        const widgetIndex = state.widgets.findIndex((widget) => widget.id === id);
        if (widgetIndex === -1) return state;
        
        const updatedWidgets = [...state.widgets];
        const [movedWidget] = updatedWidgets.splice(widgetIndex, 1);
        updatedWidgets.splice(position, 0, { ...movedWidget, position });
        
        return {
          widgets: updatedWidgets.map((widget, index) => ({
            ...widget,
            position: index,
          })),
        };
      }),
      
      reorderWidgets: (widgetIds) => set((state) => {
        const widgetMap = new Map(state.widgets.map(widget => [widget.id, widget]));
        const reorderedWidgets = widgetIds.map((id, index) => {
          const widget = widgetMap.get(id);
          return widget ? { ...widget, position: index } : null;
        }).filter(Boolean) as DashboardWidget[];
        
        return { widgets: reorderedWidgets };
      }),
      
      // Layout management
      createLayout: (layout) => set((state) => {
        const newLayout = {
          ...layout,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return { layouts: [...state.layouts, newLayout] };
      }),
      
      switchLayout: (layoutId) => set((state) => {
        const layout = state.layouts.find(l => l.id === layoutId);
        if (!layout) return state;
        
        return {
          currentLayout: layoutId,
          widgets: [...layout.widgets]
        };
      }),
      
      updateLayout: (id, updates) => set((state) => ({
        layouts: state.layouts.map(layout =>
          layout.id === id 
            ? { ...layout, ...updates, updatedAt: new Date().toISOString() }
            : layout
        )
      })),
      
      deleteLayout: (id) => set((state) => ({
        layouts: state.layouts.filter(layout => layout.id !== id)
      })),
      
      // Theme management
      switchTheme: (themeId) => set((state) => ({
        currentTheme: themeId,
        settings: { ...state.settings, theme: themeId }
      })),
      
      createCustomTheme: (theme) => set((state) => {
        const newTheme = {
          ...theme,
          id: Date.now().toString()
        };
        return { themes: [...state.themes, newTheme] };
      }),
      
      // Filter and search
      addGlobalFilter: (filter) => set((state) => ({
        globalFilters: [...state.globalFilters, filter]
      })),
      
      removeGlobalFilter: (filterId) => set((state) => ({
        globalFilters: state.globalFilters.filter(f => f.id !== filterId)
      })),
      
      updateGlobalFilter: (filterId, updates) => set((state) => ({
        globalFilters: state.globalFilters.map(filter =>
          filter.id === filterId ? { ...filter, ...updates } : filter
        )
      })),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // Real-time features
      addAlert: (alert) => set((state) => {
        const newAlert = {
          ...alert,
          id: Date.now().toString(),
          timestamp: new Date().toISOString()
        };
        return { alerts: [newAlert, ...state.alerts] };
      }),
      
      dismissAlert: (alertId) => set((state) => ({
        alerts: state.alerts.filter(alert => alert.id !== alertId)
      })),
      
      addInsight: (insight) => set((state) => {
        const newInsight = {
          ...insight,
          id: Date.now().toString(),
          timestamp: new Date().toISOString()
        };
        return { insights: [newInsight, ...state.insights] };
      }),
      
      dismissInsight: (insightId) => set((state) => ({
        insights: state.insights.filter(insight => insight.id !== insightId)
      })),
      
      toggleRealTime: () => set((state) => ({
        isRealTimeEnabled: !state.isRealTimeEnabled
      })),
      
      // Notifications
      addNotification: (notification) => set((state) => {
        const newNotification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date().toISOString()
        };
        return { notifications: [newNotification, ...state.notifications] };
      }),
      
      markNotificationRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map(notification =>
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      })),
      
      clearAllNotifications: () => set({ notifications: [] }),
      
      // Comments
      addComment: (comment) => set((state) => {
        const newComment = {
          ...comment,
          id: Date.now().toString(),
          timestamp: new Date().toISOString()
        };
        return { comments: [...state.comments, newComment] };
      }),
      
      updateComment: (commentId, updates) => set((state) => ({
        comments: state.comments.map(comment =>
          comment.id === commentId ? { ...comment, ...updates } : comment
        )
      })),
      
      deleteComment: (commentId) => set((state) => ({
        comments: state.comments.filter(comment => comment.id !== commentId)
      })),
      
      // Goals
      addGoal: (goal) => set((state) => {
        const newGoal = {
          ...goal,
          id: Date.now().toString()
        };
        return { goals: [...state.goals, newGoal] };
      }),
      
      updateGoal: (goalId, updates) => set((state) => ({
        goals: state.goals.map(goal =>
          goal.id === goalId ? { ...goal, ...updates } : goal
        )
      })),
      
      deleteGoal: (goalId) => set((state) => ({
        goals: state.goals.filter(goal => goal.id !== goalId)
      })),
      
      // Settings
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      
      // Export
      exportDashboard: async (config) => {
        const exportId = Date.now().toString();
        const newExport: DashboardExport = {
          ...config,
          id: exportId,
          status: 'pending',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };
        
        set((state) => ({
          exports: [...state.exports, newExport]
        }));
        
        // Simulate export processing
        setTimeout(() => {
          set((state) => ({
            exports: state.exports.map(exp =>
              exp.id === exportId 
                ? { 
                    ...exp, 
                    status: 'completed', 
                    downloadUrl: `/api/exports/${exportId}/download` 
                  }
                : exp
            )
          }));
        }, 3000);
        
        return exportId;
      },
      
      // Customization
      startCustomizing: () => set({ isCustomizing: true }),
      stopCustomizing: () => set({ isCustomizing: false }),
      
      resetToDefault: () => set({ 
        widgets: [...defaultWidgets],
        currentLayout: 'default'
      }),
      
      // Datasets
      addDataset: (dataset) => set((state) => ({ datasets: [...state.datasets, dataset] })),
      removeDataset: (id) => set((state) => ({ datasets: state.datasets.filter(d => d.id !== id) })),
    }),
    {
      name: 'enhanced-dashboard-storage',
      partialize: (state) => ({
        widgets: state.widgets,
        currentLayout: state.currentLayout,
        currentTheme: state.currentTheme,
        settings: state.settings,
        layouts: state.layouts,
        themes: state.themes,
        goals: state.goals
      })
    }
  )
);

export { mockAlerts };