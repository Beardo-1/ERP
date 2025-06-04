
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, DollarSign, AlertTriangle, TrendingUp, Home, Clock } from "lucide-react";

// Simulated real estate analytics data
const generateAnalyticsData = () => {
  const totalProperties = 156;
  const totalRentDue = 2450000; // $2.45M
  const rentPaid = Math.round(totalRentDue * (0.75 + Math.random() * 0.2)); // 75-95% paid
  
  const leaseExpirations = [
    { period: "Next 30 days", count: Math.round(8 + Math.random() * 7), color: "bg-red-500", urgency: "high" },
    { period: "Next 60 days", count: Math.round(15 + Math.random() * 10), color: "bg-orange-500", urgency: "medium" },
    { period: "Next 90 days", count: Math.round(22 + Math.random() * 15), color: "bg-yellow-500", urgency: "low" }
  ];

  const paymentStatus = [
    { status: "Paid on Time", count: Math.round(totalProperties * 0.78), color: "text-green-600", bg: "bg-green-50" },
    { status: "Late Payment", count: Math.round(totalProperties * 0.15), color: "text-orange-600", bg: "bg-orange-50" },
    { status: "Overdue", count: Math.round(totalProperties * 0.07), color: "text-red-600", bg: "bg-red-50" }
  ];

  return {
    totalProperties,
    totalRentDue,
    rentPaid,
    paymentPercentage: Math.round((rentPaid / totalRentDue) * 100),
    leaseExpirations,
    paymentStatus,
    avgRent: Math.round(totalRentDue / totalProperties)
  };
};

export const RealEstateAnalytics = () => {
  const analytics = generateAnalyticsData();
  
  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <Home className="h-6 w-6 text-blue-600" />
          <span>Real Estate Analytics</span>
          <Badge variant="outline" className="animate-pulse ml-auto">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rent Collection Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span>Monthly Rent Collection</span>
            </h3>
            <Badge className={`${analytics.paymentPercentage >= 85 ? 'bg-green-500' : analytics.paymentPercentage >= 70 ? 'bg-orange-500' : 'bg-red-500'}`}>
              {analytics.paymentPercentage}%
            </Badge>
          </div>
          <div className="space-y-2">
            <Progress value={analytics.paymentPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${(analytics.rentPaid / 1000000).toFixed(2)}M Collected</span>
              <span>${(analytics.totalRentDue / 1000000).toFixed(2)}M Total Due</span>
            </div>
          </div>
        </div>

        {/* Payment Status Breakdown */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Payment Status</h3>
          <div className="space-y-2">
            {analytics.paymentStatus.map((status, index) => (
              <div key={index} className={`p-3 rounded-lg ${status.bg} flex items-center justify-between group hover:scale-[1.02] transition-transform duration-200`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${status.color.replace('text-', 'bg-')}`} />
                  <span className="text-sm font-medium">{status.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${status.color}`}>{status.count}</span>
                  <span className="text-sm text-gray-500">properties</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lease Expiration Tracking */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-orange-600" />
            <span>Lease Expirations</span>
          </h3>
          <div className="space-y-2">
            {analytics.leaseExpirations.map((lease, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  {lease.urgency === 'high' && <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />}
                  {lease.urgency === 'medium' && <Clock className="h-4 w-4 text-orange-500" />}
                  {lease.urgency === 'low' && <Clock className="h-4 w-4 text-yellow-500" />}
                  <span className="text-sm font-medium">{lease.period}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={lease.urgency === 'high' ? 'destructive' : lease.urgency === 'medium' ? 'default' : 'secondary'}>
                    {lease.count} leases
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center p-3 bg-blue-50 rounded-lg group hover:bg-blue-100 transition-colors duration-300">
            <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
              {analytics.totalProperties}
            </div>
            <div className="text-sm text-blue-700">Total Properties</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg group hover:bg-green-100 transition-colors duration-300">
            <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
              ${(analytics.avgRent / 1000).toFixed(1)}K
            </div>
            <div className="text-sm text-green-700">Avg Monthly Rent</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
