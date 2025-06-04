import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCustomerStore } from '../store/customerStore';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Users, BarChart2, TrendingUp, Mail, Phone, Star, ShieldCheck, Activity, Calendar, Layers, Zap, MapPin, Home, Building, Plus, MoreVertical } from 'lucide-react';

const TABS = [
  { key: 'Overview', icon: Star },
  { key: 'Properties', icon: Building },
  { key: 'Deals', icon: BarChart2 },
  { key: 'Documents', icon: Layers },
  { key: 'Activity', icon: Activity },
  { key: 'Compliance', icon: ShieldCheck },
  { key: 'AI', icon: Zap },
  { key: 'Map', icon: MapPin },
];

const statusColors = {
  lead: 'bg-blue-100 text-blue-800',
  prospect: 'bg-yellow-100 text-yellow-800',
  customer: 'bg-green-100 text-green-800',
  inactive: 'bg-neutral-200 text-neutral-600',
};

const mockSaudiFields = {
  nationalId: '1029384756',
  nationality: 'Saudi',
  kycStatus: 'Verified',
  iqamaExpiry: '2026-05-01',
  preferredLanguage: 'Arabic',
  vip: true,
};

const mockProperties = [
  { id: 'p1', title: 'Palm Jumeirah Villa', type: 'Residential', city: 'Riyadh', price: 'SAR 4,200,000' },
  { id: 'p2', title: 'Kingdom Tower Office', type: 'Commercial', city: 'Jeddah', price: 'SAR 2,800,000' },
];

// Mock deals for demo
const mockDeals = [
  { id: 'd1', name: 'Luxury Villa Sale', amount: 'SAR 3,500,000', stage: 'Closed Won', agent: 'Sarah Al-Fahad', agentAvatar: '', date: '2024-05-10' },
  { id: 'd2', name: 'Office Lease', amount: 'SAR 800,000', stage: 'Negotiation', agent: 'Mohammed Al-Saud', agentAvatar: '', date: '2024-04-22' },
];
// Mock documents for demo
const mockDocuments = [
  { id: 'doc1', name: 'Sale Contract - Villa', type: 'Contract', uploadedBy: 'Sarah Al-Fahad', uploadedAt: '2024-05-11' },
  { id: 'doc2', name: 'Iqama Copy', type: 'ID', uploadedBy: 'Admin', uploadedAt: '2024-04-15' },
];
// Mock activity for demo
const mockActivity = [
  { id: 'a1', type: 'note', user: 'Sarah Al-Fahad', avatar: '', content: 'Called client to discuss villa sale.', date: '2024-05-10' },
  { id: 'a2', type: 'email', user: 'Mohammed Al-Saud', avatar: '', content: 'Sent lease agreement for review.', date: '2024-04-22' },
];

