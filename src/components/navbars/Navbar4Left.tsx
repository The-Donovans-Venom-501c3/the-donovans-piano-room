import { IsNavOpenAtom, nav4leftLinks, profileAtom } from "@/utils/stores";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function Navbar4Left({openedLink=""}: {openedLink: string}) {
  const [isNavOpen, setIsNavOpen] = useAtom(IsNavOpenAtom)
  const profile = useAtomValue(profileAtom)
  const linkDynamicSyle = {justifyContent: isNavOpen ? "start" : "center"}
  const toggleOpenNav = () => setIsNavOpen(state => !state) 
  return (
    <div className="h-[100vh] relative z-50" style={{width: isNavOpen ? "20vw" : "8vw"}}>
        <div className="flex items-center justify-center bg-[#601d86] w-full h-[12vh] rounded-tr-[20px]">
            {isNavOpen ? (
              <div className="relative w-[80%] h-[60%]">
                <Image src="/navbar/Logo2.svg" fill alt=""/>
              </div>
            ): 
            <div className="relative w-[60%] h-[60%]">
                <Image src="/navbar/MiniLogo.svg" fill alt=""/>
            </div>}
            { isNavOpen ?
              (<div className="absolute left-[15.5vw] top-[6vh] cursor-pointer" onClick={toggleOpenNav}>
                <div className="relative h-[8vh] w-[3vw]">
                    <Image src="/navbar/NavBar4Left/CloseButtons.svg" fill alt="close" />
                </div>
              </div>
              ) : (
              <div className="absolute left-[6vw] top-[6vh] cursor-pointer" onClick={toggleOpenNav}>
                <div className="relative h-[8vh] w-[3vw]">
                    <Image src="/navbar/NavBar4Left/OpenButton.svg" fill alt="open" />
                </div>
              </div>
            )}
        </div>
        <div className="bg-primary-purple w-full h-[79vh] flex justify-center">
          <div className="h-[80%] mt-[5vh]" style={{width: isNavOpen ? "80%" : "50%"}}>
            <div className="relative h-[8vh] w-[8vh]">
              <Image src={profile.imageSrc} fill alt="" /> 
            </div>
            <p className="text-center text-4xl 3xl:text-5xl 4xl:text-6xl font-montserrat text-white font-bold mt-[1vh]" style={{textAlign: isNavOpen ? "start" : "center"}}>{isNavOpen ? profile.fullName : profile.fullName[0]}</p>
            <p className="text-white text-xl 3xl:text-2xl 4xl:text-3xl font-bold mt-[0.5vh]" style={{textAlign: isNavOpen ? "start" : "center"}}>{isNavOpen ? profile.pronouns :""}<Link href="/account/settings/profile" className="text-primary-yellow-accent underline" style={{marginLeft: isNavOpen ? ".5vw" : ""}}>Edit</Link></p>
            <div className="flex flex-col gap-[1vh] mt-[1vh]">
              <Link href="/dashboard">
                <div className="bg-white w-full h-[8vh] rounded-2xl border border-[#F5E8FF] flex items-center" style={openedLink === nav4leftLinks.dashboard ? {borderColor: "white", backgroundColor: "#F6E892", ...linkDynamicSyle} : linkDynamicSyle}>
                  <div className="relative h-[4vh] w-[4vh]" style={isNavOpen ? {marginLeft: "1vw"}: {}}>
                    <Image src="/navbar/NavBar4Left/Dashboard.svg" fill alt="D" />
                  </div>
                  {isNavOpen ? (<p className="text-primary-purple ml-[.5vw] w-[80%] text-2xl 3xl:text-3xl 4xl:text-4xl font-semibold">DASHBOARD</p>) : <></>}
                  {isNavOpen && (
                    <div className="float-right bg-primary-yellow-accent w-[25%] h-full rounded-r-2xl flex items-center justify-center" style={openedLink === nav4leftLinks.dashboard ? {backgroundColor: "#E9BB18"} : {}}>
                      <div className="relative h-[2vh] w-[2vh]"><Image className="rotate-[-90deg]" src="/about/FAQs/DropdownIcon.svg" fill alt=""/></div>
                    </div>
                  )}
                </div>
              </Link>
              <Link href="">
                <div className="bg-white w-full h-[8vh] rounded-2xl border border-[#F5E8FF] flex items-center" style={openedLink === nav4leftLinks.lessons ? {borderColor: "white", backgroundColor: "#F6E892", ...linkDynamicSyle} : linkDynamicSyle }>
                  <div className="relative h-[4vh] w-[4vh]" style={isNavOpen ? {marginLeft: "1vw"}: {}}>
                    <Image src="/navbar/NavBar4Left/Lessons.svg" fill alt="L" />
                  </div>
                  {isNavOpen ? (<p className="text-primary-purple ml-[.5vw] w-[80%] text-2xl 3xl:text-3xl 4xl:text-4xl font-semibold">LESSONS</p>) : <></>}
                  {isNavOpen && (
                    <div className="float-right bg-primary-yellow-accent w-[25%] h-full rounded-r-2xl flex items-center justify-center" style={openedLink === nav4leftLinks.lessons ? {backgroundColor: "#E9BB18"} : {}}>
                      <div className="relative h-[2vh] w-[2vh]"><Image className="rotate-[-90deg]" src="/about/FAQs/DropdownIcon.svg" fill alt=""/></div>
                    </div>
                  )}
                </div>
              </Link>
              <Link href="https://thedonovansmusicgames.netlify.app/">
                <div className="bg-white w-full h-[8vh] rounded-2xl border border-[#F5E8FF] flex items-center" style={openedLink === nav4leftLinks.games ? {borderColor: "white", backgroundColor: "#F6E892", ...linkDynamicSyle} : linkDynamicSyle}>
                  <div className="relative h-[4vh] w-[4vh]" style={isNavOpen ? {marginLeft: "1vw"}: {}}>
                    <Image src="/navbar/NavBar4Left/Games.svg" fill alt="G" />
                  </div>
                  {isNavOpen ? (<p className="text-primary-purple w-[80%] ml-[.5vw] text-2xl 3xl:text-3xl 4xl:text-4xl font-semibold">GAMES</p>) : <></>}
                  {isNavOpen && (
                    <div className="float-right bg-primary-yellow-accent w-[25%] h-full rounded-r-2xl flex items-center justify-center" style={openedLink === nav4leftLinks.games ? {backgroundColor: "#E9BB18"} : {}}>
                      <div className="relative h-[2vh] w-[2vh]"><Image className="rotate-[-90deg]" src="/about/FAQs/DropdownIcon.svg" fill alt=""/></div>
                    </div>
                  )}
                </div>
              </Link>
              <Link href="">
                <div className="bg-white w-full h-[8vh] rounded-2xl border border-[#F5E8FF] flex items-center" style={openedLink === nav4leftLinks.musicTools ? {borderColor: "white", backgroundColor: "#F6E892", ...linkDynamicSyle} : linkDynamicSyle}>
                  <div className="relative h-[4vh] w-[4vh]" style={isNavOpen ? {marginLeft: "1vw"}: {}}>
                    <Image src="/navbar/NavBar4Left/MusicTools.svg" fill alt="MT" />
                  </div>
                  {isNavOpen ? (<p className="text-primary-purple w-[80%] ml-[.5vw] text-2xl 3xl:text-3xl 4xl:text-4xl font-semibold">MUSIC TOOLS</p>) : <></>}
                  {isNavOpen && (
                    <div className="float-right bg-primary-yellow-accent w-[25%] h-full rounded-r-2xl flex items-center justify-center" style={openedLink === nav4leftLinks.musicTools ? {backgroundColor: "#E9BB18"} : {}}>
                      <div className="relative h-[2vh] w-[2vh]"><Image className="rotate-[-90deg]" src="/about/FAQs/DropdownIcon.svg" fill alt=""/></div>
                    </div>
                  )}
                </div>
              </Link>
              <Link href="">
                <div className="bg-white w-full h-[8vh] rounded-2xl border border-[#F5E8FF] flex items-center" style={openedLink === nav4leftLinks.planner ? {borderColor: "white", backgroundColor: "#F6E892", ...linkDynamicSyle} : linkDynamicSyle}>
                  <div className="relative h-[4vh] w-[4vh]" style={isNavOpen ? {marginLeft: "1vw"}: {}}>
                    <Image src="/navbar/NavBar4Left/Planner.svg" fill alt="P" />
                  </div>
                  {isNavOpen ? (<p className="text-primary-purple w-[80%] ml-[.5vw] text-2xl 3xl:text-3xl 4xl:text-4xl font-semibold">PLANNER</p>) : <></>}
                  {isNavOpen && (
                    <div className="float-right bg-primary-yellow-accent w-[25%] h-full rounded-r-2xl flex items-center justify-center" style={openedLink === nav4leftLinks.planner ? {backgroundColor: "#E9BB18"} : {}}>
                      <div className="relative h-[2vh] w-[2vh]"><Image className="rotate-[-90deg]" src="/about/FAQs/DropdownIcon.svg" fill alt=""/></div>
                    </div>
                  )}
                </div>
              </Link>
              <Link href="">
                <div className="bg-white w-full h-[8vh] rounded-2xl border border-[#F5E8FF] flex items-center" style={openedLink === nav4leftLinks.contactUs ? {borderColor: "white", backgroundColor: "#F6E892", ...linkDynamicSyle} : linkDynamicSyle}>
                  <div className="relative h-[4vh] w-[4vh]" style={isNavOpen ? {marginLeft: "1vw"}: {}}>
                    <Image src="/navbar/NavBar4Left/Contact.svg" fill alt="C" />
                  </div>
                  {isNavOpen ? (<p className="text-primary-purple w-[80%] ml-[.5vw] text-2xl 3xl:text-3xl 4xl:text-4xl font-semibold">CONTACT</p>) : <></>}
                  {isNavOpen && (
                    <div className="float-right bg-primary-yellow-accent w-[25%] h-full rounded-r-2xl flex items-center justify-center" style={openedLink === nav4leftLinks.contactUs ? {backgroundColor: "#E9BB18"} : {}}>
                      <div className="relative h-[2vh] w-[2vh]"><Image className="rotate-[-90deg]" src="/about/FAQs/DropdownIcon.svg" fill alt=""/></div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-[#601d86] w-full h-[9vh] rounded-br-[20px] flex items-center justify-center">
          <div style={{width: isNavOpen ? "80%" : "50%"}}>
            <button className="border border-primary-yellow-accent py-1 px-8 rounded-full text-[12px] 2xl:text-2xl 4xl:text-3xl font-semibold text-primary-yellow-accent flex">
              {isNavOpen && (
                <p className="text-primary-yellow-accent 3xl:text-2xl 4xl:text-3xl text-center mt-1 3xl:mt-[4px] mr-[.3vw]">Log out</p>
              )}
              <div className="relative h-[3vh] w-[3vh]">
                <Image src="/navbar/Logout.svg" fill alt="" />
              </div>
            </button>
          </div>
        </div>
    </div>
  )
}