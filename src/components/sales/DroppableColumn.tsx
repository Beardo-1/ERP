import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableColumnProps {
  id: string;
  children: React.ReactNode;
}

export const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="min-h-[200px] p-2 rounded-lg bg-gray-50/50 backdrop-blur-sm"
    >
      {children}
    </div>
  );
}; 