import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  X,
  Clock,
  Bell,
  BellOff,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { DashboardAlert } from '../../../types';

interface RealTimeAlertsData {
  alerts: DashboardAlert[];
}

interface RealTimeAlertsWidgetProps {
  data: RealTimeAlertsData;
}

export const RealTimeAlertsWidget: React.FC<RealTimeAlertsWidgetProps> = ({ data }) => {
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (data?.alerts) {
      setAlerts(data.alerts);
    }
  }, [data]);

  // Auto-dismiss alerts with duration
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    alerts.forEach((alert) => {
      if (alert.autoHide && alert.duration) {
        const timer = setTimeout(() => {
          dismissAlert(alert.id);
        }, alert.duration);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [alerts]);

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-400">
        <div className="text-center">
          <Bell className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
          <p>No alerts available</p>
        </div>
      </div>
    );
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'info':
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: string, priority: string) => {
    const baseColors = {
      error: 'text-red-600 bg-red-50 border-red-200',
      warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      success: 'text-green-600 bg-green-50 border-green-200',
      info: 'text-blue-600 bg-blue-50 border-blue-200'
    };

    const priorityIntensity = {
      critical: 'ring-2 ring-current ring-opacity-50',
      high: 'border-l-4',
      medium: '',
      low: 'opacity-75'
    };

    return `${baseColors[type as keyof typeof baseColors] || baseColors.info} ${priorityIntensity[priority as keyof typeof priorityIntensity] || ''}`;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-gray-500 text-white'
    };

    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.priority === filter;
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.priority === 'critical').length;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              criticalCount > 0 
                ? 'bg-gradient-to-br from-red-500 to-red-600' 
                : 'bg-gradient-to-br from-blue-500 to-indigo-500'
            }`}
          >
            {isLive ? <Bell className="w-4 h-4 text-white" /> : <BellOff className="w-4 h-4 text-white" />}
          </motion.div>
          <div>
            <span className="text-sm font-medium text-neutral-700">Real-time Alerts</span>
            {unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLive(!isLive)}
            className={`p-1.5 rounded-md transition-colors ${
              isLive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isLive ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
          </motion.button>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-xs bg-neutral-100 border border-neutral-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-hidden">
        {filteredAlerts.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-400">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-sm">No alerts to show</p>
              <p className="text-xs text-neutral-500 mt-1">
                {filter !== 'all' ? `No ${filter} priority alerts` : 'All clear!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto space-y-2">
            <AnimatePresence>
              {filteredAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  whileHover={{ scale: 1.01 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${getAlertColor(alert.type, alert.priority)} ${
                    !alert.isRead ? 'shadow-sm' : 'opacity-75'
                  }`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                      <div className="mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-neutral-800 truncate">
                            {alert.title}
                          </h4>
                          <span className={`px-1.5 py-0.5 text-xs rounded-full ${getPriorityBadge(alert.priority)}`}>
                            {alert.priority}
                          </span>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
                          {alert.message}
                        </p>
                        
                        {/* Actions */}
                        {alert.actions && alert.actions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {alert.actions.map((action, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`text-xs px-2 py-1 rounded-md transition-all ${
                                  action.variant === 'primary' 
                                    ? 'bg-current bg-opacity-20 hover:bg-opacity-30' 
                                    : action.variant === 'danger'
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (action.action === 'dismiss_alert') {
                                    dismissAlert(alert.id);
                                  }
                                }}
                              >
                                {action.label}
                              </motion.button>
                            ))}
                          </div>
                        )}
                        
                        {/* Timestamp */}
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(alert.timestamp)}</span>
                          </div>
                          {alert.relatedWidget && (
                            <span className="text-xs bg-white bg-opacity-50 px-1.5 py-0.5 rounded">
                              Widget #{alert.relatedWidget}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissAlert(alert.id);
                      }}
                      className="p-1 rounded-full hover:bg-white hover:bg-opacity-50 ml-2"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {alerts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>{alerts.length} total alerts</span>
            <div className="flex items-center space-x-2">
              {criticalCount > 0 && (
                <span className="text-red-600 font-medium">
                  {criticalCount} critical
                </span>
              )}
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span>{isLive ? 'Live' : 'Paused'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 