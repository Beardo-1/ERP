import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Settings, Wifi, Clock, MapPin } from "lucide-react";
import { useAutoRefresh } from "@/hooks/useRealTimeData";

export const BoardroomHeader = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'monthly' | 'quarterly'>('monthly');
  const lastRefresh = useAutoRefresh();
  
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" 
             style={{ animationDuration: '3s' }} />
      </div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Building2 className="h-10 w-10 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Real Estate Command Center
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-blue-100">Live Property Intelligence Dashboard</p>
                <div className="flex items-center space-x-1 text-green-300">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Metropolitan Area</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <Clock className="h-5 w-5 animate-pulse" />
              <div className="text-sm">
                <div className="font-semibold">Last Update</div>
                <div className="text-blue-100">{lastRefresh.toLocaleTimeString()}</div>
              </div>
            </div>
            
            <Badge className="bg-green-500 text-white flex items-center space-x-2 px-4 py-2 animate-bounce">
              <Wifi className="h-4 w-4" />
              <span className="font-semibold">LIVE DATA</span>
            </Badge>
            
            <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-1">
              {(['daily', 'monthly', 'quarterly'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                  className={`text-white transition-all duration-300 ${
                    viewMode === mode ? 'bg-white/20 scale-105' : 'hover:bg-white/10'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 group transition-all duration-300"
            >
              <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
