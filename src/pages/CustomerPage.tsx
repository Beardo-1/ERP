import React, { useEffect, useState, useMemo } from 'react';
import { useCustomerStore } from '../store/customerStore';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRole, CustomerStatus, Customer } from '../types/index';
import { X } from 'lucide-react';
import './CustomerDrawer.css';
import { Input } from '@/components/ui/input';

// Helper for CSV export
function exportToCSV(customers: Customer[], filename = 'customers.csv') {
  const header = ['Name', 'Email', 'Company', 'Status', 'Phone', 'City', 'Created At'];
  const rows = customers.map(c => [
    c.name,
    c.email,
    c.company || '',
    c.status,
    c.phone || '',
    c.address?.city || '',
    c.createdAt.toLocaleDateString()
  ]);
  const csvContent = [header, ...rows].map(e => e.map(x => `"${x}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

const statusColors = {
  [CustomerStatus.LEAD]: 'bg-blue-100 text-blue-800',
  [CustomerStatus.PROSPECT]: 'bg-yellow-100 text-yellow-800',
  [CustomerStatus.CUSTOMER]: 'bg-green-100 text-green-800',
  [CustomerStatus.INACTIVE]: 'bg-neutral-200 text-neutral-600',
};

const pageSizeOptions = [20, 50, 100];

const CustomerPage: React.FC = () => {
  const { customers, loadCustomers, addCustomer, updateCustomer } = useCustomerStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: '', email: '', company: '', status: CustomerStatus.LEAD });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const currentUserRole = UserRole.ADMIN; // TODO: get from auth context
  const [drawerCustomer, setDrawerCustomer] = useState<Customer | null>(null);

  useEffect(() => { loadCustomers(); }, [loadCustomers]);

  // Filtering, searching, sorting
  const filtered = useMemo(() => {
    let data = customers;
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(c => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || (c.company?.toLowerCase().includes(s)));
    }
    if (statusFilter) data = data.filter(c => c.status === statusFilter);
    if (companyFilter) data = data.filter(c => c.company === companyFilter);
    data = [...data].sort((a, b) => {
      // Type-safe sort
      if (sortBy === 'createdAt') {
        return sortDir === 'asc' ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime();
      }
      if (sortBy === 'name' || sortBy === 'company' || sortBy === 'status') {
        const vA = (a[sortBy] || '').toString();
        const vB = (b[sortBy] || '').toString();
        return sortDir === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA);
      }
      return 0;
    });
    return data;
  }, [customers, search, statusFilter, companyFilter, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);

  // Summary
  const summary = useMemo(() => {
    const total = customers.length;
    const newThisMonth = customers.filter(c => c.createdAt.getMonth() === new Date().getMonth() && c.createdAt.getFullYear() === new Date().getFullYear()).length;
    const byStatus = Object.values(CustomerStatus).map(status => ({ status, count: customers.filter(c => c.status === status).length }));
    return { total, newThisMonth, byStatus };
  }, [customers]);

  // Bulk actions
  const allSelected = paged.length > 0 && paged.every(c => selected.includes(c.id));
  const toggleSelectAll = () => setSelected(allSelected ? selected.filter(id => !paged.some(c => c.id === id)) : [...selected, ...paged.map(c => c.id).filter(id => !selected.includes(id))]);
  const toggleSelect = (id: string) => setSelected(selected.includes(id) ? selected.filter(sid => sid !== id) : [...selected, id]);
  const clearSelection = () => setSelected([]);

  // Modal logic
  const openAdd = () => { setEditing(null); setForm({ name: '', email: '', company: '', status: CustomerStatus.LEAD }); setShowModal(true); };
  const openEdit = (customer: Customer) => {
    setEditing(customer);
    setForm({
      name: customer.name,
      email: customer.email,
      company: customer.company || '',
      status: customer.status,
    });
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateCustomer(editing.id, { ...form, status: form.status as CustomerStatus });
    else addCustomer({ ...form, status: form.status as CustomerStatus });
    closeModal();
  };

  // Unique companies for filter
  const companies = useMemo(() => Array.from(new Set(customers.map(c => c.company).filter(Boolean))), [customers]);

  // Table headers
  const headers = [
    { key: 'select', label: '' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'company', label: 'Company' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created' },
    { key: 'actions', label: '' },
  ];

  // Scroll to table helper
  const tableRef = React.useRef<HTMLDivElement>(null);
  const scrollToTable = () => {
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Card click handlers
  const handleCardClick = (type: string) => {
    if (type === 'total') {
      setStatusFilter('');
      setSearch('');
      setCompanyFilter('');
      setPage(1);
    } else if (type === 'new') {
      setStatusFilter('');
      setSearch('');
      setCompanyFilter('');
      setPage(1);
      // Optionally, could add a special filter for new this month
    } else {
      setStatusFilter(type);
      setPage(1);
    }
    scrollToTable();
  };

  // Placeholder function for customer detail navigation
  const handleCustomerClick = (customerId: string) => {
    // TODO: Implement customer detail view
    console.log('Navigate to customer:', customerId);
    // For now, we could open the edit modal or show an alert
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setDrawerCustomer(customer);
    }
  };

  return (
    <div className="p-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="cursor-pointer hover:shadow-lg ring-0 hover:ring-2 hover:ring-primary-200 transition" onClick={() => handleCardClick('total')}>
          <div className="p-4">
            <div className="text-xs text-neutral-500">Total Customers</div>
            <div className="text-2xl font-bold">{summary.total}</div>
          </div>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg ring-0 hover:ring-2 hover:ring-primary-200 transition" onClick={() => handleCardClick('new')}>
          <div className="p-4">
            <div className="text-xs text-neutral-500">New This Month</div>
            <div className="text-2xl font-bold">{summary.newThisMonth}</div>
          </div>
        </Card>
        {summary.byStatus.map(s => (
          <Card key={s.status} className="cursor-pointer hover:shadow-lg ring-0 hover:ring-2 hover:ring-primary-200 transition" onClick={() => handleCardClick(s.status)}>
            <div className="p-4">
              <div className="text-xs text-neutral-500">{s.status.charAt(0).toUpperCase() + s.status.slice(1)}</div>
              <div className="text-2xl font-bold">{s.count}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <Input className="border p-2 rounded w-48" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="border p-2 rounded" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {Object.values(CustomerStatus).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select className="border p-2 rounded" value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}>
          <option value="">All Companies</option>
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="border p-2 rounded" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="createdAt">Created</option>
          <option value="name">Name</option>
          <option value="company">Company</option>
          <option value="status">Status</option>
        </select>
        <select className="border p-2 rounded" value={sortDir} onChange={e => setSortDir(e.target.value as 'asc' | 'desc')}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <select className="border p-2 rounded" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
          {pageSizeOptions.map(size => <option key={size} value={size}>{size} / page</option>)}
        </select>
        {currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.MANAGER ? (
          <>
            <Button variant="outline" size="sm" onClick={() => exportToCSV(selected.length ? customers.filter(c => selected.includes(c.id)) : filtered)}>Export CSV</Button>
            {selected.length > 0 && <Button variant="destructive" size="sm" onClick={clearSelection}>Clear Selection</Button>}
          </>
        ) : null}
        <Button variant="default" size="sm" onClick={openAdd}>Add Customer</Button>
        <Button variant="outline" size="sm">Bulk Campaigns</Button>
      </div>

      {/* Table */}
      <div ref={tableRef} className="overflow-x-auto bg-white rounded-xl shadow-card border border-neutral-100">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              {headers.map(h => (
                <th key={h.key} className="px-4 py-2 text-left text-xs font-semibold text-neutral-600">{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map(customer => (
              <tr key={customer.id} className={selected.includes(customer.id) ? 'bg-primary-50' : ''}>
                <td className="px-4 py-2"><input type="checkbox" checked={selected.includes(customer.id)} onChange={() => toggleSelect(customer.id)} /></td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="cursor-pointer underline hover:text-primary-700" onClick={() => handleCustomerClick(customer.id)}>{customer.name}</span>
                </td>
                <td className="px-4 py-2">{customer.email}</td>
                <td className="px-4 py-2">{customer.company}</td>
                <td className="px-4 py-2"><span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[customer.status]}`}>{customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}</span></td>
                <td className="px-4 py-2">{customer.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(customer)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paged.length === 0 && <div className="p-6 text-center text-neutral-400">No customers found.</div>}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-neutral-500">Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setPage(1)} disabled={page === 1}>First</Button>
          <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
          <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
          <Button size="sm" variant="outline" onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last</Button>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded-xl shadow-lg min-w-[300px] flex flex-col gap-3" onSubmit={handleSubmit}>
            <h2 className="font-bold text-lg mb-2">{editing ? 'Edit' : 'Add'} Customer</h2>
            <Input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <Input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            <Input className="border p-2 rounded" placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            <select className="border p-2 rounded" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as CustomerStatus }))}>
              <option value="lead">Lead</option>
              <option value="prospect">Prospect</option>
              <option value="customer">Customer</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex gap-2 mt-2">
              <Button type="submit" variant="default">Save</Button>
              <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* Side Drawer for Customer Profile */}
      {drawerCustomer && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setDrawerCustomer(null)} />
          {/* Drawer */}
          <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <button className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700" onClick={() => setDrawerCustomer(null)}><X size={24} /></button>
            <div className="p-6 flex flex-col items-center border-b">
              <Avatar className="h-16 w-16">
                <AvatarFallback>{drawerCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="mt-3 text-xl font-bold">{drawerCustomer.name}</div>
              <span className={`mt-1 inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[drawerCustomer.status]}`}>{drawerCustomer.status.charAt(0).toUpperCase() + drawerCustomer.status.slice(1)}</span>
              <div className="mt-2 text-sm text-neutral-500">{drawerCustomer.email}</div>
              <div className="text-sm text-neutral-500">{drawerCustomer.phone}</div>
              <div className="text-sm text-neutral-500">{drawerCustomer.company}</div>
              <div className="text-sm text-neutral-500">{drawerCustomer.address?.city}</div>
              <div className="text-xs text-neutral-400 mt-2">Created: {drawerCustomer.createdAt.toLocaleDateString()}</div>
              <div className="text-xs text-neutral-400">Updated: {drawerCustomer.updatedAt.toLocaleDateString()}</div>
              {/* Quick Actions */}
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">Email</Button>
                <Button size="sm" variant="outline">Call</Button>
                <Button size="sm" variant="outline">Add Note</Button>
              </div>
            </div>
            {/* Stub for future tabs/sections */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-neutral-400 text-center">(Profile sections coming soon: Properties, Deals, Documents, Analytics, Activity, Tasks...)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage; 
