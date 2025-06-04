
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Home, Building, DollarSign, MapPin, AlertTriangle } from "lucide-react";
import { useRealTimeKPIs } from "@/hooks/useRealTimeData";

export const LiveKPICards = () => {
  const { data: kpiData, isLoading, error } = useRealTimeKPIs();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 h-32 bg-gray-200 rounded-lg" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span>Error loading real estate data</span>
        </CardContent>
      </Card>
    );
  }

  const kpis = [
    {
      title: "Monthly Revenue",
      value: `$${(kpiData?.totalRevenue / 1000000).toFixed(1)}M`,
      change: "+8.3%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      alert: kpiData?.totalRevenue > 16000000 ? "high" : null
    },
    {
      title: "Active Listings",
      value: kpiData?.activeListing.toLocaleString(),
      change: "+12.4%",
      changeType: "increase",
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      alert: null
    },
    {
      title: "Properties Sold",
      value: kpiData?.propertiesSold.toLocaleString(),
      change: "+15.7%",
      changeType: "increase",
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      alert: null
    },
    {
      title: "Avg Property Value",
      value: `$${(kpiData?.avgPropertyValue / 1000).toFixed(0)}K`,
      change: "+3.2%",
      changeType: "increase",
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      alert: kpiData?.avgPropertyValue < 800000 ? "low" : null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card 
          key={index} 
          className={`hover:shadow-xl transition-all duration-500 animate-fade-in border-0 shadow-lg bg-white/90 backdrop-blur-sm relative overflow-hidden group ${
            kpi.alert ? 'ring-2 ring-yellow-400 ring-opacity-50 animate-pulse' : ''
          }`}
          style={{ animationDelay: `${index * 150}ms` }}
        >
          {/* Animated background gradient */}
          <div className={`absolute inset-0 ${kpi.bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
          
          {/* Pulsing dot for live indicator */}
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          
          {kpi.alert && (
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-yellow-400 animate-bounce">
              <AlertTriangle className="absolute -top-4 -right-3 h-3 w-3 text-white" />
            </div>
          )}
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-600">{kpi.title}</CardTitle>
            <div className={`p-2 rounded-lg ${kpi.bgColor} group-hover:scale-110 transition-transform duration-300`}>
              <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">
              {kpi.value}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {kpi.changeType === "increase" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 animate-bounce" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 animate-bounce" />
                )}
                <span className={`text-sm font-semibold ${kpi.changeType === "increase" ? "text-green-500" : "text-red-500"}`}>
                  {kpi.change}
                </span>
              </div>
              {kpi.alert && (
                <Badge variant={kpi.alert === "high" ? "default" : "destructive"} className="text-xs animate-pulse">
                  {kpi.alert === "high" ? "ABOVE TARGET" : "BELOW TARGET"}
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Updated: {kpiData?.lastUpdated}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
