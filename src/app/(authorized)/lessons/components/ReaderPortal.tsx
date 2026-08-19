"use client";

import "./styles.css";
import { useEffect, useRef, ReactNode, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import EbookCanvas, { EbookCanvasRef } from "./EbookCanvas";

interface ReaderPortalProps {
  onClose: () => void;
  children: ReactNode;
  pageId: string | number;
}

export default function ReaderPortal({
  onClose,
  children,
  pageId,
}: ReaderPortalProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<EbookCanvasRef | null>(null);
  const [isDrawActive, setIsDrawActive] = useState(false);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
    elRef.current.id = "reader-portal";
  }

  // Lock body scroll
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      document.body.appendChild(el);
      document.body.style.overflow = "hidden";
    }

    return () => {
      if (el && document.body.contains(el)) {
        document.body.removeChild(el);
      }
      document.body.style.overflow = "";
    };
  }, []);

  const handleCloseButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (canvasRef.current) {
      canvasRef.current.clearCurrentPage();
    }
  };

  return createPortal(
    <div className="reader-container fixed inset-0 z-[9990] bg-white w-screen h-screen">
      {/* Top Right Close Button */}
      <button
        type="button"
        className="exit-btn absolute top-4 right-4 z-[10020] border border-black px-6 py-2 rounded-full bg-white text-black hover:bg-gray-100 cursor-pointer text-base font-bold shadow-md select-none"
        onClick={handleCloseButtonClick}
      >
        close
      </button>

      {/* Bottom Right Clear All Button */}
      <button
        type="button"
        onClick={handleClearAll}
        className="fixed bottom-6 right-6 z-[10020] bg-[#6B21A8] text-white px-6 py-2.5 rounded-2xl font-semibold text-lg shadow-xl hover:bg-[#581C87] active:scale-95 transition-all cursor-pointer border-2 border-white select-none"
      >
        Clear All
      </button>

      {/* Drawing Tool Trigger Button */}
      {!isDrawActive && (
        <button
          type="button"
          onClick={() => setIsDrawActive(true)}
          className="fixed bottom-8 left-8 z-[10002] transition-transform hover:scale-110 active:scale-95 cursor-pointer drop-shadow-2xl"
          title="Open Drawing Toolbar"
        >
          <Image
            src="/lessons/brushes/draw-tool.png"
            alt="Open Draw Tools"
            width={112}
            height={112}
            className="w-28 h-28 object-contain"
          />
        </button>
      )}

      {/* Canvas Component */}
      <EbookCanvas
        ref={canvasRef}
        key={`canvas-page-${pageId}`}
        isActive={isDrawActive}
        onCloseTool={() => setIsDrawActive(false)}
        pageId={pageId}
      />

      {/* Ebook Frame Container */}
      <div className="w-full h-full pointer-events-auto">{children}</div>
    </div>,
    elRef.current as Element
  );
}