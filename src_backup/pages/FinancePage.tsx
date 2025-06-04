import React, { useState } from 'react';
import { transactions, properties, users } from '../data/mockData';
import { TransactionType, FinancialTransaction } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const FinancePage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedType, setSelectedType] = useState('all');

  const periods = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' },
  ];

  const transactionTypes = [
    { id: 'all', name: 'All Transactions' },
    { id: TransactionType.SALE, name: 'Sales' },
    { id: TransactionType.RENT, name: 'Rent' },
    { id: TransactionType.DEPOSIT, name: 'Deposits' },
    { id: TransactionType.MAINTENANCE, name: 'Maintenance' },
    { id: TransactionType.COMMISSION, name: 'Commission' },
    { id: TransactionType.OTHER, name: 'Other' },
  ];

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.SALE:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>;
      case TransactionType.RENT:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 012-2h14a2 2 0 012 2v2" /></svg>;
      case TransactionType.DEPOSIT:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
      case TransactionType.MAINTENANCE:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
      case TransactionType.COMMISSION:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
      default:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.SALE: return 'text-green-600 bg-green-100';
      case TransactionType.RENT: return 'text-blue-600 bg-blue-100';
      case TransactionType.DEPOSIT: return 'text-purple-600 bg-purple-100';
      case TransactionType.MAINTENANCE: return 'text-orange-600 bg-orange-100';
      case TransactionType.COMMISSION: return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTransactions = selectedType === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === selectedType);

  const totalRevenue = transactions
    .filter(tx => [TransactionType.SALE, TransactionType.RENT, TransactionType.COMMISSION].includes(tx.type))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = transactions
    .filter(tx => [TransactionType.MAINTENANCE, TransactionType.OTHER].includes(tx.type))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalDeposits = transactions
    .filter(tx => tx.type === TransactionType.DEPOSIT)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Financial Management
            </h1>
            <p className="text-gray-600 font-medium">Track revenue, expenses, and financial performance</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Financial Report
              </span>
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Transaction
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
            <span className="text-sm font-medium text-gray-700">Transaction Type:</span>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
            >
              {transactionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                <p className="text-green-200 text-sm mt-1">+12.5% from last period</p>
              </div>
              <div className="bg-green-400 bg-opacity-30 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold">${totalExpenses.toLocaleString()}</p>
                <p className="text-red-200 text-sm mt-1">-3.2% from last period</p>
              </div>
              <div className="bg-red-400 bg-opacity-30 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Net Profit</p>
                <p className="text-3xl font-bold">${netProfit.toLocaleString()}</p>
                <p className="text-blue-200 text-sm mt-1">+18.7% from last period</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Deposits</p>
                <p className="text-3xl font-bold">${totalDeposits.toLocaleString()}</p>
                <p className="text-purple-200 text-sm mt-1">Security deposits held</p>
              </div>
              <div className="bg-purple-400 bg-opacity-30 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="small" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                Filter
              </Button>
              <Button variant="outline" size="small" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                Export
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredTransactions.map((tx) => {
              const property = tx.propertyId ? properties.find(p => p.id === tx.propertyId) : undefined;
              const user = users.find(u => u.id === tx.createdBy);
              const colorClass = getTransactionColor(tx.type);
              
              return (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${colorClass}`}>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} Transaction
                      </div>
                      {property && (
                        <div className="text-sm text-gray-500">
                          Property: {property.title}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {tx.date.toLocaleDateString()} • Created by {user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
                      </div>
                      {tx.description && (
                        <div className="text-xs text-gray-400 mt-1">
                          {tx.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      [TransactionType.SALE, TransactionType.RENT, TransactionType.COMMISSION].includes(tx.type)
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {[TransactionType.SALE, TransactionType.RENT, TransactionType.COMMISSION].includes(tx.type) ? '+' : '-'}
                      ${tx.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {tx.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 font-medium">No transactions found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters or add a new transaction</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FinancePage; 