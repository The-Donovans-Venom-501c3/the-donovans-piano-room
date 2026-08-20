"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import ReaderPortal from "./ReaderPortal";

const ebooks = [
  {
    id: "1",
    title: "Book I",
    url: process.env.NEXT_PUBLIC_EBOOK1,
    imgsrc: "/shop/books/book-1.svg",
  },
  {
    id: "2",
    title: "Book II",
    url: process.env.NEXT_PUBLIC_EBOOK2,
    imgsrc: "/shop/books/book-2.svg",
  },
  {
    id: "3",
    title: "Book III",
    url: process.env.NEXT_PUBLIC_EBOOK3,
    imgsrc: "/shop/books/book-3.svg",
  },
];

interface CardProps {
  width?: number;
  height?: number;
  children: React.ReactNode;
}

function SelectedCard({ width = 210, height = 210, children }: CardProps) {
  return (
    <div
      style={{ width: `${width}px` }}
      className="group bg-primary-purple border-2 rounded-3xl flex pb-[10px] border-primary-purple cursor-pointer"
    >
      <div
        style={{ minHeight: `${height}px` }}
        className="w-full rounded-3xl flex flex-col items-center justify-center p-2 bg-secondary-purple"
      >
        {children}
      </div>
    </div>
  );
}

interface EbooksComponentProps {
  searchQuery?: string;
}

