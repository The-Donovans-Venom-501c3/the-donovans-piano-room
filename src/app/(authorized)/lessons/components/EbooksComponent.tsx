"use client";

import { useState, useEffect } from "react";
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
  const [read, setRead] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [readerSessionId, setReaderSessionId] = useState<number>(Date.now());

  const q = searchQuery.toLowerCase().trim();

  const filteredEbooks = ebooks.filter((book) =>
    book.title.toLowerCase().includes(q)
  );

  const handleRead = () => {
    setCurrentPage(1); // Reset page state to page 1
    setReaderSessionId(Date.now()); // Generate a fresh session ID to force-reload iframe
    setRead(true);
  };

  const handleBack = () => {
    setRead(false);
  };

  // Listen for page-change postMessage events emitted by the iframe viewer
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

  return (
    <>
      <h2 className="text-4xl font-medium text-primary-brown mb-4">E-books</h2>

      {read ? (
        <div>
          <button onClick={handleBack} className="mb-4 text-purple-700 font-medium">
            &larr; Go Back to All Books
          </button>
          
          <ReaderPortal 
            onClose={() => setRead(false)}
            pageId={`book_${ebooks[selected]?.id}_page_${currentPage}`}
          >
            <iframe
              key={`reader-iframe-${selected}-${readerSessionId}`}
              src={ebooks[selected]?.url}
              className="w-full h-screen rounded-lg"
              sandbox="allow-same-origin allow-scripts"
              title={ebooks[selected]?.title}
            />
          </ReaderPortal>
        </div>
      ) : filteredEbooks.length === 0 ? (
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
    </>
  );
}