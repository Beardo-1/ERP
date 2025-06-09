import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import SalesModule from '../components/dashboard/modules/SalesModule';

// Import all the new modules we'll create
const DashboardModule = React.lazy(() => import('../components/dashboard/modules/DashboardModule'));
const InventoryModule = React.lazy(() => import('../components/dashboard/modules/InventoryModule'));
const WorkflowModule = React.lazy(() => import('../components/dashboard/modules/WorkflowModule'));

const DashboardPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    const moduleProps = { key: activeModule };
    
    switch (activeModule) {
      case 'dashboard':
        return <React.Suspense fallback={<ModuleLoader />}><DashboardModule {...moduleProps} /></React.Suspense>;
      case 'sales':
        return <SalesModule />;
      case 'inventory':
        return <React.Suspense fallback={<ModuleLoader />}><InventoryModule {...moduleProps} /></React.Suspense>;
      case 'workflow':
        return <React.Suspense fallback={<ModuleLoader />}><WorkflowModule {...moduleProps} /></React.Suspense>;
      default:
        return (
          <div className="p-6 text-center text-gray-500">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Module Coming Soon</h3>
            <p>This module is currently under development and will be available soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

// Loading component for modules
const ModuleLoader: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading module...</span>
  </div>
);

export default DashboardPage; 