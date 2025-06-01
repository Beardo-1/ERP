import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import { DashboardWidget as DashboardWidgetType, WidgetType } from '../../types';
import { SalesOverviewWidget } from './widgets/SalesOverviewWidget';
import { RecentDealsWidget } from './widgets/RecentDealsWidget';
import { TasksSummaryWidget } from './widgets/TasksSummaryWidget';
import { CustomerGrowthWidget } from './widgets/CustomerGrowthWidget';
import { ActivityFeedWidget } from './widgets/ActivityFeedWidget';
import { TopProductsWidget } from './widgets/TopProductsWidget';
import { RevenueForecastWidget } from './widgets/RevenueForecastWidget';
import { SalesByRegionWidget } from './widgets/SalesByRegionWidget';
import { ConversionFunnelWidget } from './widgets/ConversionFunnelWidget';
import { MarketingROIWidget } from './widgets/MarketingROIWidget';
import { PropertyPerformanceWidget } from './widgets/PropertyPerformanceWidget';
// New enhanced widgets
import { AIInsightsWidget } from './widgets/AIInsightsWidget';
import { GoalTrackerWidget } from './widgets/GoalTrackerWidget';
import { HeatmapCalendarWidget } from './widgets/HeatmapCalendarWidget';
import { TeamPerformanceWidget } from './widgets/TeamPerformanceWidget';
import { RealTimeAlertsWidget } from './widgets/RealTimeAlertsWidget';
// New Chart Widgets
import { PieChartWidget } from './widgets/PieChartWidget';
import { LineChartWidget } from './widgets/LineChartWidget';
import { FunnelChartWidget } from './widgets/FunnelChartWidget';

interface DashboardWidgetProps {
  widget: DashboardWidgetType;
  isExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
  onRemove?: () => void;
  onEdit?: () => void;
}

// Accent color utility for widget types (Monday.com style)
const getAccentColor = (type: string) => {
  switch (type) {
    case 'SALES_OVERVIEW': return 'from-blue-400 to-blue-600';
    case 'AI_INSIGHTS': return 'from-purple-400 to-purple-600';
    case 'GOAL_TRACKER': return 'from-green-400 to-green-600';
    case 'HEATMAP_CALENDAR': return 'from-orange-400 to-orange-600';
    case 'TEAM_PERFORMANCE': return 'from-pink-400 to-pink-600';
    case 'REAL_TIME_ALERTS': return 'from-red-400 to-red-600';
    case 'RECENT_DEALS': return 'from-yellow-400 to-yellow-600';
    case 'SALES_BY_REGION': return 'from-teal-400 to-teal-600';
    case 'MARKETING_ROI': return 'from-indigo-400 to-indigo-600';
    default: return 'from-neutral-200 to-neutral-400';
  }
};

const getWidgetComponent = (type: WidgetType, data: any) => {
  switch (type) {
    case WidgetType.SALES_OVERVIEW:
      return <SalesOverviewWidget data={data} />;
    case WidgetType.RECENT_DEALS:
      return <RecentDealsWidget data={data} />;
    case WidgetType.TASKS_SUMMARY:
      return <TasksSummaryWidget data={data} />;
    case WidgetType.CUSTOMER_GROWTH:
      return <CustomerGrowthWidget data={data} />;
    case WidgetType.ACTIVITY_FEED:
      return <ActivityFeedWidget data={data} />;
    case WidgetType.TOP_PRODUCTS:
      return <TopProductsWidget data={data} />;
    case WidgetType.REVENUE_FORECAST:
      return <RevenueForecastWidget data={data} />;
    case WidgetType.SALES_BY_REGION:
      return <SalesByRegionWidget data={data} />;
    case WidgetType.CONVERSION_FUNNEL:
      return <ConversionFunnelWidget data={data} />;
    case WidgetType.MARKETING_ROI:
      return <MarketingROIWidget data={data} />;
    case WidgetType.PROPERTY_PERFORMANCE:
      return <PropertyPerformanceWidget data={data} />;
    // New enhanced widgets
    case WidgetType.AI_INSIGHTS:
      return <AIInsightsWidget data={data} />;
    case WidgetType.GOAL_TRACKER:
      return <GoalTrackerWidget data={data} />;
    case WidgetType.HEATMAP_CALENDAR:
      return <HeatmapCalendarWidget data={data} />;
    case WidgetType.TEAM_PERFORMANCE:
      return <TeamPerformanceWidget data={data} />;
    case WidgetType.REAL_TIME_ALERTS:
      return <RealTimeAlertsWidget data={data} />;
    // New Chart Widgets
    case WidgetType.PIE_CHART:
      return <PieChartWidget data={data} />;
    case WidgetType.LINE_CHART:
      return <LineChartWidget data={data} />;
    case WidgetType.FUNNEL_CHART:
      return <FunnelChartWidget data={data} />;
    default:
      return (
        <div className="h-full flex items-center justify-center text-neutral-400">
          <p>Widget type not implemented: {type}</p>
        </div>
      );
  }
};

