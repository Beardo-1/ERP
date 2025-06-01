import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreHorizontal, Maximize2, Activity } from 'lucide-react';

interface DataPoint {
  x: string;
  y: number;
  label?: string;
}

interface LineChartData {
  title: string;
  subtitle?: string;
  datasets: Array<{
    label: string;
    data: DataPoint[];
    color: string;
    gradient?: string;
    trend?: 'up' | 'down' | 'stable';
    change?: number;
  }>;
  yAxisLabel?: string;
  xAxisLabel?: string;
}

interface LineChartWidgetProps {
  data?: LineChartData;
}

const defaultData: LineChartData = {
  title: 'Revenue Trends',
  subtitle: 'Monthly Performance',
  yAxisLabel: 'Revenue ($K)',
  xAxisLabel: 'Month',
  datasets: [
    {
      label: 'Current Year',
      color: '#3b82f6',
      gradient: 'from-blue-500 to-blue-300',
      trend: 'up',
      change: 15.3,
      data: [
        { x: 'Jan', y: 320 },
        { x: 'Feb', y: 340 },
        { x: 'Mar', y: 380 },
        { x: 'Apr', y: 420 },
        { x: 'May', y: 450 },
        { x: 'Jun', y: 480 },
        { x: 'Jul', y: 520 },
        { x: 'Aug', y: 490 },
        { x: 'Sep', y: 540 },
        { x: 'Oct', y: 580 },
        { x: 'Nov', y: 620 },
        { x: 'Dec', y: 650 },
      ]
    },
    {
      label: 'Previous Year',
      color: '#10b981',
      gradient: 'from-green-500 to-green-300',
      trend: 'up',
      change: 8.7,
      data: [
        { x: 'Jan', y: 280 },
        { x: 'Feb', y: 290 },
        { x: 'Mar', y: 310 },
        { x: 'Apr', y: 330 },
        { x: 'May', y: 350 },
        { x: 'Jun', y: 370 },
        { x: 'Jul', y: 390 },
        { x: 'Aug', y: 410 },
        { x: 'Sep', y: 430 },
        { x: 'Oct', y: 450 },
        { x: 'Nov', y: 470 },
        { x: 'Dec', y: 490 },
      ]
    }
  ]
};

