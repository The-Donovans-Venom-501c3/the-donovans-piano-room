import Button3 from "@/components/atoms/Button3";
import { IsNavOpenAtom, guestUser, modalShow } from "@/utils/stores";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";
import BlurComp from "@/components/non_member/BlurComp";

export default function FirstLesson() {
  const isNavOpen = useAtomValue(IsNavOpenAtom);
  const guest_user = useAtomValue(guestUser);
  // const [showModal, setShowModal] = useAtom(modalShow);

  return (
    <>
      <div
        className="relative h-[60vh] w-[100%]  lg:w-[45vw]"
        style={isNavOpen ? { width: "38vw", height: "55vh" } : {}}
      >
        {guest_user && (
          <BlurComp section={"Home"} className={"mt-5 h-[95%] w-[100%]"} />
        )}
        <div className="absolute left-[10%] top-[10%] z-30 h-[90%] w-[80%]">
          <div className="mb-[3%] mt-[4%] flex select-none justify-between">
            <div className="flex items-center gap-[10%]">
              <span className="relative h-[3vh] w-[3vh]">
                <Image src="/dashboard/book-icon.svg" fill alt="" />
              </span>
              <p className="text-xl font-semibold text-primary-brown 3xl:text-2xl 4xl:text-3xl">
                Lessons
              </p>
            </div>
            <div className="flex items-center rounded-xl bg-[#FFEBD5] p-2">
              <span className="relative h-[2.3vh] w-[2.3vh]">
                <Image src="/dashboard/checkmark.svg" fill alt="" />
              </span>
              <p className="ml-3 text-xl font-semibold text-primary-brown 3xl:text-2xl 4xl:text-3xl">
                Every Monday and Thursday
              </p>
            </div>
          </div>
          <iframe
            className="w-[100%] sm:h-[40%] md:h-[40%] lg:h-[47%]"
            // width="560"
            // height="315"
            src="https://www.youtube.com/embed/Mwt9f9H7dsE?si=D1HT7i873D3VgQ3B"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <p className="mb-[3%] mt-[4%] text-2xl font-semibold text-primary-brown">
            Live lessons with The Donovan
          </p>
          <div className="flex h-[10%] justify-between sm:text-lg md:text-xl lg:text-2xl 3xl:text-3xl 4xl:text-4xl">
            <div>
              <p className="">Join our next live session on</p>
              <p className="font-semibold">March 18, at 2:00 pm EST.</p>
            </div>
            <Button3
              text="Add to calendar"
              style={{ width: "30%", height: "80%" }}
            />
          </div>
        </div>
        <div className="relative h-[100%]">
          <Image
            src="/dashboard/lesson-bg.svg"
            fill
            alt=""
            className="h-[100%]"
          />
        </div>
      </div>
    </>
  );
}
