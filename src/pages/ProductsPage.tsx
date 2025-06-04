import React, { useState } from 'react';
import { products as mockProducts } from '../data/mockData';
import { Product } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/card';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState(mockProducts);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ 
    name: '', 
    sku: '', 
    price: 0, 
    inStock: 0,
    category: '',
    description: ''
  });

  const openAdd = () => { 
    setEditing(null); 
    setForm({ 
      name: '', 
      sku: '', 
      price: 0, 
      inStock: 0,
      category: '',
      description: ''
    }); 
    setShowModal(true); 
  };
  
  const openEdit = (product: Product) => { 
    setEditing(product); 
    setForm({
      name: product.name,
      sku: product.sku,
      price: product.price,
      inStock: product.inStock,
      category: product.category,
      description: product.description || ''
    }); 
    setShowModal(true); 
  };
  
  const closeModal = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setProducts(products.map(p => p.id === editing.id ? { 
        ...editing, 
        ...form,
        updatedAt: new Date()
      } : p));
    } else {
      const newProduct: Product = { 
        ...form, 
        id: Date.now().toString(), 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      setProducts([...products, newProduct]);
    }
    closeModal();
  };
  
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Out of Stock' };
    if (stock < 10) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Low Stock' };
    return { color: 'bg-green-100 text-green-800 border-green-200', text: 'In Stock' };
  };

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.inStock), 0);
  const lowStockCount = products.filter(p => p.inStock < 10 && p.inStock > 0).length;
  const outOfStockCount = products.filter(p => p.inStock === 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Product Management
            </h1>
            <p className="text-gray-600 font-medium">Manage your inventory and track product performance</p>
          </div>
          <Button 
            onClick={openAdd}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Value</p>
                  <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
                </div>
                <div className="bg-green-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Low Stock</p>
                  <p className="text-3xl font-bold">{lowStockCount}</p>
                </div>
                <div className="bg-yellow-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
    <div>
                  <p className="text-red-100 text-sm font-medium">Out of Stock</p>
                  <p className="text-3xl font-bold">{outOfStockCount}</p>
                </div>
                <div className="bg-red-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.inStock);
          return (
            <Card 
              key={product.id} 
              className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
            >
              <div className="p-6">
                {/* Product Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      SKU: {product.sku}
                    </p>
                    <p className="text-xs text-gray-400">
                      {product.category}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openEdit(product)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Product Price */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    ${product.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total Value: ${(product.price * product.inStock).toLocaleString()}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Stock: {product.inStock}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        product.inStock === 0 ? 'bg-red-500' : 
                        product.inStock < 10 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((product.inStock / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Product Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => openEdit(product)}
                    variant="outline"
                    size="small"
                    className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteProduct(product.id)}
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
                  {editing ? 'Edit Product' : 'Add New Product'}
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
                  placeholder="Product Name"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />

                <Input
                  placeholder="SKU"
                  value={form.sku}
                  onChange={(e) => setForm(f => ({ ...f, sku: e.target.value }))}
                  required
                />

                <Input
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                  required
                />

                <Input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                  required
                />

                <Input
                  type="number"
                  placeholder="Stock Quantity"
                  value={form.inStock}
                  onChange={(e) => setForm(f => ({ ...f, inStock: Number(e.target.value) }))}
                  required
                />

                <div>
                  <textarea
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium resize-none"
                    placeholder="Product Description (optional)"
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
                  {editing ? 'Update Product' : 'Create Product'}
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

export default ProductsPage; 
