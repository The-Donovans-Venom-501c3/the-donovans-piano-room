import React from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

/**
 * A reusable Modal component that provides a backdrop and a centered content area.
 * It handles the closing logic when the backdrop is clicked.
 */
export default function Modal({ children, onClose }: ModalProps) {
  // This function stops the click from "bubbling up" to the backdrop.
  // Without this, clicking on the modal content would also close it.
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    // The fixed, full-screen container for the modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* The semi-transparent backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* The actual modal content, which sits on top of the backdrop */}
      <div
        className="relative z-10"
        onClick={handleContentClick}
      >
        {children}
      </div>
    </div>
  );
}