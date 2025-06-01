import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Brain, 
  Calendar,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  PieChart,
  Activity,
  MapPin,
  Zap,
  Clock,
  Star,
  Filter,
  Search
} from 'lucide-react';
import { WidgetType } from '../../types';
import { useDashboardStore } from '../../store/dashboardStore';
import { UploadDataModal } from './UploadDataModal';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: WidgetType, config: any) => void;
}

interface WidgetTemplate {
  type: WidgetType;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  color: string;
  sizes: Array<{ width: string; height: string; label: string }>;
  preview: string;
}

const widgetTemplates: WidgetTemplate[] = [
  {
    type: WidgetType.SALES_OVERVIEW,
    name: 'Sales Overview',
    description: 'Track revenue, growth, and sales performance metrics',
    icon: <DollarSign className="w-5 h-5" />,
    category: 'Sales',
    color: 'from-blue-500 to-blue-600',
    sizes: [
      { width: 'medium', height: 'medium', label: 'Standard' },
      { width: 'large', height: 'medium', label: 'Wide' },
      { width: 'medium', height: 'large', label: 'Tall' }
    ],
    preview: 'Revenue charts, growth indicators, target progress'
  },
  {
    type: WidgetType.AI_INSIGHTS,
    name: 'AI Insights',
    description: 'AI-powered insights, trends, and predictions',
    icon: <Brain className="w-5 h-5" />,
    category: 'Analytics',
    color: 'from-purple-500 to-purple-600',
    sizes: [
      { width: 'medium', height: 'large', label: 'Standard' },
      { width: 'large', height: 'large', label: 'Extended' }
    ],
    preview: 'Smart recommendations, trend analysis, forecasts'
  },
  {
    type: WidgetType.GOAL_TRACKER,
    name: 'Goal Tracker',
    description: 'Monitor goals, milestones, and progress',
    icon: <Target className="w-5 h-5" />,
    category: 'Performance',
    color: 'from-green-500 to-green-600',
    sizes: [
      { width: 'medium', height: 'medium', label: 'Compact' },
      { width: 'large', height: 'medium', label: 'Detailed' }
    ],
    preview: 'Goal progress, milestone tracking, completion rates'
  },
  {
    type: WidgetType.HEATMAP_CALENDAR,
    name: 'Activity Heatmap',
    description: 'Visual activity calendar with intensity mapping',
    icon: <Calendar className="w-5 h-5" />,
    category: 'Analytics',
    color: 'from-orange-500 to-orange-600',
    sizes: [
      { width: 'large', height: 'medium', label: 'Calendar View' },
      { width: 'full', height: 'medium', label: 'Full Width' }
    ],
    preview: 'Activity intensity, daily patterns, trends'
  },
  {
    type: WidgetType.TEAM_PERFORMANCE,
    name: 'Team Performance',
    description: 'Team metrics, rankings, and performance indicators',
    icon: <Users className="w-5 h-5" />,
    category: 'Team',
    color: 'from-pink-500 to-pink-600',
    sizes: [
      { width: 'medium', height: 'medium', label: 'Summary' },
      { width: 'large', height: 'large', label: 'Detailed' }
    ],
    preview: 'Team rankings, individual metrics, performance trends'
  },
  {
    type: WidgetType.REAL_TIME_ALERTS,
    name: 'Real-time Alerts',
    description: 'Live notifications and critical alerts',
    icon: <AlertTriangle className="w-5 h-5" />,
    category: 'Monitoring',
    color: 'from-red-500 to-red-600',
    sizes: [
      { width: 'small', height: 'medium', label: 'Compact' },
      { width: 'medium', height: 'medium', label: 'Standard' }
    ],
    preview: 'Critical alerts, notifications, status updates'
  },
  {
    type: WidgetType.RECENT_DEALS,
    name: 'Recent Deals',
    description: 'Latest deals and transaction history',
    icon: <ShoppingCart className="w-5 h-5" />,
    category: 'Sales',
    color: 'from-yellow-500 to-yellow-600',
    sizes: [
      { width: 'medium', height: 'medium', label: 'List View' },
      { width: 'large', height: 'medium', label: 'Detailed View' }
    ],
    preview: 'Deal pipeline, recent transactions, deal values'
  },
  {
    type: WidgetType.SALES_BY_REGION,
    name: 'Sales by Region',
    description: 'Geographic sales distribution and regional performance',
    icon: <MapPin className="w-5 h-5" />,
    category: 'Sales',
    color: 'from-teal-500 to-teal-600',
    sizes: [
      { width: 'large', height: 'medium', label: 'Map View' },
      { width: 'full', height: 'large', label: 'Detailed Map' }
    ],
    preview: 'Regional sales map, geographic insights, territory performance'
  },
  {
    type: WidgetType.PIE_CHART,
    name: 'Pie Chart',
    description: 'Interactive pie chart with segments and trends',
    icon: <PieChart className="w-5 h-5" />,
    category: 'Charts',
    color: 'from-blue-500 to-blue-600',
    sizes: [
      { width: 'medium', height: 'medium', label: 'Standard' },
      { width: 'large', height: 'medium', label: 'Wide' },
      { width: 'medium', height: 'large', label: 'Tall' }
    ],
    preview: 'Animated pie segments, hover effects, trend indicators'
  },
  {
    type: WidgetType.LINE_CHART,
    name: 'Line Chart',
    description: 'Multi-series line chart with time series data',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'Charts',
    color: 'from-green-500 to-green-600',
    sizes: [
      { width: 'large', height: 'medium', label: 'Standard' },
      { width: 'full', height: 'medium', label: 'Wide' },
      { width: 'large', height: 'large', label: 'Detailed' }
    ],
    preview: 'Interactive data points, area fills, multiple datasets'
  },
  {
    type: WidgetType.FUNNEL_CHART,
    name: 'Funnel Chart',
    description: 'Conversion funnel with stage analysis',
    icon: <Filter className="w-5 h-5" />,
    category: 'Charts',
    color: 'from-purple-500 to-purple-600',
    sizes: [
      { width: 'medium', height: 'large', label: 'Standard' },
      { width: 'large', height: 'large', label: 'Extended' }
    ],
    preview: 'Stage conversion rates, drop-off analysis, 3D effects'
  },
  {
    type: WidgetType.BAR_CHART,
    name: 'Bar Chart',
    description: 'Horizontal and vertical bar charts',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'Charts',
    color: 'from-orange-500 to-orange-600',
    sizes: [
      { width: 'medium', height: 'medium', label: 'Standard' },
      { width: 'large', height: 'medium', label: 'Wide' },
      { width: 'medium', height: 'large', label: 'Tall' }
    ],
    preview: 'Animated bars, comparison views, grouped data'
  },
  {
    type: WidgetType.DONUT_CHART,
    name: 'Donut Chart',
    description: 'Donut chart with center metrics',
    icon: <Target className="w-5 h-5" />,
    category: 'Charts',
    color: 'from-pink-500 to-pink-600',
    sizes: [
      { width: 'medium', height: 'medium', label: 'Standard' },
      { width: 'large', height: 'medium', label: 'Wide' }
    ],
    preview: 'Center KPI display, segment interactions, progress rings'
  }
];

