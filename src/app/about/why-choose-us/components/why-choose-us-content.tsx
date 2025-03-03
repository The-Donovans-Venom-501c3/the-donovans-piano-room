import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function WhyChooseUsContent() {
  return (
    <div className="flex h-full flex-col justify-evenly space-y-10 lg:flex-row xl:justify-center">
      <div className="flex items-center justify-center xl:flex-1">
        <div className=" w-[485px] lg:w-[300px]">
          <h2 className=" font-montserrat text-5xl font-semibold text-primary-brown max-lg:text-center lg:text-6xl 3xl:text-7xl 4xl:text-8xl">
            Boost your <br className=" hidden lg:block" /> musical abilities
          </h2>
          <p className="mt-4 text-2xl text-primary-gray max-lg:text-center">
            From learning to read music on the fly to mastering essential chords
            and scales, understanding rhythm basics, diving into music theory,
            preparing for college, and honing instrument skills, our program
            offers a well-rounded approach to musical growth.
          </p>
          <div className="mt-6 flex gap-5 max-lg:justify-center">
            <Link
              className="rounded-l-full rounded-r-full bg-primary-purple px-8 py-4 text-xl font-bold text-white"
              href="#"
            >
              Book a demo
            </Link>
            <Link
              className="rounded-l-full rounded-r-full border border-primary-purple px-8 py-4 text-xl font-bold text-primary-purple"
              href="#"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center xl:flex-1">
        <div className="h-6/12 grid grid-cols-2 sm:grid-cols-3 [@media(max-width:410px)]:grid-cols-1 items-center justify-center gap-x-7 gap-y-16">
          <div className="flex h-64 w-60 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-[#FCF0D8] bg-white shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] shadow-[#AC7A2280]">
            <Image
              src="/about/why-choose-us/Icon1.svg"
              alt=""
              width={68}
              height={56}
            />
            <p className="text-center text-3xl font-medium text-[#696061]">
              Note <br /> Recognition
            </p>
          </div>
          <div className="flex h-64 w-60 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-[#FCF0D8] bg-white shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] shadow-[#AC7A2280]">
            <Image
              src="/about/why-choose-us/Icon2.svg"
              alt=""
              width={68}
              height={56}
            />
            <p className="text-center text-3xl font-medium text-[#696061]">
              Chord <br /> Recognition
            </p>
          </div>
          <div className="flex h-64 w-60 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-[#FCF0D8] bg-white shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] shadow-[#AC7A2280]">
            <Image
              src="/about/why-choose-us/Icon3.svg"
              alt=""
              width={68}
              height={56}
            />
            <p className="w-28 text-center text-3xl font-medium text-[#696061]">
              Ear <br /> Training
            </p>
          </div>
          <div className="flex h-64 w-60 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-[#FCF0D8] bg-white shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] shadow-[#AC7A2280]">
            <Image
              src="/about/why-choose-us/Icon4.svg"
              alt=""
              width={68}
              height={56}
            />
            <p className="text-center text-3xl font-medium text-[#696061]">
              Rhythm
            </p>
          </div>
          <div className="flex h-64 w-60 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-[#FCF0D8] bg-white shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] shadow-[#AC7A2280]">
            <Image
              src="/about/why-choose-us/Icon5.svg"
              alt=""
              width={68}
              height={56}
            />
            <p className="text-center text-3xl font-medium text-[#696061]">
              Intervals
            </p>
          </div>
          <div className="flex h-64 w-60 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-[#FCF0D8] bg-white shadow-[rgba(0,0,15,0.5)_2px_3px_4px_0px] shadow-[#AC7A2280]">
            <Image
              src="/about/why-choose-us/Icon6.svg"
              alt=""
              width={68}
              height={56}
            />
            <p className="text-center text-3xl font-medium text-[#696061]">
              Music <br /> Vocabulary
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
