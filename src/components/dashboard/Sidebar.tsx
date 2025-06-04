import React from 'react';

const modules = [
  { key: 'sales', label: 'Sales' },
  // Add more modules here
];

const Sidebar = ({ activeModule, setActiveModule }: { activeModule: string; setActiveModule: (key: string) => void }) => (
  <aside className="w-64 bg-white border-r flex flex-col">
    <div className="h-16 flex items-center justify-center font-bold text-xl border-b">ERP Dashboard</div>
    <nav className="flex-1 p-4">
      {modules.map((mod) => (
        <button
          key={mod.key}
          className={`w-full text-left px-4 py-2 rounded mb-2 transition-colors ${activeModule === mod.key ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}
          onClick={() => setActiveModule(mod.key)}
        >
          {mod.label}
        </button>
      ))}
    </nav>
  </aside>
);

export default Sidebar; 