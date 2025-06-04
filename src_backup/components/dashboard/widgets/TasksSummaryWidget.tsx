import React from 'react';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface TaskCounts {
  completed: number;
  pending: number;
  overdue: number;
  total: number;
}

interface TasksSummaryWidgetProps {
  data: TaskCounts;
}

export const TasksSummaryWidget: React.FC<TasksSummaryWidgetProps> = ({ data }) => {
  const getCompletionPercentage = () => {
    if (data.total === 0) return 0;
    return Math.round((data.completed / data.total) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm text-neutral-600">Completion Rate</span>
          <span className="text-xl font-bold">{completionPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 rounded-lg bg-success-50">
          <div className="mb-2 w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-success-600" />
          </div>
          <span className="text-sm font-medium text-neutral-600">Completed</span>
          <span className="text-lg font-bold text-success-700">{data.completed}</span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-lg bg-blue-50">
          <div className="mb-2 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-neutral-600">Pending</span>
          <span className="text-lg font-bold text-blue-700">{data.pending}</span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-lg bg-amber-50">
          <div className="mb-2 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-sm font-medium text-neutral-600">Overdue</span>
          <span className="text-lg font-bold text-amber-700">{data.overdue}</span>
        </div>
      </div>
    </div>
  );
}; 