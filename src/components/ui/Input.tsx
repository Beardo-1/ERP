import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    helperText, 
    error, 
    leftIcon, 
    rightIcon, 
    className = '', 
    fullWidth = true,
    ...props 
  }, ref) => {
    const baseClasses = 'w-full rounded-xl border-2 bg-white/80 shadow-md px-4 py-2 text-sm text-neutral-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-neutral-400';
    const errorClasses = 'border-red-400 focus:ring-red-400 focus:border-red-400';
    const disabledClasses = 'bg-neutral-100 text-neutral-400 cursor-not-allowed';
    
    const inputClasses = `
      ${baseClasses} ${error ? errorClasses : 'border-blue-200'} ${props.disabled ? disabledClasses : ''}
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon ? 'pr-10' : ''}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`${widthClass}`}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            style={{ fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', boxShadow: '0 2px 12px rgba(59,130,246,0.08)' }}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(helperText || error) && (
          <p className={`mt-1.5 text-sm ${error ? 'text-error-500' : 'text-neutral-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';