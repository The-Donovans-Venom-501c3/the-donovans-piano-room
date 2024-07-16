import Image from "next/image";
import LinearProgress from "@mui/material/LinearProgress";
import "./MusicNotes.css";
import Button3 from "@/components/atoms/Button3";
import Link from "next/link";
import { border, borderRadius, margin, padding } from "@mui/system";
export default function MusicNotes() {

    function cardTile(toolImagePath: string = "", title: string = "", isNew: Boolean = false) {
        return (
            <div className="flex justify-between items-center gap-[2%] width-303px height-28px text-xl font-semibold text-primary-brown 3xl:text-2xl 4xl:text-3xl ">
               <div className="flex items-center ">
                    <div className="relative h-[3vh] w-[3vh]">
                        <Image src={toolImagePath} fill alt="" />
                    </div>
                    <p>{title}</p>
               </div>
                
                {isNew && 
                    <div className="rectangular-background">
                        <div className="svg-icon">
                            <Image
                            src="/dashboard/tick-vector.svg"
                            alt="Icon"
                            width={14.67}
                            height={14}
                            />
                        </div>
                        <p>New</p>
                    </div>
                }
            </div>
            
        )
    }
        

  return (
    <div className="music-notes-container">
        <div className=" w-[260px] h-[28px] gap-2 flex">

            <div className=" w-[259px] h-[28px]">
                <h4 className="text-[#59371D] font-roboto text-[18px] font-semibold leading-28 text-left">
                Things you need to know (2)
                </h4>
            </div>

           
        </div>
      <div className="card">

      {cardTile("/dashboard/bolt.svg", "Acheivements")}
      <div className="w-[303px] h-[228px]">
<div className="w-[303px] h-[104px]">
      <div  >
      <p className="text-[12px] mt-4 mb-4 font-semibold leading-[20px] tracking-[1.5px] text-left text-[#3F3B3C]">
        STREAKS (3 DAY-AVG)     </p>

      </div>
    


<div className="w-[303px] h-[72px] flex justify-between">
  <div className="w-[36px] h-[72px] flex flex-col justify-center text-center gap-4">
  <h4 className="font-roboto text-[20px] font-semibold leading-[28px] text-center">
S</h4>
  <Image src="/dashboard/tone.svg" width={36} height={36} alt=""></Image>
  </div>
  <div className="w-[36px] h-[72px] flex flex-col justify-center text-center gap-4">
  <h4 className="font-roboto text-[20px] font-semibold leading-[28px] text-center">
M</h4>
  <Image src="/dashboard/tone.svg" width={36} height={36} alt=""></Image>
  </div>
  <div className="w-[36px] h-[72px] flex flex-col justify-center text-center gap-4">
  <h4 className="font-roboto text-[20px] font-semibold leading-[28px] text-center">
T</h4>
  <Image src="/dashboard/tone.svg" width={36} height={36} alt=""></Image>
  </div>
  <div className="w-[36px] h-[72px] flex flex-col justify-center text-center gap-4">
  <h4 className="font-roboto text-[20px] font-semibold leading-[28px] text-center">
W</h4>
  <Image src="/dashboard/blank.svg" width={36} height={36} alt=""></Image>
  </div>
  <div className="w-[36px] h-[72px] flex flex-col justify-center text-center gap-4">
  <h4 className="font-roboto text-[20px] font-semibold leading-[28px] text-center">
T</h4>
  <Image src="/dashboard/blank.svg" width={36} height={36} alt=""></Image>
  </div>
  <div className="w-[36px] h-[72px] flex flex-col justify-center text-center gap-4">
  <h4 className="font-roboto text-[20px] font-semibold leading-[28px] text-center">
F</h4>
  <Image src="/dashboard/blank.svg" width={36} height={36} alt=""></Image>
  </div>
  <div className="w-[36px] h-[72px] flex flex-col justify-center text-center gap-4">
  <h4 className="font-roboto text-[20px] font-semibold leading-[28px] text-center">
S</h4>
  <Image src="/dashboard/blank.svg" width={36} height={36} alt=""></Image>
  </div>  
    
    
</div>
</div>
<div className="w-[303px] mt-6 mb-6 ">
    <Image
      src="/dashboard/Divider.svg"
      alt="Divider"
      width={303}
      height={1}
      className="mb-4" 
      />
    </div> 
    
    <div className="w-[303px] h-[104px]">

    
    <div className="w-[303px] h-[72px]">
  <p className="text-[12px] font-semibold leading-[20px] tracking-[1.5px] text-left text-[#3F3B3C]">
    SCORE
  </p>
  <div className="w-[303px] h-[60px] flex justify-between">
    <h4 className="font-roboto text-[20px] font-semibold leading-[28px] text-left w-[235px] h-[56px] mt-[2px] opacity-1">
    Your average score has increased <span style={{ color: '#438242' }}>15%</span> this week    </h4>
    <Image
      src="/dashboard/arrow.svg"
      alt="arrow"
      width={60}
      height={60}
     
      />
  </div>
  </div>

</div>

    </div>

</div>
    <div className="card2">
      {cardTile("/dashboard/tool-image.svg", "Music Notes", true)}

      <div style={{ width: "300px", height: "200px", position: "relative" }}>
        <Image
          src="/dashboard/pianoss.svg"
          alt=""
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="width-303px height-108px gap-8px padding-10px">
        <h4 className="text-left text-[20px] font-semibold leading-[28px] text-[#59371D]">
          [Tool Name] is now available
        </h4>
        <p className="font-roboto mt-[8px] mb-[8px] text-[16px] font-normal leading-[24px] text-left">
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
        officia deserunt mollit anim id est laborum.
    </p>
      </div>
      <div>
        <Link href="/virtual-piano">
          <Button3 text="Try it Now"  style={{width: "119px", height : "40px", borderRadius : "31px", padding : "8px 24px 8px 24px"}}/>
        </Link>
      </div>
    </div>
    </div>
    
  );
}
