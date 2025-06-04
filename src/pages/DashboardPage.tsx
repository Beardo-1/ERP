import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, DollarSign, Activity, Download, Filter } from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { CircularProgress } from '../components/dashboard/CircularProgress';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const DashboardPage = () => {
  // Mock data - replace with real data later
  const monthlyData = {
    revenue: {
      value: '16.2M',
      change: 8.3,
      isAboveTarget: true
    },
    activeListings: {
      value: '348',
      change: 12.4,
      trend: 'up'
    },
    propertiesSold: {
      value: '29',
      change: 18.7,
      trend: 'up'
    },
    avgPropertyValue: {
      value: '882K',
      change: 5.2,
      trend: 'up'
    }
  };

  const salesData = [
    { month: 'Jan', residential: 200000, commercial: 150000, luxury: 250000 },
    { month: 'Feb', residential: 180000, commercial: 140000, luxury: 220000 },
    { month: 'Mar', residential: 220000, commercial: 160000, luxury: 280000 },
    { month: 'Apr', residential: 240000, commercial: 180000, luxury: 300000 },
    { month: 'May', residential: 260000, commercial: 200000, luxury: 320000 },
    { month: 'Jun', residential: 280000, commercial: 220000, luxury: 340000 },
  ];

  const inventoryData = [
    { category: 'Single Family', available: 90, pending: 30, sold: 15 },
    { category: 'Condos', available: 120, pending: 35, sold: 20 },
    { category: 'Luxury Homes', available: 45, pending: 15, sold: 8 },
    { category: 'Commercial', available: 75, pending: 25, sold: 12 },
  ];

  const employeeMetrics = {
    totalEmployees: 725,
    productivityScore: 87,
    attendanceRate: 94,
    satisfactionScore: 4.2
  };

  const recentTransactions = [
    { id: '#12459', name: 'Alice Johnson', amount: 2847000, status: 'completed' as const, time: '2 hours ago' },
    { id: '#12458', name: 'Bob Smith', amount: 1234000, status: 'pending' as const, time: '4 hours ago' },
    { id: '#12457', name: 'Carol Davis', amount: 5678000, status: 'completed' as const, time: '6 hours ago' },
    { id: '#12456', name: 'David Wilson', amount: 892000, status: 'failed' as const, time: '8 hours ago' },
    { id: '#12455', name: 'Emma Brown', amount: 3456000, status: 'completed' as const, time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Real Estate Command Center
            </h1>
            <p className="text-gray-600 font-medium">Live Property Intelligence Dashboard</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter Data
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Monthly Revenue"
          value={`$${monthlyData.revenue.value}`}
          change={monthlyData.revenue.change}
          icon={DollarSign}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          tag={{ text: 'ABOVE TARGET', bgColor: 'bg-green-100 text-green-700' }}
        />
        <MetricCard
          title="Active Listings"
          value={monthlyData.activeListings.value}
          change={monthlyData.activeListings.change}
          icon={Building2}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Properties Sold"
          value={monthlyData.propertiesSold.value}
          change={monthlyData.propertiesSold.change}
          icon={Activity}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <MetricCard
          title="Avg Property Value"
          value={`$${monthlyData.avgPropertyValue.value}`}
          change={monthlyData.avgPropertyValue.change}
          icon={DollarSign}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Property Sales by Type</h3>
                <p className="text-sm text-gray-500">Monthly comparison across categories</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button variant="outline" size="sm">Filter</Button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="residential" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="commercial" stroke="#EF4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="luxury" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-500">Residential</p>
                <p className="text-lg font-semibold text-blue-600">$189.1M</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Commercial</p>
                <p className="text-lg font-semibold text-red-600">$122.7M</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Luxury</p>
                <p className="text-lg font-semibold text-green-600">$229.3M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Property Inventory Status</h3>
                <p className="text-sm text-gray-500">Current status across property types</p>
              </div>
              <span className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full font-medium">
                4 CRITICAL
              </span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      border: 'none'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="available" fill="#10B981" name="Available" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#F59E0B" name="Pending" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sold" fill="#3B82F6" name="Sold" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Metrics */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Employee Performance</h3>
              <p className="text-sm text-gray-500">Overall team metrics</p>
            </div>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <CircularProgress
                value={employeeMetrics.productivityScore}
                maxValue={100}
                color="#3B82F6"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{employeeMetrics.totalEmployees}</p>
                  <p className="text-sm text-gray-500">Total Agents</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Productivity</p>
                <p className="text-lg font-semibold text-blue-600">{employeeMetrics.productivityScore}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Satisfaction</p>
                <p className="text-lg font-semibold text-blue-600">{employeeMetrics.satisfactionScore}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-white/80 backdrop-blur-sm col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <p className="text-sm text-gray-500">Latest property deals and updates</p>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <RecentTransactions transactions={recentTransactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage; 