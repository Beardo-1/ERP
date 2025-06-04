import React from 'react';
import { User, FileText, Home, DollarSign, Clock } from 'lucide-react';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: 'property' | 'document' | 'deal' | 'task' | 'user';
}

interface ActivityFeedWidgetProps {
  data: Activity[];
}

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ data }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <Home className="w-4 h-4 text-blue-500" />;
      case 'document':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'deal':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'task':
        return <Clock className="w-4 h-4 text-purple-500" />;
      case 'user':
        return <User className="w-4 h-4 text-indigo-500" />;
      default:
        return <User className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {data.map((activity) => (
          <div 
            key={activity.id} 
            className="flex py-3 border-b border-neutral-100 last:border-0"
          >
            <div className="w-8 h-8 mr-3 rounded-full bg-neutral-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {activity.user.avatar ? (
                <img 
                  src={activity.user.avatar} 
                  alt={activity.user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-neutral-500" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <p className="text-sm text-neutral-800 font-medium truncate">
                  {activity.user.name}
                </p>
                <span className="text-xs text-neutral-500 ml-2 flex-shrink-0">
                  {getTimeAgo(activity.timestamp)}
                </span>
              </div>
              
              <p className="text-xs text-neutral-600 mt-1">
                {activity.action} 
                <span className="inline-flex items-center mx-1 px-1.5 py-0.5 rounded-sm bg-neutral-100">
                  {getActivityIcon(activity.type)}
                  <span className="ml-1 font-medium">{activity.target}</span>
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-neutral-100">
        <button className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors">
          View all activity
        </button>
      </div>
    </div>
  );
}; 