import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Menu, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface TopBarProps {
  onMenuClick: () => void;
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick, title }) => {
  const { user } = useAuthStore();
  
  return (
    <motion.div 
      className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        {title && (
          <h1 className="text-xl font-semibold text-neutral-800 ml-2">{title}</h1>
        )}
      </div>
      
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="search"
            placeholder="Search..."
            className="input pl-10 bg-neutral-50 border-neutral-200"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 relative">
          <MessageSquare size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-500"></span>
        </button>
        
        <button className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-error-500"></span>
        </button>
        
        <div className="ml-2 hidden md:block">
          <p className="text-sm font-medium text-neutral-800">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-neutral-500">{user?.role}</p>
        </div>
      </div>
    </motion.div>
  );
};