import type { ReactNode } from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

interface DraggableProps {
  id: string;
  children: ReactNode;
}

export function Draggable({ id, children }: DraggableProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id,
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
    border: '1px solid #e5e5e5',
    padding: '0.5rem 1rem',
    margin: '0.2rem',
    borderRadius: '0.3rem',
    boxShadow: '0 0.2rem #e5e5e5',
    cursor: 'grab',
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
}
