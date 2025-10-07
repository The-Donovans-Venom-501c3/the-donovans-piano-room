"use client";
import Contact from "@/app/(authorized)/contact-page/components/Contact";
import ContactUsContentWrapper from "@/components/ContentWrappers/contact-us/contact-us-wrapper2";

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
      {/* Main Content Wrapper with styling */}
      <div className="flex-1 flex flex-col">
        {/* Top Content Section */}
        <div className="flex-1 overflow-auto">
          <div className="h-full w-full overflow-hidden">
            <ContactUsContentWrapper>
              <Contact />
            </ContactUsContentWrapper>
          </div>
        </div>
      </div>
    </div>

  );
}