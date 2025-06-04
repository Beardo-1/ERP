import React from 'react';
import { Deal, DealStage } from '../../types';
import { Card } from '../ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface SalesAnalyticsDashboardProps {
  deals: Deal[];
}

const COLORS: Record<DealStage, string> = {
  [DealStage.QUALIFICATION]: '#EAB308',
  [DealStage.NEEDS_ANALYSIS]: '#9333EA',
  [DealStage.PROPOSAL]: '#3B82F6',
  [DealStage.NEGOTIATION]: '#F97316',
  [DealStage.CLOSED_WON]: '#22C55E',
  [DealStage.CLOSED_LOST]: '#EF4444',
};

export const SalesAnalyticsDashboard: React.FC<SalesAnalyticsDashboardProps> = ({ deals }) => {
  // Calculate total value by stage
  const valueByStage = Object.values(DealStage).map(stage => ({
    name: stage,
    value: deals
      .filter(d => d.stage === stage)
      .reduce((sum, deal) => sum + deal.amount, 0)
  }));

  // Calculate deal count by stage
  const dealsByStage = Object.values(DealStage).map(stage => ({
    name: stage,
    count: deals.filter(d => d.stage === stage).length
  }));

  // Calculate win rate
  const closedDeals = deals.filter(d => 
    d.stage === DealStage.CLOSED_WON || d.stage === DealStage.CLOSED_LOST
  );
  const wonDeals = deals.filter(d => d.stage === DealStage.CLOSED_WON);
  const winRate = closedDeals.length ? (wonDeals.length / closedDeals.length) * 100 : 0;

  // Calculate total pipeline value
  const totalPipeline = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const weightedPipeline = deals.reduce((sum, deal) => sum + (deal.amount * deal.probability / 100), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Key Metrics */}
      <Card className="col-span-full grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/80 backdrop-blur-sm">
        <div className="p-6 border-r border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Pipeline</h3>
          <p className="text-2xl font-bold text-gray-900">${totalPipeline.toLocaleString()}</p>
        </div>
        <div className="p-6 border-r border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Weighted Pipeline</h3>
          <p className="text-2xl font-bold text-gray-900">${weightedPipeline.toLocaleString()}</p>
        </div>
        <div className="p-6 border-r border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Win Rate</h3>
          <p className="text-2xl font-bold text-gray-900">{winRate.toFixed(1)}%</p>
        </div>
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Deals</h3>
          <p className="text-2xl font-bold text-gray-900">{deals.length}</p>
        </div>
      </Card>

      {/* Pipeline Value by Stage */}
      <Card className="col-span-2 bg-white/80 backdrop-blur-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Value by Stage</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueByStage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Value']}
                />
                <Bar dataKey="value">
                  {valueByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as DealStage]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Deal Distribution */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dealsByStage}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  label
                >
                  {dealsByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as DealStage]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
}; 