"use client";
import AuthorizedWrapper2 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2";
import { authorizedWrapperTitles } from "@/utils/general";
import { guestUser, modalShow, nav4leftLinks } from "@/utils/stores";
import EbooksComponent from "./components/EbooksComponent";
import VideosComponent from "./components/VideosComponent";
import LiveSessionsComponent from "./components/LiveSessionsComponent";
import { useEffect, useLayoutEffect, useState } from "react";
import { lessons, Lesson } from "./components/Lesson";
import VideoDetail from "./components/VideoDetailPage";
import { useAtomValue, useSetAtom } from "jotai";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
interface NavItem {
  name: string;
  id: string;
  element: React.ReactNode;
}

const sections: NavItem[] = [
  {
    name: "E-books",
    id: "ebooks",
    element: <EbooksComponent />,
  },
  {
    name: "Videos",
    id: "videos",
    element: null as any,
  },
  {
    name: "Live sessions",
    id: "live-sessions",
    element: <LiveSessionsComponent />,
  },
];

const Page = () => {
  const [activeSection, setActiveSection] = useState<string>("ebooks");
  const router = useRouter();
  const guest_user = useAtomValue(guestUser);
  const setShowModal = useSetAtom(modalShow);
  // logic for lessons navigation setting
  const [selectedVideoId, setSelectedVideoId] = useState<Lesson | null>(null);
  const idx = selectedVideoId
    ? lessons.findIndex((l) => l.id === selectedVideoId.id)
    : -1;
  const prevLesson = idx > 0 ? lessons[idx - 1] : null;
  const nextLesson =
    idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null;

  // Set section to video list if videoId is null, if not -> redirect to VideoDetails
  const section =
    activeSection === "videos" ? (
      selectedVideoId ? (
        <VideoDetail
          lesson={selectedVideoId}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          onBack={() => setSelectedVideoId(null)}
          onPrev={() => prevLesson && setSelectedVideoId(prevLesson)}
          onNext={() => nextLesson && setSelectedVideoId(nextLesson)}
        />
      ) : (
        <VideosComponent onSelectVideo={setSelectedVideoId} />
      )
    ) : (
      sections.find((s) => s.id === activeSection)?.element
    );

  // Main Component

  return (
    <AuthorizedWrapper2
      pageTitle={authorizedWrapperTitles.Lessons}
      openedLink={nav4leftLinks.lessons}
    >
      <div className="mt-[20px] flex h-[75vh] flex-col overflow-y-auto">
        <NavBar
          items={sections}
          activeItem={activeSection}
          onItemClick={(id) => {
            setActiveSection(id);
            setSelectedVideoId(null); // reset if switching tabs
          }}
        />
        {section}
      </div>
    </AuthorizedWrapper2>
  );
};

const NavBar = ({
  items,
  activeItem,
  onItemClick,
}: {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
}) => {
  return (
    <div className="mb-8 flex flex-wrap gap-2.5 rounded-xl bg-[#ECD6FE] px-8 py-6">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onItemClick(item.id)}
          className={`rounded-xl px-4 py-1 text-lg font-medium transition-colors ${
            activeItem === item.id
              ? "bg-[#D8BCFD] text-[#6F219E]"
              : "bg-transparent text-[#3F3B3C] hover:bg-purple-100"
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default Page;
