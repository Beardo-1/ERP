import React, { useState } from 'react';
import { properties as mockProperties } from '../data/mockData';
import { PropertyStatus, PropertyType, Property } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const PropertyPage: React.FC = () => {
  const [properties, setProperties] = useState(mockProperties);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [form, setForm] = useState({ 
    title: '', 
    type: PropertyType.RESIDENTIAL, 
    status: PropertyStatus.AVAILABLE,
    price: 0,
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    description: ''
  });

  const openAdd = () => { 
    setEditing(null); 
    setForm({ 
      title: '', 
      type: PropertyType.RESIDENTIAL, 
      status: PropertyStatus.AVAILABLE,
      price: 0,
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      description: ''
    }); 
    setShowModal(true); 
  };
  
  const openEdit = (property: Property) => { 
    setEditing(property); 
    setForm({
      title: property.title,
      type: property.type,
      status: property.status,
      price: property.price,
      area: property.area,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      address: property.address ? {
        street: property.address.street,
        city: property.address.city,
        state: property.address.state || '',
        zipCode: property.address.zipCode,
        country: property.address.country
      } : {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      description: property.description || ''
    }); 
    setShowModal(true); 
  };
  
  const closeModal = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setProperties(properties.map(p => p.id === editing.id ? { 
        ...editing, 
        ...form,
        updatedAt: new Date()
      } : p));
    } else {
      const newProperty: Property = { 
        ...form, 
        id: Date.now().toString(),
        listedDate: new Date(),
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      setProperties([...properties, newProperty]);
    }
    closeModal();
  };
  
  const deleteProperty = (id: string) => setProperties(properties.filter(p => p.id !== id));

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.AVAILABLE: return 'bg-green-100 text-green-800 border-green-200';
      case PropertyStatus.LEASED: return 'bg-blue-100 text-blue-800 border-blue-200';
      case PropertyStatus.SOLD: return 'bg-purple-100 text-purple-800 border-purple-200';
      case PropertyStatus.OFF_MARKET: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: PropertyType) => {
    switch (type) {
      case PropertyType.RESIDENTIAL:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
      case PropertyType.COMMERCIAL:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
      case PropertyType.LAND:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 012-2h14a2 2 0 012 2v2" /></svg>;
      case PropertyType.INDUSTRIAL:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
      default:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 012-2h14a2 2 0 012 2v2" /></svg>;
    }
  };

  const filteredProperties = properties.filter(property => {
    const statusMatch = selectedStatus === 'all' || property.status === selectedStatus;
    const typeMatch = selectedType === 'all' || property.type === selectedType;
    return statusMatch && typeMatch;
  });

  const availableCount = properties.filter(p => p.status === PropertyStatus.AVAILABLE).length;
  const leasedCount = properties.filter(p => p.status === PropertyStatus.LEASED).length;
  const soldCount = properties.filter(p => p.status === PropertyStatus.SOLD).length;
  const totalValue = properties.reduce((sum, property) => sum + property.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
    <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Property Management
            </h1>
            <p className="text-gray-600 font-medium">Manage your real estate portfolio and property listings</p>
          </div>
          <Button 
            onClick={openAdd}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Property
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
              {Object.values(PropertyStatus).map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
            >
              <option value="all">All Types</option>
              {Object.values(PropertyType).map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
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
                  <p className="text-blue-100 text-sm font-medium">Total Properties</p>
                  <p className="text-3xl font-bold">{properties.length}</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Available</p>
                  <p className="text-3xl font-bold">{availableCount}</p>
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
                  <p className="text-purple-100 text-sm font-medium">Leased/Sold</p>
                  <p className="text-3xl font-bold">{leasedCount + soldCount}</p>
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
                  <p className="text-orange-100 text-sm font-medium">Total Value</p>
                  <p className="text-3xl font-bold">${(totalValue / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-orange-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map((property) => (
          <Card 
            key={property.id} 
            className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <div className="p-6">
              {/* Property Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-blue-600">
                      {getTypeIcon(property.type)}
                    </div>
                    <span className="text-sm text-gray-500">{property.type}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => openEdit(property)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => deleteProperty(property.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Property Price */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  ${property.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  {property.area} sqft
                </div>
              </div>

              {/* Property Status */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.status)}`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1).replace('_', ' ')}
                </span>
              </div>

              {/* Property Details */}
              <div className="mb-4 space-y-1">
                {property.bedrooms && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Bedrooms:</span> {property.bedrooms}
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Bathrooms:</span> {property.bathrooms}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Listed:</span> {property.listedDate.toLocaleDateString()}
                </div>
              </div>

              {/* Property Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button
                  onClick={() => openEdit(property)}
                  variant="outline"
                  size="small"
                  className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteProperty(property.id)}
                  variant="outline"
                  size="small"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editing ? 'Edit Property' : 'Add New Property'}
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
                <Input
                  placeholder="Property Title"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />

                <div>
                  <select 
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                    value={form.type} 
                    onChange={(e) => setForm(f => ({ ...f, type: e.target.value as PropertyType }))}
                  >
                    {Object.values(PropertyType).map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select 
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                    value={form.status} 
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value as PropertyStatus }))}
                  >
                    {Object.values(PropertyStatus).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                  required
                />

                <Input
                  type="number"
                  placeholder="Area (sqft)"
                  value={form.area}
                  onChange={(e) => setForm(f => ({ ...f, area: Number(e.target.value) }))}
                  required
                />

                <Input
                  type="number"
                  placeholder="Bedrooms"
                  value={form.bedrooms}
                  onChange={(e) => setForm(f => ({ ...f, bedrooms: Number(e.target.value) }))}
                />

                <Input
                  type="number"
                  placeholder="Bathrooms"
                  value={form.bathrooms}
                  onChange={(e) => setForm(f => ({ ...f, bathrooms: Number(e.target.value) }))}
                />

                <Input
                  placeholder="Street Address"
                  value={form.address.street}
                  onChange={(e) => setForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="City"
                    value={form.address.city}
                    onChange={(e) => setForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))}
                  />
                  <Input
                    placeholder="State"
                    value={form.address.state}
                    onChange={(e) => setForm(f => ({ ...f, address: { ...f.address, state: e.target.value } }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Zip Code"
                    value={form.address.zipCode}
                    onChange={(e) => setForm(f => ({ ...f, address: { ...f.address, zipCode: e.target.value } }))}
                  />
                  <Input
                    placeholder="Country"
                    value={form.address.country}
                    onChange={(e) => setForm(f => ({ ...f, address: { ...f.address, country: e.target.value } }))}
                  />
                </div>

                <div>
                  <textarea
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium resize-none"
                    placeholder="Property Description (optional)"
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {editing ? 'Update Property' : 'Create Property'}
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

export default PropertyPage; 
