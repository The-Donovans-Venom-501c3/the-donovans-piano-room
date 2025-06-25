import { logout } from "@/lib/api/authService";
import { IsNavOpenAtom, nav4leftLinks, profileAtom } from "@/utils/stores";
import { Skeleton } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function Navbar4Left({
  openedLink = "",
}: {
  openedLink: string;
}) {
  const [isNavOpen, setIsNavOpen] = useAtom(IsNavOpenAtom);
  const profile = useAtomValue(profileAtom);
  const linkDynamicSyle = { justifyContent: isNavOpen ? "start" : "center" };
  const toggleOpenNav = () => setIsNavOpen((state) => !state);
  const handleLogout = async () => {
    const response = await logout();
    window.location.replace('/');
  }

  return (
    <div
      className="relative z-50 h-[100vh]"
      style={{ width: isNavOpen ? "20vw" : "8vw" }}
    >
      <div className="flex h-[12vh] w-full items-center justify-center rounded-tr-[20px] bg-[#601d86]">
        {isNavOpen ? (
          <div className="relative h-[60%] w-[80%]">
            <Image src="/navbar/Logo2.svg" fill alt="" />
          </div>
        ) : (
          <div className="relative h-[60%] w-[60%]">
            <Image src="/navbar/MiniLogo.svg" fill alt="" />
          </div>
        )}
        {isNavOpen ? (
          <div
            className="absolute left-[15.5vw] top-[6vh] cursor-pointer"
            onClick={toggleOpenNav}
          >
            <div className="relative h-[8vh] w-[3vw]">
              <Image
                src="/navbar/NavBar4Left/CloseButtons.svg"
                fill
                alt="close"
              />
            </div>
          </div>
        ) : (
          <div
            className="absolute left-[6vw] top-[6vh] cursor-pointer"
            onClick={toggleOpenNav}
          >
            <div className="relative h-[8vh] w-[3vw]">
              <Image src="/navbar/NavBar4Left/OpenButton.svg" fill alt="open" />
            </div>
          </div>
        )}
      </div>
      <div className="flex h-[79vh] w-full justify-center bg-primary-purple">
        <div
          className="mt-[5vh] h-[80%]"
          style={{ width: isNavOpen ? "80%" : "50%" }}
        >
          {
            profile.id ? <>
              <div className="relative h-[8vh] w-[8vh]">
                <Image src={profile.picture} fill alt="" />
              </div>
              <p
                className="mt-[1vh] text-center font-montserrat text-4xl font-bold text-white 3xl:text-5xl 4xl:text-6xl"
                style={{ textAlign: isNavOpen ? "start" : "center" }}
              >
                {
                  (() => {
                    const hasSpace = profile.fullName.indexOf(" ") !== -1;
                    const str = profile.fullName[0] + (hasSpace ? " " + profile.fullName[profile.fullName.indexOf(" ") + 1] : "");
                    return isNavOpen ? profile.fullName : str;
                  })()
                }
              </p>
              <p
                className="mt-[0.5vh] text-xl font-bold text-white 3xl:text-2xl 4xl:text-3xl"
                style={{ textAlign: isNavOpen ? "start" : "center" }}
              >
                {isNavOpen ? profile.pronouns : ""}
                <Link
                  href="/account/settings/profile"
                  className="text-primary-yellow-accent underline"
                  style={{ marginLeft: isNavOpen ? ".5vw" : "" }}
                >
                  Edit
                </Link>
              </p></> : <>
              <Skeleton variant="rectangular" width={52} height={52} />
              <Skeleton variant="rectangular" width={40} height={10} className="mt-[1vh]" />
              <Skeleton variant="rectangular" width={40} height={10} className="mt-[0.5vh]" />
            </>
          }


          <div className="mt-[1vh] flex flex-col gap-[1vh]">
            <Link href="/dashboard">
              <div
                className="flex h-[8vh] w-full items-center rounded-2xl border border-[#F5E8FF] bg-white"
                style={
                  openedLink === nav4leftLinks.dashboard
                    ? {
                      borderColor: "white",
                      backgroundColor: "#F6E892",
                      ...linkDynamicSyle,
                    }
                    : linkDynamicSyle
                }
              >
                <div
                  className="relative h-[4vh] w-[4vh]"
                  style={isNavOpen ? { marginLeft: "1vw" } : {}}
                >
                  <Image src="/navbar/NavBar4Left/Dashboard.svg" fill alt="D" />
                </div>
                {isNavOpen ? (
                  <p className="ml-[.5vw] w-[80%] text-2xl font-semibold text-primary-purple 3xl:text-3xl 4xl:text-4xl">
                    DASHBOARD
                  </p>
                ) : (
                  <></>
                )}
                {isNavOpen && (
                  <div
                    className="float-right flex h-full w-[25%] items-center justify-center rounded-r-2xl bg-primary-yellow-accent"
                    style={
                      openedLink === nav4leftLinks.dashboard
                        ? { backgroundColor: "#E9BB18" }
                        : {}
                    }
                  >
                    <div className="relative h-[2vh] w-[2vh]">
                      <Image
                        className="rotate-[-90deg]"
                        src="/about/FAQs/DropdownIcon.svg"
                        fill
                        alt=""
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
            <Link href="/lessons">
              <div
                className="flex h-[8vh] w-full items-center rounded-2xl border border-[#F5E8FF] bg-white"
                style={
                  openedLink === nav4leftLinks.lessons
                    ? {
                      borderColor: "white",
                      backgroundColor: "#F6E892",
                      ...linkDynamicSyle,
                    }
                    : linkDynamicSyle
                }
              >
                <div
                  className="relative h-[4vh] w-[4vh]"
                  style={isNavOpen ? { marginLeft: "1vw" } : {}}
                >
                  <Image src="/navbar/NavBar4Left/Lessons.svg" fill alt="L" />
                </div>
                {isNavOpen ? (
                  <p className="ml-[.5vw] w-[80%] text-2xl font-semibold text-primary-purple 3xl:text-3xl 4xl:text-4xl">
                    LESSONS
                  </p>
                ) : (
                  <></>
                )}
                {isNavOpen && (
                  <div
                    className="float-right flex h-full w-[25%] items-center justify-center rounded-r-2xl bg-primary-yellow-accent"
                    style={
                      openedLink === nav4leftLinks.lessons
                        ? { backgroundColor: "#E9BB18" }
                        : {}
                    }
                  >
                    <div className="relative h-[2vh] w-[2vh]">
                      <Image
                        className="rotate-[-90deg]"
                        src="/about/FAQs/DropdownIcon.svg"
                        fill
                        alt=""
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
            <Link href="/games">
              <div
                className="flex h-[8vh] w-full items-center rounded-2xl border border-[#F5E8FF] bg-white"
                style={
                  openedLink === nav4leftLinks.games
                    ? {
                      borderColor: "white",
                      backgroundColor: "#F6E892",
                      ...linkDynamicSyle,
                    }
                    : linkDynamicSyle
                }
              >
                <div
                  className="relative h-[4vh] w-[4vh]"
                  style={isNavOpen ? { marginLeft: "1vw" } : {}}
                >
                  <Image src="/navbar/NavBar4Left/Games.svg" fill alt="G" />
                </div>
                {isNavOpen ? (
                  <p className="ml-[.5vw] w-[80%] text-2xl font-semibold text-primary-purple 3xl:text-3xl 4xl:text-4xl">
                    GAMES
                  </p>
                ) : (
                  <></>
                )}
                {isNavOpen && (
                  <div
                    className="float-right flex h-full w-[25%] items-center justify-center rounded-r-2xl bg-primary-yellow-accent"
                    style={
                      openedLink === nav4leftLinks.games
                        ? { backgroundColor: "#E9BB18" }
                        : {}
                    }
                  >
                    <div className="relative h-[2vh] w-[2vh]">
                      <Image
                        className="rotate-[-90deg]"
                        src="/about/FAQs/DropdownIcon.svg"
                        fill
                        alt=""
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
            <Link href="">
              <div
                className="flex h-[8vh] w-full items-center rounded-2xl border border-[#F5E8FF] bg-white"
                style={
                  openedLink === nav4leftLinks.musicTools
                    ? {
                      borderColor: "white",
                      backgroundColor: "#F6E892",
                      ...linkDynamicSyle,
                    }
                    : linkDynamicSyle
                }
              >
                <div
                  className="relative h-[4vh] w-[4vh]"
                  style={isNavOpen ? { marginLeft: "1vw" } : {}}
                >
                  <Image
                    src="/navbar/NavBar4Left/MusicTools.svg"
                    fill
                    alt="MT"
                  />
                </div>
                {isNavOpen ? (
                  <p className="ml-[.5vw] w-[80%] text-2xl font-semibold text-primary-purple 3xl:text-3xl 4xl:text-4xl">
                    MUSIC TOOLS
                  </p>
                ) : (
                  <></>
                )}
                {isNavOpen && (
                  <div
                    className="float-right flex h-full w-[25%] items-center justify-center rounded-r-2xl bg-primary-yellow-accent"
                    style={
                      openedLink === nav4leftLinks.musicTools
                        ? { backgroundColor: "#E9BB18" }
                        : {}
                    }
                  >
                    <div className="relative h-[2vh] w-[2vh]">
                      <Image
                        className="rotate-[-90deg]"
                        src="/about/FAQs/DropdownIcon.svg"
                        fill
                        alt=""
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
            <Link href="">
              <div
                className="flex h-[8vh] w-full items-center rounded-2xl border border-[#F5E8FF] bg-white"
                style={
                  openedLink === nav4leftLinks.planner
                    ? {
                      borderColor: "white",
                      backgroundColor: "#F6E892",
                      ...linkDynamicSyle,
                    }
                    : linkDynamicSyle
                }
              >
                <div
                  className="relative h-[4vh] w-[4vh]"
                  style={isNavOpen ? { marginLeft: "1vw" } : {}}
                >
                  <Image src="/navbar/NavBar4Left/Planner.svg" fill alt="P" />
                </div>
                {isNavOpen ? (
                  <p className="ml-[.5vw] w-[80%] text-2xl font-semibold text-primary-purple 3xl:text-3xl 4xl:text-4xl">
                    PLANNER
                  </p>
                ) : (
                  <></>
                )}
                {isNavOpen && (
                  <div
                    className="float-right flex h-full w-[25%] items-center justify-center rounded-r-2xl bg-primary-yellow-accent"
                    style={
                      openedLink === nav4leftLinks.planner
                        ? { backgroundColor: "#E9BB18" }
                        : {}
                    }
                  >
                    <div className="relative h-[2vh] w-[2vh]">
                      <Image
                        className="rotate-[-90deg]"
                        src="/about/FAQs/DropdownIcon.svg"
                        fill
                        alt=""
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
            <Link href="/contact-page">
              <div
                className="flex h-[8vh] w-full items-center rounded-2xl border border-[#F5E8FF] bg-white"
                style={
                  openedLink === nav4leftLinks.contactUs
                    ? {
                      borderColor: "white",
                      backgroundColor: "#F6E892",
                      ...linkDynamicSyle,
                    }
                    : linkDynamicSyle
                }
              >
                <div
                  className="relative h-[4vh] w-[4vh]"
                  style={isNavOpen ? { marginLeft: "1vw" } : {}}
                >
                  <Image src="/navbar/NavBar4Left/Contact.svg" fill alt="C" />
                </div>
                {isNavOpen ? (
                  <p className="ml-[.5vw] w-[80%] text-2xl font-semibold text-primary-purple 3xl:text-3xl 4xl:text-4xl">
                    CONTACT
                  </p>
                ) : (
                  <></>
                )}
                {isNavOpen && (
                  <div
                    className="float-right flex h-full w-[25%] items-center justify-center rounded-r-2xl bg-primary-yellow-accent"
                    style={
                      openedLink === nav4leftLinks.contactUs
                        ? { backgroundColor: "#E9BB18" }
                        : {}
                    }
                  >
                    <div className="relative h-[2vh] w-[2vh]">
                      <Image
                        className="rotate-[-90deg]"
                        src="/about/FAQs/DropdownIcon.svg"
                        fill
                        alt=""
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex h-[9vh] w-full items-center justify-center rounded-br-[20px] bg-[#601d86]">
        <div style={{ width: isNavOpen ? "80%" : "50%" }}>
          <button className="flex rounded-full border border-primary-yellow-accent px-8 py-1 text-[12px] font-semibold text-primary-yellow-accent 2xl:text-2xl 4xl:text-3xl" onClick={handleLogout}>
            {isNavOpen && (
              <p className="mr-[.3vw] mt-1 text-center text-primary-yellow-accent 3xl:mt-[4px] 3xl:text-2xl 4xl:text-3xl">
                Log out
              </p>
            )}
            <div className="relative h-[3vh] w-[3vh]">
              <Image src="/navbar/Logout.svg" fill alt="" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
