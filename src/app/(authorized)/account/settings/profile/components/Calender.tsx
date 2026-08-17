import { useState } from "react";
import Image from 'next/image';
import { profileAtom } from "@/utils/stores";
import { useAtomValue } from "jotai";
import AvatarSelectPopup from "./AvatarSelectPopup";

export default function Calender({ highlightedDays }: { highlightedDays: string[] }) {
    const profile = useAtomValue(profileAtom);
    const [avatar, setAvatar] = useState(profile?.picture || "");
    const [selectingAvatar, setSelectingAvatar] = useState(false);
    
    const closeSelectingAvatar = () => {
        setSelectingAvatar(false);
    }

    return (
        <div className="w-[27%] bg-[#FFF2E5] p-6 rounded-3xl font-montserrat flex flex-col items-center h-fit">
            {selectingAvatar && (
                <AvatarSelectPopup 
                    avatar={avatar} 
                    setAvatar={setAvatar} 
                    closeSelectingAvatar={closeSelectingAvatar} 
                />
            )}
            
            {/* Upper Profile Section */}
            <div className="flex flex-col items-center text-center w-full">
                {/* Avatar Profile Picture */}
                <div className="relative flex justify-center mb-3 h-[8vh] w-[8vh]">
                    <Image 
                        src={profile?.picture || "/profile/Settings/Avatar default.svg"} 
                        fill 
                        alt="Default Profile Picture" 
                        className="rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 h-[3vh] w-[3vh] bg-white rounded-full p-1 shadow-md hover:scale-105 transition-transform cursor-pointer">
                        <Image 
                            src="/profile/Pencil.svg" 
                            fill 
                            alt="Edit Profile" 
                            onClick={() => setSelectingAvatar(true)} 
                        />
                    </div>
                </div>

                {/* Profile Name */}
                <h2 className="text-4xl 3xl:text-5xl 4xl:text-6xl text-primary-brown font-medium">
                    {profile?.fullName || ''}
                </h2>

                {/* Membership Link */}
                <a href="#" className="underline text-lg 3xl:text-xl 4xl:text-2xl text-primary-purple block mt-1">
                    Monthly Membership
                </a>
            </div>

            {/* Feature Card: Exact Font Scale & Styling Matching Left Side */}
            <div className="mt-6 w-full bg-[#FEF8EE] border border-[#FED2AA] p-6 rounded-2xl shadow-sm text-center flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FED2AA] flex items-center justify-center text-xl">
                    ✨
                </div>
                
                <h3 className="text-2xl 3xl:text-3xl 4xl:text-4xl font-semibold text-primary-brown">
                    Activity & Streaks
                </h3>

                <p className="text-primary-gray text-xl 3xl:text-2xl 4xl:text-3xl leading-relaxed">
                    Your progress story is just getting started. Track your streaks, activity, and growth — <span className="text-primary-purple font-semibold">coming soon!</span>
                </p>
            </div>
        </div>
    );
}