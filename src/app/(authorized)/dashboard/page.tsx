"use client";
import { authorizedWrapperTitles, profile } from "@/utils/general";
import {
  guestUser,
  modalShow,
  nav4leftLinks,
  profileAtom,
} from "@/utils/stores";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import FirstLesson from "./components/FirstLesson";
import GamesHighlights from "./components/GamesHighlights";
// import MusicNotes from "./components/MusicNotes";
import CloseIcon from "@mui/icons-material/Close";
import "../../../styles/primary-purple-scrollbar.css";
import AuthorizedWrapper2 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2";
import ShowModal from "@/components/non_member/ShowModal";
import MusicNotes from "./components/MusicNotes";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [showModal, setShowModal] = useAtom(modalShow);

  const [profile, setProfile] = useAtom(profileAtom);
  const [greeting, setGreeting] = useState("");
  const searchParams = useSearchParams();
  useEffect(() => {
    const paymentPending = searchParams.get("paymentPending"); // Get the query parameter

    if (paymentPending === "true") {
      setShowModal(true); // Set showModal to true when the query parameter is "true"
    }
  }, [searchParams, setShowModal]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await fetch("/api/membership/user");
  //       console.log("data from /api/membership/user API", response.status);
  //       if (response.status === 410) {
  //         // setGuestUser(false);
  //         setGuestUser(true);
  //       } else {
  //         setGuestUser(false);
  //       }
  //       console.log("guest User: ", guestUser);
  //     } catch (e) {}
  //   })();
  // }, [setGuestUser]);

  const updateGreeting = () => {
    const currentHour = new Date().getHours();
    let newGreeting = "";

    if (currentHour >= 5 && currentHour < 12) {
      newGreeting = "Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      newGreeting = "Afternoon";
    } else {
      newGreeting = "Evening";
    }

    setGreeting(newGreeting);
  };

  useEffect(() => {
    updateGreeting();
  });
  return (
    <AuthorizedWrapper2
      pageTitle={authorizedWrapperTitles.Dashboard}
      openedLink={nav4leftLinks.dashboard}
    >
      {showModal && <ShowModal />}
      <div className="relative z-[30] mt-[1.5%] h-[75vh] w-full gap-[8%] overflow-y-auto lg:flex">
        <div className="md:w-[100%] lg:w-[60%]">
          <h1 className="montserrat text-6xl font-semibold text-primary-brown 3xl:text-7xl 4xl:text-8xl">
            {greeting ? `${greeting} ${profile.displayName}!` : ""}
          </h1>
          <p className="mt-[2%] text-3xl 3xl:text-4xl 4xl:text-5xl">
            Check out the latest stuff we have ready for you.
          </p>
          <div className="flex w-full">
            <FirstLesson />
          </div>
          <GamesHighlights />
        </div>
        <MusicNotes />
      </div>
    </AuthorizedWrapper2>
  );
}
