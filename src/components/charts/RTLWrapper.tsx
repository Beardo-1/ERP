import React from 'react';
import { useLanguage } from '../SimpleLanguageSwitcher';

interface RTLWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const RTLWrapper: React.FC<RTLWrapperProps> = ({ children, className = "" }) => {
  const { isRTL } = useLanguage();
  
  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'} 
      className={`w-full h-full ${isRTL ? 'rtl-content' : 'ltr-content'} ${className}`}
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: isRTL ? 'right' : 'left'
      }}
    >
      {children}
    </div>
  );
};

export default RTLWrapper; 