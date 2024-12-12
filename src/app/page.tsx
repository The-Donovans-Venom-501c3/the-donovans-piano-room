import Button1 from "@/components/atoms/Button1";
import Button2 from "@/components/atoms/Button2";
import Footer2 from "@/components/footers/Footer2";
import Navbar2 from "@/components/navbars/Navbar2";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar2 />
      <div className="flex h-[100vh] w-full items-center justify-center bg-primary-purple">
        <div className="relative z-10 flex max-sm:flex-col h-[70vh] w-[84.7%] items-center justify-between">
          <div className=" w-full sm:w-[60%] md:w-[40%]">
            <div className=" sm:w-[90%] md:w-[80%] md2:w-[70%] xl:w-[60%]">
              <h1 className="font-montserrat text-2xl font-semibold text-white sm:text-5xl md2:text-6xl lg:text-7xl 2xl:text-9xl 4xl:text-9xl max-sm:text-center">
                Ready for your music lesson?
              </h1>
              <p className="mt-[5%] text-xs text-white sm:text-base md2:text-lg lg:text-xl max-sm:text-center">
                Embark on a fun-filled musical adventure with The Donovan&apos;s
                Piano Room. Unlock the joy of music with our tailored and
                enriching music lessons!
              </p>
              <div className="mt-[10%] flex flex-col gap-[2vh]">
                <Link href="/login">
                  <Button1 text="Login"></Button1>
                </Link>
                <Link href={"/signup"}>
                  <Button2 text="Sign Up"></Button2>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative flex h-[100%] w-fit flex-col justify-center">
            <Image height={600} width={600} src="/home/map.svg" alt="" />
            <div className=" absolute bottom-10 right-5 sm:right-5 flex sm:bottom-28 md:bottom-8 md2:bottom-5 lg:bottom-0 xl:right-10">
              <Image
                className="pt-44 sm:h-[150px] sm:w-[200px]"
                height={50}
                width={150}
                src="/home/little.svg"
                alt=""
              />
              <Image
                className=" sm:h-[160px] sm:w-[160px] md2:h-[210px] md2:w-[210px]"
                height={100}
                width={100}
                src="/home/listen-music.svg"
                alt=""
              />
            </div>
          </div>
        </div>

        {/* background images*/}
        <div className="absolute left-[34vw] top-[15vh]">
          <div className="relative h-[3vw] w-[5vw]">
            <Image
              src="/background-icons/Elipse216DarkPurple.svg"
              fill
              alt=""
            />
          </div>
        </div>
        <div className="absolute left-[29vw] top-[25vh]">
          <div className="relative h-[1.5vw] w-[1.5vw]">
            <Image src="/background-icons/DarkPurpleDot.svg" alt="" fill />
          </div>
        </div>
        <div className="absolute right-0 top-0">
          <div className="relative h-[22vh] w-[15vw]">
            <Image fill src="/background-icons/RightTop1.svg" alt="" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0">
          <div className="relative h-[25vh] w-[22vw]">
            <Image
              className=""
              src="/background-icons/LeftBottom.svg"
              alt=""
              fill
            />
          </div>
        </div>
      </div>
      <Footer2 />
    </>
  );
}
