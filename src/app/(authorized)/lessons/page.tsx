"use client";

import AuthorizedWrapper2 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2";
import { authorizedWrapperTitles } from "@/utils/general";
import { nav4leftLinks } from "@/utils/stores";
import EbooksComponent from "./components/EbooksComponent";
import VideosComponent from "./components/VideosComponent";
import LiveSessionsComponent from "./components/LiveSessionsComponent";
import { Suspense, useEffect, useRef, useState } from "react";
import { lessons, type Lesson } from "./components/Lesson";
import VideoDetail from "./components/VideoDetailPage";
import { useSearchParams } from "next/navigation";

interface NavItem {
  name: string;
  id: string;
}

const sections: NavItem[] = [
  { name: "E-books", id: "ebooks" },
  { name: "Videos", id: "videos" },
  { name: "Live sessions", id: "live-sessions" },
  { name: "Audiobooks", id: "audiobooks" },
  { name: "Ear training", id: "ear-training" },
];

function LessonsPageContent() {
  const [activeSection, setActiveSection] = useState<string>("videos");
  const [selectedVideo, setSelectedVideo] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const topRef = useRef<HTMLDivElement>(null);

  const idx = selectedVideo
    ? lessons.findIndex((l) => l.id === selectedVideo.id)
    : -1;
  const prevLesson = idx > 0 ? lessons[idx - 1] : null;
  const nextLesson = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null;

  const searchParams = useSearchParams();
  const tabFromURL = searchParams ? searchParams.get("tab") : null;

  useEffect(() => {
    if (tabFromURL && sections.some((sec) => sec.id === tabFromURL)) {
      setActiveSection(tabFromURL);
    }
  }, [tabFromURL]);

  const scrollToTopAnchor = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "instant", block: "start" });
    }
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  };

  const handleSelectVideo = (lesson: Lesson | null) => {
    setSelectedVideo(lesson);
    scrollToTopAnchor();
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // When the user types or edits the search input, 
    // close the detail player view to show the filtered grid instead!
    if (selectedVideo) {
      setSelectedVideo(null);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "videos":
        if (selectedVideo) {
          return (
            <VideoDetail
              lesson={selectedVideo}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onBack={() => {
                setSelectedVideo(null);
                setSearchQuery(""); // Clear search on back
              }}
              onPrev={() => prevLesson && handleSelectVideo(prevLesson)}
              onNext={() => nextLesson && handleSelectVideo(nextLesson)}
            />
          );
        }
        return (
          <VideosComponent
            lessons={lessons}
            searchQuery={searchQuery}
            onSelectLesson={(lesson) => handleSelectVideo(lesson)}
          />
        );

      case "ebooks":
        return <EbooksComponent searchQuery={searchQuery} />;

      case "live-sessions":
        return <LiveSessionsComponent searchQuery={searchQuery} />;

      case "audiobooks":
        return (
          <div className="p-6 text-[#3F3B3C] text-lg font-medium text-center py-12">
            Audiobooks coming soon
          </div>
        );

      case "ear-training":
        return (
          <div className="p-6 text-[#3F3B3C] text-lg font-medium text-center py-12">
            Ear training coming soon
          </div>
        );

      default:
        return null;
    }
  };

  const currentTabName =
    sections.find((s) => s.id === activeSection)?.name || "lessons";

  return (
    <AuthorizedWrapper2
      pageTitle={authorizedWrapperTitles.Lessons}
      openedLink={nav4leftLinks.lessons}
    >
      <div ref={topRef} />

      <div className="w-full flex flex-col min-h-screen pb-32">
        <NavBar
          items={sections}
          activeItem={activeSection}
          activeTabName={currentTabName}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onItemClick={(id) => {
            setActiveSection(id);
            setSelectedVideo(null);
            setSearchQuery("");
            scrollToTopAnchor();
          }}
        />

        {renderContent()}
      </div>
    </AuthorizedWrapper2>
  );
}

const NavBar = ({
  items,
  activeItem,
  activeTabName,
  searchQuery,
  onSearchChange,
  onItemClick,
}: {
  items: NavItem[];
  activeItem: string;
  activeTabName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onItemClick: (id: string) => void;
}) => {
  return (
    <div className="w-full max-w-[1112px] mx-auto relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-[#ECD6FE] px-6 py-4 rounded-2xl shadow-xs">
      {/* Navigation Tabs */}
      <div className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
        {items.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`px-6 py-3 rounded-2xl text-lg md:text-xl font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-[#D8BCFD] text-[#6F219E] shadow-sm font-extrabold"
                  : "bg-transparent text-[#3F3B3C] hover:text-[#6F219E]"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Dynamic Search Box */}
      <div className="relative w-full sm:w-72 md:w-88 shrink-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${activeTabName.toLowerCase()}...`}
          className="w-full bg-[#FFFDF7] border border-[#3F3B3C]/25 text-[#3F3B3C] placeholder-[#7A6E82] text-base md:text-lg font-medium px-5 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F219E]/40 transition-all shadow-xs"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6F219E]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function LessonsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xl text-[#3F3B3C]">Loading...</div>}>
      <LessonsPageContent />
    </Suspense>
  );
}