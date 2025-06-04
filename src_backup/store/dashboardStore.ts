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

// Sample data for widgets
const sampleSalesData = {
  currentMonth: 125000,
  previousMonth: 98000,
  growth: 27.6,
  target: 150000,
  transactions: 1247,
  averageOrderValue: 100.24,
  topProducts: [
    { name: 'Premium Software License', sales: 45000, growth: 15.2 },
    { name: 'Consulting Services', sales: 32000, growth: 8.7 },
    { name: 'Training Package', sales: 28000, growth: 22.1 },
    { name: 'Support Contract', sales: 20000, growth: -3.4 }
  ],
  monthlyTrend: [
    { month: 'Jan', sales: 85000, target: 120000 },
    { month: 'Feb', sales: 92000, target: 125000 },
    { month: 'Mar', sales: 98000, target: 130000 },
    { month: 'Apr', sales: 125000, target: 150000 }
  ]
};

const sampleRevenueData = {
  total: 2450000,
  growth: 18.5,
  recurring: 1680000,
  oneTime: 770000,
  forecast: 2850000,
  breakdown: [
    { category: 'Software Licenses', amount: 980000, percentage: 40 },
    { category: 'Services', amount: 735000, percentage: 30 },
    { category: 'Support', amount: 490000, percentage: 20 },
    { category: 'Training', amount: 245000, percentage: 10 }
  ],
  quarterlyTrend: [
    { quarter: 'Q1 2023', revenue: 2100000 },
    { quarter: 'Q2 2023', revenue: 2250000 },
    { quarter: 'Q3 2023', revenue: 2380000 },
    { quarter: 'Q4 2023', revenue: 2450000 }
  ]
};

const sampleCustomerData = {
  total: 1247,
  newThisMonth: 89,
  churnRate: 2.3,
  satisfaction: 4.6,
  lifetimeValue: 15420,
  segments: [
    { name: 'Enterprise', count: 156, revenue: 1470000 },
    { name: 'Mid-Market', count: 423, revenue: 735000 },
    { name: 'Small Business', count: 668, revenue: 245000 }
  ],
  acquisitionChannels: [
    { channel: 'Direct Sales', customers: 456, cost: 125 },
    { channel: 'Digital Marketing', customers: 334, cost: 89 },
    { channel: 'Referrals', customers: 267, cost: 45 },
    { channel: 'Partners', customers: 190, cost: 156 }
  ]
};

const samplePerformanceData = {
  overallScore: 87.5,
  efficiency: 92.1,
  quality: 85.3,
  customerSatisfaction: 89.7,
  teamProductivity: 84.2,
  metrics: [
    { name: 'Response Time', value: '2.3 hrs', target: '< 4 hrs', status: 'good' },
    { name: 'Resolution Rate', value: '94.2%', target: '> 90%', status: 'excellent' },
    { name: 'First Call Resolution', value: '78.5%', target: '> 75%', status: 'good' },
    { name: 'Customer Effort Score', value: '3.2', target: '< 3.5', status: 'good' }
  ],
  departmentScores: [
    { department: 'Sales', score: 91.2, trend: 'up' },
    { department: 'Support', score: 88.7, trend: 'up' },
    { department: 'Development', score: 85.1, trend: 'stable' },
    { department: 'Marketing', score: 83.9, trend: 'down' }
  ]
};

const sampleInventoryData = {
  totalItems: 2847,
  lowStock: 23,
  outOfStock: 7,
  totalValue: 1250000,
  turnoverRate: 4.2,
  categories: [
    { name: 'Software Products', items: 156, value: 850000, status: 'healthy' },
    { name: 'Hardware', items: 423, value: 280000, status: 'low' },
    { name: 'Accessories', items: 1268, value: 95000, status: 'healthy' },
    { name: 'Services', items: 1000, value: 25000, status: 'critical' }
  ],
  recentMovements: [
    { item: 'Premium License Pack', type: 'out', quantity: 45, date: '2024-01-15' },
    { item: 'Training Materials', type: 'in', quantity: 120, date: '2024-01-14' },
    { item: 'Support Contracts', type: 'out', quantity: 78, date: '2024-01-13' }
  ]
};

