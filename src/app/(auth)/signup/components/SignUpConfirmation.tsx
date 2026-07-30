"use client";

import Image from "next/image";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { membershipChoiceAtom, membershipTypes } from "@/utils/stores";

interface SignUpConfirmationProps {
  isBeta?: boolean;
}

const membershipLabels: Record<string, string> = {
  [membershipTypes["24-hours"]]: "24-Hour access",
  [membershipTypes["monthly-access"]]: "Monthly access",
  [membershipTypes["yearly-access"]]: "Yearly access",
  [membershipTypes["basic-access"]]: "Basic access",
  [membershipTypes["scholarship"]]: "Free Beta access",
};

export default function SignUpConfirmation({ isBeta = false }: SignUpConfirmationProps) {
  const membershipChoice = useAtomValue(membershipChoiceAtom);
  const activeAccessLabel = membershipChoice
    ? membershipLabels[membershipChoice] || "Free Beta access"
    : "Free Beta access";

  return (
    <div className="w-full min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 relative overflow-hidden select-none">
      
      {/* Frame 355: 384px Fixed Width Container */}
      <div className="relative z-10 w-[384px] max-w-full flex flex-col gap-[36px] items-start text-left">

        {/* --- GRAPHICS CLUSTER --- */}
        
        {/* Allegro Mascot: Shifted Up (top: 115px) | Rotation -8.21deg */}
        <div 
          className="absolute -left-[185px] top-[115px] w-[154px] h-[114px] pointer-events-none hidden md:block z-20"
          style={{ transform: "rotate(-8.21deg)" }}
        >
          <Image
            src="/images/Allegro.svg"
            alt="Allegro Character"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Bottom Stars: Your exact positioning & tilt */}
        <div 
          className="absolute -left-[145px] top-[215px] w-[118px] h-[111px] pointer-events-none hidden md:block z-10"
          style={{ transform: "rotate(-8.21deg)" }}
        >
          <Image
            src="/images/LeftStars.svg"
            alt="Left Stars"
            fill
            className="object-contain"
          />
        </div>

        {/* Top Stars: Rotated 150 degrees & positioned near 'Hurray!' */}
        <div 
          className="absolute right-[20px] top-[10px] w-[118px] h-[111px] pointer-events-none hidden md:block z-0"
          style={{ transform: "rotate(150deg)" }}
        >
          <Image
            src="/images/RightStars.svg"
            alt="Right Stars"
            fill
            className="object-contain"
          />
        </div>


        {/* --- CONTENT ITEM 1: HEADING --- */}
        <h1 className="text-[50px] leading-[70px] font-semibold text-white tracking-normal font-[Montserrat]">
          Hurray! <br />
          You’re in
        </h1>

        {/* --- CONTENT ITEM 2: DESCRIPTION TEXT --- */}
        <div className="w-full min-h-[168px] space-y-4 text-purple-100 font-normal text-[16px] leading-[24px]">
          <p>Your account has been successfully created and verified.</p>
          <p>
            With your {activeAccessLabel} now active you can start exploring The Piano Room!
          </p>
          <p className="text-purple-100">
            Please Log in to start your experience.
          </p>
        </div>

        {/* --- CONTENT ITEM 3: LOG IN BUTTON --- */}
        <div className="w-full">
          <Link
            href="/login"
            className="block w-full py-3.5 px-6 rounded-full bg-[#FFD028] hover:bg-[#eab308] text-black font-extrabold text-[16px] transition-all shadow-md text-center"
          >
            Log in
          </Link>
        </div>

      </div>
    </div>
  );
}