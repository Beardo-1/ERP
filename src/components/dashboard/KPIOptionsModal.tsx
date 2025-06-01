import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp,
  Filter,
  Palette,
  Database,
  Calendar,
  Target,
  Eye,
  Layers,
  Sliders,
  RefreshCw,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { DashboardWidget } from '../../types';
import { useDashboardStore } from '../../store/dashboardStore';
import { UploadDataModal } from './UploadDataModal';

interface KPIOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  widget: DashboardWidget;
  onSave: (config: any) => void;
}

interface KPIConfig {
  dataSource: string;
  visualizationType: string;
  timeRange: string;
  filters: Array<{ field: string; operator: string; value: string }>;
  formatting: {
    colorScheme: string;
    showLabels: boolean;
    showLegend: boolean;
    showGrid: boolean;
  };
  refreshInterval: number;
  alerts: Array<{ condition: string; threshold: number; action: string }>;
}

const visualizationTypes = [
  { id: 'bar', name: 'Bar Chart', icon: <BarChart3 className="w-4 h-4" />, description: 'Compare values across categories' },
  { id: 'line', name: 'Line Chart', icon: <LineChart className="w-4 h-4" />, description: 'Show trends over time' },
  { id: 'pie', name: 'Pie Chart', icon: <PieChart className="w-4 h-4" />, description: 'Show proportions of a whole' },
  { id: 'gauge', name: 'Gauge', icon: <Target className="w-4 h-4" />, description: 'Display single KPI value' },
  { id: 'card', name: 'Card', icon: <Layers className="w-4 h-4" />, description: 'Simple metric display' },
  { id: 'table', name: 'Table', icon: <Database className="w-4 h-4" />, description: 'Detailed data view' }
];

const dataSources = [
  { id: 'sales', name: 'Sales Database', description: 'Revenue, deals, customers' },
  { id: 'marketing', name: 'Marketing Analytics', description: 'Campaigns, leads, ROI' },
  { id: 'operations', name: 'Operations Data', description: 'Performance, efficiency' },
  { id: 'finance', name: 'Financial Data', description: 'Budget, expenses, profit' },
  { id: 'hr', name: 'HR Metrics', description: 'Employee data, performance' },
  { id: 'custom', name: 'Custom API', description: 'External data source' }
];

const timeRanges = [
  { id: 'today', name: 'Today' },
  { id: 'week', name: 'This Week' },
  { id: 'month', name: 'This Month' },
  { id: 'quarter', name: 'This Quarter' },
  { id: 'year', name: 'This Year' },
  { id: 'custom', name: 'Custom Range' }
];

const colorSchemes = [
  { id: 'blue', name: 'Blue', colors: ['#3b82f6', '#1d4ed8', '#1e40af'] },
  { id: 'green', name: 'Green', colors: ['#10b981', '#059669', '#047857'] },
  { id: 'purple', name: 'Purple', colors: ['#8b5cf6', '#7c3aed', '#6d28d9'] },
  { id: 'orange', name: 'Orange', colors: ['#f59e0b', '#d97706', '#b45309'] },
  { id: 'red', name: 'Red', colors: ['#ef4444', '#dc2626', '#b91c1c'] },
  { id: 'gradient', name: 'Gradient', colors: ['#3b82f6', '#8b5cf6', '#ec4899'] }
];

