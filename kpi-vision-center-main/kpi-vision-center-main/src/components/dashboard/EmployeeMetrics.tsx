
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const employeeData = [
  { name: "Full-time", value: 324, color: "#3b82f6" },
  { name: "Part-time", value: 167, color: "#10b981" },
  { name: "Contract", value: 89, color: "#f59e0b" },
  { name: "Remote", value: 145, color: "#8b5cf6" }
];

const metrics = [
  { label: "Total Employees", value: "725" },
  { label: "Productivity Score", value: "87%" },
  { label: "Attendance Rate", value: "94%" },
  { label: "Satisfaction Score", value: "4.2/5" }
];

export const EmployeeMetrics = () => {
  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Employee Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={employeeData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {employeeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
