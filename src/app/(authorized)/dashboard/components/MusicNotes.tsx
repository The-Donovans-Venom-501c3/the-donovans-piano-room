import Image from "next/image";
import Button3 from "@/components/atoms/Button3";
import Link from "next/link";
import BlurComp from "@/components/non_member/BlurComp";
import { useAtomValue } from "jotai";
import { guestUser } from "@/utils/stores";
export default function MusicNotes() {
  const guest_user = useAtomValue(guestUser);
  const displayBlank = () => (
    <div className="relative h-[24px] w-[24px] rounded-full bg-[#DDDADA] md:h-[2.5vw]  md:w-[2.5vw]" />
  );
  const displayProgress = () => (
    <div className="relative h-[24px] w-[24px] md:h-[2.5vw] md:w-[2.5vw]">
      <Image src="/dashboard/tone.svg" alt="" fill />
    </div>
  );
  function cardTile(
    toolImagePath: string = "",
    title: string = "",
    isNew: Boolean = false,
  ) {
    return (
      <div className=" flex items-center justify-between gap-[2%] text-xl font-semibold text-primary-brown 3xl:text-2xl 3xl:text-2xl 4xl:text-3xl 4xl:text-3xl">
        <div className="flex items-center">
          <div className="relative h-[3vh] w-[3vh]">
            <Image src={toolImagePath} fill alt="" />
          </div>
          <p>{title}</p>
        </div>

        {isNew && (
          <div className="flex items-center gap-[9%] rounded-xl bg-secondary-yellow p-2 pr-4">
            <div className="svg-icon">
              <div className="relative h-[2vh] w-[2vh]">
                <Image src="/dashboard/tick-vector.svg" alt="Icon" fill />
              </div>
            </div>
            <p className="text-xl 3xl:text-2xl 4xl:text-3xl">New</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className=" ml-[-3vw] h-[95vh] overflow-y-auto rounded-2xl border-2 border-white p-12 sm:w-[70%] sm:items-center  xl:w-[28vw]"
      style={{ boxShadow: "inset -1px 0px 10px 4px  #DFC9F9" }}
    >
      <h4 className="font-roboto text-3xl font-semibold text-primary-brown 3xl:text-4xl 4xl:text-5xl">
        Things you need to know (2)
      </h4>
      <div className="flex h-auto">
        <div className="relative my-[5%] flex-1 overflow-hidden rounded-2xl bg-white p-4">
          {/* Blur overlay */}
          {guest_user && (
            <BlurComp
              section={"Home"}
              className="absolute inset-0 z-10 h-full w-full rounded-2xl"
            />
          )}

          {/* Card Content */}
          <div className="relative z-20">
            {cardTile("/dashboard/bolt.svg", "Acheivements")}

            <p className="mb-4 mt-4 text-xl font-semibold text-[#3F3B3C] 3xl:text-2xl 4xl:text-3xl">
              STREAKS (3 DAY-AVG)
            </p>

            <div>
              <div className="flex justify-between">
                <div className="flex flex-col justify-center gap-4 text-center">
                  <h4 className="text-center font-roboto text-3xl font-semibold 3xl:text-4xl 4xl:text-5xl">
                    S
                  </h4>
                  {displayProgress()}
                </div>
                <div className="flex flex-col justify-center gap-4 text-center">
                  <h4 className="text-center font-roboto text-3xl font-semibold 3xl:text-4xl 4xl:text-5xl">
                    M
                  </h4>
                  {displayProgress()}
                </div>
                <div className="flex flex-col justify-center gap-4 text-center">
                  <h4 className="text-center font-roboto text-3xl font-semibold 3xl:text-4xl 4xl:text-5xl">
                    T
                  </h4>
                  {displayProgress()}
                </div>
                <div className="flex flex-col justify-center gap-4 text-center">
                  <h4 className="text-center font-roboto text-3xl font-semibold 3xl:text-4xl 4xl:text-5xl">
                    W
                  </h4>
                  {displayBlank()}
                </div>
                <div className="flex flex-col justify-center gap-4 text-center">
                  <h4 className="text-center font-roboto text-3xl font-semibold 3xl:text-4xl 4xl:text-5xl">
                    T
                  </h4>
                  {displayBlank()}
                </div>
                <div className="flex flex-col justify-center gap-4 text-center">
                  <h4 className="text-center font-roboto text-3xl font-semibold 3xl:text-4xl 4xl:text-5xl">
                    F
                  </h4>
                  {displayBlank()}
                </div>
                <div className="flex flex-col justify-center gap-4 text-center">
                  <h4 className="text-center font-roboto text-3xl font-semibold 3xl:text-4xl 4xl:text-5xl">
                    S
                  </h4>
                  {displayBlank()}
                </div>
              </div>

              <div className="my-[5%] h-1 w-full bg-[#FED2AA]"></div>

              <div className="mb-[5%]">
                <p className="text-left text-xl font-semibold text-[#3F3B3C] 3xl:text-2xl 4xl:text-3xl">
                  SCORE
                </p>
                <div className="flex justify-between">
                  <h4 className="mt-[2%] text-left font-roboto text-3xl font-semibold 3xl:text-4xl 4xl:text-5xl">
                    Your average score has increased{" "}
                    <span className="text-[#438242]">15%</span> this week
                  </h4>
                  <div className="relative h-[4vw] w-[7vw]">
                    <Image src="/dashboard/arrow.svg" alt="" fill />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white p-4">
        {/* Blur overlay */}
        {guest_user && (
          <BlurComp
            section={"Home"}
            className="absolute inset-0 z-10 h-full w-full rounded-2xl"
          />
        )}

        {/* Card Content */}
        <div className="relative z-20">
          {cardTile("/dashboard/tool-image.svg", "Music Notes", true)}

          <div className="relative mt-[2%] h-[24vh]">
            <Image
              src="/dashboard/pianoss.svg"
              alt=""
              layout="fill"
              objectFit="contain"
            />
          </div>

          <div>
            <h4 className="text-left text-3xl font-semibold text-[#59371D] 3xl:text-4xl 4xl:text-5xl">
              The Piano is now available
            </h4>
            <p className="my-[3%] font-roboto text-2xl font-normal 3xl:text-3xl 4xl:text-4xl">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </div>

          <Link className="mt-[2%]" href="/virtual-piano">
            <Button3
              text="Try it Now"
              style={{ width: "8vw", height: "5vh" }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
