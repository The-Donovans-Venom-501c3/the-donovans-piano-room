"use client";
import Contact from "@/app/(authorized)/contact-page/components/Contact";
import ContactUsContentWrapper from "@/components/ContentWrappers/contact-us/contact-us-wrapper2";

export default function ContactUs() {
  return (
    <div className="flex h-screen w-screen">
      {/* Main Content Wrapper */}
      <div className="flex flex-1 flex-col">
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