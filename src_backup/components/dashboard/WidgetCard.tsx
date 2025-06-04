import React, { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { MoreHorizontal, Maximize2, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface WidgetCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  onRemove?: () => void;
  onExpand?: () => void;
  icon?: ReactNode;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  children,
  className = '',
  onRemove,
  onExpand,
  icon
}) => {
  return (
    <Card className={`${className}`}>
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && (
            <div className="p-1.5 bg-primary-50 text-primary-600 rounded-md">
              {icon}
            </div>
          )}
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        
        <div className="flex space-x-1">
          {onExpand && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-md hover:bg-neutral-100 text-neutral-500"
              onClick={onExpand}
            >
              <Maximize2 size={16} />
            </motion.button>
          )}
          
          {onRemove && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-md hover:bg-neutral-100 text-neutral-500"
              onClick={onRemove}
            >
              <X size={16} />
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-md hover:bg-neutral-100 text-neutral-500"
          >
            <MoreHorizontal size={16} />
          </motion.button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {children}
      </CardContent>
    </Card>
  );
};