export const LineChartWidget: React.FC<LineChartWidgetProps> = ({ data = defaultData }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ datasetIndex: number; pointIndex: number } | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<number | null>(null);

  const chartDimensions = {
    width: 400,
    height: 200,
    padding: { top: 20, right: 20, bottom: 40, left: 60 }
  };

  const { xScale, yScale, maxY, minY } = useMemo(() => {
    const allData = data.datasets.flatMap(dataset => dataset.data);
    const maxY = Math.max(...allData.map(d => d.y));
    const minY = Math.min(...allData.map(d => d.y));
    const yRange = maxY - minY;
    const yPadding = yRange * 0.1;

    const xScale = (index: number) => 
      chartDimensions.padding.left + 
      (index / (data.datasets[0].data.length - 1)) * 
      (chartDimensions.width - chartDimensions.padding.left - chartDimensions.padding.right);

    const yScale = (value: number) => 
      chartDimensions.height - chartDimensions.padding.bottom - 
      ((value - (minY - yPadding)) / (maxY + yPadding - (minY - yPadding))) * 
      (chartDimensions.height - chartDimensions.padding.top - chartDimensions.padding.bottom);

    return { xScale, yScale, maxY: maxY + yPadding, minY: minY - yPadding };
  }, [data, chartDimensions]);

  const createPath = (dataset: typeof data.datasets[0]) => {
    return dataset.data.map((point, index) => {
      const x = xScale(index);
      const y = yScale(point.y);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const createAreaPath = (dataset: typeof data.datasets[0]) => {
    const linePath = createPath(dataset);
    const firstPoint = dataset.data[0];
    const lastPoint = dataset.data[dataset.data.length - 1];
    const bottomY = yScale(minY);
    
    return `${linePath} L ${xScale(dataset.data.length - 1)} ${bottomY} L ${xScale(0)} ${bottomY} Z`;
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* 3D Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, #10b981 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-4 relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h3 className="text-lg font-bold text-neutral-800 tracking-tight">{data.title}</h3>
          {data.subtitle && (
            <p className="text-sm text-neutral-600">{data.subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <motion.div
            className="flex items-center space-x-1 text-xs text-neutral-600"
            whileHover={{ scale: 1.05 }}
          >
            <Activity className="w-3 h-3" />
            <span>Live Data</span>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-neutral-600" />
          </motion.button>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div 
        className="flex items-center space-x-4 mb-4 relative z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {data.datasets.map((dataset, index) => (
          <motion.div
            key={index}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
              selectedDataset === index || selectedDataset === null
                ? 'bg-white shadow-md border border-neutral-200'
                : 'bg-neutral-100 opacity-60'
            }`}
            onClick={() => setSelectedDataset(selectedDataset === index ? null : index)}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: dataset.color }}
              whileHover={{ scale: 1.2 }}
              animate={selectedDataset === index ? { 
                boxShadow: `0 0 15px ${dataset.color}60`,
                scale: 1.1 
              } : {}}
            />
            <span className="text-sm font-medium text-neutral-800">{dataset.label}</span>
            {dataset.trend && dataset.change !== undefined && (
              <motion.div 
                className={`flex items-center space-x-1 text-xs ${
                  dataset.trend === 'up' ? 'text-green-600' : 
                  dataset.trend === 'down' ? 'text-red-600' : 'text-neutral-600'
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {dataset.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : dataset.trend === 'down' ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <div className="w-3 h-0.5 bg-neutral-400 rounded" />
                )}
                <span className="font-medium">
                  {dataset.change > 0 ? '+' : ''}{dataset.change}%
                </span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <div className="flex-1 relative z-10">
        <motion.svg
          width={chartDimensions.width}
          height={chartDimensions.height}
          className="w-full h-full drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
        >
          {/* Grid Lines */}
          <defs>
            {data.datasets.map((dataset, index) => (
              <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={dataset.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={dataset.color} stopOpacity="0.05" />
              </linearGradient>
            ))}
          </defs>

          {/* Y-axis grid lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = chartDimensions.padding.top + (i / 4) * (chartDimensions.height - chartDimensions.padding.top - chartDimensions.padding.bottom);
            return (
              <motion.line
                key={i}
                x1={chartDimensions.padding.left}
                y1={y}
                x2={chartDimensions.width - chartDimensions.padding.right}
                y2={y}
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth="1"
                strokeDasharray="2,2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
              />
            );
          })}

          {/* X-axis grid lines */}
          {data.datasets[0].data.map((_, i) => {
            const x = xScale(i);
            return (
              <motion.line
                key={i}
                x1={x}
                y1={chartDimensions.padding.top}
                x2={x}
                y2={chartDimensions.height - chartDimensions.padding.bottom}
                stroke="rgba(0, 0, 0, 0.05)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.7 + i * 0.05 }}
              />
            );
          })}

          {/* Area fills */}
          {data.datasets.map((dataset, datasetIndex) => {
            if (selectedDataset !== null && selectedDataset !== datasetIndex) return null;
            
            return (
              <motion.path
                key={`area-${datasetIndex}`}
                d={createAreaPath(dataset)}
                fill={`url(#gradient-${datasetIndex})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 1 + datasetIndex * 0.2, ease: "easeInOut" }}
              />
            );
          })}

          {/* Lines */}
          {data.datasets.map((dataset, datasetIndex) => {
            if (selectedDataset !== null && selectedDataset !== datasetIndex) return null;
            
            return (
              <motion.path
                key={`line-${datasetIndex}`}
                d={createPath(dataset)}
                fill="none"
                stroke={dataset.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.2 + datasetIndex * 0.2, ease: "easeInOut" }}
                style={{
                  filter: `drop-shadow(0 4px 8px ${dataset.color}40)`,
                }}
              />
            );
          })}

          {/* Data Points */}
          {data.datasets.map((dataset, datasetIndex) => {
            if (selectedDataset !== null && selectedDataset !== datasetIndex) return null;
            
            return dataset.data.map((point, pointIndex) => {
              const x = xScale(pointIndex);
              const y = yScale(point.y);
              const isHovered = hoveredPoint?.datasetIndex === datasetIndex && hoveredPoint?.pointIndex === pointIndex;
              
              return (
                <motion.g key={`point-${datasetIndex}-${pointIndex}`}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 4}
                    fill="white"
                    stroke={dataset.color}
                    strokeWidth="3"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint({ datasetIndex, pointIndex })}
                    onMouseLeave={() => setHoveredPoint(null)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                      delay: 1.5 + datasetIndex * 0.2 + pointIndex * 0.05 
                    }}
                    whileHover={{ 
                      scale: 1.5,
                      filter: `drop-shadow(0 6px 12px ${dataset.color}60)`,
                    }}
                    style={{
                      filter: isHovered ? `drop-shadow(0 4px 8px ${dataset.color}60)` : 'none',
                    }}
                  />
                  
                  {/* Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.g
                        initial={{ opacity: 0, scale: 0, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <motion.rect
                          x={x - 30}
                          y={y - 40}
                          width="60"
                          height="25"
                          rx="6"
                          fill="rgba(0, 0, 0, 0.8)"
                          stroke="white"
                          strokeWidth="1"
                        />
                        <motion.text
                          x={x}
                          y={y - 30}
                          textAnchor="middle"
                          className="text-xs font-bold fill-white"
                        >
                          ${point.y}K
                        </motion.text>
                        <motion.text
                          x={x}
                          y={y - 20}
                          textAnchor="middle"
                          className="text-xs fill-white opacity-80"
                        >
                          {point.x}
                        </motion.text>
                      </motion.g>
                    )}
                  </AnimatePresence>
                </motion.g>
              );
            });
          })}

          {/* Axes */}
          <motion.line
            x1={chartDimensions.padding.left}
            y1={chartDimensions.height - chartDimensions.padding.bottom}
            x2={chartDimensions.width - chartDimensions.padding.right}
            y2={chartDimensions.height - chartDimensions.padding.bottom}
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          
          <motion.line
            x1={chartDimensions.padding.left}
            y1={chartDimensions.padding.top}
            x2={chartDimensions.padding.left}
            y2={chartDimensions.height - chartDimensions.padding.bottom}
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          />

          {/* Axis Labels */}
          {data.datasets[0].data.map((point, i) => (
            <motion.text
              key={i}
              x={xScale(i)}
              y={chartDimensions.height - chartDimensions.padding.bottom + 15}
              textAnchor="middle"
              className="text-xs fill-neutral-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 + i * 0.05 }}
            >
              {point.x}
            </motion.text>
          ))}
        </motion.svg>

        {/* Floating Particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating Action Button */}
      <motion.button
        className="absolute bottom-4 right-4 w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 2.5 }}
      >
        <Maximize2 className="w-4 h-4" />
      </motion.button>
    </div>
  );
}; 