
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const products = [
  { name: "Wireless Headphones", sales: 1247, revenue: "$124,700", progress: 89 },
  { name: "Smart Watch", sales: 892, revenue: "$178,400", progress: 76 },
  { name: "Laptop Stand", sales: 634, revenue: "$31,700", progress: 64 },
  { name: "USB-C Cable", sales: 2156, revenue: "$43,120", progress: 92 },
  { name: "Bluetooth Speaker", sales: 445, revenue: "$66,750", progress: 51 }
];

export const TopProducts = () => {
  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{product.name}</span>
                <span className="text-sm font-bold text-green-600">{product.revenue}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{product.sales} units sold</span>
                <span>{product.progress}%</span>
              </div>
              <Progress value={product.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
