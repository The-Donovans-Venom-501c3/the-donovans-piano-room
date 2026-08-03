"use client";

import Contact from "@/app/(authorized)/contact-page/components/Contact";
import ContactUsContentWrapper from "@/components/ContentWrappers/contact-us/contact-us-wrapper2";
import { profileAtom } from "@/utils/stores";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ContactDashboardPage() {
  const profile = useAtomValue(profileAtom);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is properly logged in
    if (!profile || !profile.id) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [profile, router]);

  // Block rendering dashboard layout if logged out
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen">
      <div className="flex flex-1 flex-col">
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