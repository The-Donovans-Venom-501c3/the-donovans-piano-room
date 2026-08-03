"use client";

import React from "react";
import BackgroundLayout from "./components/BackgroundLayout";
import ContentNav from "./components/ContentNav";
import Navbar1 from "@/components/navbars/Navbar1";
import Footer1 from "@/components/footers/Footer1";
import { navigationPages } from "@/utils/general";
import { usePathname } from "next/navigation";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden">
      {/* 1. Single Top Site Header */}
      <Navbar1 page={navigationPages.about} />

      {/* 2. Main Wrapper Centering All 5 Tabs */}
      <div className="relative z-40 my-10 flex w-full flex-1 flex-col items-center justify-center pt-20 sm:pt-28">
        {/* Fixed Width Container for both Tabs & Main Box */}
        <div className="flex w-[84.7%] flex-col items-center justify-center">
          {/* Sub-Tab Navigation Bar */}
          <ContentNav page={pathname} />

          {/* Main Card Content Box */}
          <main className="min-h-[580px] w-full rounded-b-xl border border-primary-purple bg-[#FEF8EE] p-6 sm:p-10 flex flex-col justify-center">
            {children}
          </main>
        </div>
      </div>

      {/* Background Graphic Elements */}
      <BackgroundLayout />

      {/* 3. Single Bottom Site Footer */}
      <Footer1 />
    </div>
  );
}