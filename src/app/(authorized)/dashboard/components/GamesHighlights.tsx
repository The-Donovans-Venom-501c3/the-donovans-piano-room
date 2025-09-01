import Image from "next/image";
import "./GamesHighlights.css";
import { useAtomValue } from "jotai";
import { IsNavOpenAtom, guestUser } from "@/utils/stores";
import BlurComp from "@/components/non_member/BlurComp";

export default function GamesHighlights() {
  const isNavOpen = useAtomValue(IsNavOpenAtom);
  const guest_user = useAtomValue(guestUser);
  return (
    <div
      className="h-[21vh] overflow-y-hidden rounded-2xl border border-white bg-[#F5E8FF] py-[1vw]"
      style={{
        boxShadow: "inset -1px 0px 10px 4px  #DFC9F9",
        width: isNavOpen ? "38vw" : "45vw",
      }}
    >
      <div className="ml-[1vw] flex items-center gap-[2%] text-xl font-semibold text-primary-brown 3xl:text-2xl 4xl:text-3xl">
        <div className="relative h-[2.5vh] w-[2.5vh]">
          <Image src="/dashboard/game-icon.svg" fill alt="" />
        </div>
        <p className="font-roboto text-xl font-semibold 3xl:text-2xl 4xl:text-3xl">
          Games in progress {`(${dummydata.length})`}
        </p>
      </div>
      <div className="relative ml-[2%] mt-[2.5%] flex w-[96%] justify-around gap-[5%] overflow-x-scroll pb-[.8vh]">
        {dummydata.map((game, i) => (
          <div
            key={i}
            className="group relative mt-[2.3%] flex h-[11vh] w-[24vw] cursor-pointer items-center rounded-2xl rounded-bl-[17px] rounded-br-[17px] border-2 border-b-[9px] border-[#DDB5FD] bg-white hover:border-primary-purple hover:bg-secondary-purple "
          >
            {guest_user && game.highlight !== "Play for free" && (
              // <div className="flex border-2 border-black">
              <BlurComp section={"Game"} className={`h-[100%] w-[100%]  `} />
              // </div>
            )}
            <div className="relative ml-[5%] h-[7vh] w-[7vh]">
              <Image src={game.image} fill alt="" />
            </div>
            <div className="ml-6 flex h-[6vh] w-[14vw] flex-col justify-between">
              {/* <p className="text-xl 3xl:text-2xl 4xl:text-3xl">Level: {game.level} | Score: {game.score}</p> */}
              <p className="text-2xl font-semibold text-primary-brown 3xl:text-3xl 4xl:text-4xl">
                {game.name}
              </p>

              <p className="text-xl 3xl:text-2xl 4xl:text-3xl">{game.text}</p>
            </div>
            <div className="relative w-[3vw]">
              <div className="relative mt-[3vh] hidden h-[3vh] w-[3vh] group-hover:block">
                <Image src="/dashboard/open-icon.svg" fill alt="" />
              </div>
            </div>
            <p className="absolute right-[-1vw] top-[-2vh] z-[100] rounded-2xl border-2 border-[#DDB5FD] bg-white p-2 text-xl font-medium text-black group-hover:border-primary-purple 3xl:text-2xl 4xl:text-3xl">
              {game.highlight}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const dummydata = [
  {
    name: "Chord identification",
    image: "/games/game-icon.svg",
    highlight: "Play for free",
    text: "15 times played",
  },
  {
    name: "Chord identification",
    image: "/games/game-icon.svg",
    highlight: "Best score",
    text: "10 points",
  },
  {
    name: "Scale identification",
    image: "/games/game-icon.svg",
    highlight: "Fastest played",
    text: "3:30 minutes",
  },
];
