"use client";
import AuthorizedWrapper2 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2"
import { authorizedWrapperTitles } from "@/utils/general";
import { nav4leftLinks } from "@/utils/stores";
import EbooksComponent from "./components/EbooksComponent";
import VideosComponent from "./components/VideosComponent";
import LiveSessionsComponent from "./components/LiveSessionsComponent";
import { useState } from "react";
import { lessons, Lesson } from "./components/Lesson";
import VideoDetail from "./components/VideoDetailPage";

interface NavItem {
    name: string;
    id: string;
    element: React.ReactNode
}

const sections: NavItem[] = [
    {
        name: "E-books",
        id: "ebooks",
        element: <EbooksComponent />
    },
    {
        name: "Videos",
        id: "videos",
        element: null as any
    },
    {
        name: "Live sessions",
        id: "live-sessions",
        element: <LiveSessionsComponent />
    }
];

const LessonsPage = () => {
    const [activeSection, setActiveSection] = useState<string>("ebooks");
    
    // logic for lessons navigation setting
    const [selectedVideoId, setSelectedVideoId] = useState<Lesson | null>(null);
    const idx = selectedVideoId
        ? lessons.findIndex((l) => l.id === selectedVideoId.id)
        : -1
    const prevLesson = idx > 0 ? lessons[idx - 1] : null
    const nextLesson = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null
    
    // Set section to video list if videoId is null, if not -> redirect to VideoDetails
    const section =  
        activeSection === "videos"
        ? selectedVideoId
            ? < VideoDetail lesson={selectedVideoId} prevLesson={prevLesson} nextLesson={nextLesson}
            onBack={() => setSelectedVideoId(null)} onPrev={() => prevLesson && setSelectedVideoId(prevLesson)}
            onNext={() => nextLesson && setSelectedVideoId(nextLesson)}  />
            : < VideosComponent onSelectVideo={setSelectedVideoId} /> : sections.find(s => s.id === activeSection)?.element;
    
    // Main Component
    
    return (
        <AuthorizedWrapper2 pageTitle={authorizedWrapperTitles.Lessons} openedLink={nav4leftLinks.lessons}>
            <div className="flex flex-col h-[75vh] mt-[20px] overflow-y-auto">
                <NavBar items={sections} activeItem={activeSection} onItemClick={id => {
                    setActiveSection(id);
                    setSelectedVideoId(null);      // reset if switching tabs
                    }} />
                {section}
            </div>
        </AuthorizedWrapper2>
    )
}

const NavBar = ({ items, activeItem, onItemClick }: {
    items: NavItem[];
    activeItem: string;
    onItemClick: (id: string) => void
}) => {
    return (
        <div className="flex flex-wrap gap-2.5 mb-8 bg-[#ECD6FE] px-8 py-6 rounded-xl">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onItemClick(item.id)}
                    className={`px-4 py-1 rounded-xl text-lg font-medium transition-colors ${activeItem === item.id
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

export default LessonsPage;