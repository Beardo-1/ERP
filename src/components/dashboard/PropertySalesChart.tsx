
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, PieChart, Pie, Cell 
} from "recharts";
import { useRealTimeRevenue } from "@/hooks/useRealTimeData";
import { TrendingUp, Loader, BarChart3, LineChart as LineIcon, PieChart as PieIcon, Activity } from "lucide-react";

export const PropertySalesChart = () => {
  const { data: salesData, isLoading, error } = useRealTimeRevenue();
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'pie'>('line');

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Loader className="h-5 w-5 animate-spin" />
            <span>Loading Property Sales Data...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-red-600">
          Error loading property sales data
        </CardContent>
      </Card>
    );
  }

  const targetRevenue = 25000000;
  const currentAverage = salesData ? salesData.reduce((sum, item) => sum + item.residential + item.commercial + item.luxury, 0) / salesData.length : 0;
  const isAboveTarget = currentAverage > targetRevenue;

  // Transform data for pie chart
  const pieData = salesData ? [
    { name: 'Residential', value: salesData.reduce((sum, item) => sum + item.residential, 0), fill: '#3b82f6' },
    { name: 'Commercial', value: salesData.reduce((sum, item) => sum + item.commercial, 0), fill: '#ef4444' },
    { name: 'Luxury', value: salesData.reduce((sum, item) => sum + item.luxury, 0), fill: '#10b981' }
  ] : [];

  const COLORS = ['#3b82f6', '#ef4444', '#10b981'];

  const chartIcons = {
    line: LineIcon,
    bar: BarChart3,
    area: Activity,
    pie: PieIcon
  };

  const renderChart = () => {
    const commonProps = {
      width: "100%",
      height: 350,
      data: salesData
    };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={14} fontWeight="bold" />
              <YAxis stroke="#6b7280" fontSize={14} fontWeight="bold" tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '2px solid #3b82f6',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
                formatter={(value: any) => [`$${(value / 1000000).toFixed(1)}M`, '']}
              />
              <ReferenceLine y={targetRevenue} stroke="#ef4444" strokeDasharray="8 8" strokeWidth={2} />
              <Bar dataKey="residential" fill="#3b82f6" radius={[4, 4, 0, 0]} className="animate-pulse" />
              <Bar dataKey="commercial" fill="#ef4444" radius={[4, 4, 0, 0]} className="animate-pulse" />
              <Bar dataKey="luxury" fill="#10b981" radius={[4, 4, 0, 0]} className="animate-pulse" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={14} fontWeight="bold" />
              <YAxis stroke="#6b7280" fontSize={14} fontWeight="bold" tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '2px solid #3b82f6',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => [`$${(value / 1000000).toFixed(1)}M`, '']}
              />
              <Area type="monotone" dataKey="luxury" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="commercial" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Area type="monotone" dataKey="residential" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                className="animate-spin"
                style={{ animationDuration: '10s' }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`$${(value / 1000000).toFixed(1)}M`, '']} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={14} fontWeight="bold" />
              <YAxis stroke="#6b7280" fontSize={14} fontWeight="bold" tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '2px solid #3b82f6',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => [`$${(value / 1000000).toFixed(1)}M`, '']}
              />
              <ReferenceLine y={targetRevenue} stroke="#ef4444" strokeDasharray="8 8" strokeWidth={2} />
              <Line 
                type="monotone" 
                dataKey="residential" 
                stroke="#3b82f6" 
                strokeWidth={4}
                dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 8, fill: "#1d4ed8", stroke: "#ffffff", strokeWidth: 3, className: "animate-ping" }}
              />
              <Line 
                type="monotone" 
                dataKey="commercial" 
                stroke="#ef4444" 
                strokeWidth={4}
                dot={{ r: 6, fill: "#ef4444", strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 8, fill: "#dc2626", stroke: "#ffffff", strokeWidth: 3, className: "animate-ping" }}
              />
              <Line 
                type="monotone" 
                dataKey="luxury" 
                stroke="#10b981" 
                strokeWidth={4}
                dot={{ r: 6, fill: "#10b981", strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 8, fill: "#059669", stroke: "#ffffff", strokeWidth: 3, className: "animate-ping" }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span>Property Sales by Type</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {(['line', 'bar', 'area', 'pie'] as const).map((type) => {
                const Icon = chartIcons[type];
                return (
                  <Button
                    key={type}
                    variant={chartType === type ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setChartType(type)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
            <Badge className={isAboveTarget ? "bg-green-500" : "bg-yellow-500"}>
              {isAboveTarget ? "ABOVE TARGET" : "BELOW TARGET"}
            </Badge>
            <Badge variant="outline" className="animate-pulse">
              LIVE
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
        <div className="mt-4 grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              ${salesData ? (salesData.reduce((sum, item) => sum + item.residential, 0) / 1000000).toFixed(1) : 0}M
            </div>
            <div className="text-sm text-blue-700">Residential</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              ${salesData ? (salesData.reduce((sum, item) => sum + item.commercial, 0) / 1000000).toFixed(1) : 0}M
            </div>
            <div className="text-sm text-red-700">Commercial</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ${salesData ? (salesData.reduce((sum, item) => sum + item.luxury, 0) / 1000000).toFixed(1) : 0}M
            </div>
            <div className="text-sm text-green-700">Luxury</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className={`text-2xl font-bold ${isAboveTarget ? 'text-green-600' : 'text-red-600'}`}>
              {((currentAverage / targetRevenue - 1) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-700">vs Target</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
