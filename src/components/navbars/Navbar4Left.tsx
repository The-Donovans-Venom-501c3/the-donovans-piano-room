"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { logout } from "@/lib/api/authService";
import { isNavOpenAtom, nav4leftLinks, profileAtom } from "@/utils/stores";
import { profileInterface } from "@/interfaces/profileInterface";

export default function Navbar4Left({
  openedLink = "",
}: {
  openedLink: string;
}) {
  const [isNavOpen, setIsNavOpen] = useAtom(isNavOpenAtom);
  const profile = useAtomValue(profileAtom) as profileInterface | null;
  const setProfile = useSetAtom(profileAtom);

  const toggleOpenNav = () => setIsNavOpen((state: boolean) => !state);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Failed to logout:", e);
    } finally {
      // 💡 Clear Jotai state
      setProfile(null);
      // 💡 Flush storages & force a history replace
      if (typeof window !== "undefined") {
        window.sessionStorage.clear();
        window.localStorage.clear();
        window.location.replace("/login");
      }
    }
  };

  const linkDynamicStyle = { justifyContent: isNavOpen ? "start" : "center" };

  const navItems = [
    {
      href: "/dashboard",
      label: "DASHBOARD",
      key: nav4leftLinks.dashboard,
      icon: "/navbar/NavBar4Left/Dashboard.svg",
      alt: "D",
      disabled: false,
    },
    {
      href: "/lessons",
      label: "LESSONS",
      key: nav4leftLinks.lessons,
      icon: "/navbar/NavBar4Left/Lessons.svg",
      alt: "L",
      disabled: false,
    },
    {
      href: "/games",
      label: "GAMES",
      key: nav4leftLinks.games,
      icon: "/navbar/NavBar4Left/Games.svg",
      alt: "G",
      disabled: false,
    },
    {
      href: "",
      label: "MUSIC TOOLS",
      key: nav4leftLinks.musicTools,
      icon: "/navbar/NavBar4Left/MusicTools.svg",
      alt: "MT",
      disabled: true,
    },
    {
      href: "",
      label: "PLANNER",
      key: nav4leftLinks.planner,
      icon: "/navbar/NavBar4Left/Planner.svg",
      alt: "P",
      disabled: true,
    },
    {
      href: "/contact-page",
      label: "CONTACT",
      key: nav4leftLinks.contactUs,
      icon: "/navbar/NavBar4Left/Contact.svg",
      alt: "C",
      disabled: false,
    },
  ];

  return (
    <div
      className="relative z-50 h-[100vh] transition-all duration-300 ease-in-out"
      style={{ width: isNavOpen ? "20vw" : "8vw" }}
    >
      {/* Top Header Section */}
      <div className="relative flex h-[12vh] w-full items-center justify-center rounded-tr-[20px] bg-[#601d86]">
        <Link 
          href="/" 
          className="flex h-full w-full items-center justify-center cursor-pointer transition-opacity hover:opacity-90"
        >
          {isNavOpen ? (
            <div className="relative h-[60%] w-[80%]">
              <Image src="/navbar/Logo2.svg" fill alt="Logo" />
            </div>
          ) : (
            <div className="relative h-[60%] w-[60%]">
              <Image src="/navbar/MiniLogo.svg" fill alt="Mini Logo" />
            </div>
          )}
        </Link>

        <div
          className={`absolute top-[6vh] z-10 cursor-pointer transition-all duration-300 ease-in-out ${
            isNavOpen ? "left-[15.5vw]" : "left-[6vw]"
          }`}
          onClick={toggleOpenNav}
        >
          <div className="relative h-[8vh] w-[3vw]">
            <Image
              src={
                isNavOpen
                  ? "/navbar/NavBar4Left/CloseButtons.svg"
                  : "/navbar/NavBar4Left/OpenButton.svg"
              }
              fill
              alt={isNavOpen ? "close" : "open"}
            />
          </div>
        </div>
      </div>

      {/* Main Sidebar Section */}
      <div className="flex h-[79vh] w-full justify-center bg-primary-purple">
        <div
          className="mt-[5vh] h-[80%]"
          style={{ width: isNavOpen ? "80%" : "50%" }}
        >
          {/* User Profile Info */}
          {profile?.id ? (
            <div className="flex flex-col items-center w-full cursor-pointer">
              <div className="relative h-[8vh] w-[8vh] shrink-0">
                <Image 
                  src={profile.picture || "/profile/Settings/Avatar%20default.svg"} 
                  fill 
                  alt="Profile Picture" 
                />
              </div>
              <p
                className="mt-[1vh] w-full font-montserrat text-4xl font-bold text-white 3xl:text-5xl 4xl:text-6xl truncate leading-normal"
                style={{ textAlign: isNavOpen ? "start" : "center" }}
              >
                {(() => {
                  const currentProfile = profile;
                  if (!currentProfile?.fullName) return "";
                  const fullName = currentProfile.fullName;
                  const hasSpace = fullName.indexOf(" ") !== -1;
                  const str =
                    fullName[0] +
                    (hasSpace
                      ? " " + fullName[fullName.indexOf(" ") + 1]
                      : "");
                  return isNavOpen ? fullName : str;
                })()}
              </p>

              <div
                className="mt-[0.5vh] flex items-center w-full h-[32px] text-xl font-bold text-white 3xl:text-2xl 4xl:text-3xl leading-none"
                style={{ justifyContent: isNavOpen ? "flex-start" : "center" }}
              >
                {isNavOpen && profile.pronouns && (
                  <span className="mr-2 leading-none">{profile.pronouns}</span>
                )}
                <Link
                  href="/account/settings/profile"
                  className="inline-block shrink-0 text-primary-yellow-accent underline leading-none transition-opacity hover:opacity-80"
                >
                  Edit
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <Skeleton variant="rectangular" width={52} height={52} />
              <Skeleton variant="rectangular" width={40} height={10} className="mt-[1vh]" />
              <Skeleton variant="rectangular" width={40} height={10} className="mt-[0.5vh]" />
            </div>
          )}

          {/* Navigation Items */}
          <div className="mt-[1vh] flex flex-col gap-[1vh]">
            {navItems.map((item) => {
              const isActive = openedLink === item.key;
              const linkContent = (
                <div
                  className={`flex h-[8vh] w-full items-center rounded-2xl border transition-all ${
                    item.disabled ? "opacity-50 cursor-not-allowed bg-white" : "cursor-pointer bg-white"
                  }`}
                  style={{
                    ...(isActive
                      ? {
                          borderColor: "white",
                          backgroundColor: "#F6E892",
                          ...linkDynamicStyle,
                        }
                      : {
                          borderColor: "#F5E8FF",
                          ...linkDynamicStyle,
                        }),
                    ...(item.disabled ? { filter: "grayscale(90%)" } : {}),
                  }}
                >
                  <div
                    className="relative h-[4vh] w-[4vh]"
                    style={isNavOpen ? { marginLeft: "1vw" } : {}}
                  >
                    <Image src={item.icon} fill alt={item.alt} />
                  </div>
                  {isNavOpen && (
                    <p className="ml-[.5vw] w-[80%] text-2xl font-semibold text-primary-purple 3xl:text-3xl 4xl:text-4xl">
                      {item.label}
                    </p>
                  )}
                  {isNavOpen && (
                    <div
                      className="float-right flex h-full w-[25%] items-center justify-center rounded-r-2xl bg-primary-yellow-accent"
                      style={isActive ? { backgroundColor: "#E9BB18" } : {}}
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
              );

              return (
                <Link
                  key={item.label}
                  href={item.disabled ? "#" : item.href}
                  className={item.disabled ? "pointer-events-none" : ""}
                >
                  {linkContent}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Section / Logout Action */}
      <div className="flex h-[9vh] w-full items-center justify-center rounded-br-[20px] bg-[#601d86]">
        <div style={{ width: isNavOpen ? "80%" : "50%" }}>
          <button
            className="flex rounded-full border border-primary-yellow-accent px-8 py-1 text-[12px] font-semibold text-primary-yellow-accent 2xl:text-2xl 4xl:text-3xl hover:bg-purple-800 transition-colors"
            onClick={handleLogout}
          >
            {isNavOpen && (
              <p className="mr-[.3vw] mt-1 text-center text-primary-yellow-accent 3xl:mt-[4px] 3xl:text-2xl 4xl:text-3xl">
                Log out
              </p>
            )}
            <div className="relative h-[3vh] w-[3vh]">
              <Image src="/navbar/Logout.svg" fill alt="Logout" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}