const CustomerProfilePage: React.FC = () => {
  const { id } = useParams();
  const { customers } = useCustomerStore();
  const customer = customers.find(c => c.id === id);
  const [tab, setTab] = useState(TABS[0].key);

  if (!customer) {
    return <div className="p-8 text-center text-neutral-400">Customer not found.</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-amber-50 relative">
      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 z-50 p-5 rounded-full bg-gradient-to-tr from-blue-600 to-amber-400 shadow-xl hover:scale-105 transition-transform group">
        <Plus className="text-white group-hover:rotate-90 transition-transform" size={28} />
      </button>
      {/* Header - edge-to-edge, glassy, interactive */}
      <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-8 px-0 md:px-12 pt-12 pb-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="relative group">
            <Avatar className="h-20 w-20 shadow-xl border-4 border-white/80 group-hover:scale-105 transition-transform duration-200">
              <AvatarFallback className="bg-gradient-to-tr from-blue-400 to-blue-600 text-white text-2xl font-bold">
                {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold shadow ${statusColors[customer.status]} border border-white/60`}>{customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}</span>
            {/* Camera icon overlay for future change picture */}
            <span className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow group-hover:bg-blue-100 transition-colors cursor-pointer" title="Change picture">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 17a5 5 0 100-10 5 5 0 000 10z" stroke="#2563eb" strokeWidth="2"/><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" stroke="#2563eb" strokeWidth="2"/><path d="M16 7V5a2 2 0 00-2-2H10a2 2 0 00-2 2v2" stroke="#2563eb" strokeWidth="2"/></svg>
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
          <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight flex items-center gap-3">
            {customer.name}
            <span className="ml-2 px-2 py-1 rounded bg-gradient-to-r from-blue-100 to-amber-100 text-xs font-semibold text-blue-700">VIP</span>
          </div>
          <div className="text-neutral-500 text-lg">{customer.email}</div>
          <div className="text-neutral-500 text-lg">{customer.phone}</div>
          <div className="flex gap-3 mt-4">
            <button className="p-3 rounded-full bg-white/80 hover:bg-blue-100 shadow transition-all" aria-label="Email"><Mail className="text-blue-600" size={22} /></button>
            <button className="p-3 rounded-full bg-white/80 hover:bg-amber-100 shadow transition-all" aria-label="Call"><Phone className="text-amber-600" size={22} /></button>
          </div>
        </div>
        <div className="flex flex-col gap-4 min-w-[140px] items-end">
          <div className="flex flex-col items-end">
            <span className="text-xs text-neutral-400">Deals</span>
            <span className="text-2xl font-bold text-blue-700">7</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-neutral-400">Properties</span>
            <span className="text-2xl font-bold text-amber-600">{mockProperties.length}</span>
          </div>
        </div>
      </div>
      {/* Tabs - edge-to-edge, glassy, interactive */}
      <div className="w-full flex gap-2 px-0 md:px-12 mb-8 overflow-x-auto pb-2 sticky top-0 z-20 bg-gradient-to-r from-white/90 to-blue-50/80 backdrop-blur-md border-b border-blue-100">
        {TABS.map(({ key, icon: Icon }) => (
          <button
            key={key}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 border-0 shadow-none ${tab === key ? 'bg-gradient-to-tr from-blue-600 to-amber-400 text-white scale-105 shadow-lg' : 'text-blue-700 hover:bg-blue-50 hover:scale-105'}`}
            onClick={() => setTab(key)}
            aria-label={key}
          >
            <Icon size={20} />
            <span className="hidden sm:inline">{key}</span>
          </button>
        ))}
      </div>
      {/* Content - glassy, advanced card */}
      <div className="w-full px-0 md:px-12 flex justify-center">
        <div className="w-full max-w-5xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 min-h-[300px] animate-fade-in border border-blue-100">
          {tab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="mb-2 text-neutral-500 text-xs">National ID</div>
                <div className="font-extrabold text-xl mb-6 tracking-wide text-neutral-900">{mockSaudiFields.nationalId}</div>
                <div className="mb-2 text-neutral-500 text-xs">Nationality</div>
                <div className="font-extrabold text-xl mb-6 tracking-wide text-neutral-900">{mockSaudiFields.nationality}</div>
                <div className="mb-2 text-neutral-500 text-xs">Preferred Language</div>
                <div className="font-extrabold text-xl mb-6 tracking-wide text-neutral-900">{mockSaudiFields.preferredLanguage}</div>
              </div>
              <div>
                <div className="mb-2 text-neutral-500 text-xs">Created</div>
                <div className="font-extrabold text-xl mb-6 tracking-wide text-neutral-900">{customer.createdAt.toLocaleDateString()}</div>
                <div className="mb-2 text-neutral-500 text-xs">Updated</div>
                <div className="font-extrabold text-xl mb-6 tracking-wide text-neutral-900">{customer.updatedAt.toLocaleDateString()}</div>
                <div className="mb-2 text-neutral-500 text-xs">VIP</div>
                <div className="font-extrabold text-xl text-yellow-600 mb-6">{mockSaudiFields.vip ? 'Yes' : 'No'}</div>
              </div>
            </div>
          )}
          {tab === 'Properties' && (
            <div>
              <div className="mb-4 text-neutral-400 text-xs">Properties</div>
              <div className="flex flex-col gap-4">
                {mockProperties.map((prop) => (
                  <div key={prop.id} className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-amber-50 hover:shadow-xl transition-all group border border-blue-100 cursor-pointer">
                    <Avatar className="h-12 w-12 shadow border-2 border-blue-100 group-hover:scale-110 transition-transform bg-white">
                      <AvatarFallback>{prop.title.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg text-neutral-900 truncate mb-1">{prop.title}</div>
                      <div className="text-sm text-neutral-500">{prop.city} • {prop.price}</div>
                    </div>
                    <button className="p-2 rounded-full hover:bg-blue-100 transition-colors"><MoreVertical className="text-blue-400 group-hover:text-blue-700" size={20} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'Deals' && (
            <div>
              <div className="mb-4 text-neutral-400 text-xs">Deals</div>
              <div className="flex flex-col gap-4">
                {mockDeals.map((deal) => (
                  <div key={deal.id} className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-white hover:shadow-xl transition-all group border border-blue-100 cursor-pointer">
                    <Avatar className="h-12 w-12 shadow border-2 border-blue-100 group-hover:scale-110 transition-transform bg-white">
                      <AvatarFallback>{deal.agent.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg text-neutral-900 truncate mb-1">{deal.name}</div>
                      <div className="text-sm text-neutral-500">{deal.stage} • {deal.date}</div>
                      <div className="text-sm text-blue-700 font-semibold">{deal.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'Documents' && (
            <div>
              <div className="mb-4 text-neutral-400 text-xs">Documents</div>
              <div className="flex flex-col gap-4">
                {mockDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-white hover:shadow-xl transition-all group border border-blue-100 cursor-pointer">
                    <Avatar className="h-12 w-12 shadow border-2 border-blue-100 group-hover:scale-110 transition-transform bg-white">
                      <AvatarFallback>{doc.uploadedBy.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg text-neutral-900 truncate mb-1">{doc.name}</div>
                      <div className="text-sm text-neutral-500">{doc.type} • {doc.uploadedAt}</div>
                      <div className="text-sm text-blue-700 font-semibold">{doc.uploadedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'Activity' && (
            <div>
              <div className="mb-4 text-neutral-400 text-xs">Activity</div>
              <div className="flex flex-col gap-4">
                {mockActivity.map((act) => (
                  <div key={act.id} className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-white hover:shadow-xl transition-all group border border-blue-100 cursor-pointer">
                    <Avatar className="h-12 w-12 shadow border-2 border-blue-100 group-hover:scale-110 transition-transform bg-white">
                      <AvatarFallback>{act.user.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg text-neutral-900 truncate mb-1">{act.user}</div>
                      <div className="text-sm text-neutral-500">{act.type} • {act.date}</div>
                      <div className="text-sm text-blue-700 font-semibold">{act.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'Compliance' && (
            <div className="text-neutral-400">(Compliance section: Minimalist stub)</div>
          )}
          {tab === 'AI' && (
            <div className="text-neutral-400">(AI Insights section: Minimalist stub)</div>
          )}
          {tab === 'Map' && (
            <div className="text-neutral-400">(Map section: Minimalist stub)</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage; 
