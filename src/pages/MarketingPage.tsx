import React, { useState } from 'react';
import { customers } from '../data/mockData';
import { CampaignStatus } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '../components/ui/card';

// Define Campaign interface locally since it's not exported from types
interface Campaign {
  id: string;
  name: string;
  type: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  reach: number;
  clicks: number;
  conversions: number;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mock campaigns data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Property Sale',
    type: 'Email',
    status: CampaignStatus.ACTIVE,
    budget: 5000,
    spent: 3200,
    reach: 15000,
    clicks: 850,
    conversions: 42,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-07-10')
  },
  {
    id: '2',
    name: 'New Development Launch',
    type: 'Social Media',
    status: CampaignStatus.PLANNED,
    budget: 8000,
    spent: 0,
    reach: 0,
    clicks: 0,
    conversions: 0,
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-11-30'),
    createdAt: new Date('2024-07-20'),
    updatedAt: new Date('2024-07-20')
  }
];

const MarketingPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [form, setForm] = useState({ 
    name: '', 
    type: '', 
    status: CampaignStatus.PLANNED,
    budget: 0,
    startDate: '',
    endDate: ''
  });

  const openAdd = () => { 
    setEditing(null); 
    setForm({ 
      name: '', 
      type: '', 
      status: CampaignStatus.PLANNED,
      budget: 0,
      startDate: '',
      endDate: ''
    }); 
    setShowModal(true); 
  };
  
  const openEdit = (campaign: Campaign) => { 
    setEditing(campaign); 
    setForm({
      name: campaign.name,
      type: campaign.type,
      status: campaign.status,
      budget: campaign.budget,
      startDate: campaign.startDate.toISOString().split('T')[0],
      endDate: campaign.endDate ? campaign.endDate.toISOString().split('T')[0] : ''
    }); 
    setShowModal(true); 
  };
  
  const closeModal = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setCampaigns(campaigns.map(c => c.id === editing.id ? { 
        ...editing, 
        ...form,
        startDate: new Date(form.startDate),
        endDate: form.endDate ? new Date(form.endDate) : undefined,
        updatedAt: new Date()
      } : c));
    } else {
      const newCampaign: Campaign = { 
        ...form, 
        id: Date.now().toString(),
        spent: 0,
        reach: 0,
        clicks: 0,
        conversions: 0,
        startDate: new Date(form.startDate),
        endDate: form.endDate ? new Date(form.endDate) : undefined,
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      setCampaigns([...campaigns, newCampaign]);
    }
    closeModal();
  };
  
  const deleteCampaign = (id: string) => setCampaigns(campaigns.filter(c => c.id !== id));

  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  const periods = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' },
  ];

  const campaigns = [
    {
      id: '1',
      name: 'Summer Property Showcase',
      type: 'Email Campaign',
      status: 'Active',
      budget: 5000,
      spent: 3200,
      leads: 145,
      conversions: 23,
      roi: 340,
      startDate: '2024-01-15',
      endDate: '2024-02-15'
    },
    {
      id: '2',
      name: 'Social Media Boost',
      type: 'Social Media',
      status: 'Completed',
      budget: 3000,
      spent: 2800,
      leads: 89,
      conversions: 12,
      roi: 180,
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: '3',
      name: 'Google Ads - Luxury Homes',
      type: 'PPC',
      status: 'Active',
      budget: 8000,
      spent: 4500,
      leads: 234,
      conversions: 45,
      roi: 520,
      startDate: '2024-01-10',
      endDate: '2024-03-10'
    },
    {
      id: '4',
      name: 'Local Print Advertising',
      type: 'Print',
      status: 'Planned',
      budget: 2000,
      spent: 0,
      leads: 0,
      conversions: 0,
      roi: 0,
      startDate: '2024-02-01',
      endDate: '2024-02-28'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Planned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Paused': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email Campaign':
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
      case 'Social Media':
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2m-5 3v6m0 0v6m0-6h6m-6 0H7" /></svg>;
      case 'PPC':
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>;
      case 'Print':
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>;
      default:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
    }
  };

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalLeads = campaigns.reduce((sum, campaign) => sum + campaign.leads, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const averageROI = campaigns.length > 0 ? campaigns.reduce((sum, campaign) => sum + campaign.roi, 0) / campaigns.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Marketing Campaigns
            </h1>
            <p className="text-gray-600 font-medium">Manage and track your marketing campaigns and performance</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics Report
              </span>
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Campaign
              </span>
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Period:</span>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
            >
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Campaign:</span>
            <select 
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
            >
              <option value="all">All Campaigns</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Marketing Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Budget</p>
                <p className="text-3xl font-bold">${totalBudget.toLocaleString()}</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Spent</p>
                <p className="text-3xl font-bold">${totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-red-400 bg-opacity-30 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold">{totalLeads.toLocaleString()}</p>
              </div>
              <div className="bg-green-400 bg-opacity-30 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Conversions</p>
                <p className="text-3xl font-bold">{totalConversions}</p>
              </div>
              <div className="bg-purple-400 bg-opacity-30 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Avg. ROI</p>
                <p className="text-3xl font-bold">{averageROI.toFixed(0)}%</p>
              </div>
              <div className="bg-orange-400 bg-opacity-30 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <div className="p-6">
              {/* Campaign Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {campaign.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-blue-600">
                      {getTypeIcon(campaign.type)}
                    </div>
                    <span className="text-sm text-gray-500">{campaign.type}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Campaign Status */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>

              {/* Budget Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Budget Usage</span>
                  <span className="text-sm text-gray-500">
                    ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Campaign Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{campaign.leads}</div>
                  <div className="text-xs text-gray-600">Leads</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{campaign.conversions}</div>
                  <div className="text-xs text-gray-600">Conversions</div>
                </div>
              </div>

              {/* ROI */}
              <div className="mb-4">
                <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{campaign.roi}%</div>
                  <div className="text-sm text-gray-600">Return on Investment</div>
                </div>
              </div>

              {/* Campaign Dates */}
              <div className="text-sm text-gray-500 mb-4">
                <div>Start: {new Date(campaign.startDate).toLocaleDateString()}</div>
                <div>End: {new Date(campaign.endDate).toLocaleDateString()}</div>
              </div>

              {/* Campaign Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button
                  onClick={() => openEdit(campaign)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteCampaign(campaign.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketingPage; 
