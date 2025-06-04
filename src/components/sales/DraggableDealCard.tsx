import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Deal } from '../../types';
import { Card } from '../ui/card';

interface DraggableDealCardProps {
  deal: Deal;
  onClick: () => void;
}

export const DraggableDealCard: React.FC<DraggableDealCardProps> = ({ deal, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="transform transition-all duration-200"
    >
      <Card 
        className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl cursor-pointer"
        onClick={onClick}
      >
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1">{deal.name}</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">${deal.amount.toLocaleString()}</span>
            <span className="text-gray-400">{deal.probability}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}; 