export const KPIOptionsModal: React.FC<KPIOptionsModalProps> = ({
  isOpen,
  onClose,
  widget,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'data' | 'visual' | 'format' | 'alerts'>('data');
  const [config, setConfig] = useState<KPIConfig>({
    dataSource: 'sales',
    visualizationType: 'bar',
    timeRange: 'month',
    filters: [],
    formatting: {
      colorScheme: 'blue',
      showLabels: true,
      showLegend: true,
      showGrid: true
    },
    refreshInterval: 300,
    alerts: []
  });

  const [newFilter, setNewFilter] = useState({ field: '', operator: 'equals', value: '' });
  const [newAlert, setNewAlert] = useState({ condition: 'greater_than', threshold: 0, action: 'notify' });

  const { datasets, addDataset } = useDashboardStore();
  const [showUploadDataModal, setShowUploadDataModal] = useState(false);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const addFilter = () => {
    if (newFilter.field && newFilter.value) {
      setConfig(prev => ({
        ...prev,
        filters: [...prev.filters, { ...newFilter }]
      }));
      setNewFilter({ field: '', operator: 'equals', value: '' });
    }
  };

  const removeFilter = (index: number) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }));
  };

  const addAlert = () => {
    if (newAlert.threshold > 0) {
      setConfig(prev => ({
        ...prev,
        alerts: [...prev.alerts, { ...newAlert }]
      }));
      setNewAlert({ condition: 'greater_than', threshold: 0, action: 'notify' });
    }
  };

  const removeAlert = (index: number) => {
    setConfig(prev => ({
      ...prev,
      alerts: prev.alerts.filter((_, i) => i !== index)
    }));
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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col"
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
                <Settings className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">KPI Options</h2>
                <p className="text-sm text-neutral-600">Configure {widget.title}</p>
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

          {/* Tabs */}
          <div className="flex border-b border-neutral-200/60 px-6">
            {[
              { id: 'data', name: 'Data Source', icon: <Database className="w-4 h-4" /> },
              { id: 'visual', name: 'Visualization', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'format', name: 'Formatting', icon: <Palette className="w-4 h-4" /> },
              { id: 'alerts', name: 'Alerts', icon: <AlertTriangle className="w-4 h-4" /> }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-800'
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                {tab.icon}
                <span className="font-medium">{tab.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'data' && (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Data Source */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">Data Source</h3>
                    <div className="flex items-center space-x-2">
                      <select
                        value={config.dataSource}
                        onChange={(e) => setConfig(prev => ({ ...prev, dataSource: e.target.value }))}
                        className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {dataSources.map((source) => (
                          <option key={source.id} value={source.id}>
                            {source.name}
                          </option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setShowUploadDataModal(true)} className="p-2 rounded bg-blue-500 text-white">Add Data</button>
                    </div>
                  </div>

                  {/* Time Range */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">Time Range</h3>
                    <div className="flex flex-wrap gap-2">
                      {timeRanges.map((range) => (
                        <motion.button
                          key={range.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setConfig(prev => ({ ...prev, timeRange: range.id }))}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            config.timeRange === range.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                        >
                          {range.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Filters */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">Filters</h3>
                    <div className="space-y-3">
                      {config.filters.map((filter, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg"
                        >
                          <span className="text-sm font-medium">{filter.field}</span>
                          <span className="text-sm text-neutral-600">{filter.operator}</span>
                          <span className="text-sm">{filter.value}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFilter(index)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      ))}
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          placeholder="Field name"
                          value={newFilter.field}
                          onChange={(e) => setNewFilter(prev => ({ ...prev, field: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          value={newFilter.operator}
                          onChange={(e) => setNewFilter(prev => ({ ...prev, operator: e.target.value }))}
                          className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="equals">Equals</option>
                          <option value="not_equals">Not Equals</option>
                          <option value="greater_than">Greater Than</option>
                          <option value="less_than">Less Than</option>
                          <option value="contains">Contains</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Value"
                          value={newFilter.value}
                          onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addFilter}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Add
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'visual' && (
                <motion.div
                  key="visual"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Visualization Type */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">Visualization Type</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {visualizationTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setConfig(prev => ({ ...prev, visualizationType: type.id }))}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                            config.visualizationType === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            {type.icon}
                            <h4 className="font-medium text-neutral-800">{type.name}</h4>
                          </div>
                          <p className="text-sm text-neutral-600">{type.description}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Refresh Interval */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">Refresh Interval</h3>
                    <div className="flex items-center space-x-4">
                      <RefreshCw className="w-5 h-5 text-neutral-600" />
                      <input
                        type="range"
                        min="60"
                        max="3600"
                        step="60"
                        value={config.refreshInterval}
                        onChange={(e) => setConfig(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium text-neutral-700">
                        {Math.floor(config.refreshInterval / 60)} minutes
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'format' && (
                <motion.div
                  key="format"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Color Scheme */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">Color Scheme</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {colorSchemes.map((scheme) => (
                        <motion.button
                          key={scheme.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setConfig(prev => ({ 
                            ...prev, 
                            formatting: { ...prev.formatting, colorScheme: scheme.id }
                          }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            config.formatting.colorScheme === scheme.id
                              ? 'border-blue-500'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex space-x-1 mb-2">
                            {scheme.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <p className="text-sm font-medium text-neutral-800">{scheme.name}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Display Options */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">Display Options</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'showLabels', label: 'Show Labels' },
                        { key: 'showLegend', label: 'Show Legend' },
                        { key: 'showGrid', label: 'Show Grid' }
                      ].map((option) => (
                        <motion.label
                          key={option.key}
                          className="flex items-center space-x-3 cursor-pointer"
                          whileHover={{ x: 2 }}
                        >
                          <input
                            type="checkbox"
                            checked={config.formatting[option.key as keyof typeof config.formatting] as boolean}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              formatting: {
                                ...prev.formatting,
                                [option.key]: e.target.checked
                              }
                            }))}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-neutral-700">{option.label}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'alerts' && (
                <motion.div
                  key="alerts"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Existing Alerts */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">Active Alerts</h3>
                    <div className="space-y-3">
                      {config.alerts.map((alert, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            <span className="text-sm">
                              When value is {alert.condition.replace('_', ' ')} {alert.threshold}, {alert.action}
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeAlert(index)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Alert */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">Add Alert</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <select
                          value={newAlert.condition}
                          onChange={(e) => setNewAlert(prev => ({ ...prev, condition: e.target.value }))}
                          className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="greater_than">Greater Than</option>
                          <option value="less_than">Less Than</option>
                          <option value="equals">Equals</option>
                          <option value="not_equals">Not Equals</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Threshold"
                          value={newAlert.threshold}
                          onChange={(e) => setNewAlert(prev => ({ ...prev, threshold: parseFloat(e.target.value) }))}
                          className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          value={newAlert.action}
                          onChange={(e) => setNewAlert(prev => ({ ...prev, action: e.target.value }))}
                          className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="notify">Send Notification</option>
                          <option value="email">Send Email</option>
                          <option value="highlight">Highlight Widget</option>
                        </select>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addAlert}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Add Alert
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-neutral-200/60">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-neutral-600">Configuration will be applied to {widget.title}</span>
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Apply Changes
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