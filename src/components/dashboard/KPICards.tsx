
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart } from "lucide-react";

const kpis = [
  {
    title: "Total Revenue",
    value: "$2,847,392",
    change: "+12.5%",
    changeType: "increase",
    icon: DollarSign,
    color: "text-green-600"
  },
  {
    title: "Total Orders",
    value: "8,467",
    change: "+8.2%",
    changeType: "increase",
    icon: ShoppingCart,
    color: "text-blue-600"
  },
  {
    title: "Active Customers",
    value: "24,378",
    change: "+5.7%",
    changeType: "increase",
    icon: Users,
    color: "text-purple-600"
  },
  {
    title: "Inventory Value",
    value: "$1,456,890",
    change: "-2.1%",
    changeType: "decrease",
    icon: Package,
    color: "text-orange-600"
  }
];

export const KPICards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
            <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            <div className="flex items-center space-x-1 mt-1">
              {kpi.changeType === "increase" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${kpi.changeType === "increase" ? "text-green-500" : "text-red-500"}`}>
                {kpi.change}
              </span>
              <span className="text-sm text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
