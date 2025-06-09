import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  onNavigate?: (href: string) => void;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  className,
  showHome = true,
  onNavigate
}) => {
  const handleClick = (href: string | undefined, e: React.MouseEvent) => {
    if (href && onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  const allItems = showHome 
    ? [{ label: 'Home', href: '/', icon: <Home className="w-4 h-4" />, isActive: false }, ...items]
    : items;

  return (
    <nav 
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isClickable = item.href && !item.isActive && !isLast;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground/50" />
              )}
              
              <div className="flex items-center space-x-1">
                {item.icon && (
                  <span className={cn(
                    'flex-shrink-0',
                    isLast || item.isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {item.icon}
                  </span>
                )}
                
                {isClickable ? (
                  <a
                    href={item.href}
                    onClick={(e) => handleClick(item.href, e)}
                    className={cn(
                      'hover:text-foreground transition-colors duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-1'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={cn(
                      isLast || item.isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                    )}
                    aria-current={isLast || item.isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Hook for managing breadcrumb state
export const useBreadcrumb = () => {
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([]);

  const updateBreadcrumbs = React.useCallback((items: BreadcrumbItem[]) => {
    setBreadcrumbs(items);
  }, []);

  const addBreadcrumb = React.useCallback((item: BreadcrumbItem) => {
    setBreadcrumbs(prev => [...prev, item]);
  }, []);

  const removeBreadcrumb = React.useCallback((index: number) => {
    setBreadcrumbs(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearBreadcrumbs = React.useCallback(() => {
    setBreadcrumbs([]);
  }, []);

  return {
    breadcrumbs,
    updateBreadcrumbs,
    addBreadcrumb,
    removeBreadcrumb,
    clearBreadcrumbs
  };
};

// Breadcrumb context for global state management
interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  updateBreadcrumbs: (items: BreadcrumbItem[]) => void;
  addBreadcrumb: (item: BreadcrumbItem) => void;
  removeBreadcrumb: (index: number) => void;
  clearBreadcrumbs: () => void;
}

const BreadcrumbContext = React.createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const breadcrumbState = useBreadcrumb();

  return (
    <BreadcrumbContext.Provider value={breadcrumbState}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbContext = () => {
  const context = React.useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error('useBreadcrumbContext must be used within a BreadcrumbProvider');
  }
  return context;
};

// Compact breadcrumb for mobile
interface CompactBreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
  className?: string;
}

export const CompactBreadcrumb: React.FC<CompactBreadcrumbProps> = ({
  items,
  onNavigate,
  className
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  if (items.length <= 2) {
    return <BreadcrumbNav items={items} onNavigate={onNavigate} className={className} />;
  }

  const firstItem = items[0];
  const lastItem = items[items.length - 1];
  const middleItems = items.slice(1, -1);

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      <ol className="flex items-center space-x-1">
        {/* First item */}
        <li className="flex items-center">
          {firstItem.icon && (
            <span className="flex-shrink-0 text-muted-foreground mr-1">
              {firstItem.icon}
            </span>
          )}
          {firstItem.href && onNavigate ? (
            <a
              href={firstItem.href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(firstItem.href!);
              }}
              className="hover:text-foreground transition-colors duration-200"
            >
              {firstItem.label}
            </a>
          ) : (
            <span>{firstItem.label}</span>
          )}
        </li>

        <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground/50" />

        {/* Expandable middle section */}
        {!isExpanded ? (
          <li>
            <button
              onClick={() => setIsExpanded(true)}
              className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Show more breadcrumb items"
            >
              ...
            </button>
          </li>
        ) : (
          <>
            {middleItems.map((item, index) => (
              <React.Fragment key={index}>
                <li className="flex items-center">
                  {item.href && onNavigate ? (
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item.href!);
                      }}
                      className="hover:text-foreground transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
                <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground/50" />
              </React.Fragment>
            ))}
          </>
        )}

        <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground/50" />

        {/* Last item */}
        <li className="flex items-center">
          {lastItem.icon && (
            <span className="flex-shrink-0 text-foreground mr-1">
              {lastItem.icon}
            </span>
          )}
          <span className="text-foreground font-medium" aria-current="page">
            {lastItem.label}
          </span>
        </li>
      </ol>
    </nav>
  );
}; 