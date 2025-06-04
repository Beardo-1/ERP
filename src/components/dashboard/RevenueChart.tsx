
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 245000, expenses: 180000 },
  { month: "Feb", revenue: 267000, expenses: 195000 },
  { month: "Mar", revenue: 298000, expenses: 210000 },
  { month: "Apr", revenue: 284000, expenses: 205000 },
  { month: "May", revenue: 321000, expenses: 220000 },
  { month: "Jun", revenue: 356000, expenses: 240000 },
  { month: "Jul", revenue: 389000, expenses: 255000 },
  { month: "Aug", revenue: 412000, expenses: 270000 },
  { month: "Sep", revenue: 438000, expenses: 285000 },
  { month: "Oct", revenue: 456000, expenses: 290000 },
  { month: "Nov", revenue: 478000, expenses: 305000 },
  { month: "Dec", revenue: 502000, expenses: 320000 }
];

export const RevenueChart = () => {
  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Revenue vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ r: 5, fill: "#3b82f6" }}
              activeDot={{ r: 7, fill: "#1d4ed8" }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ r: 5, fill: "#ef4444" }}
              activeDot={{ r: 7, fill: "#dc2626" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
