"use client";

import { profileInterface } from "@/interfaces/profileInterface";
import { profileAtom } from "@/utils/stores";
import { Skeleton } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/lib/api/authService";

interface ProfileProps {
  showGreeting?: boolean;
}

export default function Profile({ showGreeting = false }: ProfileProps) {
  const profile: profileInterface | null = useAtomValue(profileAtom);
  const setProfile = useSetAtom(profileAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [profile?.picture]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Failed to logout:", e);
    } finally {
      // 1. Reset Jotai state memory immediately
      setProfile(null);

      // 2. Clear local & session storage
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();

        // 3. Force page reload to clear cached route states and redirect
        window.location.href = "/login";
      }
    }
  };

  if (!profile?.id) {
    return <Skeleton variant="circular" width={40} height={40} />;
  }

  // Extract First Name for "Hello, Name!" greeting
  const firstName =
    profile.firstName ||
    profile.displayName?.split(" ")[0] ||
    profile.fullName?.split(" ")[0] ||
    "User";

  const fullName = profile.displayName || profile.fullName || "User";

  // Generate Initials Fallback
  const initials =
    fullName
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className={`px-4 py-2 rounded-full flex items-center gap-3 cursor-pointer select-none transition-all ${
          showGreeting
            ? "bg-white text-black shadow-sm hover:bg-gray-100"
            : "bg-[#FED2AA] text-black hover:opacity-90"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {/* Avatar Circle */}
        <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-[#521C75] text-xs font-bold text-white shadow-inner">
          {!imgError && profile?.picture ? (
            <Image
              src={profile.picture}
              alt={fullName}
              fill
              className="object-cover"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="select-none leading-none">{initials}</span>
          )}
        </div>

        {/* Dynamic Name Header */}
        <p className="text-xl 3xl:text-2xl font-semibold text-black">
          {showGreeting ? `Hello, ${firstName}!` : fullName}
        </p>
      </div>

      {/* Profile Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-full min-w-[12vw] rounded-2xl bg-white shadow-xl overflow-hidden z-50 border border-gray-100">
          <button
            className="w-full text-left px-6 py-3 text-lg font-medium text-primary-purple hover:bg-[#FED2AA] transition-colors"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}