export default function EbooksComponent({ searchQuery = "" }: EbooksComponentProps) {
  const [selected, setSelected] = useState<number>(0);
  const [read, setRead] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [readerSessionId, setReaderSessionId] = useState<number>(Date.now());

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const isClosingViaHistoryRef = useRef<boolean>(false);

  const q = searchQuery.toLowerCase().trim();

  const filteredEbooks = ebooks.filter((book) =>
    book.title.toLowerCase().includes(q)
  );

  // Core Cleanup & Reset Function
  const resetReaderToStart = useCallback(() => {
    // 1. Reset state
    setCurrentPage(1);

    // 2. Try clearing storage inside iframe if same-origin permits
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const win = iframeRef.current.contentWindow;
        win.localStorage?.clear();
        win.sessionStorage?.clear();
      } catch {
        // Cross-origin restriction ignored safely
      }
    }
  }, []);

  // 1. OPEN READER & RESET PAGE
  const handleRead = () => {
    resetReaderToStart();
    const newSession = Date.now();
    setReaderSessionId(newSession); // Unique session ID ensures fresh iframe load
    setRead(true);

    if (window.location.hash !== "#reader") {
      window.history.pushState({ readerOpen: true }, "", window.location.href);
    }
  };

  // 2. CLOSE READER VIA CLOSE BUTTON
  const handleBack = useCallback(() => {
    resetReaderToStart();
    setRead(false);

    if (!isClosingViaHistoryRef.current) {
      if (window.history.state?.readerOpen) {
        window.history.back();
      }
    }
    isClosingViaHistoryRef.current = false;
  }, [resetReaderToStart]);

  // 3. LISTEN FOR BROWSER BACK BUTTON
  useEffect(() => {
    const handlePopState = () => {
      if (read) {
        isClosingViaHistoryRef.current = true;
        resetReaderToStart(); // Force reset state when back button is hit
        setRead(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [read, resetReaderToStart]);

  // 4. LISTEN FOR PAGE CHANGE MESSAGES
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "PAGE_CHANGE" && typeof event.data.page === "number") {
        setCurrentPage(event.data.page);
      } else if (typeof event.data?.page === "number") {
        setCurrentPage(event.data.page);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // 5. GENERATE IFRAME URL FORCING PAGE 1
  const getEbookUrl = () => {
    const rawUrl = ebooks[selected]?.url;
    if (!rawUrl) return "";

    try {
      const urlObj = new URL(rawUrl, window.location.href);
      urlObj.searchParams.set("resetSession", readerSessionId.toString());
      urlObj.searchParams.set("page", "1");
      urlObj.searchParams.set("startPage", "1");
      urlObj.hash = "page=1";
      return urlObj.toString();
    } catch {
      return `${rawUrl}?resetSession=${readerSessionId}&page=1#page=1`;
    }
  };

  // 6. IFRAME LOAD HANDLER TO FORCE JUMP TO PAGE 1
  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const win = iframeRef.current.contentWindow;

      // Clear internal storage if accessible
      try {
        win.localStorage?.removeItem("pdfjs.history");
        win.localStorage?.removeItem("current_page");
        win.sessionStorage?.clear();
      } catch {
        // Cross-origin fallback
      }

      // Send postMessage signals to jump to page 1
      win.postMessage({ type: "GO_TO_PAGE", page: 1 }, "*");
      win.postMessage({ type: "SET_PAGE", page: 1 }, "*");
      win.postMessage({ action: "gotoPage", page: 1 }, "*");
      win.postMessage({ type: "PAGE_CHANGE", page: 1 }, "*");
    }
  };

  return (
    <>
      <h2 className="text-4xl font-medium text-primary-brown mb-4">E-books</h2>

      {filteredEbooks.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-medium text-lg">
          No e-books found matching &quot;{searchQuery}&quot;
        </div>
      ) : (
        <div>
          <div className="flex gap-10 mb-10 items-center flex-wrap">
            {filteredEbooks.map((book) => {
              const originalIndex = ebooks.findIndex((b) => b.id === book.id);
              const isSelected = selected === originalIndex;

              return (
                <div
                  key={book.id}
                  className="relative transition-all duration-300 cursor-pointer"
                  onClick={() => setSelected(originalIndex)}
                  onDoubleClick={() => {
                    setSelected(originalIndex);
                    handleRead();
                  }}
                >
                  {isSelected ? (
                    <SelectedCard width={210} height={210}>
                      <Image
                        className="object-contain w-[210px] h-[210px] transition-all duration-300"
                        src={book.imgsrc}
                        alt="ebook image"
                        width={210}
                        height={210}
                      />
                    </SelectedCard>
                  ) : (
                    <Image
                      className="object-contain w-[210px] h-[210px] transition-all duration-300"
                      src={book.imgsrc}
                      alt="ebook image"
                      width={210}
                      height={210}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {ebooks[selected] && (
            <div className="flex gap-8 p-10 bg-secondary-purple items-center rounded-lg">
              <div className="min-w-[160px]">
                <Image src="/lessons/Cat.svg" alt="Cat" width={160} height={136} />
              </div>
              <div className="flex-[2]">
                <h2 className="text-4xl font-medium text-primary-brown">
                  {ebooks[selected].title}
                </h2>
                <p className="text-2xl text-primary-gray leading-[24px]">
                  Learn anytime, anywhere from your computer or mobile device with
                  our interactive, digital copy of Book II. Learners dive deeper
                  into musical mastery as they explore chords, inversions, complex
                  rhythms, major & minor scales, fingering techniques, intervals,
                  transcribing, writing music, and more!
                </p>
              </div>
              <div className="flex-[1]">
                <button
                  className="bg-primary-purple text-white text-xl block mx-auto my-4 px-10 py-3 rounded-3xl"
                  onClick={handleRead}
                >
                  Read & Practice
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Renders portal only when read is true, guaranteeing clean unmount */}
      {read && (
        <ReaderPortal
          onClose={handleBack}
          pageId={`book_${ebooks[selected]?.id}_page_1`}
        >
          <iframe
            ref={iframeRef}
            key={`reader-iframe-${selected}-${readerSessionId}`}
            src={getEbookUrl()}
            onLoad={handleIframeLoad}
            className="w-full h-screen rounded-lg"
            sandbox="allow-same-origin allow-scripts"
            title={ebooks[selected]?.title}
          />
        </ReaderPortal>
      )}
    </>
  );
}