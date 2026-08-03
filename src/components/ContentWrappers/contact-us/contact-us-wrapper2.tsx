"use client";

import React from 'react';
import BackgroundContactUs from './background-contact-us';
import { nav4leftLinks } from "@/utils/stores";
import Navbar4Left from "../../navbars/Navbar4Left";
import Footer5 from "@/components/footers/Footer5";
import Profile from "@/components/atoms/Profile"; // Import your working Profile atom

export default function ContactUsContentWrapper({
  children,
  openedLink = nav4leftLinks.contactUs
}: {
  children: React.ReactNode,
  openedLink?: string
}) {
  return (
    <div className="flex w-screen h-screen bg-[#8B24CC] relative overflow-hidden">
      {/* Sidebar */}
      <Navbar4Left openedLink={openedLink} />

      {/* Main layout: column */}
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="relative z-40 h-[9.7vh] border-b border-purple-800 bg-purple-800/20 flex justify-center items-center backdrop-blur-sm">
          <div className="w-[84.7%] flex justify-between items-center">
            <h1 className="text-white text-5xl 3xl:text-6xl 4xl:text-7xl font-montserrat font-medium">
              Contact
            </h1>
            
            {/* ✅ FIXED: Replaced custom broken image div with shared Profile component */}
            <Profile />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex justify-center items-center overflow-auto">
          <div className="w-full relative z-10">
            {children}
          </div>
        </div>

        {/* Footer (always bottom) */}
        <Footer5 />
      </div>

      {/* Background fixed to right side of screen */}
      <div className="absolute top-0 right-0 bottom-0 w-full z-0 pointer-events-none">
        <BackgroundContactUs />
      </div>
    </div>
  );
}