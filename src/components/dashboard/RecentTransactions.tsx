import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  time: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions = [] }) => {
  const getStatusVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent transactions
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-border hover:shadow-sm transition-shadow"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div>
                <h4 className="font-medium text-foreground">{transaction.name}</h4>
                <p className="text-sm text-muted-foreground">{transaction.id} • {transaction.time}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground">
              ${transaction.amount.toLocaleString()}
            </span>
            <Badge 
              variant={getStatusVariant(transaction.status)}
              className={cn("capitalize", getStatusColor(transaction.status))}
            >
              {transaction.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};