const getWidgetSize = (width: string, height: string) => {
  const widthClasses = {
    small: 'col-span-3',
    medium: 'col-span-6',
    large: 'col-span-9',
    full: 'col-span-12'
  };

  const heightClasses = {
    small: 'row-span-2',
    medium: 'row-span-3',
    large: 'row-span-4',
    xl: 'row-span-5'
  };

  return `${widthClasses[width as keyof typeof widthClasses] || widthClasses.medium} ${heightClasses[height as keyof typeof heightClasses] || heightClasses.medium}`;
};

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  widget,
  isExpanded = false,
  onExpand,
  onCollapse,
  onRemove,
  onEdit
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [widgetSize, setWidgetSize] = useState({ width: widget.width, height: widget.height });

  const handleResizeStart = (handle: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeHandle(null);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Resize logic would be implemented here
      // For now, we'll just show the visual feedback
    };

    const handleMouseUp = () => {
      handleResizeEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleExpand = () => {
    if (isExpanded) {
      onCollapse?.();
    } else {
      onExpand?.();
    }
  };

  if (isExpanded) {
  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
        onClick={onCollapse}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col border border-neutral-200/60"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Expanded Header */}
          <div className="flex items-center justify-between p-8 border-b border-neutral-200/60">
            <div className="flex items-center space-x-3">
              <motion.div 
                className={`w-2 h-10 rounded-full bg-gradient-to-b ${getAccentColor(widget.type)} mr-4 shadow-lg`}
                initial={{ height: 0 }}
                animate={{ height: 40 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
              />
              <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">{widget.title}</h2>
              {widget.lastUpdated && (
                <span className="text-sm text-neutral-500 font-medium">
                  Updated {new Date(widget.lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(107, 114, 128, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onEdit}
                className="p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-lg"
              >
                <MoreHorizontal className="w-5 h-5 text-neutral-600 hover:text-gray-700" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExpand}
                className="p-3 rounded-xl hover:bg-red-50 transition-all duration-200 hover:shadow-lg"
              >
                <Minimize2 className="w-5 h-5 text-neutral-600 hover:text-red-600" />
              </motion.button>
            </div>
          </div>
          
          {/* Expanded Content */}
          <motion.div 
            className="flex-1 p-8 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {getWidgetComponent(widget.type, widget.data)}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ 
        opacity: 0, 
        scale: 0.9, 
        y: 40,
        rotateX: 15,
        rotateY: 5,
      }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        rotateX: 0,
        rotateY: 0,
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.85, 
        y: -40,
        rotateX: -15,
        rotateY: -5,
      }}
      whileHover={{ 
        scale: 1.03, 
        y: -12,
        rotateX: -2,
        rotateY: 2,
        boxShadow: '0 25px 50px 0 rgba(0,0,0,0.15), 0 15px 35px 0 rgba(0,0,0,0.1), 0 5px 15px 0 rgba(0,0,0,0.1)',
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          duration: 0.3
        }
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        delay: Math.random() * 0.2
      }}
      className={`bg-white rounded-3xl shadow-xl border border-neutral-100/60 p-0 flex flex-col group hover:shadow-2xl relative ${getWidgetSize(widgetSize.width, widgetSize.height)}`}
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        backdropFilter: 'blur(20px)',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1), 0 1px 8px 0 rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
    >
      {/* Resize Handles */}
      <div className="absolute inset-0 pointer-events-none group-hover:pointer-events-auto">
        {/* Corner Handles */}
        <motion.div
          className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto"
          whileHover={{ scale: 1.3, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
          onMouseDown={handleResizeStart('nw')}
          style={{ transform: 'translateZ(20px)' }}
        />
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto"
          whileHover={{ scale: 1.3, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
          onMouseDown={handleResizeStart('ne')}
          style={{ transform: 'translateZ(20px)' }}
        />
        <motion.div
          className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto"
          whileHover={{ scale: 1.3, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
          onMouseDown={handleResizeStart('sw')}
          style={{ transform: 'translateZ(20px)' }}
        />
        <motion.div
          className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto"
          whileHover={{ scale: 1.3, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
          onMouseDown={handleResizeStart('se')}
          style={{ transform: 'translateZ(20px)' }}
        />
        
        {/* Edge Handles */}
        <motion.div
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-blue-500 rounded-full cursor-n-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto"
          whileHover={{ scale: 1.2, boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)' }}
          onMouseDown={handleResizeStart('n')}
          style={{ transform: 'translateZ(20px) translateX(-50%)' }}
        />
        <motion.div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-blue-500 rounded-full cursor-s-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto"
          whileHover={{ scale: 1.2, boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)' }}
          onMouseDown={handleResizeStart('s')}
          style={{ transform: 'translateZ(20px) translateX(-50%)' }}
        />
        <motion.div
          className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-blue-500 rounded-full cursor-w-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto"
          whileHover={{ scale: 1.2, boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)' }}
          onMouseDown={handleResizeStart('w')}
          style={{ transform: 'translateZ(20px) translateY(-50%)' }}
        />
        <motion.div
          className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-blue-500 rounded-full cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto"
          whileHover={{ scale: 1.2, boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)' }}
          onMouseDown={handleResizeStart('e')}
          style={{ transform: 'translateZ(20px) translateY(-50%)' }}
        />
      </div>

      {/* Resize Indicator */}
      {isResizing && (
        <motion.div
          className="absolute inset-0 border-2 border-blue-500 rounded-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ transform: 'translateZ(25px)' }}
        />
      )}

      {/* 3D Depth Layer */}
      <div 
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none"
        style={{
          transform: 'translateZ(1px)',
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* Ambient Light Effect */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          transform: 'translateZ(2px)',
        }}
      />

      {/* Widget Header */}
      <motion.div 
        className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-100/60 relative"
        style={{ transform: 'translateZ(3px)' }}
      >
        <div className="flex items-center space-x-2">
          {/* Accent bar or icon for widget type */}
          <motion.div 
            className={`w-1 h-8 rounded-full bg-gradient-to-b ${getAccentColor(widget.type)} mr-3 shadow-lg`}
            whileHover={{ 
              scale: 1.2, 
              height: 36,
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
              rotateY: 10,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{
              transformStyle: 'preserve-3d',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          />
          <motion.h3 
            className="text-lg font-semibold text-neutral-800 tracking-tight"
            whileHover={{ scale: 1.02, x: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {widget.title}
          </motion.h3>
          {widget.refreshInterval && (
            <motion.div 
              className="w-2 h-2 bg-green-400 rounded-full ml-3 shadow-lg"
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [0.7, 1, 0.7],
                boxShadow: [
                  '0 0 5px rgba(34, 197, 94, 0.3)',
                  '0 0 15px rgba(34, 197, 94, 0.6)',
                  '0 0 5px rgba(34, 197, 94, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: 'translateZ(1px)' }}
            />
          )}
        </div>
        <motion.div 
          className="flex items-center space-x-1"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 0, x: 0 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            whileHover={{ 
              scale: 1.2, 
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              rotateZ: 5,
              y: -2,
            }}
            whileTap={{ scale: 0.9, rotateZ: -5 }}
            onClick={handleExpand}
            className="p-2 rounded-xl hover:bg-blue-50 transition-all duration-200 hover:shadow-lg"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(2px)',
            }}
          >
            <Maximize2 className="w-4 h-4 text-neutral-600 hover:text-blue-600" />
          </motion.button>
          <motion.button
            whileHover={{ 
              scale: 1.2, 
              backgroundColor: 'rgba(107, 114, 128, 0.1)',
              rotateZ: -5,
              y: -2,
            }}
            whileTap={{ scale: 0.9, rotateZ: 5 }}
            onClick={onEdit}
            className="p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-lg"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(2px)',
            }}
          >
            <MoreHorizontal className="w-4 h-4 text-neutral-600 hover:text-gray-700" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Widget Content */}
      <motion.div 
        className="flex-1 p-5 flex flex-col justify-between min-h-0 relative"
        style={{ transform: 'translateZ(1px)' }}
        whileHover={{ transform: 'translateZ(2px)' }}
        transition={{ duration: 0.2 }}
      >
        {getWidgetComponent(widget.type, widget.data)}
      </motion.div>

      {/* Widget Footer */}
      {widget.lastUpdated && (
        <div className="px-5 pb-3 pt-2 border-t border-neutral-100/60 text-right">
          <p className="text-xs text-neutral-500 font-medium">
            Last updated: {new Date(widget.lastUpdated).toLocaleTimeString()}
          </p>
      </div>
      )}
    </motion.div>
  );
}; 