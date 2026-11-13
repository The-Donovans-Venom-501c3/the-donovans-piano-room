import type { CSSProperties, ReactNode } from 'react';
import {useDroppable} from '@dnd-kit/core';

interface DroppableProps {
  id: string;
  children: ReactNode;
}

export function Droppable({ id, children }: DroppableProps) {
  const {isOver, setNodeRef} = useDroppable({
    id,
  });
  const style: CSSProperties = {
    opacity: isOver ? 1 : 0.5,
    display: 'inline-block',
    margin: '0 3px 0 3px',
  };
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
