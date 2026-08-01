import React from "react";
import AboutMembershipNav from "../../components/AboutMembershipNav";
import { aboutScholarshipNavigation } from "@/utils/general";
import Image from "next/image";

export default function WhatsIncludedContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-10">
      <h2 className="text-center text-6xl font-semibold text-primary-brown 3xl:text-7xl 4xl:text-8xl">
        Unlock Potential with Scholarship Power!
      </h2>
      <AboutMembershipNav page={aboutScholarshipNavigation.whatsIncluded} />
      
      {/* 4-column grid on desktop (lg:grid-cols-4), responsive gap and full width */}
      <div className="mt-5 grid h-full w-full grid-cols-1 gap-4 [@media(min-width:470px)]:grid-cols-2 lg:grid-cols-4 xl:gap-6 justify-items-center p-2">
        
        {/* Card 1 */}
        <div className="flex h-full w-full flex-col rounded-3xl border-4 border-[#FCF0D8] bg-white p-5">
          <Image
            src="/about/scholarship/what-is-included/Icon1.svg"
            height={50}
            width={50}
            alt=""
          />
          <h4 className="mt-4 text-2xl font-semibold laptop:mt-6 laptop:text-3xl desktop:text-4xl">
            Free Access to The Donovan&apos;s Piano Room
          </h4>
          <p className="mt-4 laptop:mt-6 laptop:text-xl desktop:text-2xl leading-relaxed">
            Students are provided with complimentary access to The
            Donovan&apos;s Piano Room, where they can engage in various
            activities related to music learning.
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex h-full w-full flex-col rounded-3xl border-4 border-[#FCF0D8] bg-white p-5">
          <Image
            src="/about/scholarship/what-is-included/Icon2.svg"
            height={50}
            width={50}
            alt=""
          />
          <h4 className="mt-4 text-2xl font-semibold laptop:mt-6 laptop:text-3xl desktop:text-4xl">
            Range of Learning Opportunities
          </h4>
          <p className="mt-4 laptop:mt-6 laptop:text-xl desktop:text-2xl leading-relaxed">
            Students learn various musical skills such as piano, guitar, vocals,
            sight reading, and music theory through lessons, games, books, and
            other resources provided.
          </p>
        </div>

        {/* Card 3 */}
        <div className="flex h-full w-full flex-col rounded-3xl border-4 border-[#FCF0D8] bg-white p-5">
          <Image
            src="/about/scholarship/what-is-included/Icon3.svg"
            height={50}
            width={50}
            alt=""
          />
          <h4 className="mt-4 text-2xl font-semibold laptop:mt-6 laptop:text-3xl desktop:text-4xl">
            Inclusive Learning Environment
          </h4>
          <p className="mt-4 laptop:mt-6 laptop:text-xl desktop:text-2xl leading-relaxed">
            The program welcomes students of all levels, indicating that it
            caters to beginners as well as those with prior musical experience.
          </p>
        </div>

        {/* Card 4 */}
        <div className="flex h-full w-full flex-col rounded-3xl border-4 border-[#FCF0D8] bg-white p-5">
          <Image
            src="/about/scholarship/what-is-included/Icon4.svg"
            height={50}
            width={50}
            alt=""
          />
          <h4 className="mt-4 text-2xl font-semibold laptop:mt-6 laptop:text-3xl desktop:text-4xl">
            Flexible Learning <br /> Options
          </h4>
          <p className="mt-4 laptop:mt-6 laptop:text-xl desktop:text-2xl leading-relaxed">
            Classes are offered both in-person and virtually, providing
            flexibility for students to choose the mode of learning that best
            suits their needs.
          </p>
        </div>

      </div>
    </div>
  );
}