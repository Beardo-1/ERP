import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ShoppingCart, Package, Calendar, 
  BarChart3, Settings, HelpCircle, Menu, X, ChevronDown, LogOut,
  Home, FileText, DollarSign, Megaphone, Folder
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../ui/Avatar';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  expanded: boolean;
  active: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  to, 
  expanded, 
  active,
  hasSubmenu = false,
  onClick 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
    <Link
      to={to}
      className={`
          flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-200 group
        ${active 
            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg' 
            : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}
      `}
      onClick={onClick}
    >
        <span className={`text-lg ${active ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>{icon}</span>
      {expanded && (
          <motion.span 
            className="ml-3 font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {label}
          </motion.span>
      )}
      {expanded && hasSubmenu && (
        <ChevronDown className="ml-auto h-4 w-4" />
      )}
    </Link>
    </motion.div>
  );
};

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <motion.div
      className={`
        h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 border-r border-blue-700/50 flex flex-col fixed left-0 top-0 z-30 shadow-2xl
        ${expanded ? 'w-64' : 'w-16'}
        transition-all duration-300 ease-in-out backdrop-blur-xl
        ${className}
      `}
      initial={{ width: expanded ? 256 : 64 }}
      animate={{ width: expanded ? 256 : 64 }}
      style={{
        background: 'linear-gradient(180deg, #1e3a8a 0%, #2563eb 50%, #1e40af 100%)',
        backdropFilter: 'blur(24px)',
        boxShadow: '8px 0 32px rgba(59, 130, 246, 0.15), inset -1px 0 0 rgba(255, 255, 255, 0.08)',
        borderRight: '2px solid rgba(59, 130, 246, 0.15)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700/50 bg-slate-800/50">
        {expanded ? (
          <motion.h1 
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Nexus ERP
          </motion.h1>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
            N
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(148, 163, 184, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
        >
          {expanded ? <X size={18} /> : <Menu size={18} />}
        </motion.button>
      </div>
      
      <div className="flex-grow overflow-y-auto py-4 px-3 space-y-2">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          to="/"
          expanded={expanded}
          active={isActive('/')}
        />
        
        <SidebarItem
          icon={<Users size={20} />}
          label="Customers"
          to="/customers"
          expanded={expanded}
          active={isActive('/customers')}
        />
        
        <SidebarItem
          icon={<ShoppingCart size={20} />}
          label="Sales"
          to="/sales"
          expanded={expanded}
          active={isActive('/sales')}
          hasSubmenu
        />
        
        <SidebarItem
          icon={<Package size={20} />}
          label="Products"
          to="/products"
          expanded={expanded}
          active={isActive('/products')}
        />
        
        <SidebarItem
          icon={<Calendar size={20} />}
          label="Projects"
          to="/projects"
          expanded={expanded}
          active={isActive('/projects')}
        />
        
        <SidebarItem
          icon={<BarChart3 size={20} />}
          label="Reports"
          to="/reports"
          expanded={expanded}
          active={isActive('/reports')}
        />
        
        <SidebarItem
          icon={<Home size={20} />}
          label="Properties"
          to="/properties"
          expanded={expanded}
          active={isActive('/properties')}
        />
        
        <SidebarItem
          icon={<FileText size={20} />}
          label="Leases"
          to="/leases"
          expanded={expanded}
          active={isActive('/leases')}
        />
        
        <SidebarItem
          icon={<DollarSign size={20} />}
          label="Finance"
          to="/finance"
          expanded={expanded}
          active={isActive('/finance')}
        />
        
        <SidebarItem
          icon={<Megaphone size={20} />}
          label="Marketing"
          to="/marketing"
          expanded={expanded}
          active={isActive('/marketing')}
        />
        
        <SidebarItem
          icon={<Folder size={20} />}
          label="Documents"
          to="/documents"
          expanded={expanded}
          active={isActive('/documents')}
        />
      </div>
      
      <div className="py-2 px-2">
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          to="/settings"
          expanded={expanded}
          active={isActive('/settings')}
        />
        
        <SidebarItem
          icon={<HelpCircle size={20} />}
          label="Help & Support"
          to="/help"
          expanded={expanded}
          active={isActive('/help')}
        />
      </div>
      
      <div className="mt-auto border-t border-slate-700/50 p-4">
        {expanded ? (
          <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
              <Avatar
                src={user?.avatar}
                name={`${user?.firstName} ${user?.lastName}`}
                size="sm"
                status="online"
              />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-slate-800 rounded-full"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-slate-400">{user?.role}</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => logout()}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        ) : (
          <div className="flex justify-center bg-slate-800/50 rounded-xl p-2">
            <button onClick={() => setExpanded(true)} className="relative">
            <Avatar
              src={user?.avatar}
              name={`${user?.firstName} ${user?.lastName}`}
              size="sm"
              status="online"
              className="cursor-pointer"
            />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-slate-800 rounded-full"></div>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};