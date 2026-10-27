"use client";

import AuthorizedWrapper2 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2";
import { authorizedWrapperTitles } from "@/utils/general";
import { nav4leftLinks } from "@/utils/stores";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Calendar from "./components/Calendar";
import CouponsAdmin from "./components/CouponsAdmin";
import NotificationsAdmin from "./components/NotificationsAdmin";
import RbacViewer from "./components/RbacViewer";
import RbacManager from "./components/RbacManager";

interface NavItem {
  name: string;
  id: string;
}

type SectionId = "calendar" | "coupons" | "notifications" | "rbacviewer" | "rbacmanager";

const sections: NavItem[] = [
  { name: "Calendar", id: "calendar" },
  { name: "Coupons", id: "coupons" },
  { name: "Notifications", id: "notifications" },
  { name: "RBAC Viewer", id: "rbacviewer" },
  { name: "RBAC Manager", id: "rbacmanager" },
];

function AdminPageContent() {
  const [activeSection, setActiveSection] = useState<SectionId>("calendar");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchParams = useSearchParams();
  const tabFromURL = searchParams ? searchParams.get("tab") : null;

  useEffect(() => {
    if (tabFromURL && sections.some((section) => section.id === tabFromURL)) {
      setActiveSection(tabFromURL as SectionId);
    }
  }, [tabFromURL]);

  const scrollToTopAnchor = () => {
    document.getElementById("wrapper-content-scroll")?.scrollTo({ top: 0, behavior: "instant" });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "calendar":
        return <Calendar />;
      case "coupons":
        return <CouponsAdmin />;
      case "notifications":
        return <NotificationsAdmin />;
      case "rbacviewer":
        return <RbacViewer />;
      case "rbacmanager":
        return <RbacManager />;
      default:
        return null;
    }
  };

  const currentTabName =
    sections.find((s) => s.id === activeSection)?.name || "admin";

  return (
    <AuthorizedWrapper2
      pageTitle={authorizedWrapperTitles.Admin}
      openedLink={nav4leftLinks.admin}
      contentHeader={
        <NavBar
          items={sections}
          activeItem={activeSection}
          activeTabName={currentTabName}
          searchQuery={searchQuery}
          //onSearchChange={handleSearchChange}
          onItemClick={(id) => {
            setActiveSection(id as SectionId);
           // setSelectedVideo(null);
            setSearchQuery("");
            scrollToTopAnchor();
          }}
        />
      }
    >
      <div className="w-full flex flex-col min-h-screen pb-32">
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
  //onSearchChange,
  onItemClick,
}: {
  items: NavItem[];
  activeItem: string;
  activeTabName: string;
  searchQuery: string;
  //onSearchChange: (query: string) => void;
  onItemClick: (id: string) => void;
}) => {
  return (
    <nav aria-label="Admin sections" className="w-full max-w-[1112px] mx-auto relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#ECD6FE] px-6 py-4 rounded-2xl shadow-xs">
      {/* Navigation Tabs */}
      <div className="flex min-w-0 sm:flex-1 items-center space-x-6 sm:space-x-8 overflow-x-auto w-full scrollbar-none py-1">
        {items.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
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
          //onChange={(e) => onSearchChange(e.target.value)}
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
    </nav>
  );
};

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xl text-[#3F3B3C]">Loading...</div>}>
      <AdminPageContent />
    </Suspense>
  );
}