"use client";

import { profileInterface } from "@/interfaces/profileInterface";
import { profileAtom } from "@/utils/stores";
import { Skeleton } from "@mui/material";
import { useAtomValue } from "jotai";
import Image from "next/image";

const Profile = () => {
    const profile: profileInterface = useAtomValue(profileAtom);
    console.log(profile);
    if (!profile.id) {
        return (
            <Skeleton variant="circular" width={40} height={40} />
        )
    }
    return (
        <div className="bg-[#FED2AA] p-3 rounded-full flex items-center gap-[.5vw]">
            <div className="relative h-[3vh] w-[3vh]">
                <Image src={profile.picture} fill alt="profile icon" />
            </div>
            <p className="text-2xl 3xl:text-3xl 4xl:text-4xl font-medium">{profile.fullName}</p>
        </div>
    )
}
export default Profile;