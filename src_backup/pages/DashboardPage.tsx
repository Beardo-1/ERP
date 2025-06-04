import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import SalesModule from '../components/dashboard/modules/SalesModule';

export const DashboardPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState('sales');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto">
          {activeModule === 'sales' && <SalesModule />}
          {/* Add more modules here as you implement them */}
        </main>
      </div>
    </div>
  );
};