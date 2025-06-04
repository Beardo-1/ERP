import React from 'react';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from 'recharts';
import { Filter } from 'lucide-react';

interface FunnelStage {
  name: string;
  value: number;
  percentage: number;
}

interface ConversionFunnelData {
  stages: FunnelStage[];
  conversionRate: number;
  averageDealCycle: number;
}

interface ConversionFunnelWidgetProps {
  data: ConversionFunnelData;
}

const COLORS = ['#4f46e5', '#818cf8', '#a5b4fc', '#dbeafe', '#f1f5f9'];

export const ConversionFunnelWidget: React.FC<ConversionFunnelWidgetProps> = ({ data }) => {
  if (!data || !Array.isArray(data.stages)) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-400">
        No conversion funnel data available.
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <Filter className="w-4 h-4 text-primary-700" />
        </div>
        <span className="text-sm text-neutral-600">Conversion Funnel</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height={140}>
          <FunnelChart width={120} height={140}>
            <Tooltip formatter={(value: number, name: string) => [value, name]} />
            <Funnel
              dataKey="value"
              data={data.stages}
              isAnimationActive
              activeShape
            >
              <LabelList dataKey="name" position="right" fill="#4f46e5" style={{ fontWeight: 500, fontSize: 12 }} />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
        <div className="mt-4 w-full grid grid-cols-2 gap-2">
          {data.stages.map((stage, idx) => (
            <div key={stage.name} className="flex flex-col items-center">
              <span className="text-xs text-neutral-500">{stage.name}</span>
              <span className="text-sm font-bold text-neutral-800">{stage.value}</span>
              <span className="text-xs text-primary-600">{stage.percentage}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between w-full text-xs text-neutral-500">
          <span>Conversion Rate: <span className="text-success-600 font-medium">{data.conversionRate}%</span></span>
          <span>Avg. Deal Cycle: <span className="text-primary-600 font-medium">{data.averageDealCycle}d</span></span>
        </div>
      </div>
    </div>
  );
}; 