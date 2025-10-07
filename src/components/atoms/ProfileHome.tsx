"use client";

import { profileInterface } from "@/interfaces/profileInterface";
import { profileAtom } from "@/utils/stores";
import { Skeleton } from "@mui/material";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Profile = () => {
    const profile: profileInterface = useAtomValue(profileAtom);
    const router = useRouter();

    if (!profile.id) {
        return (
            <Skeleton variant="circular" width={40} height={40} />
        )
    }

    return (
        <div
            onClick={() => router.push("/dashboard")}
            className="bg-purple-200 h-[46px] mt-6 px-10 rounded-full flex items-center border border-purple-700 cursor-pointer hover:bg-purple-300 transition"
        >
            <div className="relative h-[4vh] w-[5vh] right-5">
                <Image src={profile.picture} fill alt="profile icon" className="rounded-full" />
            </div>
            <p className="text-2xl 3xl:text-3xl 4xl:text-4xl font-bold text-[#4B2A16]">{"Hello, "}{profile.firstName}{"!"}</p>
        </div>
    )
}
export default Profile;
