import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import {useDroppable} from '@dnd-kit/core';

interface DroppableProps extends HTMLAttributes<HTMLSpanElement> {
  id: string;
  children: ReactNode;
}

// A <span>, so it can sit inside a sentence's <p>. Extra props (className, data-*) go on the span.
export function Droppable({ id, children, className, style, ...rest }: DroppableProps) {
  const {isOver, setNodeRef} = useDroppable({
    id,
  });
  // Without a className, keep the original look the old QuizSection relies on
  const defaultStyle: CSSProperties | undefined = className
    ? undefined
    : {
        opacity: isOver ? 1 : 0.5,
        display: 'inline-block',
        margin: '0 3px 0 3px',
      };
  return (
    <span
      ref={setNodeRef}
      className={className && `${className}${isOver ? ' is-over' : ''}`}
      style={{ ...defaultStyle, ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}
