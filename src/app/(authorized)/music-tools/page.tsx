"use client"
import { authorizedWrapperTitles } from "@/utils/general";
import { nav4leftLinks } from "@/utils/stores";
import AuthorizedWrapper2 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2";
import Image from "next/image";
import { lazy, Suspense, useState } from "react";
import "../../../styles/primary-purple-scrollbar.css";

// Lazy load the tool components for better performance
const VirtualPianoPage = lazy(() => import('@/app/virtual-piano/page'));
const VirtualMetronomePage = lazy(() => import('@/app/virtual-metronome/page'));

// Types
interface MusicToolProps {
    title: string;
    description: string;
    imageSrc: string;
    id: string;
}

interface NavItem {
    label: string;
    id: string;
}

// Components
const MusicToolCard = ({ tool, onClick }: { tool: MusicToolProps; onClick: () => void }) => {
    return (
        <div
            onClick={onClick}
            className="p-1.5 bg-secondary-purple rounded-3xl cursor-pointer"
        >
            <div className="bg-white rounded-3xl p-4">
                <div className="relative h-[163px] w-full mb-4">
                    <Image
                        src={tool.imageSrc}
                        alt={tool.title}
                        fill
                        className="object-contain h-[163px] w-[318px]"
                    />
                </div>
                <h3 className="text-[20px] font-semibold text-primary-brown mb-2">{tool.title}</h3>
                <div className="flex justify-between items-center">
                    <div>

                        <p className="text-lg text-gray-700">{tool.description}</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                        <span>learn more</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

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
                    {item.label}
                </button>
            ))}
        </div>
    );
};

// Placeholder components for future tools
const TimeTracker = () => (
    <div className="bg-white p-8 rounded-3xl shadow-md">
        <h2 className="text-4xl font-semibold text-primary-brown mb-6">Time Tracker</h2>
        <p className="text-2xl mb-4">Track your practice time and set goals to improve your dedication.</p>
        <div className="flex justify-center">
            <div className="relative h-[300px] w-full max-w-3xl">
                <h3 className="text-3xl">Time tracker is Coming Soon</h3>
            </div>
        </div>
        <p className="text-xl mt-6 text-gray-600">Time Tracker component will be implemented in the future.</p>
    </div>
);

const VirtualGuitar = () => (
    <div className="bg-white p-8 rounded-3xl shadow-md">
        <h2 className="text-4xl font-semibold text-primary-brown mb-6">Virtual Guitar</h2>
        <p className="text-2xl mb-4">Learn guitar basics and chord progressions with our interactive virtual guitar.</p>
        <div className="flex justify-center">
            <div className="relative h-[300px] w-full max-w-3xl">
                <h3 className="text-3xl mt-6 text-gray-600">Virtual Guitar is coming soon.</h3>

            </div>
        </div>

    </div>
);

// Loading component for Suspense
const ToolLoading = () => (
    <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
    </div>
);

// Main component
export default function MusicToolsPage() {
    const [activeSection, setActiveSection] = useState<string>("home");

    const navItems: NavItem[] = [
        { label: "Home", id: "home" },
        { label: "Virtual Piano", id: "virtual-piano" },
        { label: "Metronome", id: "metronome" },
        { label: "Time Tracker", id: "time-tracker" },
        { label: "Virtual Guitar", id: "virtual-guitar" },
    ];

    const musicTools: MusicToolProps[] = [
        {
            title: "Virtual Piano",
            description: "Drive into infinite melodies with our Virtual Piano.",
            imageSrc: "/music_tools/Home/piano.svg",
            id: "virtual-piano"
        },
        {
            title: "Metronome",
            description: "Keep time and improve your rhythm with our easy-to-use metronome.",
            imageSrc: "/music_tools/Home/virtualmetronome.svg",
            id: "metronome"
        },
        {
            title: "Time Tracker",
            description: "Track your practice time and set goals to improve your dedication.",
            imageSrc: "/music_tools/Home/timetracker.svg",
            id: "time-tracker"
        },
        {
            title: "Virtual Guitar",
            description: "Learn guitar basics and chord progressions with our interactive virtual guitar.",
            imageSrc: "/dashboard/tone.svg",
            id: "virtual-guitar"
        },
    ];

    // Handle component rendering based on active section
    const renderContent = () => {
        switch (activeSection) {
            case "virtual-piano":
                return (
                    <Suspense fallback={<ToolLoading />}>
                        <div className="tool-container">
                            <VirtualPianoPage />
                        </div>
                    </Suspense>
                );
            case "metronome":
                return (
                    <Suspense fallback={<ToolLoading />}>
                        <div className="tool-container">
                            <VirtualMetronomePage />
                        </div>
                    </Suspense>
                );
            case "time-tracker":
                return <TimeTracker />;
            case "virtual-guitar":
                return <VirtualGuitar />;
            default:
                return (
                    <>
                        <div className="relative w-full mb-8 border-[#ECD6FE] border-b flex justify-around items-center">
                            <div>
                                <h2 className="text-4xl font-medium text-gray-800 mb-4">Music Tools</h2>
                                <p className="text-2xl text-gray-600 mb-4">
                                    Explore, compose, and play with these Virtual Music Tools!
                                </p>
                            </div>
                            <div className="ml-auto mr-2">
                                <Image
                                    src="/auth/smilingcharacter.svg"
                                    alt="Smiling Character"
                                    width={100}
                                    height={100}
                                    className="h-[80px] w-[100px] object-cover transform rotate-[30deg]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {musicTools.map((tool, index) => (
                                <MusicToolCard
                                    key={index}
                                    tool={tool}
                                    onClick={() => setActiveSection(tool.id)}
                                />
                            ))}
                        </div>
                    </>
                );
        }
    };

    return (
        <AuthorizedWrapper2 pageTitle={authorizedWrapperTitles.MusicTools} openedLink={nav4leftLinks.musicTools}>
            <div className="relative flex flex-col h-[75vh] mt-[1.5%] overflow-y-auto z-[30] px-4">
                <NavBar
                    items={navItems}
                    activeItem={activeSection}
                    onItemClick={setActiveSection}
                />

                {renderContent()}
            </div>
        </AuthorizedWrapper2>
    );
}