import React from 'react'
import BackgroundContactUs from './background-contact-us'
import { nav4leftLinks } from "@/utils/stores";
import Navbar4Left from "../../navbars/Navbar4Left";
import Footer5 from "@/components/footers/Footer5";

export default function ContactUsContentWrapper({ children, openedLink = "" }: { children: React.ReactNode, openedLink?: string }) {
  return (
    <div className="flex w-screen h-screen bg-primary-yellow relative overflow-hidden">
      {/* Sidebar */}
      <Navbar4Left openedLink={nav4leftLinks.contactUs} />

      {/* Main content area */}
      <div className="w-full relative z-10">
        <div className="h-[80.8vh] flex justify-center items-end pt-16">
          <div className="w-full relative">
            {children}
          </div>
        </div>
        {/* Footer */ }
        <div className="absolute bottom-0 w-full">
          <Footer5 />
        </div>
      </div>

      {/* Background fixed to right side of screen */}
      <div className="absolute top-0 right-0 bottom-0 w-full z-0 pointer-events-none">
        <BackgroundContactUs />
      </div>
    </div>
  );
}