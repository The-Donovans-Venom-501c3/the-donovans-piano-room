import Image from "next/image";
import "./GamesHighlights.css"
import { useAtomValue } from "jotai";
import { isNavOpenAtom } from "@/utils/stores";

export default function GamesHighlights() {
    const isNavOpen = useAtomValue(isNavOpenAtom)
  return (
    <div className="h-[21vh] bg-[#F5E8FF] border border-white overflow-y-hidden rounded-2xl py-[1vw]" style={{boxShadow: "inset -1px 0px 10px 4px  #DFC9F9", width: isNavOpen ? "38vw" :"45vw"}}>
        <div className="flex items-center gap-[2%] ml-[1vw] text-primary-brown text-xl 3xl:text-2xl 4xl:text-3xl font-semibold">
            <div className="relative h-[2.5vh] w-[2.5vh]">
                <Image src="/dashboard/game-icon.svg" fill alt=""/>
            </div>
            <p className="text-xl 3xl:text-2xl 4xl:text-3xl font-semibold font-roboto">Games in progress {`(${dummydata.length})`}</p>
        </div>
        <div className="relative flex overflow-x-scroll w-[96%] ml-[2%] mt-[2.5%] gap-[5%] pb-[.8vh] justify-around">
            {dummydata.map((game, i) => (
                <div key={i} className="group relative flex bg-white mt-[2.3%] h-[11vh] border-2 border-b-[9px] border-[#DDB5FD] hover:border-primary-purple hover:bg-secondary-purple rounded-br-[17px] rounded-bl-[17px] rounded-2xl w-[24vw] items-center cursor-pointer ">
                    <div className="relative h-[7vh] w-[7vh] ml-[5%]">
                        <Image src={game.image} fill alt=""/>
                    </div>
                    <div className="ml-6 w-[14vw] h-[6vh] flex flex-col justify-between">
                        {/* <p className="text-xl 3xl:text-2xl 4xl:text-3xl">Level: {game.level} | Score: {game.score}</p> */}
                        <p className="text-2xl 3xl:text-3xl 4xl:text-4xl text-primary-brown font-semibold">{game.name}</p>
                        
                        <p className="text-xl 3xl:text-2xl 4xl:text-3xl">{game.text}</p>
                        
                    </div>
                    <div className="relative w-[3vw]">
                        <div className="relative h-[3vh] w-[3vh] mt-[3vh] hidden group-hover:block">
                            <Image src="/dashboard/open-icon.svg" fill alt=""/>
                            
                    </div>
                    </div>
                    <p className="absolute top-[-2vh] right-[-1vw] p-2 bg-white border-2 border-[#DDB5FD] group-hover:border-primary-purple rounded-2xl text-xl 3xl:text-2xl 4xl:text-3xl font-medium text-black">{game.highlight}</p>
                </div>
            ))}
        </div>
    
    
    </div>
  )
}

const dummydata = [
    {
        name: "Chord identification",
        image: "/games/game-icon.svg",
        highlight: "Most played",
        text: "15 times played"
    },
    {
        name: "Chord identification",
        image: "/games/game-icon.svg",
        highlight: "Best score",
        text: "10 points"
    },
    {
        name: "Scale identification",  
        image: "/games/game-icon.svg",
        highlight: "Fastest played",
        text: "3:30 minutes"
    },
]