const categories = ['All', 'Sales', 'Analytics', 'Performance', 'Team', 'Monitoring', 'Charts'];

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  isOpen,
  onClose,
  onAddWidget
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWidget, setSelectedWidget] = useState<WidgetTemplate | null>(null);
  const [selectedSize, setSelectedSize] = useState<{ width: string; height: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { datasets, addDataset } = useDashboardStore();
  const [showUploadDataModal, setShowUploadDataModal] = useState(false);

  const filteredWidgets = widgetTemplates.filter(widget => {
    const matchesCategory = selectedCategory === 'All' || widget.category === selectedCategory;
    const matchesSearch = widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddWidget = () => {
    if (selectedWidget && selectedSize) {
      onAddWidget(selectedWidget.type, {
        width: selectedSize.width,
        height: selectedSize.height,
        title: selectedWidget.name
      });
      onClose();
      setSelectedWidget(null);
      setSelectedSize(null);
    }
  };

  const handleWidgetSelect = (widget: WidgetTemplate) => {
    setSelectedWidget(widget);
    setSelectedSize(widget.sizes[0]); // Default to first size option
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200/60">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Plus className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">Add Widget</h2>
                <p className="text-sm text-neutral-600">Choose a widget to add to your dashboard</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-red-50 transition-all duration-200"
            >
              <X className="w-6 h-6 text-neutral-600 hover:text-red-600" />
            </motion.button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-neutral-200/60 p-6 flex flex-col">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search widgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4" />
                        <span>{category}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Selected Widget Details */}
              {selectedWidget && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-4"
                >
                  <h3 className="font-semibold text-neutral-800 mb-2">Selected Widget</h3>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${selectedWidget.color} rounded-lg flex items-center justify-center text-white`}>
                      {selectedWidget.icon}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">{selectedWidget.name}</p>
                      <p className="text-xs text-neutral-600">{selectedWidget.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">{selectedWidget.description}</p>
                  
                  {/* Size Options */}
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Size</h4>
                    <div className="space-y-2">
                      {selectedWidget.sizes.map((size, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedSize(size)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                            selectedSize?.width === size.width && selectedSize?.height === size.height
                              ? 'bg-blue-100 text-blue-700 border border-blue-300'
                              : 'bg-white border border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{size.label}</span>
                            <span className="text-xs text-neutral-500">{size.width} × {size.height}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWidgets.map((widget) => (
                  <motion.div
                    key={widget.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -4,
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={() => handleWidgetSelect(widget)}
                    className={`bg-white rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden ${
                      selectedWidget?.type === widget.type
                        ? 'border-blue-500 shadow-lg'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {/* Widget Header */}
                    <div className={`h-20 bg-gradient-to-br ${widget.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="relative p-4 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                          {widget.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{widget.name}</h3>
                          <p className="text-xs text-white/80">{widget.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Widget Content */}
                    <div className="p-4">
                      <p className="text-sm text-neutral-600 mb-3">{widget.description}</p>
                      <div className="text-xs text-neutral-500">
                        <p className="font-medium mb-1">Preview:</p>
                        <p>{widget.preview}</p>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedWidget?.type === widget.type && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="w-3 h-3 bg-white rounded-full"
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-neutral-200/60">
            <div className="text-sm text-neutral-600">
              {selectedWidget ? `Selected: ${selectedWidget.name}` : 'Select a widget to continue'}
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-all duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: selectedWidget ? 1.05 : 1 }}
                whileTap={{ scale: selectedWidget ? 0.95 : 1 }}
                onClick={handleAddWidget}
                disabled={!selectedWidget || !selectedSize}
                className={`px-6 py-2 rounded-xl transition-all duration-200 ${
                  selectedWidget && selectedSize
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                Add Widget
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
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
    </AnimatePresence>
  );
}; 