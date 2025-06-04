import React, { useState } from 'react';
import { deals as mockDeals, customers } from '../data/mockData';
import { DealStage, Deal } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { SalesKanbanView } from '../components/sales/SalesKanbanView';
import { SalesAnalyticsDashboard } from '../components/sales/SalesAnalyticsDashboard';

const SalesPage: React.FC = () => {
  const [deals, setDeals] = useState(mockDeals);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [view, setView] = useState<'kanban' | 'analytics'>('kanban');
  const [form, setForm] = useState({ 
    name: '', 
    customerId: '', 
    amount: 0, 
    stage: DealStage.QUALIFICATION,
    probability: 50
  });

  const openAdd = () => { 
    setEditing(null); 
    setForm({ 
      name: '', 
      customerId: '', 
      amount: 0, 
      stage: DealStage.QUALIFICATION,
      probability: 50
    }); 
    setShowModal(true); 
  };
  
  const openEdit = (deal: Deal) => { 
    setEditing(deal); 
    setForm({
      name: deal.name,
      customerId: deal.customerId,
      amount: deal.amount,
      stage: deal.stage,
      probability: deal.probability
    }); 
    setShowModal(true); 
  };
  
  const closeModal = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setDeals(deals.map(d => d.id === editing.id ? { 
        ...editing, 
        ...form,
        updatedAt: new Date()
      } : d));
    } else {
      const newDeal: Deal = { 
        ...form, 
        id: Date.now().toString(), 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      setDeals([...deals, newDeal]);
    }
    closeModal();
  };
  
  const deleteDeal = (id: string) => setDeals(deals.filter(d => d.id !== id));

  const handleDealMove = (dealId: string, newStage: DealStage) => {
    setDeals(deals.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
  };

  const getStageColor = (stage: DealStage) => {
    switch (stage) {
      case DealStage.QUALIFICATION: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case DealStage.PROPOSAL: return 'bg-blue-100 text-blue-800 border-blue-200';
      case DealStage.NEGOTIATION: return 'bg-orange-100 text-orange-800 border-orange-200';
      case DealStage.CLOSED_WON: return 'bg-green-100 text-green-800 border-green-200';
      case DealStage.CLOSED_LOST: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Sales Management
            </h1>
            <p className="text-gray-600 font-medium">Manage your deals and track sales performance</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setView('kanban')}
                className={`px-4 py-2 text-sm font-medium ${
                  view === 'kanban' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Pipeline
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`px-4 py-2 text-sm font-medium ${
                  view === 'analytics' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Analytics
              </button>
            </div>
            <Button 
              onClick={openAdd}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Deal
              </span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Deals</p>
                  <p className="text-3xl font-bold">{deals.length}</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Won Deals</p>
                  <p className="text-3xl font-bold">{deals.filter(d => d.stage === DealStage.CLOSED_WON).length}</p>
                </div>
                <div className="bg-green-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Value</p>
                  <p className="text-3xl font-bold">${deals.reduce((sum, deal) => sum + deal.amount, 0).toLocaleString()}</p>
                </div>
                <div className="bg-purple-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold">{deals.filter(d => ![DealStage.CLOSED_WON, DealStage.CLOSED_LOST].includes(d.stage)).length}</p>
                </div>
                <div className="bg-orange-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8">
        {view === 'kanban' ? (
          <SalesKanbanView 
            deals={deals}
            onDealMove={handleDealMove}
            onDealClick={openEdit}
          />
        ) : (
          <SalesAnalyticsDashboard deals={deals} />
        )}
      </div>

      {/* Add/Edit Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-2xl font-bold mb-6">{editing ? 'Edit Deal' : 'Add New Deal'}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name</label>
                  <Input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter deal name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select
                    value={form.customerId}
                    onChange={e => setForm({ ...form, customerId: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <Input
                    type="number"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
                    placeholder="Enter deal amount"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select
                    value={form.stage}
                    onChange={e => setForm({ ...form, stage: e.target.value as DealStage })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    required
                  >
                    {Object.values(DealStage).map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probability (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={form.probability}
                    onChange={e => setForm({ ...form, probability: Number(e.target.value) })}
                    placeholder="Enter win probability"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                >
                  {editing ? 'Update Deal' : 'Create Deal'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SalesPage; 
