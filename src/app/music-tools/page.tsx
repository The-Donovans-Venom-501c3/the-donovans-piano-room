"use client";

import { useState } from "react";
import Image from "next/image";
import AuthorizedWrapper2 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2";
import { nav4leftLinks } from "@/utils/stores";
import MetronomePage from "./virtual-metronome/page";
import PianoPage from "./virtual-piano/page";

interface NavItem {
  name: string;
  id: "home" | "metronome" | "piano";
}

interface ToolCard {
  title: string;
  id: "metronome" | "piano";
  imageSrc: string;
  description: string;
}

const sections: NavItem[] = [
  { name: "Home", id: "home" },
  { name: "Metronome", id: "metronome" },
  { name: "Virtual piano", id: "piano" },
];

const tools: ToolCard[] = [
  {
    title: "Metronome",
    id: "metronome",
    imageSrc: "/auth/smilingcharacter.svg",
    description: "Keep perfect tempo and rhythm with customizable BPM settings.",
  },
  {
    title: "Virtual Piano",
    id: "piano",
    imageSrc: "/auth/smilingcharacter.svg",
    description: "Practice interactive short and long virtual keyboards.",
  },
];

export default function MusicToolsPage() {
  const [activeTab, setActiveTab] = useState<"home" | "metronome" | "piano">("home");

  return (
    <AuthorizedWrapper2
      pageTitle="Music tools"
      openedLink={nav4leftLinks.musicTools}
    >
      <div className="w-full flex flex-col min-h-screen pb-32">
        {/* Navigation Bar Header */}
        <div className="w-full max-w-[1112px] mx-auto relative z-20 flex items-center justify-between gap-4 mb-6 bg-[#ECD6FE] px-6 py-4 rounded-2xl shadow-xs">
          <div className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto w-full scrollbar-none py-1">
            {sections.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
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
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-[1112px] mx-auto bg-white rounded-3xl p-6 md:p-12 shadow-sm">
          {activeTab === "home" && (
            <div className="flex flex-col items-center text-center py-6">
              <h2 className="text-4xl md:text-5xl font-black text-[#2D1B4E] mb-3">
                Explore Music Tools
              </h2>
              <p className="text-[#5C4D75] text-lg md:text-xl font-medium mb-12">
                Select an instrument tool below to jump straight in
              </p>

              {/* Large Clickable Tool Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl px-2">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setActiveTab(tool.id)}
                    className="group bg-[#FCF0D8]/50 hover:bg-[#F3E2FF] border-2 border-[#ED9E4A]/40 hover:border-[#6F219E] rounded-[36px] p-10 md:p-12 flex flex-col items-center text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl min-h-[440px]"
                  >
                    {/* Icon Container */}
                    <div className="w-44 h-44 relative mb-8 flex items-center justify-center bg-white rounded-3xl p-5 shadow-xs group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={tool.imageSrc}
                        alt={tool.title}
                        width={160}
                        height={160}
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black text-[#2D1B4E] mb-3">
                      {tool.title}
                    </h3>
                    <p className="text-base md:text-lg font-medium text-[#5C4D75] mb-8 leading-relaxed max-w-sm">
                      {tool.description}
                    </p>

                    <span className="mt-auto bg-[#6B109B] text-white px-10 py-4 rounded-full font-extrabold text-lg group-hover:bg-[#520B78] transition-colors shadow-md">
                      Open Tool →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "metronome" && <MetronomePage />}
          {activeTab === "piano" && <PianoPage />}
        </div>
      </div>
    </AuthorizedWrapper2>
  );
}