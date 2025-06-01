import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Activity, Info } from 'lucide-react';

interface HeatmapData {
  date: string;
  value: number;
  events: number;
}

interface DayData {
  date: Date;
  dateStr: string;
  value: number;
  events: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface HeatmapCalendarData {
  data: HeatmapData[];
  metrics: {
    totalEvents: number;
    averageDaily: number;
    peakDay: string;
    peakValue: number;
  };
}

interface HeatmapCalendarWidgetProps {
  data: HeatmapCalendarData;
}

export const HeatmapCalendarWidget: React.FC<HeatmapCalendarWidgetProps> = ({ data }) => {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-400">
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
          <p>No activity data available</p>
        </div>
      </div>
    );
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Process data for the selected month
  const monthData = useMemo(() => {
    const year = new Date().getFullYear();
    const firstDay = new Date(year, selectedMonth, 1);
    const lastDay = new Date(year, selectedMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: DayData[] = [];
    const current = new Date(startDate);
    
    // Generate 6 weeks of days
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        const dateStr = current.toISOString().split('T')[0];
        const dayData = data.data.find(d => d.date === dateStr);
        
        days.push({
          date: new Date(current),
          dateStr,
          value: dayData?.value || 0,
          events: dayData?.events || 0,
          isCurrentMonth: current.getMonth() === selectedMonth,
          isToday: dateStr === new Date().toISOString().split('T')[0]
        });
        
        current.setDate(current.getDate() + 1);
      }
    }
    
    return days;
  }, [data.data, selectedMonth]);

  // Calculate intensity levels
  const maxValue = Math.max(...data.data.map(d => d.value));
  const getIntensity = (value: number) => {
    if (value === 0) return 0;
    if (value <= maxValue * 0.25) return 1;
    if (value <= maxValue * 0.5) return 2;
    if (value <= maxValue * 0.75) return 3;
    return 4;
  };

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-neutral-100';
      case 1: return 'bg-green-200';
      case 2: return 'bg-green-300';
      case 3: return 'bg-green-400';
      case 4: return 'bg-green-500';
      default: return 'bg-neutral-100';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center"
          >
            <Activity className="w-4 h-4 text-white" />
          </motion.div>
          <span className="text-sm font-medium text-neutral-700">Activity Heatmap</span>
        </div>
        
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="text-xs bg-neutral-100 border border-neutral-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month} 2024
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div key={day} className="text-xs text-neutral-500 text-center font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {monthData.map((day, index) => {
            const intensity = getIntensity(day.value);
            
            return (
              <motion.div
                key={day.dateStr}
                whileHover={{ scale: 1.1 }}
                className={`
                  aspect-square rounded-sm cursor-pointer relative
                  ${getIntensityColor(intensity)}
                  ${day.isCurrentMonth ? '' : 'opacity-30'}
                  ${day.isToday ? 'ring-2 ring-blue-500' : ''}
                  transition-all duration-200
                `}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-medium ${
                    intensity > 2 ? 'text-white' : 'text-neutral-700'
                  }`}>
                    {day.date.getDate()}
                  </span>
                </div>
                
                {/* Hover tooltip */}
                {hoveredDay === day && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-neutral-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap"
                  >
                    <div className="font-medium">{formatDate(hoveredDay.date)}</div>
                    <div>{hoveredDay.events} events • Value: {hoveredDay.value}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-neutral-800" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-neutral-500">Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-500">More</span>
          </div>
          
          <div className="text-xs text-neutral-500">
            {data.metrics.totalEvents.toLocaleString()} total events
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-2 bg-neutral-50 rounded-lg text-center"
          >
            <div className="text-xs text-neutral-500">Daily Avg</div>
            <div className="text-sm font-bold text-neutral-800">
              {data.metrics.averageDaily.toFixed(1)}
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-2 bg-green-50 rounded-lg text-center"
          >
            <div className="text-xs text-green-600">Peak Day</div>
            <div className="text-sm font-bold text-green-700">
              {data.metrics.peakValue}
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-2 bg-blue-50 rounded-lg text-center"
          >
            <div className="text-xs text-blue-600">This Month</div>
            <div className="text-sm font-bold text-blue-700">
              {monthData
                .filter(d => d.isCurrentMonth)
                .reduce((sum, d) => sum + d.events, 0)
                .toLocaleString()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 