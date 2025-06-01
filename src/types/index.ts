// User related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  CEO = 'ceo',
}

// Customer related types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: CustomerStatus;
  industry?: string;
  address?: Address;
  contacts?: Contact[];
  notes?: Note[];
  createdAt: Date;
  updatedAt: Date;
}

export enum CustomerStatus {
  LEAD = 'lead',
  PROSPECT = 'prospect',
  CUSTOMER = 'customer',
  INACTIVE = 'inactive',
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  isPrimary: boolean;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
}

export interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}

// Sales related types
export interface Deal {
  id: string;
  name: string;
  customerId: string;
  amount: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  products?: Product[];
  assignedTo?: string;
  notes?: Note[];
  createdAt: Date;
  updatedAt: Date;
}

export enum DealStage {
  QUALIFICATION = 'qualification',
  NEEDS_ANALYSIS = 'needs_analysis',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

// Product related types
export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  category: string;
  inStock: number;
  lowStockThreshold?: number;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Project related types
export interface Project {
  id: string;
  name: string;
  description?: string;
  customerId?: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  budget?: number;
  tasks?: Task[];
  team?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignedTo?: string;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Dashboard related types
export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  width: 'small' | 'medium' | 'large' | 'full';
  height: 'small' | 'medium' | 'large' | 'xl';
  position: number;
  data?: any;
  isExpanded?: boolean;
  refreshInterval?: number;
  lastUpdated?: string;
  permissions?: string[];
  customConfig?: Record<string, any>;
}

export enum WidgetType {
  SALES_OVERVIEW = 'SALES_OVERVIEW',
  RECENT_DEALS = 'RECENT_DEALS',
  TASKS_SUMMARY = 'TASKS_SUMMARY',
  CUSTOMER_GROWTH = 'CUSTOMER_GROWTH',
  TOP_PRODUCTS = 'TOP_PRODUCTS',
  ACTIVITY_FEED = 'ACTIVITY_FEED',
  REVENUE_FORECAST = 'REVENUE_FORECAST',
  SALES_BY_REGION = 'SALES_BY_REGION',
  CONVERSION_FUNNEL = 'CONVERSION_FUNNEL',
  MARKETING_ROI = 'MARKETING_ROI',
  PROPERTY_PERFORMANCE = 'PROPERTY_PERFORMANCE',
  AI_INSIGHTS = 'AI_INSIGHTS',
  GOAL_TRACKER = 'GOAL_TRACKER',
  HEATMAP_CALENDAR = 'HEATMAP_CALENDAR',
  TEAM_PERFORMANCE = 'TEAM_PERFORMANCE',
  REAL_TIME_ALERTS = 'REAL_TIME_ALERTS',
  PIE_CHART = 'PIE_CHART',
  LINE_CHART = 'LINE_CHART',
  BAR_CHART = 'BAR_CHART',
  AREA_CHART = 'AREA_CHART',
  DONUT_CHART = 'DONUT_CHART',
  FUNNEL_CHART = 'FUNNEL_CHART',
  GAUGE_CHART = 'GAUGE_CHART',
  SCATTER_PLOT = 'SCATTER_PLOT',
  RADAR_CHART = 'RADAR_CHART',
  TREEMAP_CHART = 'TREEMAP_CHART',
  WATERFALL_CHART = 'WATERFALL_CHART',
  SANKEY_DIAGRAM = 'SANKEY_DIAGRAM',
  COHORT_ANALYSIS = 'COHORT_ANALYSIS',
  RETENTION_CURVE = 'RETENTION_CURVE',
  CHURN_ANALYSIS = 'CHURN_ANALYSIS',
  REVENUE_BREAKDOWN = 'REVENUE_BREAKDOWN',
  CUSTOMER_SEGMENTS = 'CUSTOMER_SEGMENTS',
  PRODUCT_ANALYTICS = 'PRODUCT_ANALYTICS',
  KPI_CARD = 'KPI_CARD',
  METRIC_COMPARISON = 'METRIC_COMPARISON',
  TREND_INDICATOR = 'TREND_INDICATOR',
  PROGRESS_RING = 'PROGRESS_RING',
  SPEEDOMETER = 'SPEEDOMETER',
  DATA_TABLE = 'DATA_TABLE',
  PIVOT_TABLE = 'PIVOT_TABLE',
  LEADERBOARD = 'LEADERBOARD',
  TIME_SERIES = 'TIME_SERIES',
  CANDLESTICK_CHART = 'CANDLESTICK_CHART',
  STOCK_CHART = 'STOCK_CHART',
  MAP_WIDGET = 'MAP_WIDGET',
  CHOROPLETH_MAP = 'CHOROPLETH_MAP',
  SOCIAL_FEED = 'SOCIAL_FEED',
  ENGAGEMENT_METRICS = 'ENGAGEMENT_METRICS',
  USER_ACTIVITY = 'USER_ACTIVITY',
  FINANCIAL_SUMMARY = 'FINANCIAL_SUMMARY',
  CASH_FLOW = 'CASH_FLOW',
  PROFIT_LOSS = 'PROFIT_LOSS',
  BUDGET_TRACKER = 'BUDGET_TRACKER',
  INVENTORY_STATUS = 'INVENTORY_STATUS',
  SUPPLY_CHAIN = 'SUPPLY_CHAIN',
  QUALITY_METRICS = 'QUALITY_METRICS',
  PRODUCTION_KPI = 'PRODUCTION_KPI',
  EMPLOYEE_METRICS = 'EMPLOYEE_METRICS',
  ATTENDANCE_TRACKER = 'ATTENDANCE_TRACKER',
  PERFORMANCE_REVIEW = 'PERFORMANCE_REVIEW',
  RECRUITMENT_FUNNEL = 'RECRUITMENT_FUNNEL',
  CAMPAIGN_PERFORMANCE = 'CAMPAIGN_PERFORMANCE',
  LEAD_GENERATION = 'LEAD_GENERATION',
  EMAIL_METRICS = 'EMAIL_METRICS',
  SEO_ANALYTICS = 'SEO_ANALYTICS',
  SOCIAL_MEDIA_METRICS = 'SOCIAL_MEDIA_METRICS',
  SUPPORT_TICKETS = 'SUPPORT_TICKETS',
  CUSTOMER_SATISFACTION = 'CUSTOMER_SATISFACTION',
  RESPONSE_TIMES = 'RESPONSE_TIMES',
  RESOLUTION_RATES = 'RESOLUTION_RATES',
  SYSTEM_HEALTH = 'SYSTEM_HEALTH',
  API_METRICS = 'API_METRICS',
  ERROR_TRACKING = 'ERROR_TRACKING',
  PERFORMANCE_MONITORING = 'PERFORMANCE_MONITORING',
  SECURITY_DASHBOARD = 'SECURITY_DASHBOARD',
  CUSTOM_WIDGET = 'CUSTOM_WIDGET',
  IFRAME_EMBED = 'IFRAME_EMBED',
  TEXT_WIDGET = 'TEXT_WIDGET',
  IMAGE_WIDGET = 'IMAGE_WIDGET',
  VIDEO_WIDGET = 'VIDEO_WIDGET'
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  widgets: DashboardWidget[];
  gridConfig: {
    columns: number;
    gap: number;
    responsive: boolean;
  };
  permissions?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardTheme {
  id: string;
  name: string;
  mode: 'light' | 'dark' | 'auto';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface DashboardFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in';
  value: any;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
}

export interface DashboardAlert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  isRead: boolean;
  actions?: Array<{
    label: string;
    action: string;
    variant: 'primary' | 'secondary' | 'danger';
  }>;
  relatedWidget?: string;
  autoHide?: boolean;
  duration?: number;
}

export interface DashboardInsight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'forecast';
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  category: string;
  data: any;
  timestamp: string;
  isActionable: boolean;
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

export interface DashboardComment {
  id: string;
  widgetId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  isResolved?: boolean;
  replies?: DashboardComment[];
  mentions?: string[];
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

export interface DashboardSubscription {
  id: string;
  userId: string;
  dashboardId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  format: 'email' | 'slack' | 'teams';
  recipients: string[];
  filters?: DashboardFilter[];
  isActive: boolean;
  nextDelivery: string;
}

export interface DashboardPermission {
  userId: string;
  role: 'viewer' | 'editor' | 'admin' | 'owner';
  permissions: Array<'view' | 'edit' | 'delete' | 'share' | 'export' | 'comment'>;
  restrictions?: {
    widgets?: string[];
    timeRange?: {
      start: string;
      end: string;
    };
    dataFilters?: DashboardFilter[];
  };
}

export interface DashboardAuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface DashboardSearch {
  query: string;
  filters: DashboardFilter[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  limit: number;
  offset: number;
}

export interface DashboardExport {
  id: string;
  format: 'pdf' | 'excel' | 'csv' | 'png' | 'svg';
  widgets: string[];
  filters: DashboardFilter[];
  dateRange: {
    start: string;
    end: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  createdAt: string;
  expiresAt: string;
}

export interface DashboardGoal {
  id: string;
  title: string;
  description?: string;
  metric: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  milestones?: Array<{
    title: string;
    target: number;
    deadline: string;
    completed: boolean;
  }>;
  assignedTo?: string[];
  relatedWidgets?: string[];
}

export interface DashboardNotification {
  id: string;
  type: 'alert' | 'insight' | 'comment' | 'share' | 'goal' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actions?: Array<{
    label: string;
    action: string;
  }>;
  relatedEntity?: {
    type: string;
    id: string;
  };
}

export interface DashboardSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  theme: string;
  layout: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    frequency: 'immediate' | 'hourly' | 'daily';
  };
  privacy: {
    shareAnalytics: boolean;
    allowTracking: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

// Real Estate Property related types
export interface Property {
  id: string;
  title: string;
  description?: string;
  type: PropertyType;
  status: PropertyStatus;
  address: Address;
  price: number;
  area: number; // in square feet/meters
  bedrooms?: number;
  bathrooms?: number;
  images?: string[];
  ownerId?: string;
  agentId?: string;
  listedDate: Date;
  soldDate?: Date;
  leaseId?: string;
  documents?: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export enum PropertyType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  LAND = 'land',
  INDUSTRIAL = 'industrial',
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  UNDER_OFFER = 'under_offer',
  SOLD = 'sold',
  LEASED = 'leased',
  OFF_MARKET = 'off_market',
}

// Lease related types
export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: Date;
  endDate?: Date;
  rentAmount: number;
  depositAmount?: number;
  status: LeaseStatus;
  documents?: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export enum LeaseStatus {
  ACTIVE = 'active',
  TERMINATED = 'terminated',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

// Financial Management
export interface FinancialTransaction {
  id: string;
  propertyId?: string;
  leaseId?: string;
  type: TransactionType;
  amount: number;
  date: Date;
  description?: string;
  createdBy: string;
  createdAt: Date;
}

export enum TransactionType {
  SALE = 'sale',
  RENT = 'rent',
  DEPOSIT = 'deposit',
  MAINTENANCE = 'maintenance',
  COMMISSION = 'commission',
  OTHER = 'other',
}

// Marketing & Campaigns
export interface MarketingCampaign {
  id: string;
  name: string;
  type: CampaignType;
  startDate: Date;
  endDate?: Date;
  properties: string[]; // property IDs
  budget: number;
  status: CampaignStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum CampaignType {
  EMAIL = 'email',
  SMS = 'sms',
  SOCIAL_MEDIA = 'social_media',
  OTHER = 'other',
}

export enum CampaignStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Document Management
export interface Document {
  id: string;
  name: string;
  url: string;
  type: DocumentType;
  uploadedBy: string;
  uploadedAt: Date;
}

export enum DocumentType {
  CONTRACT = 'contract',
  DEED = 'deed',
  FLOOR_PLAN = 'floor_plan',
  IMAGE = 'image',
  OTHER = 'other',
}