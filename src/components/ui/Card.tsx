import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glassEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  glassEffect = false,
  onClick
}) => {
  const baseClasses = 'rounded-2xl bg-gradient-to-br from-blue-50/80 via-white/90 to-indigo-50/80 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-200';
  const hoverClasses = hoverEffect ? 'hover:shadow-lg hover:-translate-y-1' : '';
  const styleClasses = glassEffect 
    ? 'glass' 
    : 'bg-white shadow-card hover:shadow-card-hover';
    
  return (
    <motion.div
      className={`${baseClasses} ${styleClasses} ${hoverClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', boxShadow: '0 4px 24px rgba(59,130,246,0.10)' }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ className?: string; children: ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`px-6 py-4 border-b border-neutral-200 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ className?: string; children: ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <h3 className={`text-lg font-medium text-neutral-800 ${className}`}>{children}</h3>;
};

export const CardContent: React.FC<{ className?: string; children: ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ className?: string; children: ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`px-6 py-3 bg-neutral-50 border-t border-neutral-200 ${className}`}>
      {children}
    </div>
  );
};