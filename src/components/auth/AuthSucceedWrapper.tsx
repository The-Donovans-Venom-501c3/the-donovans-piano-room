"use client";

import Image from "next/image";
import stars from "../../../public/auth/stars.svg";
import character from "../../../public/auth/smilingcharacter.svg";

export default function AuthSucceedWrapper({children}: {children: React.ReactNode}) {
    return (
        <div className="relative w-full max-w-[24vw] p-4 md:w-[24vw]">
            <div className="absolute top-[90px] left-[-150px] md:left-[-250px] w-[100px] h-[100px] md:w-[150px] md:h-[150px] rotate-[-8deg]">
                <Image src={character} alt="Character" layout="fill" objectFit="contain" />
                <Image src={stars} alt="Stars" layout="fill" objectFit="contain" className="mt-[70%] ml-[30%]" />
            </div>
            <div className="absolute top-[-60px] right-[-80px] md:right-[-130px] w-[100px] h-[100px] md:w-[150px] md:h-[150px] rotate-[-110deg]">
                <Image src={stars} alt="Stars" layout="fill" objectFit="contain" />
            </div>
            {children}
        </div>
    );
}
