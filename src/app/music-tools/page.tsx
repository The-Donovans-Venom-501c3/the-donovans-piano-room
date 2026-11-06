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
    title: "Virtual piano",
    id: "piano",
    imageSrc: "/music_tools/Home/Tool type=Piano.svg",
    description: "Dive into infinite melodies with our Virtual Piano.",
  },
  {
    title: "Metronome",
    id: "metronome",
    imageSrc: "/music_tools/Home/Tool type=Metronome.svg",
    description: "Precision and rhythm at your fingertips with our Metronome.",
  },
];

export default function MusicToolsPage() {
  const [activeTab, setActiveTab] = useState<"home" | "metronome" | "piano">("home");
  const [hoveredTool, setHoveredTool] = useState<string | null>("metronome");

  return (
    <AuthorizedWrapper2
      pageTitle="Music tools"
      openedLink={nav4leftLinks.musicTools}
    >
      <div className="w-full flex flex-col min-h-screen pb-32">
        {/* Navigation Bar Header */}
        <div className="w-full max-w-[1200px] mx-auto relative z-20 flex items-center justify-between gap-4 mb-8 bg-[#ECD6FE] px-4 py-3 rounded-2xl shadow-xs">
          <div className="flex items-center space-x-4 overflow-x-auto w-full scrollbar-none">
            {sections.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-8 py-2.5 rounded-xl text-base md:text-lg font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-[#D8BCFD] text-[#6F219E] shadow-xs font-extrabold"
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
        <div className="w-full max-w-[1200px] mx-auto">
          {activeTab === "home" && (
            <div className="flex flex-col items-start py-2">
              {/* Header Title & Subtitle */}
              <h2 className="text-4xl md:text-5xl font-black text-[#381E11] mb-2 tracking-tight">
                Music tools
              </h2>
              <p className="text-[#381E11]/80 text-xl md:text-2xl font-medium mb-10">
                Explore, compose, and play with these Virtual Music Tools!
              </p>

              {/* Tool Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {tools.map((tool) => {
                  const isSelected = hoveredTool === tool.id;

                  return (
                    <div
                      key={tool.id}
                      onClick={() => setActiveTab(tool.id)}
                      onMouseEnter={() => setHoveredTool(tool.id)}
                      className={`group relative rounded-[32px] p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 border-4 min-h-[420px] ${
                        isSelected
                          ? "bg-[#E2C3FF] border-[#6F219E] shadow-lg"
                          : "bg-white border-white hover:border-[#E2C3FF] shadow-sm"
                      }`}
                    >
                      {/* Image Preview Area */}
                      <div className="w-full h-[260px] bg-[#FAF5EE] rounded-2xl p-4 flex items-center justify-center overflow-hidden mb-6">
                        <Image
                          src={tool.imageSrc}
                          alt={tool.title}
                          width={400}
                          height={240}
                          className="object-contain max-h-full w-auto transition-transform duration-300 group-hover:scale-102"
                          unoptimized
                        />
                      </div>

                      {/* Text & Button Footer Area */}
                      <div className="flex items-end justify-between gap-4 w-full px-2 pb-2">
                        <div className="flex flex-col max-w-[80%]">
                          <h3 className="text-2xl md:text-3xl font-black text-[#2B170C] mb-2">
                            {tool.title}
                          </h3>
                          <p className="text-base md:text-lg font-semibold text-[#3F3B3C]/80 leading-snug">
                            {tool.description}
                          </p>
                        </div>

                        {/* Circular Arrow Button */}
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#6F219E] hover:bg-[#581880] flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-110">
                          <span className="text-white text-2xl font-bold">
                            &#8250;
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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