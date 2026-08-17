"use client";

import "./styles.css";
import { useEffect, useRef, ReactNode, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import EbookCanvas from "./EbookCanvas";

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
  const [isDrawActive, setIsDrawActive] = useState(false);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
    elRef.current.id = "reader-portal";
  }

  // Function to clear saved drawing/text data
  const handleCloseAndClear = useCallback(() => {
    const bookPrefix = typeof pageId === "string" ? pageId.split("_page_")[0] : "";

    Object.keys(sessionStorage).forEach((key) => {
      if (
        (key.startsWith("ebook_canvas_data_page_") ||
          key.startsWith("ebook_text_boxes_page_")) &&
        (bookPrefix ? key.includes(bookPrefix) : true)
      ) {
        sessionStorage.removeItem(key);
      }
    });

    onClose();
  }, [pageId, onClose]);

  // Lock body scroll, manage browser history stack, and trap back navigation
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      document.body.appendChild(el);
      document.body.style.overflow = "hidden";
    }

    // Push dummy history entry so back button/backspace pops this state instead of navigating away
    window.history.pushState({ ebookOpen: true }, "");

    const handlePopState = () => {
      // Triggered when user clicks browser Back or presses Backspace navigation key
      handleCloseAndClear();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      if (el && document.body.contains(el)) {
        document.body.removeChild(el);
      }
      document.body.style.overflow = "";
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleCloseAndClear]);

  const handleCloseButtonClick = () => {
    // Revert the history state pushed on open, then clear and close
    if (window.history.state?.ebookOpen) {
      window.history.back();
    } else {
      handleCloseAndClear();
    }
  };

  return createPortal(
    <div className="reader-container fixed inset-0 z-[9990] bg-white w-screen h-screen">
      {/* Close Button */}
      <button
        type="button"
        className="exit-btn absolute top-4 right-4 z-[10002] border border-black px-6 py-2 rounded-full bg-white text-black hover:bg-gray-100 cursor-pointer text-base font-bold shadow-md"
        onClick={handleCloseButtonClick}
      >
        close
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

      {/* Canvas */}
      <EbookCanvas
        key={`canvas-page-${pageId}`}
        isActive={isDrawActive}
        onCloseTool={() => setIsDrawActive(false)}
        pageId={pageId}
      />

      {/* Ebook Frame Container */}
      <div className="w-full h-full">{children}</div>
    </div>,
    elRef.current as Element
  );
}