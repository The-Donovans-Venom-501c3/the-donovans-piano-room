"use client";
import Contact from "@/app/(authorized)/contact-page/components/Contact";
import Navbar4Left from "@/components/navbars/Navbar4Left";
import { nav4leftLinks } from "@/utils/stores";
import Footer3 from "@/components/footers/Footer3";
import ContactUsContentWrapper from "@/components/ContentWrappers/contact-us/contact-us-wrapper";

export default function ContactUs() {
  return (
   /* <div className="flex min-h-screen">
      <Navbar4Left openedLink={nav4leftLinks.contactUs} />
      <ContactUsContentWrapper>
        <Contact />
      </ContactUsContentWrapper>
      <Footer3 />
    </div> */

    <div className="flex w-screen h-screen">
      {/* Sidebar */ }
      <div className="w-[80px] bg-purple-700">
        <Navbar4Left openedLink={nav4leftLinks.contactUs} />
      </div>

      {/* Main Content Wrapper with styling */ }
      <div className="flex-1 flex flex-col">
        {/* Top Content Section */ }
        <div className="flex-1 overflow-auto">
          <div className="h-full w-full overflow-hidden">
            <ContactUsContentWrapper>
              <Contact />
            </ContactUsContentWrapper>
          </div>
        </div>

        {/* Footer */ }
        <div className="bg-yellow-400">
          <Footer3 />
        </div>
      </div>
    </div> 

  );
}