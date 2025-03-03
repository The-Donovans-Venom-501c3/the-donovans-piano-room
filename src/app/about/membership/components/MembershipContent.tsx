import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function MembershipContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-16">
      <h2 className="font-montserrat text-6xl font-[555] text-primary-brown 3xl:text-7xl 4xl:text-8xl">
        Enjoy unlimited access
      </h2>
      <div className=" w-full justify-items-center gap-y-10 grid grid-cols-1 sm:grid-cols-2 md2:grid-cols-3 ">
        <div className=" relative w-fit">
          <div className=" absolute flex h-[270px] w-[220px] flex-col rounded-3xl border-2 border-[#D8BCFD] bg-white p-6 lg:w-[250px]">
            <h4 className="text-[26px] font-semibold">1 Day Access</h4>
            <ul className="mt-6">
              <li className="mt-2 flex gap-6">
                <Image
                  src="/about/membership/Icon-include.svg"
                  alt="include"
                  width={15}
                  height={15}
                ></Image>
                <p className="text-[15px]">Introduction</p>
              </li>
              <li className="mt-2 flex gap-6">
                <Image
                  src="/about/membership/Icon-include.svg"
                  alt="include"
                  width={15}
                  height={15}
                ></Image>
                <p className="text-[15px]">Access to all games and lessons</p>
              </li>
              <li className="mt-2 flex gap-6">
                <Image
                  src="/about/membership/Icon-doesnt-include.svg"
                  alt="include"
                  width={15}
                  height={15}
                ></Image>
                <p className="text-[15px]">Progress tracking</p>
              </li>
              <li className="mt-2 flex gap-6">
                <Image
                  src="/about/membership/Icon-doesnt-include.svg"
                  alt="include"
                  width={15}
                  height={15}
                ></Image>
                <p className="text-[15px]">Bundled savings</p>
              </li>
            </ul>
            <Link
              className="px-auto mt-10 flex w-[100%] items-center justify-center self-center rounded-l-full rounded-r-full bg-primary-purple py-3 text-xl font-bold text-white"
              href=""
            >
              Choose plan
            </Link>
          </div>
          <div className=" h-[280px] w-[220px] rounded-3xl bg-[#D8BCFD] lg:w-[250px]"></div>
        </div>
        <div className=" relative w-fit">
          <div className=" absolute flex h-[270px] w-[220px] flex-col rounded-3xl border-2 border-[#D8BCFD] bg-white p-6 lg:w-[250px]">
            <h4 className="text-[26px] font-semibold">Monthly Access</h4>
            <ul className="mt-6">
              <li className="mt-2 flex gap-6">
                <Image
                  src="/about/membership/Icon-include.svg"
                  alt="include"
                  width={15}
                  height={15}
                ></Image>
                <p className="text-[15px]">Introduction</p>
              </li>
              <li className="mt-2 flex gap-6">
                <Image
                  src="/about/membership/Icon-include.svg"
                  alt="include"
                  width={15}
                  height={15}
                ></Image>
                <p className="text-[15px]">Access to all games and lessons</p>
              </li>
              <li className="mt-2 flex gap-6">
                <Image
                  src="/about/membership/Icon-include.svg"
                  alt="include"
                  width={15}
                  height={15}
                ></Image>
                <p className="text-[15px]">Progress tracking</p>
              </li>
              <li className="mt-2 flex gap-6">
                <Image
                  src="/about/membership/Icon-doesnt-include.svg"
                  alt="include"
                  width={15}
                  height={15}
                ></Image>
                <p className="text-[15px]">Bundled savings</p>
              </li>
            </ul>
            <Link
              className="px-auto mt-10 flex w-[100%] items-center justify-center self-center rounded-l-full rounded-r-full bg-primary-purple py-3 text-xl font-bold text-white"
              href=""
            >
              Choose plan
            </Link>
          </div>
          <div className=" h-[280px] w-[220px] rounded-3xl bg-[#D8BCFD] lg:w-[250px]"></div>
        </div>
        <div className=" relative w-fit">
          <div className=" absolute flex h-[270px] w-[220px] flex-col rounded-3xl border-2 border-[#D8BCFD] bg-white p-6 lg:w-[250px]">
            <h4 className="text-[26px] font-semibold">Yearly Access</h4>
            <ul className="mt-6">
              <li className="mt-2 flex gap-6">
                <Image
                  src="/about/membership/Icon-include.svg"
                  alt="include"
                  width={15}
                  height={15}
                ></Image>
                <p className="text-[15px]">Introduction</p>
              </li>
              <li className="mt-2 flex gap-6">
                <Image
                  src="/about/membership/Icon-include.svg"
                  alt="include"
                  width={15}
                  height={15}
                ></Image>
                <p className="text-[15px]">Access to all games and lessons</p>
              </li>
              <li className="mt-2 flex gap-6">
                <Image
                  src="/about/membership/Icon-include.svg"
                  alt="include"
                  width={15}
                  height={15}
                ></Image>
                <p className="text-[15px]">Progress tracking</p>
              </li>
              <li className="mt-2 flex gap-6">
                <Image
                  src="/about/membership/Icon-include.svg"
                  alt="include"
                  width={15}
                  height={15}
                ></Image>
                <p className="text-[15px]">Bundled savings</p>
              </li>
            </ul>
            <Link
              className="px-auto mt-10 flex w-[100%] items-center justify-center self-center rounded-l-full rounded-r-full bg-primary-purple py-3 text-xl font-bold text-white"
              href=""
            >
              Choose plan
            </Link>
          </div>
          <div className=" h-[280px] w-[220px] rounded-3xl bg-[#D8BCFD] lg:w-[250px]"></div>
        </div>
      </div>
    </div>
  );
}
