import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  status,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };
  
  const statusClasses = {
    online: 'bg-success-500',
    offline: 'bg-neutral-400',
    busy: 'bg-error-500',
    away: 'bg-warning-500',
  };
  
  // If a name is provided but no image, generate initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Generate a consistent background color based on the name
  const getColorFromName = (name: string) => {
    const colors = [
      'bg-primary-100 text-primary-800',
      'bg-secondary-100 text-secondary-800',
      'bg-accent-100 text-accent-800',
      'bg-emerald-100 text-emerald-800',
      'bg-amber-100 text-amber-800',
      'bg-rose-100 text-rose-800',
      'bg-violet-100 text-violet-800',
      'bg-cyan-100 text-cyan-800',
    ];
    
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colorIndex = charCodeSum % colors.length;
    
    return colors[colorIndex];
  };
  
  const baseClasses = 'rounded-full bg-gradient-to-br from-blue-200 via-white to-indigo-200 shadow-lg border-2 border-blue-100 flex items-center justify-center overflow-hidden transition-all duration-200';
  
  return (
    <div className={`relative inline-flex ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : name ? (
        <div
          className={`${baseClasses} ${sizeClasses[size]} ${getColorFromName(name)} ${className}`}
          style={{ fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', boxShadow: '0 2px 12px rgba(59,130,246,0.10)' }}
        >
          {getInitials(name)}
        </div>
      ) : (
        <div
          className={`${baseClasses} ${sizeClasses[size]} bg-neutral-200 text-neutral-600 ${className}`}
          style={{ fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', boxShadow: '0 2px 12px rgba(59,130,246,0.10)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-1/2 h-1/2"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      
      {status && (
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white ${statusClasses[status]}`}
        />
      )}
    </div>
  );
};