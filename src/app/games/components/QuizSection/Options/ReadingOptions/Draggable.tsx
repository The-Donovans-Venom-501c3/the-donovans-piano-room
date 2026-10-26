import type { ReactNode } from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

interface DraggableProps {
  id: string;
  children: ReactNode;
  className?: string;
  // Can't be picked up while answers aren't accepted
  disabled?: boolean;
}

export function Draggable({ id, children, className = '', disabled = false }: DraggableProps) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id,
    disabled,
  });
  // Only where the button has been dragged to is inline; how it looks comes from className
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
    // While dragged, stay above the sentence and the staff
    position: 'relative' as const,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      className={`${className}${isDragging ? ' is-dragging' : ''}`}
      disabled={disabled}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  );
}
