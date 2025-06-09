import React from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  FileText, 
  Package, 
  ShoppingCart, 
  Calendar, 
  BarChart3, 
  Settings, 
  UserCheck, 
  Truck, 
  Factory, 
  Headphones, 
  CreditCard, 
  Target, 
  Briefcase,
  ClipboardList,
  Warehouse,
  Shield,
  Mail
} from 'lucide-react';

const modules = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { key: 'sales', label: 'Sales & CRM', icon: DollarSign },
  { key: 'customers', label: 'Customer Management', icon: Users },
  { key: 'projects', label: 'Project Management', icon: Briefcase },
  { key: 'finance', label: 'Financial Management', icon: CreditCard },
  { key: 'accounting', label: 'Accounting', icon: FileText },
  { key: 'inventory', label: 'Inventory Management', icon: Package },
  { key: 'procurement', label: 'Procurement & Purchasing', icon: ShoppingCart },
  { key: 'warehouse', label: 'Warehouse Management', icon: Warehouse },
  { key: 'manufacturing', label: 'Manufacturing (MRP)', icon: Factory },
  { key: 'hr', label: 'Human Resources', icon: UserCheck },
  { key: 'helpdesk', label: 'Helpdesk & Support', icon: Headphones },
  { key: 'marketing', label: 'Marketing Automation', icon: Mail },
  { key: 'quality', label: 'Quality Management', icon: Shield },
  { key: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { key: 'workflow', label: 'Workflow Automation', icon: Target },
  { key: 'logistics', label: 'Logistics & Shipping', icon: Truck },
  { key: 'compliance', label: 'Compliance Management', icon: ClipboardList },
  { key: 'properties', label: 'Property Management', icon: Building2 },
  { key: 'calendar', label: 'Calendar & Scheduling', icon: Calendar },
  { key: 'settings', label: 'Settings', icon: Settings }
];

const Sidebar = ({ activeModule, setActiveModule }: { activeModule: string; setActiveModule: (key: string) => void }) => (
  <aside className="w-64 bg-white border-r flex flex-col h-full overflow-y-auto">
    <div className="h-16 flex items-center justify-center font-bold text-xl border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      Enterprise ERP
    </div>
    <nav className="flex-1 p-4">
      <div className="space-y-1">
        {modules.map((mod) => {
          const IconComponent = mod.icon;
          return (
            <button
              key={mod.key}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-all duration-200 flex items-center gap-3 text-sm ${
                activeModule === mod.key 
                  ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setActiveModule(mod.key)}
            >
              <IconComponent className="w-4 h-4" />
              {mod.label}
            </button>
          );
        })}
      </div>
    </nav>
  </aside>
);

export default Sidebar; 