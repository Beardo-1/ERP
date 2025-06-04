
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const transactions = [
  { id: "#12459", customer: "Alice Johnson", amount: "$2,847", status: "completed", date: "2 hours ago" },
  { id: "#12458", customer: "Bob Smith", amount: "$1,234", status: "pending", date: "4 hours ago" },
  { id: "#12457", customer: "Carol Davis", amount: "$5,678", status: "completed", date: "6 hours ago" },
  { id: "#12456", customer: "David Wilson", amount: "$892", status: "failed", date: "8 hours ago" },
  { id: "#12455", customer: "Emma Brown", amount: "$3,456", status: "completed", date: "1 day ago" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "failed": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const RecentTransactions = () => {
  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{transaction.customer}</div>
                <div className="text-sm text-gray-600">{transaction.id} • {transaction.date}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{transaction.amount}</div>
                <Badge className={`${getStatusColor(transaction.status)} text-xs`}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
