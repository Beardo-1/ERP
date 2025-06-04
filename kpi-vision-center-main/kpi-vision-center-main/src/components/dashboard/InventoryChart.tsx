
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const inventoryData = [
  { category: "Electronics", inStock: 1245, lowStock: 67, outOfStock: 12 },
  { category: "Clothing", inStock: 2890, lowStock: 134, outOfStock: 23 },
  { category: "Home & Garden", inStock: 1567, lowStock: 89, outOfStock: 8 },
  { category: "Sports", inStock: 934, lowStock: 45, outOfStock: 15 },
  { category: "Books", inStock: 2156, lowStock: 78, outOfStock: 5 },
  { category: "Automotive", inStock: 678, lowStock: 34, outOfStock: 19 }
];

export const InventoryChart = () => {
  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Inventory Status by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="category" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="inStock" fill="#10b981" radius={[2, 2, 0, 0]} />
            <Bar dataKey="lowStock" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            <Bar dataKey="outOfStock" fill="#ef4444" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
