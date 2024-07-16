import Image from "next/image";
import LinearProgress from '@mui/material/LinearProgress';
import "./GamesInProgress.css"

export default function GamesInProgress() {
  return (
<div className="w-[45vw] h-[24vh] overflow-y-hidden rounded-2xl" style={{ background: "var(--TDPM-Purple-100, #F5E8FF)", border: "2px solid var(--TDPM-White, #FFFFFF)", boxShadow: "inset 0px 0px 15px 0px #C5A5F3"}}>
            <div className="flex items-center gap-[2%] ml-[1vw] mt-[1.7vh] text-primary-brown text-xl 3xl:text-2xl 4xl:text-3xl font-semibold">
            <div className="relative h-[3vh] w-[3vh]">
                <Image src="/dashboard/game-icon.svg" fill alt=""/>
            </div>
            <p>Your game stats (3)</p>
        </div>
        <div className="relative w-[95%] overflow-x-scroll ml-[1vw] pb-[2.2vh] 3xl:pb-[3vh] 4xl:pb-[3.7vh]">

        <div className="flex mt-[2%]">
            {dummydata.map((game, i) => (
                <div key={i} className="flex bg-white h-[13vh] w-[27vw] items-center mr-[3%] cursor-pointer rounded-2xl" style={{ border: "2px solid var(--TDPM-Purple-300, #DDB5FD) ", borderBottomWidth: "12px" }}>
                <div className="relative h-[8vh] w-[8vh] ml-[5%]">
                        <Image src={game.image} fill alt=""/>
                    </div>
                    <div className="ml-6 w-[20vw]">
                       
                        <p className="text-2xl 3xl:text-3xl 4xl:text-4xl text-primary-brown font-semibold">{game.name}</p>
                        <div className="flex items-center">
                            
                            <p className="text-xl 3xl:text-2xl 4xl:text-3xl ">{game.compeleted} times played</p>
                        </div>
                    </div>
                    

                </div>
            ))}
        </div>
    </div>
    
    </div>
  )
}

const dummydata = [
    {
        name: "Chord Identification",
        image: "/dashboard/game_icon.svg",
        level: "easy",
        score: "XX",
        compeleted: 15
    },
    {
        name: "Chord Identification",
        image: "/dashboard/game_icon.svg",
        level: "easy",
        score: "XX",
        compeleted: 25
    },
    {
        name: "Scale Identification",
        image: "/dashboard/game_icon.svg",
        level: "easy",
        score: "XX",
        compeleted: 10
    },
]