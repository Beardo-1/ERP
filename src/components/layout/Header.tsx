import React, { useState } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';

interface HeaderProps {
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  const { user } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900/80 backdrop-blur-xl border-b border-blue-700/30 px-6 py-4 shadow-2xl sticky top-0 z-20" style={{
      background: 'linear-gradient(120deg, rgba(59,130,246,0.8) 0%, rgba(67,56,202,0.7) 100%)',
      boxShadow: '0 8px 32px rgba(59,130,246,0.15), 0 1.5px 0 rgba(255,255,255,0.08)',
      backdropFilter: 'blur(24px)',
      borderBottom: '2px solid rgba(59,130,246,0.15)',
      transformStyle: 'preserve-3d',
    }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden mr-3 text-neutral-600 p-2 rounded-xl hover:bg-neutral-100"
          >
            <Menu size={24} />
          </motion.button>
          <div className="hidden md:flex">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-3 w-80 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 text-neutral-800 shadow-sm hover:shadow-md transition-all duration-200"
                />
                <Search className="absolute left-3 top-3.5 text-neutral-400" size={18} />
              </motion.div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Language Toggle Stub */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-blue-100 text-sm font-medium transition-all duration-200 hover:shadow-md"
          >
            العربية / English
          </motion.button>
          {/* Mobile Preview Stub */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-green-100 text-sm font-medium transition-all duration-200 hover:shadow-md"
          >
            Mobile Preview
          </motion.button>
        </div>
        {children}
        <div className="relative">
          <button 
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} className="text-neutral-600" />
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 z-10">
              <div className="p-3 border-b border-neutral-200">
                <h3 className="font-medium text-neutral-800">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-neutral-200 hover:bg-neutral-50">
                  <p className="text-sm text-neutral-800">New lease agreement ready for review</p>
                  <p className="text-xs text-neutral-500 mt-1">10 minutes ago</p>
                </div>
                <div className="p-3 border-b border-neutral-200 hover:bg-neutral-50">
                  <p className="text-sm text-neutral-800">Property inspection scheduled for tomorrow</p>
                  <p className="text-xs text-neutral-500 mt-1">2 hours ago</p>
                </div>
                <div className="p-3 hover:bg-neutral-50">
                  <p className="text-sm text-neutral-800">Payment received from tenant #1082</p>
                  <p className="text-xs text-neutral-500 mt-1">Yesterday at 3:45 PM</p>
                </div>
              </div>
              <div className="p-2 border-t border-neutral-200">
                <Link to="/notifications" className="text-primary-600 text-sm block text-center py-1 hover:underline">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button 
            className="flex items-center space-x-2 hover:bg-neutral-100 rounded-full transition-colors"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                <User size={16} className="text-primary-700" />
              )}
            </div>
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-10">
              <div className="p-3 border-b border-neutral-200">
                <p className="font-medium text-neutral-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
              </div>
              <div>
                <Link to="/profile" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                  Your Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                  Settings
                </Link>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-50 border-t border-neutral-200">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}; 