const sampleProjectData = {
  total: 34,
  active: 28,
  completed: 6,
  overdue: 3,
  onTrack: 19,
  atRisk: 6,
  budget: {
    allocated: 2500000,
    spent: 1680000,
    remaining: 820000
  },
  projects: [
    { name: 'ERP System Upgrade', progress: 78, status: 'on-track', budget: 450000, team: 8 },
    { name: 'Mobile App Development', progress: 45, status: 'at-risk', budget: 280000, team: 6 },
    { name: 'Data Migration', progress: 92, status: 'on-track', budget: 150000, team: 4 },
    { name: 'Security Audit', progress: 23, status: 'overdue', budget: 75000, team: 3 }
  ]
};

const createInitialState = (): DashboardState => ({
  // Core dashboard state
  widgets: [
    {
      id: 'sales-overview',
      type: WidgetType.SALES_OVERVIEW,
      title: 'Sales Overview',
      width: 'large',
      height: 'large',
      position: 0,
      isExpanded: false,
      refreshInterval: 300000, // 5 minutes
      lastUpdated: new Date().toISOString(),
      permissions: ['view', 'edit'],
      data: sampleSalesData
    },
    {
      id: 'revenue-analytics',
      type: WidgetType.REVENUE_BREAKDOWN,
      title: 'Revenue Analytics',
      width: 'large',
      height: 'large',
      position: 1,
      isExpanded: false,
      refreshInterval: 600000, // 10 minutes
      lastUpdated: new Date().toISOString(),
      permissions: ['view', 'edit'],
      data: sampleRevenueData
    },
    {
      id: 'customer-insights',
      type: WidgetType.CUSTOMER_SEGMENTS,
      title: 'Customer Insights',
      width: 'medium',
      height: 'medium',
      position: 2,
      isExpanded: false,
      refreshInterval: 900000, // 15 minutes
      lastUpdated: new Date().toISOString(),
      permissions: ['view'],
      data: sampleCustomerData
    },
    {
      id: 'performance-metrics',
      type: WidgetType.KPI_CARD,
      title: 'Performance Metrics',
      width: 'medium',
      height: 'medium',
      position: 3,
      isExpanded: false,
      refreshInterval: 300000,
      lastUpdated: new Date().toISOString(),
      permissions: ['view', 'edit'],
      data: samplePerformanceData
    },
    {
      id: 'inventory-status',
      type: WidgetType.INVENTORY_STATUS,
      title: 'Inventory Status',
      width: 'medium',
      height: 'medium',
      position: 4,
      isExpanded: false,
      refreshInterval: 1800000, // 30 minutes
      lastUpdated: new Date().toISOString(),
      permissions: ['view', 'edit'],
      data: sampleInventoryData
    },
    {
      id: 'project-tracker',
      type: WidgetType.PROGRESS_RING,
      title: 'Project Tracker',
      width: 'large',
      height: 'medium',
      position: 5,
      isExpanded: false,
      refreshInterval: 600000,
      lastUpdated: new Date().toISOString(),
      permissions: ['view', 'edit'],
      data: sampleProjectData
    },
    {
      id: 'ai-insights',
      type: WidgetType.AI_INSIGHTS,
      title: 'AI Insights',
      width: 'large',
      height: 'medium',
      position: 6,
      isExpanded: false,
      refreshInterval: 1800000,
      lastUpdated: new Date().toISOString(),
      permissions: ['view'],
      data: {
        insights: [
          {
            id: '1',
            type: 'trend',
            title: 'Revenue Growth Acceleration',
            description: 'Revenue growth has accelerated to 18.5% this quarter, primarily driven by enterprise customer acquisitions and premium product sales.',
            confidence: 0.92,
            impact: 'high',
            actionable: true,
            actions: [
              { label: 'Increase sales team capacity', action: 'expand_sales_team' },
              { label: 'Expand premium product line', action: 'expand_products' },
              { label: 'Develop enterprise-specific features', action: 'develop_features' }
            ],
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            type: 'anomaly',
            title: 'Support Ticket Volume Decrease',
            description: 'Support ticket volume has decreased by 15% while customer base grew by 12%, indicating improved product quality.',
            confidence: 0.87,
            impact: 'medium',
            actionable: true,
            actions: [
              { label: 'Document quality improvements', action: 'document_improvements' },
              { label: 'Share best practices across teams', action: 'share_practices' },
              { label: 'Invest in preventive measures', action: 'invest_prevention' }
            ],
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            type: 'recommendation',
            title: 'Cross-sell Potential Identified',
            description: 'Analysis shows 67% of enterprise customers are prime candidates for additional service packages.',
            confidence: 0.84,
            impact: 'high',
            actionable: true,
            actions: [
              { label: 'Create targeted cross-sell campaigns', action: 'create_campaigns' },
              { label: 'Train sales team on service packages', action: 'train_sales' },
              { label: 'Develop customer success playbooks', action: 'develop_playbooks' }
            ],
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '4',
            type: 'forecast',
            title: 'Q2 Revenue Projection',
            description: 'Based on current trends, Q2 revenue is projected to reach $2.85M, exceeding target by 14%.',
            confidence: 0.84,
            impact: 'high',
            actionable: false,
            actions: [],
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
          }
        ],
        trends: [
          { metric: 'Revenue Growth', value: '+18.5%', trend: 'up', period: '3 months' },
          { metric: 'Customer Acquisition', value: '+12.3%', trend: 'up', period: '1 month' },
          { metric: 'Support Tickets', value: '-8.7%', trend: 'down', period: '2 weeks' },
          { metric: 'Product Adoption', value: '+25.1%', trend: 'up', period: '6 weeks' }
        ],
        predictions: [
          { metric: 'Next Month Sales', value: '$142K', confidence: 0.87, change: '+13.6%' },
          { metric: 'Customer Growth', value: '+95 customers', confidence: 0.79, change: '+6.8%' },
          { metric: 'Churn Risk', value: '2.1%', confidence: 0.82, change: '-0.2%' }
        ]
      }
    },
    {
      id: 'goal-tracker',
      type: WidgetType.GOAL_TRACKER,
      title: 'Goal Tracker',
      width: 'medium',
      height: 'large',
      position: 7,
      isExpanded: false,
      refreshInterval: 3600000, // 1 hour
      lastUpdated: new Date().toISOString(),
      permissions: ['view', 'edit'],
      data: {
        goals: [
          {
            id: '1',
            title: 'Q1 Revenue Target',
            description: 'Achieve $2.5M in revenue for Q1 2024',
            target: 2500000,
            current: 2450000,
            progress: 98,
            status: 'on-track',
            priority: 'high',
            dueDate: '2024-03-31',
            assignedTeam: 'Sales',
            milestones: [
              { title: 'January Target', completed: true, date: '2024-01-31' },
              { title: 'February Target', completed: true, date: '2024-02-29' },
              { title: 'March Target', completed: false, date: '2024-03-31' }
            ]
          },
          {
            id: '2',
            title: 'Customer Satisfaction Score',
            description: 'Maintain customer satisfaction above 4.5/5.0',
            target: 4.5,
            current: 4.6,
            progress: 102,
            status: 'completed',
            priority: 'medium',
            dueDate: '2024-12-31',
            assignedTeam: 'Support',
            milestones: [
              { title: 'Q1 Review', completed: true, date: '2024-03-31' },
              { title: 'Q2 Review', completed: false, date: '2024-06-30' }
            ]
          },
          {
            id: '3',
            title: 'New Product Launch',
            description: 'Launch AI-powered analytics module',
            target: 100,
            current: 67,
            progress: 67,
            status: 'at-risk',
            priority: 'high',
            dueDate: '2024-04-15',
            assignedTeam: 'Development',
            milestones: [
              { title: 'Beta Testing', completed: true, date: '2024-02-15' },
              { title: 'Security Audit', completed: true, date: '2024-03-01' },
              { title: 'Documentation', completed: false, date: '2024-03-30' },
              { title: 'Marketing Campaign', completed: false, date: '2024-04-10' }
            ]
          },
          {
            id: '4',
            title: 'Team Expansion',
            description: 'Hire 15 new team members across departments',
            target: 15,
            current: 8,
            progress: 53,
            status: 'behind',
            priority: 'medium',
            dueDate: '2024-06-30',
            assignedTeam: 'HR',
            milestones: [
              { title: 'Job Postings', completed: true, date: '2024-01-15' },
              { title: 'First Round Hires', completed: true, date: '2024-02-28' },
              { title: 'Second Round Hires', completed: false, date: '2024-04-30' }
            ]
          }
        ],
        summary: {
          totalGoals: 4,
          completed: 1,
          onTrack: 1,
          atRisk: 1,
          behind: 1,
          overallProgress: 80
        }
      }
    },
    {
      id: 'heatmap-calendar',
      type: WidgetType.HEATMAP_CALENDAR,
      title: 'Activity Heatmap',
      width: 'medium',
      height: 'large',
      position: 8,
      isExpanded: false,
      refreshInterval: 3600000,
      lastUpdated: new Date().toISOString(),
      permissions: ['view'],
      data: {
        activities: generateHeatmapData(),
        metrics: {
          totalActivities: 1247,
          averageDaily: 42,
          peakDay: 89,
          streakDays: 12
        }
      }
    },
    {
      id: 'team-performance',
      type: WidgetType.TEAM_PERFORMANCE,
      title: 'Team Performance',
      width: 'medium',
      height: 'large',
      position: 9,
      isExpanded: false,
      refreshInterval: 1800000,
      lastUpdated: new Date().toISOString(),
      permissions: ['view', 'edit'],
      data: {
        teams: [
          {
            id: '1',
            name: 'Sales Team',
            performance: 94.2,
            target: 90,
            trend: 'up',
            members: 12,
            metrics: {
              revenue: 1250000,
              deals: 89,
              conversion: 23.4
            }
          },
          {
            id: '2',
            name: 'Development',
            performance: 87.8,
            target: 85,
            trend: 'up',
            members: 18,
            metrics: {
              velocity: 42,
              bugs: 7,
              features: 15
            }
          },
          {
            id: '3',
            name: 'Support',
            performance: 91.5,
            target: 88,
            trend: 'stable',
            members: 8,
            metrics: {
              tickets: 234,
              satisfaction: 4.6,
              resolution: 2.3
            }
          },
          {
            id: '4',
            name: 'Marketing',
            performance: 78.9,
            target: 82,
            trend: 'down',
            members: 6,
            metrics: {
              leads: 456,
              conversion: 12.8,
              roi: 3.2
            }
          }
        ],
        topPerformers: [
          { name: 'Sarah Johnson', team: 'Sales', score: 98.5, achievement: 'Top Revenue Generator' },
          { name: 'Mike Chen', team: 'Development', score: 96.2, achievement: 'Code Quality Champion' },
          { name: 'Lisa Rodriguez', team: 'Support', score: 94.8, achievement: 'Customer Hero' }
        ],
        overall: {
          performance: 88.1,
          target: 86.25,
          trend: 'up'
        }
      }
    },
    {
      id: 'real-time-alerts',
      type: WidgetType.REAL_TIME_ALERTS,
      title: 'Real-time Alerts',
      width: 'full',
      height: 'small',
      position: 10,
      isExpanded: false,
      refreshInterval: 30000, // 30 seconds
      lastUpdated: new Date().toISOString(),
      permissions: ['view', 'edit'],
      data: {
        alerts: [
          {
            id: '1',
            type: 'error',
            title: 'System Performance Degradation',
            message: 'Database response times have increased by 300% in the last hour. Immediate attention required.',
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            isRead: false,
            actions: [
              { label: 'Scale database', action: 'scale_db', variant: 'primary' },
              { label: 'Check query performance', action: 'check_queries', variant: 'secondary' },
              { label: 'Contact DevOps team', action: 'contact_devops', variant: 'danger' }
            ]
          },
          {
            id: '2',
            type: 'warning',
            title: 'Low Inventory Alert',
            message: 'Premium License Pack inventory is below minimum threshold (23 units remaining)',
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            isRead: false,
            actions: ['Reorder stock', 'Contact supplier'],
            source: 'Inventory'
          },
          {
            id: '3',
            type: 'info',
            title: 'New Customer Milestone',
            message: 'Congratulations! You have reached 1,250 total customers',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            isRead: true,
            actions: ['Send celebration email', 'Update marketing materials'],
            source: 'Sales'
          },
          {
            id: '4',
            type: 'success',
            title: 'Monthly Target Achieved',
            message: 'Sales team has exceeded monthly target by 27.6%',
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            isRead: true,
            actions: ['Celebrate with team', 'Analyze success factors'],
            source: 'Sales'
          },
          {
            id: '5',
            type: 'warning',
            title: 'Project Deadline Approaching',
            message: 'AI Analytics Module launch is due in 3 days with 67% completion',
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            isRead: false,
            actions: ['Review project status', 'Allocate additional resources'],
            source: 'Projects'
          }
        ],
        unreadCount: 3,
        isLive: true
      }
    }
  ],

  // Enhanced insights with comprehensive data
  insights: [
    {
      id: '1',
      type: 'trend',
      title: 'Revenue Growth Acceleration',
      description: 'Revenue growth has accelerated to 18.5% this quarter, primarily driven by enterprise customer acquisitions and premium product sales.',
      confidence: 0.92,
      impact: 'high',
      category: 'Revenue',
      data: {},
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isActionable: true,
      actions: [
        { label: 'Increase sales team capacity', action: 'expand_sales_team' },
        { label: 'Expand premium product line', action: 'expand_products' },
        { label: 'Develop enterprise-specific features', action: 'develop_features' }
      ]
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Support Ticket Volume Decrease',
      description: 'Support ticket volume has decreased by 15% while customer base grew by 12%, indicating improved product quality.',
      confidence: 0.87,
      impact: 'medium',
      category: 'Support',
      data: {},
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isActionable: true,
      actions: [
        { label: 'Document quality improvements', action: 'document_improvements' },
        { label: 'Share best practices across teams', action: 'share_practices' },
        { label: 'Invest in preventive measures', action: 'invest_prevention' }
      ]
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Cross-sell Potential Identified',
      description: 'Analysis shows 67% of enterprise customers are prime candidates for additional service packages.',
      confidence: 0.84,
      impact: 'high',
      category: 'Sales',
      data: {},
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      isActionable: true,
      actions: [
        { label: 'Create targeted cross-sell campaigns', action: 'create_campaigns' },
        { label: 'Train sales team on service packages', action: 'train_sales' },
        { label: 'Develop customer success playbooks', action: 'develop_playbooks' }
      ]
    }
  ],

  // Enhanced alerts with realistic scenarios
  alerts: [
    {
      id: '1',
      type: 'error',
      title: 'System Performance Degradation',
      message: 'Database response times have increased by 300% in the last hour. Immediate attention required.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      isRead: false,
      priority: 'critical',
      actions: [
        { label: 'Scale database', action: 'scale_db', variant: 'primary' },
        { label: 'Check query performance', action: 'check_queries', variant: 'secondary' },
        { label: 'Contact DevOps team', action: 'contact_devops', variant: 'danger' }
      ]
    },
    {
      id: '2',
      type: 'warning',
      title: 'Budget Threshold Exceeded',
      message: 'Marketing department has exceeded 90% of quarterly budget with 6 weeks remaining.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      priority: 'high',
      actions: [
        { label: 'Review spending', action: 'review_spending', variant: 'primary' },
        { label: 'Reallocate budget', action: 'reallocate_budget', variant: 'secondary' },
        { label: 'Approve additional funds', action: 'approve_funds', variant: 'primary' }
      ]
    },
    {
      id: '3',
      type: 'info',
      title: 'Scheduled Maintenance Reminder',
      message: 'System maintenance is scheduled for this weekend (Saturday 2 AM - 6 AM EST).',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'low',
      actions: [
        { label: 'Notify customers', action: 'notify_customers', variant: 'primary' },
        { label: 'Prepare maintenance checklist', action: 'prepare_checklist', variant: 'secondary' },
        { label: 'Backup systems', action: 'backup_systems', variant: 'primary' }
      ]
    }
  ],

  // Enhanced notifications with comprehensive data
  notifications: [
    {
      id: '1',
      type: 'goal',
      title: 'Monthly Sales Target Exceeded!',
      message: 'Congratulations! The sales team has exceeded the monthly target by 27.6%. Outstanding performance!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false,
      priority: 'medium',
      actions: [
        { label: 'View detailed report', action: 'view_report' },
        { label: 'Send team congratulations', action: 'send_congrats' },
        { label: 'Plan celebration', action: 'plan_celebration' }
      ]
    },
    {
      id: '2',
      type: 'system',
      title: 'New Feature Released',
      message: 'The enhanced analytics dashboard is now live with AI-powered insights and real-time monitoring.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      priority: 'medium',
      actions: [
        { label: 'View release notes', action: 'view_notes' },
        { label: 'Schedule team training', action: 'schedule_training' },
        { label: 'Update documentation', action: 'update_docs' }
      ]
    },
    {
      id: '3',
      type: 'alert',
      title: 'Quarterly Review Meeting',
      message: 'Quarterly business review meeting is scheduled for tomorrow at 2 PM. Please prepare your reports.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'high',
      actions: [
        { label: 'Prepare presentation', action: 'prepare_presentation' },
        { label: 'Review KPIs', action: 'review_kpis' },
        { label: 'Send agenda', action: 'send_agenda' }
      ]
    },
    {
      id: '4',
      type: 'system',
      title: 'Data Backup Completed',
      message: 'Daily data backup completed successfully. All systems are secure and up to date.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'low',
      actions: [
        { label: 'Verify backup integrity', action: 'verify_backup' },
        { label: 'Update backup logs', action: 'update_logs' }
      ]
    }
  ],

  // Enhanced goals with comprehensive tracking
  goals: [
    {
      id: '1',
      title: 'Annual Revenue Target',
      description: 'Achieve $10M in annual recurring revenue by end of 2024',
      metric: 'revenue',
      target: 10000000,
      current: 2450000,
      unit: 'USD',
      deadline: '2024-12-31',
      category: 'Revenue',
      priority: 'high',
      status: 'on-track',
      milestones: [
        { title: 'Q1 Target ($2.5M)', target: 2500000, deadline: '2024-03-31', completed: true },
        { title: 'Q2 Target ($5M)', target: 5000000, deadline: '2024-06-30', completed: false },
        { title: 'Q3 Target ($7.5M)', target: 7500000, deadline: '2024-09-30', completed: false },
        { title: 'Q4 Target ($10M)', target: 10000000, deadline: '2024-12-31', completed: false }
      ],
      assignedTo: ['sales-team'],
      relatedWidgets: ['sales-overview', 'revenue-analytics']
    },
    {
      id: '2',
      title: 'Customer Satisfaction Excellence',
      description: 'Maintain customer satisfaction score above 4.5/5.0 throughout 2024',
      metric: 'satisfaction',
      target: 4.5,
      current: 4.6,
      unit: 'score',
      deadline: '2024-12-31',
      category: 'Customer Success',
      priority: 'high',
      status: 'completed',
      milestones: [
        { title: 'Q1 Review (>4.5)', target: 4.5, deadline: '2024-03-31', completed: true },
        { title: 'Q2 Review (>4.5)', target: 4.5, deadline: '2024-06-30', completed: false },
        { title: 'Q3 Review (>4.5)', target: 4.5, deadline: '2024-09-30', completed: false },
        { title: 'Q4 Review (>4.5)', target: 4.5, deadline: '2024-12-31', completed: false }
      ],
      assignedTo: ['support-team'],
      relatedWidgets: ['customer-insights']
    },
    {
      id: '3',
      title: 'Product Innovation Pipeline',
      description: 'Launch 3 major product features and 2 new product lines in 2024',
      metric: 'features',
      target: 5,
      current: 1,
      unit: 'count',
      deadline: '2024-12-31',
      category: 'Product Development',
      priority: 'high',
      status: 'behind',
      milestones: [
        { title: 'AI Analytics Module', target: 1, deadline: '2024-02-15', completed: true },
        { title: 'Mobile App v2.0', target: 2, deadline: '2024-05-30', completed: false },
        { title: 'API Gateway', target: 3, deadline: '2024-08-15', completed: false },
        { title: 'Enterprise Suite', target: 4, deadline: '2024-10-30', completed: false },
        { title: 'IoT Integration', target: 5, deadline: '2024-12-15', completed: false }
      ],
      assignedTo: ['development-team'],
      relatedWidgets: ['project-tracker']
    }
  ],

  // Core dashboard state properties
  layouts: [
    {
      id: 'default',
      name: 'Default Layout',
      description: 'Standard dashboard layout with all widgets',
      isDefault: true,
      widgets: [], // Will be populated with widgets above
      gridConfig: {
        columns: 12,
        gap: 16,
        responsive: true
      },
      permissions: ['view', 'edit'],
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  currentLayout: 'default',
  isLoading: false,
  error: null,
  isCustomizing: false,

  // Theme and appearance
  themes: defaultThemes,
  currentTheme: 'light',

  // Filters and search
  globalFilters: [],
  searchQuery: '',

  // Real-time features
  isRealTimeEnabled: true,
  lastUpdate: new Date().toISOString(),

  // Collaboration
  comments: [],
  activeUsers: [
    { id: 'user1', name: 'John Doe', avatar: '/avatars/john.jpg', lastSeen: new Date().toISOString() },
    { id: 'user2', name: 'Jane Smith', avatar: '/avatars/jane.jpg', lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    { id: 'user3', name: 'Mike Johnson', lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString() }
  ],

  // Settings
  settings: defaultSettings,

  // Expanded widget state
  expandedWidget: null,

  // Export state
  exports: [],

  // Datasets
  datasets: [],

  // Actions - these will be implemented by Zustand
  loadDashboard: async () => {},
  addWidget: (widget: DashboardWidget) => {},
  removeWidget: (id: string) => {},
  updateWidget: (id: string, updates: Partial<DashboardWidget>) => {},
  expandWidget: (id: string) => {},
  collapseWidget: () => {},
  updateWidgetPosition: (id: string, position: number) => {},
  reorderWidgets: (widgetIds: string[]) => {},

  // Layout management
  createLayout: (layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>) => {},
  switchLayout: (layoutId: string) => {},
  updateLayout: (id: string, updates: Partial<DashboardLayout>) => {},
  deleteLayout: (id: string) => {},

  // Theme management
  switchTheme: (themeId: string) => {},
  createCustomTheme: (theme: Omit<DashboardTheme, 'id'>) => {},

  // Filter and search
  addGlobalFilter: (filter: DashboardFilter) => {},
  removeGlobalFilter: (filterId: string) => {},
  updateGlobalFilter: (filterId: string, updates: Partial<DashboardFilter>) => {},
  setSearchQuery: (query: string) => {},

  // Real-time features
  addAlert: (alert: Omit<DashboardAlert, 'id' | 'timestamp'>) => {},
  dismissAlert: (alertId: string) => {},
  addInsight: (insight: Omit<DashboardInsight, 'id' | 'timestamp'>) => {},
  dismissInsight: (insightId: string) => {},
  toggleRealTime: () => {},

  // Notifications
  addNotification: (notification: Omit<DashboardNotification, 'id' | 'timestamp'>) => {},
  markNotificationRead: (notificationId: string) => {},
  clearAllNotifications: () => {},

  // Comments
  addComment: (comment: Omit<DashboardComment, 'id' | 'timestamp'>) => {},
  updateComment: (commentId: string, updates: Partial<DashboardComment>) => {},
  deleteComment: (commentId: string) => {},

  // Goals
  addGoal: (goal: Omit<DashboardGoal, 'id'>) => {},
  updateGoal: (goalId: string, updates: Partial<DashboardGoal>) => {},
  deleteGoal: (goalId: string) => {},

  // Settings
  updateSettings: (updates: Partial<DashboardSettings>) => {},

  // Export
  exportDashboard: async (config: Omit<DashboardExport, 'id' | 'status' | 'createdAt' | 'expiresAt'>) => '',

  // Customization
  startCustomizing: () => {},
  stopCustomizing: () => {},
  resetToDefault: () => {},

  // Datasets
  addDataset: (dataset: DashboardDataset) => {},
  removeDataset: (id: string) => {}
});

// Helper function to generate realistic heatmap data
function generateHeatmapData() {
  const activities = [];
  const today = new Date();
  
  // Generate data for the last 90 days
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Create realistic activity patterns (higher on weekdays, lower on weekends)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseActivity = isWeekend ? 15 : 45;
    const randomVariation = Math.random() * 30;
    const activity = Math.floor(baseActivity + randomVariation);
    
    activities.push({
      date: date.toISOString().split('T')[0],
      value: activity,
      level: activity < 20 ? 1 : activity < 40 ? 2 : activity < 60 ? 3 : 4
    });
  }
  
  return activities;
}