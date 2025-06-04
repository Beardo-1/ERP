import React, { useState } from 'react';
import { leases as mockLeases, properties, users } from '../data/mockData';
import { LeaseStatus, Lease } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const LeasePage: React.FC = () => {
  const [leases, setLeases] = useState(mockLeases);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Lease | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [form, setForm] = useState({ 
    propertyId: '', 
    tenantId: '', 
    startDate: '',
    endDate: '',
    rentAmount: 0,
    depositAmount: 0,
    status: LeaseStatus.PENDING
  });

  const openAdd = () => { 
    setEditing(null); 
    setForm({ 
      propertyId: '', 
      tenantId: '', 
      startDate: '',
      endDate: '',
      rentAmount: 0,
      depositAmount: 0,
      status: LeaseStatus.PENDING
    }); 
    setShowModal(true); 
  };
  
  const openEdit = (lease: Lease) => { 
    setEditing(lease); 
    setForm({
      propertyId: lease.propertyId,
      tenantId: lease.tenantId,
      startDate: lease.startDate.toISOString().split('T')[0],
      endDate: lease.endDate ? lease.endDate.toISOString().split('T')[0] : '',
      rentAmount: lease.rentAmount,
      depositAmount: lease.depositAmount || 0,
      status: lease.status
    }); 
    setShowModal(true); 
  };
  
  const closeModal = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setLeases(leases.map(l => l.id === editing.id ? { 
        ...editing, 
        ...form,
        startDate: new Date(form.startDate),
        endDate: form.endDate ? new Date(form.endDate) : undefined,
        updatedAt: new Date()
      } : l));
    } else {
      const newLease: Lease = { 
        ...form, 
        id: Date.now().toString(),
        startDate: new Date(form.startDate),
        endDate: form.endDate ? new Date(form.endDate) : undefined,
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      setLeases([...leases, newLease]);
    }
    closeModal();
  };
  
  const deleteLease = (id: string) => setLeases(leases.filter(l => l.id !== id));

  const getStatusColor = (status: LeaseStatus) => {
    switch (status) {
      case LeaseStatus.ACTIVE: return 'bg-green-100 text-green-800 border-green-200';
      case LeaseStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case LeaseStatus.EXPIRED: return 'bg-red-100 text-red-800 border-red-200';
      case LeaseStatus.TERMINATED: return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: LeaseStatus) => {
    switch (status) {
      case LeaseStatus.ACTIVE:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
      case LeaseStatus.PENDING:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case LeaseStatus.EXPIRED:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
      case LeaseStatus.TERMINATED:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      default:
        return null;
    }
  };

  const filteredLeases = selectedStatus === 'all' 
    ? leases 
    : leases.filter(lease => lease.status === selectedStatus);

  const activeCount = leases.filter(l => l.status === LeaseStatus.ACTIVE).length;
  const pendingCount = leases.filter(l => l.status === LeaseStatus.PENDING).length;
  const expiredCount = leases.filter(l => l.status === LeaseStatus.EXPIRED).length;
  const totalRentValue = leases
    .filter(l => l.status === LeaseStatus.ACTIVE)
    .reduce((sum, lease) => sum + lease.rentAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Lease Management
            </h1>
            <p className="text-gray-600 font-medium">Manage property leases and tenant agreements</p>
          </div>
          <Button 
            onClick={openAdd}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Lease
            </span>
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
            >
              <option value="all">All Status</option>
              {Object.values(LeaseStatus).map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Leases</p>
                  <p className="text-3xl font-bold">{leases.length}</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Leases</p>
                  <p className="text-3xl font-bold">{activeCount}</p>
                </div>
                <div className="bg-green-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold">{pendingCount}</p>
                </div>
                <div className="bg-yellow-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
    <div>
                  <p className="text-purple-100 text-sm font-medium">Monthly Rent</p>
                  <p className="text-3xl font-bold">${totalRentValue.toLocaleString()}</p>
                </div>
                <div className="bg-purple-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Leases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLeases.map((lease) => {
          const property = properties.find(p => p.id === lease.propertyId);
          const tenant = users.find(u => u.id === lease.tenantId);
          
          return (
            <Card 
              key={lease.id} 
              className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
            >
              <div className="p-6">
                {/* Lease Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {property?.title || 'Unknown Property'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Tenant: {tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown Tenant'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openEdit(lease)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => deleteLease(lease.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Rent Amount */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    ${lease.rentAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Monthly Rent
                  </div>
                </div>

                {/* Lease Status */}
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lease.status)}`}>
                    {getStatusIcon(lease.status)}
                    {lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
                  </span>
                </div>

                {/* Lease Details */}
                <div className="mb-4 space-y-1">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Start:</span> {lease.startDate.toLocaleDateString()}
                  </div>
                  {lease.endDate && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">End:</span> {lease.endDate.toLocaleDateString()}
                    </div>
                  )}
                  {lease.depositAmount && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Deposit:</span> ${lease.depositAmount.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Lease Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => openEdit(lease)}
                    variant="outline"
                    size="small"
                    className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteLease(lease.id)}
                    variant="outline"
                    size="small"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
            </div>
            </Card>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editing ? 'Edit Lease' : 'Add New Lease'}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <select 
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                    value={form.propertyId} 
                    onChange={(e) => setForm(f => ({ ...f, propertyId: e.target.value }))} 
                    required
                  >
                    <option value="">Select Property</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select 
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                    value={form.tenantId} 
                    onChange={(e) => setForm(f => ({ ...f, tenantId: e.target.value }))} 
                    required
                  >
                    <option value="">Select Tenant</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select 
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                    value={form.status} 
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value as LeaseStatus }))}
                  >
                    {Object.values(LeaseStatus).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  type="number"
                  placeholder="Monthly Rent Amount"
                  value={form.rentAmount}
                  onChange={(e) => setForm(f => ({ ...f, rentAmount: Number(e.target.value) }))}
                  required
                />

                <Input
                  type="number"
                  placeholder="Deposit Amount (Optional)"
                  value={form.depositAmount}
                  onChange={(e) => setForm(f => ({ ...f, depositAmount: Number(e.target.value) }))}
                />

                <Input
                  type="date"
                  placeholder="Start Date"
                  value={form.startDate}
                  onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))}
                  required
                />

                <Input
                  type="date"
                  placeholder="End Date (Optional)"
                  value={form.endDate}
                  onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {editing ? 'Update Lease' : 'Create Lease'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeasePage; 