import React from "react";
import AboutMembershipNav from "../../components/AboutMembershipNav";
import { aboutScholarshipNavigation } from "@/utils/general";
import Image from "next/image";

export default function WhatsIncludedContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-10">
      <h2 className="text-6xl font-semibold text-primary-brown 3xl:text-7xl 4xl:text-8xl text-center">
        Unlock Potential with Scholarship Power!
      </h2>
      <AboutMembershipNav page={aboutScholarshipNavigation.whatsIncluded} />
      <div className="mt-5 gap-y-10 grid grid-cols-1 [@media(min-width:470px)]:grid-cols-2 md:grid-cols-3 md2:grid-cols-4 h-[full] w-full justify-items-center p-5">
        <div className="h-full w-[170px] xl2:w-[250px] rounded-3xl border-4 border-[#FCF0D8] bg-white p-5">
          <Image
            src="/about/scholarship/what-is-included/Icon1.svg"
            height={50}
            width={50}
            alt=""
          />
          <h4 className="mt-4 text-2xl font-semibold laptop:mt-8 laptop:text-3xl desktop:text-5xl">
            Free Access to The Donovan&apos;s Piano Room
          </h4>
          <p className="mt-4 laptop:mt-8 laptop:text-2xl desktop:text-3xl">
            Students are provided with complimentary access to The
            Donovan&apos;s Piano Room, where they can engage in various
            activities related to music learning.
          </p>
        </div>
        <div className="h-full  w-[170px] xl2:w-[250px] rounded-3xl border-4 border-[#FCF0D8] bg-white p-5">
          <Image
            src="/about/scholarship/what-is-included/Icon2.svg"
            height={50}
            width={50}
            alt=""
          />
          <h4 className="mt-4 text-2xl font-semibold laptop:mt-8 laptop:text-3xl desktop:text-5xl">
            Range of Learning Opportunities
          </h4>
          <p className="mt-4 laptop:mt-8 laptop:text-2xl desktop:text-3xl">
            Students learn various musical skills such as piano, guitar, vocals,
            sight reading, and music theory through lessons, games, books, and
            other resources provided.
          </p>
        </div>
        <div className="h-full  w-[170px] xl2:w-[250px] rounded-3xl border-4 border-[#FCF0D8] bg-white p-5">
          <Image
            src="/about/scholarship/what-is-included/Icon3.svg"
            height={50}
            width={50}
            alt=""
          />
          <h4 className="mt-4 text-2xl font-semibold laptop:mt-8 laptop:text-3xl desktop:text-5xl">
            Inclusive Learning Environment
          </h4>
          <p className="mt-4 laptop:mt-8 laptop:text-2xl desktop:text-3xl">
            The program welcomes students of all levels, indicating that it
            caters to beginners as well as those with prior musical experience.
          </p>
        </div>
        <div className="h-full  w-[170px] xl2:w-[250px] rounded-3xl border-4 border-[#FCF0D8] bg-white p-5">
          <Image
            src="/about/scholarship/what-is-included/Icon4.svg"
            height={50}
            width={50}
            alt=""
          />
          <h4 className="mt-4 text-2xl font-semibold laptop:mt-8 laptop:text-3xl desktop:text-5xl">
            Flexible Learning <br /> Options
          </h4>
          <p className="mt-4 laptop:mt-8 laptop:text-2xl desktop:text-3xl">
            Classes are offered both in-person and virtually, providing
            flexibility for students to choose the mode of learning that best
            suits their needs.
          </p>
        </div>
      </div>
    </div>
  );
}
