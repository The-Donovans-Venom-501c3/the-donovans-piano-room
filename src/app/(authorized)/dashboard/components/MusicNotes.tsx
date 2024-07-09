import Image from "next/image";
import LinearProgress from "@mui/material/LinearProgress";
import "./MusicNotes.css";
import Button3 from "@/components/atoms/Button3";
import Link from "next/link";
import { border, borderRadius, margin, padding } from "@mui/system";
export default function MusicNotes() {

    function cardTile(toolImagePath: string = "", title: string = "", isNew: Boolean = false) {
        return (
            <div className="flex justify-between items-center gap-[2%] width-303px height-28px text-xl font-semibold text-primary-brown 3xl:text-2xl 4xl:text-3xl">
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
      <div className="card">

      {cardTile("/dashboard/bolt.svg", "Acheivements")}

      <div>
      <p className="text-[12px] font-semibold leading-[20px] tracking-[1.5px] text-left text-[#3F3B3C]">
        STREAKS (3 DAY-AVG)     </p>

      </div>
    
      <div className="w-[303px] h-[72px] flex justify-center items-center">
  <h4 className="text-[20px] font-semibold leading-[28px] w-full flex justify-between">
    <span>S</span>
    <span>M</span>
    <span>T</span>
    <span>W</span>
    <span>T</span>
    <span>F</span>
    <span>S</span>
  </h4>
</div>
<div className="w-[303px]">
    <Image
      src="/dashboard/Divider.svg"
      alt="Divider"
      width={303}
      height={1}
      className="mb-4" 
      />
    </div>
    <div className="mt-4"> 
      <p className="text-[12px] font-semibold leading-[20px] tracking-[1.5px] text-left text-[#3F3B3C]">
        SCORE
      </p>
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
