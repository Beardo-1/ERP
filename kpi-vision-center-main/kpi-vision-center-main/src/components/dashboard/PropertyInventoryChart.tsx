import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap
} from "recharts";
import { useRealTimeInventory } from "@/hooks/useRealTimeData";
import { Home, AlertTriangle, Loader, BarChart3, Target, Grid3X3 } from "lucide-react";

export const PropertyInventoryChart = () => {
  const { data: inventoryData, isLoading, error } = useRealTimeInventory();
  const [chartType, setChartType] = useState<'bar' | 'radar' | 'treemap'>('bar');

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Loader className="h-5 w-5 animate-spin" />
            <span>Loading Property Inventory...</span>
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
          Error loading property inventory data
        </CardContent>
      </Card>
    );
  }

  const criticalItems = inventoryData?.filter(item => item.pending > 15 || item.available < 20) || [];
  const totalAvailable = inventoryData?.reduce((sum, item) => sum + item.available, 0) || 0;

  const chartIcons = {
    bar: BarChart3,
    radar: Target,
    treemap: Grid3X3
  };

  const renderChart = () => {
    const commonProps = {
      width: "100%",
      height: 350
    };

    switch (chartType) {
      case 'radar':
        return (
          <ResponsiveContainer {...commonProps}>
            <RadarChart data={inventoryData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="type" />
              <PolarRadiusAxis angle={45} domain={[0, 'dataMax']} />
              <Radar 
                name="Available" 
                dataKey="available" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                className="animate-pulse"
              />
              <Radar 
                name="Pending" 
                dataKey="pending" 
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.6}
                className="animate-pulse"
              />
              <Radar 
                name="Sold" 
                dataKey="sold" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                className="animate-pulse"
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      case 'treemap':
        const treemapData = inventoryData?.map(item => ({
          name: item.type,
          size: item.available + item.pending + item.sold,
          available: item.available,
          pending: item.pending,
          sold: item.sold
        })) || [];
        
        return (
          <ResponsiveContainer {...commonProps}>
            <Treemap
              data={treemapData}
              dataKey="size"
              stroke="#fff"
              fill="#3b82f6"
            />
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={inventoryData} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="type" 
                stroke="#6b7280" 
                fontSize={12}
                fontWeight="bold"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={14}
                fontWeight="bold"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '2px solid #f59e0b',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              />
              <Bar dataKey="available" fill="#10b981" radius={[4, 4, 0, 0]} className="animate-pulse" />
              <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                {inventoryData?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.pending > 15 ? "#ef4444" : "#f59e0b"}
                    className="animate-pulse"
                  />
                ))}
              </Bar>
              <Bar dataKey="sold" fill="#3b82f6" radius={[4, 4, 0, 0]} className="animate-pulse" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Home className="h-6 w-6 text-orange-600" />
            <span>Property Inventory Status</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {(['bar', 'radar', 'treemap'] as const).map((type) => {
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
            {criticalItems.length > 0 && (
              <Badge className="bg-red-500 flex items-center space-x-1 animate-bounce">
                <AlertTriangle className="h-3 w-3" />
                <span>{criticalItems.length} CRITICAL</span>
              </Badge>
            )}
            <Badge variant="outline" className="animate-pulse">
              LIVE
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
        
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg group hover:bg-green-100 transition-colors duration-300">
            <div className="text-xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
              {totalAvailable.toLocaleString()}
            </div>
            <div className="text-sm text-green-700">Available</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg group hover:bg-yellow-100 transition-colors duration-300">
            <div className="text-xl font-bold text-yellow-600 group-hover:scale-110 transition-transform duration-300">
              {inventoryData?.reduce((sum, item) => sum + item.pending, 0)}
            </div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg group hover:bg-blue-100 transition-colors duration-300">
            <div className="text-xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
              {inventoryData?.reduce((sum, item) => sum + item.sold, 0)}
            </div>
            <div className="text-sm text-blue-700">Sold This Month</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg group hover:bg-red-100 transition-colors duration-300">
            <div className="text-xl font-bold text-red-600 group-hover:scale-110 transition-transform duration-300 animate-pulse">
              {criticalItems.length}
            </div>
            <div className="text-sm text-red-700">Critical Items</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
