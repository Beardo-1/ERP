import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, Search, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

export interface MobileNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string | number;
  children?: MobileNavItem[];
  isActive?: boolean;
}

interface MobileNavProps {
  items: MobileNavItem[];
  onNavigate?: (href: string) => void;
  onSearch?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  className?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  notificationCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  items,
  onNavigate,
  onSearch,
  onNotifications,
  onProfile,
  className,
  user,
  notificationCount = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('[data-mobile-nav]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleItemClick = (item: MobileNavItem) => {
    if (item.children && item.children.length > 0) {
      toggleExpanded(item.id);
    } else if (item.href) {
      onNavigate?.(item.href);
      setIsOpen(false);
    }
  };

  const renderNavItem = (item: MobileNavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const paddingLeft = level * 16 + 16;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            'w-full flex items-center justify-between py-3 px-4 text-left transition-colors',
            'hover:bg-accent active:bg-accent/80',
            item.isActive && 'bg-primary text-primary-foreground',
            level > 0 && 'border-l-2 border-border ml-4'
          )}
          style={{ paddingLeft }}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {item.icon && (
              <span className={cn(
                'flex-shrink-0',
                item.isActive ? 'text-primary-foreground' : 'text-muted-foreground'
              )}>
                {item.icon}
              </span>
            )}
            <span className={cn(
              'font-medium truncate',
              level > 0 && 'text-sm'
            )}>
              {item.label}
            </span>
            {item.badge && (
              <Badge 
                variant={item.isActive ? 'secondary' : 'default'} 
                className="ml-auto text-xs"
              >
                {item.badge}
              </Badge>
            )}
          </div>
          
          {hasChildren && (
            <span className="flex-shrink-0 ml-2">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
        </button>

        {/* Submenu */}
        {hasChildren && isExpanded && (
          <div className="bg-muted/30">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className={cn(
        'lg:hidden flex items-center justify-between p-4 bg-background border-b border-border',
        className
      )} data-mobile-nav>
        {/* Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="p-2"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Logo/Title */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold">ERP System</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          {onSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearch}
              className="p-2"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}

          {/* Notifications */}
          {onNotifications && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotifications}
              className="p-2 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Profile */}
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onProfile}
              className="p-1"
              aria-label="Profile"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          data-mobile-nav
        >
          {/* Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-background border-r border-border shadow-xl">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{user.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto">
              <nav className="py-2">
                {items.map(item => renderNavItem(item))}
              </nav>
            </div>

            {/* Menu Footer */}
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="text-xs text-muted-foreground text-center">
                ERP System v2.0
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Mobile Bottom Navigation
interface MobileBottomNavProps {
  items: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    href?: string;
    badge?: string | number;
    isActive?: boolean;
  }>;
  onNavigate?: (href: string) => void;
  className?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  items,
  onNavigate,
  className
}) => {
  const handleItemClick = (item: any) => {
    if (item.href) {
      onNavigate?.(item.href);
    }
  };

  return (
    <div className={cn(
      'lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border',
      'grid grid-cols-5 gap-1 p-2 safe-area-pb',
      className
    )}>
      {items.slice(0, 5).map(item => (
        <button
          key={item.id}
          onClick={() => handleItemClick(item)}
          className={cn(
            'flex flex-col items-center justify-center py-2 px-1 rounded-md transition-colors',
            'hover:bg-accent active:bg-accent/80',
            item.isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
          )}
        >
          <div className="relative">
            <span className="block w-6 h-6">
              {item.icon}
            </span>
            {item.badge && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-4 w-4 text-xs p-0 flex items-center justify-center"
              >
                {typeof item.badge === 'number' && item.badge > 9 ? '9+' : item.badge}
              </Badge>
            )}
          </div>
          <span className="text-xs mt-1 truncate max-w-full">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

// Mobile Swipe Navigation
interface MobileSwipeNavProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const MobileSwipeNav: React.FC<MobileSwipeNavProps> = ({
  onSwipeLeft,
  onSwipeRight,
  children,
  className
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return (
    <div
      className={cn('touch-pan-y', className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
}; 