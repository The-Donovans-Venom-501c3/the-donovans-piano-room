"use client";

import { authorizedWrapperTitles } from "@/utils/general";
import { nav4leftLinks, profileAtom } from "@/utils/stores";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import FirstLesson from "./components/FirstLesson";
import GamesHighlights from "./components/GamesHighlights";
import "@/styles/primary-purple-scrollbar.css";
import AuthorizedWrapper2 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2";
import { logout } from "@/lib/api/authService"; // Ensure this import points to your logout API

export default function Page() {
    const [profile, setProfile] = useAtom(profileAtom);
    const [greeting, setGreeting] = useState("");

    // 1. Intercept Back Arrow -> Logout and Redirect to /login
    useEffect(() => {
        // Push a dummy history state to trap the back button press
        window.history.pushState(null, "", window.location.href);

        const handlePopState = async () => {
            try {
                // Call server logout to clear session/cookies
                await logout();
            } catch (err) {
                console.error("Logout on back navigation failed:", err);
            } finally {
                // Clear local Jotai profile state & session storage
                setProfile(null);
                sessionStorage.clear();

                // Force hard redirect to login page
                window.location.replace("/login");
            }
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [setProfile]);

    // 2. Dynamic Greeting
    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) {
            setGreeting("Morning");
        } else if (currentHour >= 12 && currentHour < 18) {
            setGreeting("Afternoon");
        } else {
            setGreeting("Evening");
        }
    }, []);

    const nameToDisplay = profile?.displayName || profile?.fullName || "there";

    return (
        <AuthorizedWrapper2
            pageTitle={authorizedWrapperTitles.Dashboard}
            openedLink={nav4leftLinks.dashboard}
        >
            <div className="relative flex h-[75vh] mt-[1.5%] overflow-y-auto z-[30] gap-[8%]">
                <div className="w-[60%]">
                    <h1 className="text-primary-brown text-6xl 3xl:text-7xl 4xl:text-8xl font-semibold montserrat">
                        {greeting ? `${greeting} ${nameToDisplay}!` : ""}
                    </h1>
                    <p className="text-3xl 3xl:text-4xl 4xl:text-5xl mt-[2%]">
                        Check out the latest stuff we have ready for you.
                    </p>
                    <FirstLesson />
                    <GamesHighlights />
                </div>
            </div>
        </AuthorizedWrapper2>
    );
}