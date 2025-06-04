import React from 'react';

const Topbar = () => (
  <header className="h-16 bg-white border-b flex items-center justify-between px-6">
    <div className="font-semibold text-lg">Dashboard</div>
    <div className="flex items-center gap-4">
      <button className="relative">
        <span className="material-icons">notifications</span>
        {/* Notification badge */}
        <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">U</div>
    </div>
  </header>
);

export default Topbar; 