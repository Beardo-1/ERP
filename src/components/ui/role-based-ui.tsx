import React, { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// User roles and permissions
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  AGENT = 'agent',
  USER = 'user',
  VIEWER = 'viewer'
}

export enum Permission {
  // User management
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  
  // Property management
  CREATE_PROPERTY = 'create_property',
  READ_PROPERTY = 'read_property',
  UPDATE_PROPERTY = 'update_property',
  DELETE_PROPERTY = 'delete_property',
  
  // Financial operations
  VIEW_FINANCIALS = 'view_financials',
  MANAGE_FINANCIALS = 'manage_financials',
  APPROVE_TRANSACTIONS = 'approve_transactions',
  
  // Reports and analytics
  VIEW_REPORTS = 'view_reports',
  CREATE_REPORTS = 'create_reports',
  EXPORT_DATA = 'export_data',
  
  // System administration
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_INTEGRATIONS = 'manage_integrations',
  
  // Advanced features
  ACCESS_AI_FEATURES = 'access_ai_features',
  ACCESS_BLOCKCHAIN = 'access_blockchain',
  ACCESS_METAVERSE = 'access_metaverse'
}

// Role-permission mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.ADMIN]: [
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.CREATE_PROPERTY,
    Permission.READ_PROPERTY,
    Permission.UPDATE_PROPERTY,
    Permission.DELETE_PROPERTY,
    Permission.VIEW_FINANCIALS,
    Permission.MANAGE_FINANCIALS,
    Permission.VIEW_REPORTS,
    Permission.CREATE_REPORTS,
    Permission.EXPORT_DATA,
    Permission.MANAGE_SETTINGS,
    Permission.ACCESS_AI_FEATURES
  ],
  [UserRole.MANAGER]: [
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.CREATE_PROPERTY,
    Permission.READ_PROPERTY,
    Permission.UPDATE_PROPERTY,
    Permission.VIEW_FINANCIALS,
    Permission.VIEW_REPORTS,
    Permission.CREATE_REPORTS,
    Permission.EXPORT_DATA,
    Permission.ACCESS_AI_FEATURES
  ],
  [UserRole.AGENT]: [
    Permission.READ_USER,
    Permission.READ_PROPERTY,
    Permission.UPDATE_PROPERTY,
    Permission.VIEW_FINANCIALS,
    Permission.VIEW_REPORTS
  ],
  [UserRole.USER]: [
    Permission.READ_PROPERTY,
    Permission.VIEW_REPORTS
  ],
  [UserRole.VIEWER]: [
    Permission.READ_PROPERTY,
    Permission.VIEW_REPORTS
  ]
};

