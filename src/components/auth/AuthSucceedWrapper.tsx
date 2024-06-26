import Image from "next/image";
export default function AuthSucceedWrapper({children}: {children: React.ReactNode}) {
    return (
        <div className="relative w-full max-w-[24vw] p-4 md:w-[24vw]">
            <div className="absolute top-[90px] left-[-150px] md:left-[-250px] w-[100px] h-[100px] md:w-[150px] md:h-[150px] rotate-[-8deg]">
                <Image src="/auth/smilingcharacter.svg" alt="Character" layout="fill" objectFit="contain" />
                <Image src="/auth/stars.svg" alt="Stars" layout="fill" objectFit="contain" className="mt-[70%] ml-[30%]" />
            </div>
            <div className="absolute top-[-60px] right-[-80px] md:right-[-130px] w-[100px] h-[100px] md:w-[150px] md:h-[150px] rotate-[-110deg]">
                <Image src="/auth/stars.svg" alt="Stars" layout="fill" objectFit="contain" />
            </div>
            {children}
        </div>
    );
}
