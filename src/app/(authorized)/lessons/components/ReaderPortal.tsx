"use client";
import "./styles.css"
import { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ReaderPortalProps {
    onClose: () => void;
    children: ReactNode;
}

export default function ReaderPortal({ onClose, children }: ReaderPortalProps) {
    const elRef = useRef<HTMLDivElement | null>(null);
    if (!elRef.current) {
        elRef.current = document.createElement('div');
        elRef.current.id = 'reader-portal';
    }

    useEffect(() => {
        const el = elRef.current;
        if (el) {
            document.body.appendChild(el);
            document.body.style.overflow = 'hidden';          // prevent body scroll
            return () => {
                document.body.removeChild(el);
                document.body.style.overflow = '';
            };
        }
        return undefined;
    }, []);

    return createPortal(
        <div className="reader-container">
            <button
                className="exit-btn"
                style={{
                    border: '1px solid black',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    background: 'white',
                    cursor: 'pointer'
                }}
                onClick={onClose}
            >
                close
            </button>
            {children}
        </div>,
        elRef.current as Element
    );
}
