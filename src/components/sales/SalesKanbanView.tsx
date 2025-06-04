import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Deal, DealStage } from '../../types';
import { Card } from '../ui/card';
import { DraggableDealCard } from './DraggableDealCard';
import { DroppableColumn } from './DroppableColumn';

interface SalesKanbanViewProps {
  deals: Deal[];
  onDealMove: (dealId: string, newStage: DealStage) => void;
  onDealClick: (deal: Deal) => void;
}

const stageColumns = [
  { id: DealStage.QUALIFICATION, title: 'Qualification', color: 'from-yellow-500 to-yellow-600' },
  { id: DealStage.NEEDS_ANALYSIS, title: 'Needs Analysis', color: 'from-purple-500 to-purple-600' },
  { id: DealStage.PROPOSAL, title: 'Proposal', color: 'from-blue-500 to-blue-600' },
  { id: DealStage.NEGOTIATION, title: 'Negotiation', color: 'from-orange-500 to-orange-600' },
  { id: DealStage.CLOSED_WON, title: 'Won', color: 'from-green-500 to-green-600' },
  { id: DealStage.CLOSED_LOST, title: 'Lost', color: 'from-red-500 to-red-600' },
];

export const SalesKanbanView: React.FC<SalesKanbanViewProps> = ({ deals, onDealMove, onDealClick }) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const dealId = active.id as string;
    const newStage = over.id as DealStage;
    
    if (newStage && Object.values(DealStage).includes(newStage)) {
      onDealMove(dealId, newStage);
    }
    
    setActiveId(null);
  };

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  const activeDeal = activeId ? deals.find(deal => deal.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-300px)]">
        {stageColumns.map((column) => {
          const columnDeals = deals.filter(deal => deal.stage === column.id);
          
          return (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className="mb-3 flex items-center justify-between">
                <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${column.color} text-white font-medium text-sm`}>
                  {column.title}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {columnDeals.length}
                </div>
              </div>

              <DroppableColumn id={column.id}>
                <SortableContext
                  items={columnDeals.map(d => d.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {columnDeals.map((deal) => (
                      <DraggableDealCard
                        key={deal.id}
                        deal={deal}
                        onClick={() => onDealClick(deal)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DroppableColumn>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeDeal && (
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg w-72">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{activeDeal.name}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">${activeDeal.amount.toLocaleString()}</span>
                <span className="text-gray-400">{activeDeal.probability}%</span>
              </div>
            </div>
          </Card>
        )}
      </DragOverlay>
    </DndContext>
  );
}; 