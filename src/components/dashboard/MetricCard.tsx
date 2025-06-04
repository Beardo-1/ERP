import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  tag?: {
    text: string;
    bgColor: string;
  };
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  tag,
  className
}) => {
  const isPositive = change >= 0;
  
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-bold tracking-tight mb-2">
              {value}
            </h3>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm font-medium",
                isPositive ? "text-green-600" : "text-red-600"
              )}>
                {isPositive ? "+" : ""}{change}%
              </span>
              {tag && (
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", tag.bgColor)}
                >
                  {tag.text}
                </Badge>
              )}
            </div>
          </div>
          <div className={cn(
            "p-3 rounded-xl",
            iconBgColor
          )}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 