// User context
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions?: Permission[];
  department?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ 
  children: ReactNode; 
  user: User | null;
}> = ({ children, user }) => {
  const getUserPermissions = (user: User): Permission[] => {
    if (user.permissions) {
      return user.permissions;
    }
    return ROLE_PERMISSIONS[user.role] || [];
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    const userPermissions = getUserPermissions(user);
    return userPermissions.includes(permission);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    const userPermissions = getUserPermissions(user);
    return permissions.some(permission => userPermissions.includes(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false;
    const userPermissions = getUserPermissions(user);
    return permissions.every(permission => userPermissions.includes(permission));
  };

  return (
    <AuthContext.Provider value={{
      user,
      hasPermission,
      hasRole,
      hasAnyPermission,
      hasAllPermissions
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Permission-based components
interface PermissionGateProps {
  permission?: Permission;
  permissions?: Permission[];
  role?: UserRole | UserRole[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  permissions,
  role,
  requireAll = false,
  fallback = null,
  children,
  className
}) => {
  const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions } = useAuth();

  let hasAccess = true;

  // Check role
  if (role && !hasRole(role)) {
    hasAccess = false;
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    hasAccess = false;
  }

  // Check multiple permissions
  if (permissions) {
    if (requireAll) {
      hasAccess = hasAllPermissions(permissions);
    } else {
      hasAccess = hasAnyPermission(permissions);
    }
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
};

// Role-based navigation item
interface RoleNavItemProps {
  permission?: Permission;
  permissions?: Permission[];
  role?: UserRole | UserRole[];
  requireAll?: boolean;
  children: ReactNode;
  className?: string;
}

export const RoleNavItem: React.FC<RoleNavItemProps> = (props) => {
  return <PermissionGate {...props} />;
};

// Conditional rendering hook
export const usePermissions = () => {
  const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions } = useAuth();

  const canAccess = (
    permission?: Permission,
    permissions?: Permission[],
    role?: UserRole | UserRole[],
    requireAll = false
  ): boolean => {
    let hasAccess = true;

    if (role && !hasRole(role)) {
      hasAccess = false;
    }

    if (permission && !hasPermission(permission)) {
      hasAccess = false;
    }

    if (permissions) {
      if (requireAll) {
        hasAccess = hasAllPermissions(permissions);
      } else {
        hasAccess = hasAnyPermission(permissions);
      }
    }

    return hasAccess;
  };

  return {
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    canAccess
  };
};

// Feature flag component
interface FeatureFlagProps {
  feature: string;
  enabled?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const FeatureFlag: React.FC<FeatureFlagProps> = ({
  feature,
  enabled = true,
  fallback = null,
  children,
  className
}) => {
  // In a real app, this would check against a feature flag service
  const isFeatureEnabled = enabled;

  if (!isFeatureEnabled) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
};

// Role-based dashboard layout
interface RoleDashboardProps {
  role: UserRole;
  children: ReactNode;
  className?: string;
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({
  role,
  children,
  className
}) => {
  const getDashboardLayout = (role: UserRole): string => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMIN:
        return 'grid-cols-1 lg:grid-cols-4 gap-6';
      case UserRole.MANAGER:
        return 'grid-cols-1 lg:grid-cols-3 gap-4';
      case UserRole.AGENT:
        return 'grid-cols-1 lg:grid-cols-2 gap-4';
      default:
        return 'grid-cols-1 gap-4';
    }
  };

  return (
    <div className={cn(
      'grid',
      getDashboardLayout(role),
      className
    )}>
      {children}
    </div>
  );
};

// Restricted content wrapper
interface RestrictedContentProps {
  minRole?: UserRole;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  message?: string;
  children: ReactNode;
  className?: string;
}

export const RestrictedContent: React.FC<RestrictedContentProps> = ({
  minRole,
  permission,
  permissions,
  requireAll = false,
  message = 'You do not have permission to view this content.',
  children,
  className
}) => {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  let hasAccess = true;

  // Check minimum role
  if (minRole && user) {
    const roleHierarchy = [
      UserRole.VIEWER,
      UserRole.USER,
      UserRole.AGENT,
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN
    ];
    
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    const minRoleIndex = roleHierarchy.indexOf(minRole);
    
    if (userRoleIndex < minRoleIndex) {
      hasAccess = false;
    }
  }

  // Check permissions
  if (permission && !hasPermission(permission)) {
    hasAccess = false;
  }

  if (permissions) {
    if (requireAll) {
      hasAccess = hasAllPermissions(permissions);
    } else {
      hasAccess = hasAnyPermission(permissions);
    }
  }

  if (!hasAccess) {
    return (
      <div className={cn(
        'flex items-center justify-center p-8 text-center',
        'bg-muted/30 border border-border rounded-lg',
        className
      )}>
        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-xl">🔒</span>
          </div>
          <h3 className="font-medium text-foreground">Access Restricted</h3>
          <p className="text-sm text-muted-foreground max-w-md">{message}</p>
        </div>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

// Role badge component
interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className }) => {
  const getRoleColor = (role: UserRole): string => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case UserRole.MANAGER:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case UserRole.AGENT:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case UserRole.USER:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case UserRole.VIEWER:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleLabel = (role: UserRole): string => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      getRoleColor(role),
      className
    )}>
      {getRoleLabel(role)}
    </span>
  );
}; 